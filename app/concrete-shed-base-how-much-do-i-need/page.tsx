import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Concrete Shed Base Calculator – 8x6, 6x4 & 10x8 Garden Slabs',
  description:
    'Calculate exact 100mm concrete slab volume, 25kg bags, MOT Type 1 hardcore, and timber formwork for 6x4, 8x6, and 10x8 garden shed bases in the UK.',
  keywords: [
    'shed base concrete calculator',
    'how much concrete for an 8x6 shed base',
    'concrete for 6x4 shed base',
    'concrete for 10x8 shed base',
    'shed base depth uk',
    'shed base slab calculator',
    'bags of concrete for shed base',
    'how thick should a shed base be',
    'garden shed concrete base uk',
  ],
  alternates: {
    canonical: '/concrete-shed-base-how-much-do-i-need',
  },
  openGraph: {
    title: 'Concrete Shed Base Calculator – 8x6, 6x4 & 10x8 Garden Slabs',
    description:
      'Calculate exact 100mm concrete slab volume, 25kg bags, MOT Type 1 hardcore, and timber formwork for 6x4, 8x6, and 10x8 garden shed bases in the UK.',
    url: 'https://concrete-calculator-uk.vercel.app/concrete-shed-base-how-much-do-i-need',
    type: 'article',
    images: [
      {
        url: '/images/shed-base-slab-pouring.jpg',
        width: 1280,
        height: 720,
        alt: 'Level timber formwork frame and compacted stone hardcore ready for pouring a 100mm shed base slab UK',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Concrete Shed Base Calculator – 8x6, 6x4 & 10x8 Garden Slabs',
    description: 'Exact volume math and 25kg bag estimates for standard 6x4, 8x6, and 10x8 garden shed bases.',
    images: ['/images/shed-base-slab-pouring.jpg'],
  },
};

const shedJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://concrete-calculator-uk.vercel.app/concrete-shed-base-how-much-do-i-need#breadcrumb',
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
          name: 'Concrete Shed Base Guide',
          item: 'https://concrete-calculator-uk.vercel.app/concrete-shed-base-how-much-do-i-need',
        },
      ],
    },
    {
      '@type': 'HowTo',
      '@id': 'https://concrete-calculator-uk.vercel.app/concrete-shed-base-how-much-do-i-need#howto',
      name: 'How to Calculate Concrete for a Garden Shed Base',
      description:
        'Step-by-step guide to calculating concrete volume, 25kg bags, and hardcore sub-base for standard UK garden shed bases.',
      image: 'https://concrete-calculator-uk.vercel.app/images/shed-base-slab-pouring.jpg',
      totalTime: 'PT4H',
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'GBP',
        value: '220',
      },
      supply: [
        { '@type': 'HowToSupply', name: '25kg Pre-mixed Concrete bags (or ready-mix)' },
        { '@type': 'HowToSupply', name: 'MOT Type 1 Hardcore Sub-base' },
        { '@type': 'HowToSupply', name: 'Timber formwork boards (100mm x 25mm)' },
        { '@type': 'HowToSupply', name: '1200-gauge Damp Proof Membrane (DPM)' },
      ],
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Excavate and Compact Sub-base',
          text: 'Dig out topsoil to 150-200mm depth and compact 75-100mm of MOT Type 1 crushed stone hardcore with a plate compactor.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Construct Level Timber Formwork',
          text: 'Build sturdy 100mm timber shuttering aligned with stakes every 600mm. Check diagonals to ensure true 90-degree square corners.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Pour Concrete to 100mm Thickness',
          text: 'Pour C20 grade concrete into the frame, tamp down with a tamping beam to remove air pockets, and finish with a float.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://concrete-calculator-uk.vercel.app/concrete-shed-base-how-much-do-i-need#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much concrete do I need for an 8x6 shed base?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'An 8ft × 6ft (2.4m × 1.8m) timber garden shed on a 100mm slab requires approximately 0.43 m³ net, or 0.48 m³ with a 10% waste contingency (roughly 40 bags of 25kg pre-mix concrete).',
          },
        },
        {
          '@type': 'Question',
          name: 'How much concrete do I need for a 10x8 shed base?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A 10ft × 8ft (3.0m × 2.4m) shed base at 100mm depth requires approximately 0.72 m³ net, or 0.80 m³ with 10% waste (approx. 67 bags of 25kg pre-mix concrete).',
          },
        },
        {
          '@type': 'Question',
          name: 'How deep should a concrete shed base be in the UK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For standard wooden garden sheds and workshops up to 12x8, a 100mm (4 inches) concrete slab laid over a 75-100mm compacted MOT Type 1 sub-base is the UK trade standard.',
          },
        },
      ],
    },
  ],
};

export default function ShedBasePage() {
  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shedJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'guides', href: '/blog' },
          { label: 'concrete shed base' },
        ]}
      />

      <article className="post">
        <h1>Concrete Shed Base: How Much Concrete Do You Need?</h1>
        <div className="meta">Published 2026-10-14 &middot; Last updated Oct 2026 &middot; Technical Trade Guide</div>

        {/* Featured Image */}
        <figure style={{ margin: '20px 0 28px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--line)' }}>
          <div style={{ position: 'relative', width: '100%', height: '380px' }}>
            <Image
              src="/images/shed-base-slab-pouring.jpg"
              alt="Timber formwork frame and compacted stone hardcore MOT Type 1 sub-base ready for a 100mm concrete shed base slab pour in a British garden"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 860px"
              style={{ objectFit: 'cover' }}
              referrerPolicy="no-referrer"
            />
          </div>
          <figcaption style={{ padding: '10px 14px', fontSize: '12.5px', color: 'var(--muted)', background: 'var(--surface-elevated)' }}>
            Figure 1: Timber formwork frame (shuttering) staked and braced with a compacted 100mm MOT Type 1 aggregate sub-base, ready for concrete pouring.
          </figcaption>
        </figure>

        <p>
          A solid poured concrete base is the gold standard foundation for timber garden sheds, summerhouses, workshop outbuildings, and garden offices. It creates an immovable, perfectly level, rot-proof platform that keeps timber runners clear of damp soil.
        </p>

        <h2>Shed Base Dimension &amp; Volume Quick Reference Table</h2>
        <p>
          Below are the exact concrete volumes and 25kg pre-mix bag requirements for standard UK shed dimensions based on a standard <strong>100mm (4-inch) slab thickness</strong> with a recommended <strong>10% waste allowance</strong>:
        </p>

        <div className="scroll" style={{ margin: '20px 0' }}>
          <table>
            <thead>
              <tr>
                <th>Shed Size (Imperial)</th>
                <th>Metric Dimensions</th>
                <th>Net Volume</th>
                <th>Total Volume (+10% Waste)</th>
                <th>25kg Pre-Mix Bags</th>
                <th>Estimated Wet Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>6ft &times; 4ft</strong></td>
                <td>1.8m &times; 1.2m &times; 0.10m</td>
                <td>0.216 m³</td>
                <td><strong>0.24 m³</strong></td>
                <td><strong>20 bags</strong></td>
                <td>~0.58 tonnes</td>
              </tr>
              <tr>
                <td><strong>7ft &times; 5ft</strong></td>
                <td>2.1m &times; 1.5m &times; 0.10m</td>
                <td>0.315 m³</td>
                <td><strong>0.35 m³</strong></td>
                <td><strong>29 bags</strong></td>
                <td>~0.84 tonnes</td>
              </tr>
              <tr>
                <td><strong>8ft &times; 6ft</strong> (Most Popular)</td>
                <td>2.4m &times; 1.8m &times; 0.10m</td>
                <td>0.432 m³</td>
                <td><strong>0.48 m³</strong></td>
                <td><strong>40 bags</strong></td>
                <td>~1.15 tonnes</td>
              </tr>
              <tr>
                <td><strong>10ft &times; 8ft</strong> (Workshop)</td>
                <td>3.0m &times; 2.4m &times; 0.10m</td>
                <td>0.720 m³</td>
                <td><strong>0.79 m³</strong></td>
                <td><strong>66 bags</strong></td>
                <td>~1.90 tonnes</td>
              </tr>
              <tr>
                <td><strong>12ft &times; 8ft</strong> (Large Studio)</td>
                <td>3.6m &times; 2.4m &times; 0.10m</td>
                <td>0.864 m³</td>
                <td><strong>0.95 m³</strong></td>
                <td><strong>79 bags</strong></td>
                <td>~2.28 tonnes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Recommended Slab Thickness</h2>
        <p>
          For domestic timber garden sheds (tools, bicycles, lawnmowers), a <strong>100mm (4 inches)</strong> concrete slab is industry standard. For heavy workshops containing machine lathes, heavy cast iron workbenches, or garden offices with double glazing, increase thickness to <strong>125mm to 150mm</strong> and incorporate steel reinforcement mesh (A142 mesh).
        </p>

        <h2>Sub-Base &amp; Formwork Best Practices</h2>
        <ol style={{ paddingLeft: '20px', lineHeight: 1.7 }}>
          <li>
            <strong>Sub-Base Hardcore:</strong> Dig out organic topsoil. Lay and mechanically compact <strong>75mm–100mm of MOT Type 1 crushed stone</strong>. Concrete poured directly on soft soil will crack during winter ground heave.
          </li>
          <li>
            <strong>Damp Proof Membrane (DPM):</strong> Lay a heavy-duty 1200-gauge polythene sheet across the sub-base and lap up the formwork edges. This prevents groundwater rising through the slab and stops moisture draining out of the wet concrete prematurely.
          </li>
          <li>
            <strong>Formwork Construction:</strong> Use straight 100mm &times; 25mm timber boards secured with external stakes every 600mm. Measure diagonal corners to verify the frame is exactly square.
          </li>
        </ol>

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
            Calculate Custom Shed Base in Tool →
          </Link>
        </div>
      </article>
    </div>
  );
}
