import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import { REVIEWS } from '../data/siteData';

export const Reviews: React.FC = () => {
  return (
    <section
      id="reviews"
      style={{
        position: 'relative',
        zIndex: 20,
        backgroundColor: '#050505',
        padding: '120px 0',
        borderTop: '1px solid rgba(255, 157, 50, 0.1)'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '640px', marginBottom: '64px' }}>
          <div className="label-tag" style={{ marginBottom: '14px' }}>
            VERIFIED CUSTOMER EXPERIENCES
          </div>
          <h2
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '20px'
            }}
          >
            TRUSTED FOR <br />
            <span className="text-amber-glow">THE JOURNEY.</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#B8B8B8', lineHeight: 1.6 }}>
            Read firsthand accounts from families and businesses who entrusted their long-distance relocations to our team.
          </p>
        </div>

        {/* Reviews Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px'
          }}
        >
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="glass-card"
              style={{
                padding: '36px 30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                {/* Stars & Verified Badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star
                        key={i}
                        size={17}
                        fill="#FF9D32"
                        color="#FF9D32"
                      />
                    ))}
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#FF9D32',
                      backgroundColor: 'rgba(255, 157, 50, 0.08)',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    <ShieldCheck size={14} color="#FF9D32" />
                    <span>{rev.date}</span>
                  </div>
                </div>

                {/* Review Text */}
                <p
                  style={{
                    fontSize: '1rem',
                    color: '#D4D4D4',
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                    marginBottom: '28px'
                  }}
                >
                  "{rev.review}"
                </p>
              </div>

              {/* Author & Route */}
              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingTop: '20px'
                }}
              >
                <div style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '1.05rem' }}>
                  {rev.author}
                </div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    color: '#FF9D32',
                    fontWeight: 600,
                    marginTop: '2px'
                  }}
                >
                  {rev.route}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
