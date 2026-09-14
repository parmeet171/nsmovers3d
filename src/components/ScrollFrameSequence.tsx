import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TOTAL_FRAMES } from '../data/frameSequences';

gsap.registerPlugin(ScrollTrigger);

interface ScrollFrameSequenceProps {
  onProgressUpdate: (progress: number, frameIndex: number) => void;
  drawFrameToCanvas: (canvas: HTMLCanvasElement, frameIndex: number) => void;
  isReady: boolean;
  fps?: number; // playback speed of the looping video, independent of scroll
}

export const ScrollFrameSequence: React.FC<ScrollFrameSequenceProps> = ({
  onProgressUpdate,
  drawFrameToCanvas,
  isReady,
  fps = 24
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const currentFrameRef = useRef<number>(0);
  const loopRafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const frameAccumulatorRef = useRef<number>(0);

  // Resize handler ensuring canvas internal resolution matches device pixel ratio
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    // Re-draw whatever frame the loop is currently on, at the new resolution
    drawFrameToCanvas(canvas, currentFrameRef.current);
  }, [drawFrameToCanvas]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Initial draw when assets are ready
  useEffect(() => {
    if (isReady && canvasRef.current) {
      drawFrameToCanvas(canvasRef.current, currentFrameRef.current);
    }
  }, [isReady, drawFrameToCanvas]);

  // ── Autonomous looping playback of the frame sequence ──
  // This runs on its own clock and no longer reacts to scroll at all.
  useEffect(() => {
    if (!isReady) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Respect accessibility preference: hold on a single static frame
      if (canvasRef.current) {
        drawFrameToCanvas(canvasRef.current, currentFrameRef.current);
      }
      return;
    }

    const msPerFrame = 1000 / fps;
    lastTimeRef.current = null;
    frameAccumulatorRef.current = 0;

    const step = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;
      frameAccumulatorRef.current += delta;

      while (frameAccumulatorRef.current >= msPerFrame) {
        frameAccumulatorRef.current -= msPerFrame;
        currentFrameRef.current = (currentFrameRef.current + 1) % TOTAL_FRAMES;
      }

      if (canvasRef.current) {
        drawFrameToCanvas(canvasRef.current, currentFrameRef.current);
      }

      loopRafIdRef.current = requestAnimationFrame(step);
    };

    loopRafIdRef.current = requestAnimationFrame(step);

    return () => {
      if (loopRafIdRef.current) {
        cancelAnimationFrame(loopRafIdRef.current);
        loopRafIdRef.current = null;
      }
      lastTimeRef.current = null;
    };
  }, [isReady, drawFrameToCanvas, fps]);

  // ── Scroll tracking only (drives the left-side text + journey dots) ──
  // No longer touches the canvas at all.
  useEffect(() => {
    if (!isReady || !containerRef.current) return;

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
        const targetFrame = Math.min(
          TOTAL_FRAMES - 1,
          Math.floor(progress * (TOTAL_FRAMES - 1))
        );
        onProgressUpdate(progress, targetFrame);
      }
    });

    triggerRef.current = trigger;

    const initProg = Math.max(0, Math.min(1, trigger.progress));
    onProgressUpdate(initProg, Math.floor(initProg * (TOTAL_FRAMES - 1)));

    return () => {
      trigger.kill();
      triggerRef.current = null;
    };
  }, [isReady, onProgressUpdate]);

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