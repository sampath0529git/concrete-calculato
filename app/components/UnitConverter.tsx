'use client';

import React, { useState } from 'react';

type ConverterTab = 'volume' | 'weight' | 'density';

type VolumeUnit = 'm3' | 'yd3' | 'ft3' | 'litres' | 'bags25' | 'wheelbarrows';
type WeightUnit = 'tonnes' | 'kg' | 'lbs' | 'bulk_bags' | 'bags25';

export const UnitConverter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ConverterTab>('volume');

  // Volume state
  const [volumeValue, setVolumeValue] = useState<string>('1');
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>('m3');

  // Weight state
  const [weightValue, setWeightValue] = useState<string>('1');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('tonnes');

  // Density / Volume ⇄ Weight state
  const [densityMode, setDensityMode] = useState<'vol_to_wt' | 'wt_to_vol'>('vol_to_wt');
  const [densityInputVal, setDensityInputVal] = useState<string>('1');
  const [densityGrade, setDensityGrade] = useState<number>(2.4); // 2.40 t/m3 standard C20
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    }
  };

  // Volume calculations in m3 base
  const parseNum = (val: string): number => {
    const n = parseFloat(val);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  const getBaseM3 = (): number => {
    const val = parseNum(volumeValue);
    switch (volumeUnit) {
      case 'm3':
        return val;
      case 'yd3':
        return val / 1.30795;
      case 'ft3':
        return val / 35.3147;
      case 'litres':
        return val / 1000;
      case 'bags25':
        return val * 0.012; // 0.012 m3 per 25kg bag
      case 'wheelbarrows':
        return val * 0.07; // ~70 litres per barrow
      default:
        return val;
    }
  };

  const baseM3 = getBaseM3();
  const volumeResults = {
    m3: baseM3,
    yd3: baseM3 * 1.30795,
    ft3: baseM3 * 35.3147,
    litres: baseM3 * 1000,
    bags25: baseM3 / 0.012,
    wheelbarrows: baseM3 / 0.07,
  };

  // Weight calculations in kg base
  const getBaseKg = (): number => {
    const val = parseNum(weightValue);
    switch (weightUnit) {
      case 'tonnes':
        return val * 1000;
      case 'kg':
        return val;
      case 'lbs':
        return val / 2.20462;
      case 'bulk_bags':
        return val * 850; // UK trade standard bulk bag is 850kg
      case 'bags25':
        return val * 25;
      default:
        return val;
    }
  };

  const baseKg = getBaseKg();
  const weightResults = {
    tonnes: baseKg / 1000,
    kg: baseKg,
    lbs: baseKg * 2.20462,
    bulk_bags: baseKg / 850,
    bags25: baseKg / 25,
  };

  // Volume ⇄ Wet Weight calculations
  const densityInput = parseNum(densityInputVal);
  let wetWeightTonnes = 0;
  let wetWeightKg = 0;
  let concreteM3 = 0;
  let concreteYd3 = 0;

  if (densityMode === 'vol_to_wt') {
    concreteM3 = densityInput;
    concreteYd3 = densityInput * 1.30795;
    wetWeightTonnes = densityInput * densityGrade;
    wetWeightKg = wetWeightTonnes * 1000;
  } else {
    wetWeightTonnes = densityInput;
    wetWeightKg = densityInput * 1000;
    concreteM3 = densityGrade > 0 ? densityInput / densityGrade : 0;
    concreteYd3 = concreteM3 * 1.30795;
  }

  return (
    <section className="converter-section" id="unit-converter">
      <div className="panel" style={{ padding: '28px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div className="badge-calc" style={{ marginBottom: '8px' }}>
            <span>⇄</span> Trade Converter
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: '1.6rem' }}>Concrete Unit Converter</h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '15px' }}>
            Quickly convert volume and weight between UK ready-mix lorries, merchant bulk bags, DIY bags, and imperial specifications.
          </p>
        </div>

        {/* Tab selection */}
        <div className="converter-tabs" role="tablist" aria-label="Converter category">
          <button
            type="button"
            className={`converter-tab-btn ${activeTab === 'volume' ? 'active' : ''}`}
            onClick={() => setActiveTab('volume')}
            role="tab"
            aria-selected={activeTab === 'volume'}
          >
            📦 Volume (m³, yd³, ft³, Litres)
          </button>
          <button
            type="button"
            className={`converter-tab-btn ${activeTab === 'weight' ? 'active' : ''}`}
            onClick={() => setActiveTab('weight')}
            role="tab"
            aria-selected={activeTab === 'weight'}
          >
            ⚖️ Weight (Tonnes, kg, Bulk bags, lbs)
          </button>
          <button
            type="button"
            className={`converter-tab-btn ${activeTab === 'density' ? 'active' : ''}`}
            onClick={() => setActiveTab('density')}
            role="tab"
            aria-selected={activeTab === 'density'}
          >
            🔄 Volume ⇄ Wet Weight
          </button>
        </div>

        {/* TAB 1: VOLUME CONVERTER */}
        {activeTab === 'volume' && (
          <div>
            <div className="converter-input-box">
              <div className="f" style={{ margin: 0 }}>
                <label htmlFor="vol-val">Enter Volume Value</label>
                <input
                  id="vol-val"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={volumeValue}
                  onChange={(e) => setVolumeValue(e.target.value)}
                  placeholder="e.g. 1"
                />
              </div>
              <div className="f" style={{ margin: 0 }}>
                <label htmlFor="vol-unit">Unit to Convert From</label>
                <select
                  id="vol-unit"
                  value={volumeUnit}
                  onChange={(e) => setVolumeUnit(e.target.value as VolumeUnit)}
                >
                  <option value="m3">Cubic Metres (m³)</option>
                  <option value="yd3">Cubic Yards (yd³ / cu yd)</option>
                  <option value="ft3">Cubic Feet (ft³ / cu ft)</option>
                  <option value="litres">Litres (L)</option>
                  <option value="bags25">25kg Pre-Mix Bags (at 0.012 m³)</option>
                  <option value="wheelbarrows">Builder Wheelbarrows (~70 Litres)</option>
                </select>
              </div>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', marginTop: '16px' }}>
              EQUIVALENT VOLUMES:
            </div>

            <div className="converter-grid">
              <div className={`converter-card ${volumeUnit === 'm3' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>Cubic Metres (m³)</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${volumeResults.m3.toFixed(3)} m³`, 'm3')}
                    title="Copy value"
                  >
                    {copiedKey === 'm3' ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="converter-card-val">{volumeResults.m3.toFixed(3)}</div>
                <div className="converter-card-sub">UK standard ready-mix order unit</div>
              </div>

              <div className={`converter-card ${volumeUnit === 'yd3' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>Cubic Yards (yd³)</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${volumeResults.yd3.toFixed(3)} yd³`, 'yd3')}
                    title="Copy value"
                  >
                    {copiedKey === 'yd3' ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="converter-card-val">{volumeResults.yd3.toFixed(3)}</div>
                <div className="converter-card-sub">Common US &amp; imperial plans</div>
              </div>

              <div className={`converter-card ${volumeUnit === 'ft3' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>Cubic Feet (ft³)</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${volumeResults.ft3.toFixed(2)} ft³`, 'ft3')}
                    title="Copy value"
                  >
                    {copiedKey === 'ft3' ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="converter-card-val">{volumeResults.ft3.toFixed(2)}</div>
                <div className="converter-card-sub">27 cu ft = 1 cu yard</div>
              </div>

              <div className={`converter-card ${volumeUnit === 'litres' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>Litres (L)</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${Math.round(volumeResults.litres)} L`, 'litres')}
                    title="Copy value"
                  >
                    {copiedKey === 'litres' ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="converter-card-val">{Math.round(volumeResults.litres).toLocaleString('en-GB')}</div>
                <div className="converter-card-sub">Useful for mixer drum capacity</div>
              </div>

              <div className={`converter-card ${volumeUnit === 'bags25' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>25kg Bags (Dry Mix)</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${Math.ceil(volumeResults.bags25)} bags`, 'bags25')}
                    title="Copy value"
                  >
                    {copiedKey === 'bags25' ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="converter-card-val">~{Math.ceil(volumeResults.bags25)}</div>
                <div className="converter-card-sub">Based on ~0.012 m³ yield per bag</div>
              </div>

              <div className={`converter-card ${volumeUnit === 'wheelbarrows' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>Wheelbarrows</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${Math.ceil(volumeResults.wheelbarrows)} barrows`, 'wheelbarrows')}
                    title="Copy value"
                  >
                    {copiedKey === 'wheelbarrows' ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="converter-card-val">~{Math.ceil(volumeResults.wheelbarrows)}</div>
                <div className="converter-card-sub">Approx 14–15 full loads per m³</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WEIGHT CONVERTER */}
        {activeTab === 'weight' && (
          <div>
            <div className="converter-input-box">
              <div className="f" style={{ margin: 0 }}>
                <label htmlFor="wt-val">Enter Weight Value</label>
                <input
                  id="wt-val"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  placeholder="e.g. 1"
                />
              </div>
              <div className="f" style={{ margin: 0 }}>
                <label htmlFor="wt-unit">Unit to Convert From</label>
                <select
                  id="wt-unit"
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
                >
                  <option value="tonnes">Metric Tonnes (t / 1,000 kg)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="bulk_bags">UK Bulk Bags (850kg jumbo bags)</option>
                  <option value="lbs">Pounds (lbs)</option>
                  <option value="bags25">25kg Maxi Bags</option>
                </select>
              </div>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)', marginTop: '16px' }}>
              EQUIVALENT WEIGHTS:
            </div>

            <div className="converter-grid">
              <div className={`converter-card ${weightUnit === 'tonnes' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>Metric Tonnes (t)</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${weightResults.tonnes.toFixed(3)} t`, 'tonnes')}
                    title="Copy value"
                  >
                    {copiedKey === 'tonnes' ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="converter-card-val">{weightResults.tonnes.toFixed(3)}</div>
                <div className="converter-card-sub">1 tonne = 1,000 kg</div>
              </div>

              <div className={`converter-card ${weightUnit === 'kg' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>Kilograms (kg)</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${Math.round(weightResults.kg)} kg`, 'kg')}
                    title="Copy value"
                  >
                    {copiedKey === 'kg' ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="converter-card-val">{Math.round(weightResults.kg).toLocaleString('en-GB')}</div>
                <div className="converter-card-sub">Base SI weight unit</div>
              </div>

              <div className={`converter-card ${weightUnit === 'bulk_bags' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>UK Bulk Bags (850kg)</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${weightResults.bulk_bags.toFixed(2)} bulk bags`, 'bulk_bags')}
                    title="Copy value"
                  >
                    {copiedKey === 'bulk_bags' ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="converter-card-val">{weightResults.bulk_bags.toFixed(2)}</div>
                <div className="converter-card-sub">Merchant sand &amp; gravel bags</div>
              </div>

              <div className={`converter-card ${weightUnit === 'lbs' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>Pounds (lbs)</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${Math.round(weightResults.lbs)} lbs`, 'lbs')}
                    title="Copy value"
                  >
                    {copiedKey === 'lbs' ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="converter-card-val">{Math.round(weightResults.lbs).toLocaleString('en-GB')}</div>
                <div className="converter-card-sub">1 kg ≈ 2.205 lbs</div>
              </div>

              <div className={`converter-card ${weightUnit === 'bags25' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>25kg Bags</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${Math.ceil(weightResults.bags25)} bags`, 'w_bags25')}
                    title="Copy value"
                  >
                    {copiedKey === 'w_bags25' ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
                <div className="converter-card-val">~{Math.ceil(weightResults.bags25)}</div>
                <div className="converter-card-sub">Standard individual cement bag</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VOLUME ⇄ WET WEIGHT ESTIMATOR */}
        {activeTab === 'density' && (
          <div>
            <div className="row" style={{ marginBottom: '16px' }}>
              <div className="f" style={{ margin: 0 }}>
                <label htmlFor="density-mode">Conversion Direction</label>
                <select
                  id="density-mode"
                  value={densityMode}
                  onChange={(e) => setDensityMode(e.target.value as 'vol_to_wt' | 'wt_to_vol')}
                >
                  <option value="vol_to_wt">Volume (m³) ➔ Wet Weight (Tonnes &amp; kg)</option>
                  <option value="wt_to_vol">Weight (Tonnes) ➔ Concrete Volume (m³ &amp; yd³)</option>
                </select>
              </div>
              <div className="f" style={{ margin: 0 }}>
                <label htmlFor="density-grade">Concrete Mix Density</label>
                <select
                  id="density-grade"
                  value={densityGrade.toString()}
                  onChange={(e) => setDensityGrade(parseFloat(e.target.value))}
                >
                  <option value="2.4">C20 Domestic (~2.40 t/m³) – Standard</option>
                  <option value="2.45">C25–C30 Structural (~2.45 t/m³) – Heavy duty</option>
                  <option value="2.35">C10–C15 Lean Mix (~2.35 t/m³) – Trench fill</option>
                </select>
              </div>
            </div>

            <div className="f">
              <label htmlFor="density-val">
                {densityMode === 'vol_to_wt' ? 'Enter Concrete Volume (m³)' : 'Enter Total Weight (Tonnes)'}
              </label>
              <input
                id="density-val"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={densityInputVal}
                onChange={(e) => setDensityInputVal(e.target.value)}
                placeholder="1"
              />
            </div>

            <div className="converter-grid" style={{ marginTop: '14px' }}>
              <div className="converter-card highlight">
                <div className="converter-card-label">
                  <span>Wet Weight (Tonnes)</span>
                </div>
                <div className="converter-card-val">{wetWeightTonnes.toFixed(2)} t</div>
                <div className="converter-card-sub">
                  {Math.round(wetWeightKg).toLocaleString('en-GB')} kg total wet concrete
                </div>
              </div>

              <div className="converter-card">
                <div className="converter-card-label">
                  <span>Equivalent Volume (m³)</span>
                </div>
                <div className="converter-card-val">{concreteM3.toFixed(2)} m³</div>
                <div className="converter-card-sub">{concreteYd3.toFixed(2)} cubic yards</div>
              </div>

              <div className="converter-card">
                <div className="converter-card-label">
                  <span>Wheelbarrow Loads</span>
                </div>
                <div className="converter-card-val">~{Math.ceil(concreteM3 / 0.07)} barrows</div>
                <div className="converter-card-sub">At ~160kg per loaded barrow</div>
              </div>

              <div className="converter-card">
                <div className="converter-card-label">
                  <span>Skip / Axle Load Safety</span>
                </div>
                <div className="converter-card-val">
                  {wetWeightTonnes <= 4 ? 'Standard Skip' : 'Heavy Inert Skip'}
                </div>
                <div className="converter-card-sub">
                  {wetWeightTonnes > 6 ? '⚠️ Heavy load: confirm haulier limits' : '✓ Normal domestic load'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference Table for Suppliers */}
        <details style={{ marginTop: '24px', borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
          <summary style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)' }}>
            📖 Supplier Specification Cheat Sheet (UK Builder Standards)
          </summary>
          <div className="scroll" style={{ marginTop: '12px' }}>
            <table className="quick-ref-table">
              <thead>
                <tr>
                  <th>Measurement</th>
                  <th>Metric Equivalent</th>
                  <th>Imperial Equivalent</th>
                  <th>Common Trade Application</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>1 Cubic Metre (m³)</strong></td>
                  <td>1,000 litres · ~83 bags of 25kg mix</td>
                  <td>1.308 yd³ · 35.315 ft³</td>
                  <td>Standard ready-mix and volumetric delivery unit</td>
                </tr>
                <tr>
                  <td><strong>1 Cubic Yard (yd³)</strong></td>
                  <td>0.765 m³ · 764.5 litres</td>
                  <td>27 ft³ · ~64 bags of 25kg mix</td>
                  <td>Imperial drawings &amp; American specifications</td>
                </tr>
                <tr>
                  <td><strong>1 Metric Tonne (t)</strong></td>
                  <td>1,000 kg · ~1.18 bulk bags (850kg)</td>
                  <td>2,204.6 lbs · 0.984 long ton</td>
                  <td>Aggregate merchant weight rating &amp; skip hire limits</td>
                </tr>
                <tr>
                  <td><strong>1 Bulk Bag (Jumbo)</strong></td>
                  <td>~850 kg (~0.85 tonnes) · ~0.55 m³</td>
                  <td>1,874 lbs</td>
                  <td>Builders merchant delivery bag for sharp sand &amp; gravel</td>
                </tr>
                <tr>
                  <td><strong>1 Builder&apos;s Barrow</strong></td>
                  <td>~65–75 litres (wet concrete: ~150–180 kg)</td>
                  <td>~2.5 cubic feet</td>
                  <td>Barrowing from mixer or truck (14–16 barrows per m³)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </section>
  );
};
