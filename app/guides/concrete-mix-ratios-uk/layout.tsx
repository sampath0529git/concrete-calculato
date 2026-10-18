import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'UK Concrete Mix Ratios Guide (C15, C20, C25, C30) & BS 8500 Grades',
  description:
    'Complete UK guide to standard concrete mix ratios (1:2:4, 1:1.5:3), BS 8500 designations (GEN 1, C20, C25, C30), cement, sharp sand, gravel, and ballast quantities per m³.',
  keywords: [
    'concrete mix ratios uk',
    'c20 mix ratio',
    'c25 concrete mix ratio',
    '1 2 4 concrete mix',
    'bs 8500 concrete grades',
    'cement sand gravel ratio',
    'how to mix concrete uk',
    'c30 concrete ratio',
    'concrete batching ratio by volume',
  ],
  alternates: {
    canonical: '/guides/concrete-mix-ratios-uk',
  },
  openGraph: {
    title: 'UK Concrete Mix Ratios Guide (C15, C20, C25, C30) & BS 8500 Grades',
    description:
      'Standard British mix ratios by volume and weight. Cement, sharp sand, gravel, and water quantities per m³ for domestic and commercial projects.',
    url: 'https://concrete-calculator-uk.vercel.app/guides/concrete-mix-ratios-uk',
    type: 'article',
    images: [
      {
        url: '/images/concrete-bags-cubic-metre.jpg',
        width: 1200,
        height: 675,
        alt: 'UK concrete mix ratios – cement, ballast, and sand measuring guide',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Concrete Mix Ratios Guide (C15 to C30)',
    description:
      'Standard volume and weight batching ratios for British builders and DIYers.',
    images: ['/images/concrete-bags-cubic-metre.jpg'],
  },
};

const mixGuideJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://concrete-calculator-uk.vercel.app/guides/concrete-mix-ratios-uk#breadcrumb',
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
          name: 'Guides',
          item: 'https://concrete-calculator-uk.vercel.app/guides',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Concrete Mix Ratios UK',
          item: 'https://concrete-calculator-uk.vercel.app/guides/concrete-mix-ratios-uk',
        },
      ],
    },
    {
      '@type': 'TechArticle',
      '@id': 'https://concrete-calculator-uk.vercel.app/guides/concrete-mix-ratios-uk#article',
      headline: 'UK Concrete Mix Ratios Explained: C15, C20, C25, C30 & BS 8500 Standards',
      description:
        'A comprehensive reference guide for batching concrete by volume and weight using British Standard specifications.',
      image: 'https://concrete-calculator-uk.vercel.app/images/concrete-bags-cubic-metre.jpg',
      author: {
        '@type': 'Organization',
        name: 'ConcreteCalc UK',
        url: 'https://concrete-calculator-uk.vercel.app',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ConcreteCalc UK',
        logo: {
          '@type': 'ImageObject',
          url: 'https://concrete-calculator-uk.vercel.app/images/logo.png',
        },
      },
      datePublished: '2026-10-15',
      dateModified: '2026-10-18',
      inLanguage: 'en-GB',
    },
    {
      '@type': 'HowTo',
      '@id': 'https://concrete-calculator-uk.vercel.app/guides/concrete-mix-ratios-uk#howto',
      name: 'How to Batch a Standard 1:2:4 (C20) Concrete Mix by Volume',
      description:
        'Step-by-step instructions for mixing C20 domestic concrete using bucket or gauge box proportions.',
      totalTime: 'PT15M',
      tool: [
        { '@type': 'HowToTool', name: 'Cement mixer or mixing board' },
        { '@type': 'HowToTool', name: 'Builder gauge bucket' },
        { '@type': 'HowToTool', name: 'Square-mouth shovel' },
      ],
      supply: [
        { '@type': 'HowToSupply', name: 'Portland Cement (CEM I / CEM II)' },
        { '@type': 'HowToSupply', name: 'Sharp Sand' },
        { '@type': 'HowToSupply', name: '20mm Gravel / Coarse Aggregate' },
        { '@type': 'HowToSupply', name: 'Clean tap water' },
      ],
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Measure 1 Part Cement, 2 Parts Sand, 4 Parts Gravel',
          text: 'Using a bucket for consistency, measure 1 bucket of dry cement powder, 2 buckets of washed sharp sand, and 4 buckets of 20mm gravel (or 1 part cement to 5 parts all-in ballast).',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Dry Mix Thoroughly',
          text: 'Combine the aggregate, sand, and cement until the color is a completely uniform grey with no unmixed streaks.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Add Water Gradually',
          text: 'Gradually add approximately 0.5 parts clean water per part of cement. Mix until workable without becoming runny or soupy (maintain slump ~75mm to 100mm).',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://concrete-calculator-uk.vercel.app/guides/concrete-mix-ratios-uk#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a 1:2:4 concrete mix used for in the UK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A 1:2:4 mix (1 part cement, 2 parts sharp sand, 4 parts 20mm gravel) roughly equates to C20 strength (20 N/mm² after 28 days). It is the most versatile UK domestic mix, ideal for garden shed bases, patio slabs, internal pathway sub-bases, and unreinforced foundation trenches.',
          },
        },
        {
          '@type': 'Question',
          name: 'What mix ratio is C25 concrete?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'C25 concrete is traditionally batched as a 1:1.5:3 ratio (1 part cement, 1.5 parts sharp sand, 3 parts gravel), or roughly 1:4 with all-in ballast. It achieves 25 N/mm² compressive strength and is the UK minimum standard for domestic house extension foundations, reinforced slabs, and patio driveways.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use all-in ballast instead of separate sand and gravel?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. 20mm all-in ballast is pre-blended sharp sand and 20mm gravel. For a standard C20 mix, use a 1:5 ratio (1 bucket of cement to 5 buckets of ballast). For a stronger C25 mix, use a 1:4 ratio.',
          },
        },
      ],
    },
  ],
};

export default function MixRatiosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mixGuideJsonLd) }}
      />
      {children}
    </>
  );
}
