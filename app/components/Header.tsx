'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sun,
  Moon,
  Monitor,
  Calculator,
  Menu,
  X,
  Layers,
  ArrowRightLeft,
  BookOpen,
  Info,
  Mail,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

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

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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

  // Quick 1-tap toggle for mobile header (cycles Light <-> Dark)
  const toggleMobileQuickTheme = () => {
    if (resolvedTheme === 'dark') {
      applyThemeSetting('light');
    } else {
      applyThemeSetting('dark');
    }
  };

  const isBlogActive =
    pathname.startsWith('/blog') ||
    pathname === '/how-many-bags-of-concrete-per-cubic-metre' ||
    pathname === '/concrete-shed-base-how-much-do-i-need' ||
    pathname === '/ready-mix-vs-bagged-concrete';

  return (
    <>
      <header className={`top ${mobileMenuOpen ? 'mobile-menu-active' : ''}`}>
        <div className="wrap">
          {/* Zone 1: Brand logo and wordmark */}
          <Link
            className="brand"
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="ConcreteCalc.UK Home"
          >
            <img
              src="/images/logo.png"
              alt="ConcreteCalc.UK Logo"
              width={34}
              height={34}
              className="brand-logo-img"
              referrerPolicy="no-referrer"
            />
            <span className="brand-text">
              ConcreteCalc<span className="brand-dot">.</span>UK
            </span>
          </Link>

          {/* Zone 2: Desktop Navigation Links */}
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

          {/* Zone 3: Actions (Desktop 3-way theme + CTA, and Mobile Quick Controls) */}
          <div className="action-zone">
            {/* Desktop-only 3-Way Segmented Theme Switch */}
            <div
              className="theme-segmented-control desktop-theme-control"
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

            {/* Mobile Quick Theme Toggle (Compact 1-tap button) */}
            <button
              type="button"
              className="mobile-theme-quick-btn"
              onClick={toggleMobileQuickTheme}
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {resolvedTheme === 'dark' ? (
                <Moon size={17} className="text-sky-400" aria-hidden="true" />
              ) : (
                <Sun size={17} className="text-amber-500" aria-hidden="true" />
              )}
            </button>

            {/* Quick Calculate CTA Button */}
            <Link
              href="/#calculator"
              className="header-cta-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Calculator size={15} aria-hidden="true" />
              <span className="header-cta-label">Calculate</span>
            </Link>

            {/* Mobile Hamburger / Close Button */}
            <button
              type="button"
              className={`mobile-menu-toggle-btn ${mobileMenuOpen ? 'is-open' : ''}`}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {mobileMenuOpen ? (
                <X size={21} aria-hidden="true" />
              ) : (
                <Menu size={21} aria-hidden="true" />
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
            <div className="mobile-nav-container">
              {/* Quick Jump Action Banner */}
              <div className="mobile-drawer-hero-action">
                <Link
                  href="/#calculator"
                  className="mobile-hero-calc-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="mobile-hero-calc-icon">
                    <Calculator size={18} aria-hidden="true" />
                  </div>
                  <div className="mobile-hero-calc-text">
                    <span className="mobile-hero-title">Start Concrete Calculation</span>
                    <span className="mobile-hero-subtitle">
                      Slabs, footings, columns &amp; UK bag counts
                    </span>
                  </div>
                  <ChevronRight size={18} className="mobile-hero-arrow" aria-hidden="true" />
                </Link>
              </div>

              {/* Group 1: Calculators & Tools */}
              <div className="mobile-nav-group">
                <div className="mobile-nav-group-header">
                  <span>Calculators &amp; Estimators</span>
                </div>
                <div className="mobile-nav-links-list">
                  <Link
                    href="/"
                    className={`mobile-nav-card ${pathname === '/' ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="mobile-nav-card-icon calc-icon">
                      <Calculator size={18} aria-hidden="true" />
                    </div>
                    <div className="mobile-nav-card-body">
                      <span className="mobile-nav-card-title">Concrete Volume &amp; Mix</span>
                      <span className="mobile-nav-card-desc">Slabs, footings, bags &amp; ready-mix m³</span>
                    </div>
                    <ChevronRight size={16} className="mobile-nav-chevron" aria-hidden="true" />
                  </Link>

                  <Link
                    href="/concrete-block-calculator"
                    className={`mobile-nav-card ${pathname === '/concrete-block-calculator' ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="mobile-nav-card-icon block-icon">
                      <Layers size={18} aria-hidden="true" />
                    </div>
                    <div className="mobile-nav-card-body">
                      <span className="mobile-nav-card-title">Concrete Block Calculator</span>
                      <span className="mobile-nav-card-desc">Standard 440×215mm blocks, mortar &amp; sand</span>
                    </div>
                    <ChevronRight size={16} className="mobile-nav-chevron" aria-hidden="true" />
                  </Link>

                  <Link
                    href="/postcrete-calculator"
                    className={`mobile-nav-card ${pathname === '/postcrete-calculator' ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="mobile-nav-card-icon post-icon">
                      <Sparkles size={18} aria-hidden="true" />
                    </div>
                    <div className="mobile-nav-card-body">
                      <span className="mobile-nav-card-title">Postcrete &amp; Fence Posts</span>
                      <span className="mobile-nav-card-desc">Hole depths, bags per post &amp; fast-set mix</span>
                    </div>
                    <ChevronRight size={16} className="mobile-nav-chevron" aria-hidden="true" />
                  </Link>

                  <Link
                    href="/concrete-weight-converter"
                    className={`mobile-nav-card ${pathname === '/concrete-weight-converter' ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="mobile-nav-card-icon conv-icon">
                      <ArrowRightLeft size={18} aria-hidden="true" />
                    </div>
                    <div className="mobile-nav-card-body">
                      <span className="mobile-nav-card-title">Unit &amp; Weight Converter</span>
                      <span className="mobile-nav-card-desc">m³, tonnes, kg, litres &amp; UK bulk bags</span>
                    </div>
                    <ChevronRight size={16} className="mobile-nav-chevron" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Group 2: Guides & Knowledge */}
              <div className="mobile-nav-group">
                <div className="mobile-nav-group-header">
                  <span>Guides &amp; Resources</span>
                </div>
                <div className="mobile-nav-links-list">
                  <Link
                    href="/blog"
                    className={`mobile-nav-card ${isBlogActive ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="mobile-nav-card-icon guide-icon">
                      <BookOpen size={18} aria-hidden="true" />
                    </div>
                    <div className="mobile-nav-card-body">
                      <span className="mobile-nav-card-title">Guides &amp; Worked Examples</span>
                      <span className="mobile-nav-card-desc">Shed bases, bags per m³, ready-mix tips</span>
                    </div>
                    <ChevronRight size={16} className="mobile-nav-chevron" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* Group 3: Company & Information */}
              <div className="mobile-nav-group">
                <div className="mobile-nav-group-header">
                  <span>Information</span>
                </div>
                <div className="mobile-nav-links-compact-grid">
                  <Link
                    href="/about"
                    className={`mobile-compact-link ${pathname === '/about' ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Info size={15} aria-hidden="true" />
                    <span>About ConcreteCalc.UK</span>
                  </Link>
                  <Link
                    href="/contact"
                    className={`mobile-compact-link ${pathname === '/contact' ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Mail size={15} aria-hidden="true" />
                    <span>Contact &amp; Support</span>
                  </Link>
                </div>
              </div>

              {/* Dedicated Mobile Theme Card with 3 Options */}
              <div className="mobile-theme-card">
                <div className="mobile-theme-card-header">
                  <span className="mobile-theme-card-title">Display Theme</span>
                  <span className="mobile-theme-card-badge">
                    {themeSetting === 'system'
                      ? `System (${resolvedTheme})`
                      : themeSetting === 'dark'
                      ? 'Dark'
                      : 'Light'}
                  </span>
                </div>
                <div
                  className="mobile-theme-segmented"
                  role="radiogroup"
                  aria-label="Mobile theme selection"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={themeSetting === 'light'}
                    className={`mobile-theme-choice ${themeSetting === 'light' ? 'active' : ''}`}
                    onClick={() => applyThemeSetting('light')}
                  >
                    <Sun size={15} className="text-amber-500" aria-hidden="true" />
                    <span>Light</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={themeSetting === 'system'}
                    className={`mobile-theme-choice ${themeSetting === 'system' ? 'active' : ''}`}
                    onClick={() => applyThemeSetting('system')}
                  >
                    <Monitor size={15} className="text-blue-500" aria-hidden="true" />
                    <span>System</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={themeSetting === 'dark'}
                    className={`mobile-theme-choice ${themeSetting === 'dark' ? 'active' : ''}`}
                    onClick={() => applyThemeSetting('dark')}
                  >
                    <Moon size={15} className="text-sky-400" aria-hidden="true" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>

              {/* Mobile Drawer Footer Trust Badge */}
              <div className="mobile-drawer-footer">
                <p>
                  🇬🇧 BS 8500 &amp; BS EN 206 Standard Mixes
                </p>
                <p className="mobile-drawer-footer-sub">
                  Free concrete volume, block, postcrete &amp; bag calculator for UK trades &amp; DIY.
                </p>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* Backdrop overlay for outside click to close */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};
