'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Box, Scale, RefreshCw, Copy, Check, Info, ArrowRight, ClipboardCheck, FileDown } from 'lucide-react';
import { exportTradeQuotePdf } from '../lib/exportPdf';

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
  const [densityGrade, setDensityGrade] = useState<number>(2.4);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [pdfDownloaded, setPdfDownloaded] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    }
  };

  const parseNum = (val: string): number => {
    const n = parseFloat(val);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  // Volume calculations in m3 base
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
        return val * 0.012;
      case 'wheelbarrows':
        return val * 0.07;
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
        return val * 850;
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

  const generateVolumeReport = () => {
    return [
      '==================================================',
      ' CONCRETE VOLUME ESTIMATION & TRADE QUOTE',
      '==================================================',
      `• Input Volume:       ${volumeValue} ${volumeUnit}`,
      `• Cubic Metres (m³):  ${volumeResults.m3.toFixed(3)} m³`,
      `• Cubic Yards (yd³):  ${volumeResults.yd3.toFixed(3)} cu yd (${volumeResults.ft3.toFixed(1)} cu ft)`,
      `• Litres (L):         ${Math.round(volumeResults.litres).toLocaleString('en-GB')} L`,
      '--------------------------------------------------',
      `• Estimated Weight:   ~${(volumeResults.m3 * 2.4).toFixed(2)} Metric Tonnes (~${Math.round(volumeResults.m3 * 2400).toLocaleString('en-GB')} kg wet)`,
      `• 25kg Pre-Mix Bags:  ~${Math.ceil(volumeResults.bags25)} bags (@ 0.012 m³ yield)`,
      `• Wheelbarrow Loads:  ~${Math.ceil(volumeResults.wheelbarrows)} barrows (~70L each)`,
      '--------------------------------------------------',
      'Generated via Concrete Calculator UK',
      '=================================================='
    ].join('\n');
  };

  const generateWeightReport = () => {
    return [
      '==================================================',
      ' CONCRETE WEIGHT ESTIMATION & TRADE QUOTE',
      '==================================================',
      `• Input Weight:       ${weightValue} ${weightUnit}`,
      `• Metric Tonnes:      ${weightResults.tonnes.toFixed(3)} Tonnes`,
      `• Kilograms (kg):     ${Math.round(weightResults.kg).toLocaleString('en-GB')} kg`,
      `• Imperial (lbs):     ${Math.round(weightResults.lbs).toLocaleString('en-GB')} lbs`,
      '--------------------------------------------------',
      `• 25kg Pre-Mix Bags:  ~${Math.ceil(weightResults.bags25)} bags (40 bags / tonne)`,
      `• 850kg Bulk Bags:    ${weightResults.bulk_bags.toFixed(2)} merchant dumpy bags`,
      `• Est. Concrete Vol:  ~${(weightResults.tonnes / 2.4).toFixed(3)} m³ (@ 2.4 t/m³ BS 8500)`,
      '--------------------------------------------------',
      'Generated via Concrete Calculator UK',
      '=================================================='
    ].join('\n');
  };

  const generateDensityReport = () => {
    const gradeLabel = densityGrade === 2.4 ? 'C20 Domestic (2.40 t/m³)' : densityGrade === 2.45 ? 'C25/C30 Heavy Duty (2.45 t/m³)' : 'C10/C15 Lean Mix (2.35 t/m³)';
    return [
      '==================================================',
      ' CONCRETE SPECIFICATION & TRADE QUOTE REPORT',
      ' Standard: BS 8500 Compliant',
      '==================================================',
      `• VOLUME (Net):       ${concreteM3.toFixed(2)} m³ (${concreteYd3.toFixed(2)} cu yd)`,
      `• WET WEIGHT:         ${wetWeightTonnes.toFixed(2)} Metric Tonnes (${Math.round(wetWeightKg).toLocaleString('en-GB')} kg)`,
      `• 25kg Bags Yield:    ~${Math.ceil(concreteM3 / 0.012)} pre-mix bags`,
      `• Wheelbarrow Loads:  ~${Math.ceil(concreteM3 / 0.07)} builder barrows (~70L / ~160kg wet)`,
      `• Mix Specification:  ${gradeLabel}`,
      `• Haulage / Skip:     ${wetWeightTonnes <= 4 ? 'Standard Skip / 3.5t Transit' : 'Heavy Inert Grab / Multi-Axle HGV'}`,
      '--------------------------------------------------',
      'Generated via Concrete Calculator UK',
      '=================================================='
    ].join('\n');
  };

  const handlePdfVolume = () => {
    exportTradeQuotePdf({
      tab: 'volume',
      mixName: 'Standard UK Concrete Mix (C20 / 2,400 kg/m³)',
      densityKgM3: 2400,
      inputDescription: `${volumeValue} ${volumeUnit}`,
      volumeM3: volumeResults.m3,
      volumeYd3: volumeResults.yd3,
      volumeFt3: volumeResults.ft3,
      litres: volumeResults.litres,
      tonnes: volumeResults.m3 * 2.4,
      kg: volumeResults.m3 * 2400,
      lbs: volumeResults.m3 * 2400 * 2.20462,
      bags25: volumeResults.bags25,
      bulkBags: (volumeResults.m3 * 2400) / 850,
      wheelbarrows: volumeResults.wheelbarrows,
      truckCapacityPercent6m3: (volumeResults.m3 / 6) * 100,
    });
    setPdfDownloaded('pdf_vol');
    setTimeout(() => setPdfDownloaded(null), 2500);
  };

  const handlePdfWeight = () => {
    exportTradeQuotePdf({
      tab: 'weight',
      mixName: 'Standard UK Concrete Mix (C20 / 2,400 kg/m³)',
      densityKgM3: 2400,
      inputDescription: `${weightValue} ${weightUnit}`,
      volumeM3: weightResults.tonnes / 2.4,
      volumeYd3: (weightResults.tonnes / 2.4) * 1.30795,
      volumeFt3: (weightResults.tonnes / 2.4) * 35.3147,
      litres: (weightResults.tonnes / 2.4) * 1000,
      tonnes: weightResults.tonnes,
      kg: weightResults.kg,
      lbs: weightResults.lbs,
      bags25: weightResults.bags25,
      bulkBags: weightResults.bulk_bags,
      wheelbarrows: (weightResults.tonnes / 2.4) / 0.07,
      truckCapacityPercent6m3: ((weightResults.tonnes / 2.4) / 6) * 100,
    });
    setPdfDownloaded('pdf_wt');
    setTimeout(() => setPdfDownloaded(null), 2500);
  };

  const handlePdfDensity = () => {
    const gradeLabel = densityGrade === 2.4 ? 'C20 Domestic (2.40 t/m³)' : densityGrade === 2.45 ? 'C25/C30 Heavy Duty (2.45 t/m³)' : 'C10/C15 Lean Mix (2.35 t/m³)';
    exportTradeQuotePdf({
      tab: 'density',
      mixName: gradeLabel,
      densityKgM3: densityGrade * 1000,
      inputDescription: densityMode === 'vol_to_wt' ? `${densityInputVal} m³ volume` : `${densityInputVal} tonnes weight`,
      volumeM3: concreteM3,
      volumeYd3: concreteYd3,
      volumeFt3: concreteM3 * 35.3147,
      litres: concreteM3 * 1000,
      tonnes: wetWeightTonnes,
      kg: wetWeightKg,
      lbs: wetWeightKg * 2.20462,
      bags25: concreteM3 / 0.012,
      bulkBags: wetWeightKg / 850,
      wheelbarrows: concreteM3 / 0.07,
      truckCapacityPercent6m3: (concreteM3 / 6) * 100,
      transportRecommendation: wetWeightTonnes <= 4 ? 'Standard Skip / 3.5t Transit' : 'Heavy Inert Grab / Multi-Axle HGV',
    });
    setPdfDownloaded('pdf_density');
    setTimeout(() => setPdfDownloaded(null), 2500);
  };

  return (
    <section className="converter-section" id="unit-converter">
      <div className="panel">
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
              Trade Conversion Tool
            </div>
            <h2 style={{ margin: '0 0 6px', fontSize: '1.5rem', fontWeight: 700 }}>
              Concrete Unit &amp; Weight Converter
            </h2>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '14.5px' }}>
              Instantly convert between UK cubic metres, American cubic yards, 850kg merchant bulk bags, DIY bags, and wet weight.
            </p>
          </div>
          <Link
            href="/concrete-weight-converter"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(217, 119, 6, 0.12)',
              color: 'var(--accent)',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              border: '1px solid rgba(217, 119, 6, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Open Dedicated Standalone Page</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Tab selection */}
        <div className="converter-tabs" role="tablist" aria-label="Converter categories">
          <button
            type="button"
            className={`converter-tab-btn ${activeTab === 'volume' ? 'active' : ''}`}
            onClick={() => setActiveTab('volume')}
            role="tab"
            aria-selected={activeTab === 'volume'}
          >
            <Box size={14} aria-hidden="true" />
            <span>Volume (m³, yd³, ft³, Litres)</span>
          </button>
          <button
            type="button"
            className={`converter-tab-btn ${activeTab === 'weight' ? 'active' : ''}`}
            onClick={() => setActiveTab('weight')}
            role="tab"
            aria-selected={activeTab === 'weight'}
          >
            <Scale size={14} aria-hidden="true" />
            <span>Weight (Tonnes, kg, Bulk Bags)</span>
          </button>
          <button
            type="button"
            className={`converter-tab-btn ${activeTab === 'density' ? 'active' : ''}`}
            onClick={() => setActiveTab('density')}
            role="tab"
            aria-selected={activeTab === 'density'}
          >
            <RefreshCw size={14} aria-hidden="true" />
            <span>Volume ⇄ Wet Weight</span>
          </button>
        </div>

        {/* TAB 1: VOLUME CONVERTER */}
        {activeTab === 'volume' && (
          <div>
            <div className="converter-input-box">
              <div className="f" style={{ margin: 0 }}>
                <label htmlFor="vol-val">Volume Value</label>
                <input
                  id="vol-val"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={volumeValue}
                  onChange={(e) => setVolumeValue(e.target.value)}
                  placeholder="1.0"
                />
              </div>
              <div className="f" style={{ margin: 0 }}>
                <label htmlFor="vol-unit">Convert From</label>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px', marginTop: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                Converted Results (Volume, Tonnes, Bags)
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handlePdfVolume}
                  style={{
                    background: pdfDownloaded === 'pdf_vol' ? 'var(--ok)' : 'var(--calc-blue)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Download volume calculations as formatted trade quote PDF"
                >
                  {pdfDownloaded === 'pdf_vol' ? <Check size={13} /> : <FileDown size={13} />}
                  <span>{pdfDownloaded === 'pdf_vol' ? 'PDF Exported!' : 'Export PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(generateVolumeReport(), 'quote_vol_home')}
                  style={{
                    background: copiedKey === 'quote_vol_home' ? 'var(--ok, #16a34a)' : 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                  title="Format converted volume, tonnes, and bags into structured trade quote report"
                >
                  {copiedKey === 'quote_vol_home' ? <Check size={13} /> : <ClipboardCheck size={13} />}
                  <span>{copiedKey === 'quote_vol_home' ? 'Trade Quote Copied!' : 'Copy All Results'}</span>
                </button>
              </div>
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
                    {copiedKey === 'm3' ? <Check size={12} color="var(--ok)" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="converter-card-val tabular-nums">{volumeResults.m3.toFixed(3)}</div>
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
                    {copiedKey === 'yd3' ? <Check size={12} color="var(--ok)" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="converter-card-val tabular-nums">{volumeResults.yd3.toFixed(3)}</div>
                <div className="converter-card-sub">Common imperial drawings (US plans)</div>
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
                    {copiedKey === 'ft3' ? <Check size={12} color="var(--ok)" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="converter-card-val tabular-nums">{volumeResults.ft3.toFixed(2)}</div>
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
                    {copiedKey === 'litres' ? <Check size={12} color="var(--ok)" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="converter-card-val tabular-nums">{Math.round(volumeResults.litres).toLocaleString('en-GB')}</div>
                <div className="converter-card-sub">Useful for mixer drum capacities</div>
              </div>

              <div className={`converter-card ${volumeUnit === 'bags25' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>25kg Bags</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${Math.ceil(volumeResults.bags25)} bags`, 'bags25')}
                    title="Copy value"
                  >
                    {copiedKey === 'bags25' ? <Check size={12} color="var(--ok)" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="converter-card-val tabular-nums">~{Math.ceil(volumeResults.bags25)}</div>
                <div className="converter-card-sub">At ~0.012 m³ yield per 25kg bag</div>
              </div>

              <div className={`converter-card ${volumeUnit === 'wheelbarrows' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>Wheelbarrow Loads</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${Math.ceil(volumeResults.wheelbarrows)} barrows`, 'wheelbarrows')}
                    title="Copy value"
                  >
                    {copiedKey === 'wheelbarrows' ? <Check size={12} color="var(--ok)" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="converter-card-val tabular-nums">~{Math.ceil(volumeResults.wheelbarrows)}</div>
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
                <label htmlFor="wt-val">Weight Value</label>
                <input
                  id="wt-val"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  placeholder="1.0"
                />
              </div>
              <div className="f" style={{ margin: 0 }}>
                <label htmlFor="wt-unit">Convert From</label>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px', marginTop: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                Converted Weight Results
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handlePdfWeight}
                  style={{
                    background: pdfDownloaded === 'pdf_wt' ? 'var(--ok)' : 'var(--calc-blue)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Download weight calculations as formatted trade quote PDF"
                >
                  {pdfDownloaded === 'pdf_wt' ? <Check size={13} /> : <FileDown size={13} />}
                  <span>{pdfDownloaded === 'pdf_wt' ? 'PDF Exported!' : 'Export PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(generateWeightReport(), 'quote_wt_home')}
                  style={{
                    background: copiedKey === 'quote_wt_home' ? 'var(--ok, #16a34a)' : 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                  title="Format converted weight, volume, and bags into structured trade quote report"
                >
                  {copiedKey === 'quote_wt_home' ? <Check size={13} /> : <ClipboardCheck size={13} />}
                  <span>{copiedKey === 'quote_wt_home' ? 'Trade Quote Copied!' : 'Copy All Results'}</span>
                </button>
              </div>
            </div>

            <div className="converter-grid">
              <div className={`converter-card ${weightUnit === 'tonnes' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>Metric Tonnes (t)</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${weightResults.tonnes.toFixed(3)} t`, 'tonnes')}
                  >
                    {copiedKey === 'tonnes' ? <Check size={12} color="var(--ok)" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="converter-card-val tabular-nums">{weightResults.tonnes.toFixed(3)}</div>
                <div className="converter-card-sub">1 tonne = 1,000 kg</div>
              </div>

              <div className={`converter-card ${weightUnit === 'kg' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>Kilograms (kg)</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${Math.round(weightResults.kg)} kg`, 'kg')}
                  >
                    {copiedKey === 'kg' ? <Check size={12} color="var(--ok)" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="converter-card-val tabular-nums">{Math.round(weightResults.kg).toLocaleString('en-GB')}</div>
                <div className="converter-card-sub">Base metric weight</div>
              </div>

              <div className={`converter-card ${weightUnit === 'bulk_bags' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>UK Bulk Bags (850kg)</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${weightResults.bulk_bags.toFixed(2)} bulk bags`, 'bulk_bags')}
                  >
                    {copiedKey === 'bulk_bags' ? <Check size={12} color="var(--ok)" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="converter-card-val tabular-nums">{weightResults.bulk_bags.toFixed(2)}</div>
                <div className="converter-card-sub">Builders merchant sand/gravel bags</div>
              </div>

              <div className={`converter-card ${weightUnit === 'lbs' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>Pounds (lbs)</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${Math.round(weightResults.lbs)} lbs`, 'lbs')}
                  >
                    {copiedKey === 'lbs' ? <Check size={12} color="var(--ok)" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="converter-card-val tabular-nums">{Math.round(weightResults.lbs).toLocaleString('en-GB')}</div>
                <div className="converter-card-sub">1 kg ≈ 2.205 lbs</div>
              </div>

              <div className={`converter-card ${weightUnit === 'bags25' ? 'highlight' : ''}`}>
                <div className="converter-card-label">
                  <span>25kg Bags</span>
                  <button
                    type="button"
                    className="converter-copy-btn"
                    onClick={() => handleCopy(`${Math.ceil(weightResults.bags25)} bags`, 'w_bags25')}
                  >
                    {copiedKey === 'w_bags25' ? <Check size={12} color="var(--ok)" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="converter-card-val tabular-nums">~{Math.ceil(weightResults.bags25)}</div>
                <div className="converter-card-sub">Standard individual cement bag</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VOLUME ⇄ WET WEIGHT */}
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
                  <option value="wt_to_vol">Weight (Tonnes) ➔ Volume (m³ &amp; yd³)</option>
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
                {densityMode === 'vol_to_wt' ? 'Concrete Volume (m³)' : 'Total Weight (Tonnes)'}
              </label>
              <input
                id="density-val"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={densityInputVal}
                onChange={(e) => setDensityInputVal(e.target.value)}
                placeholder="1.0"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px', marginTop: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                Wet Weight &amp; Trade Yield Results
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handlePdfDensity}
                  style={{
                    background: pdfDownloaded === 'pdf_density' ? 'var(--ok)' : 'var(--calc-blue)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Download density specification and yield calculations as trade quote PDF"
                >
                  {pdfDownloaded === 'pdf_density' ? <Check size={13} /> : <FileDown size={13} />}
                  <span>{pdfDownloaded === 'pdf_density' ? 'PDF Exported!' : 'Export PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(generateDensityReport(), 'quote_density_home')}
                  style={{
                    background: copiedKey === 'quote_density_home' ? 'var(--ok, #16a34a)' : 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                  title="Format wet weight, volume, and bags into structured trade quote report"
                >
                  {copiedKey === 'quote_density_home' ? <Check size={13} /> : <ClipboardCheck size={13} />}
                  <span>{copiedKey === 'quote_density_home' ? 'Trade Quote Copied!' : 'Copy All Results'}</span>
                </button>
              </div>
            </div>

            <div className="converter-grid" style={{ marginTop: '14px' }}>
              <div className="converter-card highlight">
                <div className="converter-card-label">
                  <span>Wet Weight (Tonnes)</span>
                </div>
                <div className="converter-card-val tabular-nums">{wetWeightTonnes.toFixed(2)} t</div>
                <div className="converter-card-sub tabular-nums">
                  {Math.round(wetWeightKg).toLocaleString('en-GB')} kg wet concrete
                </div>
              </div>

              <div className="converter-card">
                <div className="converter-card-label">
                  <span>Equivalent Volume (m³)</span>
                </div>
                <div className="converter-card-val tabular-nums">{concreteM3.toFixed(2)} m³</div>
                <div className="converter-card-sub tabular-nums">{concreteYd3.toFixed(2)} cubic yards</div>
              </div>

              <div className="converter-card">
                <div className="converter-card-label">
                  <span>Wheelbarrow Loads</span>
                </div>
                <div className="converter-card-val tabular-nums">~{Math.ceil(concreteM3 / 0.07)} barrows</div>
                <div className="converter-card-sub">At ~160kg per loaded barrow</div>
              </div>

              <div className="converter-card">
                <div className="converter-card-label">
                  <span>Haulage &amp; Skip Rating</span>
                </div>
                <div className="converter-card-val">
                  {wetWeightTonnes <= 4 ? 'Standard Skip' : 'Heavy Inert Only'}
                </div>
                <div className="converter-card-sub">
                  {wetWeightTonnes > 6 ? '⚠️ Check maximum vehicle axle limits' : '✓ Normal domestic load'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trade Reference Table */}
        <details style={{ marginTop: '24px', borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
          <summary>
            Supplier Specification Cheat Sheet (UK Merchant Standards)
          </summary>
          <div className="scroll" style={{ marginTop: '10px' }}>
            <table>
              <thead>
                <tr>
                  <th>Measurement</th>
                  <th>Metric Equivalent</th>
                  <th>Imperial Equivalent</th>
                  <th>Trade Use</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                <tr>
                  <td><strong>1 Cubic Metre (m³)</strong></td>
                  <td>1,000 litres &middot; ~83 bags (25kg)</td>
                  <td>1.308 yd³ &middot; 35.315 ft³</td>
                  <td>Ready-mix &amp; volumetric delivery</td>
                </tr>
                <tr>
                  <td><strong>1 Cubic Yard (yd³)</strong></td>
                  <td>0.765 m³ &middot; 764.5 litres</td>
                  <td>27 ft³ &middot; ~64 bags (25kg)</td>
                  <td>Imperial blueprints &amp; US designs</td>
                </tr>
                <tr>
                  <td><strong>1 Metric Tonne (t)</strong></td>
                  <td>1,000 kg &middot; ~1.18 bulk bags (850kg)</td>
                  <td>2,204.6 lbs</td>
                  <td>Skip hire &amp; aggregate orders</td>
                </tr>
                <tr>
                  <td><strong>1 Bulk Bag (Jumbo)</strong></td>
                  <td>~850 kg (~0.85 tonnes) &middot; ~0.55 m³</td>
                  <td>1,874 lbs</td>
                  <td>Builders merchant sand &amp; gravel</td>
                </tr>
                <tr>
                  <td><strong>1 Builder&apos;s Barrow</strong></td>
                  <td>~65–75 litres (~150–180 kg wet)</td>
                  <td>~2.5 cubic feet</td>
                  <td>Barrowing (14–16 barrows per m³)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </section>
  );
};
