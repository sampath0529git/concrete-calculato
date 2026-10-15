import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Concrete Shed Base: How Much Concrete Do You Need? – ConcreteCalc.UK',
  description: 'Worked example for a 2.4m x 1.8m shed base, plus thickness and sub-base advice.',
};

export default function ShedBasePage() {
  return (
    <div className="wrap">
      <article className="post">
        <div style={{ marginBottom: '14px' }}>
          <Link
            href="/blog"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '6px 12px' }}
          >
            ← All guides
          </Link>
        </div>
        <h1>Concrete Shed Base: How Much Concrete Do You Need?</h1>
        <div className="meta">Published 2026-10-14 &middot; ConcreteCalc.UK</div>
        <p>
          A concrete base should be level, strong and slightly larger than the shed it carries. Most garden sheds sit well on a 100mm slab.
        </p>

        <h2>Worked example: 2.4m × 1.8m base</h2>
        <p>
          2.4 × 1.8 × 0.1 = <strong>0.432 m³</strong>. Add 10% waste and you need about 0.475 m³, which is roughly <strong>40 bags</strong> of 25kg mix.
        </p>

        <h2>Thickness</h2>
        <p>
          100mm is typical for sheds and small outbuildings. Heavier workshops or garages may need more; check the manufacturer&apos;s advice.
        </p>

        <h2>Sub-base and formwork</h2>
        <p>
          Dig out topsoil, compact 75–100mm of hardcore, and build level timber formwork. A firm sub-base helps prevent cracking and keeps your volume estimate accurate. Once you know your dimensions, enter them in our{' '}
          <Link href="/">calculator</Link> for bags and cost.
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
            Calculate Shed Base →
          </Link>
        </div>
      </article>
    </div>
  );
}
