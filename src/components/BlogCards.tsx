import React from 'react';
import { PageRoute } from '../types';

interface BlogCardsProps {
  onNavigate: (page: PageRoute) => void;
}

export const BlogCards: React.FC<BlogCardsProps> = ({ onNavigate }) => {
  return (
    <div className="cards">
      <div
        className="card"
        onClick={() => onNavigate('how-many-bags-of-concrete-per-cubic-metre')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onNavigate('how-many-bags-of-concrete-per-cubic-metre');
        }}
      >
        <h3>How Many Bags of Concrete Make 1 Cubic Metre?</h3>
        <p>Quick answer and worked examples for 25kg and 20kg bags, with waste allowance.</p>
      </div>
      <div
        className="card"
        onClick={() => onNavigate('concrete-shed-base-how-much-do-i-need')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onNavigate('concrete-shed-base-how-much-do-i-need');
        }}
      >
        <h3>Concrete Shed Base: How Much Concrete Do You Need?</h3>
        <p>Worked example for a 2.4m x 1.8m shed base, plus thickness and sub-base advice.</p>
      </div>
      <div
        className="card"
        onClick={() => onNavigate('ready-mix-vs-bagged-concrete')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onNavigate('ready-mix-vs-bagged-concrete');
        }}
      >
        <h3>Ready-Mix vs Bagged Concrete: Which Should You Choose?</h3>
        <p>Compare cost, effort and quality for ready-mix and bagged concrete in UK projects.</p>
      </div>
    </div>
  );
};
