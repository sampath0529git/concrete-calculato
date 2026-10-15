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
    const savedTheme = localStorage.getItem('concretecalc_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
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
    localStorage.setItem('concretecalc_theme', nextTheme);
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

        {/* Zone 3: 1 primary action & theme toggle + mobile menu toggle */}
        <div className="action-zone">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={mounted ? `Switch to ${theme === 'light' ? 'dark' : 'light'} mode` : 'Toggle theme'}
            aria-label="Toggle theme"
            suppressHydrationWarning
          >
            {mounted && theme === 'dark' ? (
              <>
                <Sun size={14} aria-hidden="true" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={14} aria-hidden="true" />
                <span>Dark</span>
              </>
            )}
          </button>

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
              href="/#unit-converter"
              onClick={() => setMobileMenuOpen(false)}
            >
              Unit &amp; Volume Converter
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
          </div>
        </nav>
      )}
    </header>
  );
};
