import React from 'react';
import { PageRoute } from '../types';
import { BlogCards } from './BlogCards';

interface BlogIndexProps {
  onNavigate: (page: PageRoute) => void;
}

export const BlogIndex: React.FC<BlogIndexProps> = ({ onNavigate }) => {
  return (
    <div className="wrap">
      <div className="hero">
        <h1>Concrete guides</h1>
        <p className="lead">
          Practical, plain-English advice for UK DIYers and tradespeople.
        </p>
      </div>

      <BlogCards onNavigate={onNavigate} />

      <div style={{ marginTop: '30px', padding: '20px 0' }}>
        <button
          type="button"
          className="btn-action"
          style={{ display: 'inline-flex', width: 'auto', padding: '10px 18px' }}
          onClick={() => onNavigate('calculator')}
        >
          ← Back to Concrete Calculator
        </button>
      </div>
    </div>
  );
};
