'use client';

import React, { useState, useMemo } from 'react';
import { ConcreteShape, Preset, CalculationResult, UnitSystem, MixRatioKey } from '../types';
import { exportEstimatePdf } from '../lib/exportPdf';
import { exportEstimateCsv } from '../lib/exportCsv';

interface ShapeUnitConfig {
  hasRect: boolean;
  hasDia: boolean;
  hasSteps: boolean;
  hasDepth: boolean;
  depthLabel: string;
  defaultDepth: string;
  presets: Preset[];
  diaLabel?: string;
  defaultDia?: string;
}

const CONFIG_METRIC: Record<ConcreteShape, ShapeUnitConfig> = {
  slab: {
    hasRect: true,
    hasDia: false,
    hasSteps: false,
    hasDepth: true,
    depthLabel: 'Thickness (mm)',
    defaultDepth: '100',
    presets: [
      { label: 'Path 75mm', value: 75 },
      { label: 'Shed base 100mm', value: 100 },
      { label: 'Driveway 150mm', value: 150 },
    ],
  },
  footing: {
    hasRect: true,
    hasDia: false,
    hasSteps: false,
    hasDepth: true,
    depthLabel: 'Depth (mm)',
    defaultDepth: '300',
    presets: [
      { label: 'Strip 300mm', value: 300 },
      { label: 'Trench 450mm', value: 450 },
    ],
  },
  column: {
    hasRect: false,
    hasDia: true,
    hasSteps: false,
    hasDepth: true,
    depthLabel: 'Depth (mm)',
    defaultDepth: '600',
    diaLabel: 'Diameter (m)',
    defaultDia: '0.3',
    presets: [
      { label: 'Fence post 450mm', value: 450 },
      { label: 'Gate post 600mm', value: 600 },
    ],
  },
  circle: {
    hasRect: false,
    hasDia: true,
    hasSteps: false,
    hasDepth: true,
    depthLabel: 'Thickness (mm)',
    defaultDepth: '100',
    diaLabel: 'Diameter (m)',
    defaultDia: '2',
    presets: [
      { label: 'Base 100mm', value: 100 },
      { label: 'Heavy 150mm', value: 150 },
    ],
  },
  steps: {
    hasRect: false,
    hasDia: false,
    hasSteps: true,
    hasDepth: false,
    depthLabel: '',
    defaultDepth: '0',
    presets: [],
  },
};

const CONFIG_IMPERIAL: Record<ConcreteShape, ShapeUnitConfig> = {
  slab: {
    hasRect: true,
    hasDia: false,
    hasSteps: false,
    hasDepth: true,
    depthLabel: 'Thickness (inches)',
    defaultDepth: '4',
    presets: [
      { label: 'Path 3"', value: 3 },
      { label: 'Shed base 4"', value: 4 },
      { label: 'Driveway 6"', value: 6 },
    ],
  },
  footing: {
    hasRect: true,
    hasDia: false,
    hasSteps: false,
    hasDepth: true,
    depthLabel: 'Depth (inches)',
    defaultDepth: '12',
    presets: [
      { label: 'Strip 12"', value: 12 },
      { label: 'Trench 18"', value: 18 },
    ],
  },
  column: {
    hasRect: false,
    hasDia: true,
    hasSteps: false,
    hasDepth: true,
    depthLabel: 'Depth (inches)',
    defaultDepth: '24',
    diaLabel: 'Diameter (inches)',
    defaultDia: '12',
    presets: [
      { label: 'Fence post 18"', value: 18 },
      { label: 'Gate post 24"', value: 24 },
    ],
  },
  circle: {
    hasRect: false,
    hasDia: true,
    hasSteps: false,
    hasDepth: true,
    depthLabel: 'Thickness (inches)',
    defaultDepth: '4',
    diaLabel: 'Diameter (feet)',
    defaultDia: '6.5',
    presets: [
      { label: 'Base 4"', value: 4 },
      { label: 'Heavy 6"', value: 6 },
    ],
  },
  steps: {
    hasRect: false,
    hasDia: false,
    hasSteps: true,
    hasDepth: false,
    depthLabel: '',
    defaultDepth: '0',
    presets: [],
  },
};

export const MIX_RATIO_CONFIGS: Record<
  MixRatioKey,
  {
    label: string;
    shortLabel: string;
    description: string;
    strength: string;
    yield25kg: number; // m³ wet yield per 25kg ready-to-use bag
    yield20kg: number; // m³ wet yield per 20kg ready-to-use bag
    density: number; // tonnes / m³
    cementBagsPerM3: number; // 25kg pure cement bags per m³ for site mixing
    sandTonnesPerM3: number; // tonnes sharp sand per m³
    gravelTonnesPerM3: number; // tonnes coarse gravel/aggregate per m³
  }
> = {
  '1:2:4': {
    label: '1:2:4 — Standard / C20 (Bases, paths, domestic slabs)',
    shortLabel: '1:2:4 Standard (C20)',
    description: '1 cement : 2 sand : 4 aggregate. UK standard domestic mix for shed bases, paths and garage floors.',
    strength: 'C20 (20 N/mm² at 28 days)',
    yield25kg: 0.012, // ~83.3 bags / m³
    yield20kg: 0.0095, // ~105.3 bags / m³
    density: 2.4,
    cementBagsPerM3: 12.8,
    sandTonnesPerM3: 0.64,
    gravelTonnesPerM3: 1.28,
  },
  '1:1.5:3': {
    label: '1:1.5:3 — High Strength / C25–C30 (Driveways & heavy footings)',
    shortLabel: '1:1.5:3 Strong (C25–C30)',
    description: '1 cement : 1.5 sand : 3 aggregate. High cement ratio for driveways, vehicle parking and structural footings.',
    strength: 'C25–C30 (25–30 N/mm²)',
    yield25kg: 0.011, // ~90.9 bags / m³
    yield20kg: 0.0087, // ~114.9 bags / m³
    density: 2.45,
    cementBagsPerM3: 15.2,
    sandTonnesPerM3: 0.57,
    gravelTonnesPerM3: 1.14,
  },
  '1:3:6': {
    label: '1:3:6 — Lean Mix / C10–C15 (Blindings, sub-bases, mass trench fill)',
    shortLabel: '1:3:6 Lean Mix (C10–C15)',
    description: '1 cement : 3 sand : 6 aggregate. High aggregate proportion for non-structural blindings, sub-bases and filling.',
    strength: 'C10–C15 (10–15 N/mm²)',
    yield25kg: 0.0135, // ~74.1 bags / m³
    yield20kg: 0.0108, // ~92.6 bags / m³
    density: 2.35,
    cementBagsPerM3: 8.8,
    sandTonnesPerM3: 0.72,
    gravelTonnesPerM3: 1.44,
  },
  '1:2:3': {
    label: '1:2:3 — Watertight / C25 (Steps, retaining walls, damp areas)',
    shortLabel: '1:2:3 Watertight (C25)',
    description: '1 cement : 2 sand : 3 aggregate. Dense, low-porosity mix designed for exterior steps, retaining walls and damp spots.',
    strength: 'C25 (25 N/mm²)',
    yield25kg: 0.0116, // ~86.2 bags / m³
    yield20kg: 0.0092, // ~108.7 bags / m³
    density: 2.42,
    cementBagsPerM3: 14.0,
    sandTonnesPerM3: 0.65,
    gravelTonnesPerM3: 0.98,
  },
  '1:5': {
    label: '1:5 — Ballast Mix (General DIY, all-in aggregate)',
    shortLabel: '1:5 All-in Ballast',
    description: '1 cement : 5 combined ballast (premixed sand + gravel). Fast and convenient general DIY concrete.',
    strength: 'C15–C20',
    yield25kg: 0.0125, // ~80.0 bags / m³
    yield20kg: 0.0099, // ~101.0 bags / m³
    density: 2.38,
    cementBagsPerM3: 12.0,
    sandTonnesPerM3: 0.6,
    gravelTonnesPerM3: 1.2,
  },
};

export const Calculator: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');
  const [shape, setShape] = useState<ConcreteShape>('slab');

  // Input fields
  const [length, setLength] = useState<string>('3');
  const [width, setWidth] = useState<string>('3');
  const [diameter, setDiameter] = useState<string>('0.3');
  const [stepCount, setStepCount] = useState<string>('3');
  const [stepWidth, setStepWidth] = useState<string>('1');
  const [stepRise, setStepRise] = useState<string>('175');
  const [stepGoing, setStepGoing] = useState<string>('250');
  const [depth, setDepth] = useState<string>('100');
  const [waste, setWaste] = useState<string>('10');
  const [mixRatio, setMixRatio] = useState<MixRatioKey>('1:2:4');
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const parseVal = (str: string): number => {
    const v = parseFloat(str);
    return Number.isFinite(v) && v > 0 ? v : 0;
  };

  const handleUnitChange = (newUnit: UnitSystem) => {
    if (newUnit === unitSystem) return;

    if (newUnit === 'imperial') {
      // Metric -> Imperial
      const lenVal = parseVal(length);
      const widVal = parseVal(width);
      const depVal = parseVal(depth);
      const diaVal = parseVal(diameter);
      const swVal = parseVal(stepWidth);
      const riVal = parseVal(stepRise);
      const gVal = parseVal(stepGoing);

      if (lenVal > 0) setLength((lenVal * 3.28084).toFixed(2));
      if (widVal > 0) setWidth((widVal * 3.28084).toFixed(2));
      if (depVal > 0) setDepth((depVal / 25.4).toFixed(1));

      if (shape === 'column') {
        if (diaVal > 0) setDiameter(((diaVal * 1000) / 25.4).toFixed(1));
      } else if (shape === 'circle') {
        if (diaVal > 0) setDiameter((diaVal * 3.28084).toFixed(2));
      }

      if (swVal > 0) setStepWidth((swVal * 3.28084).toFixed(2));
      if (riVal > 0) setStepRise((riVal / 25.4).toFixed(1));
      if (gVal > 0) setStepGoing((gVal / 25.4).toFixed(1));
    } else {
      // Imperial -> Metric
      const lenVal = parseVal(length);
      const widVal = parseVal(width);
      const depVal = parseVal(depth);
      const diaVal = parseVal(diameter);
      const swVal = parseVal(stepWidth);
      const riVal = parseVal(stepRise);
      const gVal = parseVal(stepGoing);

      if (lenVal > 0) setLength((lenVal / 3.28084).toFixed(2));
      if (widVal > 0) setWidth((widVal / 3.28084).toFixed(2));
      if (depVal > 0) setDepth(Math.round(depVal * 25.4).toString());

      if (shape === 'column') {
        if (diaVal > 0) setDiameter(((diaVal * 25.4) / 1000).toFixed(2));
      } else if (shape === 'circle') {
        if (diaVal > 0) setDiameter((diaVal / 3.28084).toFixed(2));
      }

      if (swVal > 0) setStepWidth((swVal / 3.28084).toFixed(2));
      if (riVal > 0) setStepRise(Math.round(riVal * 25.4).toString());
      if (gVal > 0) setStepGoing(Math.round(gVal * 25.4).toString());
    }

    setUnitSystem(newUnit);
  };

  const handleShapeChange = (newShape: ConcreteShape) => {
    setShape(newShape);
    const activeCfg = unitSystem === 'metric' ? CONFIG_METRIC[newShape] : CONFIG_IMPERIAL[newShape];
    if (activeCfg.hasDepth) {
      setDepth(activeCfg.defaultDepth);
    }
    if (activeCfg.hasDia && activeCfg.defaultDia) {
      setDiameter(activeCfg.defaultDia);
    }
  };

  const currentCfg = unitSystem === 'metric' ? CONFIG_METRIC[shape] : CONFIG_IMPERIAL[shape];
  const activeMixConfig = MIX_RATIO_CONFIGS[mixRatio];

  const result: CalculationResult | null = useMemo(() => {
    let netV = 0; // in cubic metres
    const depVal = parseVal(depth);

    if (unitSystem === 'metric') {
      if (shape === 'slab' || shape === 'footing') {
        const lenVal = parseVal(length);
        const widVal = parseVal(width);
        if (lenVal > 0 && widVal > 0 && depVal > 0) {
          netV = (lenVal * widVal * depVal) / 1000;
        }
      } else if (shape === 'column' || shape === 'circle') {
        const diaVal = parseVal(diameter);
        if (diaVal > 0 && depVal > 0) {
          const r = diaVal / 2;
          netV = (Math.PI * r * r * depVal) / 1000;
        }
      } else if (shape === 'steps') {
        const N = Math.round(parseVal(stepCount));
        const sw = parseVal(stepWidth);
        const ri = parseVal(stepRise) / 1000;
        const g = parseVal(stepGoing) / 1000;
        if (N >= 1 && sw > 0 && ri > 0 && g > 0) {
          netV = (sw * ri * g * N * (N + 1)) / 2;
        }
      }
    } else {
      // Imperial (feet and inches converted to metres for universal mix & bag calculations)
      if (shape === 'slab' || shape === 'footing') {
        const lenFt = parseVal(length);
        const widFt = parseVal(width);
        const depIn = depVal;
        if (lenFt > 0 && widFt > 0 && depIn > 0) {
          const lenM = lenFt * 0.3048;
          const widM = widFt * 0.3048;
          const depM = depIn * 0.0254;
          netV = lenM * widM * depM;
        }
      } else if (shape === 'column') {
        // diameter in inches, depth in inches
        const diaIn = parseVal(diameter);
        const depIn = depVal;
        if (diaIn > 0 && depIn > 0) {
          const diaM = diaIn * 0.0254;
          const depM = depIn * 0.0254;
          const r = diaM / 2;
          netV = Math.PI * r * r * depM;
        }
      } else if (shape === 'circle') {
        // diameter in feet, depth in inches
        const diaFt = parseVal(diameter);
        const depIn = depVal;
        if (diaFt > 0 && depIn > 0) {
          const diaM = diaFt * 0.3048;
          const depM = depIn * 0.0254;
          const r = diaM / 2;
          netV = Math.PI * r * r * depM;
        }
      } else if (shape === 'steps') {
        // stepWidth in feet, stepRise in inches, stepGoing in inches
        const N = Math.round(parseVal(stepCount));
        const swFt = parseVal(stepWidth);
        const riIn = parseVal(stepRise);
        const gIn = parseVal(stepGoing);
        if (N >= 1 && swFt > 0 && riIn > 0 && gIn > 0) {
          const swM = swFt * 0.3048;
          const riM = riIn * 0.0254;
          const gM = gIn * 0.0254;
          netV = (swM * riM * gM * N * (N + 1)) / 2;
        }
      }
    }

    if (!(netV > 0)) return null;

    const wp = parseFloat(waste) / 100;
    const tot = netV * (1 + wp);
    const cuYards = tot * 1.30795;

    // Dynamically adjust bag counts according to the aggregate-to-cement ratio & yield
    const bags25 = Math.ceil(tot / activeMixConfig.yield25kg);
    const bags20 = Math.ceil(tot / activeMixConfig.yield20kg);
    const order = Math.ceil(tot * 4) / 4;
    const density = activeMixConfig.density;
    const tonnes = tot * density;

    // Aggregate requirements for on-site mixing from individual raw materials
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
      note = `For this volume, bagged mix (${mixRatio} ratio) is usually the simplest and most cost-effective option.`;
    } else if (rec === 'either') {
      note = `Bags (${mixRatio} ratio) and ready-mix are close in cost here. Compare a mini-mix quote with your bag total.`;
    } else {
      note = `At this volume ready-mix is normally cheaper and far less work than hand-mixing ${bags25} bags.`;
    }

    return {
      netVolume: netV,
      wastePercent: Math.round(wp * 100),
      totalVolume: tot,
      cubicYards: cuYards,
      mixRatio,
      mixRatioLabel: activeMixConfig.label,
      bags25kg: bags25,
      bags20kg: bags20,
      cement25kgBags,
      sandTonnes,
      gravelTonnes,
      readyMixOrder: order,
      wetWeightTonnes: tonnes,
      bgCostLow: bgLow,
      bgCostHigh: bgHigh,
      rmCostLow: rmLow,
      rmCostHigh: rmHigh,
      recommendation: rec,
      recommendationNote: note,
    };
  }, [shape, unitSystem, length, width, diameter, stepCount, stepWidth, stepRise, stepGoing, depth, waste, mixRatio, activeMixConfig]);

  const copySummary = () => {
    if (!result) return;
    const text = [
      `Concrete Estimate (ConcreteCalc.UK)`,
      `Units: ${unitSystem === 'metric' ? 'Metric (m, mm)' : 'Imperial (ft, in)'}`,
      `Shape: ${shape.toUpperCase()}`,
      `Mix Ratio: ${result.mixRatio} (${activeMixConfig.shortLabel})`,
      `Total Volume: ${result.totalVolume.toFixed(2)} m³ (${result.cubicYards?.toFixed(2)} cu yd) [${result.netVolume.toFixed(3)} m³ net + ${result.wastePercent}% waste]`,
      `Estimated Wet Weight: ${result.wetWeightTonnes.toFixed(1)} tonnes`,
      `25kg Pre-Mix Bags: ${result.bags25kg.toLocaleString('en-GB')} bags (£${Math.round(result.bgCostLow)} – £${Math.round(result.bgCostHigh)})`,
      `20kg Pre-Mix Bags: ${result.bags20kg.toLocaleString('en-GB')} bags`,
      `Site-Mix Raw Materials: ${result.cement25kgBags} bags Cement (25kg) + ${result.sandTonnes.toFixed(2)}t Sand + ${result.gravelTonnes.toFixed(2)}t Gravel`,
      `Ready-Mix Order: ${result.readyMixOrder.toFixed(2)} m³ (£${Math.round(result.rmCostLow)} – £${Math.round(result.rmCostHigh)} + delivery)`,
      `Recommendation: ${result.recommendationNote}`,
    ].join('\n');

    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleExportPdf = () => {
    if (!result) return;
    try {
      setIsExportingPdf(true);
      exportEstimatePdf({
        shape,
        result,
        unitSystem,
        dimensions: {
          length,
          width,
          depth,
          diameter,
          stepCount,
          stepWidth,
          stepRise,
          stepGoing,
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
        shape,
        result,
        unitSystem,
        dimensions: {
          length,
          width,
          depth,
          diameter,
          stepCount,
          stepWidth,
          stepRise,
          stepGoing,
          waste,
          mixRatio,
        },
      });
    } catch (err) {
      console.error('Failed to export CSV:', err);
    }
  };

  return (
    <div className="tool" id="calculator">
      <section className="panel" aria-label="Concrete calculator inputs">
        {/* Unit System Toggle */}
        <div className="unit-toggle-row">
          <span className="unit-toggle-label">
            <span>📏</span> Input Units:
          </span>
          <div className="unit-toggle-buttons" role="group" aria-label="Choose measurement system">
            <button
              type="button"
              className={`unit-toggle-btn ${unitSystem === 'metric' ? 'active' : ''}`}
              onClick={() => handleUnitChange('metric')}
              aria-pressed={unitSystem === 'metric'}
            >
              Metric (m, mm)
            </button>
            <button
              type="button"
              className={`unit-toggle-btn ${unitSystem === 'imperial' ? 'active' : ''}`}
              onClick={() => handleUnitChange('imperial')}
              aria-pressed={unitSystem === 'imperial'}
            >
              Imperial (ft, in)
            </button>
          </div>
        </div>

        {/* Shape Tabs */}
        <div className="tabs" role="tablist" aria-label="Shape">
          <button
            role="tab"
            aria-selected={shape === 'slab'}
            onClick={() => handleShapeChange('slab')}
          >
            Slab / base
          </button>
          <button
            role="tab"
            aria-selected={shape === 'footing'}
            onClick={() => handleShapeChange('footing')}
          >
            Footing
          </button>
          <button
            role="tab"
            aria-selected={shape === 'column'}
            onClick={() => handleShapeChange('column')}
          >
            Post hole / column
          </button>
          <button
            role="tab"
            aria-selected={shape === 'circle'}
            onClick={() => handleShapeChange('circle')}
          >
            Round slab
          </button>
          <button
            role="tab"
            aria-selected={shape === 'steps'}
            onClick={() => handleShapeChange('steps')}
          >
            Steps
          </button>
        </div>

        {currentCfg.hasRect && (
          <div className="row">
            <div className="f">
              <label htmlFor="len">
                Length {unitSystem === 'metric' ? '(m)' : '(ft)'}
              </label>
              <input
                id="len"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </div>
            <div className="f">
              <label htmlFor="wid">
                Width {unitSystem === 'metric' ? '(m)' : '(ft)'}
              </label>
              <input
                id="wid"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>
          </div>
        )}

        {currentCfg.hasDia && (
          <div className="f">
            <label htmlFor="dia">{currentCfg.diaLabel || 'Diameter'}</label>
            <input
              id="dia"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
            />
          </div>
        )}

        {currentCfg.hasSteps && (
          <div>
            <div className="row">
              <div className="f">
                <label htmlFor="sn">Number of steps</label>
                <input
                  id="sn"
                  type="number"
                  min="1"
                  step="1"
                  value={stepCount}
                  onChange={(e) => setStepCount(e.target.value)}
                />
              </div>
              <div className="f">
                <label htmlFor="sw">
                  Step width {unitSystem === 'metric' ? '(m)' : '(ft)'}
                </label>
                <input
                  id="sw"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={stepWidth}
                  onChange={(e) => setStepWidth(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="f">
                <label htmlFor="sr">
                  Rise {unitSystem === 'metric' ? '(mm)' : '(inches)'}
                </label>
                <input
                  id="sr"
                  type="number"
                  min="0"
                  step="0.1"
                  value={stepRise}
                  onChange={(e) => setStepRise(e.target.value)}
                />
              </div>
              <div className="f">
                <label htmlFor="sg">
                  Going {unitSystem === 'metric' ? '(mm)' : '(inches)'}
                </label>
                <input
                  id="sg"
                  type="number"
                  min="0"
                  step="0.1"
                  value={stepGoing}
                  onChange={(e) => setStepGoing(e.target.value)}
                />
              </div>
            </div>
            <div className="hint" style={{ marginBottom: '14px' }}>
              Calculated as a solid pour, with each step filled to the ground.
            </div>
          </div>
        )}

        {currentCfg.hasDepth && (
          <div className="f">
            <label htmlFor="dep">{currentCfg.depthLabel}</label>
            <input
              id="dep"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
            />
            {currentCfg.presets.length > 0 && (
              <div className="presets">
                {currentCfg.presets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setDepth(p.value.toString())}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Waste Allowance and Mix Ratio Dropdowns */}
        <div className="row">
          <div className="f">
            <label htmlFor="waste">Waste allowance</label>
            <select
              id="waste"
              value={waste}
              onChange={(e) => setWaste(e.target.value)}
            >
              <option value="0">0% (exact)</option>
              <option value="5">5%</option>
              <option value="10">10% (recommended)</option>
              <option value="15">15% (uneven ground)</option>
            </select>
          </div>
          <div className="f">
            <label htmlFor="mix-ratio">Mix Ratio (Cement : Sand : Aggregates)</label>
            <select
              id="mix-ratio"
              value={mixRatio}
              onChange={(e) => setMixRatio(e.target.value as MixRatioKey)}
            >
              <option value="1:2:4">1:2:4 — Standard / C20 (Shed bases, paths, slabs)</option>
              <option value="1:1.5:3">1:1.5:3 — High Strength / C25–C30 (Driveways, heavy footings)</option>
              <option value="1:3:6">1:3:6 — Lean Mix / C10–C15 (Blindings, trench fill, sub-bases)</option>
              <option value="1:2:3">1:2:3 — Watertight / C25 (Steps, retaining walls, damp areas)</option>
              <option value="1:5">1:5 — Ballast Mix (General DIY, all-in aggregate)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Mix Ratio Guidance Box */}
        <div className="hint" style={{ marginTop: '-4px', marginBottom: '14px', lineHeight: '1.5' }}>
          <strong>{activeMixConfig.shortLabel}:</strong> {activeMixConfig.description} Adjusts pre-mix bag requirements to ~{Math.round(1 / activeMixConfig.yield25kg)} bags/m³.
        </div>

        <button className="cta" type="button" onClick={() => {}}>
          Calculate concrete
        </button>
      </section>

      <section className="panel" aria-live="polite" aria-label="Results">
        {result ? (
          <div>
            <div className="big">
              {result.totalVolume.toLocaleString('en-GB', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              <small>
                m³ of concrete {unitSystem === 'imperial' && `(${result.cubicYards?.toFixed(2)} cu yd)`}
              </small>
            </div>
            <p className="sub">
              {result.netVolume.toLocaleString('en-GB', {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })}{' '}
              m³ net {unitSystem === 'imperial' && `(${(result.netVolume * 1.30795).toFixed(2)} cu yd)`} + {result.wastePercent}% waste &middot; about{' '}
              {result.wetWeightTonnes.toLocaleString('en-GB', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}{' '}
              tonnes wet weight ({result.mixRatio} mix)
            </p>
            <table>
              <tbody>
                <tr>
                  <th scope="row">
                    25kg pre-mix bags
                    {result.recommendation === 'bags' && (
                      <span className="tag">Best value</span>
                    )}
                  </th>
                  <td>
                    {result.bags25kg.toLocaleString('en-GB')} bags
                    <br />
                    <span className="hint">
                      £{Math.round(result.bgCostLow).toLocaleString('en-GB')} – £
                      {Math.round(result.bgCostHigh).toLocaleString('en-GB')} ({result.mixRatio} yield: ~{Math.round(1 / activeMixConfig.yield25kg)} bags/m³)
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">20kg pre-mix bags</th>
                  <td>
                    {result.bags20kg.toLocaleString('en-GB')} bags
                    <br />
                    <span className="hint">
                      Yield: ~{Math.round(1 / activeMixConfig.yield20kg)} bags/m³
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    Ready-mix order
                    {result.recommendation === 'ready' && (
                      <span className="tag">Best value</span>
                    )}
                  </th>
                  <td>
                    {result.readyMixOrder.toLocaleString('en-GB', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    m³
                    {unitSystem === 'imperial' && (
                      <> ({((result.readyMixOrder * 1.30795)).toFixed(2)} yd³)</>
                    )}
                    <br />
                    <span className="hint">
                      £{Math.round(result.rmCostLow).toLocaleString('en-GB')} – £
                      {Math.round(result.rmCostHigh).toLocaleString('en-GB')} + delivery
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Dynamic Aggregate Requirements for Site Mixing */}
            <div className="site-mix-box">
              <div className="site-mix-title">
                <span>🧱 Site-Mixed Materials ({result.mixRatio} Ratio)</span>
                <span className="hint" style={{ margin: 0, fontSize: '12px' }}>For buying loose/bulk sand &amp; gravel</span>
              </div>
              <div className="site-mix-grid">
                <div className="site-mix-item">
                  <div className="site-mix-item-label">Pure Cement (25kg)</div>
                  <div className="site-mix-item-val">{result.cement25kgBags} bags</div>
                </div>
                <div className="site-mix-item">
                  <div className="site-mix-item-label">Sharp Sand</div>
                  <div className="site-mix-item-val">
                    {result.sandTonnes.toFixed(2)} t
                    <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>
                      (~{Math.ceil(result.sandTonnes / 0.85)} bulk bag{Math.ceil(result.sandTonnes / 0.85) > 1 ? 's' : ''})
                    </div>
                  </div>
                </div>
                <div className="site-mix-item">
                  <div className="site-mix-item-label">Coarse Aggregate</div>
                  <div className="site-mix-item-val">
                    {result.gravelTonnes.toFixed(2)} t
                    <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>
                      (~{Math.ceil(result.gravelTonnes / 0.85)} bulk bag{Math.ceil(result.gravelTonnes / 0.85) > 1 ? 's' : ''})
                    </div>
                  </div>
                </div>
              </div>
              <div className="hint" style={{ marginTop: '8px', fontSize: '12px' }}>
                Requirements calculated for {activeMixConfig.strength}. Standard UK bulk bags are roughly 850kg.
              </div>
            </div>

            <div className="note">
              {result.recommendationNote} Small ready-mix loads may carry a short-load charge.
            </div>

            <div className="action-bar">
              <button
                type="button"
                className="btn-action"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                title="Download estimate as a PDF summary"
              >
                📄 {isExportingPdf ? 'Exporting PDF...' : 'Export PDF'}
              </button>
              <button
                type="button"
                className="btn-action"
                onClick={handleExportCsv}
                title="Download calculation data as a CSV spreadsheet for Excel"
              >
                📊 Export CSV
              </button>
              <button
                type="button"
                className="btn-action"
                onClick={copySummary}
                title="Copy breakdown to clipboard"
              >
                📋 {copied ? 'Copied!' : 'Copy Breakdown'}
              </button>
              <button
                type="button"
                className="btn-action"
                onClick={() => typeof window !== 'undefined' && window.print()}
                title="Print this estimate"
              >
                🖨️ Print Estimate
              </button>
            </div>
            {copied && <div className="copied-toast">Summary copied to clipboard</div>}
          </div>
        ) : (
          <div className="empty">
            <p>Enter your measurements and press calculate.</p>
          </div>
        )}
      </section>
    </div>
  );
};
