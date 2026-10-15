import { ConcreteShape, CalculationResult, UnitSystem } from '../types';

interface ExportCsvParams {
  shape: ConcreteShape;
  result: CalculationResult;
  unitSystem: UnitSystem;
  dimensions: {
    length?: string;
    width?: string;
    depth?: string;
    diameter?: string;
    stepCount?: string;
    stepWidth?: string;
    stepRise?: string;
    stepGoing?: string;
    waste: string;
    mixRatio: string;
  };
}

export function exportEstimateCsv({
  shape,
  result,
  unitSystem,
  dimensions,
}: ExportCsvParams): void {
  const shapeNames: Record<ConcreteShape, string> = {
    slab: 'Slab / Base',
    footing: 'Strip / Trench Footing',
    column: 'Post Hole / Column',
    circle: 'Round Slab',
    tube: 'Circular Slab or Tube',
    curb: 'Curb and Gutter Barrier',
    steps: 'Solid Poured Steps',
  };

  const isImp = unitSystem === 'imperial';
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeFormatted = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const escapeCsv = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const s = String(val);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return `"${s}"`;
  };

  const rows: string[][] = [
    ['ConcreteCalc.UK - Concrete Estimate & Materials Summary', '', ''],
    ['Generated Date', `${dateFormatted} ${timeFormatted}`, ''],
    ['Input Units', isImp ? 'Imperial (feet, inches)' : 'Metric (metres, mm)', ''],
    [],
    ['1. PROJECT SPECIFICATIONS', '', ''],
    ['Parameter', 'Input Value', 'Unit / Details'],
    ['Structure Type', shapeNames[shape] || shape, ''],
  ];

  if (shape === 'slab' || shape === 'footing') {
    rows.push(
      ['Length', dimensions.length || '', isImp ? 'feet (ft)' : 'metres (m)'],
      ['Width', dimensions.width || '', isImp ? 'feet (ft)' : 'metres (m)'],
      [
        shape === 'footing' ? 'Depth' : 'Thickness',
        dimensions.depth || '',
        isImp ? 'inches (in)' : 'millimetres (mm)',
      ]
    );
  } else if (shape === 'column') {
    rows.push(
      ['Diameter', dimensions.diameter || '', isImp ? 'inches (in)' : 'metres (m)'],
      ['Depth', dimensions.depth || '', isImp ? 'inches (in)' : 'millimetres (mm)']
    );
  } else if (shape === 'circle') {
    rows.push(
      ['Diameter', dimensions.diameter || '', isImp ? 'feet (ft)' : 'metres (m)'],
      ['Thickness', dimensions.depth || '', isImp ? 'inches (in)' : 'millimetres (mm)']
    );
  } else if (shape === 'steps') {
    rows.push(
      ['Number of Steps', dimensions.stepCount || '', 'steps'],
      ['Step Width', dimensions.stepWidth || '', isImp ? 'feet (ft)' : 'metres (m)'],
      ['Step Rise', dimensions.stepRise || '', isImp ? 'inches (in)' : 'millimetres (mm)'],
      ['Step Going', dimensions.stepGoing || '', isImp ? 'inches (in)' : 'millimetres (mm)']
    );
  }

  rows.push(
    ['Waste Allowance', `${result.wastePercent}%`, result.wastePercent === 10 ? 'Recommended' : 'Custom'],
    ['Mix Specification Ratio', result.mixRatio, result.mixRatioLabel || '']
  );

  rows.push(
    [],
    ['2. VOLUME & PHYSICAL WEIGHT', '', ''],
    ['Calculation Metric', 'Value', 'Unit'],
    ['Net Concrete Volume', result.netVolume.toFixed(3), 'm³ (cubic metres)'],
    ['Total Order Volume (with waste)', result.totalVolume.toFixed(2), 'm³ (cubic metres)'],
    ['Total Order Volume (Imperial)', (result.cubicYards || result.totalVolume * 1.30795).toFixed(2), 'yd³ (cubic yards)'],
    ['Estimated Wet Weight', result.wetWeightTonnes.toFixed(2), 'Tonnes (~2.4t/m³ density)'],
    ['Estimated Wet Weight (kg)', Math.round(result.wetWeightTonnes * 1000).toString(), 'Kilograms (kg)'],
    [],
    ['3. MATERIALS BREAKDOWN & PACKAGED DRY MIX', '', ''],
    ['Product / Supply Method', 'Quantity Needed', 'Estimated UK Cost Range', 'Supplier Notes'],
    [
      '25kg Pre-Mix Bags',
      `${result.bags25kg} bags`,
      `£${Math.round(result.bgCostLow)} - £${Math.round(result.bgCostHigh)}`,
      `Based on ${result.mixRatio} mix ratio yield (£5.50 - £9.00/bag)`,
    ],
    [
      '20kg Pre-Mix Bags',
      `${result.bags20kg} bags`,
      '-',
      'Alternative bag size',
    ],
    [
      'Ready-Mix Delivery Lorry',
      `${result.readyMixOrder.toFixed(2)} m³`,
      `£${Math.round(result.rmCostLow)} - £${Math.round(result.rmCostHigh)}`,
      'Rounded to 0.25 m³ increments (+ delivery/short-load)',
    ],
    [],
    ['4. ON-SITE MIXING - BULK RAW MATERIALS', '', ''],
    ['Material Component', 'Quantity Required', 'Standard UK Merchant Unit Equivalent', ''],
    [
      'Pure Cement (25kg Bags)',
      `${result.cement25kgBags} bags`,
      'Standard Portland Cement bags',
      '',
    ],
    [
      'Sharp Sand',
      `${result.sandTonnes.toFixed(2)} tonnes`,
      `~${Math.ceil(result.sandTonnes / 0.85)} bulk bag(s) (850kg jumbo bag)`,
      '',
    ],
    [
      'Coarse Aggregate / Gravel',
      `${result.gravelTonnes.toFixed(2)} tonnes`,
      `~${Math.ceil(result.gravelTonnes / 0.85)} bulk bag(s) (850kg jumbo bag)`,
      '',
    ],
    [],
    ['5. RECOMMENDATION & ADVISORY', '', ''],
    ['Best Value Option', result.recommendation === 'bags' ? 'Bagged Mix' : result.recommendation === 'ready' ? 'Ready-Mix Delivery Lorry' : 'Bags or Mini-Mix', ''],
    ['Advisory Note', result.recommendationNote, 'Small loads may carry short-load fee'],
    ['Disclaimer', 'Estimates only. Ground conditions and mix brands affect real requirements. Always consult structural engineers or suppliers for structural work.', '']
  );

  const csvContent = rows
    .map((row) => row.map(escapeCsv).join(','))
    .join('\r\n');

  // Prefix UTF-8 BOM so Excel opens special characters (m³, £, etc.) seamlessly
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });

  const filename = `concrete-estimate-${shape}-${Date.now().toString().slice(-4)}.csv`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
