import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from './components/Breadcrumbs';

export default function NotFound() {
  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: '404 not found' },
        ]}
      />
      <div className="hero" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>404 – Page Not Found</h1>
        <p className="lead" style={{ maxWidth: '600px', margin: '0 auto 24px' }}>
          The page or calculator you are looking for does not exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-action" style={{ background: 'var(--calc-blue)', color: '#fff', padding: '10px 20px' }}>
            Go to Concrete Calculator
          </Link>
          <Link href="/blog" className="btn-action" style={{ padding: '10px 20px' }}>
            View Concrete Guides
          </Link>
        </div>
      </div>
    </div>
  );
}
