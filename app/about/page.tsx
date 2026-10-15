import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About Us – ConcreteCalc.UK',
  description: 'About ConcreteCalc.UK, free concrete volume and cost calculators for UK homeowners and tradespeople.',
};

export default function AboutPage() {
  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'about us' },
        ]}
      />
      <div className="post">
        <h1>About us</h1>
        <p>
          ConcreteCalc.UK provides free, easy-to-use concrete calculators and guides for homeowners and tradespeople in the UK.
        </p>
        <h2>How we calculate</h2>
        <p>
          Volume is length × width × thickness in metres. A 25kg bag is assumed to yield about 0.012 m³, and wet concrete weighs roughly 2.4 tonnes per m³. We add a waste allowance you can change.
        </p>
        <h2>Accuracy</h2>
        <p>
          Results are estimates. Site conditions, mix brand and supplier all affect real quantities, so check with your supplier before ordering.
        </p>

        <div style={{ marginTop: '32px' }}>
          <Link
            href="/"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '8px 16px' }}
          >
            ← Back to Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
