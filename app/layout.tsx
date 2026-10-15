import type { Metadata } from 'next';
import './globals.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';

export const metadata: Metadata = {
  title: 'Concrete Calculator UK – m³, Bags & Cost for Slabs, Bases & Footings',
  description:
    'Calculate cubic metres, 25kg bags, wet weight, and estimated costs for slabs, bases, footings, post holes, and steps with UK mix guides and worked examples.',
  openGraph: {
    title: 'Concrete Calculator UK – m³, Bags & Cost',
    description:
      'How much concrete do you need? Calculate m³, bags and cost for slabs, footings, columns and steps.',
    type: 'website',
  },
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧱</text></svg>',
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Concrete Calculator UK',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      description:
        'Calculate concrete volume in cubic metres, number of 25kg bags and estimated cost for UK slabs, bases, footings, columns and steps.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
      inLanguage: 'en-GB',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I calculate cubic metres of concrete?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Multiply length × width × thickness, with all three in metres. A 3m × 3m slab that is 100mm (0.1m) thick needs 3 × 3 × 0.1 = 0.9 m³. Add 5–10% for waste.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many bags of concrete make one cubic metre?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A 25kg bag of dry mix makes roughly 0.012 m³, so one cubic metre needs about 83 bags. A 20kg bag makes about 0.0095 m³ (around 105 bags).',
          },
        },
        {
          '@type': 'Question',
          name: 'How much concrete do I need for a shed base?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A 2.4m × 1.8m base at 100mm thick is 0.43 m³ before waste, or about 0.47 m³ with 10% waste. That is around 40 bags of 25kg mix.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is it cheaper to buy bags or ready-mix?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For jobs under about 0.5 m³, bags are usually simpler and cheaper. Between 0.5 and 1 m³ the costs are close. Above 1 m³, ready-mix delivery is normally cheaper and faster, though small loads can attract a short-load charge.',
          },
        },
        {
          '@type': 'Question',
          name: 'How thick should a concrete slab be?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Paths and patios: 75–100mm. Shed and garage bases: 100mm. Car driveways: 100–150mm. Always follow Building Regulations and an engineer's advice for structural work.",
          },
        },
        {
          '@type': 'Question',
          name: 'Why add waste to a concrete calculation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Uneven ground, formwork movement and spillage mean you use more than the theoretical volume. Adding 5–10% helps you avoid running short mid-pour.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
