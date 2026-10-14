import React from 'react';
import { PageRoute } from '../types';

interface HeaderProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="top">
      <div className="wrap">
        <a
          className="brand"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('calculator');
          }}
        >
          <span>ConcreteCalc<span style={{ color: 'var(--accent)' }}>.</span>UK</span>
        </a>
        <nav aria-label="Main">
          <button
            type="button"
            className={`nav-link ${currentPage === 'calculator' ? 'active' : ''}`}
            onClick={() => onNavigate('calculator')}
          >
            Calculator
          </button>
          <button
            type="button"
            className={`nav-link ${
              currentPage === 'blog' ||
              currentPage === 'how-many-bags-of-concrete-per-cubic-metre' ||
              currentPage === 'concrete-shed-base-how-much-do-i-need' ||
              currentPage === 'ready-mix-vs-bagged-concrete'
                ? 'active'
                : ''
            }`}
            onClick={() => onNavigate('blog')}
          >
            Blog
          </button>
          <button
            type="button"
            className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => onNavigate('about')}
          >
            About
          </button>
          <button
            type="button"
            className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
            onClick={() => onNavigate('contact')}
          >
            Contact
          </button>
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </nav>
      </div>
    </header>
  );
};
