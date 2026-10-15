import React from 'react';
import { BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export const GuideSection: React.FC = () => {
  return (
    <section className="c" id="guide">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        <BookOpen size={15} aria-hidden="true" />
        <span>British Standards BS 8500 Guide</span>
      </div>
      <h2>How Much Concrete Do I Need?</h2>
      <p>
        Concrete is specified and ordered by volume in cubic metres (m³). For a standard flat slab, shed base, or walkway the formula is simple:{' '}
        <strong>Length × Width × Thickness</strong>, with all measurements expressed in metres.
      </p>
      <p>
        For instance, a 3.0m × 3.0m slab poured at 100mm (0.1m) depth requires exactly 3 × 3 × 0.1 = <strong>0.90 m³</strong>. Always add a 5% to 10% waste allowance because trenches and ground excavations are never laser-flat, and timber formwork flexes slightly under hydrostatic pressure.
      </p>

      <h3>How to Calculate Your Volume in 4 Steps</h3>
      <ol style={{ paddingLeft: '20px', margin: '14px 0', lineHeight: '1.7' }}>
        <li><strong>Measure length and width</strong> of your formwork frame in metres.</li>
        <li><strong>Convert depth/thickness</strong> to metres (e.g. 100mm = 0.10m; 150mm = 0.15m).</li>
        <li><strong>Multiply length × width × depth</strong> to obtain theoretical net volume.</li>
        <li><strong>Multiply by 1.10</strong> to incorporate the standard 10% contingency allowance.</li>
      </ol>

      <h3>Post Holes &amp; Cylindrical Columns</h3>
      <p>
        Calculate cylinder volume using <em>π × (Diameter ÷ 2)² × Depth</em>. A standard 300mm (0.3m) diameter fence post hole dug 600mm (0.6m) deep requires ~0.042 m³, which equals roughly 4 bags of 25kg pre-mix (less the displaced volume of your post).
      </p>

      <h3>Bags vs Ready-Mix Procurement Matrix</h3>
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>Job Size (Volume)</th>
              <th>Recommended Method</th>
              <th>Typical UK Application</th>
              <th>Labor &amp; Delivery Factor</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr>
              <td><strong>Under 0.50 m³</strong></td>
              <td>Bagged Pre-Mix (25kg)</td>
              <td>Fence posts, pier pads, patching</td>
              <td>Mix on site in wheelbarrow or spot board</td>
            </tr>
            <tr>
              <td><strong>0.50 – 1.00 m³</strong></td>
              <td>Either (Compare quotes)</td>
              <td>Garden shed bases, small patios</td>
              <td>40–83 bags or local mini-mix delivery</td>
            </tr>
            <tr>
              <td><strong>1.00 – 4.00 m³</strong></td>
              <td>Mini-Mix / Volumetric Truck</td>
              <td>Garage bases, car drives, extensions</td>
              <td>Mixed fresh on truck; barrow to site</td>
            </tr>
            <tr>
              <td><strong>Over 4.00 m³</strong></td>
              <td>Full Barrel Truck / Pump</td>
              <td>Foundations, structural underpinning</td>
              <td>Requires unobstructed 26-tonne lorry access</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Recommended Slab Thickness &amp; Strength Class</h3>
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>Application</th>
              <th>Min Thickness</th>
              <th>UK Mix Spec</th>
              <th>Reinforcement Recommendation</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr>
              <td>Garden paths &amp; patio pavers</td>
              <td>75–100mm</td>
              <td>C20 (1:2:4)</td>
              <td>Unreinforced or polypropylene fibers</td>
            </tr>
            <tr>
              <td>Timber shed &amp; workshop bases</td>
              <td>100mm</td>
              <td>C20 (1:2:4)</td>
              <td>A142 steel mesh on spacers (50mm cover)</td>
            </tr>
            <tr>
              <td>Strip foundations &amp; footings</td>
              <td>300–500mm</td>
              <td>C25 (1:1.5:3)</td>
              <td>Rebar trench cages as specified by Building Control</td>
            </tr>
            <tr>
              <td>Domestic car driveways &amp; parking</td>
              <td>100–150mm</td>
              <td>C25–C30</td>
              <td>A193 heavy steel mesh + 150mm compacted sub-base</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '12px' }}>
        Note: The guidelines above represent standard domestic UK trade practice. For structural foundations, load-bearing walls, or work subject to Local Authority Building Regulations, always consult an engineer or Building Inspector.
      </p>
    </section>
  );
};
