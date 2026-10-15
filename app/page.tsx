import React from 'react';
import { Calculator } from './components/Calculator';
import { UnitConverter } from './components/UnitConverter';
import { GuideSection } from './components/GuideSection';
import { FaqSection } from './components/FaqSection';
import { BlogCards } from './components/BlogCards';

export default function HomePage() {
  return (
    <div className="wrap">
      <div className="hero">
        <div className="badge-calc">
          <span>✨</span> Smart Concrete Estimator &amp; Converter
        </div>
        <h1>Concrete calculator UK</h1>
        <p className="lead">
          Enter your measurements in metres or feet/inches to get cubic metres, 25kg bags, weight and an estimated cost for slabs, shed bases, footings, post holes and steps.
        </p>
      </div>

      <Calculator />

      <UnitConverter />

      <article>
        <GuideSection />
        <FaqSection />
        <section className="c">
          <h2>Latest concrete guides</h2>
          <BlogCards />
        </section>
      </article>
    </div>
  );
}
