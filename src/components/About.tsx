import React from 'react';
import { Shield, Clock, Award, HeartHandshake } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/siteData';

export const About: React.FC = () => {
  return (
    <section
      id="about"
      style={{
        position: 'relative',
        zIndex: 20,
        backgroundColor: '#070708',
        padding: '120px 0',
        borderTop: '1px solid rgba(255, 157, 50, 0.1)'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center'
          }}
        >
          {/* Left Column: Story & Philosophy */}
          <div>
            <div className="label-tag" style={{ marginBottom: '16px' }}>
              OUR PHILOSOPHY & VALUES
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.4rem, 4vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: '28px'
              }}
            >
              MOVING PEOPLE. <br />
              <span className="text-amber-glow">NOT JUST BOXES.</span>
            </h2>

            <p
              style={{
                fontSize: '1.1rem',
                color: '#E0E0E0',
                lineHeight: 1.7,
                marginBottom: '20px'
              }}
            >
              At {COMPANY_DETAILS.name}, we understand that a long-distance relocation across 1,800 kilometers isn’t merely a logistical assignment—it’s the start of your family’s next chapter.
            </p>

            <p
              style={{
                fontSize: '1rem',
                color: '#A0A0A0',
                lineHeight: 1.7,
                marginBottom: '36px'
              }}
            >
              Founded on principles of automotive-grade precision, white-glove packaging, and relentless punctuality, our dedicated fleet and certified crews eliminate the friction, delays, and anxiety typically associated with interprovincial moves.
            </p>

            {/* Quick Guarantees Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Shield size={22} color="#FF9D32" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.92rem' }}>100% Insured</div>
                  <div style={{ fontSize: '0.8rem', color: '#8E8E8E' }}>Comprehensive transit coverage</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Clock size={22} color="#FF9D32" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.92rem' }}>On-Time Guarantee</div>
                  <div style={{ fontSize: '0.8rem', color: '#8E8E8E' }}>Fixed delivery schedule windows</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <Award size={22} color="#FF9D32" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.92rem' }}>Certified Operators</div>
                  <div style={{ fontSize: '0.8rem', color: '#8E8E8E' }}>Experienced highway professionals</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <HeartHandshake size={22} color="#FF9D32" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.92rem' }}>White-Glove Care</div>
                  <div style={{ fontSize: '0.8rem', color: '#8E8E8E' }}>Respect for your home and belongings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Feature Box */}
          <div
            className="glass-card"
            style={{
              padding: '48px 40px',
              border: '1px solid rgba(255, 157, 50, 0.25)',
              position: 'relative',
              background: 'radial-gradient(circle at top right, rgba(255, 90, 22, 0.08), rgba(14, 14, 16, 0.85) 60%)'
            }}
          >
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                color: '#FF9D32',
                marginBottom: '16px'
              }}
            >
              DIRECT ATLANTIC ➔ CENTRAL CANADA CORRIDOR
            </div>

            <div
              style={{
                fontSize: '2rem',
                fontWeight: 900,
                color: '#FFFFFF',
                marginBottom: '20px',
                lineHeight: 1.2
              }}
            >
              Dedicated Fleet. <br />
              No Third-Party Brokers.
            </div>

            <p
              style={{
                fontSize: '0.95rem',
                color: '#B8B8B8',
                lineHeight: 1.7,
                marginBottom: '32px'
              }}
            >
              Unlike national broker networks that hand your possessions off across multiple unknown subcontracted trucks, our own trucks and full-time crew handle your shipment from the first handshake in Nova Scotia to the final placement in Ontario.
            </p>

            <div
              style={{
                padding: '20px',
                backgroundColor: 'rgba(5, 5, 5, 0.6)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF9D32', letterSpacing: '0.1em' }}>
                DIRECT HIGHWAY DISPATCH
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                Halifax Head Office: (902) 555-0199
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888888', marginTop: '4px' }}>
                Available 7 days a week for dispatch queries & quotes
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
