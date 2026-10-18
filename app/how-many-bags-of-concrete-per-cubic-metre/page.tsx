import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'How Many Bags of Concrete in 1 Cubic Metre? (25kg & 20kg Exact Math)',
  description:
    'Exact UK math for 25kg (~83 bags) and 20kg (~105 bags) pre-mix concrete per cubic metre (m³). Includes 10% waste allowance formulas and ballast mix ratios.',
  keywords: [
    'how many bags of concrete per cubic metre',
    'how many 25kg bags of concrete in 1m3',
    'bags of concrete per m3',
    'how many bags of concrete do i need for 1m3',
    'concrete bags to m3 calculator uk',
    '25kg concrete bag yield m3',
    'how much ballast and cement for 1m3',
    'bags of concrete in a cube',
  ],
  alternates: {
    canonical: '/how-many-bags-of-concrete-per-cubic-metre',
  },
  openGraph: {
    title: 'How Many Bags of Concrete in 1 Cubic Metre? (25kg & 20kg Exact Math)',
    description:
      'Exact math and worked examples for 25kg (~83 bags) and 20kg (~105 bags) pre-mix concrete to make 1 cubic metre (m³) with UK waste allowance.',
    url: 'https://concretecalc.co.uk/how-many-bags-of-concrete-per-cubic-metre',
    type: 'article',
    images: [
      {
        url: '/images/how-many-bags-of-concrete-per-cubic-metre.jpg',
        width: 1280,
        height: 720,
        alt: 'Stacked 25kg bags of Blue Circle and Hanson pre-mix concrete on a wooden pallet next to a builder wheelbarrow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Many Bags of Concrete in 1 Cubic Metre? (25kg & 20kg Math)',
    description: 'Exact math and worked examples for 25kg (~83 bags) and 20kg (~105 bags) per cubic metre.',
    images: ['/images/how-many-bags-of-concrete-per-cubic-metre.jpg'],
  },
};

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  headline: 'How Many Bags of Concrete Make 1 Cubic Metre?',
  description:
    'Exact calculations for standard 25kg and 20kg pre-mix concrete bags required per cubic metre with UK trade waste factors.',
  image: 'https://concretecalc.uk/images/how-many-bags-of-concrete-per-cubic-metre.jpg',
  author: {
    '@type': 'Organization',
    name: 'ConcreteCalc.UK',
    url: 'https://concretecalc.uk',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ConcreteCalc.UK',
    logo: {
      '@type': 'ImageObject',
      url: 'https://concretecalc.uk/images/concrete-background.webp',
    },
  },
  datePublished: '2026-10-14',
  dateModified: '2026-10-15',
  inLanguage: 'en-GB',
};

export default function BagsPerCubicMetrePage() {
  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'guides', href: '/blog' },
          { label: 'bags per cubic metre' },
        ]}
      />

      <article className="post">
        <h1>How Many Bags of Concrete Make 1 Cubic Metre?</h1>
        <div className="meta">Published 2026-10-14 &middot; Last updated Oct 2026 &middot; Technical Trade Guide</div>

        {/* Featured SEO Image */}
        <figure style={{ margin: '20px 0 28px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--line)' }}>
          <div style={{ position: 'relative', width: '100%', height: '380px' }}>
            <Image
              src="/images/how-many-bags-of-concrete-per-cubic-metre.jpg"
              alt="Stacked 25kg pre-mix concrete bags on wooden pallet beside a builder wheelbarrow on a UK residential project - How Many Bags of Concrete Make 1 Cubic Metre"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 860px"
              style={{ objectFit: 'cover' }}
              referrerPolicy="no-referrer"
            />
          </div>
          <figcaption style={{ padding: '10px 14px', fontSize: '12.5px', color: 'var(--muted)', background: 'var(--surface-elevated)' }}>
            Figure 1: Standard 25kg pre-mix dry concrete bags stacked on a timber pallet (56 bags/pallet) on a UK building site. Each bag yields ~0.012 m³ wet concrete.
          </figcaption>
        </figure>

        <p>
          <strong>Short answer:</strong> It takes approximately <strong>83 bags of 25kg pre-mix concrete</strong> to make one cubic metre (1 m³), or around <strong>105 bags of 20kg pre-mix</strong>. Yields vary slightly by manufacturer (e.g. Hanson, Blue Circle, Tarmac), so always check the stamped bag yield.
        </p>

        <div style={{ background: 'var(--accent-subtle)', borderLeft: '4px solid var(--accent)', padding: '14px 18px', borderRadius: '4px', margin: '20px 0' }}>
          <strong>Quick Formula:</strong>
          <div style={{ fontSize: '15px', fontFamily: 'monospace', marginTop: '6px' }}>
            Number of 25kg Bags = Concrete Volume in m³ &divide; 0.012 m³
          </div>
          <div style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginTop: '4px' }}>
            For 1.0 m³ net: 1 &divide; 0.012 = 83.3 bags &rarr; <strong>84 bags</strong> (or <strong>92 bags with 10% waste</strong>).
          </div>
        </div>

        {/* Cross-Link Callout to Standalone Converter */}
        <div
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--accent)',
            borderRadius: '8px',
            padding: '16px 20px',
            margin: '24px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--ink)', marginBottom: '3px' }}>
              Need to convert tonnes, kilograms or wheelbarrows to bags?
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
              Use our dedicated UK Concrete Weight &amp; Unit Converter with live BS 8500 density matrix.
            </div>
          </div>
          <Link
            href="/concrete-weight-converter"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Launch Weight Converter &rarr;
          </Link>
        </div>

        <h2>The sum: How the math works</h2>
        <p>
          A standard UK 25kg dry mix bag yields approximately 0.012 m³ (12 litres) of compacted wet concrete. To calculate how many bags your job needs:
        </p>
        <ol style={{ paddingLeft: '20px', lineHeight: 1.7 }}>
          <li>Measure your length, width, and depth in metres.</li>
          <li>Multiply length &times; width &times; depth = volume in cubic metres (m³).</li>
          <li>Divide the total m³ by <strong>0.012</strong> (for 25kg bags) or <strong>0.0095</strong> (for 20kg bags).</li>
          <li>Multiply by 1.10 to add a 10% safety margin for ground dips and spillage.</li>
        </ol>

        <h2>Worked Example: 3m &times; 3m Patio Slab (100mm depth)</h2>
        <p>
          Let&apos;s look at a typical domestic patio slab measuring 3 metres by 3 metres at 100mm (0.1m) thickness:
        </p>
        <ul>
          <li><strong>Net Volume:</strong> 3.0m &times; 3.0m &times; 0.1m = <strong>0.90 m³</strong></li>
          <li><strong>Exact 25kg Bags:</strong> 0.90 &divide; 0.012 = <strong>75 bags</strong></li>
          <li><strong>With 10% Contingency (0.99 m³):</strong> 75 &times; 1.10 = <strong>83 bags</strong></li>
          <li><strong>Wet Weight:</strong> 0.99 m³ &times; 2.4 tonnes/m³ = <strong>2.38 tonnes</strong></li>
        </ul>

        <h2>Why rounding up and adding waste is essential</h2>
        <p>
          Ground excavations are never laser-level, timber formwork flexes outward under the pressure of wet concrete, and material sticks to wheelbarrows and shovels. Running out even two bags short creates an accidental cold joint, where freshly poured concrete cures against partially set concrete, creating a structural fracture line.
        </p>

        <h2>When bags stop making financial sense</h2>
        <p>
          Mixing 80+ bags by hand or with a small Belle mixer is a punishing full-day job for 2–3 people. Generally, for jobs requiring <strong>more than 0.75 m³ to 1.0 m³</strong>, delivered volumetric or ready-mix concrete truck delivery is cheaper, guaranteed to meet BS 8500 strength grades (C20/C25), and pours in under 20 minutes.
        </p>

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
            Calculate in Live Tool →
          </Link>
        </div>
      </article>
    </div>
  );
}
