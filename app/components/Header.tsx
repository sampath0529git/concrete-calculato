'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Calculator, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Read from data-theme attribute on <html> first (initialized by themeInitializerScript) or localStorage
    const currentAttr = typeof document !== 'undefined'
      ? (document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null)
      : null;
    const savedTheme = (typeof window !== 'undefined'
      ? (localStorage.getItem('concretecalc_theme') || localStorage.getItem('theme'))
      : null) as 'light' | 'dark' | null;
    const initialTheme = currentAttr || savedTheme || (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    document.documentElement.style.colorScheme = initialTheme;

    // Cross-tab sync listener
    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === 'concretecalc_theme' || e.key === 'theme') && e.newValue) {
        const next = e.newValue as 'light' | 'dark';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
        document.documentElement.style.colorScheme = next;
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Dynamic OS color scheme change listener if user hasn't explicitly set a preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const explicit = localStorage.getItem('concretecalc_theme') || localStorage.getItem('theme');
      if (!explicit) {
        const autoTheme = e.matches ? 'dark' : 'light';
        setTheme(autoTheme);
        document.documentElement.setAttribute('data-theme', autoTheme);
        document.documentElement.style.colorScheme = autoTheme;
      }
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.documentElement.style.colorScheme = nextTheme;
    try {
      localStorage.setItem('concretecalc_theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: nextTheme } }));
    } catch (e) {}
  };

  const isBlogActive =
    pathname.startsWith('/blog') ||
    pathname === '/how-many-bags-of-concrete-per-cubic-metre' ||
    pathname === '/concrete-shed-base-how-much-do-i-need' ||
    pathname === '/ready-mix-vs-bagged-concrete';

  return (
    <header className="top">
      <div className="wrap">
        {/* Zone 1: Single text element wordmark */}
        <Link className="brand" href="/" onClick={() => setMobileMenuOpen(false)}>
          <span>ConcreteCalc<span className="brand-dot">.</span>UK</span>
        </Link>

        {/* Zone 2: Concise navigation links (Desktop) */}
        <nav className="nav-zone" aria-label="Main navigation">
          <Link
            href="/"
            className={pathname === '/' ? 'active' : ''}
          >
            Calculator
          </Link>
          <Link
            href="/concrete-block-calculator"
            className={pathname === '/concrete-block-calculator' ? 'active' : ''}
          >
            Block Calc
          </Link>
          <Link
            href="/postcrete-calculator"
            className={pathname === '/postcrete-calculator' ? 'active' : ''}
          >
            Postcrete
          </Link>
          <Link
            href="/concrete-weight-converter"
            className={pathname === '/concrete-weight-converter' ? 'active' : ''}
          >
            Converter
          </Link>
          <Link
            href="/blog"
            className={isBlogActive ? 'active' : ''}
          >
            Guides
          </Link>
          <Link
            href="/seo-dashboard"
            className={pathname === '/seo-dashboard' ? 'active' : ''}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <span>SEO Hub</span>
            <span style={{ fontSize: '10px', background: 'var(--accent)', color: '#fff', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
              UK
            </span>
          </Link>
        </nav>

        {/* Zone 3: Theme-aware persistent switch, primary action & mobile menu toggle */}
        <div className="action-zone">
          <div className="theme-switch-wrap">
            <button
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              aria-label={`Current theme is ${theme}. Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="theme-switch-control"
              onClick={toggleTheme}
            >
              <div className="theme-switch-track" aria-hidden="true">
                <span className={`theme-switch-option ${theme === 'light' ? 'active' : ''}`}>
                  <Sun size={13} style={{ color: theme === 'light' ? '#d97706' : undefined }} />
                </span>
                <span className={`theme-switch-option ${theme === 'dark' ? 'active' : ''}`}>
                  <Moon size={13} style={{ color: theme === 'dark' ? '#38bdf8' : undefined }} />
                </span>
                <span className={`theme-switch-thumb ${theme === 'dark' ? 'dark' : 'light'}`} />
              </div>
            </button>
          </div>

          <Link href="/#calculator" className="header-cta-btn">
            <Calculator size={14} aria-hidden="true" />
            <span>Calculate</span>
          </Link>

          <button
            type="button"
            className="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {mobileMenuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-drawer"
          className="mobile-nav-drawer"
          aria-label="Mobile navigation"
        >
          <div className="wrap mobile-nav-wrap">
            <Link
              href="/"
              className={pathname === '/' ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              Concrete Calculator (Home)
            </Link>
            <Link
              href="/concrete-block-calculator"
              className={pathname === '/concrete-block-calculator' ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              Concrete Block Calculator
            </Link>
            <Link
              href="/postcrete-calculator"
              className={pathname === '/postcrete-calculator' ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              Postcrete &amp; Post Calculator
            </Link>
            <Link
              href="/concrete-weight-converter"
              className={pathname === '/concrete-weight-converter' ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              Unit &amp; Weight Converter
            </Link>
            <Link
              href="/blog"
              className={isBlogActive ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              Guides &amp; Worked Examples
            </Link>
            <Link
              href="/seo-dashboard"
              className={pathname === '/seo-dashboard' ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              SEO &amp; Growth Dashboard
            </Link>
            <Link
              href="/about"
              className={pathname === '/about' ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={pathname === '/contact' ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Drawer Dedicated Theme Switch Row */}
            <div className="mobile-theme-section">
              <div className="mobile-theme-info">
                {theme === 'dark' ? (
                  <Moon size={16} color="#38bdf8" aria-hidden="true" />
                ) : (
                  <Sun size={16} color="#d97706" aria-hidden="true" />
                )}
                <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={theme === 'dark'}
                aria-label={`Current theme is ${theme}. Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className="theme-switch-control"
                onClick={toggleTheme}
              >
                <div className="theme-switch-track" aria-hidden="true">
                  <span className={`theme-switch-option ${theme === 'light' ? 'active' : ''}`}>
                    <Sun size={13} style={{ color: theme === 'light' ? '#d97706' : undefined }} />
                  </span>
                  <span className={`theme-switch-option ${theme === 'dark' ? 'active' : ''}`}>
                    <Moon size={13} style={{ color: theme === 'dark' ? '#38bdf8' : undefined }} />
                  </span>
                  <span className={`theme-switch-thumb ${theme === 'dark' ? 'dark' : 'light'}`} />
                </div>
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};
