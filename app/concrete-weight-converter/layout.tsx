import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Concrete Weight & Unit Converter UK | m³, Tonnes, kg & Bags',
  description:
    'Free UK concrete weight and unit converter. Convert m³ to tonnes, kg to cubic metres, 25kg bags, bulk bags, wheelbarrows, and imperial yards based on BS 8500 standard density.',
  keywords: [
    'concrete weight converter',
    'convert m3 to tonnes concrete',
    'how much does 1m3 of concrete weigh uk',
    'concrete volume converter',
    'cubic metres to tonnes',
    '25kg bags to m3',
    'concrete density calculator uk',
    'bulk bag to m3 concrete'
  ],
  alternates: {
    canonical: 'https://concretecalc.co.uk/concrete-weight-converter',
  },
  openGraph: {
    title: 'Concrete Weight & Unit Converter UK | m³, Tonnes & Bags',
    description:
      'Instantly convert cubic metres to tonnes, kilograms, 25kg pre-mix bags, and wheelbarrows for UK domestic and commercial concrete projects.',
    url: 'https://concretecalc.co.uk/concrete-weight-converter',
    siteName: 'ConcreteCalc.UK',
    locale: 'en_GB',
    type: 'website',
  },
};

export default function ConcreteWeightConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'UK Concrete Weight & Unit Converter',
        url: 'https://concretecalc.co.uk/concrete-weight-converter',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'GBP',
        },
        description:
          'Convert concrete volume (m³, yd³, ft³, litres) to weight (tonnes, kg, lbs) and practical UK bag/wheelbarrow units adhering to BS 8500 wet concrete densities.',
      },
      {
        '@type': 'HowTo',
        name: 'How to Convert Cubic Metres of Concrete to Tonnes (UK)',
        description:
          'Step-by-step formula to calculate the weight of wet ready-mix concrete from volume in cubic metres.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Measure or calculate volume',
            text: 'Calculate the total volume of your pour in cubic metres (length x width x depth in metres).',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Apply standard UK concrete density',
            text: 'Standard normal-weight UK concrete (C20/C25/C30) has a wet density of approximately 2,400 kg/m³ (2.4 tonnes per cubic metre).',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Multiply volume by density',
            text: 'Multiply volume (m³) by 2.4 to obtain total wet weight in metric tonnes (e.g., 2.5 m³ x 2.4 = 6.0 tonnes).',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How much does 1 cubic metre (1m³) of concrete weigh in the UK?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Standard wet UK ready-mix concrete weighs approximately 2,400 kg (2.4 tonnes) per cubic metre (m³). Lightweight concrete ranges from 1,800 to 2,000 kg/m³, while reinforced or dense civil mixes can reach 2,500 kg/m³.',
            },
          },
          {
            '@type': 'Question',
            name: 'How many 25kg bags of concrete make 1 cubic metre (1m³)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It takes approximately 83 to 84 pre-mixed 25kg bags (such as Blue Circle or Hanson) to produce 1 cubic metre of compacted concrete, assuming an average yield of 0.012 m³ (12 litres) per bag.',
            },
          },
          {
            '@type': 'Question',
            name: 'How many wheelbarrows are in 1m³ of wet concrete?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A standard UK builder’s wheelbarrow carries roughly 60 to 70 litres of wet concrete safely without spilling. Therefore, 1 cubic metre (1,000 litres) equals approximately 14 to 17 full wheelbarrow loads.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
