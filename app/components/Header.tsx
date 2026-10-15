'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('concretecalc_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('concretecalc_theme', nextTheme);
  };

  const isBlogActive = pathname.startsWith('/blog') ||
    pathname === '/how-many-bags-of-concrete-per-cubic-metre' ||
    pathname === '/concrete-shed-base-how-much-do-i-need' ||
    pathname === '/ready-mix-vs-bagged-concrete';

  return (
    <header className="top">
      <div className="wrap">
        <Link className="brand" href="/">
          <span>
            ConcreteCalc<span style={{ color: 'var(--accent)' }}>.</span>UK
          </span>
        </Link>
        <nav aria-label="Main">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            Calculator
          </Link>
          <Link
            href="/#unit-converter"
            className="nav-link"
          >
            Converter
          </Link>
          <Link
            href="/blog"
            className={`nav-link ${isBlogActive ? 'active' : ''}`}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className={`nav-link ${pathname === '/about' ? 'active' : ''}`}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}
          >
            Contact
          </Link>
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
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
