'use client';

import React, { useState, useMemo } from 'react';
import {
  Play,
  RotateCcw,
  FileDown,
  FileSpreadsheet,
  Copy,
  Printer,
  Check,
  Package,
  Truck,
  Layers,
  Scale,
  Sparkles,
} from 'lucide-react';
import { ConcreteShape, CalculationResult, LengthUnit, MixRatioKey } from '../types';
import {
  SlabDiagram,
  ColumnDiagram,
  TubeDiagram,
  CurbDiagram,
  StairsDiagram,
} from './ShapeDiagrams';
import { exportEstimatePdf } from '../lib/exportPdf';
import { exportEstimateCsv } from '../lib/exportCsv';

const UNIT_TO_METERS: Record<LengthUnit, number> = {
  meters: 1.0,
  centimeters: 0.01,
  feet: 0.3048,
  inches: 0.0254,
  yards: 0.9144,
};

export const MIX_RATIO_CONFIGS: Record<
  MixRatioKey,
  {
    label: string;
    shortLabel: string;
    description: string;
    strength: string;
    yield25kg: number;
    yield20kg: number;
    density: number;
    cementBagsPerM3: number;
    sandTonnesPerM3: number;
    gravelTonnesPerM3: number;
  }
> = {
  '1:2:4': {
    label: '1:2:4 — Standard / C20 (Shed bases, paths, domestic slabs)',
    shortLabel: '1:2:4 Standard (C20)',
    description: '1 cement : 2 sand : 4 aggregate. UK standard domestic mix.',
    strength: 'C20 (20 N/mm² at 28 days)',
    yield25kg: 0.012,
    yield20kg: 0.0095,
    density: 2.4,
    cementBagsPerM3: 12.8,
    sandTonnesPerM3: 0.64,
    gravelTonnesPerM3: 1.28,
  },
  '1:1.5:3': {
    label: '1:1.5:3 — High Strength / C25–C30 (Driveways & heavy footings)',
    shortLabel: '1:1.5:3 Strong (C25–C30)',
    description: '1 cement : 1.5 sand : 3 aggregate. High cement ratio.',
    strength: 'C25–C30 (25–30 N/mm²)',
    yield25kg: 0.011,
    yield20kg: 0.0087,
    density: 2.45,
    cementBagsPerM3: 15.2,
    sandTonnesPerM3: 0.57,
    gravelTonnesPerM3: 1.14,
  },
  '1:3:6': {
    label: '1:3:6 — Lean Mix / C10–C15 (Blindings, sub-bases, mass trench fill)',
    shortLabel: '1:3:6 Lean Mix (C10–C15)',
    description: '1 cement : 3 sand : 6 aggregate. Non-structural filling.',
    strength: 'C10–C15 (10–15 N/mm²)',
    yield25kg: 0.0135,
    yield20kg: 0.0108,
    density: 2.35,
    cementBagsPerM3: 8.8,
    sandTonnesPerM3: 0.72,
    gravelTonnesPerM3: 1.44,
  },
  '1:2:3': {
    label: '1:2:3 — Watertight / C25 (Steps, retaining walls, damp areas)',
    shortLabel: '1:2:3 Watertight (C25)',
    description: '1 cement : 2 sand : 3 aggregate. Dense, low-porosity mix.',
    strength: 'C25 (25 N/mm²)',
    yield25kg: 0.0116,
    yield20kg: 0.0092,
    density: 2.42,
    cementBagsPerM3: 14.0,
    sandTonnesPerM3: 0.65,
    gravelTonnesPerM3: 0.98,
  },
  '1:5': {
    label: '1:5 — Ballast Mix (General DIY, all-in aggregate)',
    shortLabel: '1:5 All-in Ballast',
    description: '1 cement : 5 combined ballast. Fast DIY concrete.',
    strength: 'C15–C20',
    yield25kg: 0.0125,
    yield20kg: 0.0099,
    density: 2.38,
    cementBagsPerM3: 12.0,
    sandTonnesPerM3: 0.6,
    gravelTonnesPerM3: 1.2,
  },
};

export const Calculator: React.FC = () => {
  // Navigation tabs: 'all' or individual shape
  const [activeTab, setActiveTab] = useState<'all' | ConcreteShape>('all');
  const [activeResultShape, setActiveResultShape] = useState<ConcreteShape>('slab');

  // Global Waste Allowance & Mix ratio
  const [waste, setWaste] = useState<string>('0');
  const [mixRatio, setMixRatio] = useState<MixRatioKey>('1:2:4');
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  // 1. Slabs, Square Footings, or Walls
  const [slabLen, setSlabLen] = useState<string>('5');
  const [slabLenUnit, setSlabLenUnit] = useState<LengthUnit>('meters');
  const [slabWid, setSlabWid] = useState<string>('2.5');
  const [slabWidUnit, setSlabWidUnit] = useState<LengthUnit>('meters');
  const [slabThick, setSlabThick] = useState<string>('10');
  const [slabThickUnit, setSlabThickUnit] = useState<LengthUnit>('centimeters');
  const [slabQty, setSlabQty] = useState<string>('1');

  // 2. Hole, Column, or Round Footings
  const [colDia, setColDia] = useState<string>('30');
  const [colDiaUnit, setColDiaUnit] = useState<LengthUnit>('centimeters');
  const [colDepth, setColDepth] = useState<string>('90');
  const [colDepthUnit, setColDepthUnit] = useState<LengthUnit>('centimeters');
  const [colQty, setColQty] = useState<string>('1');

  // 3. Circular Slab or Tube
  const [tubeD1, setTubeD1] = useState<string>('3');
  const [tubeD1Unit, setTubeD1Unit] = useState<LengthUnit>('meters');
  const [tubeD2, setTubeD2] = useState<string>('0');
  const [tubeD2Unit, setTubeD2Unit] = useState<LengthUnit>('meters');
  const [tubeH, setTubeH] = useState<string>('10');
  const [tubeHUnit, setTubeHUnit] = useState<LengthUnit>('centimeters');
  const [tubeQty, setTubeQty] = useState<string>('1');

  // 4. Curb and Gutter Barrier
  const [curbDepth, setCurbDepth] = useState<string>('15');
  const [curbDepthUnit, setCurbDepthUnit] = useState<LengthUnit>('centimeters');
  const [gutterWidth, setGutterWidth] = useState<string>('30');
  const [gutterWidthUnit, setGutterWidthUnit] = useState<LengthUnit>('centimeters');
  const [curbHeight, setCurbHeight] = useState<string>('15');
  const [curbHeightUnit, setCurbHeightUnit] = useState<LengthUnit>('centimeters');
  const [flagThick, setFlagThick] = useState<string>('10');
  const [flagThickUnit, setFlagThickUnit] = useState<LengthUnit>('centimeters');
  const [curbLen, setCurbLen] = useState<string>('10');
  const [curbLenUnit, setCurbLenUnit] = useState<LengthUnit>('meters');
  const [curbQty, setCurbQty] = useState<string>('1');

  // 5. Stairs
  const [stairsRun, setStairsRun] = useState<string>('28');
  const [stairsRunUnit, setStairsRunUnit] = useState<LengthUnit>('centimeters');
  const [stairsRise, setStairsRise] = useState<string>('18');
  const [stairsRiseUnit, setStairsRiseUnit] = useState<LengthUnit>('centimeters');
  const [stairsWidth, setStairsWidth] = useState<string>('100');
  const [stairsWidthUnit, setStairsWidthUnit] = useState<LengthUnit>('centimeters');
  const [stairsPlatform, setStairsPlatform] = useState<string>('0');
  const [stairsPlatformUnit, setStairsPlatformUnit] = useState<LengthUnit>('centimeters');
  const [stairsRisers, setStairsRisers] = useState<string>('4');

  const parseNum = (val: string): number => {
    const n = parseFloat(val);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  const toMeters = (val: string, unit: LengthUnit): number => {
    return parseNum(val) * UNIT_TO_METERS[unit];
  };

  const activeMixConfig = MIX_RATIO_CONFIGS[mixRatio];

  // Helper to compute volume for any given shape
  const calculateVolumeForShape = (shape: ConcreteShape): number => {
    let volM3 = 0;
    if (shape === 'slab' || shape === 'footing') {
      const l = toMeters(slabLen, slabLenUnit);
      const w = toMeters(slabWid, slabWidUnit);
      const h = toMeters(slabThick, slabThickUnit);
      const q = Math.max(1, parseNum(slabQty));
      volM3 = l * w * h * q;
    } else if (shape === 'column') {
      const d = toMeters(colDia, colDiaUnit);
      const h = toMeters(colDepth, colDepthUnit);
      const q = Math.max(1, parseNum(colQty));
      const r = d / 2;
      volM3 = Math.PI * r * r * h * q;
    } else if (shape === 'tube' || shape === 'circle') {
      const d1 = toMeters(tubeD1, tubeD1Unit);
      const d2 = toMeters(tubeD2, tubeD2Unit);
      const h = toMeters(tubeH, tubeHUnit);
      const q = Math.max(1, parseNum(tubeQty));
      const r1 = d1 / 2;
      const r2 = d2 / 2;
      const outerArea = Math.PI * r1 * r1;
      const innerArea = r2 < r1 ? Math.PI * r2 * r2 : 0;
      volM3 = (outerArea - innerArea) * h * q;
    } else if (shape === 'curb') {
      const cd = toMeters(curbDepth, curbDepthUnit);
      const gw = toMeters(gutterWidth, gutterWidthUnit);
      const ch = toMeters(curbHeight, curbHeightUnit);
      const ft = toMeters(flagThick, flagThickUnit);
      const len = toMeters(curbLen, curbLenUnit);
      const q = Math.max(1, parseNum(curbQty));
      const crossSectionArea = cd * ch + gw * ft;
      volM3 = crossSectionArea * len * q;
    } else if (shape === 'steps') {
      const run = toMeters(stairsRun, stairsRunUnit);
      const rise = toMeters(stairsRise, stairsRiseUnit);
      const w = toMeters(stairsWidth, stairsWidthUnit);
      const plat = toMeters(stairsPlatform, stairsPlatformUnit);
      const n = Math.max(1, Math.round(parseNum(stairsRisers)));
      const stepsVol = (run * w * rise * (n * (n + 1))) / 2;
      const platformVol = plat * w * (n * rise);
      volM3 = stepsVol + platformVol;
    }
    return volM3;
  };

  const result: CalculationResult | null = useMemo(() => {
    const netV = calculateVolumeForShape(activeResultShape);
    if (!(netV > 0)) return null;

    const wp = parseNum(waste) / 100;
    const tot = netV * (1 + wp);
    const cuYards = tot * 1.30795;
    const cuFeet = tot * 35.3147;

    const bags25 = Math.ceil(tot / activeMixConfig.yield25kg);
    const bags20 = Math.ceil(tot / activeMixConfig.yield20kg);
    const bags60 = Math.ceil(cuFeet / 0.45);
    const bags80 = Math.ceil(cuFeet / 0.60);

    const order = Math.ceil(tot * 4) / 4;
    const tonnes = tot * activeMixConfig.density;
    const lbs = tonnes * 1000 * 2.20462;

    const cement25kgBags = Math.ceil(tot * activeMixConfig.cementBagsPerM3);
    const sandTonnes = Math.round(tot * activeMixConfig.sandTonnesPerM3 * 100) / 100;
    const gravelTonnes = Math.round(tot * activeMixConfig.gravelTonnesPerM3 * 100) / 100;

    const rmLow = order * 110;
    const rmHigh = order * 185;
    const bgLow = bags25 * 5.5;
    const bgHigh = bags25 * 9.0;

    let rec: 'bags' | 'either' | 'ready' = 'ready';
    if (tot < 0.5) rec = 'bags';
    else if (tot < 1) rec = 'either';

    let note = '';
    if (rec === 'bags') {
      note = `For this volume (${tot.toFixed(3)} m³ / ${cuYards.toFixed(3)} cu yd), bagged concrete is the simplest, most cost-effective option.`;
    } else if (rec === 'either') {
      note = `At ${tot.toFixed(2)} m³ (${cuYards.toFixed(2)} cu yd), pre-mix bags and mini-mix ready delivery are close in cost. Check for mini-mix short-load charges.`;
    } else {
      note = `Delivered ready-mix or volumetric truck is strongly recommended. Hand mixing ${bags25} bags (~${tonnes.toFixed(1)} tonnes) requires heavy manual effort.`;
    }

    return {
      shape: activeResultShape,
      netVolume: netV,
      wastePercent: Math.round(wp * 100),
      totalVolume: tot,
      cubicYards: cuYards,
      cubicFeet: cuFeet,
      mixRatio,
      mixRatioLabel: activeMixConfig.label,
      bags25kg: bags25,
      bags20kg: bags20,
      bags60lb: bags60,
      bags80lb: bags80,
      cement25kgBags,
      sandTonnes,
      gravelTonnes,
      readyMixOrder: order,
      wetWeightTonnes: tonnes,
      wetWeightLbs: lbs,
      bgCostLow: bgLow,
      bgCostHigh: bgHigh,
      rmCostLow: rmLow,
      rmCostHigh: rmHigh,
      recommendation: rec,
      recommendationNote: note,
    };
  }, [
    activeResultShape,
    slabLen, slabLenUnit, slabWid, slabWidUnit, slabThick, slabThickUnit, slabQty,
    colDia, colDiaUnit, colDepth, colDepthUnit, colQty,
    tubeD1, tubeD1Unit, tubeD2, tubeD2Unit, tubeH, tubeHUnit, tubeQty,
    curbDepth, curbDepthUnit, gutterWidth, gutterWidthUnit, curbHeight, curbHeightUnit, flagThick, flagThickUnit, curbLen, curbLenUnit, curbQty,
    stairsRun, stairsRunUnit, stairsRise, stairsRiseUnit, stairsWidth, stairsWidthUnit, stairsPlatform, stairsPlatformUnit, stairsRisers,
    waste, mixRatio, activeMixConfig,
  ]);

  const handleSelectTab = (tab: 'all' | ConcreteShape) => {
    setActiveTab(tab);
    if (tab !== 'all') {
      setActiveResultShape(tab);
    }
  };

  const handleCalculate = (shape: ConcreteShape) => {
    setActiveResultShape(shape);
    const el = document.getElementById('calc-results-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const copySummary = () => {
    if (!result) return;
    const text = [
      `Concrete Estimate — ConcreteCalc.UK`,
      `Shape: ${result.shape.toUpperCase()}`,
      `Total Volume: ${result.totalVolume.toFixed(3)} m³ (${result.cubicYards.toFixed(3)} cu yd / ${result.cubicFeet.toFixed(1)} cu ft)`,
      `Net Volume: ${result.netVolume.toFixed(3)} m³ (+${result.wastePercent}% waste)`,
      `Pre-Mix Bags (25kg): ${result.bags25kg} bags (£${Math.round(result.bgCostLow)} – £${Math.round(result.bgCostHigh)})`,
      `Pre-Mix Bags (60lb): ${result.bags60lb} bags | (80lb): ${result.bags80lb} bags`,
      `Estimated Wet Weight: ${result.wetWeightTonnes.toFixed(2)} tonnes (${Math.round(result.wetWeightLbs).toLocaleString('en-GB')} lbs)`,
      `Site-Mix Raw Materials: ${result.cement25kgBags} bags Cement + ${result.sandTonnes.toFixed(2)}t Sand + ${result.gravelTonnes.toFixed(2)}t Gravel`,
      `Ready-Mix Order: ${result.readyMixOrder.toFixed(2)} m³ (${(result.readyMixOrder * 1.30795).toFixed(2)} cu yd)`,
      `Recommendation: ${result.recommendationNote}`,
    ].join('\n');

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleExportPdf = () => {
    if (!result) return;
    try {
      setIsExportingPdf(true);
      exportEstimatePdf({
        shape: result.shape,
        result,
        unitSystem: 'metric',
        dimensions: {
          length: slabLen,
          width: slabWid,
          depth: slabThick,
          diameter: colDia,
          stepCount: stairsRisers,
          stepWidth: stairsWidth,
          stepRise: stairsRise,
          stepGoing: stairsRun,
          waste,
          mix: mixRatio,
        },
      });
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportCsv = () => {
    if (!result) return;
    try {
      exportEstimateCsv({
        shape: result.shape,
        result,
        unitSystem: 'metric',
        dimensions: {
          length: slabLen,
          width: slabWid,
          depth: slabThick,
          diameter: colDia,
          stepCount: stairsRisers,
          stepWidth: stairsWidth,
          stepRise: stairsRise,
          stepGoing: stairsRun,
          waste,
          mixRatio,
        },
      });
    } catch (err) {
      console.error('Failed to export CSV:', err);
    }
  };

  const unitOptions = (
    <>
      <option value="meters">meters</option>
      <option value="centimeters">centimeters</option>
      <option value="feet">feet</option>
      <option value="inches">inches</option>
      <option value="yards">yards</option>
    </>
  );

  return (
    <div id="calculator">
      {/* Tab Navigation across Calculators */}
      <div className="calc-nav-tabs" role="tablist" aria-label="Concrete shape calculators">
        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => handleSelectTab('all')}
        >
          All Calculators
        </button>
        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'slab' ? 'active' : ''}`}
          onClick={() => handleSelectTab('slab')}
        >
          Slabs, Square Footings, or Walls
        </button>
        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'column' ? 'active' : ''}`}
          onClick={() => handleSelectTab('column')}
        >
          Hole, Column, or Round Footings
        </button>
        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'tube' ? 'active' : ''}`}
          onClick={() => handleSelectTab('tube')}
        >
          Circular Slab or Tube
        </button>
        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'curb' ? 'active' : ''}`}
          onClick={() => handleSelectTab('curb')}
        >
          Curb and Gutter Barrier
        </button>
        <button
          type="button"
          className={`calc-nav-btn ${activeTab === 'steps' ? 'active' : ''}`}
          onClick={() => handleSelectTab('steps')}
        >
          Stairs
        </button>
      </div>

      {/* Global Configuration Bar: Waste & Mix Ratio */}
      <div className="calc-config-bar">
        <div className="calc-config-fields">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>Waste Allowance:</span>
            <select
              value={waste}
              onChange={(e) => setWaste(e.target.value)}
              className="calc-select"
              style={{ width: 'auto' }}
            >
              <option value="0">0% (Exact)</option>
              <option value="5">5% (Smooth forms)</option>
              <option value="10">10% (Recommended)</option>
              <option value="15">15% (Rough trench)</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)' }}>Mix Ratio:</span>
            <select
              value={mixRatio}
              onChange={(e) => setMixRatio(e.target.value as MixRatioKey)}
              className="calc-select"
              style={{ width: 'auto' }}
            >
              <option value="1:2:4">1:2:4 Standard (C20 Domestic)</option>
              <option value="1:1.5:3">1:1.5:3 High Strength (C25–C30)</option>
              <option value="1:3:6">1:3:6 Lean Mix (C10–C15)</option>
              <option value="1:2:3">1:2:3 Watertight (C25)</option>
              <option value="1:5">1:5 All-in Ballast</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '12.5px', color: 'var(--muted)', fontWeight: 500 }}>
          {activeMixConfig.shortLabel} &middot; {Math.round(1 / activeMixConfig.yield25kg)} bags/m³
        </div>
      </div>

      {/* 1. SLABS, SQUARE FOOTINGS, OR WALLS */}
      {(activeTab === 'all' || activeTab === 'slab') && (
        <div className="calc-card" id="calc-slab">
          <div className="calc-card-header">
            <h2 className="calc-card-title">Slabs, Square Footings, or Walls</h2>
          </div>
          <div className="calc-card-body">
            <div>
              {/* Quick Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} color="var(--calc-blue)" /> Presets:
                </span>
                <button
                  type="button"
                  className="calc-preset-tag"
                  onClick={() => {
                    setSlabLen('2.4');
                    setSlabLenUnit('meters');
                    setSlabWid('1.8');
                    setSlabWidUnit('meters');
                    setSlabThick('10');
                    setSlabThickUnit('centimeters');
                    setSlabQty('1');
                    handleCalculate('slab');
                  }}
                >
                  8&apos; × 6&apos; Shed Base (100mm)
                </button>
                <button
                  type="button"
                  className="calc-preset-tag"
                  onClick={() => {
                    setSlabLen('3');
                    setSlabLenUnit('meters');
                    setSlabWid('3');
                    setSlabWidUnit('meters');
                    setSlabThick('7.5');
                    setSlabThickUnit('centimeters');
                    setSlabQty('1');
                    handleCalculate('slab');
                  }}
                >
                  3m × 3m Patio (75mm)
                </button>
                <button
                  type="button"
                  className="calc-preset-tag"
                  onClick={() => {
                    setSlabLen('5');
                    setSlabLenUnit('meters');
                    setSlabWid('3');
                    setSlabWidUnit('meters');
                    setSlabThick('15');
                    setSlabThickUnit('centimeters');
                    setSlabQty('1');
                    handleCalculate('slab');
                  }}
                >
                  5m × 3m Driveway (150mm)
                </button>
              </div>

              <table className="calc-table">
                <tbody>
                  <tr>
                    <td className="calc-table-label">Length (l)</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={slabLen}
                          onChange={(e) => setSlabLen(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={slabLenUnit}
                          onChange={(e) => setSlabLenUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Width (w)</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={slabWid}
                          onChange={(e) => setSlabWid(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={slabWidUnit}
                          onChange={(e) => setSlabWidUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Thickness or Height (h)</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={slabThick}
                          onChange={(e) => setSlabThick(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={slabThickUnit}
                          onChange={(e) => setSlabThickUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Quantity</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        className="calc-input"
                        value={slabQty}
                        onChange={(e) => setSlabQty(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <div className="calc-buttons-row">
                        <button
                          type="button"
                          className="calc-btn-calc"
                          onClick={() => handleCalculate('slab')}
                        >
                          <Play size={14} fill="#ffffff" aria-hidden="true" />
                          <span>Calculate</span>
                        </button>
                        <button
                          type="button"
                          className="calc-btn-clear"
                          onClick={() => {
                            setSlabLen('');
                            setSlabWid('');
                            setSlabThick('');
                            setSlabQty('1');
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="calc-diagram-wrap">
              <SlabDiagram />
            </div>
          </div>
        </div>
      )}

      {/* 2. HOLE, COLUMN, OR ROUND FOOTINGS */}
      {(activeTab === 'all' || activeTab === 'column') && (
        <div className="calc-card" id="calc-column">
          <div className="calc-card-header">
            <h2 className="calc-card-title">Hole, Column, or Round Footings</h2>
          </div>
          <div className="calc-card-body">
            <div>
              {/* Quick Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} color="var(--calc-blue)" /> Presets:
                </span>
                <button
                  type="button"
                  className="calc-preset-tag"
                  onClick={() => {
                    setColDia('20');
                    setColDiaUnit('centimeters');
                    setColDepth('60');
                    setColDepthUnit('centimeters');
                    setColQty('1');
                    handleCalculate('column');
                  }}
                >
                  Fence Post (20cm × 60cm)
                </button>
                <button
                  type="button"
                  className="calc-preset-tag"
                  onClick={() => {
                    setColDia('30');
                    setColDiaUnit('centimeters');
                    setColDepth('90');
                    setColDepthUnit('centimeters');
                    setColQty('1');
                    handleCalculate('column');
                  }}
                >
                  Gate Pier (30cm × 90cm)
                </button>
                <button
                  type="button"
                  className="calc-preset-tag"
                  onClick={() => {
                    setColDia('40');
                    setColDiaUnit('centimeters');
                    setColDepth('80');
                    setColDepthUnit('centimeters');
                    setColQty('4');
                    handleCalculate('column');
                  }}
                >
                  4 Deck Piers (40cm × 80cm)
                </button>
              </div>

              <table className="calc-table">
                <tbody>
                  <tr>
                    <td className="calc-table-label">Diameter (d)</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={colDia}
                          onChange={(e) => setColDia(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={colDiaUnit}
                          onChange={(e) => setColDiaUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Depth or Height (h)</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={colDepth}
                          onChange={(e) => setColDepth(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={colDepthUnit}
                          onChange={(e) => setColDepthUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Quantity</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        className="calc-input"
                        value={colQty}
                        onChange={(e) => setColQty(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <div className="calc-buttons-row">
                        <button
                          type="button"
                          className="calc-btn-calc"
                          onClick={() => handleCalculate('column')}
                        >
                          <Play size={14} fill="#ffffff" aria-hidden="true" />
                          <span>Calculate</span>
                        </button>
                        <button
                          type="button"
                          className="calc-btn-clear"
                          onClick={() => {
                            setColDia('');
                            setColDepth('');
                            setColQty('1');
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="calc-diagram-wrap">
              <ColumnDiagram />
            </div>
          </div>
        </div>
      )}

      {/* 3. CIRCULAR SLAB OR TUBE */}
      {(activeTab === 'all' || activeTab === 'tube') && (
        <div className="calc-card" id="calc-tube">
          <div className="calc-card-header">
            <h2 className="calc-card-title">Circular Slab or Tube</h2>
          </div>
          <div className="calc-card-body">
            <div>
              {/* Quick Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} color="var(--calc-blue)" /> Presets:
                </span>
                <button
                  type="button"
                  className="calc-preset-tag"
                  onClick={() => {
                    setTubeD1('3');
                    setTubeD1Unit('meters');
                    setTubeD2('0');
                    setTubeD2Unit('meters');
                    setTubeH('10');
                    setTubeHUnit('centimeters');
                    setTubeQty('1');
                    handleCalculate('tube');
                  }}
                >
                  Solid Round Patio (3m × 100mm)
                </button>
                <button
                  type="button"
                  className="calc-preset-tag"
                  onClick={() => {
                    setTubeD1('1.2');
                    setTubeD1Unit('meters');
                    setTubeD2('1.0');
                    setTubeD2Unit('meters');
                    setTubeH('1.0');
                    setTubeHUnit('meters');
                    setTubeQty('1');
                    handleCalculate('tube');
                  }}
                >
                  Hollow Ring / Pipe (1.2m OD × 1.0m ID)
                </button>
              </div>

              <table className="calc-table">
                <tbody>
                  <tr>
                    <td className="calc-table-label">Outer Diameter (d1)</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={tubeD1}
                          onChange={(e) => setTubeD1(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={tubeD1Unit}
                          onChange={(e) => setTubeD1Unit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Inner Diameter (d2)</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={tubeD2}
                          onChange={(e) => setTubeD2(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={tubeD2Unit}
                          onChange={(e) => setTubeD2Unit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Length or Height (h)</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={tubeH}
                          onChange={(e) => setTubeH(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={tubeHUnit}
                          onChange={(e) => setTubeHUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Quantity</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        className="calc-input"
                        value={tubeQty}
                        onChange={(e) => setTubeQty(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <div className="calc-buttons-row">
                        <button
                          type="button"
                          className="calc-btn-calc"
                          onClick={() => handleCalculate('tube')}
                        >
                          <Play size={14} fill="#ffffff" aria-hidden="true" />
                          <span>Calculate</span>
                        </button>
                        <button
                          type="button"
                          className="calc-btn-clear"
                          onClick={() => {
                            setTubeD1('');
                            setTubeD2('');
                            setTubeH('');
                            setTubeQty('1');
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="calc-diagram-wrap">
              <TubeDiagram />
            </div>
          </div>
        </div>
      )}

      {/* 4. CURB AND GUTTER BARRIER */}
      {(activeTab === 'all' || activeTab === 'curb') && (
        <div className="calc-card" id="calc-curb">
          <div className="calc-card-header">
            <h2 className="calc-card-title">Curb and Gutter Barrier</h2>
          </div>
          <div className="calc-card-body">
            <div>
              {/* Quick Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} color="var(--calc-blue)" /> Presets:
                </span>
                <button
                  type="button"
                  className="calc-preset-tag"
                  onClick={() => {
                    setCurbDepth('15');
                    setCurbDepthUnit('centimeters');
                    setGutterWidth('30');
                    setGutterWidthUnit('centimeters');
                    setCurbHeight('15');
                    setCurbHeightUnit('centimeters');
                    setFlagThick('10');
                    setFlagThickUnit('centimeters');
                    setCurbLen('10');
                    setCurbLenUnit('meters');
                    setCurbQty('1');
                    handleCalculate('curb');
                  }}
                >
                  Standard Curb &amp; Gutter (10m)
                </button>
                <button
                  type="button"
                  className="calc-preset-tag"
                  onClick={() => {
                    setCurbDepth('15');
                    setCurbDepthUnit('centimeters');
                    setGutterWidth('25');
                    setGutterWidthUnit('centimeters');
                    setCurbHeight('15');
                    setCurbHeightUnit('centimeters');
                    setFlagThick('8');
                    setFlagThickUnit('centimeters');
                    setCurbLen('25');
                    setCurbLenUnit('meters');
                    setCurbQty('1');
                    handleCalculate('curb');
                  }}
                >
                  Driveway Edging (25m)
                </button>
              </div>

              <table className="calc-table">
                <tbody>
                  <tr>
                    <td className="calc-table-label">Curb Depth</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={curbDepth}
                          onChange={(e) => setCurbDepth(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={curbDepthUnit}
                          onChange={(e) => setCurbDepthUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Gutter Width</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={gutterWidth}
                          onChange={(e) => setGutterWidth(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={gutterWidthUnit}
                          onChange={(e) => setGutterWidthUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Curb Height</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={curbHeight}
                          onChange={(e) => setCurbHeight(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={curbHeightUnit}
                          onChange={(e) => setCurbHeightUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Flag Thickness</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={flagThick}
                          onChange={(e) => setFlagThick(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={flagThickUnit}
                          onChange={(e) => setFlagThickUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Length</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={curbLen}
                          onChange={(e) => setCurbLen(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={curbLenUnit}
                          onChange={(e) => setCurbLenUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Quantity</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        className="calc-input"
                        value={curbQty}
                        onChange={(e) => setCurbQty(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <div className="calc-buttons-row">
                        <button
                          type="button"
                          className="calc-btn-calc"
                          onClick={() => handleCalculate('curb')}
                        >
                          <Play size={14} fill="#ffffff" aria-hidden="true" />
                          <span>Calculate</span>
                        </button>
                        <button
                          type="button"
                          className="calc-btn-clear"
                          onClick={() => {
                            setCurbDepth('');
                            setGutterWidth('');
                            setCurbHeight('');
                            setFlagThick('');
                            setCurbLen('');
                            setCurbQty('1');
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="calc-diagram-wrap">
              <CurbDiagram />
            </div>
          </div>
        </div>
      )}

      {/* 5. STAIRS */}
      {(activeTab === 'all' || activeTab === 'steps') && (
        <div className="calc-card" id="calc-stairs">
          <div className="calc-card-header">
            <h2 className="calc-card-title">Stairs</h2>
          </div>
          <div className="calc-card-body">
            <div>
              {/* Quick Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} color="var(--calc-blue)" /> Presets:
                </span>
                <button
                  type="button"
                  className="calc-preset-tag"
                  onClick={() => {
                    setStairsRun('28');
                    setStairsRunUnit('centimeters');
                    setStairsRise('18');
                    setStairsRiseUnit('centimeters');
                    setStairsWidth('100');
                    setStairsWidthUnit('centimeters');
                    setStairsPlatform('0');
                    setStairsPlatformUnit('centimeters');
                    setStairsRisers('4');
                    handleCalculate('steps');
                  }}
                >
                  4 Standard Entrance Steps (1m wide)
                </button>
                <button
                  type="button"
                  className="calc-preset-tag"
                  onClick={() => {
                    setStairsRun('30');
                    setStairsRunUnit('centimeters');
                    setStairsRise('15');
                    setStairsRiseUnit('centimeters');
                    setStairsWidth('120');
                    setStairsWidthUnit('centimeters');
                    setStairsPlatform('90');
                    setStairsPlatformUnit('centimeters');
                    setStairsRisers('5');
                    handleCalculate('steps');
                  }}
                >
                  5 Steps + Landing Platform
                </button>
              </div>

              <table className="calc-table">
                <tbody>
                  <tr>
                    <td className="calc-table-label">Run</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={stairsRun}
                          onChange={(e) => setStairsRun(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={stairsRunUnit}
                          onChange={(e) => setStairsRunUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Rise</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={stairsRise}
                          onChange={(e) => setStairsRise(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={stairsRiseUnit}
                          onChange={(e) => setStairsRiseUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Width</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={stairsWidth}
                          onChange={(e) => setStairsWidth(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={stairsWidthUnit}
                          onChange={(e) => setStairsWidthUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Platform Depth</td>
                    <td>
                      <div className="calc-table-inputs">
                        <input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="any"
                          className="calc-input"
                          value={stairsPlatform}
                          onChange={(e) => setStairsPlatform(e.target.value)}
                        />
                        <select
                          className="calc-select"
                          value={stairsPlatformUnit}
                          onChange={(e) => setStairsPlatformUnit(e.target.value as LengthUnit)}
                        >
                          {unitOptions}
                        </select>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="calc-table-label">Number of Risers</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        className="calc-input"
                        value={stairsRisers}
                        onChange={(e) => setStairsRisers(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <div className="calc-buttons-row">
                        <button
                          type="button"
                          className="calc-btn-calc"
                          onClick={() => handleCalculate('steps')}
                        >
                          <Play size={14} fill="#ffffff" aria-hidden="true" />
                          <span>Calculate</span>
                        </button>
                        <button
                          type="button"
                          className="calc-btn-clear"
                          onClick={() => {
                            setStairsRun('');
                            setStairsRise('');
                            setStairsWidth('');
                            setStairsPlatform('');
                            setStairsRisers('1');
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="calc-diagram-wrap">
              <StairsDiagram />
            </div>
          </div>
        </div>
      )}

      {/* RESULTS DISPLAY PANEL */}
      <div className="calc-result-card" id="calc-results-section" aria-live="polite">
        <div className="calc-result-header">
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--calc-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Calculation Result
            </span>
            <h3 className="calc-result-title">
              {result?.shape === 'slab' && 'Slabs, Square Footings, or Walls'}
              {result?.shape === 'column' && 'Hole, Column, or Round Footings'}
              {result?.shape === 'tube' && 'Circular Slab or Tube'}
              {result?.shape === 'curb' && 'Curb and Gutter Barrier'}
              {result?.shape === 'steps' && 'Stairs & Entrance Steps'}
            </h3>
          </div>
          {result && (
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ok)' }}>
              ✓ Volume Verified
            </span>
          )}
        </div>

        {result ? (
          <div>
            {/* THREE MAIN VOLUME UNITS TILES */}
            <div className="calc-volume-grid">
              <div className="calc-volume-tile primary">
                <div className="calc-volume-val tabular-nums">
                  {result.cubicYards.toFixed(3)}
                </div>
                <div className="calc-volume-sub">Cubic Yards (yd³ / cu yd)</div>
              </div>

              <div className="calc-volume-tile">
                <div className="calc-volume-val tabular-nums">
                  {result.totalVolume.toFixed(3)}
                </div>
                <div className="calc-volume-sub">Cubic Metres (m³ / cu m)</div>
              </div>

              <div className="calc-volume-tile">
                <div className="calc-volume-val tabular-nums">
                  {result.cubicFeet.toFixed(2)}
                </div>
                <div className="calc-volume-sub">Cubic Feet (ft³ / cu ft)</div>
              </div>
            </div>

            {/* PRE-MIXED BAGS & PROCUREMENT SPECIFICATION TABLE */}
            <table className="calc-spec-table">
              <tbody>
                <tr>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Package size={15} color="var(--calc-blue)" />
                      <span>25kg Pre-Mix Bags (UK Standard)</span>
                    </div>
                  </th>
                  <td className="tabular-nums">
                    <strong>{result.bags25kg.toLocaleString('en-GB')} bags</strong>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                      ~{Math.ceil(result.bags25kg / 56)} pallet (56 bags/pallet) &middot; Est. £{Math.round(result.bgCostLow)} – £{Math.round(result.bgCostHigh)}
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Package size={15} color="var(--muted)" />
                      <span>20kg Pre-Mix Bags (UK Small)</span>
                    </div>
                  </th>
                  <td className="tabular-nums">
                    <strong>{result.bags20kg.toLocaleString('en-GB')} bags</strong>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      Based on ~0.0095 m³ yield per 20kg bag
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Package size={15} color="var(--muted)" />
                      <span>60-lb Pre-Mix Bags (US Standard)</span>
                    </div>
                  </th>
                  <td className="tabular-nums">
                    <strong>{result.bags60lb.toLocaleString('en-GB')} bags</strong>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      Based on ~0.45 cu ft yield per 60lb bag
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Package size={15} color="var(--muted)" />
                      <span>80-lb Pre-Mix Bags (US Standard)</span>
                    </div>
                  </th>
                  <td className="tabular-nums">
                    <strong>{result.bags80lb.toLocaleString('en-GB')} bags</strong>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      Based on ~0.60 cu ft yield per 80lb bag
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Truck size={15} color="var(--calc-blue)" />
                      <span>Ready-Mix Delivery Order</span>
                    </div>
                  </th>
                  <td className="tabular-nums">
                    <strong>{result.readyMixOrder.toFixed(2)} m³ ({ (result.readyMixOrder * 1.30795).toFixed(2) } cu yd)</strong>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      Est. £{Math.round(result.rmCostLow)} – £{Math.round(result.rmCostHigh)} + delivery
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Scale size={15} color="var(--calc-blue)" />
                      <span>Estimated Wet Concrete Weight</span>
                    </div>
                  </th>
                  <td className="tabular-nums">
                    <strong>{result.wetWeightTonnes.toFixed(2)} tonnes ({Math.round(result.wetWeightLbs).toLocaleString('en-GB')} lbs)</strong>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                      ~{Math.ceil(result.totalVolume / 0.07)} wheelbarrows (at ~160kg per load)
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Layers size={15} color="var(--calc-blue)" />
                      <span>Raw Materials for Site-Mixing ({result.mixRatio})</span>
                    </div>
                  </th>
                  <td className="tabular-nums">
                    <strong>{result.cement25kgBags} bags Cement (25kg)</strong>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                      + {result.sandTonnes.toFixed(2)}t Sharp Sand (~{Math.ceil(result.sandTonnes / 0.85)} bulk bag) + {result.gravelTonnes.toFixed(2)}t 20mm Gravel
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Practical Advice Note */}
            <div style={{ background: 'var(--calc-card-bg)', border: '1px solid var(--calc-card-border)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', fontSize: '13.5px', color: 'var(--ink)', margin: '14px 0' }}>
              <strong>Advisory:</strong> {result.recommendationNote}
            </div>

            {/* ACTION BUTTONS */}
            <div className="action-bar">
              <button
                type="button"
                className="btn-action"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                title="Download PDF Specification"
              >
                <FileDown size={14} aria-hidden="true" />
                <span>{isExportingPdf ? 'Exporting...' : 'Export PDF'}</span>
              </button>
              <button
                type="button"
                className="btn-action"
                onClick={handleExportCsv}
                title="Download CSV for Excel"
              >
                <FileSpreadsheet size={14} aria-hidden="true" />
                <span>Export CSV</span>
              </button>
              <button
                type="button"
                className="btn-action"
                onClick={copySummary}
                title="Copy Estimate Summary"
              >
                {copied ? <Check size={14} color="var(--ok)" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>
              <button
                type="button"
                className="btn-action"
                onClick={() => typeof window !== 'undefined' && window.print()}
                title="Print this estimate"
              >
                <Printer size={14} aria-hidden="true" />
                <span>Print</span>
              </button>
            </div>

            {copied && <div className="copied-toast">Summary copied to clipboard!</div>}
          </div>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>
            Enter your dimensions above and click <strong>Calculate</strong> to view results.
          </div>
        )}
      </div>
    </div>
  );
};
