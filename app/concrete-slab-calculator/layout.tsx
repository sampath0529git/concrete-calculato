import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Concrete Slab Calculator UK – m³, 25kg Bags & Steel Mesh',
  description:
    'Calculate cubic metres (m³), 25kg pre-mixed bags, A142/A193 steel reinforcement mesh sheets, and sub-base MOT Type 1 for UK garden slabs and patios.',
  keywords: [
    'concrete slab calculator',
    'concrete slab calculator uk',
    'slab concrete calculator',
    'concrete patio calculator',
    'steel mesh slab calculator',
    'calculate concrete for slab',
    'shed slab calculator',
    'concrete driveway slab calculator',
    'a142 mesh calculator',
    'slab concrete bags',
    'concrete slab cost calculator uk',
  ],
  alternates: {
    canonical: '/concrete-slab-calculator',
  },
  openGraph: {
    title: 'Concrete Slab Calculator UK – m³, 25kg Bags & Steel Mesh',
    description:
      'Calculate exact concrete volume (m³), 25kg bag count, steel reinforcing mesh (A142/A193/A252), MOT Type 1 sub-base, and damp-proof membrane (DPM).',
    url: 'https://concrete-calculator-uk.vercel.app/concrete-slab-calculator',
    type: 'website',
    images: [
      {
        url: '/images/shed-base-formwork.jpg',
        width: 1200,
        height: 675,
        alt: 'Concrete slab calculator UK – timber formwork frame with compacted stone sub-base',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Concrete Slab Calculator UK – m³, Bags & Mesh',
    description:
      'Free UK slab calculator: m³ volume, 25kg bags, steel mesh sheets, DPM, and MOT Type 1 hardcore.',
    images: ['/images/shed-base-formwork.jpg'],
  },
};

const slabJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://concrete-calculator-uk.vercel.app/concrete-slab-calculator#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://concrete-calculator-uk.vercel.app',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Concrete Slab Calculator',
          item: 'https://concrete-calculator-uk.vercel.app/concrete-slab-calculator',
        },
      ],
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://concrete-calculator-uk.vercel.app/concrete-slab-calculator#webapp',
      name: 'Concrete Slab Calculator UK',
      url: 'https://concrete-calculator-uk.vercel.app/concrete-slab-calculator',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      description:
        'Calculates volume in cubic metres, pre-mixed bags, steel reinforcement mesh (A142/A193), DPM, and MOT sub-base for garden slabs, garage floors, and shed bases.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
      inLanguage: 'en-GB',
    },
    {
      '@type': 'HowTo',
      '@id': 'https://concrete-calculator-uk.vercel.app/concrete-slab-calculator#howto',
      name: 'How to Calculate Concrete Slab Volume and Steel Mesh in the UK',
      description:
        'Step-by-step method to calculate cubic metres, 25kg bags, and steel reinforcing sheets for shed bases, patios, and garage floors.',
      totalTime: 'PT15M',
      tool: [
        { '@type': 'HowToTool', name: 'Measuring tape' },
        { '@type': 'HowToTool', name: 'Concrete Slab Calculator UK' },
      ],
      supply: [
        { '@type': 'HowToSupply', name: 'C20/C25 concrete or 25kg bags' },
        { '@type': 'HowToSupply', name: 'A142 or A193 steel reinforcing fabric mesh' },
        { '@type': 'HowToSupply', name: 'MOT Type 1 granular sub-base' },
        { '@type': 'HowToSupply', name: '1200-gauge DPM polythene membrane' },
      ],
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Measure Slab Length and Width',
          text: 'Measure the exterior dimensions of your timber formwork shuttering in metres.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Select Appropriate Slab Thickness',
          text: 'Use 100mm (0.10m) for garden sheds, hot tub pads, and patios. Use 125mm to 150mm (0.15m) for domestic garage slabs and vehicle parking.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Calculate Cubic Metres with 10% Waste',
          text: 'Multiply length × width × depth × 1.10. For example: a 4m × 3m shed slab at 100mm requires 4 × 3 × 0.10 × 1.10 = 1.32 m³.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Calculate Steel Mesh Sheets',
          text: 'Standard UK mesh sheets are 4.8m × 2.4m (11.52 m² gross, ~9.5 m² net allowing for 200mm overlaps). Divide your total floor area by 9.5 to determine sheet count.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://concrete-calculator-uk.vercel.app/concrete-slab-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How thick should a domestic concrete slab be?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For garden sheds, greenhouses, and light patio paving, a 100mm (4 inches) slab is standard. For garage floors, hot tub pads, and vehicle driveways, use a 125mm to 150mm (5-6 inches) slab reinforced with steel mesh.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need reinforcing mesh in my concrete slab?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For pedestrian garden walkways under 2m, mesh is optional. For shed bases over 3m × 3m, garage slabs, or ground with uneven settlement risk, A142 (6mm wire) or A193 (7mm wire) steel mesh prevents shrinkage cracking and increases tensile strength.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much MOT Type 1 hardcore sub-base do I need?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A minimum 100mm compacted MOT Type 1 sub-base is recommended under domestic slabs. Multiply area (m²) × 0.10m × 2.1 tonnes/m³ to calculate required tonnes of aggregate.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many 25kg bags of concrete are needed for a 100mm slab?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Each square metre of 100mm thick slab requires 0.10 m³ of concrete, which equates to roughly 8.5 to 9 bags of 25kg pre-mix per square metre including a 10% waste contingency.',
          },
        },
      ],
    },
  ],
};

export default function ConcreteSlabCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(slabJsonLd) }}
      />
      {children}
    </>
  );
}
