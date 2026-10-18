import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Concrete Weight & Volume Converter UK – m³ to Tonnes, kg & Bags',
  description:
    'Free UK concrete weight and volume converter. Instantly convert cubic metres (m³) to tonnes, kg, 25kg bags, bulk bags, and wheelbarrows for standard UK mix grades.',
  keywords: [
    'concrete weight converter',
    'm3 to tonnes concrete',
    'how much does 1m3 of concrete weigh',
    'weight of concrete per m3',
    'cubic metre to tonnes calculator',
    'concrete density calculator',
    'tonnes of concrete in a cubic metre',
    '25kg bags to tonnes concrete',
    'concrete weight uk',
  ],
  alternates: {
    canonical: '/concrete-weight-converter',
  },
  openGraph: {
    title: 'Concrete Weight & Volume Converter UK – m³ to Tonnes, kg & Bags',
    description:
      'Instantly convert cubic metres (m³) to metric tonnes, kg, 25kg bags, bulk bags, and wheelbarrows for UK mix grades.',
    url: 'https://concretecalc.co.uk/concrete-weight-converter',
    type: 'website',
    images: [
      {
        url: '/images/concrete-bags-cubic-metre.jpg',
        width: 1200,
        height: 675,
        alt: 'Concrete weight converter UK – converting cubic metres to tonnes and 25kg bags',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Concrete Weight & Volume Converter UK',
    description:
      'Convert cubic metres to tonnes, kilograms, and 25kg bags for UK standard concrete mixes.',
    images: ['/images/concrete-bags-cubic-metre.jpg'],
  },
};

const weightConverterJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://concretecalc.co.uk/concrete-weight-converter#breadcrumb',
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
          name: 'Concrete Weight Converter',
          item: 'https://concretecalc.co.uk/concrete-weight-converter',
        },
      ],
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://concretecalc.co.uk/concrete-weight-converter#webapp',
      name: 'Concrete Weight & Volume Converter UK',
      url: 'https://concretecalc.co.uk/concrete-weight-converter',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      description:
        'Convert cubic metres (m³), cubic yards, and litres into metric tonnes, kilograms, 25kg bags, and builder bulk bags with BS 8500 concrete density ratings.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
      inLanguage: 'en-GB',
    },
    {
      '@type': 'HowTo',
      '@id': 'https://concretecalc.co.uk/concrete-weight-converter#howto',
      name: 'How to Convert Concrete Cubic Metres (m³) to Tonnes',
      description:
        'Quick practical formula to convert wet or cured concrete volume in cubic metres to weight in metric tonnes.',
      totalTime: 'PT2M',
      tool: [{ '@type': 'HowToTool', name: 'Calculator' }],
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Identify Concrete Density (Typical 2.4 t/m³)',
          text: 'Standard unreinforced UK domestic concrete (C20/C25) has a density of approximately 2,400 kg/m³ (2.4 tonnes per m³). Reinforced concrete with steel mesh is roughly 2,450 to 2,500 kg/m³.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Multiply Volume (m³) by 2.4',
          text: 'Multiply your total cubic metres by 2.4. For example: 1.5 m³ × 2.4 = 3.6 metric tonnes (3,600 kg).',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Calculate Vehicle Payload or Grab Lorry Needs',
          text: 'Use the total tonnage to verify against skip weight limits or tipper/grab lorry payload capacity (typically 16-20 tonnes max for an 8-wheel tipper).',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://concretecalc.co.uk/concrete-weight-converter#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does 1 cubic metre (m³) of concrete weigh in the UK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'One cubic metre of standard domestic wet concrete weighs approximately 2,400 kg (2.4 metric tonnes). Lightweight aggregate concrete weighs approximately 1,600 to 1,900 kg/m³, while heavy steel-reinforced concrete weighs between 2,450 and 2,500 kg/m³.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many 25kg bags are in 1 tonne of concrete?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'There are exactly 40 bags of 25kg pre-mix concrete in 1 metric tonne (1,000 kg ÷ 25 kg = 40 bags).',
          },
        },
        {
          '@type': 'Question',
          name: 'How many wheelbarrows in 1 cubic metre of concrete?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A standard British builder wheelbarrow holds approximately 0.05 to 0.07 m³ of wet concrete (~120 to 160 kg). Therefore, it requires approximately 14 to 20 full wheelbarrows to move 1 cubic metre of concrete.',
          },
        },
      ],
    },
  ],
};

export default function ConcreteWeightConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(weightConverterJsonLd) }}
      />
      {children}
    </>
  );
}
