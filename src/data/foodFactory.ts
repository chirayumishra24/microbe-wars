export interface FoodFactoryItem {
  id: string;
  foodName: string;
  foodIcon: string;
  baseIngredient: string;
  correctMicrobe: string;
  correctProcess: string;
  microbeOptions: string[];
  processOptions: string[];
  explanation: string;
  animationEmoji: string;
}

export const FOOD_FACTORY_ITEMS: FoodFactoryItem[] = [
  {
    id: 'yogurt',
    foodName: 'Creamy Yogurt',
    foodIcon: '🥣',
    baseIngredient: 'Fresh Milk',
    correctMicrobe: 'Lactobacillus (Bacteria)',
    correctProcess: 'Lactic Acid Fermentation',
    microbeOptions: ['Lactobacillus (Bacteria)', 'Yeast (Fungi)', 'Micro-Algae', 'Bacteriophage Virus'],
    processOptions: ['Lactic Acid Fermentation', 'Alcoholic Fermentation', 'Photosynthesis', 'Viral Lysis'],
    explanation: 'Lactobacillus bacteria ferment milk lactose sugar into lactic acid, which thickens the milk proteins and creates that delicious tangy flavor!',
    animationEmoji: '🥛 ➔ 🦠 ➔ 🥣'
  },
  {
    id: 'bread',
    foodName: 'Warm Crusty Bread',
    foodIcon: '🍞',
    baseIngredient: 'Wheat Flour & Water',
    correctMicrobe: 'Yeast (Fungi)',
    correctProcess: 'CO2 Gas & Alcoholic Fermentation',
    microbeOptions: ['Yeast (Fungi)', 'Cyanobacteria', 'Protozoa', 'Soil Streptomyces'],
    processOptions: ['CO2 Gas & Alcoholic Fermentation', 'Nitrogen Fixation', 'Cellulose Digestion', 'Acid Oxidation'],
    explanation: 'Yeast feasts on sugars in dough, releasing carbon dioxide gas bubbles that expand inside the dough matrix, making bread light, fluffy, and spongy!',
    animationEmoji: '🌾 ➔ 🍄 ➔ 🍞'
  },
  {
    id: 'cheese',
    foodName: 'Aged Swiss Cheese',
    foodIcon: '🧀',
    baseIngredient: 'Milk Curds',
    correctMicrobe: 'Lactic Bacteria & Mold Cultures',
    correctProcess: 'Curdling & Fermentative Aging',
    microbeOptions: ['Lactic Bacteria & Mold Cultures', 'Green Algae', 'Amoeba', 'Viruses'],
    processOptions: ['Curdling & Fermentative Aging', 'Cellular Photosynthesis', 'Combustion', 'Dehydration only'],
    explanation: 'Lactic bacteria acidify milk to form solid curds, and friendly ripening molds develop distinctive savory flavors and textural holes!',
    animationEmoji: '🥛 ➔ 🦠 ➔ 🧀'
  },
  {
    id: 'pickles',
    foodName: 'Crunchy Dill Pickles',
    foodIcon: '🥒',
    baseIngredient: 'Cucumbers & Salt Brine',
    correctMicrobe: 'Leuconostoc / Lactobacillus Bacteria',
    correctProcess: 'Anaerobic Brine Fermentation',
    microbeOptions: ['Leuconostoc / Lactobacillus Bacteria', 'Yeast only', 'Marine Kelp', 'Rotifers'],
    processOptions: ['Anaerobic Brine Fermentation', 'Sun Drying', 'High heat boiling', 'Aerobic respiration'],
    explanation: 'Salt suppresses spoilage microbes while allowing beneficial lactic bacteria to convert natural sugars into preservative acids that keep pickles crisp and safe!',
    animationEmoji: '🥒 ➔ 🦠 ➔ 🫙'
  }
];
