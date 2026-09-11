import { useEffect, useRef, useState, useCallback } from 'react';
import { ALL_FRAMES, TOTAL_FRAMES } from '../data/frameSequences';

interface UseImageSequenceReturn {
  currentFrame: number;
  setFrameIndex: (idx: number) => void;
  drawFrameToCanvas: (canvas: HTMLCanvasElement, frameIndex: number) => void;
  isLoading: boolean;
  loadProgress: number; // 0 to 100
  totalLoaded: number;
}

export const useImageSequence = (
  initialPreloadCount: number = 40
): UseImageSequenceReturn => {
  const imagesCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingQueueRef = useRef<Set<number>>(new Set());
  const lastDrawnFrameRef = useRef<number>(-1);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalLoaded, setTotalLoaded] = useState<number>(0);
  const currentFrameRef = useRef<number>(0);

  // Load a single frame by index
  const loadFrame = useCallback((index: number): Promise<HTMLImageElement | null> => {
    if (index < 0 || index >= TOTAL_FRAMES) return Promise.resolve(null);
    if (imagesCacheRef.current.has(index)) {
      return Promise.resolve(imagesCacheRef.current.get(index)!);
    }
    if (loadingQueueRef.current.has(index)) {
      return Promise.resolve(null);
    }

    loadingQueueRef.current.add(index);
    const url = ALL_FRAMES[index];

    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.decoding = 'async';

      img.onload = () => {
        loadingQueueRef.current.delete(index);
        imagesCacheRef.current.set(index, img);
        setTotalLoaded(imagesCacheRef.current.size);
        resolve(img);
      };

      img.onerror = () => {
        loadingQueueRef.current.delete(index);
        console.warn(`Failed to load frame ${index} from ${url}`);
        resolve(null);
      };
    });
  }, []);

  // Priority Initial Preload: load frame 0 immediately, then first batch
  useEffect(() => {
    let isCancelled = false;

    const runInitialPreload = async () => {
      // Priority 1: Load the very first frame immediately
      await loadFrame(0);
      if (isCancelled) return;
      setIsLoading(false);

      const initialIndices = Array.from({ length: initialPreloadCount }, (_, i) => i);
      const sampledIndices: number[] = [];
      for (let i = initialPreloadCount; i < TOTAL_FRAMES; i += 8) {
        sampledIndices.push(i);
      }

      const highPriorityList = [...initialIndices, ...sampledIndices.slice(0, 45)];
      let loadedCount = 1;

      const batchSize = 6;
      for (let i = 0; i < highPriorityList.length; i += batchSize) {
        if (isCancelled) return;
        const batch = highPriorityList.slice(i, i + batchSize);
        await Promise.all(batch.map((idx) => loadFrame(idx)));
        loadedCount += batch.length;
        const progress = Math.min(100, Math.round((loadedCount / highPriorityList.length) * 100));
        setLoadProgress(progress);
      }

      // Progressive background loading of all remaining frames via requestIdleCallback
      const remaining: number[] = [];
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!imagesCacheRef.current.has(i) && !loadingQueueRef.current.has(i)) {
          remaining.push(i);
        }
      }

      const loadNextRemaining = async (offset: number) => {
        if (isCancelled || offset >= remaining.length) return;
        const slice = remaining.slice(offset, offset + 6);
        await Promise.all(slice.map((idx) => loadFrame(idx)));

        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => loadNextRemaining(offset + 6));
        } else {
          setTimeout(() => loadNextRemaining(offset + 6), 20);
        }
      };

      loadNextRemaining(0);
    };

    runInitialPreload();

    return () => {
      isCancelled = true;
    };
  }, [initialPreloadCount, loadFrame]);

  // Find the closest available image (broad bidirectional search radius)
  const getClosestImage = useCallback((targetIndex: number): HTMLImageElement | null => {
    if (imagesCacheRef.current.has(targetIndex)) {
      return imagesCacheRef.current.get(targetIndex)!;
    }

    const searchRadius = 120;
    for (let delta = 1; delta <= searchRadius; delta++) {
      const prev = targetIndex - delta;
      if (prev >= 0 && imagesCacheRef.current.has(prev)) {
        return imagesCacheRef.current.get(prev)!;
      }
      const next = targetIndex + delta;
      if (next < TOTAL_FRAMES && imagesCacheRef.current.has(next)) {
        return imagesCacheRef.current.get(next)!;
      }
    }

    const firstAvailable = imagesCacheRef.current.values().next().value;
    return firstAvailable || null;
  }, []);

  // Optimized Canvas Drawing: Positions image on the RIGHT side on desktop matching reference
  const drawFrameToCanvas = useCallback((canvas: HTMLCanvasElement, frameIndex: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = getClosestImage(frameIndex);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    lastDrawnFrameRef.current = frameIndex;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const imgRatio = imgWidth / imgHeight;
    const isDesktop = canvasWidth > 1080;

    let renderWidth: number;
    let renderHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (isDesktop) {
      // Desktop: Anchored neatly on the right side (~60% max width, ~76% max height)
      const maxBoxWidth = canvasWidth * 0.60;
      const maxBoxHeight = canvasHeight * 0.76;

      if (maxBoxWidth / maxBoxHeight > imgRatio) {
        renderHeight = maxBoxHeight;
        renderWidth = maxBoxHeight * imgRatio;
      } else {
        renderWidth = maxBoxWidth;
        renderHeight = maxBoxWidth / imgRatio;
      }

      // Position toward right side with generous clearance for left text
      const rightMargin = canvasWidth * 0.035;
      offsetX = canvasWidth - renderWidth - rightMargin;
      offsetY = (canvasHeight - renderHeight) / 2;
    } else {
      // Tablet / Mobile: Centered in upper half
      const maxBoxWidth = canvasWidth * 0.94;
      const maxBoxHeight = canvasHeight * 0.48;

      if (maxBoxWidth / maxBoxHeight > imgRatio) {
        renderHeight = maxBoxHeight;
        renderWidth = maxBoxHeight * imgRatio;
      } else {
        renderWidth = maxBoxWidth;
        renderHeight = maxBoxWidth / imgRatio;
      }

      offsetX = (canvasWidth - renderWidth) / 2;
      offsetY = canvasHeight * 0.08;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // High quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the image
    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

    // Soft edge feathering so the frame blends seamlessly into ambient dark background
    if (isDesktop) {
      // Left edge blend (wide gradient feathering from deep black #050505 to transparent)
      const leftGrad = ctx.createLinearGradient(offsetX, 0, offsetX + renderWidth * 0.22, 0);
      leftGrad.addColorStop(0, 'rgba(5, 5, 5, 1)');
      leftGrad.addColorStop(0.35, 'rgba(5, 5, 5, 0.7)');
      leftGrad.addColorStop(0.75, 'rgba(5, 5, 5, 0.25)');
      leftGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');
      ctx.fillStyle = leftGrad;
      ctx.fillRect(offsetX, offsetY - 2, renderWidth * 0.22 + 2, renderHeight + 4);

      // Top edge blend
      const topGrad = ctx.createLinearGradient(0, offsetY, 0, offsetY + renderHeight * 0.14);
      topGrad.addColorStop(0, 'rgba(5, 5, 5, 0.95)');
      topGrad.addColorStop(0.5, 'rgba(5, 5, 5, 0.4)');
      topGrad.addColorStop(1, 'rgba(5, 5, 5, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(offsetX - 2, offsetY - 2, renderWidth + 4, renderHeight * 0.14);

      // Bottom edge blend
      const botGrad = ctx.createLinearGradient(0, offsetY + renderHeight * 0.86, 0, offsetY + renderHeight);
      botGrad.addColorStop(0, 'rgba(5, 5, 5, 0)');
      botGrad.addColorStop(0.5, 'rgba(5, 5, 5, 0.4)');
      botGrad.addColorStop(1, 'rgba(5, 5, 5, 0.95)');
      ctx.fillStyle = botGrad;
      ctx.fillRect(offsetX - 2, offsetY + renderHeight * 0.86, renderWidth + 4, renderHeight * 0.14 + 4);
    }

    // Dynamic lookahead & lookbehind: preload frames around current scrub position
    const lookahead = 20;
    for (let i = 1; i <= lookahead; i++) {
      const ahead = frameIndex + i;
      if (ahead < TOTAL_FRAMES && !imagesCacheRef.current.has(ahead)) {
        loadFrame(ahead);
      }
      const behind = frameIndex - i;
      if (behind >= 0 && !imagesCacheRef.current.has(behind)) {
        loadFrame(behind);
      }
    }
  }, [getClosestImage, loadFrame]);

  const setFrameIndex = useCallback((idx: number) => {
    currentFrameRef.current = Math.max(0, Math.min(TOTAL_FRAMES - 1, idx));
  }, []);

  return {
    currentFrame: currentFrameRef.current,
    setFrameIndex,
    drawFrameToCanvas,
    isLoading,
    loadProgress,
    totalLoaded
  };
};
