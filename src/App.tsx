import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Calculator } from './components/Calculator';
import { GuideSection } from './components/GuideSection';
import { FaqSection } from './components/FaqSection';
import { BlogCards } from './components/BlogCards';
import { BlogIndex } from './components/BlogIndex';
import { BlogPost } from './components/BlogPost';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { CookieBanner } from './components/CookieBanner';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageRoute>('calculator');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Detect system preference or saved theme
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

  const handleNavigate = (page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main style={{ flex: 1 }}>
        {currentPage === 'calculator' && (
          <div className="wrap">
            <div className="hero">
              <h1>Concrete calculator UK</h1>
              <p className="lead">
                Enter your measurements in metres and millimetres to get cubic metres, 25kg bags, weight and an estimated cost for slabs, shed bases, footings, post holes and steps.
              </p>
            </div>

            <Calculator />

            <article>
              <GuideSection />
              <FaqSection />
              <section className="c">
                <h2>Latest concrete guides</h2>
                <BlogCards onNavigate={handleNavigate} />
              </section>
            </article>
          </div>
        )}

        {currentPage === 'blog' && <BlogIndex onNavigate={handleNavigate} />}

        {(currentPage === 'how-many-bags-of-concrete-per-cubic-metre' ||
          currentPage === 'concrete-shed-base-how-much-do-i-need' ||
          currentPage === 'ready-mix-vs-bagged-concrete') && (
          <BlogPost slug={currentPage} onNavigate={handleNavigate} />
        )}

        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactPage onNavigate={handleNavigate} />}
        {currentPage === 'privacy' && <PrivacyPage onNavigate={handleNavigate} />}
        {currentPage === 'terms' && <TermsPage onNavigate={handleNavigate} />}
      </main>

      <Footer onNavigate={handleNavigate} />
      <CookieBanner />
    </>
  );
};

export default App;
