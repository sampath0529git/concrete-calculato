# Rich Structured Data & Advanced SEO Implementation Plan

A comprehensive roadmap to elevate **ConcreteCalc UK**'s organic search visibility, click-through rates (CTR), and Google search appearance using high-impact JSON-LD schema markups, rich snippets (FAQPage & HowTo), BreadcrumbList hierarchies, and Next.js App Router dynamic sitemap and canonical infrastructure.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Key Architecture Decisions Based on User Preferences**:
> - **Rich Snippet Schemas**: Implement Google-compliant **FAQPage** and **HowTo** structured data on primary calculator and guide pages to qualify for interactive search result accordions and numbered step snippets.
> - **BreadcrumbList Schemas**: Add structured breadcrumbs so search result listings display clean URL paths (`concretecalc.co.uk > Calculators > Slab Calculator`) instead of raw slugs.
> - **Dynamic Next.js App Router Sitemap**: Generate `app/sitemap.ts` ensuring all 12+ calculators, comparison articles, and resource guides are dynamically indexed with appropriate `changeFrequency` and `priority` values.
> - **Dynamic Robots Directives**: Provide `app/robots.ts` pointing directly to the sitemap and allowing clean crawling of all public routes while excluding private utility endpoints.
> - **Valid JSON-LD Standards**: Ensure every schema graph passes Google's Rich Results Test specifications with zero missing mandatory properties.

---

## 1. Overview & SEO Objective

ConcreteCalc UK is an engineering and trade estimation suite targeting UK builders, tradespeople, landscaping contractors, and DIYers. To rank #1 for queries such as *"how much concrete do i need"*, *"concrete slab calculator uk"*, *"how many 25kg bags in a m3"*, and *"postcrete calculator"*, search engines need explicit, machine-readable semantic signals.

### Target SERP Features
1. **Google FAQ Accordions**: Expanding Q&A rich snippets directly below search results, increasing SERP screen real estate.
2. **Google How-To Rich Cards**: Step-by-step instructions for calculating concrete volume and mixing bags.
3. **SoftwareApplication / WebApplication Badges**: Showcasing ConcreteCalc UK as a certified zero-cost web tool.
4. **Enhanced Breadcrumb Trails**: Replacing bare URLs with navigational breadcrumbs in mobile and desktop SERP listings.

---

## 2. Technical Implementation Architecture

```
                    ┌──────────────────────────────────────────┐
                    │            Next.js App Router            │
                    └────────────────────┬─────────────────────┘
                                         │
          ┌──────────────────────────────┼──────────────────────────────┐
          │                              │                              │
          ▼                              ▼                              ▼
┌──────────────────┐           ┌──────────────────┐           ┌──────────────────┐
│  Root Metadata   │           │ Dynamic Crawlers │           │ Per-Page Schemas │
├──────────────────┤           ├──────────────────┤           ├──────────────────┤
│• WebApplication  │           │• app/sitemap.ts  │           │• FAQPage Schema  │
│• Organization    │           │• app/robots.ts   │           │• HowTo Schema    │
│• Global OpenGraph│           │• Canonical tags  │           │• BreadcrumbList  │
└──────────────────┘           └──────────────────┘           └──────────────────┘
```

---

## 3. Detailed Component Plan

### Step 1: Dynamic Sitemap (`app/sitemap.ts`)
Create a native Next.js App Router `sitemap.ts` that automatically serves `https://concretecalc.co.uk/sitemap.xml`:
- **Priority 1.0 (Daily)**: Homepage / Main Concrete Calculator (`/`)
- **Priority 0.9 (Weekly)**: Dedicated Calculators:
  - `/concrete-slab-calculator`
  - `/concrete-footing-calculator`
  - `/concrete-block-calculator`
  - `/postcrete-calculator`
  - `/concrete-weight-converter`
  - `/concrete-shed-base-how-much-do-i-need`
- **Priority 0.8 (Monthly)**: Educational UK Guides:
  - `/how-many-bags-of-concrete-per-cubic-metre`
  - `/ready-mix-vs-bagged-concrete`
  - `/price-of-concrete-per-m3`
  - `/guides`
- **Priority 0.5 (Yearly)**: Informational Pages (`/about`, `/contact`, `/privacy-policy`, `/terms`)

### Step 2: Search Engine Directives (`app/robots.ts`)
Create `app/robots.ts` defining user-agent rules and linking to the sitemap:
- Allow all verified search bots (`Googlebot`, `Bingbot`, etc.)
- Disallow `/api/` endpoints
- Explicitly point to `https://concretecalc.co.uk/sitemap.xml`

### Step 3: Reusable SEO Schema Components (`app/components/JsonLd.tsx`)
Create modular, type-safe schema helper components:
1. `FaqJsonLd`: Generates valid `FAQPage` schema from an array of `{ question, answer }`.
2. `HowToJsonLd`: Generates valid `HowTo` schema with steps, supply items, and estimated time.
3. `BreadcrumbJsonLd`: Generates `BreadcrumbList` linking homepage to tool category and specific calculator.

### Step 4: Inject Schemas into Key Calculator Pages
1. **Homepage / Main Calculator (`app/page.tsx`)**:
   - WebApplication schema with aggregate rating & features.
   - Comprehensive UK Concrete FAQ schema (e.g., standard bag counts, drying times, ready mix ordering tolerances).
   - HowTo schema: *"How to Calculate Concrete Volume in 4 Simple Steps"*.
2. **Concrete Slab Calculator (`app/concrete-slab-calculator/page.tsx`)**:
   - Specialized slab FAQ schema (sub-base thickness, reinforcement, minimum slab depths for patios vs driveways).
   - HowTo schema for measuring rectangular, circular, or triangular slabs.
3. **Concrete Block Calculator (`app/concrete-block-calculator/page.tsx`)**:
   - Blockwork FAQ schema (standard 440x215mm dense blocks, mortar ratios, wall surface area).
4. **Postcrete & Fence Post Calculator (`app/postcrete-calculator/page.tsx`)**:
   - Fence post FAQ schema (post depth rule-of-thumb, bags per post, setting time).
5. **Bag Volume Guide (`app/how-many-bags-of-concrete-per-cubic-metre/page.tsx`)**:
   - Guide FAQ schema (exact 25kg pre-mixed bags per m³ = ~88 to 108 bags depending on mix density).

### Step 5: Canonical URLs & Meta Enhancements
- Audit all pages to ensure each page explicitly defines its own canonical link in `metadata.alternates.canonical`.
- Ensure consistent OpenGraph and Twitter card metadata for each route.

---

## 4. Verification & Validation Plan

### Automated Validation
1. **TypeScript & Linter**: Run `npm run lint` and `compile_applet` to verify clean compilation with zero type errors.
2. **Schema Syntax Verification**: Verify JSON-LD outputs conform to schema.org standards with `@context`, `@type`, and mandatory fields.
3. **Sitemap & Robots Verification**: Test output of `/sitemap.xml` and `/robots.txt` via curl/HTTP checks.

### Google Rich Results Readiness
- Verify FAQ items contain proper plaintext answers without illegal HTML tags.
- Verify HowTo items include `name`, `text`, and step URLs.
- Verify Breadcrumb items follow 1-indexed `position` sequences.
