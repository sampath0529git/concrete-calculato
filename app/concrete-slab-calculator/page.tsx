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
  Grid,
  ShieldCheck,
  Hammer,
  Truck,
  ArrowRight,
} from 'lucide-react';

interface MeshOption {
  id: string;
  name: string;
  wireDiamMm: number;
  pitchMm: number;
  weightKgPerSheet: number;
  typicalCostGbp: number;
  bestFor: string;
}

const UK_MESH_OPTIONS: MeshOption[] = [
  {
    id: 'none',
    name: 'No Reinforcing Mesh (Unreinforced Slab)',
    wireDiamMm: 0,
    pitchMm: 0,
    weightKgPerSheet: 0,
    typicalCostGbp: 0,
    bestFor: 'Light garden paths and small greenhouse bases under 2m × 2m.',
  },
  {
    id: 'a142',
    name: 'A142 Fabric Mesh (6mm wire, 200×200mm pitch)',
    wireDiamMm: 6,
    pitchMm: 200,
    weightKgPerSheet: 31.4,
    typicalCostGbp: 38.5,
    bestFor: 'Standard domestic shed bases, garden rooms, and pedestrian patios (100mm slabs).',
  },
  {
    id: 'a193',
    name: 'A193 Fabric Mesh (7mm wire, 200×200mm pitch)',
    wireDiamMm: 7,
    pitchMm: 200,
    weightKgPerSheet: 42.7,
    typicalCostGbp: 48.0,
    bestFor: 'Single domestic garage floors, workshop slabs, and light vehicular driveways (125-150mm).',
  },
  {
    id: 'a252',
    name: 'A252 Heavy Mesh (8mm wire, 200×200mm pitch)',
    wireDiamMm: 8,
    pitchMm: 200,
    weightKgPerSheet: 55.8,
    typicalCostGbp: 62.0,
    bestFor: 'Heavy vehicle parking, commercial yards, and industrial concrete slabs (150-200mm).',
  },
];

export default function ConcreteSlabCalculatorPage() {
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [length, setLength] = useState<number>(4.0);
  const [width, setWidth] = useState<number>(3.0);
  const [thicknessMm, setThicknessMm] = useState<number>(100);
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [meshType, setMeshType] = useState<string>('a142');
  const [subBaseDepthMm, setSubBaseDepthMm] = useState<number>(100);
  const [includeDpm, setIncludeDpm] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Normalise slab dimensions to metres
  const lengthM = unit === 'm' ? length : length * 0.3048;
  const widthM = unit === 'm' ? width : width * 0.3048;
  const thicknessM = thicknessMm / 1000;

  // Surface Area
  const slabAreaM2 = lengthM * widthM;
  const perimeterM = 2 * (lengthM + widthM);

  // Concrete Volume
  const netVolumeM3 = slabAreaM2 * thicknessM;
  const grossVolumeM3 = netVolumeM3 * (1 + wastePercent / 100);
  const totalWetWeightTonnes = grossVolumeM3 * 2.4;

  // Bagged conversions
  const total25kgBags = Math.ceil(grossVolumeM3 * 83.33);
  const total20kgBags = Math.ceil(grossVolumeM3 * 105.26);

  // Bulk mix (Ballast + Cement 1:5)
  const ballastTonnes = (grossVolumeM3 * 1.8).toFixed(2);
  const ballastBulkBags850kg = Math.ceil((grossVolumeM3 * 1800) / 850);
  const cementBags25kg = Math.ceil(grossVolumeM3 * 12.8);

  // MOT Type 1 Sub-Base
  // Compacted density ~2.1 tonnes/m³
  const subBaseM3 = slabAreaM2 * (subBaseDepthMm / 1000) * 1.15; // 15% compaction loss
  const subBaseTonnes = (subBaseM3 * 2.1).toFixed(2);
  const subBaseBulkBags850kg = Math.ceil((parseFloat(subBaseTonnes) * 1000) / 850);

  // Reinforcement Mesh: Standard UK sheet is 4.8m × 2.4m = 11.52m²
  // Accounting for 200mm lap joint yields ~9.5m² effective coverage per sheet
  const selectedMesh = useMemo(
    () => UK_MESH_OPTIONS.find((m) => m.id === meshType) || UK_MESH_OPTIONS[1],
    [meshType]
  );
  const meshSheetsNeeded =
    selectedMesh.id === 'none' ? 0 : Math.max(1, Math.ceil(slabAreaM2 / 9.5));
  const meshSpacersNeeded =
    selectedMesh.id === 'none' ? 0 : Math.ceil(slabAreaM2 * 4); // 4 chairs per m²

  // DPM Polythene: 1200-gauge with 15% lap & edge upstand
  const dpmAreaM2 = includeDpm ? Math.ceil(slabAreaM2 * 1.25) : 0;

  // Estimated costs
  const concreteReadyMixCost = grossVolumeM3 * 115;
  const baggedCost = total25kgBags * 6.5;
  const subBaseCost = subBaseBulkBags850kg * 48;
  const meshCost = meshSheetsNeeded * selectedMesh.typicalCostGbp;
  const dpmCost = includeDpm ? Math.ceil(dpmAreaM2 / 50) * 45 : 0; // ~£45 per 4m x 12.5m roll
  const timberFormworkCost = Math.ceil(perimeterM / 3.6) * 16; // 3.6m treated timber gravel boards
  const totalProjectMaterialsCost =
    (grossVolumeM3 >= 1.0 ? concreteReadyMixCost : baggedCost) +
    subBaseCost +
    meshCost +
    dpmCost +
    timberFormworkCost;

  const handleCopy = () => {
    const text = `Concrete Slab & Base Specification (UK BS 8500 / BS EN 206)
Dimensions: ${length}${unit} × ${width}${unit} @ ${thicknessMm}mm depth
Slab Surface Area: ${slabAreaM2.toFixed(2)} m² (Perimeter: ${perimeterM.toFixed(1)}m)
Total Concrete Volume (inc. ${wastePercent}% waste): ${grossVolumeM3.toFixed(3)} m³ (~${totalWetWeightTonnes.toFixed(2)} tonnes)
Bagged Option: ${total25kgBags} × 25kg pre-mix bags
Site-Mix Option: ${ballastBulkBags850kg} bulk bags ballast + ${cementBags25kg} bags cement
MOT Type 1 Sub-Base (${subBaseDepthMm}mm compacted): ~${subBaseTonnes} tonnes (${subBaseBulkBags850kg} bulk bags)
${selectedMesh.id !== 'none' ? `Steel Mesh Reinforcement: ${meshSheetsNeeded} sheets (${selectedMesh.name}) + ${meshSpacersNeeded} spacer stools\n` : ''}${includeDpm ? `DPM 1200-Gauge Polythene: ~${dpmAreaM2} m²\n` : ''}Timber Formwork Perimeter: ~${perimeterM.toFixed(1)} metres
Estimated Materials Total: £${totalProjectMaterialsCost.toFixed(2)}
Generated via ConcreteCalc.UK`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCsv = () => {
    const rows = [
      ['Material Component', 'Specification', 'Quantity', 'Unit', 'Estimated Cost (£)'],
      ['Concrete Volume', `${grossVolumeM3.toFixed(3)} m³ (${wastePercent}% contingency)`, grossVolumeM3.toFixed(2), 'm³', (grossVolumeM3 >= 1.0 ? concreteReadyMixCost : baggedCost).toFixed(2)],
      ['25kg Pre-Mix Alternative', 'Standard dry pre-mix bags', total25kgBags.toString(), '25kg bags', baggedCost.toFixed(2)],
      ['MOT Type 1 Sub-Base', `${subBaseDepthMm}mm compacted sub-layer`, subBaseBulkBags850kg.toString(), '850kg bulk bags', subBaseCost.toFixed(2)],
      ...(selectedMesh.id !== 'none' ? [[selectedMesh.name, '4.8m x 2.4m sheets (200mm overlap)', meshSheetsNeeded.toString(), 'sheets', meshCost.toFixed(2)]] : []),
      ...(includeDpm ? [['1200-Gauge DPM Membrane', 'Polythene damp proof membrane', dpmAreaM2.toString(), 'm²', dpmCost.toFixed(2)]] : []),
      ['Timber Formwork (Perimeter)', `${perimeterM.toFixed(1)}m edge shuttering`, Math.ceil(perimeterM / 3.6).toString(), '3.6m boards', timberFormworkCost.toFixed(2)],
      ['Total Estimated Materials', '', '', '', totalProjectMaterialsCost.toFixed(2)],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `concrete-slab-estimate-${length}x${width}${unit}-${thicknessMm}mm.csv`);
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
          { label: 'concrete slab calculator' },
        ]}
      />

      <div className="hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <Grid size={16} aria-hidden="true" />
          <span>UK Slab, Shed Base &amp; Patio Material Specifier</span>
        </div>
        <h1>Concrete Slab &amp; Base Calculator UK</h1>
        <p className="lead">
          Calculate the exact concrete volume (m³), number of 25kg bags, MOT Type 1 sub-base, reinforcing steel mesh sheets (A142 / A193), and damp-proof membrane (DPM) needed for your UK shed base, garden room, patio, or garage floor.
        </p>
      </div>

      {/* Preset Quick Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '14px 0 22px' }}>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => {
            setUnit('m');
            setLength(2.4);
            setWidth(1.8);
            setThicknessMm(100);
            setMeshType('a142');
            setSubBaseDepthMm(100);
          }}
        >
          🛖 8×6 Shed Base (2.4m × 1.8m @ 100mm)
        </button>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => {
            setUnit('m');
            setLength(3.6);
            setWidth(2.4);
            setThicknessMm(100);
            setMeshType('a142');
            setSubBaseDepthMm(100);
          }}
        >
          🏡 12×8 Garden Room (3.6m × 2.4m @ 100mm)
        </button>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => {
            setUnit('m');
            setLength(6.0);
            setWidth(3.0);
            setThicknessMm(150);
            setMeshType('a193');
            setSubBaseDepthMm(150);
          }}
        >
          🚗 Single Garage Floor (6m × 3m @ 150mm)
        </button>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => {
            setUnit('m');
            setLength(5.0);
            setWidth(1.0);
            setThicknessMm(75);
            setMeshType('none');
            setSubBaseDepthMm(75);
          }}
        >
          🚶 Garden Path (5m × 1m @ 75mm)
        </button>
      </div>

      {/* Interactive Slab Calculator Tool Grid */}
      <div className="panel" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--line)', paddingBottom: '14px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', margin: '0 0 4px', color: 'var(--ink)' }}>
              Slab Dimension &amp; Reinforcement Controls
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
              Enter dimensions to calculate concrete, MOT Type 1, mesh fabric, and shuttering timber.
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
              <span>{copied ? 'Copied' : 'Copy Spec'}</span>
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

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '18px', marginBottom: '22px' }}>
          {/* Unit Switcher */}
          <div className="f">
            <label style={{ fontWeight: 700 }}>Measurement Unit:</label>
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

          {/* Slab Length */}
          <div className="f">
            <label htmlFor="slab-length" style={{ fontWeight: 700 }}>
              Slab Length ({unit}):
            </label>
            <input
              id="slab-length"
              type="number"
              step="0.1"
              min="0.5"
              value={length}
              onChange={(e) => setLength(Math.max(0.1, parseFloat(e.target.value) || 0))}
            />
          </div>

          {/* Slab Width */}
          <div className="f">
            <label htmlFor="slab-width" style={{ fontWeight: 700 }}>
              Slab Width ({unit}):
            </label>
            <input
              id="slab-width"
              type="number"
              step="0.1"
              min="0.5"
              value={width}
              onChange={(e) => setWidth(Math.max(0.1, parseFloat(e.target.value) || 0))}
            />
          </div>

          {/* Thickness Dropdown / Presets */}
          <div className="f">
            <label htmlFor="slab-thickness" style={{ fontWeight: 700 }}>
              Concrete Thickness:
            </label>
            <select
              id="slab-thickness"
              value={thicknessMm}
              onChange={(e) => setThicknessMm(parseInt(e.target.value, 10))}
            >
              <option value="75">75mm (3") – Light Garden Path</option>
              <option value="100">100mm (4") – Standard Shed / Patio</option>
              <option value="125">125mm (5") – Workshop / Hot Tub Base</option>
              <option value="150">150mm (6") – Domestic Garage / Driveway</option>
              <option value="200">200mm (8") – Heavy Commercial Vehicle</option>
            </select>
          </div>

          {/* Steel Reinforcing Mesh */}
          <div className="f">
            <label htmlFor="slab-mesh" style={{ fontWeight: 700 }}>
              Steel Reinforcement Mesh:
            </label>
            <select
              id="slab-mesh"
              value={meshType}
              onChange={(e) => setMeshType(e.target.value)}
            >
              {UK_MESH_OPTIONS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* MOT Type 1 Sub-Base */}
          <div className="f">
            <label htmlFor="slab-subbase" style={{ fontWeight: 700 }}>
              MOT Type 1 Sub-Base Depth:
            </label>
            <select
              id="slab-subbase"
              value={subBaseDepthMm}
              onChange={(e) => setSubBaseDepthMm(parseInt(e.target.value, 10))}
            >
              <option value="0">None (Pouring onto sound existing slab)</option>
              <option value="75">75mm (Compacted light sub-base)</option>
              <option value="100">100mm (Recommended for sheds/patios)</option>
              <option value="150">150mm (Driveways &amp; garage floors)</option>
            </select>
          </div>

          {/* Waste Contingency */}
          <div className="f">
            <label htmlFor="slab-waste" style={{ fontWeight: 700 }}>
              Waste &amp; Ground Unevenness Allowance:
            </label>
            <select
              id="slab-waste"
              value={wastePercent}
              onChange={(e) => setWastePercent(parseInt(e.target.value, 10))}
            >
              <option value="5">5% (Laser-level boarded formwork)</option>
              <option value="10">10% (Recommended UK Standard)</option>
              <option value="15">15% (Rough or uneven ground excavation)</option>
            </select>
          </div>
        </div>

        {/* Results Banner */}
        <div style={{ background: 'var(--calc-card-bg)', border: '1px solid var(--calc-card-border)', borderRadius: '10px', padding: '18px 20px', marginBottom: '22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Total Concrete Volume
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--calc-blue)' }}>
                {grossVolumeM3.toFixed(3)} m³
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                Net: {netVolumeM3.toFixed(3)} m³ (+{wastePercent}% waste)
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
                or {total20kgBags} × 20kg bags
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Total Wet Weight
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ink)' }}>
                ~{totalWetWeightTonnes.toFixed(2)} t
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                Based on 2.4 t/m³ wet density
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Est. Materials Cost
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--ok)' }}>
                £{totalProjectMaterialsCost.toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                Concrete, mesh, sub-base &amp; DPM
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Bill of Materials Grid */}
        <h3 style={{ fontSize: '16px', margin: '0 0 12px', color: 'var(--ink)' }}>
          Complete Slab Materials &amp; Specification Checklist
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {/* Card 1: Sub-Base */}
          <div className="card" style={{ borderLeft: '4px solid var(--muted)' }}>
            <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
              1. MOT Type 1 Sub-Base
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0', color: 'var(--ink)' }}>
              {subBaseTonnes} tonnes
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              {subBaseBulkBags850kg} × 850kg bulk bags (~£{subBaseCost})
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: '1.4' }}>
              Compact in 50mm layers using a vibrating wacker plate to prevent slab subsidence.
            </p>
          </div>

          {/* Card 2: DPM Polythene */}
          <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
              2. 1200-Gauge DPM Membrane
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0', color: 'var(--ink)' }}>
              {dpmAreaM2} m²
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Tough impermeable polythene sheeting (~£{dpmCost})
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: '1.4' }}>
              Lay over sand blinding to prevent stone punctures. Lap joints by 150mm and tape with jointing tape.
            </p>
          </div>

          {/* Card 3: Steel Mesh */}
          <div className="card" style={{ borderLeft: '4px solid var(--calc-blue)' }}>
            <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
              3. Reinforcement Mesh Sheets
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0', color: 'var(--ink)' }}>
              {meshSheetsNeeded} {meshSheetsNeeded === 1 ? 'Sheet' : 'Sheets'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              {selectedMesh.name} (~£{meshCost})
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: '1.4' }}>
              Standard 4.8m × 2.4m sheets. Supported on <strong>{meshSpacersNeeded} plastic mesh chairs</strong> (40–50mm high).
            </p>
          </div>

          {/* Card 4: Timber Formwork */}
          <div className="card" style={{ borderLeft: '4px solid var(--status-warning-text)' }}>
            <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
              4. Timber Shuttering Formwork
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0', color: 'var(--ink)' }}>
              {perimeterM.toFixed(1)} metres
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              {Math.ceil(perimeterM / 3.6)} × 3.6m boards + wooden stakes
            </div>
            <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: '1.4' }}>
              Use 25mm thick treated boards braced with timber pegs driven every 1m along the perimeter.
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Slab Technical Guide Content */}
      <article className="post">
        <h2>UK Concrete Slab Construction Guide (BS 8500 &amp; Building Regs)</h2>
        <p>
          Constructing a concrete slab for a timber garden building, shed, patio, or garage requires more than just pouring wet concrete. A long-lasting slab depends on correct excavation depth, a properly compacted sub-base, and moisture protection.
        </p>

        <h3>1. Recommended Concrete Slab Thicknesses</h3>
        <ul>
          <li><strong>75mm (3 inches):</strong> Suitable strictly for footpaths, garden greenhouse walkways, and light decorative patio flags where vehicular weight is impossible.</li>
          <li><strong>100mm (4 inches):</strong> The standard UK specification for garden sheds, timber garden rooms, summer houses, and heavy patio dining areas.</li>
          <li><strong>125mm (5 inches):</strong> Recommended for heavy hot tubs, garden workshops containing metal lathes or cast machinery, and light trailers.</li>
          <li><strong>150mm (6 inches):</strong> Required for domestic car driveways, garage floor slabs, and light commercial vehicle parking. Must be reinforced with A193 or A252 steel fabric.</li>
        </ul>

        <h3>2. What Concrete Mix Grade Should You Use?</h3>
        <p>
          For domestic slabs, specify <strong>C20 or C25 concrete (GEN 3)</strong>:
        </p>
        <ul>
          <li><strong>C20 (1:2:4 Mix):</strong> 20 N/mm² compressive strength at 28 days. Excellent for domestic shed bases and internal unexposed floors.</li>
          <li><strong>C25 / RC25 (1:1.5:3 Mix):</strong> 25 N/mm² strength. Recommended for all outdoor slabs, patios, and driveways exposed to winter frost and rain.</li>
        </ul>

        <h3>3. Sub-Base Compaction &amp; MOT Type 1</h3>
        <p>
          Never pour concrete directly onto soft garden soil or topsoil. Organic matter compresses over time, creating voids beneath the slab that lead to cracking:
        </p>
        <ol>
          <li>Excavate down through all organic topsoil to a firm, level subgrade.</li>
          <li>Spread MOT Type 1 crushed limestone or granite (0–40mm graded stone).</li>
          <li>Compact thoroughly using a vibrating plate compactor (wacker plate) in passes of no more than 50mm thickness.</li>
        </ol>

        <h2>Frequently Asked Questions About Concrete Slabs</h2>
        <div className="faq-grid" style={{ marginTop: '16px' }}>
          <div className="card">
            <h3 style={{ fontSize: '14.5px', margin: '0 0 6px', color: 'var(--ink)' }}>
              Do I need steel mesh reinforcement in my shed base?
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-secondary)' }}>
              For small sheds up to 8ft × 6ft on well-compacted sub-bases, steel mesh is optional. However, for larger timber buildings, garden rooms (10x8 or 12x8), or any soil prone to movement (such as clay), installing <strong>A142 steel mesh</strong> (6mm wire) prevents temperature and shrinkage cracking and significantly extends the lifespan of the slab.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '14.5px', margin: '0 0 6px', color: 'var(--ink)' }}>
              How long should a concrete slab cure before building on it?
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-secondary)' }}>
              Concrete achieves approximately 70% of its full structural strength after <strong>7 days</strong> and its full design strength at <strong>28 days</strong>. You can walk on the slab after 24–48 hours, remove timber formwork after 3 days, and erect a lightweight timber shed after 7 days.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '14.5px', margin: '0 0 6px', color: 'var(--ink)' }}>
              How far apart should expansion joints be in a concrete slab?
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-secondary)' }}>
              In the UK climate, unreinforced concrete slabs should have movement joints at intervals no greater than <strong>30 times the slab thickness</strong> (e.g. every 3 metres for a 100mm slab). With A142/A193 reinforcing mesh, joint spacing can be extended to <strong>4.5 to 6 metres</strong>.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--line)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            href="/"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '10px 18px' }}
          >
            ← Open Main Concrete Calculator
          </Link>
          <Link
            href="/price-of-concrete-per-m3"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '10px 18px' }}
          >
            Check Concrete Price per m³ →
          </Link>
          <Link
            href="/concrete-shed-base-how-much-do-i-need"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '10px 18px' }}
          >
            Read Shed Base Worked Examples →
          </Link>
        </div>
      </article>
    </div>
  );
}
