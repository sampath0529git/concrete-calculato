import React from 'react';

export const FaqSection: React.FC = () => {
  return (
    <section className="c" id="faq">
      <h2>Concrete calculator FAQs</h2>
      <details>
        <summary>How do I calculate cubic metres of concrete?</summary>
        <p>
          Multiply length × width × thickness, all in metres. A 3m × 3m slab at 100mm thick is 3 × 3 × 0.1 = 0.9 m³. Add
          5–10% for waste.
        </p>
      </details>
      <details>
        <summary>How many bags of concrete make one cubic metre?</summary>
        <p>
          A 25kg bag makes about 0.012 m³, so one cubic metre needs around 83 bags. A 20kg bag makes about 0.0095 m³ (around
          105 bags).
        </p>
      </details>
      <details>
        <summary>How much concrete do I need for a shed base?</summary>
        <p>
          A 2.4m × 1.8m base at 100mm thick is 0.43 m³, or about 0.47 m³ with 10% waste. That is roughly 40 bags of 25kg
          mix.
        </p>
      </details>
      <details>
        <summary>Is it cheaper to buy bags or ready-mix?</summary>
        <p>
          Below about 0.5 m³ bags are usually simpler and cheaper. Above 1 m³ ready-mix is normally cheaper and far less
          work, though small loads can attract a short-load charge.
        </p>
      </details>
      <details>
        <summary>How thick should a concrete slab be?</summary>
        <p>
          Paths and patios 75–100mm, shed bases 100mm, car driveways 100–150mm. Check Building Regulations for structural
          work.
        </p>
      </details>
      <details>
        <summary>Why add waste to my calculation?</summary>
        <p>
          Uneven ground, formwork movement and spillage mean you use more than the theoretical volume. A 10% allowance
          avoids running short mid-pour.
        </p>
      </details>
    </section>
  );
};
