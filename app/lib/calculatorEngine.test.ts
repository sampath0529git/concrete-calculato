import { describe, it, expect } from 'vitest';
import {
  calculateConcreteVolume,
  convertMeasurementValue,
  toMetres,
  fromMetres,
  cubicMetresToLitres,
  cubicMetresToCubicFeet,
  cubicMetresToCubicYards,
  LengthUnit,
} from './calculatorEngine';

describe('Concrete Calculator Numerical Acceptance Tests', () => {
  // Tolerance for floating point comparisons
  const EPSILON = 1e-6;

  describe('Master Prompt Acceptance Fixtures', () => {
    it('Fixture A: Metric rectangular slab (5 m × 4 m × 100 mm)', () => {
      const response = calculateConcreteVolume({
        inputs: {
          geometry: 'rectangular_slab',
          length: { value: 5, unit: 'm' },
          width: { value: 4, unit: 'm' },
          depth: { value: 100, unit: 'mm' },
        },
        quantity: 1,
        wastePercent: 10,
      });

      expect(response.status).toBe('valid');
      if (response.status !== 'valid') return;

      // Net volume must be exactly 2 m³
      expect(response.result.netVolumeM3).toBeCloseTo(2.0, 6);
      // With 10% waste: 2.2 m³
      expect(response.result.orderVolumeM3).toBeCloseTo(2.2, 6);
      expect(response.result.netLitres).toBeCloseTo(2000, 3);
      expect(response.result.orderLitres).toBeCloseTo(2200, 3);
    });

    it('Fixture B: Mixed-unit slab (500 cm × 4 m × 100 mm)', () => {
      const response = calculateConcreteVolume({
        inputs: {
          geometry: 'rectangular_slab',
          length: { value: 500, unit: 'cm' },
          width: { value: 4, unit: 'm' },
          depth: { value: 100, unit: 'mm' },
        },
        quantity: 1,
        wastePercent: 0,
      });

      expect(response.status).toBe('valid');
      if (response.status !== 'valid') return;

      expect(response.result.netVolumeM3).toBeCloseTo(2.0, 6);
      expect(response.result.orderVolumeM3).toBeCloseTo(2.0, 6);
    });

    it('Fixture C: Circular slab (Diameter 2 m; depth 100 mm)', () => {
      const response = calculateConcreteVolume({
        inputs: {
          geometry: 'circular_slab',
          diameter: { value: 2, unit: 'm' },
          depth: { value: 100, unit: 'mm' },
        },
        quantity: 1,
        wastePercent: 0,
      });

      expect(response.status).toBe('valid');
      if (response.status !== 'valid') return;

      const expected = Math.PI * 1 * 1 * 0.1; // ~0.3141592653589793
      expect(response.result.netVolumeM3).toBeCloseTo(expected, 6);
      expect(response.result.netVolumeM3).toBeCloseTo(0.314159, 5);
    });

    it('Fixture D: Cylindrical column (Diameter 300 mm; height 3 m)', () => {
      const response = calculateConcreteVolume({
        inputs: {
          geometry: 'cylindrical_column',
          diameter: { value: 300, unit: 'mm' },
          height: { value: 3, unit: 'm' },
        },
        quantity: 1,
        wastePercent: 0,
      });

      expect(response.status).toBe('valid');
      if (response.status !== 'valid') return;

      const expected = Math.PI * Math.pow(0.15, 2) * 3; // ~0.212057504117311
      expect(response.result.netVolumeM3).toBeCloseTo(expected, 6);
      expect(response.result.netVolumeM3).toBeCloseTo(0.212058, 5);
    });

    it('Fixture E: Imperial slab (10 ft × 10 ft × 4 in)', () => {
      const response = calculateConcreteVolume({
        inputs: {
          geometry: 'rectangular_slab',
          length: { value: 10, unit: 'ft' },
          width: { value: 10, unit: 'ft' },
          depth: { value: 4, unit: 'in' },
        },
        quantity: 1,
        wastePercent: 0,
      });

      expect(response.status).toBe('valid');
      if (response.status !== 'valid') return;

      // In imperial: 10 ft * 10 ft * (4/12 ft) = 100 * 1/3 = 33.3333333333 ft³
      // In cubic yards: 33.333333 / 27 = 1.23456790123 yd³
      // In m³: 10 * 0.3048 * 10 * 0.3048 * 4 * 0.0254 = 0.9438948864 m³
      expect(response.result.netCubicFeet).toBeCloseTo(33.333333, 4);
      expect(response.result.netCubicYards).toBeCloseTo(1.2345679, 4);
      expect(response.result.netVolumeM3).toBeCloseTo(0.9438948864, 6);
    });

    it('Fixture F: Quantity multiplier (2 m³ item × quantity 3 with 10% waste)', () => {
      const response = calculateConcreteVolume({
        inputs: {
          geometry: 'rectangular_slab',
          length: { value: 5, unit: 'm' },
          width: { value: 4, unit: 'm' },
          depth: { value: 100, unit: 'mm' }, // 2 m³ single
        },
        quantity: 3,
        wastePercent: 10,
      });

      expect(response.status).toBe('valid');
      if (response.status !== 'valid') return;

      // Net total: 2 m³ * 3 = 6 m³
      expect(response.result.netVolumeM3).toBeCloseTo(6.0, 6);
      // Adjusted total: 6 m³ * 1.10 = 6.6 m³
      expect(response.result.orderVolumeM3).toBeCloseTo(6.6, 6);
    });

    it('Fixture G: Bag yield (Required 2.2 m³, yield 12 litres per bag -> 184 bags)', () => {
      const response = calculateConcreteVolume({
        inputs: {
          geometry: 'rectangular_slab',
          length: { value: 5, unit: 'm' },
          width: { value: 4, unit: 'm' },
          depth: { value: 100, unit: 'mm' }, // 2 m³ net, with 10% waste = 2.2 m³
        },
        quantity: 1,
        wastePercent: 10,
        bagYieldLitres: 12,
      });

      expect(response.status).toBe('valid');
      if (response.status !== 'valid') return;

      // Required litres = 2200 litres
      // 2200 / 12 = 183.3333 -> ceil = 184 bags
      expect(response.result.bagEstimate).toBeDefined();
      expect(response.result.bagEstimate?.requiredBags).toBe(184);
      expect(response.result.bagEstimate?.yieldLitresPerBag).toBe(12);
    });
  });

  describe('Unit Conversions & Round-Trip Tests', () => {
    const units: LengthUnit[] = ['mm', 'cm', 'm', 'in', 'ft', 'yd'];

    it('Every supported unit accurately round-trips to metres and back', () => {
      const testLengths = [1, 2.5, 10, 100];
      for (const unit of units) {
        for (const val of testLengths) {
          const inMetres = toMetres(val, unit);
          const back = fromMetres(inMetres, unit);
          expect(back).toBeCloseTo(val, 6);
        }
      }
    });

    it('Unit switching preserves physical size without altering measurement', () => {
      // User entered 100 mm; switches unit selector to m -> must be 0.1 m
      const convertedM = convertMeasurementValue(100, 'mm', 'm');
      expect(convertedM).toBe(0.1);

      // User entered 1 ft; switches to in -> must be 12 in
      const convertedIn = convertMeasurementValue(1, 'ft', 'in');
      expect(convertedIn).toBe(12);

      // User entered 1 yd; switches to ft -> must be 3 ft
      const convertedFt = convertMeasurementValue(1, 'yd', 'ft');
      expect(convertedFt).toBe(3);

      // User entered 100 cm; switches to m -> must be 1 m
      const convertedCmToM = convertMeasurementValue(100, 'cm', 'm');
      expect(convertedCmToM).toBe(1);
    });
  });

  describe('Validation, Edge Cases & Guardrails', () => {
    it('Rejects non-positive or non-finite dimensions', () => {
      const responseZero = calculateConcreteVolume({
        inputs: {
          geometry: 'rectangular_slab',
          length: { value: 0, unit: 'm' },
          width: { value: 4, unit: 'm' },
          depth: { value: 0.1, unit: 'm' },
        },
      });
      expect(responseZero.status).toBe('invalid');

      const responseNeg = calculateConcreteVolume({
        inputs: {
          geometry: 'rectangular_slab',
          length: { value: -5, unit: 'm' },
          width: { value: 4, unit: 'm' },
          depth: { value: 0.1, unit: 'm' },
        },
      });
      expect(responseNeg.status).toBe('invalid');

      const responseNaN = calculateConcreteVolume({
        inputs: {
          geometry: 'rectangular_slab',
          length: { value: NaN, unit: 'm' },
          width: { value: 4, unit: 'm' },
          depth: { value: 0.1, unit: 'm' },
        },
      });
      expect(responseNaN.status).toBe('invalid');
    });

    it('Rejects invalid quantity (< 1 or non-integer)', () => {
      const response = calculateConcreteVolume({
        inputs: {
          geometry: 'rectangular_slab',
          length: { value: 5, unit: 'm' },
          width: { value: 4, unit: 'm' },
          depth: { value: 0.1, unit: 'm' },
        },
        quantity: 2.5,
      });
      expect(response.status).toBe('invalid');
    });

    it('Rejects waste allowance outside 0%–100%', () => {
      const responseNegWaste = calculateConcreteVolume({
        inputs: {
          geometry: 'rectangular_slab',
          length: { value: 5, unit: 'm' },
          width: { value: 4, unit: 'm' },
          depth: { value: 0.1, unit: 'm' },
        },
        wastePercent: -5,
      });
      expect(responseNegWaste.status).toBe('invalid');

      const responseExcessWaste = calculateConcreteVolume({
        inputs: {
          geometry: 'rectangular_slab',
          length: { value: 5, unit: 'm' },
          width: { value: 4, unit: 'm' },
          depth: { value: 0.1, unit: 'm' },
        },
        wastePercent: 105,
      });
      expect(responseExcessWaste.status).toBe('invalid');
    });

    it('Supports zero waste cleanly', () => {
      const response = calculateConcreteVolume({
        inputs: {
          geometry: 'rectangular_slab',
          length: { value: 5, unit: 'm' },
          width: { value: 4, unit: 'm' },
          depth: { value: 0.1, unit: 'm' },
        },
        wastePercent: 0,
      });
      expect(response.status).toBe('valid');
      if (response.status !== 'valid') return;
      expect(response.result.netVolumeM3).toBe(response.result.orderVolumeM3);
    });

    it('Handles small valid dimensions without rounding to zero', () => {
      // 100mm × 100mm × 50mm = 0.1m × 0.1m × 0.05m = 0.0005 m³
      const response = calculateConcreteVolume({
        inputs: {
          geometry: 'rectangular_slab',
          length: { value: 100, unit: 'mm' },
          width: { value: 100, unit: 'mm' },
          depth: { value: 50, unit: 'mm' },
        },
      });
      expect(response.status).toBe('valid');
      if (response.status !== 'valid') return;
      expect(response.result.netVolumeM3).toBeCloseTo(0.0005, 6);
      expect(response.result.netLitres).toBeCloseTo(0.5, 3);
    });
  });
});
