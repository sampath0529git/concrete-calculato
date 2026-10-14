import React from 'react';
import { PageRoute } from '../types';

interface AboutPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="wrap">
      <div className="post">
        <h1>About us</h1>
        <p>
          ConcreteCalc.UK provides free, easy-to-use concrete calculators and guides for homeowners and tradespeople in the UK.
        </p>
        <h2>How we calculate</h2>
        <p>
          Volume is length × width × thickness in metres. A 25kg bag is assumed to yield about 0.012 m³, and wet concrete weighs roughly 2.4 tonnes per m³. We add a waste allowance you can change.
        </p>
        <h2>Accuracy</h2>
        <p>
          Results are estimates. Site conditions, mix brand and supplier all affect real quantities, so check with your supplier before ordering.
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
