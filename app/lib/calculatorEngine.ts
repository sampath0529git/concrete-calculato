/**
 * Pure, typed calculation engine for the UK Concrete Calculator.
 * Separated entirely from rendering and React state.
 *
 * All calculations maintain full double-precision floating point internally,
 * rounding only when formatted for display.
 */

export type LengthUnit = 'mm' | 'cm' | 'm' | 'in' | 'ft' | 'yd';

export type ConcreteGeometryType =
  | 'rectangular_slab'
  | 'square_slab'
  | 'circular_slab'
  | 'cylindrical_column'
  | 'rectangular_column';

export type PresetType =
  | 'custom'
  | 'slab'
  | 'base'
  | 'footing'
  | 'wall'
  | 'path'
  | 'driveway';

export interface MeasurementInput {
  value: number;
  unit: LengthUnit;
}

export interface RectangularInputs {
  geometry: 'rectangular_slab';
  length: MeasurementInput;
  width: MeasurementInput;
  depth: MeasurementInput;
}

export interface SquareInputs {
  geometry: 'square_slab';
  side: MeasurementInput;
  depth: MeasurementInput;
}

export interface CircularInputs {
  geometry: 'circular_slab';
  diameter: MeasurementInput;
  depth: MeasurementInput;
}

export interface CylindricalInputs {
  geometry: 'cylindrical_column';
  diameter: MeasurementInput;
  height: MeasurementInput;
}

export interface RectangularColumnInputs {
  geometry: 'rectangular_column';
  length: MeasurementInput;
  width: MeasurementInput;
  height: MeasurementInput;
}

export type GeometryInputs =
  | RectangularInputs
  | SquareInputs
  | CircularInputs
  | CylindricalInputs
  | RectangularColumnInputs;

export interface CalculationRequest {
  inputs: GeometryInputs;
  quantity?: number; // Positive integer, default 1
  wastePercent?: number; // 0 to 100, default 0
  bagYieldLitres?: number; // Optional manufacturer-declared yield per bag
}

export interface ValidationFieldError {
  field: string;
  message: string;
}

export interface CalculationResultOutputs {
  netVolumeM3: number;
  orderVolumeM3: number;
  netLitres: number;
  orderLitres: number;
  netCubicFeet: number;
  orderCubicFeet: number;
  netCubicYards: number;
  orderCubicYards: number;
  quantity: number;
  wastePercent: number;
  formulaDescription: string;
  substitutedFormula: string;
  bagEstimate?: {
    yieldLitresPerBag: number;
    requiredBags: number;
  };
}

export type CalculationEngineResponse =
  | {
      status: 'valid';
      result: CalculationResultOutputs;
    }
  | {
      status: 'invalid';
      errors: ValidationFieldError[];
    }
  | {
      status: 'empty';
    };

// Exact conversion factors to standard SI Metres
export const UNIT_TO_METRES: Record<LengthUnit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1.0,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
};

export const UNIT_LABELS: Record<LengthUnit, { name: string; symbol: string }> = {
  mm: { name: 'Millimetres', symbol: 'mm' },
  cm: { name: 'Centimetres', symbol: 'cm' },
  m: { name: 'Metres', symbol: 'm' },
  in: { name: 'Inches', symbol: 'in' },
  ft: { name: 'Feet', symbol: 'ft' },
  yd: { name: 'Yards', symbol: 'yd' },
};

/**
 * Converts any length measurement to metres.
 */
export function toMetres(value: number, unit: LengthUnit): number {
  return value * UNIT_TO_METRES[unit];
}

/**
 * Converts a metre length into any target unit.
 */
export function fromMetres(valueInMetres: number, targetUnit: LengthUnit): number {
  return valueInMetres / UNIT_TO_METRES[targetUnit];
}

/**
 * Preserves the physical length when a user changes the unit selector.
 * e.g., 100 mm converted to m becomes 0.1 m, not 100 m.
 */
export function convertMeasurementValue(
  value: number,
  fromUnit: LengthUnit,
  toUnit: LengthUnit
): number {
  if (fromUnit === toUnit || !Number.isFinite(value)) return value;
  const inMetres = toMetres(value, fromUnit);
  const converted = fromMetres(inMetres, toUnit);
  // Round to 6 decimal places to prevent floating point noise (e.g. 0.30000000000000004)
  return Math.round(converted * 1e6) / 1e6;
}

/**
 * Volume conversions from cubic metres
 */
export function cubicMetresToLitres(m3: number): number {
  return m3 * 1000;
}

export function cubicMetresToCubicFeet(m3: number): number {
  // 1 ft = 0.3048 m => 1 ft³ = 0.3048³ m³
  return m3 / Math.pow(0.3048, 3);
}

export function cubicMetresToCubicYards(m3: number): number {
  // 1 yd = 0.9144 m => 1 yd³ = 0.9144³ m³
  return m3 / Math.pow(0.9144, 3);
}

/**
 * Validates dimension inputs.
 */
function validateMeasurement(
  field: string,
  input?: MeasurementInput
): ValidationFieldError | null {
  if (!input || !Number.isFinite(input.value)) {
    return { field, message: 'Please enter a valid numeric dimension.' };
  }
  if (input.value <= 0) {
    return { field, message: 'Dimension must be greater than zero.' };
  }
  return null;
}

/**
 * Pure calculation function for all supported geometries.
 */
export function calculateConcreteVolume(
  request: CalculationRequest
): CalculationEngineResponse {
  const errors: ValidationFieldError[] = [];
  const { inputs, quantity = 1, wastePercent = 0, bagYieldLitres } = request;

  // Validate Quantity
  if (!Number.isInteger(quantity) || quantity < 1) {
    errors.push({ field: 'quantity', message: 'Quantity must be a positive whole number (at least 1).' });
  }

  // Validate Waste Percentage (Documented product guardrail: 0% to 100%)
  if (!Number.isFinite(wastePercent) || wastePercent < 0 || wastePercent > 100) {
    errors.push({ field: 'wastePercent', message: 'Waste allowance must be between 0% and 100%.' });
  }

  // Validate Bag Yield if provided
  if (bagYieldLitres !== undefined) {
    if (!Number.isFinite(bagYieldLitres) || bagYieldLitres <= 0) {
      errors.push({ field: 'bagYieldLitres', message: 'Yield per bag must be greater than zero.' });
    }
  }

  let singleNetM3 = 0;
  let formulaDesc = '';
  let substituted = '';

  switch (inputs.geometry) {
    case 'rectangular_slab': {
      const errL = validateMeasurement('length', inputs.length);
      const errW = validateMeasurement('width', inputs.width);
      const errD = validateMeasurement('depth', inputs.depth);
      if (errL) errors.push(errL);
      if (errW) errors.push(errW);
      if (errD) errors.push(errD);

      if (errors.length === 0) {
        const lM = toMetres(inputs.length.value, inputs.length.unit);
        const wM = toMetres(inputs.width.value, inputs.width.unit);
        const dM = toMetres(inputs.depth.value, inputs.depth.unit);
        singleNetM3 = lM * wM * dM;
        formulaDesc = 'Volume = Length × Width × Depth';
        substituted = `${lM.toFixed(3)} m × ${wM.toFixed(3)} m × ${dM.toFixed(3)} m = ${singleNetM3.toFixed(4)} m³`;
      }
      break;
    }

    case 'square_slab': {
      const errS = validateMeasurement('side', inputs.side);
      const errD = validateMeasurement('depth', inputs.depth);
      if (errS) errors.push(errS);
      if (errD) errors.push(errD);

      if (errors.length === 0) {
        const sM = toMetres(inputs.side.value, inputs.side.unit);
        const dM = toMetres(inputs.depth.value, inputs.depth.unit);
        singleNetM3 = sM * sM * dM;
        formulaDesc = 'Volume = Side² × Depth';
        substituted = `(${sM.toFixed(3)} m)² × ${dM.toFixed(3)} m = ${singleNetM3.toFixed(4)} m³`;
      }
      break;
    }

    case 'circular_slab': {
      const errDia = validateMeasurement('diameter', inputs.diameter);
      const errD = validateMeasurement('depth', inputs.depth);
      if (errDia) errors.push(errDia);
      if (errD) errors.push(errD);

      if (errors.length === 0) {
        const diaM = toMetres(inputs.diameter.value, inputs.diameter.unit);
        const dM = toMetres(inputs.depth.value, inputs.depth.unit);
        const radiusM = diaM / 2;
        singleNetM3 = Math.PI * Math.pow(radiusM, 2) * dM;
        formulaDesc = 'Volume = π × (Diameter / 2)² × Depth';
        substituted = `π × (${diaM.toFixed(3)} m / 2)² × ${dM.toFixed(3)} m = ${singleNetM3.toFixed(4)} m³`;
      }
      break;
    }

    case 'cylindrical_column': {
      const errDia = validateMeasurement('diameter', inputs.diameter);
      const errH = validateMeasurement('height', inputs.height);
      if (errDia) errors.push(errDia);
      if (errH) errors.push(errH);

      if (errors.length === 0) {
        const diaM = toMetres(inputs.diameter.value, inputs.diameter.unit);
        const hM = toMetres(inputs.height.value, inputs.height.unit);
        const radiusM = diaM / 2;
        singleNetM3 = Math.PI * Math.pow(radiusM, 2) * hM;
        formulaDesc = 'Volume = π × (Diameter / 2)² × Height';
        substituted = `π × (${diaM.toFixed(3)} m / 2)² × ${hM.toFixed(3)} m = ${singleNetM3.toFixed(4)} m³`;
      }
      break;
    }

    case 'rectangular_column': {
      const errL = validateMeasurement('length', inputs.length);
      const errW = validateMeasurement('width', inputs.width);
      const errH = validateMeasurement('height', inputs.height);
      if (errL) errors.push(errL);
      if (errW) errors.push(errW);
      if (errH) errors.push(errH);

      if (errors.length === 0) {
        const lM = toMetres(inputs.length.value, inputs.length.unit);
        const wM = toMetres(inputs.width.value, inputs.width.unit);
        const hM = toMetres(inputs.height.value, inputs.height.unit);
        singleNetM3 = lM * wM * hM;
        formulaDesc = 'Volume = Length × Width × Height';
        substituted = `${lM.toFixed(3)} m × ${wM.toFixed(3)} m × ${hM.toFixed(3)} m = ${singleNetM3.toFixed(4)} m³`;
      }
      break;
    }
  }

  if (errors.length > 0) {
    return { status: 'invalid', errors };
  }

  // Calculate Net Total Volume with quantity
  const netTotalM3 = singleNetM3 * quantity;

  // Calculate Order Volume with waste percentage
  const wasteMultiplier = 1 + wastePercent / 100;
  const orderTotalM3 = netTotalM3 * wasteMultiplier;

  if (!Number.isFinite(orderTotalM3)) {
    return {
      status: 'invalid',
      errors: [{ field: 'overflow', message: 'Calculation resulted in an overflow number.' }],
    };
  }

  // Optional Bag Calculation (Only when user explicitly provides declared yield)
  let bagEstimate: CalculationResultOutputs['bagEstimate'] = undefined;
  if (bagYieldLitres !== undefined && bagYieldLitres > 0) {
    const requiredLitres = cubicMetresToLitres(orderTotalM3);
    const requiredBags = Math.ceil(requiredLitres / bagYieldLitres);
    bagEstimate = {
      yieldLitresPerBag: bagYieldLitres,
      requiredBags,
    };
  }

  return {
    status: 'valid',
    result: {
      netVolumeM3: netTotalM3,
      orderVolumeM3: orderTotalM3,
      netLitres: cubicMetresToLitres(netTotalM3),
      orderLitres: cubicMetresToLitres(orderTotalM3),
      netCubicFeet: cubicMetresToCubicFeet(netTotalM3),
      orderCubicFeet: cubicMetresToCubicFeet(orderTotalM3),
      netCubicYards: cubicMetresToCubicYards(netTotalM3),
      orderCubicYards: cubicMetresToCubicYards(orderTotalM3),
      quantity,
      wastePercent,
      formulaDescription: formulaDesc,
      substitutedFormula: substituted,
      bagEstimate,
    },
  };
}
