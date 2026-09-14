import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TOTAL_FRAMES } from '../data/frameSequences';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFrameSequenceProps {
  onProgressUpdate: (progress: number, frameIndex: number) => void;
  drawFrameToCanvas: (canvas: HTMLCanvasElement, exactFrame: number) => void;
  isReady: boolean;
}

export const ScrollFrameSequence: React.FC<ScrollFrameSequenceProps> = ({
  onProgressUpdate,
  drawFrameToCanvas,
  isReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  // Latest smoothed scroll progress (0-1), read continuously by the render loop
  const latestProgressRef = useRef<number>(0);

  // Persistent rAF loop plumbing — draws every animation frame while scrubbing,
  // instead of only when the integer frame index changes.
  const rafIdRef = useRef<number | null>(null);
  const isLoopRunningRef = useRef<boolean>(false);
  const idleTimeoutRef = useRef<number | null>(null);

  const exactFrameFromProgress = (progress: number) => progress * (TOTAL_FRAMES - 1);

  const renderLoop = useCallback(() => {
    if (!isLoopRunningRef.current) return;
    const canvas = canvasRef.current;
    if (canvas) {
      drawFrameToCanvas(canvas, exactFrameFromProgress(latestProgressRef.current));
    }
    rafIdRef.current = requestAnimationFrame(renderLoop);
  }, [drawFrameToCanvas]);

  const ensureLoopRunning = useCallback(() => {
    if (!isLoopRunningRef.current) {
      isLoopRunningRef.current = true;
      rafIdRef.current = requestAnimationFrame(renderLoop);
    }
  }, [renderLoop]);

  // Stop the loop shortly after scroll input stops, then do one final precise draw.
  // Avoids burning rAF cycles forever while the page sits idle.
  const scheduleLoopStop = useCallback(() => {
    if (idleTimeoutRef.current) {
      window.clearTimeout(idleTimeoutRef.current);
    }
    idleTimeoutRef.current = window.setTimeout(() => {
      isLoopRunningRef.current = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      const canvas = canvasRef.current;
      if (canvas) {
        drawFrameToCanvas(canvas, exactFrameFromProgress(latestProgressRef.current));
      }
    }, 120);
  }, [drawFrameToCanvas]);

  // Resize handler ensuring canvas internal resolution matches device pixel ratio
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    drawFrameToCanvas(canvas, exactFrameFromProgress(latestProgressRef.current));
  }, [drawFrameToCanvas]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Initial draw when ready
  useEffect(() => {
    if (isReady && canvasRef.current) {
      drawFrameToCanvas(canvasRef.current, exactFrameFromProgress(latestProgressRef.current));
    }
  }, [isReady, drawFrameToCanvas]);

  // Setup GSAP ScrollTrigger pinning & progress scrub
  useEffect(() => {
    if (!isReady || !containerRef.current || !canvasRef.current) return;

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

        // Keep the continuous render loop alive while scroll updates are coming in
        ensureLoopRunning();
        scheduleLoopStop();

        const targetFrame = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(progress * (TOTAL_FRAMES - 1))
        );
        onProgressUpdate(progress, targetFrame);
      }
    });

    triggerRef.current = trigger;

    const initProg = Math.max(0, Math.min(1, trigger.progress));
    latestProgressRef.current = initProg;
    onProgressUpdate(initProg, Math.floor(initProg * (TOTAL_FRAMES - 1)));
    // Draw the initial frame once even if the loop never starts (no scroll yet)
    if (canvasRef.current) {
      drawFrameToCanvas(canvasRef.current, exactFrameFromProgress(initProg));
    }

    return () => {
      isLoopRunningRef.current = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (idleTimeoutRef.current) {
        window.clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = null;
      }
      trigger.kill();
      triggerRef.current = null;
    };
  }, [isReady, drawFrameToCanvas, onProgressUpdate, ensureLoopRunning, scheduleLoopStop]);

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
      <canvas
        ref={canvasRef}
        className="cinematic-canvas"
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />

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