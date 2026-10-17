'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Building2,
} from 'lucide-react';

interface BlockTypeOption {
  id: string;
  name: string;
  strength: string;
  weightKg: number;
  typicalCostGbp: number;
  desc: string;
}

const BLOCK_TYPES: BlockTypeOption[] = [
  {
    id: 'dense-7.3',
    name: 'Dense Concrete Block (7.3 N/mm²)',
    strength: '7.3 N/mm²',
    weightKg: 18.0,
    typicalCostGbp: 1.85,
    desc: 'Heavyweight aggregate. Excellent load-bearing strength and sound insulation. Below DPC, retaining walls, and outer leaves.',
  },
  {
    id: 'lightweight-3.6',
    name: 'Lightweight Aerated Block (Thermalite / Celcon 3.6 N/mm²)',
    strength: '3.6 N/mm²',
    weightKg: 8.5,
    typicalCostGbp: 2.15,
    desc: 'Autoclaved aerated concrete. Superior thermal insulation and easy to saw by hand. Inner leaves and non-loadbearing partitions.',
  },
  {
    id: 'dense-10.4',
    name: 'Heavy Dense Engineering Block (10.4 N/mm²)',
    strength: '10.4 N/mm²',
    weightKg: 20.0,
    typicalCostGbp: 2.30,
    desc: 'Maximum strength dense aggregate for structural load-bearing multi-storey masonry and heavy retaining walls.',
  },
  {
    id: 'hollow-140',
    name: 'Hollow Dense Block (140mm thickness)',
    strength: '7.3 N/mm²',
    weightKg: 15.5,
    typicalCostGbp: 2.65,
    desc: 'Hollow cores allow steel rebar reinforcement and concrete infill for high retaining walls and agricultural buildings.',
  },
];

export default function ConcreteBlockCalculatorPage() {
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [wallLength, setWallLength] = useState<number>(6.0);
  const [wallHeight, setWallHeight] = useState<number>(2.1);
  const [skinType, setSkinType] = useState<'single' | 'double'>('single');
  const [blockTypeId, setBlockTypeId] = useState<string>('dense-7.3');
  const [deductOpenings, setDeductOpenings] = useState<boolean>(false);
  const [doorCount, setDoorCount] = useState<number>(1);
  const [doorWidth, setDoorWidth] = useState<number>(0.9);
  const [doorHeight, setDoorHeight] = useState<number>(2.0);
  const [windowCount, setWindowCount] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<number>(1.2);
  const [windowHeight, setWindowHeight] = useState<number>(1.0);
  const [wastePercent, setWastePercent] = useState<number>(10);
  const [customBlockCost, setCustomBlockCost] = useState<number>(1.85);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedBlock = useMemo(
    () => BLOCK_TYPES.find((b) => b.id === blockTypeId) || BLOCK_TYPES[0],
    [blockTypeId]
  );

  // Normalise dimensions to metres
  const lengthM = unit === 'm' ? wallLength : wallLength * 0.3048;
  const heightM = unit === 'm' ? wallHeight : wallHeight * 0.3048;

  // Openings in m²
  const openingsAreaM2 = useMemo(() => {
    if (!deductOpenings) return 0;
    const dW = unit === 'm' ? doorWidth : doorWidth * 0.3048;
    const dH = unit === 'm' ? doorHeight : doorHeight * 0.3048;
    const wW = unit === 'm' ? windowWidth : windowWidth * 0.3048;
    const wH = unit === 'm' ? windowHeight : windowHeight * 0.3048;
    return Math.max(0, doorCount * dW * dH + windowCount * wW * wH);
  }, [deductOpenings, doorCount, doorWidth, doorHeight, windowCount, windowWidth, windowHeight, unit]);

  // Gross and Net Area
  const grossAreaM2 = lengthM * heightM;
  const netAreaM2 = Math.max(0, grossAreaM2 - openingsAreaM2);

  // Standard UK Block coordinating coverage: 0.45m × 0.225m = 0.10125 m² -> 9.88 blocks/m², standard industry rule is 10 blocks/m²
  const blocksPerM2PerSkin = 10;
  const skinMultiplier = skinType === 'double' ? 2 : 1;

  const netBlocks = Math.ceil(netAreaM2 * blocksPerM2PerSkin * skinMultiplier);
  const wasteMultiplier = 1 + wastePercent / 100;
  const totalBlocks = Math.ceil(netBlocks * wasteMultiplier);

  // Mortar requirements: 100 blocks consume ~0.05 m³ wet mortar (125kg building sand, 25kg cement)
  const mortarSandKg = Math.round(totalBlocks * 1.25);
  const mortarSand25kgBags = Math.ceil(mortarSandKg / 25);
  const mortarSandBulk850kg = (mortarSandKg / 850).toFixed(2);
  const mortarCement25kgBags = Math.ceil(totalBlocks * 0.25);

  // Wall ties (for cavity / double skin): 2.5 ties per m²
  const wallTies = skinType === 'double' ? Math.ceil(netAreaM2 * 2.5 * 1.1) : 0;

  // Total weight
  const totalBlockWeightTonnes = ((totalBlocks * selectedBlock.weightKg) / 1000).toFixed(2);

  // Estimated costs
  const blockCost = totalBlocks * customBlockCost;
  const sandCost = mortarSand25kgBags * 3.3; // ~£3.30 per 25kg building sand
  const cementCost = mortarCement25kgBags * 6.95; // ~£6.95 per 25kg Mastercrete
  const wallTiesCost = skinType === 'double' ? Math.ceil(wallTies / 20) * 12 : 0; // ~£12 per box of 20 ties
  const totalCostEstimate = blockCost + sandCost + cementCost + wallTiesCost;

  const handleCopySummary = () => {
    const text = `Concrete Block Wall Estimate (UK BS EN 771-3)
Wall Dimensions: ${wallLength}${unit} length × ${wallHeight}${unit} height (${skinType === 'double' ? 'Double Skin / Cavity' : 'Single Skin'})
Net Wall Area: ${netAreaM2.toFixed(2)} m²
Block Specification: ${selectedBlock.name}
Total Blocks (inc. ${wastePercent}% waste): ${totalBlocks} blocks
Total Block Weight: ~${totalBlockWeightTonnes} tonnes
Mortar Building Sand: ${mortarSandKg} kg (${mortarSand25kgBags} × 25kg bags or ${mortarSandBulk850kg} bulk bags)
Mortar Cement: ${mortarCement25kgBags} × 25kg bags (1:4 standard mix)
${skinType === 'double' ? `Stainless Steel Wall Ties: ${wallTies} ties\n` : ''}
Estimated Material Cost: £${totalCostEstimate.toFixed(2)} (ex. delivery/VAT)
Generated via ConcreteCalc.UK`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCsv = () => {
    const rows = [
      ['Item', 'Quantity', 'Unit', 'Estimated Cost (£)'],
      [selectedBlock.name, totalBlocks.toString(), 'blocks', blockCost.toFixed(2)],
      ['Building Sand (Mortar)', mortarSand25kgBags.toString(), '25kg bags', sandCost.toFixed(2)],
      ['Portland Cement (CEM II)', mortarCement25kgBags.toString(), '25kg bags', cementCost.toFixed(2)],
      ...(skinType === 'double' ? [['Stainless Wall Ties', wallTies.toString(), 'ties', wallTiesCost.toFixed(2)]] : []),
      ['Total Estimated Cost', '', '', totalCostEstimate.toFixed(2)],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `concrete-block-estimate-${wallLength}x${wallHeight}${unit}.csv`);
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
          { label: 'concrete block calculator' },
        ]}
      />

      <div className="hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <Building2 size={16} aria-hidden="true" />
          <span>UK Standard Blockwork Calculator (BS EN 771-3)</span>
        </div>
        <h1>Concrete Block Calculator UK</h1>
        <p className="lead">
          Calculate the exact number of concrete blocks, mortar sand, cement bags, and estimated costs needed for UK walls, retaining walls, single-skin garage walls, and cavity extensions. Uses the British coordinating block size of 440mm × 215mm with 10mm mortar joints (10 blocks per m²).
        </p>
      </div>

      {/* Preset Quick Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '14px 0 22px' }}>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => {
            setUnit('m');
            setWallLength(5.0);
            setWallHeight(1.2);
            setSkinType('single');
            setDeductOpenings(false);
          }}
        >
          🧱 Garden Wall (5m × 1.2m)
        </button>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => {
            setUnit('m');
            setWallLength(6.0);
            setWallHeight(2.4);
            setSkinType('single');
            setDeductOpenings(true);
            setDoorCount(1);
          }}
        >
          🚗 Garage Wall with Door (6m × 2.4m)
        </button>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => {
            setUnit('m');
            setWallLength(4.0);
            setWallHeight(2.6);
            setSkinType('double');
            setDeductOpenings(true);
            setWindowCount(1);
          }}
        >
          🏠 House Extension Cavity Wall (4m × 2.6m)
        </button>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => {
            setUnit('m');
            setWallLength(8.0);
            setWallHeight(1.0);
            setSkinType('single');
            setBlockTypeId('dense-7.3');
          }}
        >
          🛡️ Retaining Wall (8m × 1m Dense)
        </button>
      </div>

      {/* Calculator Grid */}
      <div className="calc-card">
        <div className="calc-card-header">
          <h2 className="calc-card-title">Wall Dimensions &amp; Block Specifications</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--muted)' }}>Units:</span>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'm' | 'ft')}
              className="calc-select"
              style={{ minHeight: '36px', padding: '4px 10px' }}
            >
              <option value="m">Metric (metres)</option>
              <option value="ft">Imperial (feet)</option>
            </select>
          </div>
        </div>

        <div className="calc-card-body" style={{ gridTemplateColumns: '1.3fr 0.7fr' }}>
          <div>
            <table className="calc-table">
              <tbody>
                <tr>
                  <td className="calc-table-label">Wall Length:</td>
                  <td>
                    <div className="calc-table-inputs">
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={wallLength}
                        onChange={(e) => setWallLength(parseFloat(e.target.value) || 0)}
                        className="calc-input"
                      />
                      <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>{unit}</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="calc-table-label">Wall Height:</td>
                  <td>
                    <div className="calc-table-inputs">
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={wallHeight}
                        onChange={(e) => setWallHeight(parseFloat(e.target.value) || 0)}
                        className="calc-input"
                      />
                      <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>{unit}</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="calc-table-label">Wall Construction:</td>
                  <td>
                    <select
                      value={skinType}
                      onChange={(e) => setSkinType(e.target.value as 'single' | 'double')}
                      className="calc-select"
                      style={{ width: '100%' }}
                    >
                      <option value="single">Single Skin (100mm thick) — 10 blocks/m²</option>
                      <option value="double">Double Skin / Cavity Wall — 20 blocks/m² + Wall Ties</option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="calc-table-label">Block Specification:</td>
                  <td>
                    <select
                      value={blockTypeId}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        setBlockTypeId(nextId);
                        const b = BLOCK_TYPES.find((item) => item.id === nextId);
                        if (b) setCustomBlockCost(b.typicalCostGbp);
                      }}
                      className="calc-select"
                      style={{ width: '100%' }}
                    >
                      {BLOCK_TYPES.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} (~£{b.typicalCostGbp.toFixed(2)})
                        </option>
                      ))}
                    </select>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                      {selectedBlock.desc}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="calc-table-label">Cost per Block (£):</td>
                  <td>
                    <div className="calc-table-inputs">
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        value={customBlockCost}
                        onChange={(e) => setCustomBlockCost(parseFloat(e.target.value) || 0)}
                        className="calc-input"
                      />
                      <span style={{ fontSize: '13px', color: 'var(--muted)' }}>GBP (£) ex. VAT</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="calc-table-label">Wastage &amp; Cuts:</td>
                  <td>
                    <select
                      value={wastePercent}
                      onChange={(e) => setWastePercent(parseInt(e.target.value, 10))}
                      className="calc-select"
                      style={{ width: '100%' }}
                    >
                      <option value="5">5% — Simple rectangular wall, straight run</option>
                      <option value="10">10% — Recommended standard UK trade allowance</option>
                      <option value="15">15% — Complex layout, gable ends, or many cuts</option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="calc-table-label">Deduct Openings:</td>
                  <td>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={deductOpenings}
                        onChange={(e) => setDeductOpenings(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--calc-blue)' }}
                      />
                      <span>Deduct doors or windows from calculation</span>
                    </label>
                  </td>
                </tr>

                {deductOpenings && (
                  <>
                    <tr>
                      <td className="calc-table-label" style={{ color: 'var(--muted)' }}>Doors (W × H):</td>
                      <td>
                        <div className="calc-table-inputs">
                          <input
                            type="number"
                            min="0"
                            value={doorCount}
                            onChange={(e) => setDoorCount(parseInt(e.target.value, 10) || 0)}
                            style={{ width: '55px' }}
                            className="calc-input"
                          />
                          <span style={{ fontSize: '12px' }}>qty @</span>
                          <input
                            type="number"
                            step="0.1"
                            value={doorWidth}
                            onChange={(e) => setDoorWidth(parseFloat(e.target.value) || 0)}
                            style={{ width: '70px' }}
                            className="calc-input"
                          />
                          <span>×</span>
                          <input
                            type="number"
                            step="0.1"
                            value={doorHeight}
                            onChange={(e) => setDoorHeight(parseFloat(e.target.value) || 0)}
                            style={{ width: '70px' }}
                            className="calc-input"
                          />
                          <span style={{ fontSize: '12px' }}>{unit}</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="calc-table-label" style={{ color: 'var(--muted)' }}>Windows (W × H):</td>
                      <td>
                        <div className="calc-table-inputs">
                          <input
                            type="number"
                            min="0"
                            value={windowCount}
                            onChange={(e) => setWindowCount(parseInt(e.target.value, 10) || 0)}
                            style={{ width: '55px' }}
                            className="calc-input"
                          />
                          <span style={{ fontSize: '12px' }}>qty @</span>
                          <input
                            type="number"
                            step="0.1"
                            value={windowWidth}
                            onChange={(e) => setWindowWidth(parseFloat(e.target.value) || 0)}
                            style={{ width: '70px' }}
                            className="calc-input"
                          />
                          <span>×</span>
                          <input
                            type="number"
                            step="0.1"
                            value={windowHeight}
                            onChange={(e) => setWindowHeight(parseFloat(e.target.value) || 0)}
                            style={{ width: '70px' }}
                            className="calc-input"
                          />
                          <span style={{ fontSize: '12px' }}>{unit}</span>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Visual Wall Diagram */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '260px',
                aspectRatio: '1.5',
                border: '2px solid var(--calc-blue)',
                borderRadius: '8px',
                background: 'var(--surface-elevated)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>
                <span>Length: {wallLength}{unit}</span>
                <span>{skinType === 'double' ? 'Cavity Wall' : 'Single Skin'}</span>
              </div>

              {/* Graphical Brick Stretcher Bond Pattern */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', margin: '8px 0', opacity: 0.85 }}>
                <div style={{ display: 'flex', gap: '3px', height: '14px' }}>
                  <div style={{ flex: 1, background: '#cbd5e1', borderRadius: '2px' }} />
                  <div style={{ flex: 1, background: '#94a3b8', borderRadius: '2px' }} />
                  <div style={{ flex: 1, background: '#cbd5e1', borderRadius: '2px' }} />
                </div>
                <div style={{ display: 'flex', gap: '3px', height: '14px' }}>
                  <div style={{ flex: 0.5, background: '#94a3b8', borderRadius: '2px' }} />
                  <div style={{ flex: 1, background: '#cbd5e1', borderRadius: '2px' }} />
                  <div style={{ flex: 1, background: '#94a3b8', borderRadius: '2px' }} />
                  <div style={{ flex: 0.5, background: '#cbd5e1', borderRadius: '2px' }} />
                </div>
                <div style={{ display: 'flex', gap: '3px', height: '14px' }}>
                  <div style={{ flex: 1, background: '#cbd5e1', borderRadius: '2px' }} />
                  <div style={{ flex: 1, background: '#94a3b8', borderRadius: '2px' }} />
                  <div style={{ flex: 1, background: '#cbd5e1', borderRadius: '2px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>
                <span>Height: {wallHeight}{unit}</span>
                <span>10 blocks/m² per skin</span>
              </div>
            </div>

            <div style={{ marginTop: '12px', fontSize: '12.5px', color: 'var(--muted)', textAlign: 'center' }}>
              Standard UK Block: <strong>440mm × 215mm × 100mm</strong>
            </div>

            {/* Visual Blockwork Photo */}
            <div style={{ marginTop: '16px', position: 'relative', width: '100%', height: '170px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--line)' }}>
              <Image
                src="/images/concrete-block-calculator.jpg"
                alt="Building single-skin garden retaining wall with standard British dense concrete blocks (440x215mm) and mortar - Concrete Block Calculator UK"
                fill
                sizes="(max-width: 768px) 100vw, 380px"
                style={{ objectFit: 'cover' }}
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Box */}
      <div className="calc-result-card">
        <div className="calc-result-header">
          <div>
            <h2 className="calc-result-title">Blockwork &amp; Mortar Quantities Required</h2>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
              Net Wall Face: <strong>{netAreaM2.toFixed(2)} m²</strong> ({grossAreaM2.toFixed(2)} m² gross, -{openingsAreaM2.toFixed(2)} m² openings)
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>Estimated Cost</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ok)' }}>
              £{totalCostEstimate.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 3 Metric High-Impact Tiles */}
        <div className="calc-volume-grid">
          <div className="calc-volume-tile primary">
            <div className="calc-volume-val">{totalBlocks}</div>
            <div className="calc-volume-sub">Total Blocks Needed</div>
            <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>
              Includes {wastePercent}% contingency ({netBlocks} net blocks)
            </div>
          </div>

          <div className="calc-volume-tile">
            <div className="calc-volume-val">{mortarSand25kgBags}</div>
            <div className="calc-volume-sub">25kg Sand Bags (or {mortarSandBulk850kg} bulk bag)</div>
            <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>
              {mortarSandKg} kg building sand for 10mm bed joints
            </div>
          </div>

          <div className="calc-volume-tile">
            <div className="calc-volume-val">{mortarCement25kgBags}</div>
            <div className="calc-volume-sub">25kg Cement Bags</div>
            <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>
              Based on standard 1:4 UK masonry mortar ratio
            </div>
          </div>
        </div>

        {/* Detailed Spec Table */}
        <table className="calc-spec-table">
          <thead>
            <tr>
              <th>Material Component</th>
              <th>Specification</th>
              <th style={{ textAlign: 'right' }}>Quantity</th>
              <th style={{ textAlign: 'right' }}>Est. Cost (£)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Concrete Blocks</strong></td>
              <td>{selectedBlock.name} ({selectedBlock.strength})</td>
              <td style={{ textAlign: 'right' }}><strong>{totalBlocks} units</strong></td>
              <td style={{ textAlign: 'right' }}>£{blockCost.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Building Sand</strong></td>
              <td>Washed soft sand for Class M4 bricklaying mortar</td>
              <td style={{ textAlign: 'right' }}><strong>{mortarSandKg} kg</strong> ({mortarSand25kgBags} bags)</td>
              <td style={{ textAlign: 'right' }}>£{sandCost.toFixed(2)}</td>
            </tr>
            <tr>
              <td><strong>Portland Cement</strong></td>
              <td>CEM II / A-LL 32.5N Mastercrete or standard Portland</td>
              <td style={{ textAlign: 'right' }}><strong>{mortarCement25kgBags} bags (25kg)</strong></td>
              <td style={{ textAlign: 'right' }}>£{cementCost.toFixed(2)}</td>
            </tr>
            {skinType === 'double' && (
              <tr>
                <td><strong>Cavity Wall Ties</strong></td>
                <td>BS EN 845-1 stainless steel butterfly/twist ties (2.5/m²)</td>
                <td style={{ textAlign: 'right' }}><strong>{wallTies} ties</strong></td>
                <td style={{ textAlign: 'right' }}>£{wallTiesCost.toFixed(2)}</td>
              </tr>
            )}
            <tr>
              <td><strong>Estimated Total Weight</strong></td>
              <td>Delivery weight for transport or hiab crane offload</td>
              <td style={{ textAlign: 'right' }}><strong>~{totalBlockWeightTonnes} tonnes</strong></td>
              <td style={{ textAlign: 'right', color: 'var(--muted)' }}>Ex. delivery</td>
            </tr>
          </tbody>
        </table>

        {/* Action Buttons */}
        <div className="action-bar">
          <button type="button" className="btn-action" onClick={handleCopySummary}>
            {copied ? <Check size={14} color="var(--ok)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Specification'}</span>
          </button>
          <button type="button" className="btn-action" onClick={handleExportCsv}>
            <FileSpreadsheet size={14} />
            <span>Export CSV</span>
          </button>
          <button type="button" className="btn-action" onClick={() => window.print()}>
            <Printer size={14} />
            <span>Print Estimate</span>
          </button>
        </div>
      </div>

      {/* Technical UK Guide Article */}
      <article>
        <section className="c">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Wrench size={15} aria-hidden="true" />
            <span>British Standards Trade Guide</span>
          </div>
          <h2>How to Calculate Concrete Blocks in the UK: Rules of Thumb &amp; Practical Guide</h2>
          <p>
            Blocklaying in the UK is governed by the metric coordination standard established in <strong>BS EN 771-3</strong>. Whether you are building an extension, garden wall, shed foundation, or retaining boundary, understanding block yields and mortar quantities ensures you never run short of materials mid-pour or mid-course.
          </p>

          <h3>1. Why Are There 10 Blocks per Square Metre?</h3>
          <p>
            Standard UK concrete blocks have actual manufactured dimensions (called the <em>work size</em>) of <strong>440mm length × 215mm height × 100mm thickness</strong>.
          </p>
          <p>
            When laid with the industry standard <strong>10mm mortar bed and perpendicular joint</strong>, the coordinating face dimensions become <strong>450mm × 225mm (0.45m × 0.225m)</strong>.
          </p>
          <div style={{ background: 'var(--surface-elevated)', padding: '12px 16px', borderRadius: '6px', border: '1px solid var(--line)', margin: '14px 0', fontFamily: 'monospace', fontSize: '14px' }}>
            Face Area of 1 Block = 0.45m × 0.225m = 0.10125 m²<br />
            Blocks per m² = 1 ÷ 0.10125 = 9.876 blocks ≈ <strong>10 blocks per m²</strong>
          </div>
          <p>
            This 10:1 ratio is universal across dense concrete, lightweight aerated, hollow, and cinder blocks sharing this coordinating format. For double-skin cavity walls, simply double the figure to <strong>20 blocks per m²</strong>.
          </p>

          <h3>2. Choosing the Right Concrete Block for Your Project</h3>
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Block Type</th>
                  <th>Density &amp; Compressive Strength</th>
                  <th>Weight per Block</th>
                  <th>Best UK Application</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Dense Concrete</strong></td>
                  <td>1,800–2,100 kg/m³ (7.3 – 10.4 N/mm²)</td>
                  <td>17 – 20 kg</td>
                  <td>Trench footings, retaining walls, external walls, below DPC</td>
                </tr>
                <tr>
                  <td><strong>Lightweight Aggregate</strong></td>
                  <td>1,300–1,500 kg/m³ (3.6 – 7.3 N/mm²)</td>
                  <td>11 – 14 kg</td>
                  <td>Internal partitions, upper floors, general load-bearing leaves</td>
                </tr>
                <tr>
                  <td><strong>Aerated / Thermalite</strong></td>
                  <td>450–750 kg/m³ (2.9 – 3.6 N/mm²)</td>
                  <td>7 – 9 kg</td>
                  <td>Inner leaf of cavity walls for thermal building compliance</td>
                </tr>
                <tr>
                  <td><strong>Hollow Blocks</strong></td>
                  <td>Core-cast concrete (7.3 N/mm²)</td>
                  <td>15 – 18 kg</td>
                  <td>Reinforced retaining walls, agricultural buildings</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>3. Mortar Ratios &amp; Mixing Recommendations</h3>
          <p>
            For blockwork, a <strong>1:4 or 1:5 mortar mix</strong> (1 part Portland Cement to 4 or 5 parts clean building sand) provides the ideal balance between compressive bond strength and flexibility to absorb minor thermal movement without cracking.
          </p>
          <ul>
            <li><strong>Above DPC / Internal:</strong> 1 cement : 5 building sand with plasticiser additive.</li>
            <li><strong>Below DPC / Retaining Walls:</strong> 1 cement : 3 or 4 building sand for enhanced damp and sulphate resistance.</li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="c">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <HelpCircle size={15} aria-hidden="true" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2>Concrete Block Calculator FAQs</h2>

          <details open>
            <summary>How many concrete blocks are in a square metre (m²)?</summary>
            <p>
              There are exactly 10 standard UK concrete blocks per square metre of single-skin wall when laid with a 10mm mortar joint. If you are building a double-skin cavity wall (internal and external block leaves), you need 20 blocks per square metre.
            </p>
          </details>

          <details>
            <summary>How much mortar do I need for 100 concrete blocks?</summary>
            <p>
              Laying 100 standard concrete blocks (equivalent to 10 m² of wall) consumes approximately 0.05 cubic metres of wet mortar. In raw materials, this equates to roughly 125kg of building sand (5 bags of 25kg or 0.15 of a bulk bag) and 25kg of Portland cement (1 standard bag).
            </p>
          </details>

          <details>
            <summary>What is the standard concrete block size in the UK?</summary>
            <p>
              The standard UK concrete block dimensions under BS EN 771-3 are 440mm long by 215mm high by 100mm thick. The coordinating format including the 10mm mortar bed and perp joints is 450mm × 225mm.
            </p>
          </details>

          <details>
            <summary>Should I use dense or lightweight blocks?</summary>
            <p>
              Use dense concrete blocks (7.3 N/mm²) for structural footings below the damp-proof course (DPC), retaining walls, and soundproofing partitions. Use lightweight aerated blocks (e.g. Thermalite 3.6 N/mm²) for above-ground internal cavity leaves where thermal insulation (U-value) and ease of handling are top priorities.
            </p>
          </details>
        </section>
      </article>
    </div>
  );
}
