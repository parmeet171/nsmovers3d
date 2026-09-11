// Configuration and manifest for the 1,149 continuous animation frames

export interface JourneyMilestone {
  id: string;
  stepNum: string;
  name: string;
  shortLabel: string;
  quote: string;
  actionText: string;
  startProgress: number;
  endProgress: number;
  startFrame: number;
  endFrame: number;
  tagline: string;
  headline: string;
  subtext: string;
  metaBadge?: string;
  ctaText?: string;
}

const pad3 = (num: number): string => num.toString().padStart(3, '0');

// Generate all 1,149 frame URLs in linear sequence
export const generateFrameSequence = (): string[] => {
  const frames: string[] = [];

  // Split 1: 300 frames (1 to 300)
  for (let i = 1; i <= 300; i++) {
    frames.push(`/frames/split-1/ezgif-frame-${pad3(i)}.jpg`);
  }

  // Split 2: 300 frames (1 to 300)
  for (let i = 1; i <= 300; i++) {
    frames.push(`/frames/split-2/ezgif-frame-${pad3(i)}.jpg`);
  }

  // Split 3: 300 frames (1 to 300)
  for (let i = 1; i <= 300; i++) {
    frames.push(`/frames/split-3/ezgif-frame-${pad3(i)}.jpg`);
  }

  // Split 4: 249 frames (1 to 249)
  for (let i = 1; i <= 249; i++) {
    frames.push(`/frames/split-4/ezgif-frame-${pad3(i)}.jpg`);
  }

  return frames;
};

export const TOTAL_FRAMES = 1149;
export const ALL_FRAMES = generateFrameSequence();

// The 12 exact cinematic milestones requested by the user
export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    id: 'hero',
    stepNum: '01',
    name: 'HERO',
    shortLabel: 'HERO',
    quote: "Moving shouldn't be hard.",
    actionText: 'Truck starts',
    startProgress: 0.0,
    endProgress: 0.09,
    startFrame: 0,
    endFrame: 100,
    tagline: 'RELIABLE. PROFESSIONAL. ON TIME.',
    headline: 'MOVING YOU\nFORWARD,\nEVERY STEP\nOF THE WAY.',
    subtext: 'From homes to high-rises, we make your journey simple. Nova Scotia → Toronto.',
    metaBadge: 'AUTOMOTIVE-GRADE LOGISTICS'
  },
  {
    id: 'pickup',
    stepNum: '02',
    name: 'PICKUP',
    shortLabel: 'PICKUP',
    quote: 'Your journey starts here.',
    actionText: 'Truck reaches house',
    startProgress: 0.09,
    endProgress: 0.18,
    startFrame: 101,
    endFrame: 200,
    tagline: 'STAGE 02 ― ORIGIN ARRIVAL',
    headline: 'FROM YOUR DOOR\nTO YOUR NEW HOME.',
    subtext: 'Our heavy-duty fleet arrives on schedule at your Nova Scotia residence, prepared for every detail.',
    metaBadge: 'ORIGIN RESIDENCE'
  },
  {
    id: 'packing',
    stepNum: '03',
    name: 'PACKING',
    shortLabel: 'PACKING',
    quote: 'Packed with care.',
    actionText: 'Boxes appear',
    startProgress: 0.18,
    endProgress: 0.27,
    startFrame: 201,
    endFrame: 300,
    tagline: 'STAGE 03 ― WHITE-GLOVE PREP',
    headline: 'EVERY DETAIL\nPREPARED.',
    subtext: 'From furniture to fragile heirlooms, every box is staged, custom-padded, and categorized for total transit security.',
    metaBadge: 'PROTECTIVE WRAP APPLIED'
  },
  {
    id: 'loading',
    stepNum: '04',
    name: 'LOADING',
    shortLabel: 'LOADING',
    quote: 'Loaded. Secured. Ready.',
    actionText: 'Trailer fills',
    startProgress: 0.27,
    endProgress: 0.36,
    startFrame: 301,
    endFrame: 410,
    tagline: 'STAGE 04 ― RIGID STABILITY',
    headline: 'LOADED & BALANCED\nFOR THE HIGHWAY.',
    subtext: 'Carefully loaded, balanced axle weight distribution, and heavy-duty E-track lockbars anchored.',
    metaBadge: 'CARGO BALANCED & ANCHORED'
  },
  {
    id: 'departure',
    stepNum: '05',
    name: 'DEPARTURE',
    shortLabel: 'DEPARTURE',
    quote: 'Time to move.',
    actionText: 'Trailer doors close • Truck leaves',
    startProgress: 0.36,
    endProgress: 0.46,
    startFrame: 411,
    endFrame: 520,
    tagline: 'STAGE 05 ― EN ROUTE',
    headline: 'TIME TO MOVE.\nHEADING WEST.',
    subtext: 'Trailer doors securely locked. The truck departs Nova Scotia and takes to the open road.',
    metaBadge: 'TRAILER SEALED & LOCKED'
  },
  {
    id: 'route',
    stepNum: '06',
    name: 'ROUTE',
    shortLabel: 'ROUTE',
    quote: 'Nova Scotia → Toronto',
    actionText: 'Camera zooms out • 3D Canada map appears',
    startProgress: 0.46,
    endProgress: 0.56,
    startFrame: 521,
    endFrame: 640,
    tagline: 'STAGE 06 ― THE 1,800 KM CORRIDOR',
    headline: 'NOVA SCOTIA\n━━━━━━━━━━━\nTORONTO',
    subtext: 'Camera ascends into orbit: a cinematic 3D glowing map connecting Halifax, Moncton, Quebec City, Montreal, Ottawa, and Toronto.',
    metaBadge: 'TRANS-CANADA ROUTE'
  },
  {
    id: 'journey',
    stepNum: '07',
    name: 'JOURNEY',
    shortLabel: 'JOURNEY',
    quote: 'Every mile, handled with care.',
    actionText: 'Truck travels across map / highway',
    startProgress: 0.56,
    endProgress: 0.65,
    startFrame: 641,
    endFrame: 745,
    tagline: 'STAGE 07 ― TRANS-PROVINCIAL',
    headline: 'MILES OF CARE.\nON THE ROAD.',
    subtext: 'Through winding coastal roads, dense forests, and long highways, our certified drivers keep transit calm and predictable.',
    metaBadge: 'GPS LIVE TRACKING'
  },
  {
    id: 'safety',
    stepNum: '08',
    name: 'SAFETY',
    shortLabel: 'SAFETY',
    quote: 'Your belongings. Our responsibility.',
    actionText: 'Boxes / furniture secured',
    startProgress: 0.65,
    endProgress: 0.74,
    startFrame: 746,
    endFrame: 840,
    tagline: 'STAGE 08 ― GUARANTEED PROTECTION',
    headline: 'PROTECTED. SECURED.\nORGANIZED. DELIVERED.',
    subtext: 'Calm, trustworthy, professional. 100% comprehensive cargo insurance and shock-absorbed air-ride suspension.',
    metaBadge: '100% INSURED TRANSIT'
  },
  {
    id: 'arrival',
    stepNum: '09',
    name: 'ARRIVAL',
    shortLabel: 'ARRIVAL',
    quote: "Toronto, we're here.",
    actionText: 'Truck reaches destination',
    startProgress: 0.74,
    endProgress: 0.83,
    startFrame: 841,
    endFrame: 935,
    tagline: 'STAGE 09 ― DESTINATION REACHED',
    headline: 'MADE IT.\nTORONTO, WE’RE HERE.',
    subtext: 'The illuminated CN Tower skyline welcomes the truck as it arrives at 123 Toronto, ON on schedule.',
    metaBadge: 'ONTARIO DESTINATION'
  },
  {
    id: 'delivery',
    stepNum: '10',
    name: 'DELIVERY',
    shortLabel: 'DELIVERY',
    quote: 'Delivered with care.',
    actionText: 'Boxes move into house',
    startProgress: 0.83,
    endProgress: 0.91,
    startFrame: 936,
    endFrame: 1030,
    tagline: 'STAGE 10 ― TRUCK → HOUSE',
    headline: 'UNPACKED & PLACED\nROOM BY ROOM.',
    subtext: 'Trailer doors open. Furniture and boxes are unloaded with precision directly into your new rooms and garage.',
    metaBadge: 'ROOM-OF-CHOICE DELIVERY'
  },
  {
    id: 'new_beginning',
    stepNum: '11',
    name: 'NEW BEGINNING',
    shortLabel: 'NEW BEGINNING',
    quote: 'Your new start.',
    actionText: 'Truck drives away',
    startProgress: 0.91,
    endProgress: 0.96,
    startFrame: 1031,
    endFrame: 1100,
    tagline: 'STAGE 11 ― MISSION COMPLETE',
    headline: 'YOUR NEW START.\nCOMPLETELY AT EASE.',
    subtext: 'Delivery complete. The truck drives away into the morning, leaving you settled in your new home without stress.',
    metaBadge: 'HOME SWEET HOME'
  },
  {
    id: 'cta',
    stepNum: '12',
    name: 'CTA',
    shortLabel: 'FREE QUOTE',
    quote: 'Ready for your move?',
    actionText: 'GET A FREE QUOTE',
    startProgress: 0.96,
    endProgress: 1.00,
    startFrame: 1101,
    endFrame: 1148,
    tagline: 'STAGE 12 ― PLAN YOUR MOVE',
    headline: 'YOU MOVE.\nWE HANDLE THE REST.',
    subtext: 'Get your guaranteed flat-rate quote from Nova Scotia to Toronto in under 2 minutes.',
    metaBadge: 'INSTANT BINDING ESTIMATE'
  }
];
