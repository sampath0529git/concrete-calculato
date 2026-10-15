import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

interface GuideItem {
  href: string;
  title: string;
  description: string;
  readTime: string;
}

const GUIDES: GuideItem[] = [
  {
    href: '/how-many-bags-of-concrete-per-cubic-metre',
    title: 'How Many Bags of Concrete Make 1 Cubic Metre?',
    description: 'Exact math and worked examples for 25kg and 20kg bags, including realistic waste allowances.',
    readTime: '4 min read',
  },
  {
    href: '/concrete-block-calculator',
    title: 'Concrete Block Calculator UK: 440×215mm Blocks per m²',
    description: 'Calculate 10 blocks/m², building sand, cement bags, and mortar for single skin and cavity walls.',
    readTime: '5 min read',
  },
  {
    href: '/postcrete-calculator',
    title: 'Postcrete & Fence Post Concrete: How Many Bags per Post?',
    description: 'UK depth rules of thumb, hole volume formulas, and rapid-set Postcrete bag requirements.',
    readTime: '4 min read',
  },
  {
    href: '/concrete-shed-base-how-much-do-i-need',
    title: 'Concrete Shed Base: How Much Concrete Do You Need?',
    description: 'Complete calculation for standard 6x4 and 8x6 sheds, plus depth, sub-base, and formwork guidance.',
    readTime: '5 min read',
  },
  {
    href: '/ready-mix-vs-bagged-concrete',
    title: 'Ready-Mix vs Bagged Concrete: Which Should You Choose?',
    description: 'Compare cost, labor intensity, and short-load fees for UK domestic projects.',
    readTime: '6 min read',
  },
];

export const BlogCards: React.FC = () => {
  return (
    <div className="cards">
      {GUIDES.map((g) => (
        <Link key={g.href} href={g.href} className="card">
          <h3>{g.title}</h3>
          <p>{g.description}</p>
          <div className="card-meta">
            <span>{g.readTime}</span>
            <span aria-hidden="true">&middot;</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              Read guide <ArrowRight size={13} aria-hidden="true" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};
