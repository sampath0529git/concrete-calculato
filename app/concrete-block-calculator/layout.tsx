import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Concrete Block Calculator UK – Blocks per m², Mortar & Sand',
  description:
    'Calculate exact 440x215mm concrete blocks, mortar bags, and building sand for single or double skin walls. Supports 100mm, 140mm dense & lightweight blocks.',
  keywords: [
    'concrete blocks',
    'concrete block calculator',
    'concrete blocks per m2',
    'block calculator uk',
    'how many blocks do i need',
    'concrete blocks uk',
    'dense concrete blocks',
    'lightweight concrete blocks',
    'mortar calculator for blocks',
    'thermalite blocks calculator',
    'celcon blocks calculator',
    'building blocks calculator uk',
  ],
  alternates: {
    canonical: '/concrete-block-calculator',
  },
  openGraph: {
    title: 'Concrete Block Calculator UK – Blocks per m², Mortar & Sand',
    description:
      'Free UK concrete block calculator. Calculate standard 440x215mm blocks, mortar volume, sand bags, and wastage for garden and retaining walls.',
    url: 'https://concretecalc.co.uk/concrete-block-calculator',
    type: 'website',
    images: [
      {
        url: '/images/concrete-blocks-wall.jpg',
        width: 1200,
        height: 675,
        alt: 'Concrete block calculator UK – single-skin retaining wall with 440mm x 215mm dense concrete blocks',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Concrete Block Calculator UK – Blocks per m², Mortar & Sand',
    description:
      'Calculate blocks per m², mortar mix, and wastage for UK standard 440x215mm concrete blocks.',
    images: ['/images/concrete-blocks-wall.jpg'],
  },
};

const blockJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Concrete Block Calculator UK',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      description:
        'Calculate number of concrete blocks, mortar mix, and building sand bags for UK wall projects based on standard 440mm × 215mm block sizes.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
      inLanguage: 'en-GB',
    },
    {
      '@type': 'HowTo',
      name: 'How to Calculate Concrete Blocks for a Wall UK',
      description:
        'Step-by-step method to calculate standard British concrete blocks (440mm × 215mm with 10mm mortar joints) for single and cavity walls.',
      step: [
        {
          '@type': 'HowToStep',
          name: 'Measure Wall Area',
          text: 'Multiply wall length (metres) by height (metres) to find the total surface area in m².',
        },
        {
          '@type': 'HowToStep',
          name: 'Deduct Openings',
          text: 'Calculate and subtract the area of doors and windows.',
        },
        {
          '@type': 'HowToStep',
          name: 'Apply 10 Blocks per m² Rule',
          text: 'Standard 440mm × 215mm blocks with 10mm joints require exactly 9.88 (or 10) blocks per square metre of single-skin wall.',
        },
        {
          '@type': 'HowToStep',
          name: 'Add Wastage',
          text: 'Add 5% to 10% extra blocks for cuts, corners, and bonding breakages.',
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://concretecalc.co.uk/concrete-block-calculator#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://concretecalc.co.uk',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Concrete Block Calculator',
          item: 'https://concretecalc.co.uk/concrete-block-calculator',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://concretecalc.co.uk/concrete-block-calculator#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How many concrete blocks are needed per square metre (m²)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Standard UK concrete blocks measuring 440mm long by 215mm high with standard 10mm mortar bed joints require exactly 9.88 blocks per square metre. In trade estimation, this is universally rounded to 10 blocks per m² (or 20 blocks per m² for a double-skin cavity wall).',
          },
        },
        {
          '@type': 'Question',
          name: 'How much mortar do I need for 100 concrete blocks?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For 100mm thick standard blocks, 100 blocks require approximately 0.06 m³ of mortar, which corresponds to roughly 3 bags of 25kg cement and 12 bags (or 300kg) of building sand mixed at a 1:4 ratio.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between dense and lightweight concrete blocks?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Dense aggregate blocks (typically 17–20kg each, 7.3N/mm²) offer superior strength, sound insulation, and moisture resistance, making them ideal for retaining walls, foundations, and external leaves. Lightweight aerated blocks (e.g. Thermalite/Celcon, 7–10kg each, 3.6N/mm²) provide superior thermal insulation and are faster to lay for internal partitions and cavity walls.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many blocks are in a standard UK pallet?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A standard UK pallet of 100mm dense aggregate blocks typically contains 72 blocks (approx. 7.2 m² of walling) and weighs approximately 1.3 to 1.4 tonnes. 100mm lightweight aerated blocks often come in packs of 60 to 72 blocks weighing around 600kg.',
          },
        },
      ],
    },
  ],
};

export default function ConcreteBlockCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blockJsonLd) }}
      />
      {children}
    </>
  );
}
