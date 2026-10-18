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
    url: 'https://concrete-calculator-uk.vercel.app/concrete-footing-calculator',
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
      '@type': 'BreadcrumbList',
      '@id': 'https://concrete-calculator-uk.vercel.app/concrete-footing-calculator#breadcrumb',
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
          name: 'Concrete Footing Calculator',
          item: 'https://concrete-calculator-uk.vercel.app/concrete-footing-calculator',
        },
      ],
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://concrete-calculator-uk.vercel.app/concrete-footing-calculator#webapp',
      name: 'Concrete Footing & Foundation Calculator UK',
      url: 'https://concrete-calculator-uk.vercel.app/concrete-footing-calculator',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      description:
        'Calculates concrete volume in m³, bags, and ready-mix truck loads for trench fill, strip foundations, and garden wall footings in accordance with UK Building Regulations Part A.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
      inLanguage: 'en-GB',
    },
    {
      '@type': 'HowTo',
      '@id': 'https://concrete-calculator-uk.vercel.app/concrete-footing-calculator#howto',
      name: 'How to Calculate Concrete Volume for Trench Foundations in the UK',
      description:
        'Step-by-step guide to calculating concrete cubic metres for strip foundations and trench fill according to UK Building Regulations Part A.',
      totalTime: 'PT20M',
      tool: [
        { '@type': 'HowToTool', name: 'Laser level or tape measure' },
        { '@type': 'HowToTool', name: 'Concrete Footing Calculator UK' },
      ],
      supply: [
        { '@type': 'HowToSupply', name: 'GEN 1 / GEN 3 or RC25/30 foundation concrete' },
      ],
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Determine Total Trench Perimeter',
          text: 'Measure the centreline length of all foundation trenches around the perimeter and loadbearing internal walls in metres.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Confirm Trench Width and Concrete Depth',
          text: 'Under UK Building Regulations Part A, standard domestic strip footings are typically 450mm to 600mm wide with a minimum concrete thickness of 150mm (or trench fill to near ground level).',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Multiply Dimensions and Add 12% Trench Allowance',
          text: 'Multiply total length × width × depth × 1.12 to allow for soil over-dig, uncompacted trench sidewalls, and concrete slump.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://concrete-calculator-uk.vercel.app/concrete-footing-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How deep must domestic footings be in the UK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Under UK Building Regulations Part A, standard strip footings must be at least 750mm below finished ground level to sit safely below the frost zone. In shrinkable clay soils or near trees, depth requirements often extend to 1.0m to 1.5m+ upon Building Control inspection.',
          },
        },
        {
          '@type': 'Question',
          name: 'What concrete mix is specified for foundations in the UK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For standard strip footings and domestic trench fill, BS 8500 specifies GEN 1 (C8/10) or GEN 3 (C16/20) for non-structural applications, or RC25/30 / C25 designated mix when reinforced with steel rebar or mesh.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between strip foundation and trench fill?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Strip foundations use a 150–225mm concrete bed at the base of the trench upon which bricklayers construct cavity masonry up to damp-proof course (DPC). Trench fill pours concrete almost completely to within 150mm of the surface, drastically reducing expensive below-ground bricklaying labour.',
          },
        },
      ],
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
