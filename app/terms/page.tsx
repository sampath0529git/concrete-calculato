import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms of Use – ConcreteCalc.UK',
  description: 'Terms of use and disclaimer for ConcreteCalc.UK concrete estimation tools.',
};

export default function TermsPage() {
  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'terms of use' },
        ]}
      />
      <div className="post">
        <h1>Terms of use</h1>
        <p>
          The calculators and guides on this site are provided for general information only. Results are estimates and are not a professional or structural specification. You use the site at your own risk and should confirm quantities and prices with your supplier or a qualified professional. We are not liable for losses arising from reliance on the estimates.
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
