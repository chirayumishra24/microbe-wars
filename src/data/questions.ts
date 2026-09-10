export interface RapidFireQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const RAPID_FIRE_QUESTIONS: RapidFireQuestion[] = [
  {
    id: 'rf1',
    topic: 'Microorganisms',
    question: 'Which of the following is a primary decomposer in the ecosystem?',
    options: ['Songbird', 'Mushroom (Fungus)', 'Rabbit', 'Grasshopper'],
    correctIndex: 1,
    explanation: 'Mushrooms and fungi decompose dead wood and organic matter.'
  },
  {
    id: 'rf2',
    topic: 'Food Chains',
    question: 'In a food chain, what organism always starts at the base?',
    options: ['Apex Predator', 'Producer', 'Herbivore', 'Carnivore'],
    correctIndex: 1,
    explanation: 'Producers (plants and algae) harness sunlight energy at the base of every chain.'
  },
  {
    id: 'rf3',
    topic: 'Decay',
    question: 'Which environmental condition speeds up the rate of bacterial decay?',
    options: ['Freezing temperatures', 'Warmth and moisture', 'Completely dry air', 'Sterile vacuum'],
    correctIndex: 1,
    explanation: 'Bacteria and fungi thrive and reproduce fastest in warm, humid environments.'
  },
  {
    id: 'rf4',
    topic: 'Microorganisms in Food',
    question: 'Which gas produced by yeast causes bread dough to rise?',
    options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Helium'],
    correctIndex: 1,
    explanation: 'Yeast fermentation produces carbon dioxide bubbles that expand bread dough.'
  },
  {
    id: 'rf5',
    topic: 'Food Webs',
    question: 'What do the arrows in a food chain diagram represent?',
    options: ['Direction of animal movement', 'Flow of energy and biomass', 'Size of organisms', 'Number of species'],
    correctIndex: 1,
    explanation: 'Arrows always point from the organism eaten to the organism eating it (flow of energy).'
  },
  {
    id: 'rf6',
    topic: 'Microbes & Health',
    question: 'What type of medicine is specifically used to kill disease-causing bacteria?',
    options: ['Antibiotics', 'Antivirals', 'Fertilizers', 'Vitamins'],
    correctIndex: 0,
    explanation: 'Antibiotics kill or inhibit bacterial growth (e.g., penicillin derived from mold).'
  },
  {
    id: 'rf7',
    topic: 'Environment',
    question: 'What microscopic ocean organisms produce a large portion of Earth’s oxygen?',
    options: ['Jellyfish', 'Phytoplankton (Micro-algae)', 'Deep sea crabs', 'Sponges'],
    correctIndex: 1,
    explanation: 'Phytoplankton produce over 50% of the oxygen in our planetary atmosphere.'
  },
  {
    id: 'rf8',
    topic: 'Decay',
    question: 'What is the dark, nutrient-rich soil organic matter created by decomposition called?',
    options: ['Silt', 'Humus', 'Sand', 'Clay'],
    correctIndex: 1,
    explanation: 'Humus is the rich organic soil substance formed by the decay of plant and animal leaves.'
  }
];

export interface RiskRoundQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export const RISK_ROUND_QUESTIONS: RiskRoundQuestion[] = [
  {
    id: 'rr1',
    question: '“Microorganisms are always harmful to humans and ecosystems.” Is this True or False?',
    options: ['TRUE — They should all be eliminated', 'FALSE — Most are beneficial or harmless'],
    correctIndex: 1,
    explanation: 'Less than 1% of known microorganisms cause disease! Over 99% are vital for planetary life, digestion, nutrient cycling, and oxygen production.',
    hint: 'Think about our gut microbiome and bread making!'
  },
  {
    id: 'rr2',
    question: 'If all decomposers were suddenly removed from Earth, what would happen first?',
    options: ['Dead organic matter would pile up indefinitely', 'Plants would grow twice as fast', 'Animals would turn into producers', 'Air would turn entirely into pure oxygen'],
    correctIndex: 0,
    explanation: 'Without decomposers, dead plants and animals cannot be recycled. Nutrients stay trapped in dead bodies, and topsoil becomes exhausted.',
    hint: 'Decomposers are the planetary clean-up crew!'
  },
  {
    id: 'rr3',
    question: 'Can bacteria survive in extreme environments like boiling volcanic hot springs?',
    options: ['NO — Bacteria only survive in moderate human temperatures', 'YES — Extremophile bacteria thrive in boiling springs, ice, and acid'],
    correctIndex: 1,
    explanation: 'Extremophiles (like Thermus aquaticus) flourish in boiling hydrothermal springs at over 80°C and even deep beneath glacial ice!',
    hint: 'Look up hydrothermal vents and hot springs in Yellowstone!'
  }
];

export interface FinalEmergencyStep {
  stepNumber: number;
  title: string;
  problem: string;
  question: string;
  options: string[];
  correctIndex: number;
  restorationEffect: string;
  visualStage: 'damaged' | 'healing-1' | 'healing-2' | 'healing-3' | 'healing-4' | 'restored';
}

export const FINAL_EMERGENCY_STEPS: FinalEmergencyStep[] = [
  {
    stepNumber: 1,
    title: 'Phase 1: Soil Sterilization Crisis',
    problem: 'Toxic runoff has eliminated all soil microorganisms. Fallen dead leaves are suffocating seedlings.',
    question: 'Which microscopic organisms must we re-introduce to restart natural decomposition?',
    options: ['Aquatic Salmon', 'Decomposing Bacteria & Saprophytic Fungi', 'Eagles & Hawks', 'Grasshoppers only'],
    correctIndex: 1,
    restorationEffect: 'Decomposing microbes repopulate soil! Dead leaves begin to break down into rich loam.',
    visualStage: 'healing-1'
  },
  {
    stepNumber: 2,
    title: 'Phase 2: Broken Food Chain',
    problem: 'The primary consumers have vanished, breaking the energy link between grass and songbirds.',
    question: 'Which organism correctly restores this missing trophic link: Grass ➔ [ ??? ] ➔ Songbird ➔ Eagle?',
    options: ['Fox', 'Herbivorous Caterpillar / Insects', 'Apex Wolf', 'Shark'],
    correctIndex: 1,
    restorationEffect: 'Insects return to pollinate and feed primary predators! Energy flows smoothly upwards.',
    visualStage: 'healing-2'
  },
  {
    stepNumber: 3,
    title: 'Phase 3: Aquatic Anoxia',
    problem: 'The lake is murky and depleted of dissolved oxygen. Fish and amphibians are struggling.',
    question: 'Which photosynthetic microbes can rapidly replenish aquatic dissolved oxygen?',
    options: ['Phytoplankton & Micro-Algae', 'Parasitic viruses', 'House dust mites', 'Earthworms'],
    correctIndex: 0,
    restorationEffect: 'Micro-algae photosynthesize underwater! The water turns crystal clear and oxygen levels surge.',
    visualStage: 'healing-3'
  },
  {
    stepNumber: 4,
    title: 'Phase 4: Nutrient Cycle Bottleneck',
    problem: 'Nitrogen gas in the air cannot be absorbed directly by trees and flowering plants.',
    question: 'How do plants acquire usable nitrogen from the surrounding environment?',
    options: ['Plants absorb rocks directly', 'Nitrogen-fixing bacteria convert atmospheric N2 into soluble nitrates', 'Birds drop nitrogen tablets', 'Clouds rain pure liquid nitrogen'],
    correctIndex: 1,
    restorationEffect: 'Nitrogen-fixing bacteria on plant root nodules turn atmospheric nitrogen into plant food! Trees bloom vibrantly.',
    visualStage: 'healing-4'
  },
  {
    stepNumber: 5,
    title: 'Phase 5: Master Ecosystem Synthesis',
    problem: 'Final test: Prove the fundamental principle of ecosystem resilience.',
    question: 'Why are microscopic organisms described as having the “Biggest Impact” on our planet?',
    options: [
      'Because they are the largest animals in physical body weight',
      'Because they form the indispensable foundation for oxygen production, nutrient cycling, and waste recycling',
      'Because they make plants stop growing altogether',
      'Because they consume all other species'
    ],
    correctIndex: 1,
    restorationEffect: 'FULL RESTORATION ACHIEVED! The ecosystem flourishes with wildlife, lush flora, clean rivers, and vibrant balance!',
    visualStage: 'restored'
  }
];

export const LEARNING_TAKEAWAYS = [
  {
    icon: '🦠',
    title: 'Microbes Are Everywhere',
    desc: 'Microorganisms (bacteria, fungi, micro-algae, protozoa) thrive in soil, water, air, and even in extreme volcanic hot springs. Over 99% are harmless or beneficial to life!'
  },
  {
    icon: '🌱',
    title: 'Energy Flows Through Webs',
    desc: 'Producers harness sunlight, herbivores eat producers, carnivores hunt herbivores, and decomposers recycle all organic waste. Energy flows continuously through interconnected food webs.'
  },
  {
    icon: '🍂',
    title: 'Decomposers Are Nature’s Recyclers',
    desc: 'Bacteria and fungi release digestive enzymes to break down fallen leaves and dead matter, creating fertile humus and preventing dead matter from burying the planet.'
  },
  {
    icon: '♻️',
    title: 'The Closed Nutrient Loop',
    desc: 'Minerals like nitrogen, phosphorus, and carbon are finite on Earth. Without microbial recycling, soil would deplete of nutrients and plants could no longer grow.'
  },
  {
    icon: '🍞',
    title: 'Microbes in Food & Biotechnology',
    desc: 'Beneficial microorganisms give us bread, yogurt, cheese, pickles, and medicines like antibiotics. Small organisms truly have a monumental impact!'
  }
];
