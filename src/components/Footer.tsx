import React from 'react';
import { PageRoute } from '../types';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer>
      <div className="wrap">
        <div>
          <a
            href="/privacy-policy.html"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('privacy');
            }}
          >
            Privacy Policy
          </a>
          {' · '}
          <a
            href="/terms.html"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('terms');
            }}
          >
            Terms
          </a>
          {' · '}
          <a
            href="/contact.html"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('contact');
            }}
          >
            Contact
          </a>
        </div>
        <div style={{ marginTop: '8px' }}>
          Estimates only. Always check with a professional for structural work. &copy; {new Date().getFullYear()} ConcreteCalc.UK
        </div>
      </div>
    </footer>
  );
};
