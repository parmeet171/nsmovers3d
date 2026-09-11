import React from 'react';
import { Truck, Home, Building2, PackageCheck, Lock, Compass, Check } from 'lucide-react';
import { SITE_SERVICES, ServiceItem } from '../data/siteData';

const getServiceIcon = (iconName: string) => {
  const props = { size: 30, color: '#FF9D32', strokeWidth: 1.8 };
  switch (iconName) {
    case 'truck':
      return <Truck {...props} />;
    case 'home':
      return <Home {...props} />;
    case 'building':
      return <Building2 {...props} />;
    case 'package-check':
      return <PackageCheck {...props} />;
    case 'lock':
      return <Lock {...props} />;
    case 'compass':
      return <Compass {...props} />;
    default:
      return <Truck {...props} />;
  }
};

interface ServicesProps {
  onSelectService: (service: ServiceItem) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  return (
    <section
      id="services"
      style={{
        position: 'relative',
        zIndex: 20,
        backgroundColor: '#050505',
        padding: '120px 0 100px',
        borderTop: '1px solid rgba(255, 157, 50, 0.12)'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '680px', marginBottom: '64px' }}>
          <div className="label-tag" style={{ marginBottom: '14px' }}>
            SPECIALIZED FLEET & SOLUTIONS
          </div>
          <h2
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '20px'
            }}
          >
            ENGINEERED FOR <br />
            <span className="text-amber-glow">PREMIER TRANSIT.</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#B8B8B8', lineHeight: 1.6 }}>
            Every move is managed with dedicated trailers, certified long-haul drivers, and comprehensive cargo protection from Atlantic Canada to Ontario.
          </p>
        </div>

        {/* Services Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px'
          }}
        >
          {SITE_SERVICES.map((service) => (
            <div
              key={service.id}
              className="glass-card"
              style={{
                padding: '36px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Subtle top amber highlight line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '32px',
                  right: '32px',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 157, 50, 0.4), transparent)'
                }}
              />

              <div>
                {/* Header Row with Icon & Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px'
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 157, 50, 0.08)',
                      border: '1px solid rgba(255, 157, 50, 0.22)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {getServiceIcon(service.icon)}
                  </div>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      color: '#FF9D32',
                      backgroundColor: 'rgba(255, 157, 50, 0.08)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 157, 50, 0.2)'
                    }}
                  >
                    {service.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    marginBottom: '14px',
                    color: '#FFFFFF'
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.95rem',
                    color: '#B8B8B8',
                    lineHeight: 1.6,
                    marginBottom: '28px'
                  }}
                >
                  {service.description}
                </p>

                {/* Features List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    marginBottom: '32px'
                  }}
                >
                  {service.features.map((feature, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.88rem',
                        color: '#E0E0E0'
                      }}
                    >
                      <Check size={16} color="#FF9D32" style={{ flexShrink: 0 }} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectService(service)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 157, 50, 0.15)';
                  e.currentTarget.style.borderColor = '#FF9D32';
                  e.currentTarget.style.color = '#FF9D32';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                REQUEST QUOTE FOR THIS SERVICE →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
