export type ConcreteShape = 'slab' | 'footing' | 'column' | 'circle' | 'steps';

export interface Preset {
  label: string;
  value: number;
}

export interface ShapeConfig {
  hasRect: boolean;
  hasDia: boolean;
  hasSteps: boolean;
  hasDepth: boolean;
  depthLabel: string;
  defaultDepth: number;
  presets: Preset[];
}

export interface CalculationResult {
  netVolume: number;
  wastePercent: number;
  totalVolume: number;
  bags25kg: number;
  bags20kg: number;
  readyMixOrder: number;
  wetWeightTonnes: number;
  bgCostLow: number;
  bgCostHigh: number;
  rmCostLow: number;
  rmCostHigh: number;
  recommendation: 'bags' | 'either' | 'ready';
  recommendationNote: string;
}

export type PageRoute =
  | 'calculator'
  | 'blog'
  | 'how-many-bags-of-concrete-per-cubic-metre'
  | 'concrete-shed-base-how-much-do-i-need'
  | 'ready-mix-vs-bagged-concrete'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms';
