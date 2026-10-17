import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Price of Concrete Per m³ UK (2026 Costs) – Ready-Mix & Volumetric',
  description:
    'Updated 2026 UK concrete price benchmarks by region (London, Midlands, North). Ready-mix vs volumetric delivery rates, part-load fees, and barrowing costs.',
  keywords: [
    'price of concrete per m3',
    'cost of concrete per m3 uk',
    'how much is a cubic metre of concrete uk',
    'ready mix concrete prices uk',
    'volumetric concrete cost per cubic metre',
    'concrete price per m3',
    'cost of 1m3 concrete uk',
    'cheap ready mix concrete uk',
    'concrete delivery cost uk',
    'part load concrete charges uk',
  ],
  alternates: {
    canonical: '/price-of-concrete-per-m3',
  },
  openGraph: {
    title: 'Price of Concrete Per m³ UK (2026 Costs) – Ready-Mix & Volumetric',
    description:
      'Live UK cost benchmarks for delivered ready-mix concrete per cubic metre. Regional pricing across London, Midlands, North, and Wales with part-load calculator.',
    url: 'https://concretecalc.co.uk/price-of-concrete-per-m3',
    type: 'article',
    images: [
      {
        url: '/images/ready-mix-vs-bagged-concrete-truck.jpg',
        width: 1200,
        height: 675,
        alt: 'Ready-mix concrete delivery truck price per cubic metre in the UK',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Price of Concrete Per m³ UK (2026 Benchmark Costs)',
    description:
      'Compare ready-mix and volumetric delivery costs across the UK with regional pricing indices.',
    images: ['/images/ready-mix-vs-bagged-concrete-truck.jpg'],
  },
};

const priceJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'TechArticle',
      headline: 'Price of Concrete Per m³ in the UK (2026 Updated Rates)',
      description:
        'A comprehensive guide to UK concrete prices per cubic metre, comparing barrel mixer trucks, volumetric trucks, and bagged mix across regions.',
      inLanguage: 'en-GB',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does 1 cubic metre of concrete cost in the UK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'As of 2026, delivered ready-mix concrete typically costs between £95 and £135 per cubic metre (m³) plus VAT. Prices in Greater London and the South East sit at the higher end (£115 to £145/m³), while Northern England, Wales, and Scotland range between £90 and £115/m³.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a minimum load or part-load fee?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most commercial ready-mix suppliers require a minimum order of 3.0 m³ to 4.0 m³. If you order less (e.g. 1.5 m³), they apply a part-load charge of £30 to £60 for every unused cubic metre.',
          },
        },
      ],
    },
  ],
};

export default function PriceOfConcreteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(priceJsonLd) }}
      />
      {children}
    </>
  );
}
