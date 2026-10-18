import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="wrap">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', paddingBottom: '20px' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--ink)', marginBottom: '8px' }}>
              ConcreteCalc<span style={{ color: 'var(--accent)' }}>.</span>UK
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--muted)', lineHeight: '1.5', margin: 0 }}>
              Independent UK construction calculation platform adhering to British Standards BS 8500, BS EN 206, and BS EN 771-3.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              UK Calculators
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <Link href="/">Concrete Calculator (m³ &amp; Bags)</Link>
              <Link href="/concrete-block-calculator">Concrete Block Calculator</Link>
              <Link href="/postcrete-calculator">Postcrete &amp; Fence Post Calc</Link>
              <Link href="/concrete-weight-converter">Concrete Unit &amp; Weight Converter</Link>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Guides &amp; Worked Examples
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <Link href="/how-many-bags-of-concrete-per-cubic-metre">Bags of Concrete in 1m³</Link>
              <Link href="/concrete-shed-base-how-much-do-i-need">Shed Base Volume Guide</Link>
              <Link href="/ready-mix-vs-bagged-concrete">Ready-Mix vs Bagged Concrete</Link>
              <Link href="/blog">All Construction Guides</Link>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--ink)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Platform &amp; SEO
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
              <Link href="/seo-dashboard">UK SEO &amp; Growth Dashboard</Link>
              <Link href="/about">About &amp; Methodology</Link>
              <Link href="/contact">Contact &amp; Feedback</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Use</Link>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', fontSize: '12px', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> ConcreteCalc.UK. All rights reserved. Calculations are estimates; verify with supplier before placing orders.
          </div>
          <div>
            UK Domestic Concrete Density: 2,350 &ndash; 2,450 kg/m³
          </div>
        </div>
      </div>
    </footer>
  );
};
