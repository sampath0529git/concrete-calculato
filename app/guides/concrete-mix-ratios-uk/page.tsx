'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../../components/Breadcrumbs';
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
  BookOpen,
  Beaker,
  ShieldCheck,
  Scale,
} from 'lucide-react';

interface MixGrade {
  code: string;
  bsStandard: string;
  ratioVol: string;
  ratioDesc: string;
  strength28Day: string;
  bestUses: string;
  cementKgPerM3: number;
  sandKgPerM3: number;
  gravelKgPerM3: number;
  waterLitresPerM3: number;
}

const UK_CONCRETE_MIX_GRADES: MixGrade[] = [
  {
    code: 'C15 / GEN 2',
    bsStandard: 'BS 8500-2',
    ratioVol: '1 : 3 : 6',
    ratioDesc: '1 part Cement : 3 parts Sharp Sand : 6 parts 20mm Gravel',
    strength28Day: '15 N/mm²',
    bestUses: 'Blinding layers, non-structural floor fills, kerb backing, steps sub-base.',
    cementKgPerM3: 230,
    sandKgPerM3: 700,
    gravelKgPerM3: 1350,
    waterLitresPerM3: 150,
  },
  {
    code: 'C20 / GEN 3',
    bsStandard: 'BS 8500-2',
    ratioVol: '1 : 2 : 4',
    ratioDesc: '1 part Cement : 2 parts Sharp Sand : 4 parts 20mm Gravel (or 1:5 All-in Ballast)',
    strength28Day: '20 N/mm²',
    bestUses: 'Garden shed bases, domestic paths, unreinforced domestic foundations, greenhouse floors.',
    cementKgPerM3: 300,
    sandKgPerM3: 650,
    gravelKgPerM3: 1250,
    waterLitresPerM3: 170,
  },
  {
    code: 'C25 / RC25',
    bsStandard: 'BS 8500-2',
    ratioVol: '1 : 1.5 : 3',
    ratioDesc: '1 part Cement : 1.5 parts Sharp Sand : 3 parts 20mm Gravel',
    strength28Day: '25 N/mm²',
    bestUses: 'Reinforced domestic house extensions, patio slabs, retaining walls, garage floor slabs.',
    cementKgPerM3: 340,
    sandKgPerM3: 600,
    gravelKgPerM3: 1200,
    waterLitresPerM3: 175,
  },
  {
    code: 'C30 / PAV 1',
    bsStandard: 'BS 8500-2',
    ratioVol: '1 : 1 : 2',
    ratioDesc: '1 part Cement : 1 part Sharp Sand : 2 parts 20mm Gravel',
    strength28Day: '30 N/mm²',
    bestUses: 'Domestic driveways subjected to frost and de-icing salts, heavy vehicle parking, farm yards.',
    cementKgPerM3: 380,
    sandKgPerM3: 560,
    gravelKgPerM3: 1150,
    waterLitresPerM3: 180,
  },
];

export default function ConcreteMixRatiosUkPage() {
  const [selectedGradeCode, setSelectedGradeCode] = useState<string>('C20 / GEN 3');
  const [volumeM3, setVolumeM3] = useState<number>(1.0);
  const [copied, setCopied] = useState<boolean>(false);

  const activeGrade = useMemo(
    () => UK_CONCRETE_MIX_GRADES.find((g) => g.code === selectedGradeCode) || UK_CONCRETE_MIX_GRADES[1],
    [selectedGradeCode]
  );

  // Material calculations for given volume
  const cementKg = Math.round(activeGrade.cementKgPerM3 * volumeM3);
  const cement25kgBags = Math.ceil(cementKg / 25);
  const sandKg = Math.round(activeGrade.sandKgPerM3 * volumeM3);
  const sandBulkBags850kg = (sandKg / 850).toFixed(2);
  const gravelKg = Math.round(activeGrade.gravelKgPerM3 * volumeM3);
  const gravelBulkBags850kg = (gravelKg / 850).toFixed(2);
  const waterLitres = Math.round(activeGrade.waterLitresPerM3 * volumeM3);

  // Ballast combined alternative (1:5 standard)
  const ballastCombinedKg = sandKg + gravelKg;
  const ballastBulkBags850kg = Math.ceil(ballastCombinedKg / 850);

  const handleCopy = () => {
    const text = `Concrete Mix Specification (UK BS 8500):
Grade: ${activeGrade.code} (${activeGrade.strength28Day} @ 28 Days)
Ratio by Volume: ${activeGrade.ratioVol} (${activeGrade.ratioDesc})
Target Volume: ${volumeM3} m³
Materials Required:
- Portland Cement: ${cementKg} kg (${cement25kgBags} × 25kg bags)
- Sharp Sand: ${sandKg} kg (~${sandBulkBags850kg} bulk bags)
- 20mm Aggregate / Shingle: ${gravelKg} kg (~${gravelBulkBags850kg} bulk bags)
- Water: ~${waterLitres} Litres (w/c ratio approx 0.55)
Alternative (All-in Ballast): ${ballastBulkBags850kg} × 850kg ballast bulk bags + ${cement25kgBags} bags cement
Generated via ConcreteCalc.UK`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'guides', href: '/blog' },
          { label: 'concrete mix ratios uk' },
        ]}
      />

      <div className="hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <Beaker size={16} aria-hidden="true" />
          <span>British Standards BS 8500 / BS EN 206 Reference</span>
        </div>
        <h1>Concrete Mix Ratios UK (C15, C20, C25, C30 &amp; 1:2:4 Mixes)</h1>
        <p className="lead">
          The complete UK guide to concrete mix ratios by volume and weight. Compare standard British designated mixes (GEN 1, C20, C25, C30), calculate exact quantities of cement, sharp sand, 20mm gravel, and water, and discover whether bucket batching or all-in ballast is right for your project.
        </p>
      </div>

      {/* Interactive Mix Calculator Panel */}
      <div className="panel" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--line)', paddingBottom: '14px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', margin: '0 0 4px', color: 'var(--ink)' }}>
              Interactive Mix Batching Calculator
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
              Select your required BS strength grade and pour volume to get precise dry material quantities.
            </p>
          </div>
          <button
            type="button"
            className="btn-action"
            onClick={handleCopy}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {copied ? <Check size={14} color="var(--ok)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy Mix Spec'}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '22px' }}>
          <div className="f">
            <label htmlFor="mix-grade-select" style={{ fontWeight: 700 }}>
              Select Concrete Grade:
            </label>
            <select
              id="mix-grade-select"
              value={selectedGradeCode}
              onChange={(e) => setSelectedGradeCode(e.target.value)}
              style={{ fontSize: '14.5px', fontWeight: 600 }}
            >
              {UK_CONCRETE_MIX_GRADES.map((g) => (
                <option key={g.code} value={g.code}>
                  {g.code} ({g.ratioVol}) – {g.strength28Day}
                </option>
              ))}
            </select>
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
              {activeGrade.bestUses}
            </span>
          </div>

          <div className="f">
            <label htmlFor="mix-volume-m3" style={{ fontWeight: 700 }}>
              Required Concrete Volume (m³):
            </label>
            <input
              id="mix-volume-m3"
              type="number"
              step="0.1"
              min="0.1"
              max="20"
              value={volumeM3}
              onChange={(e) => setVolumeM3(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
              style={{ fontSize: '16px', fontWeight: 700 }}
            />
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Generates ~{(volumeM3 * 2.4).toFixed(2)} tonnes of wet concrete
            </span>
          </div>
        </div>

        {/* Quantities Display */}
        <div style={{ background: 'var(--calc-card-bg)', border: '1px solid var(--calc-card-border)', borderRadius: '10px', padding: '18px 20px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Portland Cement
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)' }}>
                {cement25kgBags} bags
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                {cementKg} kg (CEM II 32.5N)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Sharp Sand (Grit Sand)
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)' }}>
                {sandKg} kg
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                ~{sandBulkBags850kg} bulk bags (850kg)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                20mm Gravel / Aggregate
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ink)' }}>
                {gravelKg} kg
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                ~{gravelBulkBags850kg} bulk bags (850kg)
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Clean Mixing Water
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)' }}>
                ~{waterLitres} Litres
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Add gradually for desired slump
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Ballast Box */}
        <div style={{ background: 'var(--surface-elevated)', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong>Convenient All-In Ballast Alternative:</strong> Instead of buying sand and gravel separately, order{' '}
            <strong style={{ color: 'var(--calc-blue)' }}>{ballastBulkBags850kg} bulk bags (850kg) of all-in ballast</strong>{' '}
            plus <strong>{cement25kgBags} bags</strong> of 25kg cement.
          </div>
          <Link href="/" className="btn-action" style={{ fontSize: '12.5px', padding: '6px 12px' }}>
            Check in Calculator →
          </Link>
        </div>
      </div>

      {/* Guide Content */}
      <article className="post">
        <h2>UK Standard Concrete Mixes (BS 8500 Specifications)</h2>
        <p>
          In British construction, concrete mixes are categorised by their compressive characteristic strength measured in Newtons per square millimetre (N/mm²) after 28 days of curing.
        </p>

        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: 'var(--surface-elevated)', borderBottom: '2px solid var(--line)' }}>
                <th style={{ padding: '10px 14px' }}>BS Grade</th>
                <th style={{ padding: '10px 14px' }}>Volume Ratio</th>
                <th style={{ padding: '10px 14px' }}>Strength (28d)</th>
                <th style={{ padding: '10px 14px' }}>Typical UK Applications</th>
              </tr>
            </thead>
            <tbody>
              {UK_CONCRETE_MIX_GRADES.map((grade) => (
                <tr key={grade.code} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>{grade.code}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace' }}>{grade.ratioVol}</td>
                  <td style={{ padding: '10px 14px' }}>{grade.strength28Day}</td>
                  <td style={{ padding: '10px 14px' }}>{grade.bestUses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>How to Measure Concrete by Volume on Site (Bucket Method)</h2>
        <p>
          When mixing concrete on site with a portable electric or petrol cement mixer (like a Belle Minimix 150), standard builders use gauge buckets or level shovels:
        </p>
        <ol>
          <li><strong>1:2:4 Standard Mix (C20):</strong> 1 gauge bucket of cement, 2 gauge buckets of clean sharp sand, 4 gauge buckets of 20mm gravel.</li>
          <li><strong>1:5 All-In Ballast Mix:</strong> 1 gauge bucket of cement to 5 gauge buckets of blended ballast.</li>
          <li><strong>Water Ratio:</strong> Keep water as low as possible while maintaining workability. Adding excessive water dilutes the cement paste and cuts the ultimate compressive strength in half.</li>
        </ol>

        <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--line)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            href="/"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '10px 18px' }}
          >
            ← Open Main Concrete Calculator
          </Link>
          <Link
            href="/concrete-slab-calculator"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '10px 18px' }}
          >
            Calculate Concrete Slab Materials →
          </Link>
          <Link
            href="/price-of-concrete-per-m3"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '10px 18px' }}
          >
            Check Ready-Mix Prices per m³ →
          </Link>
        </div>
      </article>
    </div>
  );
}
