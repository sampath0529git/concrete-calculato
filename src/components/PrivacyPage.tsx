import React from 'react';
import { PageRoute } from '../types';

interface PrivacyPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="wrap">
      <div className="post">
        <h1>Privacy policy</h1>
        <p>
          This site does not ask you to create an account, and the numbers you enter in the calculator are processed in your browser.
        </p>

        <h2>Cookies and advertising</h2>
        <p>
          We use Google AdSense to show ads. Google and its partners use cookies to serve ads based on your visits to this and other websites. In the UK and EEA, personalised ads are only shown if you consent through our cookie banner. You can opt out of personalised advertising at{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            google.com/settings/ads
          </a>{' '}
          and learn more at{' '}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            how Google uses data
          </a>
          .
        </p>

        <h2>Analytics</h2>
        <p>
          If we use analytics (for example Google Analytics), it collects anonymous usage data such as pages viewed, subject to your consent.
        </p>

        <h2>Your rights</h2>
        <p>
          Under UK GDPR you can ask what data we hold, request correction or deletion, or complain to the ICO. Contact us at hello@concretecalc.uk.
        </p>

        <div style={{ marginTop: '32px' }}>
          <button
            type="button"
            className="btn-action"
            style={{ display: 'inline-flex', width: 'auto', padding: '8px 16px' }}
            onClick={() => onNavigate('calculator')}
          >
            ← Back to Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
