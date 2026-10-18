'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  Layers,
  RotateCcw,
  Printer,
  Copy,
  Check,
  Package,
  Wrench,
  HelpCircle,
  FileSpreadsheet,
  Building,
  AlertTriangle,
  ShieldCheck,
  Truck,
  ArrowRight,
} from 'lucide-react';

interface FoundationPreset {
  id: string;
  name: string;
  trenchWidthMm: number;
  concreteDepthMm: number;
  trenchType: 'strip' | 'trench-fill';
  desc: string;
}

const FOUNDATION_PRESETS: FoundationPreset[] = [
  {
    id: 'cavity-strip',
    name: 'Standard Cavity Wall Strip Footing (600mm × 225mm)',
    trenchWidthMm: 600,
    concreteDepthMm: 225,
    trenchType: 'strip',
    desc: 'Traditional UK strip foundation for 300mm external cavity brick/block walls. Minimum 150mm projection either side.',
  },
  {
    id: 'single-skin-strip',
    name: 'Garden Wall / Single Skin Footing (450mm × 200mm)',
    trenchWidthMm: 450,
    concreteDepthMm: 200,
    trenchType: 'strip',
    desc: 'Strip foundation for 100mm or 215mm solid masonry garden walls and detached single-skin garages.',
  },
  {
    id: 'trench-fill-deep',
    name: 'Trench Fill Foundation (600mm × 800mm concrete)',
    trenchWidthMm: 600,
    concreteDepthMm: 800,
    trenchType: 'trench-fill',
    desc: 'Poured almost to ground level. Eliminates dangerous bricklaying in deep excavated trenches in clay soil.',
  },
  {
    id: 'conservatory-strip',
    name: 'Conservatory / Single-Storey Extension (450mm × 300mm)',
    trenchWidthMm: 450,
    concreteDepthMm: 300,
    trenchType: 'strip',
    desc: 'Ideal for lightweight single-storey domestic extensions and uPVC conservatories.',
  },
];

export default function ConcreteFootingCalculatorPage() {
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [trenchLength, setTrenchLength] = useState<number>(18.0);
  const [trenchWidthMm, setTrenchWidthMm] = useState<number>(600);
  const [concreteDepthMm, setConcreteDepthMm] = useState<number>(225);
  const [soilType, setSoilType] = useState<'firm' | 'clay' | 'chalk'>('clay');
  const [wastePercent, setWastePercent] = useState<number>(12);
  const [copied, setCopied] = useState<boolean>(false);

  // Normalise dimensions to metres
  const lengthM = unit === 'm' ? trenchLength : trenchLength * 0.3048;
  const widthM = trenchWidthMm / 1000;
  const depthM = concreteDepthMm / 1000;

  // Volume calculations
  const netVolumeM3 = lengthM * widthM * depthM;
  const grossVolumeM3 = netVolumeM3 * (1 + wastePercent / 100);
  const totalWetWeightTonnes = grossVolumeM3 * 2.4;

  // Bagged and Ready-mix alternatives
  const total25kgBags = Math.ceil(grossVolumeM3 * 83.33);
  const ballastBulkBags850kg = Math.ceil((grossVolumeM3 * 1800) / 850);
  const cementBags25kg = Math.ceil(grossVolumeM3 * 12.8);
  const readyMixTrucksNeeded = Math.ceil(grossVolumeM3 / 6.0);

  // Estimated costs
  const readyMixCost = grossVolumeM3 * 110 + (grossVolumeM3 < 4.0 ? 80 : 0);
  const siteMixCost = ballastBulkBags850kg * 48 + cementBags25kg * 6.95;

  // UK Building Regs Approved Document A check
  const buildingRegsValidation = useMemo(() => {
    const issues: string[] = [];
    if (concreteDepthMm < 150) {
      issues.push('Approved Document A requires a minimum concrete strip thickness of at least 150mm.');
    }
    if (soilType === 'clay' && concreteDepthMm < 200) {
      issues.push('Shrinkable clay soils require deeper footings (minimum 1.0m total trench depth below ground).');
    }
    return issues;
  }, [concreteDepthMm, soilType]);

  const handleCopy = () => {
    const text = `UK Concrete Footing & Trench Calculation (BS 8500 / Approved Document A)
Trench Run: ${trenchLength}${unit} length × ${trenchWidthMm}mm width
Concrete Depth: ${concreteDepthMm}mm
Net Volume: ${netVolumeM3.toFixed(3)} m³
Total Concrete (inc. ${wastePercent}% uneven trench contingency): ${grossVolumeM3.toFixed(3)} m³ (~${totalWetWeightTonnes.toFixed(2)} tonnes)
Supply Options:
- Ready-Mix Delivery: ~£${readyMixCost.toFixed(2)} (${readyMixTrucksNeeded} × 6m³ lorry load)
- Bulk Site Mix: ${ballastBulkBags850kg} × 850kg ballast bulk bags + ${cementBags25kg} × 25kg cement bags (~£${siteMixCost.toFixed(2)})
- Pre-Mixed 25kg Bags: ${total25kgBags} bags
Generated via ConcreteCalc.UK`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCsv = () => {
    const rows = [
      ['Specification Item', 'Dimension / Detail', 'Quantity', 'Unit', 'Estimated Cost (£)'],
      ['Trench Run Length', `${trenchLength} ${unit}`, lengthM.toFixed(2), 'm', '-'],
      ['Trench Width', `${trenchWidthMm} mm`, widthM.toFixed(2), 'm', '-'],
      ['Concrete Pour Depth', `${concreteDepthMm} mm`, depthM.toFixed(2), 'm', '-'],
      ['Gross Concrete Volume', `${grossVolumeM3.toFixed(3)} m³ (${wastePercent}% contingency)`, grossVolumeM3.toFixed(3), 'm³', readyMixCost.toFixed(2)],
      ['Pre-Mix 25kg Bags Alternative', 'Dry pre-mixed concrete bags', total25kgBags.toString(), 'bags', (total25kgBags * 6.5).toFixed(2)],
      ['Site-Mixed Ballast', '850kg aggregate bulk bags', ballastBulkBags850kg.toString(), 'bulk bags', (ballastBulkBags850kg * 48).toFixed(2)],
      ['Site-Mixed Cement', '25kg Mastercrete bags', cementBags25kg.toString(), '25kg bags', (cementBags25kg * 6.95).toFixed(2)],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `concrete-footing-estimate-${trenchLength}m.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'calculators', href: '/#unit-converter' },
          { label: 'concrete footing calculator' },
        ]}
      />

      <div className="hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <Building size={16} aria-hidden="true" />
          <span>UK Strip Foundations &amp; Trench Fill Specifier</span>
        </div>
        <h1>Concrete Footing &amp; Trench Calculator UK</h1>
        <p className="lead">
          Calculate the exact concrete volume in cubic metres (m³), ready-mix lorry loads, and 25kg bags needed for UK domestic strip foundations, trench fill footings, and house extensions under <strong>Building Regulations Approved Document A</strong>.
        </p>
      </div>

      {/* Preset Quick Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '14px 0 22px' }}>
        {FOUNDATION_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className="calc-preset-tag"
            onClick={() => {
              setUnit('m');
              setTrenchWidthMm(preset.trenchWidthMm);
              setConcreteDepthMm(preset.concreteDepthMm);
            }}
          >
            🧱 {preset.name}
          </button>
        ))}
      </div>

      {/* Tool Inputs */}
      <div className="panel" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--line)', paddingBottom: '14px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', margin: '0 0 4px', color: 'var(--ink)' }}>
              Trench &amp; Foundation Dimensions
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
              Enter total perimeter length of your foundation trenches and concrete pour depth.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-action"
              onClick={handleCopy}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {copied ? <Check size={14} color="var(--ok)" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Quote'}</span>
            </button>
            <button
              type="button"
              className="btn-action"
              onClick={handleExportCsv}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <FileSpreadsheet size={14} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px', marginBottom: '22px' }}>
          {/* Unit Toggle */}
          <div className="f">
            <label style={{ fontWeight: 700 }}>Unit:</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className={`btn-action ${unit === 'm' ? 'active' : ''}`}
                style={{ flex: 1, padding: '7px 0', fontWeight: 600, background: unit === 'm' ? 'var(--calc-blue)' : undefined, color: unit === 'm' ? '#fff' : undefined }}
                onClick={() => setUnit('m')}
              >
                Metres (m)
              </button>
              <button
                type="button"
                className={`btn-action ${unit === 'ft' ? 'active' : ''}`}
                style={{ flex: 1, padding: '7px 0', fontWeight: 600, background: unit === 'ft' ? 'var(--calc-blue)' : undefined, color: unit === 'ft' ? '#fff' : undefined }}
                onClick={() => setUnit('ft')}
              >
                Feet (ft)
              </button>
            </div>
          </div>

          {/* Trench Length */}
          <div className="f">
            <label htmlFor="footing-len" style={{ fontWeight: 700 }}>
              Total Trench Run Length ({unit}):
            </label>
            <input
              id="footing-len"
              type="number"
              step="0.5"
              min="1"
              value={trenchLength}
              onChange={(e) => setTrenchLength(Math.max(0.5, parseFloat(e.target.value) || 0))}
            />
          </div>

          {/* Trench Width */}
          <div className="f">
            <label htmlFor="footing-width" style={{ fontWeight: 700 }}>
              Trench Width:
            </label>
            <select
              id="footing-width"
              value={trenchWidthMm}
              onChange={(e) => setTrenchWidthMm(parseInt(e.target.value, 10))}
            >
              <option value="400">400mm (Single skin garden wall)</option>
              <option value="450">450mm (Light extension / conservatory)</option>
              <option value="600">600mm (Standard UK cavity wall)</option>
              <option value="750">750mm (Heavy multi-storey / soft ground)</option>
              <option value="900">900mm (Extra wide ground condition)</option>
            </select>
          </div>

          {/* Concrete Depth */}
          <div className="f">
            <label htmlFor="footing-depth" style={{ fontWeight: 700 }}>
              Concrete Pour Thickness:
            </label>
            <select
              id="footing-depth"
              value={concreteDepthMm}
              onChange={(e) => setConcreteDepthMm(parseInt(e.target.value, 10))}
            >
              <option value="150">150mm (Minimum BS Strip Footing)</option>
              <option value="225">225mm (Standard 9-inch Strip)</option>
              <option value="300">300mm (Reinforced Strip Footing)</option>
              <option value="600">600mm (Shallow Trench Fill)</option>
              <option value="800">800mm (Deep Trench Fill in Clay)</option>
              <option value="1000">1000mm (1.0m Deep Trench Fill)</option>
            </select>
          </div>

          {/* Soil Type */}
          <div className="f">
            <label htmlFor="footing-soil" style={{ fontWeight: 700 }}>
              Subsoil Condition:
            </label>
            <select
              id="footing-soil"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value as any)}
            >
              <option value="clay">Shrinkable Clay (Most UK Domestic)</option>
              <option value="firm">Firm Sand / Compact Gravel</option>
              <option value="chalk">Chalk / Sound Rock Bed</option>
            </select>
          </div>

          {/* Waste Allowance */}
          <div className="f">
            <label htmlFor="footing-waste" style={{ fontWeight: 700 }}>
              Excavation Overbreak Contingency:
            </label>
            <select
              id="footing-waste"
              value={wastePercent}
              onChange={(e) => setWastePercent(parseInt(e.target.value, 10))}
            >
              <option value="8">8% (Machine dug with neat straight sides)</option>
              <option value="12">12% (Recommended UK Trench Standard)</option>
              <option value="18">18% (Loose, collapsing, or stony soil)</option>
            </select>
          </div>
        </div>

        {/* Building Regs Notice if any */}
        {buildingRegsValidation.length > 0 && (
          <div className="alert-banner warning">
            <AlertTriangle size={20} style={{ flexShrink: 0, color: 'var(--status-warning-text)' }} />
            <div>
              <strong>Building Control Advisory:</strong> {buildingRegsValidation.join(' ')}
            </div>
          </div>
        )}

        {/* Results Banner */}
        <div style={{ background: 'var(--calc-card-bg)', border: '1px solid var(--calc-card-border)', borderRadius: '10px', padding: '18px 20px', marginBottom: '22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Required Concrete Volume
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--calc-blue)' }}>
                {grossVolumeM3.toFixed(3)} m³
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                Net: {netVolumeM3.toFixed(3)} m³ (+{wastePercent}% overbreak)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Ready-Mix Lorry Loads
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>
                {readyMixTrucksNeeded} {readyMixTrucksNeeded === 1 ? 'Lorry' : 'Lorries'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                Based on 6.0 m³ standard truck
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                25kg Pre-Mix Bags
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>
                {total25kgBags} bags
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                ~{(grossVolumeM3 * 2.4).toFixed(2)} tonnes wet weight
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Est. Ready-Mix Cost
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ok)' }}>
                £{readyMixCost.toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                Excluding pump if required
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--calc-blue)' }}>
            <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
              Option A: Ready-Mix Drum Delivery (C20/C25)
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0', color: 'var(--calc-blue)' }}>
              £{readyMixCost.toFixed(2)}
            </div>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--ink-secondary)', lineHeight: '1.5' }}>
              The most practical choice for foundations over 1.5 m³. Discharges directly into excavated trenches via truck chutes (typically up to 3–4m reach).
            </p>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--ok)' }}>
            <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
              Option B: Site-Mixed Bulk Ballast + Cement
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0', color: 'var(--ok)' }}>
              £{siteMixCost.toFixed(2)}
            </div>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--ink-secondary)', lineHeight: '1.5' }}>
              Requires <strong>{ballastBulkBags850kg} × 850kg bulk bags</strong> of all-in ballast and <strong>{cementBags25kg} bags</strong> of cement (1:5 mix). Best if lorry site access is impossible.
            </p>
          </div>
        </div>
      </div>

      {/* Building Regulations Approved Document A Technical Guide */}
      <article className="post">
        <h2>UK Foundation &amp; Footing Design Rules (Approved Document A)</h2>
        <p>
          In England and Wales, all structural foundations must comply with <strong>Building Regulations Approved Document A</strong> to ensure that structural loads are transmitted safely to the subsoil without differential settlement.
        </p>

        <h3>1. Strip Foundation vs Trench Fill</h3>
        <ul>
          <li><strong>Strip Foundations:</strong> A relatively shallow strip of concrete (minimum 150mm, typically 225mm to 300mm thick) is placed in the bottom of the trench. Bricklayers then lay engineering brick or dense concrete blocks up to the damp-proof course (DPC) level before backfilling.</li>
          <li><strong>Trench Fill Foundations:</strong> Concrete is poured to within 150mm of ground level. While it uses significantly more concrete, it eliminates the dangerous and labour-intensive task of bricklaying inside deep, narrow trenches. Trench fill is the preferred method across modern UK home extensions.</li>
        </ul>

        <h3>2. Minimum Depth Below Ground Level</h3>
        <p>
          To protect against frost action and seasonal moisture variations:
        </p>
        <ul>
          <li><strong>Frost Line:</strong> Foundations must be a minimum of <strong>450mm</strong> below finished ground level in the UK.</li>
          <li><strong>Clay Soils:</strong> On shrinkable clay soils with high plasticity index, foundations must be a minimum of <strong>1000mm (1.0 metre)</strong> deep. If mature trees (e.g., Oak, Willow, Poplar) are within distance, Building Control may require 1.5m to 2.5m depths or engineered piled foundations.</li>
        </ul>

        <h3>3. Concrete Mix Specification</h3>
        <p>
          For unreinforced domestic foundations and footings, use <strong>C20 (GEN 1 / GEN 3)</strong> or <strong>C25 (RC25)</strong>:
        </p>
        <ul>
          <li><strong>C20 / GEN 3:</strong> 20 N/mm² compressive strength. The standard specification for single and two-storey domestic extensions on non-aggressive soils.</li>
          <li><strong>Designated DC-1 / DC-2:</strong> Required when high sulphate levels are present in the ground water to prevent sulphate attack on Portland cement.</li>
        </ul>

        <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--line)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            href="/"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '10px 18px' }}
          >
            ← Open Main Concrete Calculator
          </Link>
          <Link
            href="/concrete-block-calculator"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '10px 18px' }}
          >
            Calculate Blocks for Foundation Walls →
          </Link>
        </div>
      </article>
    </div>
  );
}
