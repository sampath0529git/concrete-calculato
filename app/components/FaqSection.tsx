import React from 'react';
import { HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  return (
    <section className="c" id="faq">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        <HelpCircle size={15} aria-hidden="true" />
        <span>Frequently Asked Questions</span>
      </div>
      <h2>Concrete Calculation FAQs</h2>

      <details>
        <summary>How do I calculate cubic metres of concrete?</summary>
        <p>
          Multiply length × width × depth, all in metres. For example, a 3m × 3m slab that is 100mm (0.1m) thick requires 3 × 3 × 0.1 = 0.90 m³. Always add 5% to 10% for waste to account for uneven ground excavation and formwork deflection.
        </p>
      </details>

      <details>
        <summary>How many bags of concrete make one cubic metre?</summary>
        <p>
          A standard 25kg bag of pre-mixed dry concrete yields approximately 0.012 m³ of wet concrete, meaning one cubic metre requires roughly 83 bags (or ~92 bags with a 10% waste allowance). If using 20kg bags, each yields ~0.0095 m³, requiring around 105 bags per m³.
        </p>
      </details>

      <details>
        <summary>How much concrete do I need for a 6x4 or 8x6 shed base?</summary>
        <p>
          A standard 8&apos; × 6&apos; (2.4m × 1.8m) garden shed base at 100mm (4 inches) thickness requires 0.43 m³ net. With a 10% waste factor (0.47 m³), you will need approximately 40 bags of 25kg pre-mix, or about 0.5 tonnes of concrete.
        </p>
      </details>

      <details>
        <summary>Is it cheaper to buy bags or ready-mix delivery in the UK?</summary>
        <p>
          For projects under 0.50 m³, 25kg pre-mixed bags are almost always cheaper and more convenient. Between 0.50 and 1.00 m³, prices are closely matched. For jobs over 1.00 m³, ready-mix or volumetric truck delivery is usually significantly cheaper, saves hours of heavy back-breaking mixing, and provides certified consistent strength.
        </p>
      </details>

      <details>
        <summary>What thickness should a domestic concrete slab be?</summary>
        <p>
          Garden walkways and patio sub-bases: 75–100mm. Timber shed and garden room bases: 100mm. Vehicle parking driveways and garage slabs: 100–150mm with steel reinforcing mesh (A142 or A193) and a compacted 150mm MOT Type 1 sub-base.
        </p>
      </details>

      <details>
        <summary>Why is adding a waste allowance essential?</summary>
        <p>
          Soil excavations are never perfectly smooth, formwork expands under the weight of wet concrete, and some material adheres to mixer drums and wheelbarrows. Adding a 10% allowance guarantees you will not run out before finishing the pour, which prevents cold joints and structural weaknesses.
        </p>
      </details>
    </section>
  );
};
