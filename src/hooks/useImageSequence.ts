import { useEffect, useRef, useState, useCallback } from 'react';
import { ALL_FRAMES, TOTAL_FRAMES } from '../data/frameSequences';

interface UseImageSequenceReturn {
  drawFrameToCanvas: (canvas: HTMLCanvasElement, exactFrame: number) => void;
  isLoading: boolean;
  loadProgress: number; // 0 to 100
  totalLoaded: number;
}

interface LayoutBox {
  renderWidth: number;
  renderHeight: number;
  offsetX: number;
  offsetY: number;
  isDesktop: boolean;
}

interface CachedGradients {
  key: string;
  left: CanvasGradient;
  top: CanvasGradient;
  bottom: CanvasGradient;
}

export const useImageSequence = (
  initialPreloadCount: number = 40
): UseImageSequenceReturn => {
  const imagesCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingQueueRef = useRef<Set<number>>(new Set());
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalLoaded, setTotalLoaded] = useState<number>(0);

  // Cache gradient objects across draws — they only depend on layout, not frame
  const gradientCacheRef = useRef<CachedGradients | null>(null);

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

  // Pure layout math — same box logic as before, extracted so both frames use identical positioning
  const computeLayout = useCallback((canvas: HTMLCanvasElement, img: HTMLImageElement): LayoutBox => {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const isDesktop = canvasWidth > 1080;

    let renderWidth: number;
    let renderHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (isDesktop) {
      const maxBoxWidth = canvasWidth * 0.60;
      const maxBoxHeight = canvasHeight * 0.76;

      if (maxBoxWidth / maxBoxHeight > imgRatio) {
        renderHeight = maxBoxHeight;
        renderWidth = maxBoxHeight * imgRatio;
      } else {
        renderWidth = maxBoxWidth;
        renderHeight = maxBoxWidth / imgRatio;
      }

      const rightMargin = canvasWidth * 0.035;
      offsetX = canvasWidth - renderWidth - rightMargin;
      offsetY = (canvasHeight - renderHeight) / 2;
    } else {
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

    return { renderWidth, renderHeight, offsetX, offsetY, isDesktop };
  }, []);

  // Gradients only depend on the box geometry, not on which frame is showing —
  // recompute only when that geometry actually changes (e.g. on resize).
  const getEdgeGradients = useCallback((
    ctx: CanvasRenderingContext2D,
    box: LayoutBox
  ): CachedGradients => {
    const key = `${Math.round(box.offsetX)}-${Math.round(box.offsetY)}-${Math.round(box.renderWidth)}-${Math.round(box.renderHeight)}`;
    if (gradientCacheRef.current && gradientCacheRef.current.key === key) {
      return gradientCacheRef.current;
    }

    const { offsetX, offsetY, renderWidth, renderHeight } = box;

    const left = ctx.createLinearGradient(offsetX, 0, offsetX + renderWidth * 0.22, 0);
    left.addColorStop(0, 'rgba(5, 5, 5, 1)');
    left.addColorStop(0.35, 'rgba(5, 5, 5, 0.7)');
    left.addColorStop(0.75, 'rgba(5, 5, 5, 0.25)');
    left.addColorStop(1, 'rgba(5, 5, 5, 0)');

    const top = ctx.createLinearGradient(0, offsetY, 0, offsetY + renderHeight * 0.14);
    top.addColorStop(0, 'rgba(5, 5, 5, 0.95)');
    top.addColorStop(0.5, 'rgba(5, 5, 5, 0.4)');
    top.addColorStop(1, 'rgba(5, 5, 5, 0)');

    const bottom = ctx.createLinearGradient(0, offsetY + renderHeight * 0.86, 0, offsetY + renderHeight);
    bottom.addColorStop(0, 'rgba(5, 5, 5, 0)');
    bottom.addColorStop(0.5, 'rgba(5, 5, 5, 0.4)');
    bottom.addColorStop(1, 'rgba(5, 5, 5, 0.95)');

    const cached: CachedGradients = { key, left, top, bottom };
    gradientCacheRef.current = cached;
    return cached;
  }, []);

  // Main draw entry point. `exactFrame` is now a FLOAT (e.g. 42.63), not an int.
  // We draw the two nearest integer frames and cross-fade between them based on
  // the fractional part — this is what fakes the motion blur a real video has.
  const drawFrameToCanvas = useCallback((canvas: HTMLCanvasElement, exactFrame: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, exactFrame));
    const frameA = Math.floor(clamped);
    const frameB = Math.min(frameA + 1, TOTAL_FRAMES - 1);
    const blend = clamped - frameA;

    const imgA = getClosestImage(frameA);
    const imgB = getClosestImage(frameB);

    if (!imgA || !imgA.complete || imgA.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const box = computeLayout(canvas, imgA);
    const { renderWidth, renderHeight, offsetX, offsetY, isDesktop } = box;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw base frame at full opacity
    ctx.globalAlpha = 1;
    ctx.drawImage(imgA, offsetX, offsetY, renderWidth, renderHeight);

    // Cross-fade the next frame on top, scaled by fractional position between frames
    if (imgB && imgB !== imgA && imgB.complete && imgB.naturalWidth > 0 && blend > 0.001) {
      ctx.globalAlpha = blend;
      ctx.drawImage(imgB, offsetX, offsetY, renderWidth, renderHeight);
      ctx.globalAlpha = 1;
    }

    // Edge feathering — cached, reused across frames
    if (isDesktop) {
      const grads = getEdgeGradients(ctx, box);

      ctx.fillStyle = grads.left;
      ctx.fillRect(offsetX, offsetY - 2, renderWidth * 0.22 + 2, renderHeight + 4);

      ctx.fillStyle = grads.top;
      ctx.fillRect(offsetX - 2, offsetY - 2, renderWidth + 4, renderHeight * 0.14);

      ctx.fillStyle = grads.bottom;
      ctx.fillRect(offsetX - 2, offsetY + renderHeight * 0.86, renderWidth + 4, renderHeight * 0.14 + 4);
    }

    // Preload frames around current scrub position
    const lookahead = 20;
    for (let i = 1; i <= lookahead; i++) {
      const ahead = frameA + i;
      if (ahead < TOTAL_FRAMES && !imagesCacheRef.current.has(ahead)) {
        loadFrame(ahead);
      }
      const behind = frameA - i;
      if (behind >= 0 && !imagesCacheRef.current.has(behind)) {
        loadFrame(behind);
      }
    }
  }, [getClosestImage, computeLayout, getEdgeGradients, loadFrame]);

  return {
    drawFrameToCanvas,
    isLoading,
    loadProgress,
    totalLoaded
  };
};