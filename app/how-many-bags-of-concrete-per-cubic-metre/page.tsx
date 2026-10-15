import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'How Many Bags of Concrete Make 1 Cubic Metre? – ConcreteCalc.UK',
  description: 'Quick answer and worked examples for 25kg and 20kg bags, with waste allowance.',
};

export default function BagsPerCubicMetrePage() {
  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'guides', href: '/blog' },
          { label: 'bags per cubic metre' },
        ]}
      />
      <article className="post">
        <h1>How Many Bags of Concrete Make 1 Cubic Metre?</h1>
        <div className="meta">Published 2026-10-14 &middot; ConcreteCalc.UK</div>
        <p>
          <strong>Short answer:</strong> about 83 bags of 25kg mix make one cubic metre, or around 105 bags of 20kg mix. Yields vary slightly by brand, so check the yield printed on the bag.
        </p>

        <h2>The sum</h2>
        <p>
          A 25kg bag of dry mix yields about 0.012 m³ of wet concrete. Divide your volume by that number:{' '}
          <em>bags = volume ÷ 0.012</em>. For 0.9 m³ (a 3m × 3m slab at 100mm) that is 75 bags, or 83 with 10% waste.
        </p>

        <h2>Why round up</h2>
        <p>
          Always round up to whole bags and add 5–10% for uneven ground and spillage. Running out mid-pour can leave a weak joint where fresh concrete meets concrete that has already started to set.
        </p>

        <h2>When bags stop making sense</h2>
        <p>
          Mixing 80+ bags by hand is a full day of heavy work. For anything over about 1 m³, get a ready-mix or mini-mix quote as well. Use our{' '}
          <Link href="/">concrete calculator</Link> to compare both.
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
            style={{ display: 'inline-flex', width: 'auto', padding: '8px 16px' }}
          >
            Open Concrete Calculator →
          </Link>
        </div>
      </article>
    </div>
  );
}
