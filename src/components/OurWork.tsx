import React from 'react';
import { ArrowRight, MapPin, Truck } from 'lucide-react';

interface Project {
  id: string;
  type: string;
  route: string;
  distance: string;
  summary: string;
}

// Edit these cards to showcase your real completed moves.
const PROJECTS: Project[] = [
  {
    id: 'p1',
    type: 'LONG-DISTANCE',
    route: 'Halifax, NS ➔ Toronto, ON',
    distance: '1,800 km',
    summary: 'Full 3-bedroom household moved direct on a dedicated trailer with zero mixed loads.'
  },
  {
    id: 'p2',
    type: 'RESIDENTIAL',
    route: 'Dartmouth, NS ➔ Moncton, NB',
    distance: '350 km',
    summary: 'Apartment relocation with full packing, furniture assembly and room-by-room placement.'
  },
  {
    id: 'p3',
    type: 'COMMERCIAL',
    route: 'Halifax, NS ➔ Ottawa, ON',
    distance: '1,400 km',
    summary: 'After-hours office move including IT equipment and modular workstations.'
  }
];

interface OurWorkProps {
  onQuoteClick: () => void;
}

export const OurWork: React.FC<OurWorkProps> = ({ onQuoteClick }) => {
  return (
    <section
      id="our-work"
      style={{
        position: 'relative',
        zIndex: 20,
        backgroundColor: '#050505',
        padding: '120px 0',
        borderTop: '1px solid rgba(255, 157, 50, 0.1)'
      }}
    >
      <div className="container">
        <div style={{ maxWidth: '640px', marginBottom: '64px' }}>
          <div className="label-tag" style={{ marginBottom: '14px' }}>
            RECENT MOVES
          </div>
          <h2
            style={{
              fontSize: 'clamp(2.4rem, 4vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '20px'
            }}
          >
            OUR WORK, <br />
            <span className="text-amber-glow">DELIVERED.</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#B8B8B8', lineHeight: 1.6 }}>
            A look at some of the homes and businesses we have moved across Atlantic Canada and Ontario.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}
        >
          {PROJECTS.map((p) => (
            <div key={p.id} className="glass-card" style={{ padding: '36px 30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <Truck size={18} color="#FF9D32" />
                <span style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.16em', color: '#FF9D32' }}>
                  {p.type}
                </span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>{p.route}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8A8A8A', fontSize: '0.85rem', marginBottom: '16px' }}>
                <MapPin size={14} /> {p.distance}
              </div>
              <p style={{ color: '#B8B8B8', lineHeight: 1.6, fontSize: '0.95rem' }}>{p.summary}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '48px' }}>
          <button onClick={onQuoteClick} className="btn-primary" style={{ padding: '16px 34px', fontSize: '0.95rem' }}>
            START YOUR MOVE <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
};
