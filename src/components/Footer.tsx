import React from 'react';
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/siteData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 20,
        backgroundColor: '#030304',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '80px 0 40px',
        color: '#8E8E8E'
      }}
    >
      <div className="container">
        {/* Top Footer Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '48px',
            marginBottom: '60px'
          }}
        >
          {/* Brand Column */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ marginBottom: '16px' }}>
              <img
                src="/brand-logo.png"
                alt="NS Movers and Haulers Inc."
                style={{
                  height: '56px',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>

            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: '#9E9E9E', marginBottom: '20px' }}>
              Specialized cinematic interprovincial hauling connecting Nova Scotia directly to Ontario with dedicated fleet care.
            </p>

            <div style={{ fontSize: '0.82rem', color: '#6A6A6A' }}>
              USDOT & CVOR Licensed Carrier <br />
              Commercial Transit Cargo Insured
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.12em', marginBottom: '18px' }}>
              NAVIGATION
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToTop(); }} style={{ color: '#A0A0A0', textDecoration: 'none' }}>
                  Home Journey
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }} style={{ color: '#A0A0A0', textDecoration: 'none' }}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }} style={{ color: '#A0A0A0', textDecoration: 'none' }}>
                  Fleet Services
                </a>
              </li>
              <li>
                <a href="#reviews" onClick={(e) => { e.preventDefault(); scrollTo('reviews'); }} style={{ color: '#A0A0A0', textDecoration: 'none' }}>
                  Customer Reviews
                </a>
              </li>
              <li>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }} style={{ color: '#A0A0A0', textDecoration: 'none' }}>
                  Get a Free Quote
                </a>
              </li>
            </ul>
          </div>

          {/* Signature Corridor */}
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.12em', marginBottom: '18px' }}>
              CORRIDOR HUBS
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>Halifax, Nova Scotia (Atlantic HQ)</li>
              <li>Moncton, New Brunswick</li>
              <li>Quebec City, Quebec</li>
              <li>Montreal, Quebec</li>
              <li>Ottawa, Ontario</li>
              <li>Toronto, Ontario (Central HQ)</li>
            </ul>
          </div>

          {/* Contact Dispatch */}
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.12em', marginBottom: '18px' }}>
              DISPATCH CONTACT
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={15} color="#FF9D32" />
                <span style={{ color: '#FFFFFF' }}>{COMPANY_DETAILS.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={15} color="#FF9D32" />
                <span>{COMPANY_DETAILS.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={15} color="#FF9D32" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span>{COMPANY_DETAILS.addressNS}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={15} color="#FF9D32" style={{ marginTop: '3px', flexShrink: 0 }} />
                <span>{COMPANY_DETAILS.addressON}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.8rem'
          }}
        >
          <div>
            © {new Date().getFullYear()} {COMPANY_DETAILS.name}. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '100px',
              padding: '6px 14px',
              color: '#B8B8B8',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#FF9D32';
              e.currentTarget.style.color = '#FF9D32';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#B8B8B8';
            }}
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
};
