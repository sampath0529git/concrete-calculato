export type ConcreteShape =
  | 'slab'
  | 'footing'
  | 'column'
  | 'circle'
  | 'tube'
  | 'curb'
  | 'steps';

export interface Preset {
  label: string;
  value: number;
}

export type UnitSystem = 'metric' | 'imperial';

export type LengthUnit = 'meters' | 'centimeters' | 'feet' | 'inches' | 'yards';

export type MixRatioKey = '1:2:4' | '1:1.5:3' | '1:3:6' | '1:2:3' | '1:5';

export interface CalculationResult {
  shape: ConcreteShape;
  netVolume: number; // m³
  wastePercent: number;
  totalVolume: number; // m³
  cubicYards: number;
  cubicFeet: number;
  mixRatio: MixRatioKey;
  mixRatioLabel: string;
  // Bag counts
  bags25kg: number;
  bags20kg: number;
  bags60lb: number;
  bags80lb: number;
  // Site-mixed raw aggregate requirements
  cement25kgBags: number;
  sandTonnes: number;
  gravelTonnes: number;
  readyMixOrder: number;
  wetWeightTonnes: number;
  wetWeightLbs: number;
  bgCostLow: number;
  bgCostHigh: number;
  rmCostLow: number;
  rmCostHigh: number;
  recommendation: 'bags' | 'either' | 'ready';
  recommendationNote: string;
}
