'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  Scale,
  Box,
  Copy,
  Check,
  RotateCcw,
  Printer,
  Truck,
  ArrowRightLeft,
  Info,
  HelpCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  ClipboardCheck,
  FileDown,
  Download,
} from 'lucide-react';
import { exportTradeQuotePdf } from '../lib/exportPdf';

type TabMode = 'density' | 'volume' | 'weight';
type VolumeUnit = 'm3' | 'yd3' | 'ft3' | 'litres' | 'bags25' | 'wheelbarrows';
type WeightUnit = 'tonnes' | 'kg' | 'lbs' | 'bulk_bags' | 'bags25';

interface DensityPreset {
  id: string;
  name: string;
  densityKgM3: number;
  useCase: string;
  standard: string;
}

const DENSITY_PRESETS: DensityPreset[] = [
  {
    id: 'c20_25',
    name: 'C20/25 Standard Domestic Slab & Footings',
    densityKgM3: 2400,
    useCase: 'Shed slabs, garden patios, house extension footings & paths',
    standard: 'BS 8500 / BS EN 206',
  },
  {
    id: 'c30_37',
    name: 'C30/37 Heavy-Duty Paving & Driveways',
    densityKgM3: 2420,
    useCase: 'Vehicular driveways, agricultural yards & structural slabs',
    standard: 'BS 8500 / BS EN 206',
  },
  {
    id: 'c15_gen1',
    name: 'GEN 1 / C15 Non-Structural Blinding',
    densityKgM3: 2350,
    useCase: 'Trench blinding, mass filling & kerb bedding',
    standard: 'BS 8500 GEN 1',
  },
  {
    id: 'c40_dense',
    name: 'C40/50 High-Strength Civil Reinforced',
    densityKgM3: 2500,
    useCase: 'Commercial foundations, marine works & heavily reinforced beams',
    standard: 'BS EN 206 High Density',
  },
  {
    id: 'lightweight',
    name: 'Lightweight Aggregate Mix (Lytag / Pumice)',
    densityKgM3: 1850,
    useCase: 'Multi-storey floor screeds & weight-restricted roof decks',
    standard: 'BS EN 13055',
  },
];

interface QuickPreset {
  label: string;
  volumeM3: number;
  description: string;
}

const QUICK_PRESETS: QuickPreset[] = [
  { label: '0.5 m³ Footing', volumeM3: 0.5, description: 'Small garden wall footing' },
  { label: '1.0 m³ Standard Cube', volumeM3: 1.0, description: '1 cubic metre standard trade benchmark' },
  { label: '1.5 m³ 8x6 Shed Base', volumeM3: 1.5, description: '100mm slab for 8ft x 6ft shed' },
  { label: '0.35 m³ 1 Bulk Bag', volumeM3: 0.354, description: '1 tonne merchant ballast equivalent' },
  { label: '4.0 m³ Mini-Mix', volumeM3: 4.0, description: 'Small access mini ready-mix truck' },
  { label: '6.0 m³ Standard Truck', volumeM3: 6.0, description: 'Standard 6-wheeler transit drum' },
  { label: '8.0 m³ Max 8-Wheeler', volumeM3: 8.0, description: 'Maximum UK 8-wheeler ready-mix load' },
];

export default function ConcreteWeightConverterPage() {
  const [activeTab, setActiveTab] = useState<TabMode>('density');

  // Volume ⇄ Weight Tab
  const [densityDirection, setDensityDirection] = useState<'vol_to_wt' | 'wt_to_vol'>('vol_to_wt');
  const [densityInput, setDensityInput] = useState<string>('1');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('c20_25');
  const [customDensity, setCustomDensity] = useState<number>(2400);
  const [isCustomDensity, setIsCustomDensity] = useState<boolean>(false);

  // Standalone Volume Tab
  const [volVal, setVolVal] = useState<string>('1');
  const [volUnit, setVolUnit] = useState<VolumeUnit>('m3');

  // Standalone Weight Tab
  const [wtVal, setWtVal] = useState<string>('1');
  const [wtUnit, setWtUnit] = useState<WeightUnit>('tonnes');

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Quote reference / customisation & PDF export feedback
  const [quoteProjectRef, setQuoteProjectRef] = useState<string>('');
  const [pdfExported, setPdfExported] = useState<boolean>(false);

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const parseNumber = (val: string): number => {
    const n = parseFloat(val);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  const currentDensityKgM3 = useMemo(() => {
    if (isCustomDensity) return customDensity > 0 ? customDensity : 2400;
    const found = DENSITY_PRESETS.find((p) => p.id === selectedPresetId);
    return found ? found.densityKgM3 : 2400;
  }, [isCustomDensity, customDensity, selectedPresetId]);

  // Volume ⇄ Weight Calculations
  const densityCalcResults = useMemo(() => {
    const rawVal = parseNumber(densityInput);
    const densityTonnesPerM3 = currentDensityKgM3 / 1000;

    let m3 = 0;
    let tonnes = 0;

    if (densityDirection === 'vol_to_wt') {
      m3 = rawVal;
      tonnes = rawVal * densityTonnesPerM3;
    } else {
      tonnes = rawVal;
      m3 = densityTonnesPerM3 > 0 ? rawVal / densityTonnesPerM3 : 0;
    }

    const kg = tonnes * 1000;
    const lbs = kg * 2.20462;
    const yd3 = m3 * 1.30795;
    const ft3 = m3 * 35.3147;
    const litres = m3 * 1000;
    const bags25 = m3 > 0 ? m3 / 0.012 : 0; // standard UK 25kg pre-mix bag yields ~12L (0.012 m³)
    const bags20 = m3 > 0 ? m3 / 0.0095 : 0; // 20kg bag yields ~9.5L
    const wheelbarrows = m3 > 0 ? m3 / 0.07 : 0; // builder's 65-70L barrow
    const bulkBags = kg / 850; // standard 850kg builder's bulk bag
    const truckCapacityPercent6m3 = (m3 / 6) * 100;
    const truckCapacityPercent8m3 = (m3 / 8) * 100;

    // Transport vehicle logic
    let transportRecommendation = '';
    let transportBadge = 'info';
    if (tonnes <= 0) {
      transportRecommendation = 'Enter a valid quantity to view transport advice.';
    } else if (tonnes <= 0.5) {
      transportRecommendation = 'Lightweight: Can be collected in heavy-duty car boot or small 500kg unbraked trailer.';
      transportBadge = 'success';
    } else if (tonnes <= 1.2) {
      transportRecommendation = 'Small load: Suitable for a 1.2t braked twin-axle plant trailer or transit drop-side van.';
      transportBadge = 'success';
    } else if (tonnes <= 3.5) {
      transportRecommendation = 'Medium load: Exceeds standard 3.5t van payload. Requires multiple trips or an 8-yard skip / grab hire.';
      transportBadge = 'warning';
    } else if (m3 <= 4.0) {
      transportRecommendation = 'Commercial volume: Recommend a 4m³ Mini-Mix or volumetric concrete delivery truck.';
      transportBadge = 'info';
    } else if (m3 <= 6.0) {
      transportRecommendation = 'Large pour: Full load for standard 6-wheeler transit drum mixer (up to 14.4 tonnes).';
      transportBadge = 'info';
    } else {
      transportRecommendation = 'Major civil pour: Requires 8-wheeler ready-mix delivery (up to 8m³) or multiple truck rotations.';
      transportBadge = 'warning';
    }

    return {
      m3,
      tonnes,
      kg,
      lbs,
      yd3,
      ft3,
      litres,
      bags25,
      bags20,
      wheelbarrows,
      bulkBags,
      truckCapacityPercent6m3,
      truckCapacityPercent8m3,
      transportRecommendation,
      transportBadge,
    };
  }, [densityInput, densityDirection, currentDensityKgM3]);

  // Pure Volume Unit Conversions
  const volumeUnitConversions = useMemo(() => {
    const v = parseNumber(volVal);
    let baseM3 = 0;
    switch (volUnit) {
      case 'm3':
        baseM3 = v;
        break;
      case 'yd3':
        baseM3 = v / 1.30795;
        break;
      case 'ft3':
        baseM3 = v / 35.3147;
        break;
      case 'litres':
        baseM3 = v / 1000;
        break;
      case 'bags25':
        baseM3 = v * 0.012;
        break;
      case 'wheelbarrows':
        baseM3 = v * 0.07;
        break;
    }

    return {
      m3: baseM3,
      yd3: baseM3 * 1.30795,
      ft3: baseM3 * 35.3147,
      litres: baseM3 * 1000,
      bags25: baseM3 / 0.012,
      wheelbarrows: baseM3 / 0.07,
      estTonnes: baseM3 * 2.4, // standard 2.4t/m³
    };
  }, [volVal, volUnit]);

  // Pure Weight Unit Conversions
  const weightUnitConversions = useMemo(() => {
    const w = parseNumber(wtVal);
    let baseKg = 0;
    switch (wtUnit) {
      case 'tonnes':
        baseKg = w * 1000;
        break;
      case 'kg':
        baseKg = w;
        break;
      case 'lbs':
        baseKg = w / 2.20462;
        break;
      case 'bulk_bags':
        baseKg = w * 850;
        break;
      case 'bags25':
        baseKg = w * 25;
        break;
    }

    const tonnes = baseKg / 1000;
    const estM3 = tonnes / 2.4; // based on 2.4 t/m³

    return {
      tonnes,
      kg: baseKg,
      lbs: baseKg * 2.20462,
      bulkBags: baseKg / 850,
      bags25: baseKg / 25,
      estM3,
    };
  }, [wtVal, wtUnit]);

  const setPresetVolume = (m3: number) => {
    setActiveTab('density');
    setDensityDirection('vol_to_wt');
    setDensityInput(m3.toString());
  };

  // Structured Trade Quote Text Reports (Volume, Tonnes, Bags)
  const generateDensityQuoteReport = () => {
    const mixName = isCustomDensity
      ? `Custom Mix (${currentDensityKgM3} kg/m³)`
      : (DENSITY_PRESETS.find((p) => p.id === selectedPresetId)?.name || 'C20/25 Gen 3 Concrete');

    const refLines = quoteProjectRef.trim()
      ? [`• PROJECT / CLIENT REF: ${quoteProjectRef.trim()}`, '--------------------------------------------------']
      : [];

    return [
      '==================================================',
      ' CONCRETE SPECIFICATION & MATERIAL QUOTE REPORT',
      ' Standard: BS 8500 / BS EN 206 Compliant (UK)',
      '==================================================',
      ...refLines,
      `• VOLUME (Net):       ${densityCalcResults.m3.toFixed(3)} m³`,
      `  - Imperial Equiv:   ${densityCalcResults.yd3.toFixed(2)} cu yd (${densityCalcResults.ft3.toFixed(1)} cu ft)`,
      `  - Liquid Litres:    ${densityCalcResults.litres.toLocaleString(undefined, { maximumFractionDigits: 0 })} L`,
      '--------------------------------------------------',
      `• TOTAL WET WEIGHT:   ${densityCalcResults.tonnes.toFixed(2)} Metric Tonnes`,
      `  - In Kilograms:     ${densityCalcResults.kg.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg`,
      `  - In Pounds:        ${densityCalcResults.lbs.toLocaleString(undefined, { maximumFractionDigits: 0 })} lbs`,
      '--------------------------------------------------',
      `• BAGS & SITE YIELD:`,
      `  - 25kg Pre-Mix:     ${Math.ceil(densityCalcResults.bags25)} bags (~0.012 m³ yield per bag)`,
      `  - 850kg Bulk Bags:  ${densityCalcResults.bulkBags.toFixed(2)} bulk dumpy bags (aggregate/ballast)`,
      `  - Wheelbarrow Loads:~${Math.ceil(densityCalcResults.wheelbarrows)} barrow loads (~70L / ~160kg wet)`,
      '--------------------------------------------------',
      `• SPECIFICATION & LOGISTICS:`,
      `  - Concrete Mix:     ${mixName}`,
      `  - Wet Density:      ${currentDensityKgM3} kg/m³ (${(currentDensityKgM3 / 1000).toFixed(2)} t/m³)`,
      `  - 6m³ Mixer Truck:  ${densityCalcResults.truckCapacityPercent6m3.toFixed(0)}% of drum capacity`,
      `  - Transport Advice: ${densityCalcResults.transportRecommendation}`,
      '--------------------------------------------------',
      'Generated via Concrete Calculator UK (concrete-weight-converter)',
      '=================================================='
    ].join('\n');
  };

  const generateVolumeQuoteReport = () => {
    const refLines = quoteProjectRef.trim()
      ? [`• PROJECT / CLIENT REF: ${quoteProjectRef.trim()}`, '--------------------------------------------------']
      : [];

    return [
      '==================================================',
      ' CONCRETE VOLUME SPECIFICATION & TRADE QUOTE',
      '==================================================',
      ...refLines,
      `• Input Value:        ${volVal} ${volUnit}`,
      `• Cubic Metres (m³):  ${volumeUnitConversions.m3.toFixed(3)} m³`,
      `• Cubic Yards (yd³):  ${volumeUnitConversions.yd3.toFixed(3)} cu yd (${volumeUnitConversions.ft3.toFixed(1)} cu ft)`,
      `• Liquid Litres:      ${volumeUnitConversions.litres.toLocaleString(undefined, { maximumFractionDigits: 0 })} Litres`,
      '--------------------------------------------------',
      `• ESTIMATED WEIGHT:   ${volumeUnitConversions.estTonnes.toFixed(2)} Metric Tonnes (~${(volumeUnitConversions.estTonnes * 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} kg wet)`,
      `• 25kg Pre-Mix Bags:  ${Math.ceil(volumeUnitConversions.bags25)} bags (~12L yield per bag)`,
      `• Wheelbarrow Loads:  ~${Math.ceil(volumeUnitConversions.wheelbarrows)} loads (~70L / barrow)`,
      '--------------------------------------------------',
      'Generated via Concrete Calculator UK',
      '=================================================='
    ].join('\n');
  };

  const generateWeightQuoteReport = () => {
    const refLines = quoteProjectRef.trim()
      ? [`• PROJECT / CLIENT REF: ${quoteProjectRef.trim()}`, '--------------------------------------------------']
      : [];

    return [
      '==================================================',
      ' CONCRETE WEIGHT SPECIFICATION & TRADE QUOTE',
      '==================================================',
      ...refLines,
      `• Input Value:        ${wtVal} ${wtUnit}`,
      `• Metric Tonnes:      ${weightUnitConversions.tonnes.toFixed(3)} Tonnes`,
      `• Kilograms (kg):     ${weightUnitConversions.kg.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg`,
      `• Imperial Pounds:    ${weightUnitConversions.lbs.toLocaleString(undefined, { maximumFractionDigits: 0 })} lbs`,
      '--------------------------------------------------',
      `• ESTIMATED VOLUME:   ${weightUnitConversions.estM3.toFixed(3)} m³ (@ standard 2.4 t/m³ BS 8500)`,
      `• 25kg Pre-Mix Bags:  ${Math.ceil(weightUnitConversions.bags25)} bags (40 bags per tonne)`,
      `• 850kg Bulk Bags:    ${weightUnitConversions.bulkBags.toFixed(2)} merchant dumpy bags`,
      '--------------------------------------------------',
      'Generated via Concrete Calculator UK',
      '=================================================='
    ].join('\n');
  };

  // PDF Export Handlers
  const handleExportDensityPdf = () => {
    const mixName = isCustomDensity
      ? `Custom Mix (${currentDensityKgM3} kg/m³)`
      : (DENSITY_PRESETS.find((p) => p.id === selectedPresetId)?.name || 'C20/25 Gen 3 Concrete');

    exportTradeQuotePdf({
      tab: 'density',
      mixName,
      densityKgM3: currentDensityKgM3,
      inputDescription: densityDirection === 'vol_to_wt' ? `${densityInput} m³ input` : `${densityInput} tonnes input`,
      volumeM3: densityCalcResults.m3,
      volumeYd3: densityCalcResults.yd3,
      volumeFt3: densityCalcResults.ft3,
      litres: densityCalcResults.litres,
      tonnes: densityCalcResults.tonnes,
      kg: densityCalcResults.kg,
      lbs: densityCalcResults.lbs,
      bags25: densityCalcResults.bags25,
      bags20: densityCalcResults.bags20,
      bulkBags: densityCalcResults.bulkBags,
      wheelbarrows: densityCalcResults.wheelbarrows,
      truckCapacityPercent6m3: densityCalcResults.truckCapacityPercent6m3,
      transportRecommendation: densityCalcResults.transportRecommendation,
      projectReference: quoteProjectRef.trim() || undefined,
    });

    setPdfExported(true);
    setTimeout(() => setPdfExported(false), 3000);
  };

  const handleExportVolumePdf = () => {
    exportTradeQuotePdf({
      tab: 'volume',
      mixName: 'Standard UK Concrete Mix (C20 / 2,400 kg/m³)',
      densityKgM3: 2400,
      inputDescription: `${volVal} ${volUnit}`,
      volumeM3: volumeUnitConversions.m3,
      volumeYd3: volumeUnitConversions.yd3,
      volumeFt3: volumeUnitConversions.ft3,
      litres: volumeUnitConversions.litres,
      tonnes: volumeUnitConversions.estTonnes,
      kg: volumeUnitConversions.estTonnes * 1000,
      lbs: volumeUnitConversions.estTonnes * 1000 * 2.20462,
      bags25: volumeUnitConversions.bags25,
      bulkBags: (volumeUnitConversions.estTonnes * 1000) / 850,
      wheelbarrows: volumeUnitConversions.wheelbarrows,
      truckCapacityPercent6m3: (volumeUnitConversions.m3 / 6) * 100,
      transportRecommendation:
        volumeUnitConversions.estTonnes <= 1.2
          ? 'Small load: Suitable for a 1.2t braked plant trailer or transit drop-side van.'
          : volumeUnitConversions.estTonnes <= 3.5
          ? 'Medium load: Exceeds standard 3.5t van payload. Requires multiple trips or an 8-yard skip.'
          : 'Commercial volume: Recommend a 4m³ Mini-Mix or standard 6m³ ready-mix delivery truck.',
      projectReference: quoteProjectRef.trim() || undefined,
    });

    setPdfExported(true);
    setTimeout(() => setPdfExported(false), 3000);
  };

  const handleExportWeightPdf = () => {
    exportTradeQuotePdf({
      tab: 'weight',
      mixName: 'Standard UK Concrete Mix (C20 / 2,400 kg/m³)',
      densityKgM3: 2400,
      inputDescription: `${wtVal} ${wtUnit}`,
      volumeM3: weightUnitConversions.estM3,
      volumeYd3: weightUnitConversions.estM3 * 1.30795,
      volumeFt3: weightUnitConversions.estM3 * 35.3147,
      litres: weightUnitConversions.estM3 * 1000,
      tonnes: weightUnitConversions.tonnes,
      kg: weightUnitConversions.kg,
      lbs: weightUnitConversions.lbs,
      bags25: weightUnitConversions.bags25,
      bulkBags: weightUnitConversions.bulkBags,
      wheelbarrows: weightUnitConversions.estM3 / 0.07,
      truckCapacityPercent6m3: (weightUnitConversions.estM3 / 6) * 100,
      transportRecommendation:
        weightUnitConversions.tonnes <= 1.2
          ? 'Small load: Suitable for a 1.2t braked twin-axle plant trailer or transit drop-side van.'
          : weightUnitConversions.tonnes <= 3.5
          ? 'Medium load: Exceeds standard 3.5t van payload. Requires multiple trips or an 8-yard skip.'
          : 'Commercial load: Recommend mini-mix or standard 6-wheeler transit drum mixer.',
      projectReference: quoteProjectRef.trim() || undefined,
    });

    setPdfExported(true);
    setTimeout(() => setPdfExported(false), 3000);
  };

  const breadcrumbsList = [
    { label: 'Home', href: '/' },
    { label: 'Concrete Unit & Weight Converter' },
  ];

  return (
    <div className="page-body">
      <div className="wrap" style={{ paddingTop: '16px', paddingBottom: '48px' }}>
        <Breadcrumbs items={breadcrumbsList} />

        {/* Page Hero Header */}
        <div style={{ marginTop: '14px', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '11.5px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: 'rgba(217, 119, 6, 0.12)',
              color: 'var(--accent)',
              marginBottom: '10px',
            }}
          >
            <Scale size={13} aria-hidden="true" />
            <span>BS 8500 Certified UK Converter</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              color: 'var(--ink)',
              margin: '0 0 12px 0',
            }}
          >
            Concrete Weight &amp; Unit Converter UK
          </h1>
          <p
            style={{
              fontSize: '15.5px',
              lineHeight: 1.6,
              color: 'var(--muted)',
              maxWidth: '840px',
              margin: 0,
            }}
          >
            Convert accurately between <strong>cubic metres (m³)</strong>, <strong>metric tonnes</strong>,{' '}
            <strong>25kg pre-mix bags</strong>, <strong>850kg bulk dumpy bags</strong>,{' '}
            <strong>wheelbarrows</strong>, and imperial cubic yards. Based on standard British Standards{' '}
            <strong>BS 8500</strong> wet concrete densities (~2,400 kg/m³).
          </p>
        </div>

        {/* Quick Presets Bar */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Quick UK Trade Benchmarks (Click to load):</span>
            <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Standard Density: 2.4 t/m³</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setPresetVolume(preset.volumeM3)}
                className="btn-ghost"
                style={{
                  fontSize: '12.5px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--line)',
                  background: 'var(--surface-sunken)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title={preset.description}
              >
                <strong>{preset.label}</strong>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '2px solid var(--line)',
            marginBottom: '24px',
          }}
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'density'}
            onClick={() => setActiveTab('density')}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 700,
              borderBottom: activeTab === 'density' ? '3px solid var(--accent)' : '3px solid transparent',
              color: activeTab === 'density' ? 'var(--accent)' : 'var(--muted)',
              background: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowRightLeft size={16} />
            <span>Volume ⇄ Weight &amp; Bags</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'volume'}
            onClick={() => setActiveTab('volume')}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 700,
              borderBottom: activeTab === 'volume' ? '3px solid var(--accent)' : '3px solid transparent',
              color: activeTab === 'volume' ? 'var(--accent)' : 'var(--muted)',
              background: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Box size={16} />
            <span>Volume Converter (m³, yd³, ft³, Litres)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'weight'}
            onClick={() => setActiveTab('weight')}
            style={{
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 700,
              borderBottom: activeTab === 'weight' ? '3px solid var(--accent)' : '3px solid transparent',
              color: activeTab === 'weight' ? 'var(--accent)' : 'var(--muted)',
              background: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Scale size={16} />
            <span>Weight Converter (Tonnes, kg, lbs, Bulk Bags)</span>
          </button>
        </div>

        {/* TAB 1: VOLUME ⇄ WEIGHT CONVERTER */}
        {activeTab === 'density' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Input Column */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                  Conversion Settings
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setDensityInput('1');
                    setSelectedPresetId('c20_25');
                    setIsCustomDensity(false);
                    setDensityDirection('vol_to_wt');
                  }}
                  className="btn-ghost"
                  style={{
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                  }}
                  title="Reset to default values"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
              </div>

              {/* Conversion Direction Toggle */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>
                  Conversion Direction
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px',
                    background: 'var(--surface-sunken)',
                    padding: '4px',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setDensityDirection('vol_to_wt')}
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      background: densityDirection === 'vol_to_wt' ? 'var(--surface)' : 'transparent',
                      color: densityDirection === 'vol_to_wt' ? 'var(--accent)' : 'var(--muted)',
                      boxShadow: densityDirection === 'vol_to_wt' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    Volume (m³) → Weight (t)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDensityDirection('wt_to_vol')}
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      background: densityDirection === 'wt_to_vol' ? 'var(--surface)' : 'transparent',
                      color: densityDirection === 'wt_to_vol' ? 'var(--accent)' : 'var(--muted)',
                      boxShadow: densityDirection === 'wt_to_vol' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    Weight (t) → Volume (m³)
                  </button>
                </div>
              </div>

              {/* Input Value */}
              <div style={{ marginBottom: '18px' }}>
                <label
                  htmlFor="density-input-val"
                  style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}
                >
                  {densityDirection === 'vol_to_wt' ? 'Volume Quantity (m³)' : 'Weight Quantity (Metric Tonnes)'}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="density-input-val"
                    type="number"
                    step="any"
                    min="0"
                    value={densityInput}
                    onChange={(e) => setDensityInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '18px',
                      fontWeight: 700,
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface)',
                      color: 'var(--ink)',
                      boxSizing: 'border-box',
                    }}
                    placeholder="Enter value..."
                  />
                  <span
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--muted)',
                      pointerEvents: 'none',
                    }}
                  >
                    {densityDirection === 'vol_to_wt' ? 'm³' : 'Tonnes'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                  {densityDirection === 'vol_to_wt'
                    ? '1 m³ is standard ready-mix concrete unit.'
                    : '1 metric tonne = 1,000 kg (2,204.6 lbs).'}
                </div>
              </div>

              {/* Concrete Grade & Density Selector */}
              <div style={{ marginBottom: '18px' }}>
                <label
                  htmlFor="density-preset-select"
                  style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}
                >
                  Concrete Grade / Wet Density (BS 8500)
                </label>
                <select
                  id="density-preset-select"
                  disabled={isCustomDensity}
                  value={selectedPresetId}
                  onChange={(e) => setSelectedPresetId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                    background: isCustomDensity ? 'var(--surface-sunken)' : 'var(--surface)',
                    color: 'var(--ink)',
                    fontSize: '13.5px',
                    marginBottom: '8px',
                  }}
                >
                  {DENSITY_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name} ({preset.densityKgM3} kg/m³ / {(preset.densityKgM3 / 1000).toFixed(2)} t/m³)
                    </option>
                  ))}
                </select>

                {/* Custom Density Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <input
                    type="checkbox"
                    id="custom-density-check"
                    checked={isCustomDensity}
                    onChange={(e) => setIsCustomDensity(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="custom-density-check" style={{ fontSize: '13px', color: 'var(--ink)', cursor: 'pointer' }}>
                    Specify custom mix density
                  </label>
                </div>

                {isCustomDensity && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        min="500"
                        max="4000"
                        step="10"
                        value={customDensity}
                        onChange={(e) => setCustomDensity(parseFloat(e.target.value) || 2400)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--line)',
                          background: 'var(--surface)',
                          color: 'var(--ink)',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '12px',
                          color: 'var(--muted)',
                        }}
                      >
                        kg/m³
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Density Note */}
              <div
                style={{
                  background: 'var(--surface-sunken)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '12px',
                  lineHeight: '1.5',
                  color: 'var(--muted)',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>
                  Active Density: {currentDensityKgM3} kg/m³ ({(currentDensityKgM3 / 1000).toFixed(2)} Tonnes / m³)
                </div>
                <div>
                  Wet concrete is ~2.4x heavier than water due to dense aggregate and sand gradation according to BS EN 12620.
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Primary Key Metric Card */}
              {/* Copy Notification Toast */}
              {copiedKey?.startsWith('all-quote') && (
                <div
                  style={{
                    background: 'rgba(22, 163, 74, 0.12)',
                    border: '1px solid #16a34a',
                    color: '#15803d',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Trade Quote Report copied to clipboard! (Volume, Tonnes, Bags formatted for quotes, WhatsApp, and invoices)</span>
                </div>
              )}

              {/* PDF Export Notification Toast */}
              {pdfExported && (
                <div
                  style={{
                    background: 'rgba(22, 163, 74, 0.12)',
                    border: '1px solid #16a34a',
                    color: '#15803d',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>Official Trade Quote PDF generated &amp; downloaded! Ready to email to clients or ready-mix suppliers.</span>
                </div>
              )}

              {/* Primary Key Metric Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(217, 119, 6, 0.02) 100%)',
                  border: '2px solid var(--accent)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Calculated Wet Weight &amp; Trade Yield
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                      BS 8500 trade certified density (~2,400 kg/m³)
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {/* The prominent Copy All Results button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(generateDensityQuoteReport(), 'all-quote-tab1')}
                      style={{
                        background: copiedKey === 'all-quote-tab1' ? '#16a34a' : 'var(--accent)',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#ffffff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                        transition: 'all 0.15s ease',
                      }}
                      title="Copy Volume, Tonnes, and Bags formatted into structured trade quote report"
                    >
                      {copiedKey === 'all-quote-tab1' ? <Check size={14} /> : <ClipboardCheck size={14} />}
                      <span>{copiedKey === 'all-quote-tab1' ? 'Quote Report Copied!' : 'Copy All Results'}</span>
                    </button>

                    {/* PDF Export Button */}
                    <button
                      type="button"
                      onClick={handleExportDensityPdf}
                      style={{
                        background: pdfExported ? '#16a34a' : '#1d2127',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#ffffff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.14)',
                        transition: 'all 0.15s ease',
                      }}
                      title="Download official BS 8500 trade quote report as formatted PDF"
                    >
                      {pdfExported ? <Check size={14} /> : <FileDown size={14} />}
                      <span>{pdfExported ? 'PDF Downloaded!' : 'Export PDF'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          `${densityCalcResults.tonnes.toFixed(2)} Tonnes (${densityCalcResults.kg.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg)`,
                          'primary-weight'
                        )
                      }
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--line)',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--ink)',
                      }}
                      title="Copy weight value only"
                    >
                      {copiedKey === 'primary-weight' ? <Check size={13} color="green" /> : <Copy size={13} />}
                      <span>{copiedKey === 'primary-weight' ? 'Copied' : 'Copy Weight'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--line)',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--ink)',
                      }}
                      title="Print Calculation"
                    >
                      <Printer size={13} />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>
                    {densityCalcResults.tonnes.toFixed(2)}
                  </span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent)' }}>
                    Metric Tonnes
                  </span>
                </div>

                <div style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '16px' }}>
                  Equivalent to{' '}
                  <strong style={{ color: 'var(--ink)' }}>
                    {densityCalcResults.kg.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg
                  </strong>{' '}
                  or{' '}
                  <strong style={{ color: 'var(--ink)' }}>
                    {densityCalcResults.lbs.toLocaleString(undefined, { maximumFractionDigits: 0 })} lbs
                  </strong>
                </div>

                {/* Secondary Volume Equivalence */}
                <div
                  style={{
                    borderTop: '1px solid rgba(217, 119, 6, 0.2)',
                    paddingTop: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    fontSize: '13.5px',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--muted)' }}>Volume: </span>
                    <strong style={{ color: 'var(--ink)' }}>{densityCalcResults.m3.toFixed(3)} m³</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)' }}>Imperial: </span>
                    <strong style={{ color: 'var(--ink)' }}>{densityCalcResults.yd3.toFixed(2)} cu yd</strong> (
                    {densityCalcResults.ft3.toFixed(1)} cu ft)
                  </div>
                  <div>
                    <span style={{ color: 'var(--muted)' }}>Liquid Litres: </span>
                    <strong style={{ color: 'var(--ink)' }}>
                      {densityCalcResults.litres.toLocaleString(undefined, { maximumFractionDigits: 0 })} L
                    </strong>
                  </div>
                </div>
              </div>

              {/* Material & Trade Logistics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                }}
              >
                {/* 25kg Bags */}
                <div
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '10px',
                    padding: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                      25kg Pre-Mix Bags
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${Math.ceil(densityCalcResults.bags25)} bags (25kg)`, 'copy-bags25')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                      title="Copy bag count"
                    >
                      {copiedKey === 'copy-bags25' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                    </button>
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                    {Math.ceil(densityCalcResults.bags25)}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                    ~0.012 m³ yield per bag (Blue Circle/Hanson)
                  </div>
                </div>

                {/* Wheelbarrows */}
                <div
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '10px',
                    padding: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                      Wheelbarrow Loads
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${Math.ceil(densityCalcResults.wheelbarrows)} barrows`, 'copy-barrows')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                      title="Copy wheelbarrow count"
                    >
                      {copiedKey === 'copy-barrows' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                    </button>
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                    {Math.ceil(densityCalcResults.wheelbarrows)}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                    Standard 65–70L builder’s barrow (~160kg wet)
                  </div>
                </div>

                {/* Bulk Dumpy Bags */}
                <div
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '10px',
                    padding: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                      850kg Bulk Bags
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${densityCalcResults.bulkBags.toFixed(2)} bulk dumpy bags (850kg)`, 'copy-bulkbags')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                      title="Copy bulk bag count"
                    >
                      {copiedKey === 'copy-bulkbags' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                    </button>
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                    {densityCalcResults.bulkBags.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                    Merchant dumpy bags (ballast/sand)
                  </div>
                </div>

                {/* 6m³ Ready-Mix Truck % */}
                <div
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '10px',
                    padding: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                      6m³ Mixer Truck Load
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${densityCalcResults.truckCapacityPercent6m3.toFixed(0)}% mixer truck capacity (${densityCalcResults.m3.toFixed(2)} m³)`, 'copy-truck')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                      title="Copy truck load %"
                    >
                      {copiedKey === 'copy-truck' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                    </button>
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                    {densityCalcResults.truckCapacityPercent6m3.toFixed(0)}%
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>
                    {densityCalcResults.truckCapacityPercent6m3 <= 100
                      ? 'Single truck delivery'
                      : `${Math.ceil(densityCalcResults.m3 / 6)} separate mixer truck loads`}
                  </div>
                </div>
              </div>

              {/* Transport Advice Box */}
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div style={{ marginTop: '2px', color: 'var(--accent)' }}>
                  <Truck size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)', marginBottom: '2px' }}>
                    UK Transport &amp; Haulage Recommendation
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: '1.5' }}>
                    {densityCalcResults.transportRecommendation}
                  </div>
                </div>
              </div>

              {/* Structured Trade Quote Summary Card */}
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={16} color="var(--accent)" />
                    <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                      Trade Quote Report &amp; PDF Export (BS 8500 Verified)
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleExportDensityPdf}
                      style={{
                        background: pdfExported ? '#16a34a' : '#1d2127',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        transition: 'all 0.15s ease',
                      }}
                      title="Download official PDF report for trade quotes"
                    >
                      {pdfExported ? <Check size={13} /> : <FileDown size={13} />}
                      <span>{pdfExported ? 'PDF Downloaded!' : 'Download PDF Quote'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(generateDensityQuoteReport(), 'all-quote-tab1-box')}
                      style={{
                        background: copiedKey === 'all-quote-tab1-box' ? '#16a34a' : 'var(--accent)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      {copiedKey === 'all-quote-tab1-box' ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedKey === 'all-quote-tab1-box' ? 'Copied to Clipboard!' : 'Copy All Results'}</span>
                    </button>
                  </div>
                </div>

                {/* Optional Job / Client Reference Input for PDF */}
                <div
                  style={{
                    background: 'var(--surface-sunken)',
                    border: '1px solid var(--line)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap',
                    fontSize: '12px',
                  }}
                >
                  <label htmlFor="quote-project-ref-tab1" style={{ fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                    Job / Client Ref (Optional for PDF):
                  </label>
                  <input
                    id="quote-project-ref-tab1"
                    type="text"
                    placeholder="e.g. 14 Oak Road - Garage Slab"
                    value={quoteProjectRef}
                    onChange={(e) => setQuoteProjectRef(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: '200px',
                      padding: '5px 10px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      border: '1px solid var(--line)',
                      background: 'var(--surface)',
                      color: 'var(--ink)',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                    Will be stamped on the official PDF header
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
                  Formatted layout with Volume, Tonnes, 25kg Bags, Bulk Bags, and Mix density ready for WhatsApp messages, contractor quotes, or supplier orders.
                </div>
                <pre
                  style={{
                    background: 'var(--surface-sunken)',
                    border: '1px solid var(--line)',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '11.5px',
                    lineHeight: '1.45',
                    color: 'var(--ink)',
                    overflowX: 'auto',
                    margin: 0,
                    fontFamily: 'monospace',
                    whiteSpace: 'pre',
                  }}
                >
                  {generateDensityQuoteReport()}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STANDALONE VOLUME CONVERTER */}
        {activeTab === 'volume' && (
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
                Comprehensive Volume Unit Converter
              </h2>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted)' }}>
                Input any volumetric unit to instantly obtain synchronized conversions across metric, imperial, and UK jobsite units.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>
                  Enter Volume
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={volVal}
                  onChange={(e) => setVolVal(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '16px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>
                  Source Unit
                </label>
                <select
                  value={volUnit}
                  onChange={(e) => setVolUnit(e.target.value as VolumeUnit)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                  }}
                >
                  <option value="m3">Cubic Metres (m³)</option>
                  <option value="yd3">Cubic Yards (yd³ / cu yd)</option>
                  <option value="ft3">Cubic Feet (ft³ / cu ft)</option>
                  <option value="litres">Litres (L)</option>
                  <option value="bags25">25kg Pre-Mix Bags (0.012 m³ yield)</option>
                  <option value="wheelbarrows">Wheelbarrows (0.07 m³ / 70L)</option>
                </select>
              </div>
            </div>

            {/* Copy Notification Toast */}
            {copiedKey === 'all-quote-vol' && (
              <div
                style={{
                  background: 'rgba(22, 163, 74, 0.12)',
                  border: '1px solid #16a34a',
                  color: '#15803d',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={16} />
                <span>Volume Specification Report copied to clipboard! Ready to paste into trade quotes.</span>
              </div>
            )}

            {/* PDF Export Notification Toast */}
            {pdfExported && (
              <div
                style={{
                  background: 'rgba(22, 163, 74, 0.12)',
                  border: '1px solid #16a34a',
                  color: '#15803d',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={16} />
                <span>Volume Specification Trade Quote PDF generated &amp; downloaded!</span>
              </div>
            )}

            {/* Results Header with Copy All Results & Export PDF */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                Converted Volume Results &amp; Material Estimates
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleExportVolumePdf}
                  style={{
                    background: pdfExported ? '#16a34a' : '#1d2127',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.14)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Download volume conversions as formatted official trade quote PDF"
                >
                  {pdfExported ? <Check size={14} /> : <FileDown size={14} />}
                  <span>{pdfExported ? 'PDF Downloaded!' : 'Export PDF Quote'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(generateVolumeQuoteReport(), 'all-quote-vol')}
                  style={{
                    background: copiedKey === 'all-quote-vol' ? '#16a34a' : 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Copy all volume and material conversions formatted for trade quote"
                >
                  {copiedKey === 'all-quote-vol' ? <Check size={14} /> : <ClipboardCheck size={14} />}
                  <span>{copiedKey === 'all-quote-vol' ? 'Quote Report Copied!' : 'Copy All Results'}</span>
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
              }}
            >
              <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Cubic Metres (m³)</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${volumeUnitConversions.m3.toFixed(3)} m³`, 'v_m3')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                    title="Copy m³"
                  >
                    {copiedKey === 'v_m3' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                  {volumeUnitConversions.m3.toFixed(3)}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>UK standard measure</div>
              </div>

              <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Cubic Yards (yd³)</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${volumeUnitConversions.yd3.toFixed(3)} yd³`, 'v_yd3')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                    title="Copy yd³"
                  >
                    {copiedKey === 'v_yd3' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                  {volumeUnitConversions.yd3.toFixed(3)}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>1 m³ = 1.30795 yd³</div>
              </div>

              <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Cubic Feet (ft³)</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${volumeUnitConversions.ft3.toFixed(2)} ft³`, 'v_ft3')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                    title="Copy ft³"
                  >
                    {copiedKey === 'v_ft3' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                  {volumeUnitConversions.ft3.toFixed(2)}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>1 m³ = 35.3147 ft³</div>
              </div>

              <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Litres (L)</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${volumeUnitConversions.litres.toLocaleString(undefined, { maximumFractionDigits: 1 })} L`, 'v_litres')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                    title="Copy litres"
                  >
                    {copiedKey === 'v_litres' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                  {volumeUnitConversions.litres.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>1 m³ = 1,000 Litres</div>
              </div>

              <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>25kg Bags (~12L yield)</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${Math.ceil(volumeUnitConversions.bags25)} bags (25kg)`, 'v_bags25')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                    title="Copy bag count"
                  >
                    {copiedKey === 'v_bags25' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                  {Math.ceil(volumeUnitConversions.bags25)}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>Exact: {volumeUnitConversions.bags25.toFixed(1)} bags</div>
              </div>

              <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Estimated Wet Tonnes</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${volumeUnitConversions.estTonnes.toFixed(2)} Tonnes`, 'v_tonnes')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                    title="Copy tonnes"
                  >
                    {copiedKey === 'v_tonnes' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)', margin: '4px 0' }}>
                  {volumeUnitConversions.estTonnes.toFixed(2)} t
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>At standard 2.4 t/m³</div>
              </div>
            </div>

            {/* Structured Trade Quote Summary Card */}
            <div
              style={{
                marginTop: '20px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} color="var(--accent)" />
                  <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                    Volume Specification Quote Report &amp; PDF Export
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleExportVolumePdf}
                    style={{
                      background: pdfExported ? '#16a34a' : '#1d2127',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                      transition: 'all 0.15s ease',
                    }}
                    title="Download volume specification report as official trade quote PDF"
                  >
                    {pdfExported ? <Check size={13} /> : <FileDown size={13} />}
                    <span>{pdfExported ? 'PDF Downloaded!' : 'Download PDF Quote'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(generateVolumeQuoteReport(), 'all-quote-vol-card')}
                    style={{
                      background: copiedKey === 'all-quote-vol-card' ? '#16a34a' : 'var(--accent)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {copiedKey === 'all-quote-vol-card' ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedKey === 'all-quote-vol-card' ? 'Copied to Clipboard!' : 'Copy All Results'}</span>
                  </button>
                </div>
              </div>

              {/* Optional Job / Client Reference Input for PDF */}
              <div
                style={{
                  background: 'var(--surface-sunken)',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                  fontSize: '12px',
                }}
              >
                <label htmlFor="quote-project-ref-tab2" style={{ fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                  Job / Client Ref (Optional for PDF):
                </label>
                <input
                  id="quote-project-ref-tab2"
                  type="text"
                  placeholder="e.g. 14 Oak Road - Garage Slab"
                  value={quoteProjectRef}
                  onChange={(e) => setQuoteProjectRef(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '5px 10px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: '1px solid var(--line)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  Will be stamped on the official PDF header
                </span>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
                Formatted volume conversions with Cubic Metres, Yards, Litres, and Wet Tonnes ready for trade quotes.
              </div>
              <pre
                style={{
                  background: 'var(--surface-sunken)',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '11.5px',
                  lineHeight: '1.45',
                  color: 'var(--ink)',
                  overflowX: 'auto',
                  margin: 0,
                  fontFamily: 'monospace',
                  whiteSpace: 'pre',
                }}
              >
                {generateVolumeQuoteReport()}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: STANDALONE WEIGHT CONVERTER */}
        {activeTab === 'weight' && (
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--ink)' }}>
                Comprehensive Construction Weight Converter
              </h2>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--muted)' }}>
                Convert between metric tonnes, kilograms, imperial pounds, 850kg bulk bags, and 25kg pre-mix bags.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>
                  Enter Weight
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={wtVal}
                  onChange={(e) => setWtVal(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '16px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--ink)' }}>
                  Source Unit
                </label>
                <select
                  value={wtUnit}
                  onChange={(e) => setWtUnit(e.target.value as WeightUnit)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '14px',
                    borderRadius: '8px',
                    border: '1px solid var(--line)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                  }}
                >
                  <option value="tonnes">Metric Tonnes (t / 1,000 kg)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lbs">Pounds (lbs)</option>
                  <option value="bulk_bags">850kg Bulk Bags (Dumpy Bags)</option>
                  <option value="bags25">25kg Cement / Pre-Mix Bags</option>
                </select>
              </div>
            </div>

            {/* Copy Notification Toast */}
            {copiedKey === 'all-quote-wt' && (
              <div
                style={{
                  background: 'rgba(22, 163, 74, 0.12)',
                  border: '1px solid #16a34a',
                  color: '#15803d',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={16} />
                <span>Weight Specification Report copied to clipboard! Ready to paste into trade quotes.</span>
              </div>
            )}

            {/* PDF Export Notification Toast */}
            {pdfExported && (
              <div
                style={{
                  background: 'rgba(22, 163, 74, 0.12)',
                  border: '1px solid #16a34a',
                  color: '#15803d',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 size={16} />
                <span>Weight Specification Trade Quote PDF generated &amp; downloaded!</span>
              </div>
            )}

            {/* Results Header with Copy All Results & Export PDF */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--ink)' }}>
                Converted Weight Results &amp; Volume Estimates
              </h3>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleExportWeightPdf}
                  style={{
                    background: pdfExported ? '#16a34a' : '#1d2127',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.14)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Download weight conversions as formatted official trade quote PDF"
                >
                  {pdfExported ? <Check size={14} /> : <FileDown size={14} />}
                  <span>{pdfExported ? 'PDF Downloaded!' : 'Export PDF Quote'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(generateWeightQuoteReport(), 'all-quote-wt')}
                  style={{
                    background: copiedKey === 'all-quote-wt' ? '#16a34a' : 'var(--accent)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Copy all weight and volume conversions formatted for trade quote"
                >
                  {copiedKey === 'all-quote-wt' ? <Check size={14} /> : <ClipboardCheck size={14} />}
                  <span>{copiedKey === 'all-quote-wt' ? 'Quote Report Copied!' : 'Copy All Results'}</span>
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
              }}
            >
              <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Metric Tonnes</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${weightUnitConversions.tonnes.toFixed(3)} Tonnes`, 'w_tonnes')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                    title="Copy tonnes"
                  >
                    {copiedKey === 'w_tonnes' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                  {weightUnitConversions.tonnes.toFixed(3)}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>1 t = 1,000 kg</div>
              </div>

              <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Kilograms (kg)</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${weightUnitConversions.kg.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg`, 'w_kg')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                    title="Copy kg"
                  >
                    {copiedKey === 'w_kg' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                  {weightUnitConversions.kg.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>Metric SI weight</div>
              </div>

              <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Imperial Pounds (lbs)</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${weightUnitConversions.lbs.toLocaleString(undefined, { maximumFractionDigits: 0 })} lbs`, 'w_lbs')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                    title="Copy lbs"
                  >
                    {copiedKey === 'w_lbs' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                  {weightUnitConversions.lbs.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>1 kg = 2.20462 lbs</div>
              </div>

              <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>850kg Bulk Bags</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${weightUnitConversions.bulkBags.toFixed(2)} bulk dumpy bags`, 'w_bulkbags')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                    title="Copy bulk bag count"
                  >
                    {copiedKey === 'w_bulkbags' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                  {weightUnitConversions.bulkBags.toFixed(2)}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>UK builder dumpy bag</div>
              </div>

              <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>25kg Bags</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${Math.ceil(weightUnitConversions.bags25)} bags (25kg)`, 'w_bags25')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                    title="Copy 25kg bag count"
                  >
                    {copiedKey === 'w_bags25' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--ink)', margin: '4px 0' }}>
                  {Math.ceil(weightUnitConversions.bags25)}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>40 bags = 1 Tonne</div>
              </div>

              <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>Equivalent Concrete Volume</div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${weightUnitConversions.estM3.toFixed(3)} m³`, 'w_m3')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--muted)' }}
                    title="Copy volume equivalent"
                  >
                    {copiedKey === 'w_m3' ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)', margin: '4px 0' }}>
                  {weightUnitConversions.estM3.toFixed(3)} m³
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--muted)' }}>At 2,400 kg/m³ density</div>
              </div>
            </div>

            {/* Structured Trade Quote Summary Card */}
            <div
              style={{
                marginTop: '20px',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} color="var(--accent)" />
                  <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)' }}>
                    Weight Specification Quote Report &amp; PDF Export
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleExportWeightPdf}
                    style={{
                      background: pdfExported ? '#16a34a' : '#1d2127',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                      transition: 'all 0.15s ease',
                    }}
                    title="Download weight specification report as official trade quote PDF"
                  >
                    {pdfExported ? <Check size={13} /> : <FileDown size={13} />}
                    <span>{pdfExported ? 'PDF Downloaded!' : 'Download PDF Quote'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(generateWeightQuoteReport(), 'all-quote-wt-card')}
                    style={{
                      background: copiedKey === 'all-quote-wt-card' ? '#16a34a' : 'var(--accent)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    {copiedKey === 'all-quote-wt-card' ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedKey === 'all-quote-wt-card' ? 'Copied to Clipboard!' : 'Copy All Results'}</span>
                  </button>
                </div>
              </div>

              {/* Optional Job / Client Reference Input for PDF */}
              <div
                style={{
                  background: 'var(--surface-sunken)',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap',
                  fontSize: '12px',
                }}
              >
                <label htmlFor="quote-project-ref-tab3" style={{ fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                  Job / Client Ref (Optional for PDF):
                </label>
                <input
                  id="quote-project-ref-tab3"
                  type="text"
                  placeholder="e.g. 14 Oak Road - Garage Slab"
                  value={quoteProjectRef}
                  onChange={(e) => setQuoteProjectRef(e.target.value)}
                  style={{
                    flex: 1,
                    minWidth: '200px',
                    padding: '5px 10px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    border: '1px solid var(--line)',
                    background: 'var(--surface)',
                    color: 'var(--ink)',
                  }}
                />
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  Will be stamped on the official PDF header
                </span>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
                Formatted weight conversions with Tonnes, Kilograms, Pounds, Bulk Bags, and Equivalent Volume ready for trade quotes.
              </div>
              <pre
                style={{
                  background: 'var(--surface-sunken)',
                  border: '1px solid var(--line)',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '11.5px',
                  lineHeight: '1.45',
                  color: 'var(--ink)',
                  overflowX: 'auto',
                  margin: 0,
                  fontFamily: 'monospace',
                  whiteSpace: 'pre',
                }}
              >
                {generateWeightQuoteReport()}
              </pre>
            </div>
          </div>
        )}

        {/* SECTION: BS 8500 CHEAT SHEET & REFERENCE TABLES */}
        <div style={{ marginTop: '36px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', marginBottom: '14px' }}>
            UK Concrete Volume to Weight Cheat Sheet (BS 8500 Standard Density)
          </h2>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '10px',
              overflowX: 'auto',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--surface-sunken)', borderBottom: '2px solid var(--line)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Volume (m³)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Cubic Yards (yd³)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Wet Weight (Tonnes)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Wet Weight (kg)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>25kg Bags (0.012m³ yield)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Wheelbarrows (65L)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>6m³ Truck %</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { m3: 0.25, yd3: 0.33, t: 0.6, kg: 600, bags: 21, barrows: 4, truck: '4%' },
                  { m3: 0.5, yd3: 0.65, t: 1.2, kg: 1200, bags: 42, barrows: 8, truck: '8%' },
                  { m3: 0.75, yd3: 0.98, t: 1.8, kg: 1800, bags: 63, barrows: 11, truck: '13%' },
                  { m3: 1.0, yd3: 1.31, t: 2.4, kg: 2400, bags: 84, barrows: 15, truck: '17%' },
                  { m3: 1.5, yd3: 1.96, t: 3.6, kg: 3600, bags: 125, barrows: 22, truck: '25%' },
                  { m3: 2.0, yd3: 2.62, t: 4.8, kg: 4800, bags: 167, barrows: 29, truck: '33%' },
                  { m3: 3.0, yd3: 3.92, t: 7.2, kg: 7200, bags: 250, barrows: 43, truck: '50%' },
                  { m3: 4.0, yd3: 5.23, t: 9.6, kg: 9600, bags: 334, barrows: 58, truck: '67%' },
                  { m3: 5.0, yd3: 6.54, t: 12.0, kg: 12000, bags: 417, barrows: 72, truck: '83%' },
                  { m3: 6.0, yd3: 7.85, t: 14.4, kg: 14400, bags: 500, barrows: 86, truck: '100% (Full)' },
                  { m3: 8.0, yd3: 10.46, t: 19.2, kg: 19200, bags: 667, barrows: 115, truck: '133% (8-Wheeler)' },
                ].map((row, idx) => (
                  <tr
                    key={row.m3}
                    style={{
                      borderBottom: '1px solid var(--line)',
                      background: idx % 2 === 0 ? 'transparent' : 'var(--surface-sunken)',
                    }}
                  >
                    <td style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--accent)' }}>{row.m3.toFixed(2)} m³</td>
                    <td style={{ padding: '10px 16px' }}>{row.yd3.toFixed(2)} yd³</td>
                    <td style={{ padding: '10px 16px', fontWeight: 700 }}>{row.t.toFixed(1)} t</td>
                    <td style={{ padding: '10px 16px' }}>{row.kg.toLocaleString()} kg</td>
                    <td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.bags} bags</td>
                    <td style={{ padding: '10px 16px' }}>{row.barrows} barrows</td>
                    <td style={{ padding: '10px 16px', color: 'var(--muted)' }}>{row.truck}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION: CONCRETE GRADES & DENSITY MATRIX */}
        <div style={{ marginTop: '36px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', marginBottom: '14px' }}>
            UK Concrete Grades &amp; Wet Density Matrix (BS EN 206 / BS 8500)
          </h2>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '10px',
              overflowX: 'auto',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--surface-sunken)', borderBottom: '2px solid var(--line)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>BS Grade</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Designated Mix</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Wet Density (kg/m³)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Weight / m³ (Tonnes)</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Typical UK Application</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    grade: 'C10 / C15',
                    designated: 'GEN 1 / GEN 2',
                    density: '2,300 – 2,360 kg/m³',
                    tonnes: '2.30 – 2.36 t',
                    app: 'Drainage blinding, kerb backing, unreinforced cavity wall trench fill',
                  },
                  {
                    grade: 'C20 / C25',
                    designated: 'GEN 3 / RC25',
                    density: '2,380 – 2,420 kg/m³',
                    tonnes: '2.40 t (Standard)',
                    app: 'Domestic shed bases, garage floors, patio sub-bases, strip foundations',
                  },
                  {
                    grade: 'C30 / C35',
                    designated: 'PAV 1 / RC30',
                    density: '2,400 – 2,440 kg/m³',
                    tonnes: '2.42 t',
                    app: 'Car driveways, external hardstandings subject to frost/de-icing salts',
                  },
                  {
                    grade: 'C40 / C50',
                    designated: 'PAV 2 / RC40',
                    density: '2,450 – 2,520 kg/m³',
                    tonnes: '2.48 – 2.52 t',
                    app: 'Heavy goods vehicle yards, agricultural silage pits, commercial structural frames',
                  },
                  {
                    grade: 'Lightweight',
                    designated: 'LC20 to LC35',
                    density: '1,750 – 1,950 kg/m³',
                    tonnes: '1.75 – 1.95 t',
                    app: 'Suspended composite floors, precast lightweight blocks, high-rise screeds',
                  },
                ].map((row, idx) => (
                  <tr
                    key={row.grade}
                    style={{
                      borderBottom: '1px solid var(--line)',
                      background: idx % 2 === 0 ? 'transparent' : 'var(--surface-sunken)',
                    }}
                  >
                    <td style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--ink)' }}>{row.grade}</td>
                    <td style={{ padding: '10px 16px', fontWeight: 600 }}>{row.designated}</td>
                    <td style={{ padding: '10px 16px' }}>{row.density}</td>
                    <td style={{ padding: '10px 16px', fontWeight: 700, color: 'var(--accent)' }}>{row.tonnes}</td>
                    <td style={{ padding: '10px 16px', color: 'var(--muted)' }}>{row.app}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION: DETAILED EXPLANATION & CALCULATION METHODOLOGY */}
        <div
          style={{
            marginTop: '36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '10px',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginTop: 0, marginBottom: '10px' }}>
              How to Convert Cubic Metres (m³) to Tonnes
            </h3>
            <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'var(--muted)', margin: '0 0 12px 0' }}>
              To convert volume in cubic metres to weight in metric tonnes, multiply the volume by the wet density of the concrete mix:
            </p>
            <div
              style={{
                background: 'var(--surface-sunken)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--accent)',
                marginBottom: '12px',
              }}
            >
              Weight (Tonnes) = Volume (m³) × 2.40
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--muted)', margin: 0 }}>
              <strong>Worked Example:</strong> If your garden shed base measures 3.0m × 2.5m × 0.1m, your volume is <strong>0.75 m³</strong>.
              Multiplying 0.75 m³ by 2.4 tonnes/m³ yields exactly <strong>1.80 tonnes</strong> (1,800 kg) of wet concrete.
            </p>
          </div>

          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              borderRadius: '10px',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', marginTop: 0, marginBottom: '10px' }}>
              Wet Concrete vs Dry Cured Concrete Weight
            </h3>
            <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'var(--muted)', margin: '0 0 12px 0' }}>
              Why is wet concrete heavier than cured dry concrete? During pouring, freshly mixed concrete contains free batch water
              required for workability and placing (typically 160–190 litres per m³).
            </p>
            <ul style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--muted)', paddingLeft: '18px', margin: 0 }}>
              <li style={{ marginBottom: '6px' }}>
                <strong>Fresh Wet Concrete:</strong> ~2,400 kg/m³ (2.4 t/m³) – used for shuttering design, lorry axle limits, and pump pressures.
              </li>
              <li style={{ marginBottom: '6px' }}>
                <strong>Cured Dry Concrete:</strong> ~2,300 to 2,350 kg/m³ (~3% to 4% weight loss over 28 days as excess unhydrated water evaporates).
              </li>
              <li>
                <strong>Reinforced Concrete (RC):</strong> ~2,450 to 2,500 kg/m³ due to high-density steel rebar meshes (A142, A193, A252).
              </li>
            </ul>
          </div>
        </div>

        {/* SECTION: FREQUENTLY ASKED QUESTIONS */}
        <div style={{ marginTop: '36px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--ink)', marginBottom: '16px' }}>
            Frequently Asked Questions: Concrete Weight &amp; Volume
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                q: 'How much does 1 cubic metre (1m³) of concrete weigh in the UK?',
                a: 'Standard wet ready-mix concrete in the UK weighs approximately 2,400 kg (2.4 metric tonnes) per cubic metre (m³). Lightweight aggregate mixes weigh around 1,850 kg/m³, while reinforced civil concrete can reach up to 2,500 kg/m³.',
              },
              {
                q: 'How many 25kg bags of concrete make 1 cubic metre (1m³)?',
                a: 'It takes approximately 83 to 84 pre-mixed 25kg bags (such as Blue Circle, Hanson, or Bostik) to yield 1 cubic metre of compacted concrete. Each 25kg bag produces approximately 0.012 m³ (12 litres) of wet concrete after adding water.',
              },
              {
                q: 'How many 25kg bags of concrete make 1 tonne?',
                a: 'Exactly 40 bags of 25kg make 1 metric tonne (40 × 25kg = 1,000kg). In terms of volume, 1 tonne of dry pre-mix bags produces approximately 0.48 m³ of compacted concrete.',
              },
              {
                q: 'How many wheelbarrows are in 1m³ of wet concrete?',
                a: 'A standard UK builder’s wheelbarrow safely carries between 65 and 70 litres of wet concrete without spilling over uneven terrain. Therefore, 1 cubic metre (1,000 litres) requires roughly 14 to 16 full wheelbarrow loads. At 2.4 t/m³, each wheelbarrow weighs approximately 155–165 kg.',
              },
              {
                q: 'What is the maximum weight a UK ready-mix concrete lorry can carry?',
                a: 'A standard 6-wheeler concrete transit mixer carries up to 6.0 m³ (approx. 14.4 tonnes of wet concrete). A larger 8-wheeler transit mixer can carry up to 8.0 m³ (approx. 19.2 tonnes). Both must comply with UK Department for Transport maximum gross vehicle weights (GVW: 26 tonnes for 3-axle, 32 tonnes for 4-axle).',
              },
              {
                q: 'Can I collect 1 tonne of concrete in my car or domestic trailer?',
                a: 'Standard unbraked car trailers in the UK have a strict maximum gross weight limit of 750 kg (meaning a maximum payload of ~500–550 kg). Transporting 1 tonne (1,000 kg) requires a braked commercial twin-axle plant trailer or a 3.5t drop-side transit van.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  padding: '18px 20px',
                }}
              >
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--ink)',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <HelpCircle size={17} color="var(--accent)" />
                  <span>{faq.q}</span>
                </div>
                <div style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'var(--muted)' }}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION: CROSS-NAVIGATION & RELATED TOOLS */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ink)', marginBottom: '14px' }}>
            Related UK Concrete Calculators &amp; Guides
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            <Link
              href="/"
              style={{
                textDecoration: 'none',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>
                  Concrete Calculator (Home)
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: '1.4' }}>
                  Calculate m³ volume, 25kg bags, and ballast sand ratios for slabs, footings, and steps.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', fontWeight: 600, color: 'var(--accent)', marginTop: '12px' }}>
                <span>Calculate volume</span>
                <ArrowRight size={13} />
              </div>
            </Link>

            <Link
              href="/concrete-block-calculator"
              style={{
                textDecoration: 'none',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>
                  Concrete Block Calculator
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: '1.4' }}>
                  Calculate standard 440×215×100mm dense &amp; lightweight blocks and mortar sand bags.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', fontWeight: 600, color: 'var(--accent)', marginTop: '12px' }}>
                <span>Calculate blocks</span>
                <ArrowRight size={13} />
              </div>
            </Link>

            <Link
              href="/postcrete-calculator"
              style={{
                textDecoration: 'none',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>
                  Postcrete &amp; Fence Post Calculator
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: '1.4' }}>
                  Calculate 20kg Postcrete bags for 75mm and 100mm timber &amp; concrete fence posts.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', fontWeight: 600, color: 'var(--accent)', marginTop: '12px' }}>
                <span>Calculate Postcrete</span>
                <ArrowRight size={13} />
              </div>
            </Link>

            <Link
              href="/how-many-bags-of-concrete-per-cubic-metre"
              style={{
                textDecoration: 'none',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)', marginBottom: '4px' }}>
                  Bags per m³ Worked Guide
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: '1.4' }}>
                  Detailed step-by-step breakdown: why exactly 83.3 bags make 1 cubic metre with 10% waste.
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', fontWeight: 600, color: 'var(--accent)', marginTop: '12px' }}>
                <span>Read guide</span>
                <ArrowRight size={13} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
