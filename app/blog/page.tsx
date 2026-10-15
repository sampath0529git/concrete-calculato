import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BlogCards } from '../components/BlogCards';

export const metadata: Metadata = {
  title: 'Concrete Guides & How-Tos – Concrete Calculator UK',
  description: 'Practical, plain-English concrete guides and worked examples for UK DIYers and builders.',
};

export default function BlogPage() {
  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'guides' },
        ]}
      />

      <div className="hero">
        <h1>Concrete Guides &amp; Worked Examples</h1>
        <p className="lead">
          Practical, plain-English advice and worked mix examples for UK DIYers, homeowners, and tradespeople.
        </p>
      </div>

      <BlogCards />

      <div style={{ marginTop: '30px', padding: '20px 0' }}>
        <Link
          href="/"
          className="btn-action"
          style={{ display: 'inline-flex', width: 'auto', padding: '10px 18px' }}
        >
          ← Back to Concrete Calculator
        </Link>
      </div>
    </div>
  );
}
