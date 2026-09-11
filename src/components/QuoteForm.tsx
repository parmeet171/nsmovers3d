import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Calendar, MapPin, Phone, Mail, User, Shield } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/siteData';

interface QuoteFormProps {
  preselectedService?: string;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ preselectedService }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    movingFrom: 'Halifax, Nova Scotia',
    movingTo: 'Toronto, Ontario',
    moveDate: '',
    moveType: preselectedService || 'Long-Distance Moving (Nova Scotia → Toronto)',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section
      id="contact"
      style={{
        position: 'relative',
        zIndex: 20,
        backgroundColor: '#070709',
        padding: '120px 0 140px',
        borderTop: '1px solid rgba(255, 157, 50, 0.15)'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '64px',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Heading & Value Proposition */}
          <div>
            <div className="label-tag" style={{ marginBottom: '16px' }}>
              DIRECT FLEET BOOKING
            </div>

            <h2
              style={{
                fontSize: 'clamp(2.5rem, 4.5vw, 4rem)',
                fontWeight: 900,
                lineHeight: 1.08,
                marginBottom: '24px'
              }}
            >
              READY FOR <br />
              <span className="text-amber-glow">YOUR MOVE?</span>
            </h2>

            <p
              style={{
                fontSize: '1.15rem',
                color: '#B8B8B8',
                lineHeight: 1.6,
                marginBottom: '36px'
              }}
            >
              Let’s make your next move simple. Tell us about your origin, destination, and target timeline—our dispatch team will provide a transparent, all-inclusive guaranteed quote within 2 hours.
            </p>

            {/* Direct Contact Pillars */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                marginBottom: '40px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 157, 50, 0.08)',
                    border: '1px solid rgba(255, 157, 50, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Phone size={20} color="#FF9D32" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF9D32', letterSpacing: '0.1em' }}>
                    DIRECT PHONE
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {COMPANY_DETAILS.phone}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 157, 50, 0.08)',
                    border: '1px solid rgba(255, 157, 50, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Mail size={20} color="#FF9D32" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FF9D32', letterSpacing: '0.1em' }}>
                    DIRECT EMAIL
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {COMPANY_DETAILS.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div
              className="glass-card"
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                borderLeft: '3px solid #FF9D32'
              }}
            >
              <Shield size={24} color="#FF9D32" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: '#B8B8B8' }}>
                <strong style={{ color: '#FFFFFF' }}>Guaranteed Binding Estimates:</strong> No hidden surprise fees at destination. What we quote is what you pay.
              </div>
            </div>
          </div>

          {/* Right Column: Premium Quote Form */}
          <div
            className="glass-card"
            style={{
              padding: 'clamp(28px, 4vw, 48px)',
              border: '1px solid rgba(255, 157, 50, 0.25)',
              position: 'relative'
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 157, 50, 0.12)',
                    border: '2px solid #FF9D32',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                  }}
                >
                  <CheckCircle2 size={36} color="#FF9D32" />
                </div>

                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', color: '#FFFFFF' }}>
                  Quote Request Received
                </h3>

                <p style={{ color: '#B8B8B8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
                  Thank you, <strong style={{ color: '#FFFFFF' }}>{formData.name}</strong>. Our senior logistics dispatcher has been notified of your move from <strong style={{ color: '#FF9D32' }}>{formData.movingFrom}</strong> to <strong style={{ color: '#FF9D32' }}>{formData.movingTo}</strong>.
                </p>

                <div
                  style={{
                    backgroundColor: 'rgba(5, 5, 5, 0.6)',
                    padding: '18px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    textAlign: 'left',
                    marginBottom: '28px'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', color: '#FF9D32', fontWeight: 700, letterSpacing: '0.1em' }}>
                    WHAT HAPPENS NEXT:
                  </div>
                  <ul style={{ paddingLeft: '18px', marginTop: '8px', fontSize: '0.88rem', color: '#E0E0E0', lineHeight: 1.7 }}>
                    <li>Route audit & trailer allocation calculated</li>
                    <li>Guaranteed flat-rate quote sent to {formData.email}</li>
                    <li>Follow-up phone call to answer specific inventory questions</li>
                  </ul>
                </div>

                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-secondary"
                  style={{ width: '100%' }}
                >
                  SUBMIT ANOTHER INQUIRY
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                    Request Your Guaranteed Quote
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#B8B8B8' }}>
                    Fill in your details below for an instant dispatch calculation.
                  </div>
                </div>

                {/* Name & Email Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '18px',
                    marginBottom: '18px'
                  }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#B8B8B8', marginBottom: '8px' }}>
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Mitchell"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: 'rgba(5, 5, 5, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '0.92rem',
                        outline: 'none',
                        transition: 'border-color 0.25s'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#FF9D32')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#B8B8B8', marginBottom: '8px' }}>
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: 'rgba(5, 5, 5, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '0.92rem',
                        outline: 'none',
                        transition: 'border-color 0.25s'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#FF9D32')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                    />
                  </div>
                </div>

                {/* Phone & Date Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '18px',
                    marginBottom: '18px'
                  }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#B8B8B8', marginBottom: '8px' }}>
                      PHONE NUMBER *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. (902) 555-0123"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: 'rgba(5, 5, 5, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '0.92rem',
                        outline: 'none',
                        transition: 'border-color 0.25s'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#FF9D32')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#B8B8B8', marginBottom: '8px' }}>
                      TARGET MOVE DATE
                    </label>
                    <input
                      type="date"
                      value={formData.moveDate}
                      onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: 'rgba(5, 5, 5, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '0.92rem',
                        outline: 'none',
                        transition: 'border-color 0.25s',
                        colorScheme: 'dark'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#FF9D32')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                    />
                  </div>
                </div>

                {/* Moving From & Moving To Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '18px',
                    marginBottom: '18px'
                  }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#B8B8B8', marginBottom: '8px' }}>
                      MOVING FROM (ORIGIN) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.movingFrom}
                      onChange={(e) => setFormData({ ...formData, movingFrom: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: 'rgba(5, 5, 5, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '0.92rem',
                        outline: 'none',
                        transition: 'border-color 0.25s'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#FF9D32')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#B8B8B8', marginBottom: '8px' }}>
                      MOVING TO (DESTINATION) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.movingTo}
                      onChange={(e) => setFormData({ ...formData, movingTo: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        backgroundColor: 'rgba(5, 5, 5, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '6px',
                        color: '#FFFFFF',
                        fontFamily: "'Manrope', sans-serif",
                        fontSize: '0.92rem',
                        outline: 'none',
                        transition: 'border-color 0.25s'
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#FF9D32')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                    />
                  </div>
                </div>

                {/* Move Type Select */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#B8B8B8', marginBottom: '8px' }}>
                    SERVICE / MOVE TYPE
                  </label>
                  <select
                    value={formData.moveType}
                    onChange={(e) => setFormData({ ...formData, moveType: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      backgroundColor: 'rgba(5, 5, 5, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '0.92rem',
                      outline: 'none',
                      colorScheme: 'dark'
                    }}
                  >
                    <option value="Long-Distance Moving (Nova Scotia → Toronto)">
                      Long-Distance Moving (Nova Scotia ➔ Toronto Corridor)
                    </option>
                    <option value="Residential Moving (Full Household)">
                      Residential Moving (Full Household)
                    </option>
                    <option value="Commercial & Office Relocation">
                      Commercial & Office Relocation
                    </option>
                    <option value="Full Packing & Crating Services">
                      Full Packing & Crating Services
                    </option>
                    <option value="Loading & Unloading Only">
                      Loading & Unloading Only
                    </option>
                    <option value="Local Nova Scotia Regional Hauling">
                      Local Nova Scotia Regional Hauling
                    </option>
                  </select>
                </div>

                {/* Message / Special Inventory Notes */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: '#B8B8B8', marginBottom: '8px' }}>
                    MESSAGE / SPECIAL INVENTORY NOTES
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. 3-bedroom home, includes upright piano, require wardrobe boxes..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 16px',
                      backgroundColor: 'rgba(5, 5, 5, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      color: '#FFFFFF',
                      fontFamily: "'Manrope', sans-serif",
                      fontSize: '0.92rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#FF9D32')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ width: '100%', padding: '16px 24px', fontSize: '0.95rem' }}
                >
                  {submitting ? 'CALCULATING DISPATCH...' : 'GET MY FREE QUOTE →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
