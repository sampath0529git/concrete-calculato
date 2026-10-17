import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Concrete Footing Calculator UK – Trench & Strip Foundations',
  description:
    'Calculate trench fill, strip foundations, and extension footing concrete volume in m³ with UK Building Regulations Part A depth presets and waste.',
  keywords: [
    'concrete footing calculator',
    'foundation concrete calculator',
    'trench footing calculator uk',
    'strip foundation calculator',
    'building regs footing depth uk',
    'concrete for extension foundations',
    'trench fill concrete calculator',
    'how much concrete for foundations',
    'footing concrete volume m3',
  ],
  alternates: {
    canonical: '/concrete-footing-calculator',
  },
  openGraph: {
    title: 'Concrete Footing Calculator UK – Trench & Strip Foundations',
    description:
      'Calculate concrete volume (m³), 25kg bags, and ready-mix lorry loads for domestic house extensions, garden walls, and conservatory foundations.',
    url: 'https://concretecalc.co.uk/concrete-footing-calculator',
    type: 'website',
    images: [
      {
        url: '/images/ready-mix-vs-bagged-concrete-truck.jpg',
        width: 1200,
        height: 675,
        alt: 'Concrete footing calculator UK – foundation trench pouring ready-mix concrete',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Concrete Footing Calculator UK – Trench & Strip Foundations',
    description:
      'Calculate cubic metres and ready-mix delivery loads for UK foundation trenches.',
    images: ['/images/ready-mix-vs-bagged-concrete-truck.jpg'],
  },
};

const footingJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Concrete Footing & Foundation Calculator UK',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      description:
        'Calculates concrete volume in m³, bags, and ready-mix truck loads for trench fill, strip foundations, and garden wall footings in accordance with UK Building Regulations Part A.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
      inLanguage: 'en-GB',
    },
  ],
};

export default function ConcreteFootingCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(footingJsonLd) }}
      />
      {children}
    </>
  );
}
