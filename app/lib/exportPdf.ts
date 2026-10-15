import { jsPDF } from 'jspdf';
import { ConcreteShape, CalculationResult } from '../types';

interface ExportPdfParams {
  shape: ConcreteShape;
  result: CalculationResult;
  unitSystem?: 'metric' | 'imperial';
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
    mix: string;
  };
}

export function exportEstimatePdf({ shape, result, unitSystem = 'metric', dimensions }: ExportPdfParams): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(29, 33, 39); // #1d2127
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line
  doc.setFillColor(91, 54, 245); // #5b36f5
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ConcreteCalc', margin, 18);
  doc.setTextColor(91, 54, 245);
  doc.text('.UK', margin + 41, 18);

  // Subtitle / Date
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  doc.setTextColor(170, 178, 188);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Project Estimate & Materials Breakdown', pageWidth - margin, 14, { align: 'right' });
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, 20, { align: 'right' });

  let y = 38;

  // Section 1: Project Overview
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);
  doc.text('1. Project Dimensions & Specifications', margin, y);
  y += 6;

  // Dimension Box
  doc.setFillColor(247, 246, 242);
  doc.setDrawColor(216, 214, 207);
  doc.roundedRect(margin, y, contentWidth, 36, 2, 2, 'FD');

  const shapeNames: Record<ConcreteShape, string> = {
    slab: 'Slab / Base',
    footing: 'Strip / Trench Footing',
    column: 'Post Hole / Column',
    circle: 'Round Slab',
    tube: 'Circular Slab or Tube',
    curb: 'Curb and Gutter Barrier',
    steps: 'Solid Poured Steps',
  };

  const mixNames: Record<string, string> = {
    '2.4': dimensions.mix === '2.4' ? 'C20 (Paths, bases & light domestic)' : 'Standard Mix',
  };

  doc.setFontSize(9.5);
  doc.setTextColor(93, 100, 109);
  doc.setFont('helvetica', 'normal');

  // Column 1
  doc.text('Project Shape:', margin + 6, y + 8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);
  doc.text(shapeNames[shape] || shape, margin + 42, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(93, 100, 109);
  doc.text('Input Measurements:', margin + 6, y + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);

  const isImp = unitSystem === 'imperial';
  let measureText = '';
  if (shape === 'slab' || shape === 'footing') {
    measureText = isImp
      ? `${dimensions.length} ft (L) × ${dimensions.width} ft (W) × ${dimensions.depth} in (${shape === 'footing' ? 'depth' : 'thickness'})`
      : `${dimensions.length}m (L) × ${dimensions.width}m (W) × ${dimensions.depth}mm (${shape === 'footing' ? 'depth' : 'thickness'})`;
  } else if (shape === 'column') {
    measureText = isImp
      ? `${dimensions.diameter} in (dia) × ${dimensions.depth} in (depth)`
      : `${dimensions.diameter}m (dia) × ${dimensions.depth}mm (depth)`;
  } else if (shape === 'circle') {
    measureText = isImp
      ? `${dimensions.diameter} ft (dia) × ${dimensions.depth} in (thickness)`
      : `${dimensions.diameter}m (dia) × ${dimensions.depth}mm (thickness)`;
  } else if (shape === 'steps') {
    measureText = isImp
      ? `${dimensions.stepCount} steps · ${dimensions.stepWidth} ft wide · ${dimensions.stepRise} in rise · ${dimensions.stepGoing} in going`
      : `${dimensions.stepCount} steps · ${dimensions.stepWidth}m wide · ${dimensions.stepRise}mm rise · ${dimensions.stepGoing}mm going`;
  }
  doc.text(measureText, margin + 42, y + 16);

  // Column 2 (Waste & Mix)
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(93, 100, 109);
  doc.text('Waste Allowance:', margin + 6, y + 24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);
  doc.text(`${result.wastePercent}% (${result.wastePercent === 10 ? 'Standard Recommended' : 'Custom'})`, margin + 42, y + 24);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(93, 100, 109);
  doc.text('Concrete Mix Grade:', margin + 6, y + 31);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);
  doc.text(result.mixRatioLabel || '1:2:4 (Standard / C20)', margin + 42, y + 31);

  y += 44;

  // Section 2: Calculated Volume Highlight
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);
  doc.text('2. Volume & Wet Weight', margin, y);
  y += 6;

  // 3 Metric Cards in a row
  const colW = (contentWidth - 8) / 3;

  // Card 1: Total Order Volume
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, colW, 26, 2, 2, 'FD');
  doc.setFillColor(91, 54, 245);
  doc.rect(margin, y, colW, 2.5, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(93, 100, 109);
  doc.text('TOTAL VOLUME (INC. WASTE)', margin + 4, y + 8);
  doc.setFontSize(isImp ? 13 : 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);
  const volDisplay = isImp && result.cubicYards
    ? `${result.totalVolume.toFixed(2)} m³ (${result.cubicYards.toFixed(2)} yd³)`
    : `${result.totalVolume.toFixed(2)} m³`;
  doc.text(volDisplay, margin + 4, y + 18);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(93, 100, 109);
  doc.text(`Net volume: ${result.netVolume.toFixed(3)} m³`, margin + 4, y + 23);

  // Card 2: Wet Weight
  const x2 = margin + colW + 4;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x2, y, colW, 26, 2, 2, 'FD');
  doc.setFillColor(47, 53, 62);
  doc.rect(x2, y, colW, 2.5, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(93, 100, 109);
  doc.text('ESTIMATED WET WEIGHT', x2 + 4, y + 8);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);
  doc.text(`${result.wetWeightTonnes.toFixed(1)} tonnes`, x2 + 4, y + 18);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(93, 100, 109);
  doc.text('Based on ~2.4t / m³ density', x2 + 4, y + 23);

  // Card 3: Recommended Source
  const x3 = margin + (colW + 4) * 2;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x3, y, colW, 26, 2, 2, 'FD');
  doc.setFillColor(31, 107, 58);
  doc.rect(x3, y, colW, 2.5, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(93, 100, 109);
  doc.text('BEST VALUE OPTION', x3 + 4, y + 8);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 107, 58);
  const recTitle =
    result.recommendation === 'bags'
      ? 'Bagged Mix'
      : result.recommendation === 'ready'
      ? 'Ready-Mix Lorry'
      : 'Bags or Mini-Mix';
  doc.text(recTitle, x3 + 4, y + 18);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(93, 100, 109);
  doc.text('Based on volume & effort', x3 + 4, y + 23);

  y += 34;

  // Section 3: Materials & Supplier Costs
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);
  doc.text('3. Materials Comparison (Bagged vs Ready-Mix)', margin, y);
  y += 6;

  // Comparison Table Header
  doc.setFillColor(247, 246, 242);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setDrawColor(216, 214, 207);
  doc.line(margin, y + 8, margin + contentWidth, y + 8);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(93, 100, 109);
  doc.text('OPTION', margin + 4, y + 5.5);
  doc.text('QUANTITY NEEDED', margin + 65, y + 5.5);
  doc.text('ESTIMATED UK COST RANGE', pageWidth - margin - 4, y + 5.5, { align: 'right' });

  y += 8;

  // Row 1: 25kg Bags
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, 12, 'F');
  doc.setDrawColor(216, 214, 207);
  doc.line(margin, y + 12, margin + contentWidth, y + 12);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);
  doc.text('25kg Maxi Bags (Dry Mix)', margin + 4, y + 5.5);
  if (result.recommendation === 'bags') {
    doc.setFillColor(91, 54, 245);
    doc.roundedRect(margin + 48, y + 2.5, 14, 4, 1, 1, 'F');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text('BEST VALUE', margin + 49, y + 5.3);
  }
  doc.setFontSize(9.5);
  doc.setTextColor(29, 33, 39);
  doc.text(`${result.bags25kg.toLocaleString('en-GB')} bags`, margin + 65, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(93, 100, 109);
  doc.text('(~0.012 m³ yield / bag)', margin + 65, y + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(29, 33, 39);
  doc.text(
    `£${Math.round(result.bgCostLow).toLocaleString('en-GB')} – £${Math.round(result.bgCostHigh).toLocaleString('en-GB')}`,
    pageWidth - margin - 4,
    y + 5.5,
    { align: 'right' }
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(93, 100, 109);
  doc.text('(£5.50 – £9.00 / bag)', pageWidth - margin - 4, y + 9.5, { align: 'right' });

  y += 12;

  // Row 2: 20kg Bags
  doc.setFillColor(250, 250, 248);
  doc.rect(margin, y, contentWidth, 10, 'F');
  doc.setDrawColor(216, 214, 207);
  doc.line(margin, y + 10, margin + contentWidth, y + 10);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);
  doc.text('20kg Bags (DIY Mix)', margin + 4, y + 6);
  doc.text(`${result.bags20kg.toLocaleString('en-GB')} bags`, margin + 65, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(93, 100, 109);
  doc.text('Alternative bag size (~0.0095 m³ yield)', pageWidth - margin - 4, y + 6, { align: 'right' });

  y += 10;

  // Row 3: Ready-Mix Truck Order
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, 12, 'F');
  doc.setDrawColor(216, 214, 207);
  doc.line(margin, y + 12, margin + contentWidth, y + 12);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);
  doc.text('Ready-Mix Delivered Lorry', margin + 4, y + 5.5);
  if (result.recommendation === 'ready') {
    doc.setFillColor(91, 54, 245);
    doc.roundedRect(margin + 48, y + 2.5, 14, 4, 1, 1, 'F');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text('BEST VALUE', margin + 49, y + 5.3);
  }
  doc.setFontSize(9.5);
  doc.setTextColor(29, 33, 39);
  doc.text(`${result.readyMixOrder.toFixed(2)} m³ order`, margin + 65, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(93, 100, 109);
  doc.text('(Rounded to nearest 0.25 m³)', margin + 65, y + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(29, 33, 39);
  doc.text(
    `£${Math.round(result.rmCostLow).toLocaleString('en-GB')} – £${Math.round(result.rmCostHigh).toLocaleString('en-GB')}`,
    pageWidth - margin - 4,
    y + 5.5,
    { align: 'right' }
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(93, 100, 109);
  doc.text('+ delivery / short-load if applicable', pageWidth - margin - 4, y + 9.5, { align: 'right' });

  y += 20;

  // Recommendation Callout Box
  doc.setFillColor(247, 246, 252);
  doc.setDrawColor(91, 54, 245);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');
  doc.setFillColor(91, 54, 245);
  doc.rect(margin, y, 3, 20, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);
  doc.text('EXPERT RECOMMENDATION & ADVICE:', margin + 7, y + 6.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(93, 100, 109);
  const adviceText = `${result.recommendationNote} Small ready-mix orders (under 4m³) may be subject to a short-load charge; inquire with local mini-mix suppliers for the best rate.`;
  const splitAdvice = doc.splitTextToSize(adviceText, contentWidth - 12);
  doc.text(splitAdvice, margin + 7, y + 12);

  y += 28;

  // Section 4: Practical Checklist for Pour Day
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 33, 39);
  doc.text('4. Pour Day Preparation Checklist', margin, y);
  y += 5;

  const checklistItems = [
    'Sub-base: Compact 75-100mm of MOT Type 1 hardcore before pouring to prevent cracking.',
    'Formwork: Check timber forms are well-braced, level, and oiled for easy strike.',
    'Access: Ensure clear wheelbarrow routes (at least 80cm wide) if truck discharge is not direct.',
    'Safety: Wear waterproof gloves, safety goggles, and rubber boots when handling wet concrete.',
  ];

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(93, 100, 109);
  checklistItems.forEach((item) => {
    doc.text(`•  ${item}`, margin + 4, y + 2);
    y += 4.5;
  });

  // Footer Disclaimer
  doc.setFillColor(235, 234, 229);
  doc.rect(0, pageHeight - 16, pageWidth, 16, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(115, 122, 131);
  doc.text(
    'Estimates only. Ground conditions and mix brands affect real requirements. Always confirm with suppliers or building control for structural work.',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
  doc.text('© ConcreteCalc.UK — Free UK Concrete Calculators & Guides', pageWidth / 2, pageHeight - 5, {
    align: 'center',
  });

  // Save the PDF
  const filename = `concrete-estimate-${shape}-${Date.now().toString().slice(-4)}.pdf`;
  doc.save(filename);
}
