export interface MicrobeMystery {
  id: string;
  name: string;
  category: 'Bacteria' | 'Fungi' | 'Algae' | 'Protozoa' | 'Virus';
  options: string[];
  clues: {
    habitat: string;
    shape: string;
    size: string;
    role: string;
  };
  explanation: string;
  color: string;
  features: string[];
}

export const MICROBE_MYSTERIES: MicrobeMystery[] = [
  {
    id: 'bacillus',
    name: 'Bacteria (Rod-shaped Bacillus)',
    category: 'Bacteria',
    options: ['Bacteria', 'Virus', 'Fungi', 'Protozoa'],
    clues: {
      habitat: 'Found in soil, water, air, and animal gut',
      shape: 'Rod-shaped (single-celled organism with no nucleus)',
      size: 'Microscopic (approx 1 to 2 micrometers)',
      role: 'Essential decomposer, nutrient cycler, and soil enricher'
    },
    explanation: 'Correct! Bacteria are microscopic single-celled prokaryotes. Many species decompose dead organic matter and replenish vital nitrogen in soil.',
    color: '#34D399',
    features: ['Flagella tails', 'Cell wall', 'No true nucleus', 'Rapid binary fission']
  },
  {
    id: 'yeast',
    name: 'Fungi (Budding Yeast)',
    category: 'Fungi',
    options: ['Algae', 'Fungi', 'Virus', 'Protozoa'],
    clues: {
      habitat: 'Surface of fruits, plants, and used in kitchens',
      shape: 'Oval single cells that reproduce by budding',
      size: '3 to 4 micrometers in diameter',
      role: 'Ferments sugars into carbon dioxide gas and alcohol'
    },
    explanation: 'Spot on! Yeast is a microscopic single-celled fungus. In breadmaking, it consumes sugars and releases CO2 gas bubbles that make the dough rise!',
    color: '#FBBF24',
    features: ['Budding cell buds', 'Chitin cell wall', 'Eukaryotic nucleus', 'Fermenting power']
  },
  {
    id: 'chlorella',
    name: 'Algae (Green Micro-Algae)',
    category: 'Algae',
    options: ['Protozoa', 'Fungi', 'Algae', 'Bacteria'],
    clues: {
      habitat: 'Freshwater ponds, rivers, and sunlit moist soil',
      shape: 'Spherical green cells packed with chloroplasts',
      size: '2 to 10 micrometers',
      role: 'Produces oxygen and glucose through photosynthesis'
    },
    explanation: 'Awesome! Micro-algae contain chlorophyll and harness sunlight to create oxygen. They form the base producer level in aquatic food webs.',
    color: '#10B981',
    features: ['Chloroplasts', 'Photosynthetic', 'Sunlight-absorbing', 'Aquatic producer']
  },
  {
    id: 'amoeba',
    name: 'Protozoa (Amoeba proteus)',
    category: 'Protozoa',
    options: ['Virus', 'Protozoa', 'Bacteria', 'Algae'],
    clues: {
      habitat: 'Pond water and damp leaf litter',
      shape: 'Shapeless, constantly shifting with false feet (pseudopodia)',
      size: 'Relatively large for microbes (200 to 500 micrometers)',
      role: 'Active consumer that hunts bacteria and smaller algae'
    },
    explanation: 'Brilliant! Amoebas are single-celled protozoans (consumers) that engulf their food via phagocytosis using cytoplasmic extensions called pseudopodia.',
    color: '#60A5FA',
    features: ['Pseudopodia (false feet)', 'Contractile vacuole', 'Hunts microbes', 'Flexible membrane']
  },
  {
    id: 'bacteriophage',
    name: 'Virus (Bacteriophage T4)',
    category: 'Virus',
    options: ['Bacteria', 'Virus', 'Fungi', 'Protozoa'],
    clues: {
      habitat: 'Everywhere host bacteria exist; soil, sewage, and water',
      shape: 'Icosahedral geometric protein head with spring sheath and landing leg fibers',
      size: 'Ultramicroscopic (approx 100 to 200 nanometers — cannot see under light microscope)',
      role: 'Invades specific bacteria to replicate, keeping bacterial populations regulated'
    },
    explanation: 'Outstanding! Bacteriophages are viruses that specifically target bacteria. They are non-cellular genetic packages wrapped in a geometric protein capsid.',
    color: '#8B5CF6',
    features: ['Geometric capsid head', 'Contractile tail sheath', 'Leg fibers', 'Requires host cell']
  },
  {
    id: 'paramecium',
    name: 'Protozoa (Paramecium caudatum)',
    category: 'Protozoa',
    options: ['Algae', 'Fungi', 'Protozoa', 'Bacteria'],
    clues: {
      habitat: 'Warm stagnant freshwater ponds and organic puddles',
      shape: 'Slipper-shaped single cell covered with thousands of coordinated beating cilia',
      size: 'Visible under low power (150 to 300 micrometers)',
      role: 'Rapid consumer feeding on bacteria and yeast via an oral groove funnel'
    },
    explanation: 'Spectacular! Paramecium is an active, swimming protozoan covered in synchronous cilia that propel it rapidly while directing food particles into its oral groove.',
    color: '#0EA5E9',
    features: ['Rhythmic cilia fringe', 'Oral groove mouth', 'Two nuclei (macro & micro)', 'Contractile vacuoles']
  }
];

export interface SorterCard {
  id: string;
  name: string;
  icon: string;
  category: 'Producers' | 'Consumers' | 'Decomposers' | 'Other Microorganisms';
  hint: string;
}

export const SORTER_CARDS: SorterCard[] = [
  { id: 'sc1', name: 'Microscopic Algae', icon: '🌿', category: 'Producers', hint: 'Uses photosynthesis to make energy' },
  { id: 'sc2', name: 'Cyanobacteria', icon: '☀️', category: 'Producers', hint: 'Ancient blue-green bacteria producing oxygen' },
  { id: 'sc3', name: 'Amoeba', icon: '🦠', category: 'Consumers', hint: 'Hunts and engulfs smaller microbes' },
  { id: 'sc4', name: 'Paramecium', icon: '🏊', category: 'Consumers', hint: 'Ciliated consumer swimming after prey' },
  { id: 'sc5', name: 'Bread Mold (Fungi)', icon: '🍄', category: 'Decomposers', hint: 'Releases enzymes to break down old bread' },
  { id: 'sc6', name: 'Soil Bacteria', icon: '🌱', category: 'Decomposers', hint: 'Breaks down fallen leaves into rich humus' },
  { id: 'sc7', name: 'Bacteriophage', icon: '🔬', category: 'Other Microorganisms', hint: 'Specialized virus that invades bacteria' },
  { id: 'sc8', name: 'Yeast Cells', icon: '🍞', category: 'Decomposers', hint: 'Breaks down sugars in fermentation' }
];

export interface TrueFalseQuestion {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export const TRUE_FALSE_QUESTIONS: TrueFalseQuestion[] = [
  {
    id: 'tf1',
    statement: 'All microorganisms are harmful and cause diseases.',
    isTrue: false,
    explanation: 'FALSE! The vast majority of microorganisms are beneficial. They recycle nutrients, make medicines, help digest food in our gut, and produce foods like cheese and yogurt.'
  },
  {
    id: 'tf2',
    statement: 'Without decomposers, dead plants and animals would pile up and nutrients would run out.',
    isTrue: true,
    explanation: 'TRUE! Decomposers (bacteria and fungi) return vital chemical nutrients like carbon, nitrogen, and phosphorus back into the soil for new plant growth.'
  },
  {
    id: 'tf3',
    statement: 'Microscopic algae produce more than 50% of the Earth’s oxygen through photosynthesis.',
    isTrue: true,
    explanation: 'TRUE! Marine phytoplankton and micro-algae produce at least half of the oxygen in Earth’s atmosphere.'
  },
  {
    id: 'tf4',
    statement: 'Viruses can grow and reproduce all on their own without a host cell.',
    isTrue: false,
    explanation: 'FALSE! Viruses cannot replicate on their own. They must invade a living host cell and hijack its machinery to make copies.'
  }
];
