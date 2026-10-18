import type { Metadata, Viewport } from 'next';
import './globals.css';
import { globalStyles } from './styles';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';

export const viewport: Viewport = {
  themeColor: '#034694',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://concretecalc.co.uk'),
  title: {
    default: 'Concrete Calculator UK – m³, 25kg Bags & Cost Estimator',
    template: '%s | ConcreteCalc UK',
  },
  description:
    'Calculate exact concrete volume in cubic metres (m³), 25kg pre-mix bags, and costs for slabs, shed bases, footings, post holes, and steps with UK mix guides.',
  keywords: [
    'concrete calculator uk',
    'concrete calculator',
    'calculate concrete m3',
    'concrete volume calculator',
    'concrete mix calculator uk',
    'how much concrete do i need',
    'concrete bags calculator',
    'ready mix concrete calculator uk',
    'concrete slab calculator uk',
    'cubic metres to bags of concrete',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Concrete Calculator UK – m³, 25kg Bags & Cost Estimator',
    description:
      'Calculate exact concrete volume in cubic metres (m³), 25kg pre-mix bags, and estimated costs for slabs, footings, shed bases, and post holes in the UK.',
    url: 'https://concretecalc.co.uk',
    siteName: 'ConcreteCalc UK',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: '/images/concrete-bags-cubic-metre.jpg',
        width: 1200,
        height: 675,
        alt: 'Concrete Calculator UK – Stacked 25kg cement bags and builder wheelbarrow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Concrete Calculator UK – m³, 25kg Bags & Cost Estimator',
    description:
      'Free UK concrete calculator. Calculate cubic metres, 25kg bags, ballast, cement, and ready-mix costs for any project.',
    images: ['/images/concrete-bags-cubic-metre.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://concretecalc.co.uk/#organization',
      name: 'ConcreteCalc UK',
      url: 'https://concretecalc.co.uk',
      logo: 'https://concretecalc.co.uk/images/logo.png',
      description:
        'UK industry-standard concrete volume, weight, mix design, and pre-mixed bag estimation tools for builders, contractors, and DIYers.',
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://concretecalc.co.uk/#webapp',
      name: 'Concrete Calculator UK',
      url: 'https://concretecalc.co.uk',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      description:
        'Calculate concrete volume in cubic metres, number of 25kg bags, ballast, cement, and estimated cost for UK slabs, footings, shed bases, columns, and walls.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
      inLanguage: 'en-GB',
      featureList: [
        'Cubic Metres (m³) Volume Calculation',
        '25kg Pre-Mix Bag Estimator',
        'UK Standard Concrete Mixes (C20, C25, C30)',
        'Steel Reinforcing Mesh (A142, A193) Estimation',
        'MOT Type 1 Sub-Base & DPM Calculations',
        'Postcrete Fence Post Estimator',
        'Dense & Lightweight Concrete Blockwork Estimator',
      ],
    },
    {
      '@type': 'HowTo',
      '@id': 'https://concretecalc.co.uk/#howto-calculate-concrete',
      name: 'How to Calculate Concrete Volume and 25kg Bags for UK Projects',
      description:
        'Step-by-step instructions to calculate exact cubic metres (m³), 25kg pre-mix bags, and raw ballast/cement quantities for domestic building projects.',
      totalTime: 'PT10M',
      tool: [
        { '@type': 'HowToTool', name: 'Tape measure (metric)' },
        { '@type': 'HowToTool', name: 'ConcreteCalc UK online tool' },
      ],
      supply: [
        { '@type': 'HowToSupply', name: '25kg pre-mixed concrete bags or ready-mix concrete' },
        { '@type': 'HowToSupply', name: 'Water' },
      ],
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Measure Area Dimensions in Metres',
          text: 'Measure the length and width of your pour area in metres. Measure the slab or footing depth in millimetres and convert to metres (e.g. 100mm = 0.10m; 150mm = 0.15m).',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Calculate Net Volume (m³)',
          text: 'Multiply length × width × depth to obtain net cubic metres (m³). For example: a 4m × 3m slab at 100mm depth equals 4 × 3 × 0.10 = 1.20 m³.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Add 10% Waste & Ground Excavation Contingency',
          text: 'Excavated ground is rarely level and formwork can deflect slightly. Multiply net volume by 1.10 (10% waste allowance) to ensure you do not run short before finishing the pour.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Calculate Bag Quantities or Order Ready-Mix',
          text: 'Multiply total required m³ by 83 to 92 bags to calculate standard 25kg dry pre-mix bags, or order ready-mix rounded up to the nearest 0.1 m³ if over 1.0 m³.',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I calculate cubic metres of concrete?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Multiply length × width × depth, with all measurements in metres. For example, a 3m × 3m slab that is 100mm (0.1m) thick requires 3 × 3 × 0.1 = 0.90 m³. Always add a 5% to 10% waste allowance to account for uneven ground excavation and formwork deflection.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many bags of concrete make one cubic metre?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A standard 25kg bag of pre-mixed dry concrete yields approximately 0.012 m³ of wet concrete, meaning one cubic metre requires roughly 83 bags (or ~92 bags with a 10% waste allowance). If using 20kg bags, each yields approximately 0.0095 m³, requiring around 105 bags per cubic metre.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much concrete do I need for a 6x4 or 8x6 shed base?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A standard 8ft × 6ft (2.4m × 1.8m) garden shed base at 100mm (4 inches) thickness requires 0.432 m³ net volume. With a 10% waste allowance (0.475 m³), you will need approximately 40 bags of 25kg pre-mix, or about 0.5 tonnes of concrete.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is it cheaper to buy bags or ready-mix delivery in the UK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For projects under 0.50 m³, 25kg pre-mixed bags are almost always cheaper and more convenient. Between 0.50 and 1.00 m³, prices are closely matched. For jobs over 1.00 m³, ready-mix or volumetric truck delivery is usually significantly cheaper, saves hours of heavy manual mixing, and provides certified consistent strength.',
          },
        },
        {
          '@type': 'Question',
          name: 'What thickness should a domestic concrete slab be?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Garden paths and patio sub-bases: 75–100mm. Timber shed and garden room bases: 100mm. Domestic car driveways and garage slabs: 100–150mm with steel reinforcing mesh (A142 or A193) and a compacted 150mm MOT Type 1 sub-base.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why is adding a waste allowance essential in concrete calculations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ground excavations are never laser-flat, timber formwork flexes slightly under hydrostatic pressure, and wet concrete adheres to wheelbarrows and tools. Adding a 5% to 10% contingency allowance guarantees you will not run short before finishing the pour, preventing cold joints and structural weaknesses.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I calculate concrete for post holes and cylindrical columns?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Use the cylinder volume formula: π × (diameter ÷ 2)² × depth. For example, a standard 300mm (0.3m) diameter fence post hole dug 600mm (0.6m) deep requires approximately 0.042 m³ of concrete, or roughly 4 bags of 25kg post mix (minus the displaced volume of your post).',
          },
        },
        {
          '@type': 'Question',
          name: 'What concrete mix ratio and strength grade should I use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For paths and patios, use a C20 mix (1:2:4 ratio of cement : sand : coarse aggregate). For shed bases and domestic footings, use C20–C25 (1:1.5:3). For domestic car driveways and heavy-use slabs, use C25–C30 with A142/A193 steel reinforcing mesh.',
          },
        },
      ],
    },
  ],
};

const themeInitializerScript = `
(function() {
  try {
    var stored = localStorage.getItem('concretecalc_theme') || localStorage.getItem('theme');
    var setting = (stored === 'light' || stored === 'dark' || stored === 'system') ? stored : 'light';
    var resolved = setting;
    if (setting === 'system') {
      resolved = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.setAttribute('data-theme-setting', setting);
    document.documentElement.style.colorScheme = resolved;
  } catch (e) {}
})();
`;

const windowFetchShimScript = `
(function() {
  try {
    var win = typeof window !== 'undefined' ? window : null;
    if (!win) return;

    var errorHandler = function(e) {
      try {
        var msg = (e && (e.message || (e.error && e.error.message))) || '';
        var file = (e && e.filename) || '';
        if (
          file.indexOf('chrome-extension:') !== -1 ||
          file.indexOf('moz-extension:') !== -1 ||
          msg.indexOf('Cannot set property fetch') !== -1 ||
          msg.indexOf('only a getter') !== -1
        ) {
          if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          if (e.preventDefault) e.preventDefault();
          return true;
        }
      } catch (err) {}
    };

    win.addEventListener('error', errorHandler, true);
    if (win.addEventListener) {
      win.addEventListener('unhandledrejection', function(e) {
        try {
          var reason = e && (e.reason || '');
          var rMsg = (reason && reason.message) || String(reason);
          if (rMsg.indexOf('Cannot set property fetch') !== -1 || rMsg.indexOf('only a getter') !== -1) {
            if (e.preventDefault) e.preventDefault();
          }
        } catch (err) {}
      });
    }

    var originalFetch = win.fetch;
    var currentFetch = originalFetch;

    var fetchDescriptor = {
      configurable: true,
      enumerable: true,
      get: function() {
        return currentFetch;
      },
      set: function(val) {
        currentFetch = val;
      }
    };

    try {
      Object.defineProperty(win, 'fetch', fetchDescriptor);
    } catch (e1) {}

    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', fetchDescriptor);
      } catch (e2) {}
    }
  } catch (globalErr) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" data-theme="light" data-theme-setting="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitializerScript }}
        />
        <link
          rel="preload"
          as="image"
          href="/images/concrete-background.webp"
          type="image/webp"
        />
        <style
          id="concrete-calc-styles"
          dangerouslySetInnerHTML={{ __html: globalStyles }}
        />
        <script
          dangerouslySetInnerHTML={{ __html: windowFetchShimScript }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
