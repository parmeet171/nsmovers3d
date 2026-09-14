# Switching to `<video>` scrubbing

## What's in this folder

- `src/components/VideoScrollSequence.tsx` — new component, replaces
  `ScrollFrameSequence.tsx`. Positions a `<video>` element in the same
  right-anchored box your canvas used, and drives `video.currentTime`
  from GSAP ScrollTrigger's scroll progress via a persistent rAF loop
  (same pattern as the frame-blend fix, just simpler — no cross-fade
  needed because the codec already gives you real inter-frame motion).
- `src/App.tsx` — updated to use `VideoScrollSequence` instead of
  `useImageSequence` + `ScrollFrameSequence`.

## Files you can delete once this is working

- `src/hooks/useImageSequence.ts`
- `src/components/ScrollFrameSequence.tsx`
- `src/data/frameSequences.ts`
- `public/frames/` (all 1,149 JPGs — this is most of your repo size)

Keep `JourneyIndicator.tsx`, `JourneyTimeline.tsx`, `StatsBar.tsx`, etc. —
nothing else changes.

## You need to provide the actual video file

I don't have your source video or the JPG frames (they're referenced by
path in your code but weren't uploaded to me), so I can't generate
`/public/video/journey.mp4` for you. Here's how to make it yourself.

### Option 1 — you still have the original source video

Just re-encode it with scrub-friendly settings. The default export from
most editors uses a long GOP (keyframe every 2–4 seconds), which is why
seeking mid-scroll can stutter — the decoder has to walk back to the
last keyframe and decode forward every time you jump.

```bash
# H.264, keyframe every 15 frames (~0.5s at 30fps) — good balance of
# scrub responsiveness vs file size. Drop to -g 1 for perfectly smooth
# scrubbing at the cost of a much bigger file (every frame becomes a keyframe).
ffmpeg -i source.mov \
  -vf "scale=1920:-2" \
  -c:v libx264 -preset slow -crf 20 \
  -g 15 -keyint_min 15 -sc_threshold 0 \
  -movflags +faststart \
  -an \
  public/video/journey.mp4

# VP9/webm fallback (smaller, but optional — mp4/H.264 alone covers
# every browser you listed)
ffmpeg -i source.mov \
  -vf "scale=1920:-2" \
  -c:v libvpx-vp9 -b:v 0 -crf 32 \
  -g 15 \
  -an \
  public/video/journey.webm
```

`-an` strips audio (you don't need it for a scrub-driven background).
`-movflags +faststart` moves the moov atom to the front so the browser
can start playing/seeking before the whole file downloads.

### Option 2 — you only have the 1,149 JPG frames left

Since your frames are split across four folders with restarting numbers
(`split-1/ezgif-frame-001.jpg` ... `split-4/ezgif-frame-249.jpg`), first
symlink them into one sequentially-numbered folder, then encode:

```bash
mkdir -p /tmp/journey-frames
n=1
for split in public/frames/split-1 public/frames/split-2 public/frames/split-3 public/frames/split-4; do
  for f in "$split"/ezgif-frame-*.jpg; do
    printf -v padded "%04d" "$n"
    ln -s "$(realpath "$f")" "/tmp/journey-frames/frame-${padded}.jpg"
    n=$((n+1))
  done
done

ffmpeg -framerate 30 -i /tmp/journey-frames/frame-%04d.jpg \
  -vf "scale=1920:-2" \
  -c:v libx264 -preset slow -crf 20 \
  -g 15 -keyint_min 15 -sc_threshold 0 \
  -movflags +faststart \
  -pix_fmt yuv420p \
  public/video/journey.mp4
```

At 30fps and 1,149 frames that's a ~38 second clip — matches the
`TOTAL_FRAMES = 1149` in your old `frameSequences.ts`.

## Why this fixes the smoothness problem

- The codec stores real motion between frames (motion-compensated
  prediction), so scrubbing between two points looks like actual motion
  blur instead of a hard image swap.
- Seeking cost is now bounded by your GOP size (`-g 15` above), not by
  JS draw logic — the browser's own media pipeline handles decode.
- `disablePictureInPicture`, `muted`, `playsInline`, `preload="auto"`
  are all set on the `<video>` tag in the component already, which
  covers the iOS Safari quirks mentioned earlier.

## One more knob if it's still not smooth enough

If scrubbing still feels sticky after this, drop `-g 15` to `-g 6` or
even `-g 1`. Smaller GOP = faster seeks = bigger file. For a ~38s clip
at 1920px wide, `-g 1` (all-keyframe / "intra-only") is usually still a
very manageable file size and guarantees frame-perfect instant seeks —
worth trying first if smoothness matters more than file size.
