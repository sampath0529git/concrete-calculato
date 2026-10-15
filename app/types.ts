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

export type UnitSystem = 'metric' | 'imperial';

export type MixRatioKey = '1:2:4' | '1:1.5:3' | '1:3:6' | '1:2:3' | '1:5';

export interface CalculationResult {
  netVolume: number;
  wastePercent: number;
  totalVolume: number;
  cubicYards?: number;
  mixRatio: MixRatioKey;
  mixRatioLabel: string;
  bags25kg: number;
  bags20kg: number;
  // Site-mixed aggregate requirements
  cement25kgBags: number;
  sandTonnes: number;
  gravelTonnes: number;
  readyMixOrder: number;
  wetWeightTonnes: number;
  bgCostLow: number;
  bgCostHigh: number;
  rmCostLow: number;
  rmCostHigh: number;
  recommendation: 'bags' | 'either' | 'ready';
  recommendationNote: string;
}
