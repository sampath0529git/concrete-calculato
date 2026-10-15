import React from 'react';

export const GuideSection: React.FC = () => {
  return (
    <section className="c" id="guide">
      <h2>How much concrete do I need?</h2>
      <p>
        Concrete is ordered by volume in cubic metres (m³). For a flat slab, shed base or path the sum is simple:{' '}
        <strong>length × width × thickness</strong>, with every measurement in metres. A 3m × 3m base poured 100mm (0.1m) deep
        needs 0.9 m³. Add a waste allowance of 5–10% because ground is never perfectly level and formwork flexes.
      </p>
      <h3>How to calculate cubic metres of concrete</h3>
      <ol style={{ paddingLeft: '22px', margin: '12px 0' }}>
        <li style={{ marginBottom: '6px' }}>Measure length and width in metres.</li>
        <li style={{ marginBottom: '6px' }}>Convert thickness from millimetres to metres (100mm = 0.1m).</li>
        <li style={{ marginBottom: '6px' }}>Multiply the three numbers to get the volume.</li>
        <li style={{ marginBottom: '6px' }}>Multiply by 1.05–1.10 to allow for waste.</li>
      </ol>
      <h3>For a post hole or column</h3>
      <p>
        Use π × (diameter ÷ 2)² × depth. A 0.3m wide, 0.6m deep fence post hole needs about 0.042 m³, roughly four bags of
        25kg mix, less the space the post takes up.
      </p>

      <h2>Bags or ready-mix: which is cheaper?</h2>
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>Job size</th>
              <th>Best option</th>
              <th>Typical use</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Under 0.5 m³</td>
              <td>Bagged mix</td>
              <td>Fence posts, small repairs, path sections</td>
            </tr>
            <tr>
              <td>0.5 – 1 m³</td>
              <td>Either; compare quotes</td>
              <td>Shed bases, small patios</td>
            </tr>
            <tr>
              <td>1 – 4 m³</td>
              <td>Mini-mix or ready-mix</td>
              <td>Garage bases, driveways</td>
            </tr>
            <tr>
              <td>Over 4 m³</td>
              <td>Ready-mix lorry or pump</td>
              <td>Large slabs, extensions</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Hand-mixing one cubic metre means about 83 bags and a full day&apos;s work. Many suppliers charge extra for small
        ready-mix loads, so ask about mini-mix delivery for 1–4 m³ jobs.
      </p>

      <h2>Recommended slab thickness and mix</h2>
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>Application</th>
              <th>Thickness</th>
              <th>Mix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Paths and patios</td>
              <td>75–100mm</td>
              <td>C20</td>
            </tr>
            <tr>
              <td>Shed and garage bases</td>
              <td>100mm</td>
              <td>C20</td>
            </tr>
            <tr>
              <td>Strip footings</td>
              <td>300–500mm</td>
              <td>C25</td>
            </tr>
            <tr>
              <td>Car driveways</td>
              <td>100–150mm</td>
              <td>C25–C30</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        These are typical domestic figures. For anything load-bearing or covered by Building Regulations, follow your
        engineer&apos;s or building control&apos;s specification.
      </p>
    </section>
  );
};
