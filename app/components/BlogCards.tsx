import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export interface GuideItem {
  href: string;
  title: string;
  description: string;
  readTime: string;
  image: string;
  alt: string;
  tag: string;
}

export const GUIDES: GuideItem[] = [
  {
    href: '/how-many-bags-of-concrete-per-cubic-metre',
    title: 'How Many Bags of Concrete Make 1 Cubic Metre?',
    description: 'Exact math and worked examples for 25kg and 20kg bags, including realistic waste allowances.',
    readTime: '4 min read',
    image: '/images/how-many-bags-of-concrete-per-cubic-metre.jpg',
    alt: 'Stacked 25kg pre-mix concrete bags on a pallet next to a builder wheelbarrow to calculate bags needed per cubic metre',
    tag: 'Procurement Guide',
  },
  {
    href: '/concrete-shed-base-how-much-do-i-need',
    title: 'Concrete Shed Base: How Much Concrete Do You Need?',
    description: 'Complete calculation for standard 6x4 and 8x6 sheds, plus depth, sub-base, and formwork guidance.',
    readTime: '5 min read',
    image: '/images/shed-base-slab-pouring.jpg',
    alt: 'Level timber formwork frame and compacted MOT Type 1 hardcore sub-base ready for a 100mm concrete shed base slab pour',
    tag: 'Worked Example',
  },
  {
    href: '/ready-mix-vs-bagged-concrete',
    title: 'Ready-Mix vs Bagged Concrete: Which Should You Choose?',
    description: 'Compare cost, labor intensity, and short-load fees for UK domestic projects.',
    readTime: '6 min read',
    image: '/images/ready-mix-vs-bagged-concrete-truck.jpg',
    alt: 'Volumetric ready-mix concrete lorry chute discharging fresh wet C25 concrete into a domestic trench foundation',
    tag: 'Cost Analysis',
  },
  {
    href: '/concrete-block-calculator',
    title: 'Concrete Block Calculator UK: 440×215mm Blocks per m²',
    description: 'Calculate 10 blocks/m², building sand, cement bags, and mortar for single skin and cavity walls.',
    readTime: '5 min read',
    image: '/images/concrete-block-calculator.jpg',
    alt: 'Standard British 440mm by 215mm dense concrete blocks laid with mortar joints for a retaining wall - Concrete Block Calculator UK',
    tag: 'Trade Calculator',
  },
  {
    href: '/postcrete-calculator',
    title: 'Postcrete & Fence Post Concrete: How Many Bags per Post?',
    description: 'UK depth rules of thumb, hole volume formulas, and rapid-set Postcrete bag requirements.',
    readTime: '4 min read',
    image: '/images/postcrete-fence-post-calculator.jpg',
    alt: 'Installing a square timber fence post in ground hole using rapid-setting Postcrete and water according to UK depth rules',
    tag: 'Fencing Guide',
  },
];

export const BlogCards: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '22px',
        margin: '24px 0',
      }}
    >
      {GUIDES.map((g) => (
        <Link
          key={g.href}
          href={g.href}
          className="card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            padding: 0,
            textDecoration: 'none',
            borderRadius: '12px',
            border: '1px solid var(--line)',
            background: 'var(--surface)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          }}
        >
          {/* SEO Thumbnail Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '180px',
              overflow: 'hidden',
              background: 'var(--surface-elevated)',
            }}
          >
            <Image
              src={g.image}
              alt={g.alt}
              fill
              sizes="(max-width: 768px) 100vw, 360px"
              style={{ objectFit: 'cover' }}
              referrerPolicy="no-referrer"
            />
            <span
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(15, 23, 42, 0.82)',
                color: '#ffffff',
                backdropFilter: 'blur(6px)',
                padding: '3px 9px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}
            >
              {g.tag}
            </span>
          </div>

          {/* Content Body */}
          <div
            style={{
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <h3
              style={{
                margin: '0 0 8px',
                fontSize: '16.5px',
                lineHeight: 1.35,
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              {g.title}
            </h3>
            <p
              style={{
                margin: '0 0 16px',
                fontSize: '13.5px',
                lineHeight: 1.5,
                color: 'var(--muted)',
                flex: 1,
              }}
            >
              {g.description}
            </p>
            <div
              className="card-meta"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--line)',
                fontSize: '12.5px',
                color: 'var(--muted)',
              }}
            >
              <span>{g.readTime}</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--calc-blue)',
                  fontWeight: 600,
                }}
              >
                Read Guide <ArrowRight size={13} aria-hidden="true" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
