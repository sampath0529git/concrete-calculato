import React from 'react';
import { PageRoute } from '../types';

interface TermsPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="wrap">
      <div className="post">
        <h1>Terms of use</h1>
        <p>
          The calculators and guides on this site are provided for general information only. Results are estimates and are not a professional or structural specification. You use the site at your own risk and should confirm quantities and prices with your supplier or a qualified professional. We are not liable for losses arising from reliance on the estimates.
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
