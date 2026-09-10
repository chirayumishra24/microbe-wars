export interface OrganismItem {
  id: string;
  name: string;
  trophicLevel: 'Producer' | 'Primary Consumer' | 'Secondary Consumer' | 'Tertiary Consumer' | 'Apex Predator' | 'Decomposer';
  icon: string;
  energyRole: string;
  imageColor: string;
}

export const CHAIN_ORGANISMS: OrganismItem[] = [
  { id: 'grass', name: 'Grass', trophicLevel: 'Producer', icon: '🌱', energyRole: 'Harnesses sunlight energy via photosynthesis', imageColor: '#22C55E' },
  { id: 'caterpillar', name: 'Caterpillar', trophicLevel: 'Primary Consumer', icon: '🐛', energyRole: 'Herbivore feeding on plant leaves', imageColor: '#84CC16' },
  { id: 'bird', name: 'Songbird', trophicLevel: 'Secondary Consumer', icon: '🐦', energyRole: 'Carnivore/Omnivore consuming insects', imageColor: '#38BDF8' },
  { id: 'eagle', name: 'Eagle', trophicLevel: 'Apex Predator', icon: '🦅', energyRole: 'Top predator hunting small animals and birds', imageColor: '#F59E0B' },
  { id: 'bacteria', name: 'Soil Bacteria', trophicLevel: 'Decomposer', icon: '🦠', energyRole: 'Breaks down dead matter & returns nutrients', imageColor: '#10B981' },
];

export interface WebNode {
  id: string;
  label: string;
  category: 'producer' | 'herbivore' | 'predator' | 'decomposer';
  icon: string;
  x: number; // percentage in SVG canvas
  y: number;
}

export const WEB_NODES: WebNode[] = [
  { id: 'plants', label: 'Plants & Berries', category: 'producer', icon: '🌿', x: 20, y: 80 },
  { id: 'insects', label: 'Insects', category: 'herbivore', icon: '🦗', x: 30, y: 55 },
  { id: 'mouse', label: 'Mouse', category: 'herbivore', icon: '🐭', x: 50, y: 70 },
  { id: 'rabbit', label: 'Rabbit', category: 'herbivore', icon: '🐇', x: 70, y: 75 },
  { id: 'frog', label: 'Frog', category: 'predator', icon: '🐸', x: 25, y: 35 },
  { id: 'bird', label: 'Bird', category: 'predator', icon: '🐦', x: 45, y: 45 },
  { id: 'snake', label: 'Snake', category: 'predator', icon: '🐍', x: 65, y: 45 },
  { id: 'eagle', label: 'Eagle', category: 'predator', icon: '🦅', x: 48, y: 15 },
  { id: 'fungi', label: 'Fungi & Mold', category: 'decomposer', icon: '🍄', x: 82, y: 25 },
  { id: 'bacteria', label: 'Decomposing Bacteria', category: 'decomposer', icon: '🦠', x: 85, y: 60 }
];

export interface WebConnection {
  from: string;
  to: string;
  label: string;
}

export const VALID_WEB_CONNECTIONS: WebConnection[] = [
  { from: 'plants', to: 'insects', label: 'Insects eat Plants' },
  { from: 'plants', to: 'mouse', label: 'Mouse eats seeds & plants' },
  { from: 'plants', to: 'rabbit', label: 'Rabbit grazes on plants' },
  { from: 'insects', to: 'frog', label: 'Frog catches insects' },
  { from: 'insects', to: 'bird', label: 'Bird eats insects' },
  { from: 'frog', to: 'snake', label: 'Snake eats frog' },
  { from: 'mouse', to: 'snake', label: 'Snake preys on mouse' },
  { from: 'mouse', to: 'eagle', label: 'Eagle hunts mouse' },
  { from: 'rabbit', to: 'eagle', label: 'Eagle hunts rabbit' },
  { from: 'bird', to: 'eagle', label: 'Eagle attacks songbird' },
  { from: 'snake', to: 'eagle', label: 'Eagle preys on snake' },
  { from: 'eagle', to: 'bacteria', label: 'Decomposers recycle apex predator' },
  { from: 'rabbit', to: 'fungi', label: 'Decomposers recycle fallen organic waste' },
  { from: 'plants', to: 'bacteria', label: 'Decomposers break down fallen plant matter' },
];
