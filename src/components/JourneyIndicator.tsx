import React from 'react';

interface MilestoneItem {
  id: string;
  stepNum: string;
  label: string;
  start: number;
  end: number;
}

const MILESTONES: MilestoneItem[] = [
  { id: 'pickup', stepNum: '01', label: 'PICKUP', start: 0.0, end: 0.10 },
  { id: 'packing', stepNum: '02', label: 'PACKING', start: 0.10, end: 0.20 },
  { id: 'loading', stepNum: '03', label: 'LOADING', start: 0.20, end: 0.30 },
  { id: 'departure', stepNum: '04', label: 'DEPARTURE', start: 0.30, end: 0.40 },
  { id: 'route', stepNum: '05', label: 'ROUTE', start: 0.40, end: 0.50 },
  { id: 'journey', stepNum: '06', label: 'JOURNEY', start: 0.50, end: 0.60 },
  { id: 'safety', stepNum: '07', label: 'SAFETY', start: 0.60, end: 0.72 },
  { id: 'arrival', stepNum: '08', label: 'TORONTO', start: 0.72, end: 0.82 },
  { id: 'delivery', stepNum: '09', label: 'DELIVERY', start: 0.82, end: 0.92 },
  { id: 'final', stepNum: '10', label: 'NEW CHAPTER', start: 0.92, end: 1.0 }
];

interface JourneyIndicatorProps {
  currentProgress: number; // 0 to 1
  onSelectMilestone: (progress: number) => void;
}

export const JourneyIndicator: React.FC<JourneyIndicatorProps> = ({
  currentProgress,
  onSelectMilestone
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        right: 'clamp(14px, 2.5vw, 32px)',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        userSelect: 'none'
      }}
    >
      {/* Dots Track Container */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          padding: '6px 0'
        }}
      >
        {/* Background Vertical Line */}
        <div
          style={{
            position: 'absolute',
            top: '6px',
            bottom: '6px',
            width: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            zIndex: 0
          }}
        />

        {/* Dynamic Glowing Amber Progress Fill Line */}
        <div
          style={{
            position: 'absolute',
            top: '6px',
            width: '2px',
            height: `${Math.min(100, Math.max(0, currentProgress * 100))}%`,
            background: 'linear-gradient(180deg, #FF5A16 0%, #FF9D32 100%)',
            boxShadow: '0 0 10px rgba(255, 157, 50, 0.8)',
            zIndex: 1,
            transition: 'height 0.1s linear'
          }}
        />

        {/* Milestone Dots */}
        {MILESTONES.map((m) => {
          const isActive = currentProgress >= m.start && currentProgress <= m.end;
          const isPassed = currentProgress > m.end;

          return (
            <div
              key={m.id}
              onClick={() => onSelectMilestone(m.start)}
              title={`${m.stepNum} ${m.label}`}
              style={{
                position: 'relative',
                zIndex: 2,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '18px',
                height: '18px'
              }}
            >
              <div
                style={{
                  width: isActive ? '10px' : '5px',
                  height: isActive ? '10px' : '5px',
                  borderRadius: '50%',
                  backgroundColor: isActive
                    ? '#FF9D32'
                    : isPassed
                    ? '#FF5A16'
                    : 'rgba(255, 255, 255, 0.25)',
                  boxShadow: isActive
                    ? '0 0 12px rgba(255, 157, 50, 0.95), 0 0 20px rgba(255, 90, 22, 0.7)'
                    : 'none',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />

              {/* Active Milestone Badge Tooltip */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    right: '24px',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    color: '#FF9D32',
                    textShadow: '0 0 10px rgba(0, 0, 0, 0.9)',
                    whiteSpace: 'nowrap',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(8, 8, 10, 0.92)',
                    border: '1px solid rgba(255, 157, 50, 0.35)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)'
                  }}
                >
                  {m.stepNum} {m.label}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vertical 'SCROLL' Text Indicator */}
      <div
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.28em',
          color: 'rgba(255, 255, 255, 0.45)',
          marginTop: '4px'
        }}
      >
        SCROLL
      </div>
    </div>
  );
};
