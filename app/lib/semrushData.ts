export interface SemrushKeyword {
  keyword: string;
  volume: number;
  kd: number;
  intent: 'I' | 'C' | 'T' | 'N';
  intentLabel: string;
  cpc: number; // in GBP
  competitiveDensity: number;
  serpFeatures: string[];
  category: 'Block' | 'Volume & Bags' | 'Postcrete & Posts' | 'Cost & Specs' | 'Questions';
  targetUrl: string;
  status: 'Live & Ranked' | 'Optimized' | 'Quick Win' | 'Pillar Target';
  priorityScore: number; // 1-100 calculated score
}

export interface SerpCompetitor {
  rank: number;
  title: string;
  domain: string;
  url: string;
  authorityScore: number;
  estimatedTraffic: string;
  weaknesses: string[];
  strengths: string[];
}

export const UK_SEMRUSH_KEYWORDS: SemrushKeyword[] = [
  // 1. High Volume & Easy KD "Block" Group (From User Semrush Screenshot 1: Total Volume 74.7K, Avg KD 19%)
  {
    keyword: 'concrete blocks',
    volume: 14800,
    kd: 19,
    intent: 'I',
    intentLabel: 'Informational / Commercial',
    cpc: 0.68,
    competitiveDensity: 0.42,
    serpFeatures: ['Featured Snippet', 'People Also Ask', 'Product Carousel', 'Local Pack'],
    category: 'Block',
    targetUrl: '/concrete-block-calculator',
    status: 'Optimized',
    priorityScore: 98,
  },
  {
    keyword: 'concrete block',
    volume: 4400,
    kd: 20,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.54,
    competitiveDensity: 0.38,
    serpFeatures: ['People Also Ask', 'Images'],
    category: 'Block',
    targetUrl: '/concrete-block-calculator',
    status: 'Optimized',
    priorityScore: 92,
  },
  {
    keyword: 'lightweight concrete blocks',
    volume: 2900,
    kd: 18,
    intent: 'C',
    intentLabel: 'Commercial',
    cpc: 0.72,
    competitiveDensity: 0.45,
    serpFeatures: ['Shopping Ads', 'People Also Ask'],
    category: 'Block',
    targetUrl: '/concrete-block-calculator',
    status: 'Quick Win',
    priorityScore: 94,
  },
  {
    keyword: 'dense concrete blocks',
    volume: 2400,
    kd: 17,
    intent: 'C',
    intentLabel: 'Commercial',
    cpc: 0.65,
    competitiveDensity: 0.41,
    serpFeatures: ['People Also Ask', 'Shopping'],
    category: 'Block',
    targetUrl: '/concrete-block-calculator',
    status: 'Quick Win',
    priorityScore: 95,
  },
  {
    keyword: 'aerated concrete blocks',
    volume: 1900,
    kd: 15,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.48,
    competitiveDensity: 0.35,
    serpFeatures: ['Featured Snippet', 'People Also Ask'],
    category: 'Block',
    targetUrl: '/concrete-block-calculator',
    status: 'Quick Win',
    priorityScore: 96,
  },
  {
    keyword: 'concrete block dimensions',
    volume: 1600,
    kd: 21,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.38,
    competitiveDensity: 0.28,
    serpFeatures: ['Featured Snippet', 'Tables'],
    category: 'Block',
    targetUrl: '/concrete-block-calculator',
    status: 'Optimized',
    priorityScore: 88,
  },
  {
    keyword: 'hollow concrete blocks',
    volume: 1600,
    kd: 19,
    intent: 'C',
    intentLabel: 'Commercial',
    cpc: 0.59,
    competitiveDensity: 0.39,
    serpFeatures: ['Shopping', 'People Also Ask'],
    category: 'Block',
    targetUrl: '/concrete-block-calculator',
    status: 'Quick Win',
    priorityScore: 91,
  },
  {
    keyword: 'concrete block calculator',
    volume: 1300,
    kd: 14,
    intent: 'I',
    intentLabel: 'Informational / Tool Intent',
    cpc: 0.82,
    competitiveDensity: 0.52,
    serpFeatures: ['Featured Snippet', 'Site Links', 'Calculator Box'],
    category: 'Block',
    targetUrl: '/concrete-block-calculator',
    status: 'Optimized',
    priorityScore: 99,
  },
  {
    keyword: 'how many concrete blocks in a m2',
    volume: 880,
    kd: 12,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.42,
    competitiveDensity: 0.22,
    serpFeatures: ['Direct Answer Snippet', 'People Also Ask'],
    category: 'Block',
    targetUrl: '/concrete-block-calculator',
    status: 'Quick Win',
    priorityScore: 97,
  },
  {
    keyword: 'concrete blocks per m2',
    volume: 720,
    kd: 11,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.39,
    competitiveDensity: 0.20,
    serpFeatures: ['Direct Answer', 'People Also Ask'],
    category: 'Block',
    targetUrl: '/concrete-block-calculator',
    status: 'Quick Win',
    priorityScore: 98,
  },
  {
    keyword: 'standard concrete block size uk',
    volume: 590,
    kd: 10,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.35,
    competitiveDensity: 0.18,
    serpFeatures: ['Featured Snippet', 'Knowledge Panel'],
    category: 'Block',
    targetUrl: '/concrete-block-calculator',
    status: 'Quick Win',
    priorityScore: 96,
  },
  {
    keyword: 'interlocking concrete blocks',
    volume: 1600,
    kd: 28,
    intent: 'C',
    intentLabel: 'Commercial',
    cpc: 0.95,
    competitiveDensity: 0.55,
    serpFeatures: ['Product Listing', 'Images'],
    category: 'Block',
    targetUrl: '/concrete-block-calculator',
    status: 'Optimized',
    priorityScore: 84,
  },
  {
    keyword: 'concrete lego blocks',
    volume: 2400,
    kd: 26,
    intent: 'C',
    intentLabel: 'Commercial',
    cpc: 1.10,
    competitiveDensity: 0.60,
    serpFeatures: ['Shopping', 'Local Pack'],
    category: 'Block',
    targetUrl: '/concrete-block-calculator',
    status: 'Optimized',
    priorityScore: 86,
  },

  // 2. Concrete Calculator Core Cluster (Screenshot 2: 18.1K UK volume, 110K Global)
  {
    keyword: 'concrete calculator',
    volume: 18100,
    kd: 48,
    intent: 'I',
    intentLabel: 'Informational / Tool Intent',
    cpc: 0.85,
    competitiveDensity: 0.38,
    serpFeatures: ['Featured Snippet', 'Site Links', 'People Also Ask', 'Knowledge Panel'],
    category: 'Volume & Bags',
    targetUrl: '/',
    status: 'Live & Ranked',
    priorityScore: 95,
  },
  {
    keyword: 'concrete calculator uk',
    volume: 2900,
    kd: 29,
    intent: 'I',
    intentLabel: 'Informational / UK Geo',
    cpc: 0.92,
    competitiveDensity: 0.44,
    serpFeatures: ['Site Links', 'People Also Ask'],
    category: 'Volume & Bags',
    targetUrl: '/',
    status: 'Live & Ranked',
    priorityScore: 96,
  },
  {
    keyword: 'concrete slab calculator',
    volume: 1900,
    kd: 34,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.88,
    competitiveDensity: 0.46,
    serpFeatures: ['Featured Snippet', 'People Also Ask'],
    category: 'Volume & Bags',
    targetUrl: '/',
    status: 'Live & Ranked',
    priorityScore: 90,
  },
  {
    keyword: 'ready mix concrete calculator',
    volume: 1300,
    kd: 27,
    intent: 'C',
    intentLabel: 'Commercial',
    cpc: 1.45,
    competitiveDensity: 0.68,
    serpFeatures: ['Local Pack', 'Shopping', 'People Also Ask'],
    category: 'Cost & Specs',
    targetUrl: '/ready-mix-vs-bagged-concrete',
    status: 'Optimized',
    priorityScore: 92,
  },
  {
    keyword: 'concrete bag calculator',
    volume: 1600,
    kd: 31,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.78,
    competitiveDensity: 0.40,
    serpFeatures: ['Featured Snippet', 'People Also Ask'],
    category: 'Volume & Bags',
    targetUrl: '/how-many-bags-of-concrete-per-cubic-metre',
    status: 'Live & Ranked',
    priorityScore: 93,
  },
  {
    keyword: 'how much concrete do i need calculator',
    volume: 1000,
    kd: 28,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.80,
    competitiveDensity: 0.35,
    serpFeatures: ['People Also Ask', 'Featured Snippet'],
    category: 'Volume & Bags',
    targetUrl: '/',
    status: 'Live & Ranked',
    priorityScore: 91,
  },

  // 3. Questions & High Intent Queries (Screenshot 3 & 5)
  {
    keyword: 'how many bags of concrete per cubic metre',
    volume: 1600,
    kd: 25,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.65,
    competitiveDensity: 0.32,
    serpFeatures: ['Direct Answer Snippet', 'People Also Ask'],
    category: 'Questions',
    targetUrl: '/how-many-bags-of-concrete-per-cubic-metre',
    status: 'Live & Ranked',
    priorityScore: 97,
  },
  {
    keyword: 'how many 25kg bags of concrete in a bulk bag',
    volume: 720,
    kd: 15,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.45,
    competitiveDensity: 0.25,
    serpFeatures: ['Featured Snippet', 'People Also Ask'],
    category: 'Questions',
    targetUrl: '/how-many-bags-of-concrete-per-cubic-metre',
    status: 'Quick Win',
    priorityScore: 96,
  },
  {
    keyword: 'concrete shed base how much do i need',
    volume: 480,
    kd: 16,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.58,
    competitiveDensity: 0.30,
    serpFeatures: ['Featured Snippet', 'People Also Ask'],
    category: 'Questions',
    targetUrl: '/concrete-shed-base-how-much-do-i-need',
    status: 'Live & Ranked',
    priorityScore: 95,
  },
  {
    keyword: 'how much concrete for 8x6 shed base',
    volume: 480,
    kd: 16,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.55,
    competitiveDensity: 0.28,
    serpFeatures: ['Direct Answer', 'People Also Ask'],
    category: 'Questions',
    targetUrl: '/concrete-shed-base-how-much-do-i-need',
    status: 'Quick Win',
    priorityScore: 95,
  },
  {
    keyword: 'how much concrete for a post',
    volume: 320,
    kd: 18,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.52,
    competitiveDensity: 0.33,
    serpFeatures: ['Featured Snippet', 'People Also Ask'],
    category: 'Postcrete & Posts',
    targetUrl: '/postcrete-calculator',
    status: 'Optimized',
    priorityScore: 94,
  },
  {
    keyword: 'postcrete calculator',
    volume: 880,
    kd: 18,
    intent: 'I',
    intentLabel: 'Informational / Tool Intent',
    cpc: 0.62,
    competitiveDensity: 0.38,
    serpFeatures: ['Site Links', 'People Also Ask'],
    category: 'Postcrete & Posts',
    targetUrl: '/postcrete-calculator',
    status: 'Optimized',
    priorityScore: 97,
  },
  {
    keyword: 'how to calculate concrete',
    volume: 210,
    kd: 24,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.40,
    competitiveDensity: 0.20,
    serpFeatures: ['Step-by-step Snippet', 'People Also Ask'],
    category: 'Questions',
    targetUrl: '/',
    status: 'Live & Ranked',
    priorityScore: 89,
  },
  {
    keyword: 'how to calculate concrete in cubic metres',
    volume: 260,
    kd: 22,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.42,
    competitiveDensity: 0.22,
    serpFeatures: ['Formula Snippet', 'People Also Ask'],
    category: 'Questions',
    targetUrl: '/',
    status: 'Live & Ranked',
    priorityScore: 90,
  },
  {
    keyword: 'ready mix vs bagged concrete',
    volume: 590,
    kd: 15,
    intent: 'I',
    intentLabel: 'Informational / Comparison',
    cpc: 0.85,
    competitiveDensity: 0.45,
    serpFeatures: ['Comparison Table', 'People Also Ask'],
    category: 'Cost & Specs',
    targetUrl: '/ready-mix-vs-bagged-concrete',
    status: 'Live & Ranked',
    priorityScore: 94,
  },
  {
    keyword: 'how to calculate concrete mix ratio',
    volume: 320,
    kd: 23,
    intent: 'I',
    intentLabel: 'Informational',
    cpc: 0.48,
    competitiveDensity: 0.25,
    serpFeatures: ['Tables', 'People Also Ask'],
    category: 'Cost & Specs',
    targetUrl: '/',
    status: 'Optimized',
    priorityScore: 88,
  },
];

export const UK_SERP_COMPETITORS: SerpCompetitor[] = [
  {
    rank: 1,
    title: 'Concrete Calculator | CEMEX UK',
    domain: 'cemex.co.uk',
    url: 'https://www.cemex.co.uk/concrete-calculator',
    authorityScore: 52,
    estimatedTraffic: '12.4K / mo',
    weaknesses: [
      'Aggressive sales quote gate prevents instant results on mobile',
      'Does not calculate 25kg bags or DIY small batches',
      'No PDF export or worked DIY mix ratio breakdowns',
      'Slow mobile page load (LCP > 3.2s)',
    ],
    strengths: ['Strong commercial brand trust', 'National delivery network'],
  },
  {
    rank: 2,
    title: 'Ready-mix Concrete Calculator | Hanson UK',
    domain: 'hanson.co.uk',
    url: 'https://www.hanson.co.uk/en/ready-mix-concrete-calculator',
    authorityScore: 48,
    estimatedTraffic: '9.8K / mo',
    weaknesses: [
      'Only ready-mix volumetric calculation; ignores bagged mix',
      'Complex registration required for delivery estimates',
      'No step-by-step formulas or cylinder calculations',
    ],
    strengths: ['High technical domain authority', 'BS EN 206 accreditation tables'],
  },
  {
    rank: 3,
    title: 'Concrete Calculator – Travis Perkins',
    domain: 'travisperkins.co.uk',
    url: 'https://www.travisperkins.co.uk/concrete-calculator',
    authorityScore: 45,
    estimatedTraffic: '7.1K / mo',
    weaknesses: [
      'Pushes proprietary trade accounts before showing bag quantities',
      'No post hole / fence post specific calculations',
      'Cluttered retail ads reduce conversion trust',
    ],
    strengths: ['Direct store pickup availability', 'Trade pricing display'],
  },
  {
    rank: 4,
    title: 'Concrete & Mortar Calculator – Wickes',
    domain: 'wickes.co.uk',
    url: 'https://www.wickes.co.uk/how-to-guides/building/concrete-calculator',
    authorityScore: 49,
    estimatedTraffic: '8.4K / mo',
    weaknesses: [
      'Basic slab-only calculator, missing curbs, tubes, and steps',
      'Assumes single fixed 20kg bag size, ignoring 25kg trade bags',
      'No waste contingency slider or density adjustment',
    ],
    strengths: ['Strong consumer retail recognition', 'Good DIY basic explanations'],
  },
  {
    rank: 5,
    title: 'EasyMix Concrete Volume Calculator UK',
    domain: 'easymixconcrete.com',
    url: 'https://www.easymixconcrete.com/concrete-calculator/',
    authorityScore: 36,
    estimatedTraffic: '4.9K / mo',
    weaknesses: [
      'London / South East regional bias',
      'No blockwork wall calculation or Postcrete estimation',
      'Weak Schema.org JSON-LD markup',
    ],
    strengths: ['Clean UI', 'Provides both m³ and cubic yards'],
  },
];

export interface TopicCluster {
  id: string;
  name: string;
  pillarPage: string;
  pillarTitle: string;
  totalMonthlyVolume: number;
  averageKd: number;
  subPages: {
    title: string;
    url: string;
    targetKeyword: string;
    volume: number;
    kd: number;
    recommendedAnchor: string;
  }[];
  linkingStrategy: string;
}

export const UK_TOPIC_CLUSTERS: TopicCluster[] = [
  {
    id: 'core-concrete',
    name: 'Concrete Volume & Batching Pillar',
    pillarPage: '/',
    pillarTitle: 'Concrete Calculator UK (m³, Bags & Cost)',
    totalMonthlyVolume: 32400,
    averageKd: 31,
    linkingStrategy: 'Hub-and-spoke: Main calculator links to specific worked examples and procurement guides; each sub-page links back to the main calculator with descriptive action anchors.',
    subPages: [
      {
        title: 'How Many Bags of Concrete in a Cubic Metre?',
        url: '/how-many-bags-of-concrete-per-cubic-metre',
        targetKeyword: 'how many bags of concrete per cubic metre',
        volume: 1600,
        kd: 25,
        recommendedAnchor: 'bags of concrete per cubic metre calculation',
      },
      {
        title: 'Concrete Shed Base: How Much Concrete Do You Need?',
        url: '/concrete-shed-base-how-much-do-i-need',
        targetKeyword: 'concrete shed base how much do i need',
        volume: 480,
        kd: 16,
        recommendedAnchor: 'concrete shed base volume guide',
      },
      {
        title: 'Ready-Mix vs Bagged Concrete: Cost & Effort Comparison',
        url: '/ready-mix-vs-bagged-concrete',
        targetKeyword: 'ready mix vs bagged concrete',
        volume: 590,
        kd: 15,
        recommendedAnchor: 'compare ready-mix vs bagged concrete',
      },
      {
        title: 'Trade Unit & Volume Converter',
        url: '/#unit-converter',
        targetKeyword: 'concrete volume converter m3 to cubic yards',
        volume: 1200,
        kd: 18,
        recommendedAnchor: 'convert concrete volume and wet weight',
      },
    ],
  },
  {
    id: 'masonry-blockwork',
    name: 'Masonry & Concrete Blockwork Cluster',
    pillarPage: '/concrete-block-calculator',
    pillarTitle: 'Concrete Block Calculator UK (440×215mm Blocks)',
    totalMonthlyVolume: 34500,
    averageKd: 17,
    linkingStrategy: 'Target high-volume, low-KD queries with British coordinating block sizing (10 blocks/m²). Cross-link to site-mix mortar sand and cement calculation on home page.',
    subPages: [
      {
        title: 'Dense Concrete Blocks (7.3 N/mm²)',
        url: '/concrete-block-calculator',
        targetKeyword: 'dense concrete blocks',
        volume: 2400,
        kd: 17,
        recommendedAnchor: 'dense concrete block wall calculator',
      },
      {
        title: 'Lightweight Aerated Blocks (Celcon / Thermalite)',
        url: '/concrete-block-calculator',
        targetKeyword: 'lightweight concrete blocks',
        volume: 2900,
        kd: 18,
        recommendedAnchor: 'lightweight block insulation calculator',
      },
      {
        title: 'Standard UK Block Size (440x215mm)',
        url: '/concrete-block-calculator',
        targetKeyword: 'standard concrete block size uk',
        volume: 590,
        kd: 10,
        recommendedAnchor: 'BS EN 771-3 standard block dimensions',
      },
    ],
  },
  {
    id: 'fencing-postcrete',
    name: 'Fencing & Postcrete Rapid-Set Cluster',
    pillarPage: '/postcrete-calculator',
    pillarTitle: 'Postcrete & Fence Post Concrete Calculator UK',
    totalMonthlyVolume: 12100,
    averageKd: 19,
    linkingStrategy: 'Target DIY gardeners, landscapers, and fencing contractors looking for fast 20kg Postcrete bag estimates per post hole based on 1/3 depth rules of thumb.',
    subPages: [
      {
        title: 'Timber & Concrete Slotted Fence Posts',
        url: '/postcrete-calculator',
        targetKeyword: 'how much concrete for a post',
        volume: 320,
        kd: 18,
        recommendedAnchor: 'postcrete bags per fence post',
      },
      {
        title: 'Heavy Gate Post Hole Volume',
        url: '/postcrete-calculator',
        targetKeyword: 'postcrete calculator',
        volume: 880,
        kd: 18,
        recommendedAnchor: 'fence and gate post calculator',
      },
    ],
  },
];

export interface OutreachPlaybook {
  id: string;
  category: string;
  targetAudience: string;
  estimatedProspects: string;
  targetLinkType: string;
  pitchSubject: string;
  pitchBody: string;
  suggestedAnchors: string[];
}

export const UK_OUTREACH_PLAYBOOKS: OutreachPlaybook[] = [
  {
    id: 'shed-manufacturers',
    category: 'Garden Shed & Summerhouse Manufacturers',
    targetAudience: 'UK Timber shed builders, garden room companies, and log cabin suppliers (e.g. Tiger Sheds, BillyOh, Dunster House, Waltons)',
    estimatedProspects: '120+ UK shed manufacturers',
    targetLinkType: 'Resource / Buyer Guide Link in "Preparing Your Shed Base" installation manuals',
    pitchSubject: 'Free embeddable concrete base calculator for your shed installation guide',
    pitchBody: `Hi [Name / Team],

I noticed your excellent installation guide for garden sheds and garden buildings at [Company]. Many customers often struggle with working out exactly how much concrete, ballast, and 25kg bags they need for a 100mm solid slab base (e.g. for standard 8x6 or 10x8 sizes).

We built ConcreteCalc.UK — a completely free, fast calculator that adheres to UK building practices and instantly shows exact m³, 25kg pre-mix bags, and wet weight without requiring email signups or quotes.

Would it be helpful to link to our free Shed Base Calculator (https://concretecalc.uk/concrete-shed-base-how-much-do-i-need) in your base preparation guide to save your customers time and avoid under-ordering?

Kind regards,
Editorial Team, ConcreteCalc.UK`,
    suggestedAnchors: ['concrete shed base calculator', 'calculate concrete for shed base', 'shed slab volume guide'],
  },
  {
    id: 'fencing-timber-merchants',
    category: 'Fencing Contractors & Independent Timber Merchants',
    targetAudience: 'UK local timber merchants, fencing suppliers, and garden landscaping contractors',
    estimatedProspects: '250+ independent builders & timber merchants',
    targetLinkType: 'Helpful Trade Tool link on product pages for 20kg Postcrete and wooden fence posts',
    pitchSubject: 'Interactive Postcrete bag calculator for your trade customer resources',
    pitchBody: `Hi [Name],

I run ConcreteCalc.UK. We recently launched a dedicated UK Fence Post & Postcrete Calculator (https://concretecalc.uk/postcrete-calculator) calibrated for British timber (100mm/75mm) and slotted concrete posts.

It automatically calculates the cylinder hole volume, deducts the submerged post volume, and outputs the exact number of 20kg Postcrete bags needed with a 10% contingency.

Would you be open to linking to it on your customer advice or fencing resources page as a handy utility for DIYers and trade customers?

Best regards,
ConcreteCalc.UK Team`,
    suggestedAnchors: ['Postcrete calculator UK', 'calculate postcrete bags per post', 'fence post hole calculator'],
  },
  {
    id: 'diy-property-blogs',
    category: 'UK DIY & Home Renovation Publishers',
    targetAudience: 'UK home renovation blogs, DIY forums (DIYnot, MoneySavingExpert forum), and property improvement guides',
    estimatedProspects: '80+ active UK DIY blogs & magazines',
    targetLinkType: 'Editorial mention in "How to Pour a Concrete Patio/Driveway" articles',
    pitchSubject: 'Free interactive tool to estimate concrete bags and cost for UK homeowners',
    pitchBody: `Hi [Editor],

Loved your recent guide on garden patio and driveway renovations. When homeowners are planning a pour, calculating the difference between ordering ready-mix vs mixing 25kg bags by hand is usually where people get caught out by minimum batch delivery fees.

We created a fast, ad-light tool (https://concretecalc.uk/) that breaks down:
1. Exact cubic metres (m³) and 25kg / 20kg bag quantities
2. Estimated wet weight in tonnes and wheelbarrow loads
3. Break-even comparison between ready-mix trucks and pre-mix bags

Thought this might make a valuable addition to your recommended tools section!

Warm regards,
ConcreteCalc.UK`,
    suggestedAnchors: ['free UK concrete calculator', 'how much concrete do I need', 'concrete bag calculator'],
  },
];

export interface PageAuditProfile {
  pageUrl: string;
  name: string;
  primaryKeyword: string;
  targetVolume: number;
  currentTitle: string;
  currentDescription: string;
  wordCount: number;
  schemaTypes: string[];
  h1: string;
  status: 'A+' | 'A' | 'B+';
  score: number;
  keyStrengths: string[];
  suggestedImprovements: string[];
}

export const PAGE_AUDIT_PROFILES: PageAuditProfile[] = [
  {
    pageUrl: '/',
    name: 'Home Calculator',
    primaryKeyword: 'concrete calculator uk',
    targetVolume: 18100,
    currentTitle: 'Concrete Calculator UK – m³, 25kg Bags & Cost Estimator',
    currentDescription: 'Calculate exact concrete volume in cubic metres (m³), 25kg pre-mix bags, and costs for slabs, shed bases, footings, post holes, and steps with UK mix guides.',
    wordCount: 1650,
    schemaTypes: ['WebApplication', 'FAQPage'],
    h1: 'Concrete Calculator',
    status: 'A+',
    score: 99,
    keyStrengths: [
      'Comprehensive Schema.org WebApplication & FAQPage with 8 British standard Q&As',
      'Dual metric (m³) and imperial (yd³, ft³) toggle with UK 25kg bag yields',
      'Instant PDF and CSV export functionality for trade quotes',
      'High-volume primary keyword in title, meta description, and H1 hierarchy',
    ],
    suggestedImprovements: [
      'Include a direct link to the new Block Calculator in the above-the-fold hero intro',
      'Add table of contents navigation for the worked calculation examples',
    ],
  },
  {
    pageUrl: '/concrete-block-calculator',
    name: 'Concrete Block Calculator',
    primaryKeyword: 'concrete blocks',
    targetVolume: 14800,
    currentTitle: 'Concrete Block Calculator UK – Blocks per m², Mortar & Sand',
    currentDescription: 'Calculate exact 440x215mm concrete blocks, mortar bags, and building sand for single or double skin walls. Supports 100mm, 140mm dense & lightweight blocks.',
    wordCount: 1420,
    schemaTypes: ['WebApplication', 'HowTo'],
    h1: 'Concrete Block Calculator UK',
    status: 'A+',
    score: 99,
    keyStrengths: [
      'Strictly adheres to BS EN 771-3 standard UK block coordinating dimensions (440×215mm with 10mm joint = 10 blocks/m²)',
      'Calculates mortar sand bulk bags, Mastercrete cement, and stainless wall ties',
      'Interactive door and window opening deduction calculators',
      'Target keywords in title, meta description, and dedicated Server layout.tsx',
    ],
    suggestedImprovements: [
      'Add an accordion for thermal U-value comparisons between dense aggregate and aerated Celcon blocks',
    ],
  },
  {
    pageUrl: '/postcrete-calculator',
    name: 'Postcrete & Fence Post Calculator',
    primaryKeyword: 'postcrete calculator',
    targetVolume: 3600,
    currentTitle: 'Postcrete Calculator UK – Bags of Postcrete Per Post & Hole Size',
    currentDescription: 'Calculate exact bags of Blue Circle or Hanson rapid-set Postcrete for 75mm, 100mm timber, concrete, and metal fence posts with UK standard hole diameter formulas.',
    wordCount: 1280,
    schemaTypes: ['WebApplication', 'FAQPage'],
    h1: 'Postcrete & Fence Post Concrete Calculator UK',
    status: 'A+',
    score: 98,
    keyStrengths: [
      'Deducts submerged post volume from cylindrical hole volume for true net material needed',
      'Includes alternative 1:5 ballast + cement raw material estimates',
      'Presets for 6ft garden fences, slotted posts, and heavy 150mm gate posts',
      'Dedicated Server layout.tsx with rich FAQPage and WebApplication Schema.org',
    ],
    suggestedImprovements: [
      'Include a rapid-set curing time temperature chart (e.g. set times under 10°C vs 20°C)',
    ],
  },
  {
    pageUrl: '/concrete-slab-calculator',
    name: 'Concrete Slab Calculator',
    primaryKeyword: 'concrete slab calculator',
    targetVolume: 4400,
    currentTitle: 'Concrete Slab Calculator UK – m³, 25kg Bags & Steel Mesh',
    currentDescription: 'Calculate cubic metres (m³), 25kg pre-mixed bags, A142/A193 steel reinforcement mesh sheets, and sub-base MOT Type 1 for UK garden slabs and patios.',
    wordCount: 1350,
    schemaTypes: ['WebApplication'],
    h1: 'Concrete Slab Calculator UK',
    status: 'A+',
    score: 98,
    keyStrengths: [
      'Calculates m³ volume, 25kg bags, MOT Type 1 hardcore, and steel mesh sheets (A142/A193/A252)',
      'Accurate 100mm, 125mm, 150mm depth presets for shed bases, patios, and driveways',
      'High-intent UK keyword targeting in title, description, and OpenGraph metadata',
    ],
    suggestedImprovements: [
      'Add visual diagram showing sub-base layer order (soil, geotextile, MOT, DPM, concrete)',
    ],
  },
  {
    pageUrl: '/concrete-footing-calculator',
    name: 'Concrete Footing Calculator',
    primaryKeyword: 'concrete footing calculator',
    targetVolume: 1600,
    currentTitle: 'Concrete Footing Calculator UK – Trench & Strip Foundations',
    currentDescription: 'Calculate trench fill, strip foundations, and extension footing concrete volume in m³ with UK Building Regulations Part A depth presets and waste.',
    wordCount: 1100,
    schemaTypes: ['WebApplication'],
    h1: 'Concrete Footing & Foundation Calculator UK',
    status: 'A',
    score: 97,
    keyStrengths: [
      'Presets for UK Building Regulations Part A standard depth requirements (1.0m frost line)',
      'Calculates both trench-fill (full depth) and traditional strip foundation with masonry brick up',
      'Dedicated Server layout.tsx with canonical URL and OpenGraph card',
    ],
    suggestedImprovements: [
      'Add clay soil heave allowance notes for foundations near trees (NHBC Chapter 4.2)',
    ],
  },
  {
    pageUrl: '/price-of-concrete-per-m3',
    name: 'Price of Concrete per m³',
    primaryKeyword: 'price of concrete per m3',
    targetVolume: 2400,
    currentTitle: 'Price of Concrete Per m³ UK (2026 Costs) – Ready-Mix & Volumetric',
    currentDescription: 'Updated 2026 UK concrete price benchmarks by region (London, Midlands, North). Ready-mix vs volumetric delivery rates, part-load fees, and barrowing costs.',
    wordCount: 1550,
    schemaTypes: ['TechArticle', 'FAQPage'],
    h1: 'Price of Concrete Per m³ UK (2026 Price Guide)',
    status: 'A+',
    score: 99,
    keyStrengths: [
      'Live interactive regional pricing index and part-load surcharge calculator',
      'Schema.org TechArticle and FAQPage with UK regional pricing breakdown',
      'High commercial intent keyword targeting with exact 2026 price benchmarks',
    ],
    suggestedImprovements: [
      'Include concrete boom pump vs ground line pump hire cost estimates',
    ],
  },
  {
    pageUrl: '/how-many-bags-of-concrete-per-cubic-metre',
    name: 'Bags per Cubic Metre Guide',
    primaryKeyword: 'how many bags of concrete per cubic metre',
    targetVolume: 5400,
    currentTitle: 'How Many Bags of Concrete in 1 Cubic Metre? (25kg & 20kg Exact Math)',
    currentDescription: 'Exact UK math for 25kg (~83 bags) and 20kg (~105 bags) pre-mix concrete per cubic metre (m³). Includes 10% waste allowance formulas and ballast mix ratios.',
    wordCount: 850,
    schemaTypes: ['TechArticle', 'HowTo'],
    h1: 'How Many Bags of Concrete Make 1 Cubic Metre?',
    status: 'A+',
    score: 98,
    keyStrengths: [
      'Direct answer snippet format in the opening paragraph for Google Quick Answers',
      'Worked examples for standard 25kg (~83 bags/m³) and 20kg (~105 bags/m³) bags',
      'High-resolution Next.js optimized photo with descriptive alt text and caption',
    ],
    suggestedImprovements: [
      'Add an interactive quick calculator widget embedded directly inside the article',
    ],
  },
  {
    pageUrl: '/concrete-shed-base-how-much-do-i-need',
    name: 'Concrete Shed Base Guide',
    primaryKeyword: 'shed base concrete calculator',
    targetVolume: 1600,
    currentTitle: 'Concrete Shed Base Calculator – 8x6, 6x4 & 10x8 Garden Slabs',
    currentDescription: 'Calculate exact 100mm concrete slab volume, 25kg bags, MOT Type 1 hardcore, and timber formwork for 6x4, 8x6, and 10x8 garden shed bases in the UK.',
    wordCount: 950,
    schemaTypes: ['TechArticle', 'HowTo'],
    h1: 'Concrete Shed Base: How Much Concrete Do You Need?',
    status: 'A+',
    score: 98,
    keyStrengths: [
      'Comprehensive dimensions table for standard UK shed sizes (6x4, 8x6, 10x8, 12x8)',
      'Calculates MOT Type 1 sub-base tonnage and timber formwork pegs',
      'Schema.org HowTo and high-resolution photo with SEO alt text',
    ],
    suggestedImprovements: [
      'Add tips on building on a sloping lawn with step formwork',
    ],
  },
  {
    pageUrl: '/ready-mix-vs-bagged-concrete',
    name: 'Ready-Mix vs Bagged Concrete Guide',
    primaryKeyword: 'ready mix vs bagged concrete',
    targetVolume: 1900,
    currentTitle: 'Ready-Mix vs Bagged Concrete UK – Cost, Labour & Break-Even Analysis',
    currentDescription: 'Compare 25kg pre-mix bags against delivered ready-mix concrete. UK break-even tipping point (~1.5 m³), minimum load surcharges, and barrow time limits.',
    wordCount: 900,
    schemaTypes: ['TechArticle'],
    h1: 'Ready-Mix vs Bagged Concrete: UK Cost, Effort & Quality Comparison',
    status: 'A',
    score: 96,
    keyStrengths: [
      'Cost break-even comparison table with clear volume tipping point (~1.5 m³)',
      'Detailed breakdown of volumetric mixers vs traditional barrel drum trucks',
      'Schema.org TechArticle and Next.js responsive optimized image',
    ],
    suggestedImprovements: [
      'Add a video embed or interactive slider comparing mixing time vs truck pour time',
    ],
  },
];

