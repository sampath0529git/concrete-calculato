'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  Banknote,
  RotateCcw,
  Printer,
  Copy,
  Check,
  Package,
  Truck,
  HelpCircle,
  FileSpreadsheet,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface RegionCost {
  id: string;
  name: string;
  readyMixPerM3: number;
  volumetricPerM3: number;
  minLoadCharge: number;
  bagged25kgPrice: number;
  ballastBulk850kg: number;
}

const UK_REGIONS: RegionCost[] = [
  {
    id: 'london-se',
    name: 'London & South East England',
    readyMixPerM3: 125,
    volumetricPerM3: 138,
    minLoadCharge: 140,
    bagged25kgPrice: 7.20,
    ballastBulk850kg: 58,
  },
  {
    id: 'midlands',
    name: 'Midlands (Birmingham, East & West)',
    readyMixPerM3: 108,
    volumetricPerM3: 122,
    minLoadCharge: 120,
    bagged25kgPrice: 6.45,
    ballastBulk850kg: 48,
  },
  {
    id: 'north',
    name: 'North of England (Manchester, Leeds, Newcastle)',
    readyMixPerM3: 104,
    volumetricPerM3: 118,
    minLoadCharge: 115,
    bagged25kgPrice: 6.25,
    ballastBulk850kg: 45,
  },
  {
    id: 'south-west',
    name: 'South West & Wales',
    readyMixPerM3: 112,
    volumetricPerM3: 126,
    minLoadCharge: 125,
    bagged25kgPrice: 6.80,
    ballastBulk850kg: 52,
  },
  {
    id: 'scotland',
    name: 'Scotland (Central Belt & Highlands)',
    readyMixPerM3: 115,
    volumetricPerM3: 130,
    minLoadCharge: 130,
    bagged25kgPrice: 6.90,
    ballastBulk850kg: 54,
  },
];

export default function PriceOfConcretePerM3Page() {
  const [volumeM3, setVolumeM3] = useState<number>(2.5);
  const [selectedRegionId, setSelectedRegionId] = useState<string>('midlands');
  const [includePump, setIncludePump] = useState<boolean>(false);
  const [pumpType, setPumpType] = useState<'line' | 'boom'>('line');
  const [includeBarrowing, setIncludeBarrowing] = useState<boolean>(false);
  const [cementBagCost, setCementBagCost] = useState<number>(6.95);
  const [copied, setCopied] = useState<boolean>(false);

  const region = useMemo(
    () => UK_REGIONS.find((r) => r.id === selectedRegionId) || UK_REGIONS[1],
    [selectedRegionId]
  );

  // Calculations for Option 1: Ready-Mix Drum Lorry
  // Most suppliers require 4m³ minimum to waive the part-load / short-load fee.
  const partLoadThresholdM3 = 4.0;
  const isPartLoad = volumeM3 < partLoadThresholdM3;
  const partLoadSurcharge = isPartLoad
    ? Math.round((partLoadThresholdM3 - volumeM3) * (region.minLoadCharge * 0.45))
    : 0;
  const readyMixMaterialCost = volumeM3 * region.readyMixPerM3;
  const readyMixTotalCost = readyMixMaterialCost + partLoadSurcharge;

  // Calculations for Option 2: Volumetric On-Site Batching Truck
  // Pay for what you pour, zero part-load charge, but slightly higher per-m³ rate
  const volumetricTotalCost = volumeM3 * region.volumetricPerM3;

  // Calculations for Option 3: Pre-mixed 25kg dry bags (83.3 bags / m³)
  const total25kgBags = Math.ceil(volumeM3 * 83.33);
  const baggedTotalCost = total25kgBags * region.bagged25kgPrice;

  // Calculations for Option 4: Site-Mixed Bulk Ballast + Portland Cement (1:5 ratio)
  // 1 m³ concrete needs ~1.8 tonnes ballast (~2.1 bulk bags of 850kg) + ~320kg cement (13 bags of 25kg)
  const ballastBulkBagsNeeded = Math.ceil(volumeM3 * 2.12);
  const cementBagsNeeded = Math.ceil(volumeM3 * 12.8);
  const ballastCost = ballastBulkBagsNeeded * region.ballastBulk850kg;
  const cementCost = cementBagsNeeded * cementBagCost;
  const siteMixBulkTotalCost = ballastCost + cementCost;

  // Add-on costs
  const pumpCost = includePump ? (pumpType === 'line' ? 360 : 520) : 0;
  const barrowingCost = includeBarrowing ? Math.round(volumeM3 * 25) : 0;

  // Best recommendation logic based on volume
  const recommendation = useMemo(() => {
    if (volumeM3 < 0.8) {
      return {
        badge: 'DIY Bags or Site-Mix Recommended',
        badgeColor: 'var(--ok)',
        title: '25kg Pre-Mix or Bulk Ballast is Most Cost-Effective',
        text: 'For volumes under 0.8 m³ (under ~65 bags), ready-mix lorry delivery incurs heavy part-load charges (£80-£150). Mixing on-site with a hired mixer or buying pre-mixed bags saves money and lets you pour at your own pace.',
      };
    } else if (volumeM3 >= 0.8 && volumeM3 < 3.5) {
      return {
        badge: 'Volumetric Truck or Mini-Mix Ideal',
        badgeColor: 'var(--accent)',
        title: 'Volumetric Lorry or Mini-Mix Offers Best Value',
        text: 'Between 0.8 m³ and 3.5 m³, mixing 70 to 290 bags by hand becomes exhausting. A volumetric concrete truck mixes fresh on-site and charges only for what you pour, eliminating drum waste and short-load penalties.',
      };
    } else {
      return {
        badge: 'Ready-Mix Drum Delivery Most Economical',
        badgeColor: 'var(--calc-blue)',
        title: 'Standard Ready-Mix Truck is Fastest and Cheapest',
        text: 'For volumes over 3.5 m³, standard ready-mix delivery offers the lowest cost per cubic metre (£100–£125/m³), guarantees certified C20/C25 strength (BS 8500), and discharges in under 30 minutes.',
      };
    }
  }, [volumeM3]);

  const handleCopy = () => {
    const text = `UK Concrete Cost Estimate (ConcreteCalc.UK)
Project Volume: ${volumeM3} m³ (${region.name})
1. Ready-Mix Drum Delivery: £${readyMixTotalCost.toFixed(2)} ${isPartLoad ? `(inc. £${partLoadSurcharge} part-load fee)` : ''}
2. Volumetric Truck (Pay as you pour): £${volumetricTotalCost.toFixed(2)}
3. 25kg Pre-Mix Bags: £${baggedTotalCost.toFixed(2)} (${total25kgBags} bags @ £${region.bagged25kgPrice.toFixed(2)})
4. Site-Mixed Bulk Ballast + Cement: £${siteMixBulkTotalCost.toFixed(2)} (${ballastBulkBagsNeeded} bulk bags + ${cementBagsNeeded} cement bags)
${includePump ? `Concrete Pump (${pumpType} pump): +£${pumpCost}\n` : ''}${includeBarrowing ? `Barrowing Service: +£${barrowingCost}\n` : ''}
Best Route: ${recommendation.title}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCsv = () => {
    const rows = [
      ['Supply Method', 'Quantity / Notes', 'Material Cost (£)', 'Extra Fees (£)', 'Total Cost (£)'],
      ['Ready-Mix Drum Delivery', `${volumeM3} m³ Delivered`, readyMixMaterialCost.toFixed(2), partLoadSurcharge.toFixed(2), readyMixTotalCost.toFixed(2)],
      ['Volumetric On-Site Truck', `${volumeM3} m³ Mixed on site`, volumetricTotalCost.toFixed(2), '0.00', volumetricTotalCost.toFixed(2)],
      ['25kg Pre-Mix Dry Bags', `${total25kgBags} × 25kg bags`, baggedTotalCost.toFixed(2), '0.00', baggedTotalCost.toFixed(2)],
      ['Site-Mixed Bulk Ballast + Cement', `${ballastBulkBagsNeeded} bulk bags + ${cementBagsNeeded} cement`, siteMixBulkTotalCost.toFixed(2), '0.00', siteMixBulkTotalCost.toFixed(2)],
      ...(includePump ? [[`Concrete Pump Hire (${pumpType})`, 'Equipment hire', pumpCost.toFixed(2), '0.00', pumpCost.toFixed(2)]] : []),
      ...(includeBarrowing ? [['Barrowing Labour', 'Site handling', barrowingCost.toFixed(2), '0.00', barrowingCost.toFixed(2)]] : []),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `concrete-price-estimate-${volumeM3}m3-${selectedRegionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'guides', href: '/blog' },
          { label: 'price of concrete per m3' },
        ]}
      />

      <div className="hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <Banknote size={16} aria-hidden="true" />
          <span>UK 2026 Ready-Mix &amp; Bagged Cost Benchmark</span>
        </div>
        <h1>Price of Concrete per m³ UK (2026 Cost Guide)</h1>
        <p className="lead">
          How much does a cubic metre of concrete cost in the UK? In 2026, standard ready-mix concrete delivered by drum truck averages <strong>£95 to £130 per m³</strong>, while volumetric on-site trucks charge <strong>£115 to £140 per m³</strong>. Pre-mixed 25kg bags cost roughly <strong>£500 to £600 per m³</strong>. Use our interactive pricing matrix below to compare all four options for your exact project volume.
        </p>
      </div>

      {/* Preset Volume Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '14px 0 22px' }}>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => setVolumeM3(0.5)}
        >
          🪴 0.5 m³ (Small Footing / Patio)
        </button>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => setVolumeM3(1.2)}
        >
          🪵 1.2 m³ (8×6 Shed Base 100mm)
        </button>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => setVolumeM3(3.0)}
        >
          🚗 3.0 m³ (Single Garage Floor)
        </button>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => setVolumeM3(6.0)}
        >
          🚛 6.0 m³ (Full Lorry Load)
        </button>
      </div>

      {/* Main Interactive Cost Estimator Panel */}
      <div className="panel" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--line)', paddingBottom: '14px', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '18px', margin: '0 0 4px', color: 'var(--ink)' }}>
              Interactive Concrete Price Calculator
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
              Adjust volume and region to compare ready-mix delivery vs volumetric truck vs bagged mixing.
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {/* Volume Input */}
          <div className="f">
            <label htmlFor="price-vol" style={{ fontWeight: 700 }}>
              Concrete Volume Required (m³):
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                id="price-vol"
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                value={volumeM3}
                onChange={(e) => setVolumeM3(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                style={{ fontSize: '16px', fontWeight: 700 }}
              />
              <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>m³</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="10"
              step="0.1"
              value={volumeM3}
              onChange={(e) => setVolumeM3(parseFloat(e.target.value))}
              style={{ width: '100%', marginTop: '6px' }}
            />
          </div>

          {/* Region Selector */}
          <div className="f">
            <label htmlFor="price-region" style={{ fontWeight: 700 }}>
              UK Location / Region:
            </label>
            <select
              id="price-region"
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              style={{ fontSize: '14px' }}
            >
              {UK_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (avg ~£{r.readyMixPerM3}/m³)
                </option>
              ))}
            </select>
            <span style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
              Aggregates and haulage costs vary significantly across the UK.
            </span>
          </div>

          {/* Add-ons: Concrete Pump & Barrowing */}
          <div className="f">
            <label style={{ fontWeight: 700 }}>Optional Site Services:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includePump}
                  onChange={(e) => setIncludePump(e.target.checked)}
                />
                <span>Include Concrete Pump (+£{pumpType === 'line' ? '360' : '520'})</span>
              </label>
              {includePump && (
                <div style={{ display: 'flex', gap: '10px', marginLeft: '22px' }}>
                  <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="radio"
                      name="pumptype"
                      checked={pumpType === 'line'}
                      onChange={() => setPumpType('line')}
                    />
                    Ground Line (£360)
                  </label>
                  <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input
                      type="radio"
                      name="pumptype"
                      checked={pumpType === 'boom'}
                      onChange={() => setPumpType('boom')}
                    />
                    Boom Pump (£520)
                  </label>
                </div>
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={includeBarrowing}
                  onChange={(e) => setIncludeBarrowing(e.target.checked)}
                />
                <span>Barrowing Service (+£25/m³ = £{Math.round(volumeM3 * 25)})</span>
              </label>
            </div>
          </div>
        </div>

        {/* Dynamic Best Recommendation Banner */}
        <div style={{ background: 'var(--calc-card-bg)', border: '1px solid var(--calc-card-border)', borderRadius: '8px', padding: '14px 18px', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: recommendation.badgeColor, color: '#fff', textTransform: 'uppercase' }}>
              {recommendation.badge}
            </span>
            <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
              {recommendation.title}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: '1.5' }}>
            {recommendation.text}
          </p>
        </div>

        {/* 4-Way Comparison Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {/* Card 1: Ready-Mix Drum Lorry */}
          <div className="card" style={{ borderTop: '3px solid var(--calc-blue)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                1. Ready-Mix Drum Delivery
              </div>
              <Truck size={18} color="var(--calc-blue)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--calc-blue)', margin: '8px 0 4px' }}>
              £{(readyMixTotalCost + pumpCost + barrowingCost).toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>
              £{((readyMixTotalCost) / volumeM3).toFixed(2)} / m³ effective
            </div>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: '1.6' }}>
              <li>Material rate: £{region.readyMixPerM3}/m³</li>
              {isPartLoad ? (
                <li style={{ color: 'var(--status-warning-text)', fontWeight: 600 }}>
                  Part-load fee: +£{partLoadSurcharge} (under 4m³)
                </li>
              ) : (
                <li style={{ color: 'var(--ok)' }}>Zero part-load surcharge (≥4m³)</li>
              )}
              <li>Standard 30 min free offloading</li>
              <li>Certified C20/C25 strength</li>
            </ul>
          </div>

          {/* Card 2: Volumetric Truck */}
          <div className="card" style={{ borderTop: '3px solid var(--accent)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                2. Volumetric Truck (Mobile)
              </div>
              <Layers size={18} color="var(--accent)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)', margin: '8px 0 4px' }}>
              £{(volumetricTotalCost + pumpCost + barrowingCost).toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>
              £{region.volumetricPerM3.toFixed(2)} / m³ fixed rate
            </div>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: '1.6' }}>
              <li><strong>Zero part-load fees:</strong> Pay only for what you pour</li>
              <li>Mixed fresh on your driveway</li>
              <li>Slump can be changed mid-pour</li>
              <li>No risk of ordering too much or too little</li>
            </ul>
          </div>

          {/* Card 3: 25kg Pre-Mix Bags */}
          <div className="card" style={{ borderTop: '3px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                3. Pre-Mixed 25kg Bags
              </div>
              <Package size={18} color="var(--accent)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--accent)', margin: '8px 0 4px' }}>
              £{(baggedTotalCost).toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>
              £{((baggedTotalCost) / volumeM3).toFixed(2)} / m³ effective
            </div>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: '1.6' }}>
              <li>Requires <strong>{total25kgBags} bags</strong> of 25kg</li>
              <li>@ ~£{region.bagged25kgPrice.toFixed(2)} per bag (Travis Perkins / B&amp;Q)</li>
              <li>Total weight: ~{(total25kgBags * 25 / 1000).toFixed(2)} tonnes</li>
              <li>Work at your own pace; ideal under 0.5m³</li>
            </ul>
          </div>

          {/* Card 4: Site-Mixed Bulk Ballast + Cement */}
          <div className="card" style={{ borderTop: '3px solid var(--ok)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                4. Bulk Ballast &amp; Cement
              </div>
              <Banknote size={18} color="var(--ok)" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ok)', margin: '8px 0 4px' }}>
              £{(siteMixBulkTotalCost).toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '10px' }}>
              £{((siteMixBulkTotalCost) / volumeM3).toFixed(2)} / m³ effective
            </div>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '12px', color: 'var(--ink-secondary)', lineHeight: '1.6' }}>
              <li>1:5 standard ballast-to-cement mix</li>
              <li><strong>{ballastBulkBagsNeeded} × 850kg</strong> bulk bags ballast (£{ballastCost})</li>
              <li><strong>{cementBagsNeeded} × 25kg</strong> bags Mastercrete (£{cementCost})</li>
              <li>Requires cement mixer hire (~£30/day)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* In-Depth Commercial Guide Content */}
      <article className="post">
        <h2>UK Ready-Mix Concrete Pricing Breakdown (2026 Averages)</h2>
        <p>
          In the United Kingdom, concrete pricing is driven by three main factors: raw aggregate availability, local diesel haulage rates, and the volume of your order. Ready-mix suppliers operate heavy 8-wheel lorries carrying 6 to 8 cubic metres of wet concrete.
        </p>

        <div style={{ overflowX: 'auto', margin: '20px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ background: 'var(--surface-elevated)', borderBottom: '2px solid var(--line)' }}>
                <th style={{ padding: '10px 14px' }}>UK Region</th>
                <th style={{ padding: '10px 14px' }}>C20 Mix (m³)</th>
                <th style={{ padding: '10px 14px' }}>C25 Mix (m³)</th>
                <th style={{ padding: '10px 14px' }}>Volumetric m³</th>
                <th style={{ padding: '10px 14px' }}>Typical Part-Load Threshold</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700 }}>London &amp; Greater M25</td>
                <td style={{ padding: '10px 14px' }}>£120 – £130</td>
                <td style={{ padding: '10px 14px' }}>£125 – £135</td>
                <td style={{ padding: '10px 14px' }}>£135 – £145</td>
                <td style={{ padding: '10px 14px' }}>Under 4.0 m³ (£120-£150 fee)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700 }}>Midlands &amp; East Anglia</td>
                <td style={{ padding: '10px 14px' }}>£100 – £112</td>
                <td style={{ padding: '10px 14px' }}>£105 – £118</td>
                <td style={{ padding: '10px 14px' }}>£118 – £128</td>
                <td style={{ padding: '10px 14px' }}>Under 4.0 m³ (£100-£120 fee)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700 }}>North (MCR / Leeds / NE)</td>
                <td style={{ padding: '10px 14px' }}>£95 – £108</td>
                <td style={{ padding: '10px 14px' }}>£100 – £112</td>
                <td style={{ padding: '10px 14px' }}>£115 – £124</td>
                <td style={{ padding: '10px 14px' }}>Under 4.0 m³ (£90-£115 fee)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700 }}>South West &amp; Wales</td>
                <td style={{ padding: '10px 14px' }}>£108 – £116</td>
                <td style={{ padding: '10px 14px' }}>£112 – £122</td>
                <td style={{ padding: '10px 14px' }}>£122 – £132</td>
                <td style={{ padding: '10px 14px' }}>Under 4.0 m³ (£110-£130 fee)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--line)' }}>
                <td style={{ padding: '10px 14px', fontWeight: 700 }}>Scotland (Central &amp; Highlands)</td>
                <td style={{ padding: '10px 14px' }}>£110 – £120</td>
                <td style={{ padding: '10px 14px' }}>£115 – £125</td>
                <td style={{ padding: '10px 14px' }}>£125 – £135</td>
                <td style={{ padding: '10px 14px' }}>Under 4.0 m³ (£115-£135 fee)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Beware of Hidden Ready-Mix Costs</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', margin: '20px 0' }}>
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-warning-text)', margin: '0 0 6px', fontSize: '14.5px' }}>
              <AlertTriangle size={16} />
              Part-Load / Short-Load Charges
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-secondary)' }}>
              Standard concrete lorries hold 6 to 8 m³. If you only order 1.5 m³, the supplier charges for the empty airspace to cover diesel and driver time. This penalty is typically <strong>£25 to £45 per unfilled cubic metre</strong> below 4 m³.
            </p>
          </div>

          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-warning-text)', margin: '0 0 6px', fontSize: '14.5px' }}>
              <Clock size={16} />
              Waiting Time Penalties
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-secondary)' }}>
              Most readymix lorry contracts include <strong>30 minutes of free discharge time</strong>. If you are barrowing by hand and take 60 minutes, waiting charges run between <strong>£1.50 and £3.00 per extra minute</strong> (£90–£180/hour).
            </p>
          </div>
        </div>

        <h2>Volumetric Concrete Trucks vs Standard Drum Mixers</h2>
        <p>
          A <strong>volumetric mixer</strong> is essentially a batching plant on wheels. It carries unmixed dry sand, stone aggregate, cement powder, and water in separate compartments:
        </p>
        <ul>
          <li><strong>Zero Waste Risk:</strong> The computerised auger only mixes what you consume. When your slab is full, the operator stops the machine. You never pay for excess concrete.</li>
          <li><strong>No Time Pressure:</strong> Because the water and cement are mixed inside the chute seconds before placement, the concrete has its full 90-minute initial setting window.</li>
          <li><strong>Ideal for Difficult Access:</strong> If barrowing through a narrow garden gate takes 45 minutes, the unmixed materials in the hopper will not set or spoil.</li>
        </ul>

        <h2>Frequently Asked Questions About UK Concrete Prices</h2>
        <div className="faq-grid" style={{ marginTop: '16px' }}>
          <div className="card">
            <h3 style={{ fontSize: '14.5px', margin: '0 0 6px', color: 'var(--ink)' }}>
              How much does 1 cubic metre of concrete weigh in the UK?
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-secondary)' }}>
              Standard wet concrete weighs approximately <strong>2.4 tonnes (2,400 kg) per cubic metre</strong>. A 1 m³ pour requires either one small truck delivery, 96 standard 25kg pre-mix bags (with 15% water weight), or 2.1 bulk bags of ballast combined with 13 bags of Portland cement.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '14.5px', margin: '0 0 6px', color: 'var(--ink)' }}>
              Is it cheaper to mix concrete by hand or get ready-mix delivered?
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-secondary)' }}>
              Under <strong>0.8 m³</strong>, buying 25kg bags or bulk ballast is cheaper because ready-mix suppliers charge short-load penalties. Above <strong>1.0 m³</strong>, ready-mix or volumetric delivery is usually cheaper per cubic metre, saves days of heavy labour, and ensures guaranteed structural strength conforming to BS 8500.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '14.5px', margin: '0 0 6px', color: 'var(--ink)' }}>
              How much does concrete pump hire cost in the UK?
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-secondary)' }}>
              A ground line pump (flexible pipes laid through a house or garden side passage up to 80m) typically costs <strong>£320 to £400 + VAT</strong> for a half-day hire. A hydraulic boom pump (lifting concrete over roofs or obstacles) costs <strong>£500 to £700 + VAT</strong>.
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
            href="/ready-mix-vs-bagged-concrete"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '10px 18px' }}
          >
            Read Ready-Mix vs Bagged Guide →
          </Link>
        </div>
      </article>
    </div>
  );
}
