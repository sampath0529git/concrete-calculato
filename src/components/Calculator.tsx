import React, { useState, useMemo } from 'react';
import { ConcreteShape, ShapeConfig, CalculationResult } from '../types';

const CONFIG: Record<ConcreteShape, ShapeConfig> = {
  slab: {
    hasRect: true,
    hasDia: false,
    hasSteps: false,
    hasDepth: true,
    depthLabel: 'Thickness (mm)',
    defaultDepth: 100,
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
    defaultDepth: 300,
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
    defaultDepth: 600,
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
    defaultDepth: 100,
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
    defaultDepth: 0,
    presets: [],
  },
};

export const Calculator: React.FC = () => {
  const [shape, setShape] = useState<ConcreteShape>('slab');
  const [length, setLength] = useState<string>('3');
  const [width, setWidth] = useState<string>('3');
  const [diameter, setDiameter] = useState<string>('0.3');
  const [stepCount, setStepCount] = useState<string>('3');
  const [stepWidth, setStepWidth] = useState<string>('1');
  const [stepRise, setStepRise] = useState<string>('175');
  const [stepGoing, setStepGoing] = useState<string>('250');
  const [depth, setDepth] = useState<string>('100');
  const [waste, setWaste] = useState<string>('10');
  const [mix, setMix] = useState<string>('2.4');
  const [copied, setCopied] = useState<boolean>(false);

  const handleShapeChange = (newShape: ConcreteShape) => {
    setShape(newShape);
    const cfg = CONFIG[newShape];
    if (cfg.hasDepth) {
      setDepth(cfg.defaultDepth.toString());
    }
    if (newShape === 'column') {
      setDiameter('0.3');
    } else if (newShape === 'circle') {
      setDiameter('2');
    }
  };

  const parseVal = (str: string): number => {
    const v = parseFloat(str);
    return Number.isFinite(v) && v > 0 ? v : 0;
  };

  const result: CalculationResult | null = useMemo(() => {
    let netV = 0;
    const depVal = parseVal(depth);

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

    if (!(netV > 0)) return null;

    const wp = parseFloat(waste) / 100;
    const tot = netV * (1 + wp);
    const bags25 = Math.ceil(tot / 0.012);
    const bags20 = Math.ceil(tot / 0.0095);
    const order = Math.ceil(tot * 4) / 4;
    const density = parseFloat(mix) || 2.4;
    const tonnes = tot * density;

    const rmLow = order * 110;
    const rmHigh = order * 185;
    const bgLow = bags25 * 5.5;
    const bgHigh = bags25 * 9.0;

    let rec: 'bags' | 'either' | 'ready' = 'ready';
    if (tot < 0.5) rec = 'bags';
    else if (tot < 1) rec = 'either';

    let note = '';
    if (rec === 'bags') {
      note = 'For this volume, bagged mix is usually the simplest option.';
    } else if (rec === 'either') {
      note = 'Bags and ready-mix are close in cost here. Compare a mini-mix quote with your bag total.';
    } else {
      note = 'At this volume ready-mix is normally cheaper and far less work than mixing bags by hand.';
    }

    return {
      netVolume: netV,
      wastePercent: Math.round(wp * 100),
      totalVolume: tot,
      bags25kg: bags25,
      bags20kg: bags20,
      readyMixOrder: order,
      wetWeightTonnes: tonnes,
      bgCostLow: bgLow,
      bgCostHigh: bgHigh,
      rmCostLow: rmLow,
      rmCostHigh: rmHigh,
      recommendation: rec,
      recommendationNote: note,
    };
  }, [shape, length, width, diameter, stepCount, stepWidth, stepRise, stepGoing, depth, waste, mix]);

  const copySummary = () => {
    if (!result) return;
    const text = [
      `Concrete Estimate (ConcreteCalc.UK)`,
      `Shape: ${shape.toUpperCase()}`,
      `Total Volume: ${result.totalVolume.toFixed(2)} m³ (${result.netVolume.toFixed(3)} m³ net + ${result.wastePercent}% waste)`,
      `Estimated Wet Weight: ${result.wetWeightTonnes.toFixed(1)} tonnes`,
      `25kg Bags Needed: ${result.bags25kg.toLocaleString('en-GB')} bags (£${Math.round(result.bgCostLow)} – £${Math.round(result.bgCostHigh)})`,
      `20kg Bags Needed: ${result.bags20kg.toLocaleString('en-GB')} bags`,
      `Ready-Mix Order: ${result.readyMixOrder.toFixed(2)} m³ (£${Math.round(result.rmCostLow)} – £${Math.round(result.rmCostHigh)} + delivery)`,
      `Recommendation: ${result.recommendationNote}`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const currentCfg = CONFIG[shape];

  return (
    <div className="tool" id="calculator">
      <section className="panel" aria-label="Concrete calculator inputs">
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
              <label htmlFor="len">Length (m)</label>
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
              <label htmlFor="wid">Width (m)</label>
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
            <label htmlFor="dia">Diameter (m)</label>
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
                <label htmlFor="sw">Step width (m)</label>
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
                <label htmlFor="sr">Rise (mm)</label>
                <input
                  id="sr"
                  type="number"
                  min="0"
                  value={stepRise}
                  onChange={(e) => setStepRise(e.target.value)}
                />
              </div>
              <div className="f">
                <label htmlFor="sg">Going (mm)</label>
                <input
                  id="sg"
                  type="number"
                  min="0"
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
            <label htmlFor="mix">Mix specification</label>
            <select
              id="mix"
              value={mix}
              onChange={(e) => setMix(e.target.value)}
            >
              <option value="2.4">C20 – paths, bases</option>
              <option value="2.4">C25 – footings</option>
              <option value="2.4">C30 – driveways</option>
            </select>
          </div>
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
              <small>m³ of concrete</small>
            </div>
            <p className="sub">
              {result.netVolume.toLocaleString('en-GB', {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })}{' '}
              m³ net + {result.wastePercent}% waste &middot; about{' '}
              {result.wetWeightTonnes.toLocaleString('en-GB', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}{' '}
              tonnes wet weight
            </p>
            <table>
              <tbody>
                <tr>
                  <th scope="row">
                    25kg bags
                    {result.recommendation === 'bags' && (
                      <span className="tag">Best value</span>
                    )}
                  </th>
                  <td>
                    {result.bags25kg.toLocaleString('en-GB')} bags
                    <br />
                    <span className="hint">
                      £{Math.round(result.bgCostLow).toLocaleString('en-GB')} – £
                      {Math.round(result.bgCostHigh).toLocaleString('en-GB')}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">20kg bags</th>
                  <td>{result.bags20kg.toLocaleString('en-GB')} bags</td>
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
                    <br />
                    <span className="hint">
                      £{Math.round(result.rmCostLow).toLocaleString('en-GB')} – £
                      {Math.round(result.rmCostHigh).toLocaleString('en-GB')} + delivery
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="note">
              {result.recommendationNote} Small ready-mix loads may carry a short-load charge.
            </div>

            <div className="action-bar">
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
                onClick={() => window.print()}
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
