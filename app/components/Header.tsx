'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Monitor, Calculator, Menu, X } from 'lucide-react';

type ThemeMode = 'light' | 'dark' | 'system';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [themeSetting, setThemeSetting] = useState<ThemeMode>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    const getSystemPreference = (): 'light' | 'dark' => {
      return typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    };

    // Read stored setting or fall back to light mode as default
    const savedSetting = (typeof window !== 'undefined'
      ? localStorage.getItem('concretecalc_theme') || localStorage.getItem('theme')
      : null) as ThemeMode | null;

    const initialSetting: ThemeMode =
      savedSetting === 'light' || savedSetting === 'dark' || savedSetting === 'system'
        ? savedSetting
        : 'light';

    const initialResolved: 'light' | 'dark' =
      initialSetting === 'system' ? getSystemPreference() : initialSetting;

    setThemeSetting(initialSetting);
    setResolvedTheme(initialResolved);
    document.documentElement.setAttribute('data-theme', initialResolved);
    document.documentElement.setAttribute('data-theme-setting', initialSetting);
    document.documentElement.style.colorScheme = initialResolved;

    // Cross-tab sync listener
    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === 'concretecalc_theme' || e.key === 'theme') && e.newValue) {
        const nextSetting = e.newValue as ThemeMode;
        const nextResolved =
          nextSetting === 'system' ? getSystemPreference() : nextSetting;
        setThemeSetting(nextSetting);
        setResolvedTheme(nextResolved);
        document.documentElement.setAttribute('data-theme', nextResolved);
        document.documentElement.setAttribute('data-theme-setting', nextSetting);
        document.documentElement.style.colorScheme = nextResolved;
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Dynamic OS color scheme change listener when setting is explicitly 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      const currentSetting =
        (localStorage.getItem('concretecalc_theme') ||
          localStorage.getItem('theme')) as ThemeMode | null;
      if (currentSetting === 'system') {
        const autoTheme = e.matches ? 'dark' : 'light';
        setResolvedTheme(autoTheme);
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

  const applyThemeSetting = (newSetting: ThemeMode) => {
    setThemeSetting(newSetting);
    const sysPref =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    const effective: 'light' | 'dark' =
      newSetting === 'system' ? sysPref : newSetting;

    setResolvedTheme(effective);
    document.documentElement.setAttribute('data-theme', effective);
    document.documentElement.setAttribute('data-theme-setting', newSetting);
    document.documentElement.style.colorScheme = effective;

    try {
      localStorage.setItem('concretecalc_theme', newSetting);
      localStorage.setItem('theme', newSetting);
      window.dispatchEvent(
        new CustomEvent('themechange', {
          detail: { theme: effective, setting: newSetting },
        })
      );
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
        </nav>

        {/* Zone 3: 3-way theme selector, primary action & mobile menu toggle */}
        <div className="action-zone">
          <div
            className="theme-segmented-control"
            role="radiogroup"
            aria-label="Color theme preference"
          >
            <button
              type="button"
              role="radio"
              aria-checked={themeSetting === 'light'}
              aria-label="Light mode"
              title="Light mode"
              className={`theme-segment-btn ${themeSetting === 'light' ? 'active' : ''}`}
              onClick={() => applyThemeSetting('light')}
            >
              <Sun
                size={14}
                style={{ color: themeSetting === 'light' ? '#d97706' : undefined }}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={themeSetting === 'system'}
              aria-label="System preference"
              title="System preference"
              className={`theme-segment-btn ${themeSetting === 'system' ? 'active' : ''}`}
              onClick={() => applyThemeSetting('system')}
            >
              <Monitor
                size={13}
                style={{ color: themeSetting === 'system' ? 'var(--calc-blue)' : undefined }}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={themeSetting === 'dark'}
              aria-label="Dark mode"
              title="Dark mode"
              className={`theme-segment-btn ${themeSetting === 'dark' ? 'active' : ''}`}
              onClick={() => applyThemeSetting('dark')}
            >
              <Moon
                size={13}
                style={{ color: themeSetting === 'dark' ? '#38bdf8' : undefined }}
                aria-hidden="true"
              />
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

            {/* Mobile Drawer Dedicated 3-Way Theme Switch Row */}
            <div className="mobile-theme-section">
              <div className="mobile-theme-info">
                {resolvedTheme === 'dark' ? (
                  <Moon size={16} color="#38bdf8" aria-hidden="true" />
                ) : (
                  <Sun size={16} color="#d97706" aria-hidden="true" />
                )}
                <span>
                  Theme:{' '}
                  {themeSetting === 'system'
                    ? `System (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`
                    : themeSetting === 'dark'
                    ? 'Dark Mode'
                    : 'Light Mode'}
                </span>
              </div>
              <div
                className="theme-segmented-control"
                role="radiogroup"
                aria-label="Mobile theme selection"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={themeSetting === 'light'}
                  aria-label="Light mode"
                  title="Light mode"
                  className={`theme-segment-btn ${themeSetting === 'light' ? 'active' : ''}`}
                  onClick={() => applyThemeSetting('light')}
                >
                  <Sun
                    size={14}
                    style={{ color: themeSetting === 'light' ? '#d97706' : undefined }}
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={themeSetting === 'system'}
                  aria-label="System preference"
                  title="System preference"
                  className={`theme-segment-btn ${themeSetting === 'system' ? 'active' : ''}`}
                  onClick={() => applyThemeSetting('system')}
                >
                  <Monitor
                    size={13}
                    style={{ color: themeSetting === 'system' ? 'var(--calc-blue)' : undefined }}
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={themeSetting === 'dark'}
                  aria-label="Dark mode"
                  title="Dark mode"
                  className={`theme-segment-btn ${themeSetting === 'dark' ? 'active' : ''}`}
                  onClick={() => applyThemeSetting('dark')}
                >
                  <Moon
                    size={13}
                    style={{ color: themeSetting === 'dark' ? '#38bdf8' : undefined }}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};
