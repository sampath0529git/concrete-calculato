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
    url: 'https://concretecalc.co.uk/concrete-slab-calculator',
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
      '@type': 'WebApplication',
      name: 'Concrete Slab Calculator UK',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      description:
        'Calculates volume in cubic metres, pre-mixed bags, steel reinforcement mesh (A142/A193), DPM, and MOT sub-base for garden slabs, garage floors, and shed bases.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
      inLanguage: 'en-GB',
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
