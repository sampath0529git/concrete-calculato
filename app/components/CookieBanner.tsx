'use client';

import React, { useState, useEffect } from 'react';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('concretecalc_cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('concretecalc_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('concretecalc_cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie" style={{ display: 'flex' }} role="region" aria-label="Cookie consent">
      <div>
        We use essential cookies for site functionality and analytics to improve your experience.
      </div>
      <div className="cookie-actions">
        <button type="button" className="btn-sm" onClick={handleDecline}>
          Necessary only
        </button>
        <button type="button" className="btn-sm btn-primary" onClick={handleAccept}>
          Accept all
        </button>
      </div>
    </div>
  );
};
