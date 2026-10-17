import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Postcrete Calculator UK – Bags of Postcrete Per Post & Hole Size',
  description:
    'Calculate exact bags of Blue Circle or Hanson rapid-set Postcrete for 75mm, 100mm timber, concrete, and metal fence posts with UK standard hole diameter formulas.',
  keywords: [
    'postcrete calculator',
    'how many bags of postcrete per post',
    'bags of postcrete per post',
    'postcrete calculator uk',
    'fence post concrete calculator',
    'how much postcrete for 4x4 post',
    'rapid set postcrete calculator',
    'blue circle postcrete',
    'hanson postcrete calculator',
    'post hole concrete calculator',
    'postcrete for fence posts',
  ],
  alternates: {
    canonical: '/postcrete-calculator',
  },
  openGraph: {
    title: 'Postcrete Calculator UK – Bags of Postcrete Per Post & Hole Size',
    description:
      'Calculate exactly how many 20kg bags of rapid set Postcrete you need per fence post hole based on British fencing standards.',
    url: 'https://concretecalc.co.uk/postcrete-calculator',
    type: 'website',
    images: [
      {
        url: '/images/fence-post-postcrete.jpg',
        width: 1200,
        height: 675,
        alt: 'Postcrete calculator UK – timber fence post installation in garden hole with rapid set Postcrete bag',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Postcrete Calculator UK – Bags of Postcrete Per Post',
    description:
      'Exact Postcrete bag calculations for 3-inch, 4-inch, concrete slotted and gate posts in the UK.',
    images: ['/images/fence-post-postcrete.jpg'],
  },
};

const postcreteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Postcrete Calculator UK',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      description:
        'Calculate exact bags of 20kg rapid-set Postcrete required per post hole for fencing, decking, pergola, and gate installations in the UK.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
      inLanguage: 'en-GB',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How many bags of Postcrete do I need per fence post?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For a standard 100mm × 100mm (4×4 inch) wooden post in a typical hole (200mm diameter × 600mm deep), you need 1.5 to 2 bags of 20kg Postcrete. A 75mm (3-inch) post in a shallower hole needs 1 to 1.5 bags, while heavy gate posts or corner posts requiring 750mm depth need 2.5 to 3 bags.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you mix Postcrete with water before pouring?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Rapid-set Postcrete is designed to be poured dry directly into the hole. Fill the hole one-third full with clean water, position the post upright, and pour the dry Postcrete evenly around the post until the water is absorbed.',
          },
        },
      ],
    },
  ],
};

export default function PostcreteCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postcreteJsonLd) }}
      />
      {children}
    </>
  );
}
