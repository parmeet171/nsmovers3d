import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TOTAL_FRAMES } from '../data/frameSequences';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFrameSequenceProps {
  onProgressUpdate: (progress: number, frameIndex: number) => void;
  drawFrameToCanvas: (canvas: HTMLCanvasElement, frameIndex: number) => void;
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
  const currentFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Resize handler ensuring canvas internal resolution matches device pixel ratio
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    // Re-draw current frame at new resolution
    drawFrameToCanvas(canvas, currentFrameRef.current);
  }, [drawFrameToCanvas]);

  // Handle Window Resize
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Initial draw when ready
  useEffect(() => {
    if (isReady && canvasRef.current) {
      drawFrameToCanvas(canvasRef.current, currentFrameRef.current);
    }
  }, [isReady, drawFrameToCanvas]);

  // Setup GSAP ScrollTrigger pinning & progress scrub
  useEffect(() => {
    if (!isReady || !containerRef.current || !canvasRef.current) return;

    const scrollContainer = document.getElementById('cinematic-scroll-track');
    if (!scrollContainer) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create ScrollTrigger tied to the scroll container
    const trigger = ScrollTrigger.create({
      trigger: scrollContainer,
      start: 'top top',
      end: 'bottom bottom',
      scrub: prefersReducedMotion ? 0 : 0.25, // Instant scrub if reduced motion is preferred
      onUpdate: (self) => {
        const progress = Math.max(0, Math.min(1, self.progress));
        const targetFrame = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(progress * (TOTAL_FRAMES - 1))
        );

        if (targetFrame !== currentFrameRef.current) {
          currentFrameRef.current = targetFrame;

          // Request frame draw on next animation frame
          if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
          }

          rafIdRef.current = requestAnimationFrame(() => {
            if (canvasRef.current) {
              drawFrameToCanvas(canvasRef.current, targetFrame);
            }
          });
        }

        // Send progress to parent for UI indicator synchronization
        onProgressUpdate(progress, targetFrame);
      }
    });

    triggerRef.current = trigger;

    // Immediately synchronize progress on mount
    const initProg = Math.max(0, Math.min(1, trigger.progress));
    onProgressUpdate(initProg, Math.floor(initProg * (TOTAL_FRAMES - 1)));

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      trigger.kill();
      triggerRef.current = null;
    };
  }, [isReady, drawFrameToCanvas, onProgressUpdate]);

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

      {/* Cinematic Vignette & Atmospheric Gradients */}
      <div className="canvas-vignette" />
      <div className="canvas-ambient-glow" />

      {/* Subtle top & bottom edge shading for perfect UI integration */}
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
