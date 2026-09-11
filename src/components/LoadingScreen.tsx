import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  progress: number;
  isReady: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, isReady }) => {
  const [displayPercent, setDisplayPercent] = useState<number>(0);
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    // Smooth counter animation toward actual progress
    const target = isReady ? 100 : Math.min(progress, 99);
    const interval = setInterval(() => {
      setDisplayPercent((prev) => {
        if (prev < target) {
          return prev + 1;
        }
        if (isReady && prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setHidden(true), 400);
          return 100;
        }
        return prev;
      });
    }, 15);

    return () => clearInterval(interval);
  }, [progress, isReady]);

  if (hidden) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isReady && displayPercent >= 100 ? 0 : 1,
        pointerEvents: isReady && displayPercent >= 100 ? 'none' : 'auto',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '24px'
      }}
    >
      {/* Background ambient amber glow */}
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 90, 22, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      {/* Official Brand Logo */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <img
          src="/brand-logo.png"
          alt="NS Movers and Haulers Inc."
          style={{
            height: '110px',
            width: 'auto',
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </div>

      {/* Progress Counter */}
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '3rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'baseline',
          gap: '4px'
        }}
      >
        <span>{displayPercent.toString().padStart(2, '0')}</span>
        <span style={{ fontSize: '1.2rem', color: '#FF9D32' }}>%</span>
      </div>

      {/* Luxury Progress Bar */}
      <div
        style={{
          width: '280px',
          height: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${displayPercent}%`,
            background: 'linear-gradient(90deg, #FF5A16 0%, #FF9D32 100%)',
            boxShadow: '0 0 15px rgba(255, 90, 22, 0.8)',
            transition: 'width 0.2s ease-out'
          }}
        />
      </div>

      {/* Subtle subtext */}
      <div
        style={{
          marginTop: '20px',
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#7A7A7A'
        }}
      >
        PREPARING CINEMATIC EXPERIENCE
      </div>
    </div>
  );
};
