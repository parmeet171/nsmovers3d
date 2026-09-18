import React, { useEffect, useRef, useCallback, useState } from 'react';

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

// Same box math as before: right-anchored on desktop, centered upper-half on
// mobile. Kept identical so the visual layout doesn't shift.
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

  const [box, setBox] = useState<LayoutBox>(EMPTY_BOX);

  // Recompute the video's on-screen box whenever the window or video metadata changes
  const recomputeLayout = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    setBox(computeLayout(w, h, video.videoWidth, video.videoHeight));
  }, []);

  // The video is the source of truth for the cinematic timeline.
  // Text progress follows the video's actual playback time, so the user
  // does not need to scroll to advance the story.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let nextSectionRequested = false;
    let cinematicVisible = false;
    let hasEnteredCinematic = false;
    let completed = false;

    const playFromSavedPosition = () => {
      if (completed || video.ended) {
        // A completed journey is a fresh journey the next time the user
        // returns to this section.
        video.currentTime = 0;
        completed = false;
      }

      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Autoplay may be blocked until the first user interaction.
        });
      }
    };

    const scrollToNextSection = () => {
      if (nextSectionRequested) return;

      const nextSection = document.getElementById('services');
      if (!nextSection) return;

      nextSectionRequested = true;

      // Keep the currentTime intact. If the user comes back before the
      // journey has finished, playback will resume from exactly this point.
      video.pause();

      // Give the current frame a moment to settle before handing the page
      // over to the next section.
      window.setTimeout(() => {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 40);
    };

    const handleLoadedMetadata = () => {
      recomputeLayout();
      video.loop = false;
      video.currentTime = 0;
      completed = false;

      // Playback is also controlled by the IntersectionObserver below, but
      // starting here keeps the first frame responsive while the observer
      // initializes.
      playFromSavedPosition();
    };

    const handleTimeUpdate = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      const progress = Math.max(0, Math.min(1, video.currentTime / video.duration));
      onProgressUpdate(progress);
    };

    const handleEnded = () => {
      completed = true;
      onProgressUpdate(1);
      scrollToNextSection();
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

    // The cinematic section owns playback only while it is actually visible.
    // Leaving early pauses the video without changing currentTime, so returning
    // to the section resumes from the exact frame where the user left.
    const cinematicTrack = document.getElementById('cinematic-scroll-track');

    const observer = cinematicTrack
      ? new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (!entry) return;

            cinematicVisible = entry.isIntersecting && entry.intersectionRatio > 0.15;

            if (cinematicVisible) {
              if (!hasEnteredCinematic) {
                hasEnteredCinematic = true;
                nextSectionRequested = false;
              } else {
                // Returning after a completed journey starts the cinematic
                // from the beginning. Returning after an interrupted journey
                // preserves currentTime.
                nextSectionRequested = false;
              }

              playFromSavedPosition();
            } else if (hasEnteredCinematic && !video.ended) {
              video.pause();
            }
          },
          { threshold: [0, 0.15, 0.5, 1] }
        )
      : null;

    if (observer && cinematicTrack) {
      observer.observe(cinematicTrack);
    }

    // Any intentional user scroll while the cinematic is visible immediately
    // hands control to the next section. If the section is not visible, these
    // handlers do nothing, so normal page scrolling is unaffected.
    const handleWheel = (event: WheelEvent) => {
      // Only a downward scroll should advance past the cinematic.
      // Upward scrolling must remain a normal page-navigation action so the
      // user can return to the animation without being pushed forward again.
      if (!cinematicVisible || nextSectionRequested || video.ended || video.paused) return;
      if (event.deltaY <= 1) return;

      event.preventDefault();
      scrollToNextSection();
    };

    let lastTouchY: number | null = null;

    const handleTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!cinematicVisible || nextSectionRequested || video.ended || video.paused) return;

      const currentY = event.touches[0]?.clientY;
      if (currentY == null || lastTouchY == null) return;

      // Finger moving upward means page scrolling downward.
      const deltaY = lastTouchY - currentY;
      lastTouchY = currentY;

      if (deltaY <= 1) return;

      event.preventDefault();
      scrollToNextSection();
    };

    const handleTouchEnd = () => {
      lastTouchY = null;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!cinematicVisible || nextSectionRequested || video.ended || video.paused) return;

      const scrollKeys = ['ArrowDown', 'PageDown', ' ', 'End'];
      if (!scrollKeys.includes(event.key)) return;

      event.preventDefault();
      scrollToNextSection();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('progress', handleProgress);

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    window.addEventListener('resize', recomputeLayout);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('progress', handleProgress);

      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
      window.removeEventListener('touchend', handleTouchEnd, { capture: true });
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
      window.removeEventListener('resize', recomputeLayout);
      observer?.disconnect();
    };
  }, [recomputeLayout, onProgressUpdate, onReady, onLoadProgress]);

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
        autoPlay
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
