import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Ready-Mix vs Bagged Concrete UK – Cost, Labour & Break-Even Analysis',
  description:
    'Compare 25kg pre-mix bags against delivered ready-mix concrete. UK break-even tipping point (~1.5 m³), minimum load surcharges, and barrow time limits.',
  keywords: [
    'ready mix vs bagged concrete',
    'is ready mix cheaper than bagged concrete uk',
    'cheapest way to buy concrete uk',
    'ready mix concrete minimum load',
    'cost of mixing concrete yourself uk',
    'ready mix concrete calculator uk',
    'bagged concrete vs volumetric concrete',
    'how much concrete is worth delivering',
  ],
  alternates: {
    canonical: '/ready-mix-vs-bagged-concrete',
  },
  openGraph: {
    title: 'Ready-Mix vs Bagged Concrete UK – Cost, Labour & Break-Even Analysis',
    description:
      'Compare 25kg pre-mix bags against delivered ready-mix concrete. UK break-even tipping point (~1.5 m³), minimum load surcharges, and barrow time limits.',
    url: 'https://concrete-calculator-uk.vercel.app/ready-mix-vs-bagged-concrete',
    type: 'article',
    images: [
      {
        url: '/images/ready-mix-vs-bagged-concrete-truck.jpg',
        width: 1280,
        height: 720,
        alt: 'Volumetric ready-mix concrete lorry discharging fresh wet concrete into a residential foundation trench in the UK',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ready-Mix vs Bagged Concrete UK – Cost & Labour Analysis',
    description: 'Compare cost, labor intensity, and short-load fees for UK domestic projects.',
    images: ['/images/ready-mix-vs-bagged-concrete-truck.jpg'],
  },
};

const readyMixJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://concrete-calculator-uk.vercel.app/ready-mix-vs-bagged-concrete#breadcrumb',
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
          name: 'Ready-Mix vs Bagged Concrete',
          item: 'https://concrete-calculator-uk.vercel.app/ready-mix-vs-bagged-concrete',
        },
      ],
    },
    {
      '@type': 'TechArticle',
      '@id': 'https://concrete-calculator-uk.vercel.app/ready-mix-vs-bagged-concrete#article',
      headline: 'Ready-Mix vs Bagged Concrete: Which Should You Choose for UK Projects?',
      description:
        'Comprehensive comparison between bagged dry mix concrete and commercial ready-mix truck deliveries in the UK market.',
      image: 'https://concrete-calculator-uk.vercel.app/images/ready-mix-vs-bagged-concrete-truck.jpg',
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
      datePublished: '2026-10-14',
      dateModified: '2026-10-18',
      inLanguage: 'en-GB',
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://concrete-calculator-uk.vercel.app/ready-mix-vs-bagged-concrete#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'At what volume does ready-mix concrete become cheaper than bags?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For projects below 0.6 m³ (~50 bags), buying 25kg pre-mix bags is cheaper and avoids part-load delivery surcharges. For projects between 0.6 m³ and 1.2 m³, cost is comparable. Above 1.2 m³, ready-mix is usually cheaper per cubic metre and saves hours of intense physical labour.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a volumetric concrete truck and why is it popular?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Volumetric trucks carry dry unmixed cement, aggregate, and water in separate compartments and mix the exact required quantity on-site. You pay only for what you pour, eliminating part-load charges and the risk of ordering too much or too little.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long do I get to unload a ready-mix concrete lorry?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'UK ready-mix suppliers typically include 20 to 30 minutes of free discharge waiting time. Waiting time charges thereafter range from £1.50 to £2.50 per minute (£90 to £150 per hour), so ensure your barrow team is ready prior to arrival.',
          },
        },
      ],
    },
  ],
};

export default function ReadyMixVsBaggedPage() {
  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(readyMixJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'guides', href: '/blog' },
          { label: 'ready-mix vs bagged' },
        ]}
      />

      <article className="post">
        <h1>Ready-Mix vs Bagged Concrete: Which Should You Choose?</h1>
        <div className="meta">Published 2026-10-14 &middot; Last updated Oct 2026 &middot; Trade Comparison Guide</div>

        {/* Featured Image */}
        <figure style={{ margin: '20px 0 28px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--line)' }}>
          <div style={{ position: 'relative', width: '100%', height: '380px' }}>
            <Image
              src="/images/ready-mix-vs-bagged-concrete-truck.jpg"
              alt="Volumetric concrete delivery truck pouring wet fresh concrete down a steel chute into a domestic trench on a UK residential property"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 860px"
              style={{ objectFit: 'cover' }}
              referrerPolicy="no-referrer"
            />
          </div>
          <figcaption style={{ padding: '10px 14px', fontSize: '12.5px', color: 'var(--muted)', background: 'var(--surface-elevated)' }}>
            Figure 1: Volumetric ready-mix lorry mixing concrete on-site and discharging fresh C25 concrete directly into domestic foundation formwork.
          </figcaption>
        </figure>

        <p>
          Deciding between buying pre-mixed dry concrete in 25kg bags or ordering delivered ready-mix (either standard drum mixer or volumetric lorry) comes down to three deciding factors: <strong>total volume</strong>, <strong>site accessibility</strong>, and <strong>available manual labour</strong>.
        </p>

        <h2>Summary Comparison Table</h2>
        <div className="scroll" style={{ margin: '20px 0' }}>
          <table>
            <thead>
              <tr>
                <th>Factor</th>
                <th>25kg Pre-Mix Bags</th>
                <th>Delivered Ready-Mix / Volumetric</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Best Volume Range</strong></td>
                <td>Up to 0.75 m³ (1–60 bags)</td>
                <td>Over 0.75 m³ (up to 8+ m³)</td>
              </tr>
              <tr>
                <td><strong>Average UK Cost</strong></td>
                <td>£5.50 – £7.50 per 25kg bag (~£450–£600 / m³)</td>
                <td>£110 – £160 per m³ (+ possible short-load charge)</td>
              </tr>
              <tr>
                <td><strong>Labor &amp; Physical Effort</strong></td>
                <td>Very high (hand mixing or small Belle mixer)</td>
                <td>Low to moderate (placed in 15–30 mins)</td>
              </tr>
              <tr>
                <td><strong>Strength Consistency</strong></td>
                <td>Variable (depends on water ratio per batch)</td>
                <td>Certified BS 8500 / BS EN 206 plant precision</td>
              </tr>
              <tr>
                <td><strong>Curing Risk / Cold Joints</strong></td>
                <td>Higher risk of cold joints due to slow batches</td>
                <td>Monolithic pour with zero cold joint seams</td>
              </tr>
              <tr>
                <td><strong>Site Access Needed</strong></td>
                <td>Standard car / van access to garden</td>
                <td>Wide driveway / road for 26-tonne HGV lorry</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>When to choose 25kg Bags</h2>
        <p>
          Bagged concrete is the best solution for small repairs, fence post holes, rotary dryer sockets, and small garden paths:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.7 }}>
          <li><strong>Projects under 0.5 m³:</strong> No delivery charges or minimum order surcharges.</li>
          <li><strong>Work at your own pace:</strong> You can mix three bags this evening and four bags next weekend without rush.</li>
          <li><strong>Restricted site access:</strong> If the pour site is behind terraced housing with only narrow alleyway access, a 26-tonne concrete truck cannot reach.</li>
        </ul>

        <h2>When Ready-Mix / Volumetric Truck is Best</h2>
        <p>
          For garage slabs, extensions, large patios, and driveways exceeding 1.0 m³, delivered ready-mix is strongly recommended:
        </p>
        <ul style={{ paddingLeft: '20px', lineHeight: 1.7 }}>
          <li><strong>Massive labor savings:</strong> 1 cubic metre equals ~83 bags of 25kg mix weighing 2.4 tonnes. Mixing that manually takes an entire exhausting day.</li>
          <li><strong>Cost efficiency above 1.0 m³:</strong> Even with a short-load fee, ready-mix is typically 30% to 50% cheaper per cubic metre than buying individual merchant bags.</li>
          <li><strong>Volumetric Truck Advantage:</strong> Volumetric mixers batch raw ingredients on your driveway, meaning you only pay for the exact volume poured with zero waste.</li>
        </ul>

        <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--line)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            href="/blog"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '8px 16px' }}
          >
            ← Back to All Guides
          </Link>
          <Link
            href="/"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '8px 16px', background: 'var(--calc-blue)', color: '#fff' }}
          >
            Compare Both in Concrete Calculator →
          </Link>
        </div>
      </article>
    </div>
  );
}
