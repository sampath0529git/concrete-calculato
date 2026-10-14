import React from 'react';
import { PageRoute } from '../types';

interface BlogPostProps {
  slug: string;
  onNavigate: (page: PageRoute) => void;
}

export const BlogPost: React.FC<BlogPostProps> = ({ slug, onNavigate }) => {
  if (slug === 'how-many-bags-of-concrete-per-cubic-metre') {
    return (
      <div className="wrap">
        <article className="post">
          <div style={{ marginBottom: '14px' }}>
            <button
              type="button"
              className="btn-action"
              style={{ display: 'inline-flex', width: 'auto', padding: '6px 12px' }}
              onClick={() => onNavigate('blog')}
            >
              ← All guides
            </button>
          </div>
          <h1>How Many Bags of Concrete Make 1 Cubic Metre?</h1>
          <div className="meta">Published 2026-10-14 &middot; ConcreteCalc.UK</div>
          <p>
            <strong>Short answer:</strong> about 83 bags of 25kg mix make one cubic metre, or around 105 bags of 20kg mix. Yields vary slightly by brand, so check the yield printed on the bag.
          </p>

          <h2>The sum</h2>
          <p>
            A 25kg bag of dry mix yields about 0.012 m³ of wet concrete. Divide your volume by that number:{' '}
            <em>bags = volume ÷ 0.012</em>. For 0.9 m³ (a 3m × 3m slab at 100mm) that is 75 bags, or 83 with 10% waste.
          </p>

          <h2>Why round up</h2>
          <p>
            Always round up to whole bags and add 5–10% for uneven ground and spillage. Running out mid-pour can leave a weak joint where fresh concrete meets concrete that has already started to set.
          </p>

          <h2>When bags stop making sense</h2>
          <p>
            Mixing 80+ bags by hand is a full day of heavy work. For anything over about 1 m³, get a ready-mix or mini-mix quote as well. Use our{' '}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('calculator');
              }}
            >
              concrete calculator
            </a>{' '}
            to compare both.
          </p>

          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
            <button
              type="button"
              className="btn-action"
              style={{ display: 'inline-flex', width: 'auto', padding: '8px 16px' }}
              onClick={() => onNavigate('blog')}
            >
              ← Back to All Guides
            </button>
            <button
              type="button"
              className="btn-action"
              style={{ display: 'inline-flex', width: 'auto', padding: '8px 16px', marginLeft: '12px' }}
              onClick={() => onNavigate('calculator')}
            >
              Open Concrete Calculator →
            </button>
          </div>
        </article>
      </div>
    );
  }

  if (slug === 'concrete-shed-base-how-much-do-i-need') {
    return (
      <div className="wrap">
        <article className="post">
          <div style={{ marginBottom: '14px' }}>
            <button
              type="button"
              className="btn-action"
              style={{ display: 'inline-flex', width: 'auto', padding: '6px 12px' }}
              onClick={() => onNavigate('blog')}
            >
              ← All guides
            </button>
          </div>
          <h1>Concrete Shed Base: How Much Concrete Do You Need?</h1>
          <div className="meta">Published 2026-10-14 &middot; ConcreteCalc.UK</div>
          <p>
            A concrete base should be level, strong and slightly larger than the shed it carries. Most garden sheds sit well on a 100mm slab.
          </p>

          <h2>Worked example: 2.4m × 1.8m base</h2>
          <p>
            2.4 × 1.8 × 0.1 = <strong>0.432 m³</strong>. Add 10% waste and you need about 0.475 m³, which is roughly <strong>40 bags</strong> of 25kg mix.
          </p>

          <h2>Thickness</h2>
          <p>
            100mm is typical for sheds and small outbuildings. Heavier workshops or garages may need more; check the manufacturer&apos;s advice.
          </p>

          <h2>Sub-base and formwork</h2>
          <p>
            Dig out topsoil, compact 75–100mm of hardcore, and build level timber formwork. A firm sub-base helps prevent cracking and keeps your volume estimate accurate. Once you know your dimensions, enter them in our{' '}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('calculator');
              }}
            >
              calculator
            </a>{' '}
            for bags and cost.
          </p>

          <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
            <button
              type="button"
              className="btn-action"
              style={{ display: 'inline-flex', width: 'auto', padding: '8px 16px' }}
              onClick={() => onNavigate('blog')}
            >
              ← Back to All Guides
            </button>
            <button
              type="button"
              className="btn-action"
              style={{ display: 'inline-flex', width: 'auto', padding: '8px 16px', marginLeft: '12px' }}
              onClick={() => onNavigate('calculator')}
            >
              Calculate Shed Base →
            </button>
          </div>
        </article>
      </div>
    );
  }

  // ready-mix-vs-bagged-concrete
  return (
    <div className="wrap">
      <article className="post">
        <div style={{ marginBottom: '14px' }}>
          <button
            type="button"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '6px 12px' }}
            onClick={() => onNavigate('blog')}
          >
            ← All guides
          </button>
        </div>
        <h1>Ready-Mix vs Bagged Concrete: Which Should You Choose?</h1>
        <div className="meta">Published 2026-10-14 &middot; ConcreteCalc.UK</div>
        <p>The right choice depends mostly on volume, access and how much labour you have.</p>

        <h2>Bagged concrete</h2>
        <p>
          Best under about 0.5 m³: post holes, repairs and small paths. You can work at your own pace, but mixing is slow and hard on the back.
        </p>

        <h2>Ready-mix</h2>
        <p>
          Delivered mixed and ready to place. It is usually cheaper and more consistent above about 1 m³, but you need access for the lorry, helpers ready, and possibly a pump if the truck cannot get close.
        </p>

        <h2>Small loads</h2>
        <p>
          Many suppliers add a short-load charge for small orders. Ask about mini-mix deliveries for jobs between 1 and 4 m³.
        </p>

        <h2>Next step</h2>
        <p>
          Work out your volume with the{' '}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('calculator');
            }}
          >
            concrete calculator
          </a>
          , then compare a bag total against two or three delivered quotes.
        </p>

        <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--line)' }}>
          <button
            type="button"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '8px 16px' }}
            onClick={() => onNavigate('blog')}
          >
            ← Back to All Guides
          </button>
          <button
            type="button"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '8px 16px', marginLeft: '12px' }}
            onClick={() => onNavigate('calculator')}
          >
            Compare in Calculator →
          </button>
        </div>
      </article>
    </div>
  );
};
