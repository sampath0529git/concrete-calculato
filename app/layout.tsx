import type { Metadata } from 'next';
import './globals.css';
import { globalStyles } from './styles';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';

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
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧱</text></svg>',
  },
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
      '@type': 'WebApplication',
      name: 'Concrete Calculator UK',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Any',
      description:
        'Calculate concrete volume in cubic metres, number of 25kg bags and estimated cost for UK slabs, bases, footings, columns and steps.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
      inLanguage: 'en-GB',
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
    <html lang="en-GB" suppressHydrationWarning>
      <head>
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
