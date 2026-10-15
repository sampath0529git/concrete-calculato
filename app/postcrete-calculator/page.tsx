'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '../components/Breadcrumbs';
import {
  Wrench,
  HelpCircle,
  RotateCcw,
  Printer,
  Copy,
  Check,
  Package,
  Layers,
  FileSpreadsheet,
  Fence,
} from 'lucide-react';

interface PostTypeOption {
  id: string;
  name: string;
  widthMm: number;
  depthMm: number;
  material: 'timber' | 'concrete' | 'metal';
  typicalHoleDiamMm: number;
  typicalHoleDepthMm: number;
}

const POST_TYPES: PostTypeOption[] = [
  {
    id: 'timber-100',
    name: '100mm × 100mm (4" × 4") Square Timber Post',
    widthMm: 100,
    depthMm: 100,
    material: 'timber',
    typicalHoleDiamMm: 250,
    typicalHoleDepthMm: 600,
  },
  {
    id: 'timber-75',
    name: '75mm × 75mm (3" × 3") Square Timber Post',
    widthMm: 75,
    depthMm: 75,
    material: 'timber',
    typicalHoleDiamMm: 200,
    typicalHoleDepthMm: 500,
  },
  {
    id: 'concrete-slotted',
    name: '100mm × 100mm Slotted Concrete Fence Post',
    widthMm: 100,
    depthMm: 100,
    material: 'concrete',
    typicalHoleDiamMm: 250,
    typicalHoleDepthMm: 600,
  },
  {
    id: 'metal-50',
    name: '50mm (2") Round Tubular Metal Post',
    widthMm: 50,
    depthMm: 50,
    material: 'metal',
    typicalHoleDiamMm: 150,
    typicalHoleDepthMm: 450,
  },
  {
    id: 'heavy-gate-150',
    name: '150mm × 150mm (6" × 6") Heavy Gate Post',
    widthMm: 150,
    depthMm: 150,
    material: 'timber',
    typicalHoleDiamMm: 350,
    typicalHoleDepthMm: 750,
  },
];

export default function PostcreteCalculatorPage() {
  const [postCount, setPostCount] = useState<number>(8);
  const [selectedPostId, setSelectedPostId] = useState<string>('timber-100');
  const [holeDiameterMm, setHoleDiameterMm] = useState<number>(250);
  const [holeDepthMm, setHoleDepthMm] = useState<number>(600);
  const [postcreteBagPrice, setPostcreteBagPrice] = useState<number>(6.25);
  const [contingencyPercent, setContingencyPercent] = useState<number>(10);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedPost = useMemo(
    () => POST_TYPES.find((p) => p.id === selectedPostId) || POST_TYPES[0],
    [selectedPostId]
  );

  // Hole volume (cylinder): pi * (d/2)^2 * depth
  const radiusM = holeDiameterMm / 2000;
  const depthM = holeDepthMm / 1000;
  const holeVolumePerPostM3 = Math.PI * Math.pow(radiusM, 2) * depthM;

  // Submerged post volume to deduct:
  const postWidthM = selectedPost.widthMm / 1000;
  const postDepthM = selectedPost.depthMm / 1000;
  const postSubmergedVolM3 = postWidthM * postDepthM * depthM;

  // Net concrete volume needed per post:
  const netConcreteVolPerPostM3 = Math.max(0.005, holeVolumePerPostM3 - postSubmergedVolM3);

  // Standard 20kg Postcrete bag yields ~0.010 m³ (10 litres) of set concrete
  const postcreteBagsPerPostExact = netConcreteVolPerPostM3 / 0.01;
  const postcreteBagsPerPost = Math.max(1, Math.ceil(postcreteBagsPerPostExact));

  // Total for all posts:
  const totalBagsExact = (postCount * netConcreteVolPerPostM3) / 0.01;
  const totalBagsWithWaste = Math.ceil(totalBagsExact * (1 + contingencyPercent / 100));

  // Site mixed alternative: 1:5 ballast to cement
  const totalVolumeM3 = (postCount * netConcreteVolPerPostM3 * (1 + contingencyPercent / 100));
  const ballastTonnes = (totalVolumeM3 * 1.8).toFixed(2);
  const cementBags25kg = Math.ceil(totalVolumeM3 * 12.8);

  const totalPostcreteCost = totalBagsWithWaste * postcreteBagPrice;
  const manualMixCost = parseFloat(ballastTonnes) * 55 + cementBags25kg * 6.8;

  const handleCopy = () => {
    const text = `Fence Postcrete Calculation (UK Practice)
Number of Posts: ${postCount} (${selectedPost.name})
Hole Dimensions: ${holeDiameterMm}mm diameter × ${holeDepthMm}mm depth
Net Concrete Volume: ${totalVolumeM3.toFixed(3)} m³
Postcrete Bags Required: ${totalBagsWithWaste} bags (20kg rapid-setting)
Bags per Post: ~${postcreteBagsPerPost} bags/post
Estimated Postcrete Cost: £${totalPostcreteCost.toFixed(2)} (@ £${postcreteBagPrice.toFixed(2)}/bag)
Alternative Site-Mix: ${ballastTonnes} tonnes ballast + ${cementBags25kg} bags (25kg) cement
Generated via ConcreteCalc.UK`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportCsv = () => {
    const rows = [
      ['Metric', 'Value', 'Unit', 'Notes'],
      ['Number of Posts', postCount.toString(), 'posts', selectedPost.name],
      ['Hole Diameter', holeDiameterMm.toString(), 'mm', 'Recommended 3x post width'],
      ['Hole Depth', holeDepthMm.toString(), 'mm', 'Recommended 1/3 of post height'],
      ['Net Concrete Volume', totalVolumeM3.toFixed(3), 'm³', `Includes ${contingencyPercent}% contingency`],
      ['Total Postcrete Bags (20kg)', totalBagsWithWaste.toString(), 'bags', `~${postcreteBagsPerPost} bags per post`],
      ['Estimated Postcrete Cost', totalPostcreteCost.toFixed(2), '£ GBP', `@ £${postcreteBagPrice}/bag`],
      ['Alternative: Ballast', ballastTonnes, 'tonnes', '1:5 aggregate mix'],
      ['Alternative: Cement', cementBags25kg.toString(), '25kg bags', 'Mastercrete / Portland'],
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `postcrete-estimate-${postCount}-posts.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="wrap">
      <Breadcrumbs
        items={[
          { label: 'home', href: '/' },
          { label: 'calculators', href: '/#unit-converter' },
          { label: 'postcrete calculator' },
        ]}
      />

      <div className="hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <Fence size={16} aria-hidden="true" />
          <span>UK Fence Post &amp; Rapid-Set Postcrete Calculator</span>
        </div>
        <h1>Postcrete &amp; Fence Post Concrete Calculator UK</h1>
        <p className="lead">
          Calculate the exact number of 20kg Postcrete bags or site-mixed concrete needed for wooden, concrete, or metal fence posts, gate posts, and rotary dryers. Includes UK depth rules of thumb and hole volume calculations.
        </p>
      </div>

      {/* Preset Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '14px 0 22px' }}>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => {
            setPostCount(6);
            setSelectedPostId('timber-100');
            setHoleDiameterMm(250);
            setHoleDepthMm(600);
          }}
        >
          🏡 Standard 6ft Garden Fence (6 Posts)
        </button>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => {
            setPostCount(12);
            setSelectedPostId('concrete-slotted');
            setHoleDiameterMm(250);
            setHoleDepthMm(600);
          }}
        >
          🧱 Concrete Slotted Posts (12 Posts)
        </button>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => {
            setPostCount(2);
            setSelectedPostId('heavy-gate-150');
            setHoleDiameterMm(350);
            setHoleDepthMm(800);
          }}
        >
          🚪 Heavy 6ft Driveway Gate (2 Posts)
        </button>
        <button
          type="button"
          className="calc-preset-tag"
          onClick={() => {
            setPostCount(1);
            setSelectedPostId('metal-50');
            setHoleDiameterMm(200);
            setHoleDepthMm(500);
          }}
        >
          🧺 Washing Line / Rotary Dryer (1 Post)
        </button>
      </div>

      {/* Input Card */}
      <div className="calc-card">
        <div className="calc-card-header">
          <h2 className="calc-card-title">Fence Posts &amp; Hole Dimensions</h2>
          <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Standard 20kg Bags</span>
        </div>

        <div className="calc-card-body" style={{ gridTemplateColumns: '1.2fr 0.8fr' }}>
          <div>
            <table className="calc-table">
              <tbody>
                <tr>
                  <td className="calc-table-label">Number of Posts:</td>
                  <td>
                    <div className="calc-table-inputs">
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={postCount}
                        onChange={(e) => setPostCount(parseInt(e.target.value, 10) || 1)}
                        className="calc-input"
                      />
                      <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>posts</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="calc-table-label">Post Type:</td>
                  <td>
                    <select
                      value={selectedPostId}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        setSelectedPostId(nextId);
                        const p = POST_TYPES.find((item) => item.id === nextId);
                        if (p) {
                          setHoleDiameterMm(p.typicalHoleDiamMm);
                          setHoleDepthMm(p.typicalHoleDepthMm);
                        }
                      }}
                      className="calc-select"
                      style={{ width: '100%' }}
                    >
                      {POST_TYPES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                <tr>
                  <td className="calc-table-label">Hole Diameter:</td>
                  <td>
                    <div className="calc-table-inputs">
                      <input
                        type="number"
                        step="10"
                        min="100"
                        max="800"
                        value={holeDiameterMm}
                        onChange={(e) => setHoleDiameterMm(parseInt(e.target.value, 10) || 150)}
                        className="calc-input"
                      />
                      <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>mm</span>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>(~{(holeDiameterMm / 25.4).toFixed(1)} inches)</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="calc-table-label">Hole Depth:</td>
                  <td>
                    <div className="calc-table-inputs">
                      <input
                        type="number"
                        step="50"
                        min="200"
                        max="1500"
                        value={holeDepthMm}
                        onChange={(e) => setHoleDepthMm(parseInt(e.target.value, 10) || 300)}
                        className="calc-input"
                      />
                      <span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: 600 }}>mm</span>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>(~{(holeDepthMm / 304.8).toFixed(1)} ft)</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="calc-table-label">Postcrete Bag Price:</td>
                  <td>
                    <div className="calc-table-inputs">
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        value={postcreteBagPrice}
                        onChange={(e) => setPostcreteBagPrice(parseFloat(e.target.value) || 0)}
                        className="calc-input"
                      />
                      <span style={{ fontSize: '13px', color: 'var(--muted)' }}>GBP (£ per 20kg bag)</span>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="calc-table-label">Contingency / Waste:</td>
                  <td>
                    <select
                      value={contingencyPercent}
                      onChange={(e) => setContingencyPercent(parseInt(e.target.value, 10))}
                      className="calc-select"
                      style={{ width: '100%' }}
                    >
                      <option value="0">0% — Exact net volume</option>
                      <option value="10">10% — Recommended UK ground allowance</option>
                      <option value="15">15% — Loose/stony ground with over-digging</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Visual Post Hole Diagram */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '220px',
                aspectRatio: '0.9',
                border: '2px solid var(--calc-blue)',
                borderRadius: '8px',
                background: 'var(--surface-elevated)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>
                Hole Diam: {holeDiameterMm}mm (3× post)
              </div>

              {/* Graphic Cross-Section */}
              <div style={{ position: 'relative', width: '120px', height: '140px', margin: '0 auto', border: '2px dashed #94a3b8', borderRadius: '4px', background: '#e2e8f0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                {/* Soil line */}
                <div style={{ position: 'absolute', top: '15px', left: '-20px', right: '-20px', height: '2px', background: '#78350f' }} />
                
                {/* Post */}
                <div style={{ width: '40px', height: '150px', marginTop: '-20px', background: selectedPost.material === 'timber' ? '#b45309' : '#64748b', borderRadius: '2px', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 700 }}>
                  Post
                </div>

                {/* Concrete surround */}
                <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '125px', background: 'rgba(3, 70, 148, 0.25)', borderTop: '2px solid var(--calc-blue)', zIndex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '4px', fontSize: '10px', fontWeight: 700, color: 'var(--calc-blue)' }}>
                  Postcrete
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>
                Depth: {holeDepthMm}mm (1/3 rule)
              </div>
            </div>

            <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>
              Standard Rule: <strong>1.5 to 2 bags of Postcrete</strong> per 6ft fence post
            </div>
          </div>
        </div>
      </div>

      {/* Results Card */}
      <div className="calc-result-card">
        <div className="calc-result-header">
          <div>
            <h2 className="calc-result-title">Postcrete &amp; Concrete Required</h2>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
              For <strong>{postCount} posts</strong> ({selectedPost.name})
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: 'var(--muted)', display: 'block' }}>Estimated Cost</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--ok)' }}>
              £{totalPostcreteCost.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 3 Metric Tiles */}
        <div className="calc-volume-grid">
          <div className="calc-volume-tile primary">
            <div className="calc-volume-val">{totalBagsWithWaste}</div>
            <div className="calc-volume-sub">20kg Postcrete Bags Needed</div>
            <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>
              ~{(totalBagsWithWaste / postCount).toFixed(1)} bags per post
            </div>
          </div>

          <div className="calc-volume-tile">
            <div className="calc-volume-val">{totalVolumeM3.toFixed(3)} m³</div>
            <div className="calc-volume-sub">Total Wet Concrete Volume</div>
            <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>
              {(netConcreteVolPerPostM3 * 1000).toFixed(0)} litres per post hole
            </div>
          </div>

          <div className="calc-volume-tile">
            <div className="calc-volume-val">5–10 mins</div>
            <div className="calc-volume-sub">Postcrete Rapid-Set Time</div>
            <div style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: '4px' }}>
              No premixing required: add water, pour dry mix
            </div>
          </div>
        </div>

        {/* Spec Comparison Table */}
        <table className="calc-spec-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Materials Needed</th>
              <th style={{ textAlign: 'right' }}>Labour / Set Time</th>
              <th style={{ textAlign: 'right' }}>Estimated Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Ready Postcrete (20kg Bags)</strong></td>
              <td>{totalBagsWithWaste} bags @ £{postcreteBagPrice.toFixed(2)}</td>
              <td style={{ textAlign: 'right' }}>Sets in 10 mins, instant alignment</td>
              <td style={{ textAlign: 'right' }}><strong>£{totalPostcreteCost.toFixed(2)}</strong></td>
            </tr>
            <tr>
              <td><strong>Manual Site Mix (1:5 Ballast)</strong></td>
              <td>{ballastTonnes}t all-in ballast + {cementBags25kg} bags cement</td>
              <td style={{ textAlign: 'right' }}>Requires mixer / wheelbarrow, 24-48hr cure</td>
              <td style={{ textAlign: 'right' }}>£{manualMixCost.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        {/* Action Buttons */}
        <div className="action-bar">
          <button type="button" className="btn-action" onClick={handleCopy}>
            {copied ? <Check size={14} color="var(--ok)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Specification'}</span>
          </button>
          <button type="button" className="btn-action" onClick={handleExportCsv}>
            <FileSpreadsheet size={14} />
            <span>Export CSV</span>
          </button>
          <button type="button" className="btn-action" onClick={() => window.print()}>
            <Printer size={14} />
            <span>Print Estimate</span>
          </button>
        </div>
      </div>

      {/* Guide & Rules of Thumb */}
      <article>
        <section className="c">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Wrench size={15} aria-hidden="true" />
            <span>UK Fencing Guide &amp; Installation Rules</span>
          </div>
          <h2>How Much Concrete Do You Need for a Fence Post? UK Standards</h2>
          <p>
            Securing fence posts against strong British gales requires correct hole depth, hole diameter, and concrete anchoring. Weak post foundations are the #1 cause of storm damage to domestic timber fencing in the UK.
          </p>

          <h3>1. The Golden Rules of Fencing Hole Sizing</h3>
          <ul>
            <li><strong>The One-Third Rule for Depth:</strong> The depth of your post hole must be at least <strong>one-third (1/3)</strong> of the total post length. For a standard 1.8m (6ft) fence above ground, use a 2.4m (8ft) post and dig down <strong>600mm (2ft / 24 inches)</strong> into firm ground.</li>
            <li><strong>The Three-Times Rule for Diameter:</strong> The hole diameter should be <strong>three times the width of the post</strong>. A 100mm (4-inch) post requires a 300mm (12-inch) diameter hole; a 75mm (3-inch) post requires a 225mm to 250mm diameter hole.</li>
            <li><strong>Gravel Base for Drainage:</strong> Always add 50–75mm of compacted gravel or pea shingle to the bottom of the hole before inserting timber posts. This allows ground moisture to drain away, preventing wet rot at the post base.</li>
          </ul>

          <h3>2. How to Use Postcrete Correctly</h3>
          <p>
            Postcrete is a pre-blended rapid-setting formulation of cement, additives, and aggregates. Unlike standard concrete, <strong>you do not mix Postcrete in a bucket or wheelbarrow</strong>.
          </p>
          <ol>
            <li>Dig the hole to depth and add a 50mm gravel drainage bed.</li>
            <li>Position the post in the centre and check for plumb using a magnetic post level.</li>
            <li>Fill the hole roughly one-third full with clean cold water.</li>
            <li>Pour the dry Postcrete powder slowly around the post until the water is fully absorbed and the mix reaches within 25mm of the soil line.</li>
            <li>Tap or rod the sides gently to eliminate air voids. Postcrete sets firm in just 5 to 10 minutes.</li>
            <li>Slope the top surface slightly away from the timber post so rainwater sheds outwards.</li>
          </ol>
        </section>

        {/* FAQs */}
        <section className="c">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--calc-blue)', marginBottom: '8px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <HelpCircle size={15} aria-hidden="true" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2>Postcrete &amp; Post Hole FAQs</h2>

          <details open>
            <summary>How many bags of Postcrete do I need for a 6ft fence post?</summary>
            <p>
              In firm UK soil, a standard 100mm × 100mm (4" × 4") timber or concrete post dug 600mm deep with a 250–300mm diameter hole requires <strong>1.5 to 2 bags of 20kg Postcrete</strong>. For heavy wooden driveway gates or corners, allow 3 bags.
            </p>
          </details>

          <details>
            <summary>Do you put water or Postcrete in first?</summary>
            <p>
              Put water in first! Pour water into the dug hole until it is roughly one-third full, then empty the dry Postcrete bag around the post. If dry powder remains visible at the top, sprinkle a small amount of extra water over it.
            </p>
          </details>

          <details>
            <summary>How long does Postcrete take to set before attaching fence panels?</summary>
            <p>
              Postcrete sets initially within 5 to 10 minutes, securing the post plumb. However, wait at least 20 to 30 minutes before installing fence panels or hanging heavy gravel boards, and 24 hours before hanging heavy hinged gates.
            </p>
          </details>

          <details>
            <summary>Is Postcrete cheaper than mixing cement and ballast?</summary>
            <p>
              For 1 to 10 fence posts, Postcrete is far more economical once you factor in not having to buy bulk bags of ballast, hiring a cement mixer, or spending hours cleaning equipment. For 40+ agricultural or commercial posts, site-mixed ballast concrete becomes more cost-effective.
            </p>
          </details>
        </section>
      </article>
    </div>
  );
}
