import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Ready-Mix vs Bagged Concrete: Which Should You Choose? – ConcreteCalc.UK',
  description: 'Compare cost, effort and quality for ready-mix and bagged concrete in UK projects.',
};

export default function ReadyMixVsBaggedPage() {
  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'guides', href: '/blog' },
          { label: 'ready-mix vs bagged' },
        ]}
      />
      <article className="post">
        <h1>Ready-Mix vs Bagged Concrete: Which Should You Choose?</h1>
        <div className="meta">Published 2026-10-14 &middot; ConcreteCalc.UK</div>
        <p>The right choice depends mostly on volume, access and how much labour you have.</p>

        <h2>Bagged concrete</h2>
        <p>
          Best under about 0.5 m³: post holes, repairs and small paths. You can work at your own pace, but mixing is slow and hard on the back.
        </p>

        <h2>Ready-mix</h2>
        <p>
          Delivered mixed and ready to place. It is usually cheaper and more consistent above about 1 m³, but you need access for the lorry, helpers ready, and possibly a pump if the truck cannot get close.
        </p>

        <h2>Small loads</h2>
        <p>
          Many suppliers add a short-load charge for small orders. Ask about mini-mix deliveries for jobs between 1 and 4 m³.
        </p>

        <h2>Next step</h2>
        <p>
          Work out your volume with the <Link href="/">concrete calculator</Link>, then compare a bag total against two or three delivered quotes.
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
            Compare in Calculator →
          </Link>
        </div>
      </article>
    </div>
  );
}
