export interface DecayTimelineStep {
  day: number;
  title: string;
  appleVisual: {
    color: string;
    softness: string;
    moldCoverage: number; // percentage
    sporesVisible: boolean;
    wrinkles: number;
  };
  description: string;
  microbeActivity: string;
  soilImpact: string;
}

export const DECAY_TIMELINE: DecayTimelineStep[] = [
  {
    day: 1,
    title: 'Day 1 — Fresh Fallen Apple',
    appleVisual: {
      color: '#EF4444',
      softness: 'Firm and crisp',
      moldCoverage: 0,
      sporesVisible: false,
      wrinkles: 0
    },
    description: 'Fresh apple has fallen to the forest floor. Protective skin is intact, but microscopic bacteria and fungal spores naturally land on the surface.',
    microbeActivity: 'Early colonization: Microbes begin testing the skin surface for microscopic punctures or bruises.',
    soilImpact: 'No nutrients released yet.'
  },
  {
    day: 3,
    title: 'Day 3 — Skin Breaks Down',
    appleVisual: {
      color: '#B91C1C',
      softness: 'Soft brown spots forming',
      moldCoverage: 15,
      sporesVisible: false,
      wrinkles: 15
    },
    description: 'Enzymes from bacteria begin softening the apple pectin. Moisture builds up and soft brown discoloration appears.',
    microbeActivity: 'Bacteria multiply rapidly inside bruised tissue, digesting sugars into simple acids.',
    soilImpact: 'Trace moisture and soluble sugars seep into upper soil.'
  },
  {
    day: 7,
    title: 'Day 7 — Fungal Mold Hyphae Bloom',
    appleVisual: {
      color: '#78350F',
      softness: 'Mushy, sunken collapse',
      moldCoverage: 55,
      sporesVisible: true,
      wrinkles: 45
    },
    description: 'Fungal mycelium webs expand over the fruit. White and bluish-green fuzzy colonies appear as mold releases digestive juices.',
    microbeActivity: 'Fungi spread branch-like filaments (hyphae) deep into the fruit pulp, secreting enzymes that digest complex carbohydrates.',
    soilImpact: 'Significant potassium and sugars enrich local microbes in the soil.'
  },
  {
    day: 14,
    title: 'Day 14 — Full Decomposition & Nutrient Recycling',
    appleVisual: {
      color: '#451A03',
      softness: 'Completely broken down humus',
      moldCoverage: 90,
      sporesVisible: true,
      wrinkles: 80
    },
    description: 'The apple has completely collapsed into dark rich compost (humus). Virtually all organic material has been recycled.',
    microbeActivity: 'Secondary decomposers and soil nematodes finish feeding. Bacteria convert ammonia into nitrates for plant roots.',
    soilImpact: 'Rich nitrogen, phosphorus, and organic carbon revitalizes surrounding soil and feeds nearby plants!'
  }
];

export interface InvestigationClue {
  id: number;
  clueText: string;
  icon: string;
}

export const DECAY_INVESTIGATION_CLUES: InvestigationClue[] = [
  { id: 1, clueText: 'Dead plant tissue is being softened and broken down at the cellular level.', icon: '🍂' },
  { id: 2, clueText: 'Vital minerals (Nitrogen, Phosphorus, Carbon) are seeping back into surrounding topsoil.', icon: '🌱' },
  { id: 3, clueText: 'Extracellular enzymes are secreted by organisms too small to see with the naked eye.', icon: '🔬' },
  { id: 4, clueText: 'The process speeds up when the environment is warm, dark, and humid.', icon: '💧' }
];
