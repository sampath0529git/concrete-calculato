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
      '@type': 'BreadcrumbList',
      '@id': 'https://concretecalc.co.uk/postcrete-calculator#breadcrumb',
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
          name: 'Postcrete Calculator',
          item: 'https://concretecalc.co.uk/postcrete-calculator',
        },
      ],
    },
    {
      '@type': 'HowTo',
      '@id': 'https://concretecalc.co.uk/postcrete-calculator#howto',
      name: 'How to Install a Fence Post with Rapid-Set Postcrete in the UK',
      description:
        'Official British fencing technique for digging holes and fixing wooden or concrete fence posts using dry rapid-set Postcrete and water.',
      totalTime: 'PT15M',
      tool: [
        { '@type': 'HowToTool', name: 'Post hole digger or spade' },
        { '@type': 'HowToTool', name: 'Spirit level' },
      ],
      supply: [
        { '@type': 'HowToSupply', name: '20kg Postcrete bags (1.5-2 per standard post)' },
        { '@type': 'HowToSupply', name: 'Clean water' },
        { '@type': 'HowToSupply', name: 'Fence post (treated timber or concrete)' },
      ],
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Dig the Post Hole to Correct Depth',
          text: 'Dig a hole three times the width of the post and one-third of the post height deep (e.g. 600mm deep for an 1800mm / 6ft high fence).',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Add Water First',
          text: 'Fill the hole one-third full with clean cold water before adding any dry Postcrete powder.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Position Post & Pour Dry Postcrete',
          text: 'Hold the fence post vertically in position and pour dry Postcrete evenly around the post until no standing water remains on top.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Check Level & Allow Rapid Set',
          text: 'Use a spirit level to check the post is plumb. Postcrete sets firmly in just 5 to 10 minutes without manual mixing.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://concretecalc.co.uk/postcrete-calculator#faq',
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
        {
          '@type': 'Question',
          name: 'How deep should a fence post hole be in the UK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The universal UK rule of thumb is that at least one-third (33%) of the total post length should be below ground. For a standard 6ft (1.8m) tall garden fence panel with an 8ft (2.4m) post, the hole must be at least 600mm (2ft) deep.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does Postcrete take to set?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Postcrete begins setting in 5 to 10 minutes. It achieves initial working strength in 20 minutes, allowing you to move onto the next panel, and cures to full structural strength within 24 hours.',
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
