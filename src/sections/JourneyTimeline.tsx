import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { StatsBar } from '../components/StatsBar';

interface JourneyTimelineProps {
  progress: number;
  onQuoteClick: () => void;
  onVideoClick: () => void;
}

// Continuous smooth section animation calculator: 0 gaps, smooth crossfade & vertical drift
function getSectionAnim(
  progress: number,
  inStart: number,
  inEnd: number,
  outStart: number,
  outEnd: number
) {
  if (progress < inStart || progress > outEnd) {
    return { opacity: 0, translateY: 16, blur: 4, isVisible: false };
  }
  if (progress < inEnd) {
    const f = (progress - inStart) / (inEnd - inStart);
    return { opacity: f, translateY: 16 * (1 - f), blur: 3 * (1 - f), isVisible: true };
  }
  if (progress <= outStart) {
    return { opacity: 1, translateY: 0, blur: 0, isVisible: true };
  }
  const f = (progress - outStart) / (outEnd - outStart);
  return { opacity: 1 - f, translateY: -16 * f, blur: 3 * f, isVisible: true };
}

/**
 * IMPORTANT FIX:
 * The original file used classNames (.section-kicker, .text-amber-glow, .btn-primary,
 * .btn-secondary, .cinematic-timeline, .timeline-item, .timeline-bullet, .timeline-title,
 * .timeline-quote, .timeline-footer-accent, .kicker-subtle) that were never defined in
 * this file. If your global stylesheet doesn't define them (or isn't loaded on this page),
 * those elements get NO color/font styling at all — they inherit whatever your global
 * text color is, which is why text silently disappears on the dark background.
 *
 * This <style> block makes the component self-sufficient: it will always render
 * correctly even if your global CSS file is missing, renamed, or not imported here.
 * If you already have these classes defined elsewhere with different values, you can
 * safely delete this block once you confirm the real stylesheet is loading.
 */
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
.timeline-number {
  color: rgba(255, 255, 255, 0.45);
  font-weight: 800;
  font-size: 0.8rem;
}
.timeline-number.active {
  color: #FF9D32;
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
  const s1 = getSectionAnim(progress, -0.01, 0.00, 0.08, 0.10);
  const s2 = getSectionAnim(progress, 0.08, 0.10, 0.18, 0.20);
  const s3 = getSectionAnim(progress, 0.18, 0.20, 0.28, 0.30);
  const s4 = getSectionAnim(progress, 0.28, 0.30, 0.38, 0.40);
  const s5 = getSectionAnim(progress, 0.38, 0.40, 0.48, 0.50);
  const s6 = getSectionAnim(progress, 0.48, 0.50, 0.58, 0.60);
  const s7 = getSectionAnim(progress, 0.58, 0.60, 0.70, 0.72);
  const s8 = getSectionAnim(progress, 0.70, 0.72, 0.80, 0.82);
  const s9 = getSectionAnim(progress, 0.80, 0.82, 0.90, 0.92);
  const s10 = getSectionAnim(progress, 0.90, 0.92, 1.05, 1.10);

  const sectionStyle = (s: ReturnType<typeof getSectionAnim>): React.CSSProperties => ({
    position: 'absolute',
    top: '50%',
    left: 0,
    width: '100%',
    transform: `translateY(calc(-50% + ${s.translateY}px))`,
    opacity: s.opacity,
    filter: s.blur > 0.2 ? `blur(${s.blur.toFixed(1)}px)` : 'none',
    pointerEvents: s.opacity > 0.5 ? 'auto' : 'none',
    transition: 'opacity 0.15s linear, transform 0.15s linear',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  });

  return (
    <div
      id="cinematic-scroll-track"
      style={{
        position: 'relative',
        width: '100%',
        height: '1150vh',
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
          {s1.isVisible && (
            <div style={sectionStyle(s1)}>
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
                <button onClick={onVideoClick} className="btn-secondary" style={{ padding: '13px 24px', fontSize: '0.85rem' }}>
                  <Play size={14} fill="#FF9D32" color="#FF9D32" /> WATCH VIDEO
                </button>
              </div>
            </div>
          )}

          {/* 02 PACKING */}
          {s2.isVisible && (
            <div style={sectionStyle(s2)}>
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
            </div>
          )}

          {/* 03 LOADING */}
          {s3.isVisible && (
            <div style={sectionStyle(s3)}>
              <div className="section-kicker">LOADING</div>
              <h2
                style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.05, letterSpacing: '-0.03em' }}
              >
                LOADED. SECURED.<br />
                <span className="text-amber-glow">READY.</span>
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#B8B8B8', lineHeight: 1.55, maxWidth: '440px' }}>
                Balanced axle weight distribution and heavy-duty E-track lockbars anchored with zero cargo shift tolerance.
              </p>
            </div>
          )}

          {/* 04 DEPARTURE */}
          {s4.isVisible && (
            <div style={sectionStyle(s4)}>
              <div className="section-kicker">DEPARTURE</div>
              <h2
                style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.05, letterSpacing: '-0.03em' }}
              >
                TIME TO<br />
                <span className="text-amber-glow">MOVE.</span>
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#B8B8B8', lineHeight: 1.55, maxWidth: '440px' }}>
                Trailer doors locked tightly. The truck departs Nova Scotia and takes to the open road heading west toward Ontario.
              </p>
            </div>
          )}

          {/* 05 ROUTE */}
          {s5.isVisible && (
            <div style={sectionStyle(s5)}>
              <div className="section-kicker">ROUTE</div>
              <h2
                style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.05, letterSpacing: '-0.03em' }}
              >
                NOVA SCOTIA<br />
                <span className="text-amber-glow">➔ TORONTO</span>
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#B8B8B8', lineHeight: 1.55, maxWidth: '440px' }}>
                1,800 kilometer direct highway corridor connecting Halifax, Moncton, Quebec City, Montreal, Ottawa, and Toronto.
              </p>
            </div>
          )}

          {/* 06 EN ROUTE / JOURNEY */}
          {s6.isVisible && (
            <div style={sectionStyle(s6)}>
              <div className="section-kicker">EN ROUTE</div>
              <h2
                style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.05, letterSpacing: '-0.03em' }}
              >
                EVERY MILE,<br />
                <span className="text-amber-glow">HANDLED WITH CARE.</span>
              </h2>
              <p style={{ fontSize: '0.96rem', color: '#B8B8B8', lineHeight: 1.55, maxWidth: '440px' }}>
                Continuous 24/7 GPS telemetry and certified cross-provincial drivers keeping transit calm and predictable.
              </p>
            </div>
          )}

          {/* 07 TRUST / SAFETY */}
          {s7.isVisible && (
            <div style={{ ...sectionStyle(s7), gap: '10px' }}>
              <div className="section-kicker">
                TRUST / SAFETY <span className="kicker-subtle">SECTION 7 / 10</span>
              </div>
              <h2
                style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.025em', color: '#FFFFFF' }}
              >
                YOUR BELONGINGS.<br />
                <span className="text-amber-glow">OUR RESPONSIBILITY.</span>
              </h2>

              <div className="cinematic-timeline">
                {(() => {
                  const isActive = progress < 0.615;
                  return (
                    <div className="timeline-item" style={{ opacity: isActive ? 1 : 0.38, transform: isActive ? 'translateY(0)' : 'translateY(1px)' }}>
                      <div className={`timeline-bullet ${isActive ? 'active' : ''}`} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`timeline-number ${isActive ? 'active' : ''}`}>01</span>
                        <span className={`timeline-title ${isActive ? 'active' : ''}`}>PROTECTED</span>
                      </div>
                      <div className={`timeline-quote ${isActive ? 'active' : ''}`}>"Handled with care from the very beginning."</div>
                    </div>
                  );
                })()}
                {(() => {
                  const isActive = progress >= 0.615 && progress < 0.645;
                  const isFuture = progress < 0.615;
                  return (
                    <div className="timeline-item" style={{ opacity: isActive ? 1 : isFuture ? 0.30 : 0.38, transform: isActive ? 'translateY(0)' : 'translateY(1px)' }}>
                      <div className={`timeline-bullet ${isActive ? 'active' : ''}`} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`timeline-number ${isActive ? 'active' : ''}`}>02</span>
                        <span className={`timeline-title ${isActive ? 'active' : ''}`}>SECURED</span>
                      </div>
                      <div className={`timeline-quote ${isActive ? 'active' : ''}`}>"Every piece is positioned and secured for the road ahead."</div>
                    </div>
                  );
                })()}
                {(() => {
                  const isActive = progress >= 0.645 && progress < 0.675;
                  const isFuture = progress < 0.645;
                  return (
                    <div className="timeline-item" style={{ opacity: isActive ? 1 : isFuture ? 0.30 : 0.38, transform: isActive ? 'translateY(0)' : 'translateY(1px)' }}>
                      <div className={`timeline-bullet ${isActive ? 'active' : ''}`} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`timeline-number ${isActive ? 'active' : ''}`}>03</span>
                        <span className={`timeline-title ${isActive ? 'active' : ''}`}>ORGANIZED</span>
                      </div>
                      <div className={`timeline-quote ${isActive ? 'active' : ''}`}>"Everything packed with purpose. Everything in its place."</div>
                    </div>
                  );
                })()}
                {(() => {
                  const isActive = progress >= 0.675;
                  const isFuture = progress < 0.675;
                  return (
                    <div className="timeline-item" style={{ opacity: isActive ? 1 : isFuture ? 0.30 : 0.38, transform: isActive ? 'translateY(0)' : 'translateY(1px)' }}>
                      <div className={`timeline-bullet ${isActive ? 'active' : ''}`} />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`timeline-number ${isActive ? 'active' : ''}`}>04</span>
                        <span className={`timeline-title ${isActive ? 'active' : ''}`}>DELIVERED</span>
                      </div>
                      <div className={`timeline-quote ${isActive ? 'active' : ''}`}>"Protected throughout the journey, ready for its new home."</div>
                    </div>
                  );
                })()}
              </div>

              <div className="timeline-footer-accent" style={{ opacity: progress >= 0.67 ? 1 : 0.45, transition: 'opacity 0.3s ease' }}>
                <div>EVERY MILE.</div>
                <div>EVERY BOX.</div>
                <div>EVERY DETAIL.</div>
              </div>
            </div>
          )}

          {/* 08 ARRIVING IN TORONTO */}
          {s8.isVisible && (
            <div style={{ ...sectionStyle(s8), gap: '12px' }}>
              <div className="section-kicker">
                ARRIVING IN TORONTO <span className="kicker-subtle">SECTION 8 / 10</span>
              </div>
              <h2
                style={{ fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#FFFFFF' }}
              >
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
            </div>
          )}

          {/* 09 DELIVERY */}
          {s9.isVisible && (
            <div style={{ ...sectionStyle(s9), gap: '12px' }}>
              <div className="section-kicker">
                DELIVERY <span className="kicker-subtle">SECTION 9 / 10</span>
              </div>
              <h2
                style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.08, letterSpacing: '-0.025em' }}
              >
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
            </div>
          )}

          {/* 10 A NEW CHAPTER */}
          {s10.isVisible && (
            <div style={sectionStyle(s10)}>
              <div className="section-kicker">
                A NEW CHAPTER <span className="kicker-subtle">SECTION 10 / 10</span>
              </div>
              <div
                style={{ fontSize: 'clamp(2.8rem, 5.2vw, 4.6rem)', fontWeight: 900, lineHeight: 1.02, letterSpacing: '-0.035em', color: '#FFFFFF' }}
              >
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
                <div style={{ fontSize: '0.92rem', fontWeight: 800, letterSpacing: '0.18em', color: '#FF9D32' }}>
                  NOVA SCOTIA ➔ TORONTO
                </div>
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
            </div>
          )}
        </div>

        {progress < 0.08 && (
          <div
            style={{
              width: '100%',
              marginTop: 'auto',
              opacity: Math.max(0, 1 - (progress / 0.07)),
              pointerEvents: progress < 0.06 ? 'auto' : 'none',
              transition: 'opacity 0.2s ease-out'
            }}
          >
            <StatsBar />
          </div>
        )}
      </div>
    </div>
  );
};
