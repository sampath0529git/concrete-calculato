import React from 'react';
import Link from 'next/link';

export const BlogCards: React.FC = () => {
  return (
    <div className="cards">
      <Link
        href="/how-many-bags-of-concrete-per-cubic-metre"
        className="card"
      >
        <h3>How Many Bags of Concrete Make 1 Cubic Metre?</h3>
        <p>Quick answer and worked examples for 25kg and 20kg bags, with waste allowance.</p>
      </Link>
      <Link
        href="/concrete-shed-base-how-much-do-i-need"
        className="card"
      >
        <h3>Concrete Shed Base: How Much Concrete Do You Need?</h3>
        <p>Worked example for a 2.4m x 1.8m shed base, plus thickness and sub-base advice.</p>
      </Link>
      <Link
        href="/ready-mix-vs-bagged-concrete"
        className="card"
      >
        <h3>Ready-Mix vs Bagged Concrete: Which Should You Choose?</h3>
        <p>Compare cost, effort and quality for ready-mix and bagged concrete in UK projects.</p>
      </Link>
    </div>
  );
};
