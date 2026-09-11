import React from 'react';
import { Users, Package, Trophy, MapPin } from 'lucide-react';
import { SITE_STATS, StatItem } from '../data/siteData';

const renderIcon = (type: StatItem['icon']) => {
  const props = { size: 28, color: '#FF9D32', strokeWidth: 1.6 };
  switch (type) {
    case 'users':
      return <Users {...props} />;
    case 'box':
      return <Package {...props} />;
    case 'trophy':
      return <Trophy {...props} />;
    case 'map-pin':
      return <MapPin {...props} />;
    default:
      return <Package {...props} />;
  }
};

export const StatsBar: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '24px 32px',
        backgroundColor: 'rgba(12, 12, 14, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 157, 50, 0.18)',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 90, 22, 0.08)'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '28px',
          alignItems: 'center'
        }}
      >
        {SITE_STATS.map((stat, idx) => (
          <div
            key={stat.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              borderRight:
                idx < SITE_STATS.length - 1
                  ? '1px solid rgba(255, 255, 255, 0.07)'
                  : 'none',
              paddingRight: idx < SITE_STATS.length - 1 ? '16px' : '0'
            }}
          >
            {/* Ambient glowing icon container */}
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 157, 50, 0.06)',
                border: '1px solid rgba(255, 157, 50, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 0 15px rgba(255, 90, 22, 0.1)'
              }}
            >
              {renderIcon(stat.icon)}
            </div>

            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  color: '#FFFFFF'
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#B8B8B8',
                  marginTop: '2px'
                }}
              >
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
