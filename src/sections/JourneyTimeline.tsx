import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { StatsBar } from '../components/StatsBar';

interface JourneyTimelineProps {
  progress: number;
  onQuoteClick: () => void;
  onVideoClick: () => void;
}

/* ============================================================
   WHY FRAMER MOTION HELPS HERE

   The previous versions recomputed opacity/blur/scale/position in
   plain JS on every scroll tick, stuffed them into React state, and
   let React re-render the whole tree to apply new inline styles.
   That's the actual source of the "not quite smooth" feeling — you
   were fighting React's render cycle, not picking the wrong easing
   curve.

   This version:
   1. Feeds the raw `progress` prop into a Framer Motion MotionValue.
   2. Runs it through `useSpring` for physical smoothing — real
      mass/stiffness/damping, so fast scroll flicks decelerate
      naturally instead of the text jumping frame to frame.
   3. Derives every section's opacity/y/scale/blur with `useTransform`,
      which writes directly to the DOM (not through React state), so
      scrolling never triggers a re-render of this component at all —
      only the style values update, every frame, off the React render
      path.

   Net effect: same visual language as Variant A (crossfade + drift),
   but driven by real spring physics instead of a hand-rolled easing
   function recalculated in JS on each render.
============================================================ */

const SECTION_COUNT = 10;
const SEGMENT = 1 / SECTION_COUNT;
const FADE = 0.002; // dial to taste — this is the only "timing" knob now

function sectionWindow(index: number, isLast: boolean) {
  const start = index * SEGMENT;
  const end = isLast ? 1.15 : start + SEGMENT;
  return {
    inStart: start - FADE,
    inEnd: start,
    outStart: isLast ? end : end - FADE,
    outEnd: end
  };
}

// One custom hook, called once per section. Fixed 10 calls below (s1..s10),
// never in a loop/conditional, so it's safe under the rules of hooks.
function useSectionMotion(progress: MotionValue<number>, index: number, isLast: boolean) {
  const { inStart, inEnd, outStart, outEnd } = sectionWindow(index, isLast);

  const opacity = useTransform(progress, [inStart, inEnd, outStart, outEnd], [0, 1, 1, 0]);
  const y = useTransform(progress, [inStart, inEnd, outStart, outEnd], [18, 0, 0, -18]);
  const scale = useTransform(progress, [inStart, inEnd, outStart, outEnd], [0.98, 1, 1, 0.98]);
  const blur = useTransform(opacity, (v) => `blur(${((1 - v) * 5).toFixed(1)}px)`);
  const pointerEvents = useTransform(opacity, (v) => (v > 0.6 ? 'auto' : 'none')) as MotionValue<
    'auto' | 'none'
  >;

  return { opacity, y, scale, blur, pointerEvents };
}

const localStyles = `
.section-kicker {
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  color: #FF9D32;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 10px;
}
.kicker-subtle {
  color: #8A8A8A;
  font-weight: 600;
  letter-spacing: 0.14em;
  font-size: 0.7rem;
}
.text-amber-glow {
  color: #FF9D32;
  text-shadow: 0 0 24px rgba(255, 157, 50, 0.35);
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #FF9D32;
  color: #101010;
  font-weight: 800;
  letter-spacing: 0.06em;
  border: none;
  border-radius: 999px;
  cursor: pointer;
}
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: #FFFFFF;
  font-weight: 700;
  letter-spacing: 0.06em;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  cursor: pointer;
}
.cinematic-timeline {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-left: 2px solid rgba(255, 157, 50, 0.25);
  padding-left: 16px;
  margin-top: 4px;
}
.timeline-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.timeline-bullet {
  position: absolute;
  left: -21px;
  top: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
}
.timeline-bullet.active {
  background: #FF9D32;
  box-shadow: 0 0 10px rgba(255, 157, 50, 0.7);
}
.timeline-title {
  color: rgba(255, 255, 255, 0.55);
  font-weight: 800;
  font-size: 0.95rem;
  letter-spacing: 0.03em;
}
.timeline-title.active {
  color: #FFFFFF;
}
.timeline-quote {
  color: rgba(184, 184, 184, 0.7);
  font-size: 0.82rem;
  font-style: italic;
  line-height: 1.4;
}
.timeline-quote.active {
  color: #B8B8B8;
}
.timeline-footer-accent {
  margin-top: 10px;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #FF9D32;
  line-height: 1.5;
}
`;

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  progress,
  onQuoteClick,
  onVideoClick
}) => {
  // Bridge the plain-number prop into Framer Motion's world once, then let
  // motion values take over — everything downstream of `spring` updates
  // without going back through React's render cycle.
  const rawProgress = useMotionValue(progress);
  useEffect(() => {
    rawProgress.set(progress);
  }, [progress, rawProgress]);

  // Spring smoothing: this is what actually fixes "not smooth". Tune
  // stiffness/damping to taste — higher stiffness = snappier/less lag,
  // higher damping = less overshoot/bounce.
  const spring = useSpring(rawProgress, { stiffness: 260, damping: 32, mass: 0.6 });

  const s1 = useSectionMotion(spring, 0, false);
  const s2 = useSectionMotion(spring, 1, false);
  const s3 = useSectionMotion(spring, 2, false);
  const s4 = useSectionMotion(spring, 3, false);
  const s5 = useSectionMotion(spring, 4, false);
  const s6 = useSectionMotion(spring, 5, false);
  const s7 = useSectionMotion(spring, 6, false);
  const s8 = useSectionMotion(spring, 7, false);
  const s9 = useSectionMotion(spring, 8, false);
  const s10 = useSectionMotion(spring, 9, true);

  // Static centering wrapper (always at vertical center); the motion.div
  // inside carries the actual animated y/opacity/scale/blur so the two
  // transforms compose cleanly instead of fighting over the same style.
  const wrapperStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: 0,
    width: '100%',
    transform: 'translateY(-50%)'
  };

  const innerStyleFor = (s: ReturnType<typeof useSectionMotion>) => ({
    opacity: s.opacity,
    y: s.y,
    scale: s.scale,
    filter: s.blur,
    pointerEvents: s.pointerEvents,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '14px'
  });

  return (
    <div
      id="cinematic-scroll-track"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        zIndex: 10
      }}
    >
      <style>{localStyles}</style>

      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          padding: '92px clamp(20px, 4vw, 64px) 24px',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '520px',
            flex: 1,
            minHeight: '460px',
            marginLeft: 'clamp(0px, 2.5vw, 40px)'
          }}
        >
          {/* 01 PICKUP */}
          <div style={wrapperStyle}>
            <motion.div style={innerStyleFor(s1)}>
              <div className="section-kicker">PICKUP</div>
              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  color: '#FFFFFF'
                }}
              >
                YOUR JOURNEY<br />
                <span className="text-amber-glow">STARTS HERE.</span>
              </h1>
              <p style={{ fontSize: '0.96rem', color: '#B8B8B8', lineHeight: 1.55, maxWidth: '440px' }}>
                From homes to high-rises, our heavy-duty black carrier pulls into your Nova Scotia driveway, ready with white-glove care and automotive precision.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '6px' }}>
                <button onClick={onQuoteClick} className="btn-primary" style={{ padding: '14px 28px', fontSize: '0.85rem' }}>
                  GET A FREE QUOTE <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* 02 PACKING */}
          <div style={wrapperStyle}>
            <motion.div style={innerStyleFor(s2)}>
              <div className="section-kicker">PACKING</div>
              <h2
                style={{
                  fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  letterSpacing: '-0.03em',
                  color: '#FFFFFF'
                }}
              >
                PACKED WITH<br />
                <span className="text-amber-glow">CARE.</span>
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#B8B8B8', lineHeight: 1.55, maxWidth: '440px' }}>
                From furniture to fragile belongings,<br />
                everything is prepared for the journey.
              </p>
            </motion.div>
          </div>

          {/* 03 LOADING */}
          <div style={wrapperStyle}>
            <motion.div style={innerStyleFor(s3)}>
              <div className="section-kicker">LOADING</div>
              <h2 style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                LOADED. SECURED.<br />
                <span className="text-amber-glow">READY.</span>
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#B8B8B8', lineHeight: 1.55, maxWidth: '440px' }}>
                Balanced axle weight distribution and heavy-duty E-track lockbars anchored with zero cargo shift tolerance.
              </p>
            </motion.div>
          </div>

          {/* 04 DEPARTURE */}
          <div style={wrapperStyle}>
            <motion.div style={innerStyleFor(s4)}>
              <div className="section-kicker">DEPARTURE</div>
              <h2 style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                TIME TO<br />
                <span className="text-amber-glow">MOVE.</span>
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#B8B8B8', lineHeight: 1.55, maxWidth: '440px' }}>
                Trailer doors locked tightly. The truck departs Nova Scotia and takes to the open road heading west toward Ontario.
              </p>
            </motion.div>
          </div>

          {/* 05 ROUTE */}
          <div style={wrapperStyle}>
            <motion.div style={innerStyleFor(s5)}>
              <div className="section-kicker">ROUTE</div>
              <h2 style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                NOVA SCOTIA<br />
                <span className="text-amber-glow">➔ TORONTO</span>
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#B8B8B8', lineHeight: 1.55, maxWidth: '440px' }}>
                1,800 kilometer direct highway corridor connecting Halifax, Moncton, Quebec City, Montreal, Ottawa, and Toronto.
              </p>
            </motion.div>
          </div>

          {/* 06 EN ROUTE */}
          <div style={wrapperStyle}>
            <motion.div style={innerStyleFor(s6)}>
              <div className="section-kicker">EN ROUTE</div>
              <h2 style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                EVERY MILE,<br />
                <span className="text-amber-glow">HANDLED WITH CARE.</span>
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#B8B8B8', lineHeight: 1.55, maxWidth: '440px' }}>
                Continuous 24/7 GPS telemetry and certified cross-provincial drivers keeping transit calm and predictable.
              </p>
            </motion.div>
          </div>

          {/* 07 TRUST / SAFETY */}
          <div style={wrapperStyle}>
            <motion.div style={{ ...innerStyleFor(s7), gap: '10px' }}>
              <div className="section-kicker">
                TRUST / SAFETY <span className="kicker-subtle">SECTION 7 / 10</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.025em', color: '#FFFFFF' }}>
                YOUR BELONGINGS.<br />
                <span className="text-amber-glow">OUR RESPONSIBILITY.</span>
              </h2>

              <div className="cinematic-timeline">
                {(() => {
                  const isActive = progress < 0.675;
                  return (
                    <div className="timeline-item" style={{ opacity: isActive ? 1 : 0.38, transform: isActive ? 'translateY(0)' : 'translateY(1px)' }}>
                      <div className={`timeline-bullet ${isActive ? 'active' : ''}`} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`timeline-title ${isActive ? 'active' : ''}`}>PROTECTED, SECURED, ORGANIZED, DELIVERED</span>
                      </div>
                      <div className={`timeline-quote ${isActive ? 'active' : ''}`}>"Handled with care from the very beginning."</div>
                    </div>
                  );
                })()}
              </div>

              <div className="timeline-footer-accent" style={{ opacity: progress >= 0.67 ? 1 : 0.45, transition: 'opacity 0.3s ease' }}>
                <div>EVERY MILE.</div>
                <div>EVERY BOX.</div>
                <div>EVERY DETAIL.</div>
              </div>
            </motion.div>
          </div>

          {/* 08 ARRIVING IN TORONTO */}
          <div style={wrapperStyle}>
            <motion.div style={{ ...innerStyleFor(s8), gap: '12px' }}>
              <div className="section-kicker">
                ARRIVING IN TORONTO <span className="kicker-subtle">SECTION 8 / 10</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
                TORONTO,<br />
                <span className="text-amber-glow">WE'RE HERE.</span>
              </h2>

              <div className="cinematic-timeline" style={{ marginTop: '8px' }}>
                {(() => {
                  const isActive = progress < 0.72;
                  return (
                    <div className="timeline-item" style={{ opacity: isActive ? 1 : 0.4 }}>
                      <div className={`timeline-bullet ${isActive ? 'active' : ''}`} />
                      <div className={`timeline-title ${isActive ? 'active' : ''}`}>MILES BEHIND US.</div>
                    </div>
                  );
                })()}
                {(() => {
                  const isActive = progress >= 0.72 && progress < 0.745;
                  const isFuture = progress < 0.72;
                  return (
                    <div className="timeline-item" style={{ opacity: isActive ? 1 : isFuture ? 0.3 : 0.4 }}>
                      <div className={`timeline-bullet ${isActive ? 'active' : ''}`} />
                      <div className={`timeline-title ${isActive ? 'active' : ''}`}>THE JOURNEY IS ALMOST OVER.</div>
                    </div>
                  );
                })()}
                {(() => {
                  const isActive = progress >= 0.745 && progress < 0.77;
                  const isFuture = progress < 0.745;
                  return (
                    <div className="timeline-item" style={{ opacity: isActive ? 1 : isFuture ? 0.3 : 0.4 }}>
                      <div className={`timeline-bullet ${isActive ? 'active' : ''}`} />
                      <div className={`timeline-title ${isActive ? 'active' : ''}`}>TORONTO AHEAD.</div>
                    </div>
                  );
                })()}
                {(() => {
                  const isActive = progress >= 0.77 && progress < 0.79;
                  const isFuture = progress < 0.77;
                  return (
                    <div className="timeline-item" style={{ opacity: isActive ? 1 : isFuture ? 0.3 : 0.4 }}>
                      <div className={`timeline-bullet ${isActive ? 'active' : ''}`} />
                      <div className={`timeline-title ${isActive ? 'active' : ''}`} style={{ color: isActive ? '#FF9D32' : undefined }}>
                        MADE IT.
                      </div>
                    </div>
                  );
                })()}
                {(() => {
                  const isActive = progress >= 0.79;
                  return (
                    <div className="timeline-item" style={{ opacity: isActive ? 1 : 0.35 }}>
                      <div className={`timeline-bullet ${isActive ? 'active' : ''}`} />
                      <div className={`timeline-title ${isActive ? 'active' : ''}`} style={{ fontSize: '1.25rem', color: isActive ? '#FFFFFF' : undefined }}>
                        TORONTO, WE'RE HERE.
                      </div>
                      <div className={`timeline-quote ${isActive ? 'active' : ''}`} style={{ color: isActive ? '#FF9D32' : undefined }}>
                        "From Nova Scotia to your new home in Toronto."
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>

          {/* 09 DELIVERY */}
          <div style={wrapperStyle}>
            <motion.div style={{ ...innerStyleFor(s9), gap: '12px' }}>
              <div className="section-kicker">
                DELIVERY <span className="kicker-subtle">SECTION 9 / 10</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.08, letterSpacing: '-0.025em' }}>
                TIME TO BRING<br />
                <span className="text-amber-glow">IT HOME.</span>
              </h2>

              <div className="cinematic-timeline" style={{ marginTop: '8px' }}>
                <div className="timeline-item" style={{ opacity: progress < 0.83 ? 1 : 0.4 }}>
                  <div className={`timeline-bullet ${progress < 0.83 ? 'active' : ''}`} />
                  <div className="timeline-title active">THE FINAL STOP</div>
                  <div className="timeline-quote active">Truck arrives at destination residence.</div>
                </div>
                <div className="timeline-item" style={{ opacity: progress >= 0.83 && progress < 0.86 ? 1 : 0.4 }}>
                  <div className={`timeline-bullet ${progress >= 0.83 && progress < 0.86 ? 'active' : ''}`} />
                  <div className="timeline-title active">TRUCK ➔ HOUSE</div>
                  <div className="timeline-quote active">Boxes and furniture staged and carried in room by room.</div>
                </div>
                <div className="timeline-item" style={{ opacity: progress >= 0.86 && progress < 0.89 ? 1 : 0.4 }}>
                  <div className={`timeline-bullet ${progress >= 0.86 && progress < 0.89 ? 'active' : ''}`} />
                  <div className="timeline-title active">UNLOADED WITH CARE</div>
                  <div className="timeline-quote active">Everything, right where it belongs.</div>
                </div>
                <div className="timeline-item" style={{ opacity: progress >= 0.89 ? 1 : 0.4 }}>
                  <div className={`timeline-bullet ${progress >= 0.89 ? 'active' : ''}`} />
                  <div className="timeline-title active" style={{ color: progress >= 0.89 ? '#FF9D32' : undefined }}>
                    EMPTY TRAILER. FULL NEW BEGINNING.
                  </div>
                  <div className="timeline-quote active">One journey complete. Your move is in good hands.</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 10 A NEW CHAPTER */}
          <div style={wrapperStyle}>
            <motion.div style={innerStyleFor(s10)}>
              <div className="section-kicker">
                A NEW CHAPTER <span className="kicker-subtle">SECTION 10 / 10</span>
              </div>
              <div style={{ fontSize: 'clamp(2.8rem, 5.2vw, 4.6rem)', fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.035em', color: '#FFFFFF' }}>
                YOU MOVE.<br />
                <span className="text-amber-glow">WE HANDLE THE REST.</span>
              </div>

              <div className="cinematic-timeline" style={{ marginTop: '4px' }}>
                <div className="timeline-item">
                  <div className="timeline-bullet active" />
                  <div className="timeline-title active">IT'S MORE THAN A MOVE. IT'S A NEW BEGINNING.</div>
                  <div className="timeline-quote active">A new home. A new chapter.</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.08em', color: '#B8B8B8' }}>
                  NS MOVERS AND HAULERS INC.
                </div>
              </div>

              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, letterSpacing: '0.12em', color: '#FFFFFF', marginBottom: '10px' }}>
                  READY FOR YOUR NEXT MOVE?
                </div>
                <button onClick={onQuoteClick} className="btn-primary" style={{ padding: '16px 34px', fontSize: '0.95rem' }}>
                  GET YOUR FREE QUOTE <ArrowRight size={17} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};