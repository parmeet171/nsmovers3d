import React from 'react';
import { X, Play, Shield, Navigation } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuoteClick: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, onQuoteClick }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '860px',
          backgroundColor: '#0a0a0c',
          border: '1px solid rgba(255, 157, 50, 0.3)',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 50px rgba(255, 90, 22, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 28px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.15em', color: '#FF9D32' }}>
              CINEMATIC OVERVIEW
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
              The 1,800 KM Nova Scotia ➔ Toronto Move
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Player Preview / Feature Showcase */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', backgroundColor: '#000000' }}>
          {/* Use one of the real frame images as background */}
          <img
            src="/frames/split-2/ezgif-frame-150.jpg"
            alt="Nova Scotia to Toronto 3D Map Route"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.85
            }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(5,5,5,0.7) 100%)',
              textAlign: 'center',
              padding: '20px'
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 157, 50, 0.2)',
                border: '2px solid #FF9D32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
                boxShadow: '0 0 30px rgba(255, 90, 22, 0.5)'
              }}
            >
              <Play size={28} fill="#FF9D32" color="#FF9D32" style={{ marginLeft: '4px' }} />
            </div>

            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
              Interactive Scroll-Driven Journey
            </div>
            <p style={{ maxWidth: '440px', fontSize: '0.9rem', color: '#C0C0C0', lineHeight: 1.5 }}>
              The entire website is an interactive movie. Scroll through the page below to control the truck’s live movement from pickup in Nova Scotia to delivery in Toronto.
            </p>
          </div>
        </div>

        {/* Footer info in modal */}
        <div
          style={{
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            backgroundColor: 'rgba(5, 5, 5, 0.6)'
          }}
        >
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#B8B8B8' }}>
              <Navigation size={16} color="#FF9D32" /> 1,800 KM Trans-Canada Route
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#B8B8B8' }}>
              <Shield size={16} color="#FF9D32" /> 100% Dedicated Cargo Space
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onQuoteClick();
            }}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.82rem' }}
          >
            START YOUR MOVE →
          </button>
        </div>
      </div>
    </div>
  );
};
