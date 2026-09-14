import React, { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface VideoScrollSequenceProps {
  /** Path to the primary video (H.264 mp4). Served from /public. */
  srcMp4: string;
  /** Optional VP9/webm fallback — smaller, used when the browser prefers it. */
  srcWebm?: string;
  onProgressUpdate: (progress: number) => void;
  onLoadProgress: (percent: number) => void;
  onReady: (ready: boolean) => void;
}

interface LayoutBox {
  renderWidth: number;
  renderHeight: number;
  offsetX: number;
  offsetY: number;
  isDesktop: boolean;
}

const EMPTY_BOX: LayoutBox = { renderWidth: 0, renderHeight: 0, offsetX: 0, offsetY: 0, isDesktop: true };

// Same box math as the old canvas drawer: right-anchored on desktop, centered
// upper-half on mobile. Kept identical so the visual layout doesn't shift.
function computeLayout(containerW: number, containerH: number, videoW: number, videoH: number): LayoutBox {
  const ratio = videoW / videoH;
  const isDesktop = containerW > 1080;

  let renderWidth: number;
  let renderHeight: number;
  let offsetX: number;
  let offsetY: number;

  if (isDesktop) {
    const maxBoxWidth = containerW * 0.60;
    const maxBoxHeight = containerH * 0.76;

    if (maxBoxWidth / maxBoxHeight > ratio) {
      renderHeight = maxBoxHeight;
      renderWidth = maxBoxHeight * ratio;
    } else {
      renderWidth = maxBoxWidth;
      renderHeight = maxBoxWidth / ratio;
    }

    const rightMargin = containerW * 0.035;
    offsetX = containerW - renderWidth - rightMargin;
    offsetY = (containerH - renderHeight) / 2;
  } else {
    const maxBoxWidth = containerW * 0.94;
    const maxBoxHeight = containerH * 0.48;

    if (maxBoxWidth / maxBoxHeight > ratio) {
      renderHeight = maxBoxHeight;
      renderWidth = maxBoxHeight * ratio;
    } else {
      renderWidth = maxBoxWidth;
      renderHeight = maxBoxWidth / ratio;
    }

    offsetX = (containerW - renderWidth) / 2;
    offsetY = containerH * 0.08;
  }

  return { renderWidth, renderHeight, offsetX, offsetY, isDesktop };
}

export const VideoScrollSequence: React.FC<VideoScrollSequenceProps> = ({
  srcMp4,
  srcWebm,
  onProgressUpdate,
  onLoadProgress,
  onReady
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [box, setBox] = useState<LayoutBox>(EMPTY_BOX);
  const durationRef = useRef<number>(0);
  const lastSetTimeRef = useRef<number>(-1);
  const latestProgressRef = useRef<number>(0);

  const rafIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef<boolean>(false);
  const idleTimeoutRef = useRef<number | null>(null);

  // Recompute the video's on-screen box whenever the window or video metadata changes
  const recomputeLayout = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    setBox(computeLayout(w, h, video.videoWidth, video.videoHeight));
  }, []);

  // Apply a scroll progress value to the video's currentTime.
  // Guarded so we don't issue redundant seeks (expensive on Safari).
  const applyProgress = useCallback((progress: number) => {
    const video = videoRef.current;
    if (!video || !durationRef.current) return;

    const clamped = Math.max(0, Math.min(1, progress));
    const targetTime = clamped * durationRef.current;

    // Skip micro-seeks under ~1/60s — they cost a decode with no visible benefit
    if (Math.abs(targetTime - lastSetTimeRef.current) < 1 / 60) return;

    lastSetTimeRef.current = targetTime;
    try {
      video.currentTime = targetTime;
    } catch {
      // Some browsers throw if metadata isn't ready yet — safe to ignore, next tick retries
    }
  }, []);

  const renderLoop = useCallback(() => {
    if (!isLoopRunningRef.current) return;
    applyProgress(latestProgressRef.current);
    rafIdRef.current = requestAnimationFrame(renderLoop);
  }, [applyProgress]);

  const ensureLoopRunning = useCallback(() => {
    if (!isLoopRunningRef.current) {
      isLoopRunningRef.current = true;
      rafIdRef.current = requestAnimationFrame(renderLoop);
    }
  }, [renderLoop]);

  const scheduleLoopStop = useCallback(() => {
    if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = window.setTimeout(() => {
      isLoopRunningRef.current = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      applyProgress(latestProgressRef.current);
    }, 120);
  }, [applyProgress]);

  // Video element setup: metadata, buffering progress, resize
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      durationRef.current = video.duration || 0;
      recomputeLayout();
      video.pause();
      applyProgress(latestProgressRef.current);
    };

    const handleCanPlayThrough = () => {
      onReady(true);
      onLoadProgress(100);
    };

    const handleProgress = () => {
      if (!video.duration || !video.buffered.length) return;
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const pct = Math.min(100, Math.round((bufferedEnd / video.duration) * 100));
      onLoadProgress(pct);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('progress', handleProgress);

    window.addEventListener('resize', recomputeLayout);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('progress', handleProgress);
      window.removeEventListener('resize', recomputeLayout);
    };
  }, [recomputeLayout, applyProgress, onReady, onLoadProgress]);

  // GSAP ScrollTrigger binding — identical pattern to the old frame-sequence version
  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return;

    const scrollContainer = document.getElementById('cinematic-scroll-track');
    if (!scrollContainer) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const trigger = ScrollTrigger.create({
      trigger: scrollContainer,
      start: 'top top',
      end: 'bottom bottom',
      scrub: prefersReducedMotion ? 0 : 0.25,
      onUpdate: (self) => {
        const progress = Math.max(0, Math.min(1, self.progress));
        latestProgressRef.current = progress;
        ensureLoopRunning();
        scheduleLoopStop();
        onProgressUpdate(progress);
      }
    });

    triggerRef.current = trigger;

    const initProg = Math.max(0, Math.min(1, trigger.progress));
    latestProgressRef.current = initProg;
    onProgressUpdate(initProg);
    applyProgress(initProg);

    return () => {
      isLoopRunningRef.current = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (idleTimeoutRef.current) window.clearTimeout(idleTimeoutRef.current);
      trigger.kill();
      triggerRef.current = null;
    };
  }, [ensureLoopRunning, scheduleLoopStop, applyProgress, onProgressUpdate]);

  const { renderWidth, renderHeight, offsetX, offsetY, isDesktop } = box;
  const hasBox = renderWidth > 0 && renderHeight > 0;

  return (
    <div
      ref={containerRef}
      className="cinematic-canvas-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none',
        backgroundColor: '#050505',
        overflow: 'hidden'
      }}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        style={{
          position: 'absolute',
          top: hasBox ? `${offsetY}px` : 0,
          left: hasBox ? `${offsetX}px` : 0,
          width: hasBox ? `${renderWidth}px` : '100%',
          height: hasBox ? `${renderHeight}px` : '100%',
          objectFit: 'cover',
          opacity: hasBox ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      >
        <source src={srcMp4} type="video/mp4" />
        {srcWebm && <source src={srcWebm} type="video/webm" />}
      </video>

      {/* Edge feathering — matches the old canvas gradient overlays, positioned
          against the same box so the video blends into the dark background. */}
      {hasBox && isDesktop && (
        <>
          <div
            style={{
              position: 'absolute',
              top: offsetY - 2,
              left: offsetX,
              width: renderWidth * 0.22 + 2,
              height: renderHeight + 4,
              background: 'linear-gradient(90deg, rgba(5,5,5,1) 0%, rgba(5,5,5,0.7) 35%, rgba(5,5,5,0.25) 75%, rgba(5,5,5,0) 100%)',
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: offsetY - 2,
              left: offsetX - 2,
              width: renderWidth + 4,
              height: renderHeight * 0.14,
              background: 'linear-gradient(180deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0) 100%)',
              pointerEvents: 'none'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: offsetY + renderHeight * 0.86,
              left: offsetX - 2,
              width: renderWidth + 4,
              height: renderHeight * 0.14 + 4,
              background: 'linear-gradient(0deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0) 100%)',
              pointerEvents: 'none'
            }}
          />
        </>
      )}

      <div className="canvas-vignette" />
      <div className="canvas-ambient-glow" />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '160px',
          background: 'linear-gradient(180deg, rgba(5, 5, 5, 0.75) 0%, transparent 100%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(0deg, rgba(5, 5, 5, 0.85) 0%, transparent 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
};
