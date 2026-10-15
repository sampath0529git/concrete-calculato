import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="wrap">
        <div>
          <Link href="/privacy">Privacy Policy</Link>
          {' · '}
          <Link href="/terms">Terms</Link>
          {' · '}
          <Link href="/contact">Contact</Link>
        </div>
        <div style={{ marginTop: '8px' }}>
          Estimates only. Always check with a professional for structural work. &copy; {new Date().getFullYear()} ConcreteCalc.UK
        </div>
      </div>
    </footer>
  );
};
