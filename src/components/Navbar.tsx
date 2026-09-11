import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  onQuoteClick: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onQuoteClick, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '92px',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(20px, 4vw, 48px)',
        backgroundColor: isScrolled ? 'rgba(5, 5, 5, 0.88)' : 'rgba(5, 5, 5, 0.35)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: isScrolled ? '1px solid rgba(255, 157, 50, 0.15)' : '1px solid rgba(255, 255, 255, 0.04)',
        transition: 'all 0.35s ease'
      }}
    >
      {/* Brand Logo matching reference screenshot */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none'
        }}
      >
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
      </a>

      {/* Desktop Navigation Links */}
      <div
        style={{
          display: 'none',
          alignItems: 'center',
          gap: '36px'
        }}
        className="desktop-nav"
      >
        {[
          { label: 'HOME', target: 'hero' },
          { label: 'ABOUT US', target: 'about' },
          { label: 'SERVICES', target: 'services' },
          { label: 'OUR WORK', target: 'journey' },
          { label: 'REVIEWS', target: 'reviews' },
          { label: 'CONTACT', target: 'contact' }
        ].map((link) => {
          const isActive = activeSection === link.target;
          return (
            <button
              key={link.label}
              onClick={() => scrollTo(link.target)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? '#FF9D32' : '#FFFFFF',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                cursor: 'pointer',
                position: 'relative',
                padding: '8px 0',
                transition: 'color 0.25s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FF9D32')}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#FFFFFF';
              }}
            >
              {link.label}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '18px',
                    height: '2px',
                    backgroundColor: '#FF9D32',
                    borderRadius: '2px',
                    boxShadow: '0 0 8px rgba(255, 157, 50, 0.8)'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Right: GET A QUOTE Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onQuoteClick}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 22px',
            backgroundColor: 'rgba(255, 157, 50, 0.05)',
            color: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            border: '1px solid rgba(255, 157, 50, 0.4)',
            borderRadius: '100px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 0 12px rgba(255, 90, 22, 0.15)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#FF9D32';
            e.currentTarget.style.backgroundColor = 'rgba(255, 157, 50, 0.15)';
            e.currentTarget.style.boxShadow = '0 0 24px rgba(255, 90, 22, 0.4)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 157, 50, 0.4)';
            e.currentTarget.style.backgroundColor = 'rgba(255, 157, 50, 0.05)';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 90, 22, 0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>GET A QUOTE</span>
          <ArrowRight size={15} color="#FF9D32" />
        </button>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '42px',
            height: '42px',
            background: 'none',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            color: '#FFFFFF',
            cursor: 'pointer'
          }}
          className="mobile-hamburger"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '92px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 5, 5, 0.96)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '36px 28px',
            gap: '24px',
            zIndex: 99
          }}
        >
          {[
            { label: 'HOME', target: 'hero' },
            { label: 'ABOUT US', target: 'about' },
            { label: 'SERVICES', target: 'services' },
            { label: 'OUR WORK', target: 'journey' },
            { label: 'REVIEWS', target: 'reviews' },
            { label: 'CONTACT', target: 'contact' }
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.target)}
              style={{
                background: 'none',
                border: 'none',
                color: activeSection === link.target ? '#FF9D32' : '#FFFFFF',
                fontFamily: "'Inter', sans-serif",
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textAlign: 'left',
                cursor: 'pointer',
                padding: '8px 0'
              }}
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onQuoteClick();
            }}
            className="btn-primary"
            style={{ marginTop: '16px', width: '100%' }}
          >
            GET A FREE QUOTE <ArrowRight size={16} />
          </button>
        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-hamburger {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};
