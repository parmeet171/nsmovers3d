// Centralized editable business information and statistics

export interface StatItem {
  id: string;
  value: string;
  label: string;
  sublabel?: string;
  icon: 'users' | 'box' | 'trophy' | 'map-pin';
}

export interface ServiceItem {
  id: string;
  title: string;
  badge: string;
  description: string;
  features: string[];
  icon: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  route: string;
  rating: number;
  date: string;
  review: string;
  verified: boolean;
}

export const SITE_STATS: StatItem[] = [
  {
    id: 'customers',
    value: '5000+',
    label: 'Happy Customers',
    sublabel: 'Across Atlantic Canada & Ontario',
    icon: 'users'
  },
  {
    id: 'moves',
    value: '12K+',
    label: 'Moves Completed',
    sublabel: 'Zero loss transit record',
    icon: 'box'
  },
  {
    id: 'experience',
    value: '15+',
    label: 'Years of Experience',
    sublabel: 'Specialized interstate haulers',
    icon: 'trophy'
  },
  {
    id: 'areas',
    value: '100+',
    label: 'Areas Served',
    sublabel: 'Halifax to Greater Toronto Area',
    icon: 'map-pin'
  }
];

export const SITE_SERVICES: ServiceItem[] = [
  {
    id: 'long-distance',
    title: 'Long-Distance Moving',
    badge: 'SIGNATURE CORRIDOR',
    description: 'Dedicated non-stop moving journeys connecting Nova Scotia, New Brunswick, Quebec, and Ontario with direct GPS tracking.',
    features: ['Direct Nova Scotia ➔ Toronto transit', 'Dedicated trailer space (no mixed loads)', 'Full transit protection insurance', 'Guaranteed delivery window'],
    icon: 'truck'
  },
  {
    id: 'residential',
    title: 'Residential Moving',
    badge: 'WHITE-GLOVE CARE',
    description: 'Comprehensive household relocation for apartments, single-family homes, and luxury estates with floor-to-ceiling protection.',
    features: ['Door-to-door full handling', 'Furniture disassembly & assembly', 'Floor runners and door-jamb shields', 'Specialty mattress & TV crating'],
    icon: 'home'
  },
  {
    id: 'commercial',
    title: 'Commercial & Office',
    badge: 'ZERO DOWNTIME',
    description: 'Precision relocation for corporate offices, retail spaces, medical facilities, and executive suites designed to minimize business downtime.',
    features: ['After-hours & weekend schedules', 'IT equipment & server relocation', 'Disassembly of modular workstations', 'Asset tagging & inventory logs'],
    icon: 'building'
  },
  {
    id: 'packing',
    title: 'Professional Packing',
    badge: 'METICULOUS',
    description: 'Industrial-grade packaging solutions utilizing reinforced double-wall cartons, custom bubble encasements, and wardrobe boxes.',
    features: ['Full or partial packing options', 'Fragile porcelain & artwork crating', 'Color-coded room indexing', 'Unpacking and debris disposal'],
    icon: 'package-check'
  },
  {
    id: 'loading',
    title: 'Loading & Securing',
    badge: 'PRECISION LOGISTICS',
    description: 'Engineered loading protocols ensuring balanced axle weights, secure ratchet anchoring, and zero internal cargo shifting.',
    features: ['Heavy equipment ramps & dollies', 'E-track wall anchor strapping', 'Padded blanket wrapping for every item', 'Rigid climate control airflow'],
    icon: 'lock'
  },
  {
    id: 'local',
    title: 'Local Moving & Hauling',
    badge: 'COMMUNITY FOCUSED',
    description: 'Prompt regional hauling across Halifax, Dartmouth, Bedford, and broader Nova Scotia with same-day availability.',
    features: ['Rapid dispatch response', 'Hourly or flat-rate pricing', 'Single-item heavy hauling (pianos, safes)', 'Eco-friendly disposal options'],
    icon: 'compass'
  }
];

export const TRUST_PILLARS = [
  {
    step: '01',
    title: 'PROTECTED',
    description: 'Every single piece of furniture, electronics, and delicate glassware is encased in commercial moving blankets and impact-resistant bubble shielding.'
  },
  {
    step: '02',
    title: 'SECURED',
    description: 'Industrial ratchet straps and internal E-track lockbars hold cargo immovably against all road vibrations, turns, and weather conditions.'
  },
  {
    step: '03',
    title: 'ORGANIZED',
    description: 'High-density digital inventory tagging ensures every box is accounted for at pickup, throughout the 1,800 km transit, and during unloading.'
  },
  {
    step: '04',
    title: 'DELIVERED',
    description: 'Direct room-of-choice placement, furniture re-assembly, and full walkthrough inspection before our crew departs.'
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'David & Sarah M.',
    route: 'Halifax, NS ➔ Downtown Toronto, ON',
    rating: 5,
    date: 'Verified Move',
    review: 'Relocating our 4-bedroom home across 1,800 km felt overwhelming until NS Movers stepped in. The black trailer arrived spotless, every antique was wrapped in thick quilted pads, and our delivery in Toronto was 15 minutes ahead of schedule without a scratch.',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Marcus L.',
    route: 'Dartmouth, NS ➔ Mississauga, ON',
    rating: 5,
    date: 'Verified Move',
    review: 'The communication was exemplary. We received real-time updates as the truck passed Quebec and Ottawa. Truly automotive-grade professionalism—not your average moving crew. Worth every penny.',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Elena R.',
    route: 'Bedford, NS ➔ Vaughan, ON',
    rating: 5,
    date: 'Verified Move',
    review: 'Packed on Tuesday morning in Nova Scotia, delivered Thursday evening in Ontario. The crew took incredible care of our grand piano and art collection. Could not recommend NS Movers and Haulers more highly.',
    verified: true
  }
];

export const COMPANY_DETAILS = {
  name: 'NS Movers and Haulers Inc.',
  tagline: 'Reliable. Professional. On Time.',
  phone: '+1 (902) 555-0199',
  tollFree: '1-800-555-MOVE',
  email: 'dispatch@nsmovershaulers.com',
  addressNS: '1420 Harbour View Dr, Halifax, NS B3H 4R2',
  addressON: '88 Queens Quay W, Suite 2500, Toronto, ON M5J 0B8',
  hours: 'Monday – Sunday: 7:00 AM – 9:00 PM AST'
};
