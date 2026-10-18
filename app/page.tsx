import React from 'react';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Calculator } from './components/Calculator';
import { UnitConverter } from './components/UnitConverter';
import { GuideSection } from './components/GuideSection';
import { FaqSection } from './components/FaqSection';
import { BlogCards } from './components/BlogCards';
import { BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="wrap">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'other calculators', href: '#unit-converter' },
          { label: 'concrete calculator' },
        ]}
      />

      {/* Hero section */}
      <div className="hero">
        <h1>Concrete Calculator</h1>
        <p className="lead">
          The Concrete Calculator estimates the volume, bags, and weight of concrete necessary to cover a given area. Purchasing slightly more concrete than the estimated result (5%–10% waste) can reduce the probability of having insufficient concrete.
        </p>

        {/* Quick jump tool pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
          <a href="/concrete-block-calculator" className="calc-preset-tag" style={{ textDecoration: 'none' }}>
            🧱 Concrete Block Calculator (440×215mm)
          </a>
          <a href="/postcrete-calculator" className="calc-preset-tag" style={{ textDecoration: 'none' }}>
            🪵 Postcrete &amp; Fence Post Calc
          </a>
          <a href="/concrete-weight-converter" className="calc-preset-tag" style={{ textDecoration: 'none' }}>
            ⚖️ Concrete Weight &amp; Unit Converter
          </a>
        </div>
      </div>

      {/* The Concrete Calculators (Slabs, Holes, Tubes, Curbs, Stairs) */}
      <Calculator />

      {/* Other Calculators & Unit Converter Section */}
      <div id="unit-converter">
        <UnitConverter />
      </div>

      {/* Guides, Worked Examples & FAQs */}
      <article>
        <GuideSection />
        <FaqSection />
        <section className="c">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <BookOpen size={15} aria-hidden="true" />
            <span>Practical UK Builder Guides</span>
          </div>
          <h2>Latest Concrete Guides &amp; Worked Examples</h2>
          <BlogCards />
        </section>
      </article>
    </div>
  );
}
