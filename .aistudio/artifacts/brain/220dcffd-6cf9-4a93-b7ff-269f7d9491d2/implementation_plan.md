# On-Page SEO & Metadata Optimization Plan

## Overview
Comprehensive On-Page SEO optimization for **ConcreteCalc.UK** across all calculator tools and educational guides. Each page will be equipped with optimized `<title>` tags, `<meta name="description">`, target `keywords` arrays, OpenGraph / Twitter social cards, canonical URLs, and Schema.org structured data (JSON-LD) targeted at high-volume UK search terms with low-to-moderate competition (KD% < 25%).

---

## 1. Page-by-Page Target Keywords & Metadata Matrix

| Page Route | High-Volume UK Target Keywords | Optimized Meta Title (30–60 chars) | Meta Description (120–160 chars) | Schema.org Type |
| :--- | :--- | :--- | :--- | :--- |
| **`/`** (Home Hub) | `concrete calculator uk` (14.8K), `calculate concrete m3`, `concrete volume calculator` | `Concrete Calculator UK – m³, 25kg Bags & Cost Estimator` | Calculate exact concrete volume in cubic metres (m³), 25kg pre-mix bags, and costs for slabs, shed bases, footings, and steps with UK mix guides. | `WebApplication`, `FAQPage` |
| **`/concrete-block-calculator`** | `concrete blocks` (14.8K), `concrete block calculator` (2.4K), `concrete blocks per m2` (1.9K) | `Concrete Block Calculator UK – Blocks per m² & Mortar` | Calculate exact 440x215mm concrete blocks, mortar mix, and building sand for single or double skin walls. Supports 100mm and 140mm UK blocks. | `WebApplication`, `HowTo` |
| **`/postcrete-calculator`** | `postcrete calculator` (3.6K), `how many bags of postcrete per post` (2.9K), `postcrete bags` | `Postcrete Calculator UK – Bags of Postcrete Per Post` | Calculate exact bags of rapid-set Postcrete for 75mm, 100mm timber and concrete fence posts with UK standard hole diameter formulas and waste. | `WebApplication`, `FAQPage` |
| **`/concrete-slab-calculator`** | `concrete slab calculator` (4.4K), `concrete slab calculator uk` (1.9K), `shed slab calculator` | `Concrete Slab Calculator UK – m³, Bags & Steel Mesh` | Calculate cubic metres (m³), 25kg pre-mixed bags, A142/A193 steel reinforcement mesh sheets, and sub-base MOT Type 1 for UK garden slabs and patios. | `WebApplication` |
| **`/concrete-footing-calculator`** | `concrete footing calculator` (1.6K), `foundation concrete calculator` (1.3K), `trench footing uk` | `Concrete Footing Calculator UK – Trench & Strip Foundations` | Calculate trench fill, strip foundations, and extension footing concrete volume in m³ with UK Building Regulations Part A depth presets and waste. | `WebApplication` |
| **`/price-of-concrete-per-m3`** | `price of concrete per m3` (2.4K), `cost of concrete per m3 uk` (1.9K), `ready mix price uk` | `Price of Concrete Per m³ UK (2026 Costs) – Ready-Mix Rates` | Updated 2026 UK concrete price benchmarks by region (London, Midlands, North). Ready-mix vs volumetric delivery rates, part-load fees, and barrow costs. | `TechArticle`, `FAQPage` |
| **`/how-many-bags-of-concrete-per-cubic-metre`** | `how many bags of concrete per cubic metre` (5.4K), `how many 25kg bags of concrete in 1m3` (4.4K) | `How Many Bags of Concrete in 1 Cubic Metre? (25kg & 20kg)` | Exact UK math for 25kg (~83 bags) and 20kg (~105 bags) pre-mix concrete per cubic metre (m³). Includes 10% waste allowance formulas and ballast mix ratios. | `TechArticle`, `HowTo` |
| **`/concrete-shed-base-how-much-do-i-need`** | `shed base concrete calculator` (1.6K), `concrete for 8x6 shed base` (1.3K), `shed base depth uk` | `Concrete Shed Base Calculator – 8x6, 6x4 & 10x8 Garden Slabs` | Calculate exact 100mm concrete slab volume, 25kg bags, MOT Type 1 hardcore, and timber formwork for 6x4, 8x6, and 10x8 garden shed bases in the UK. | `TechArticle`, `HowTo` |
| **`/ready-mix-vs-bagged-concrete`** | `ready mix vs bagged concrete` (1.9K), `cheapest way to buy concrete uk`, `ready mix minimum load` | `Ready-Mix vs Bagged Concrete UK – Cost & Labour Analysis` | Compare 25kg pre-mix bags against delivered ready-mix concrete. UK break-even tipping point (~1.5 m³), minimum load surcharges, and barrow time limits. | `TechArticle` |
| **`/seo-dashboard`** | Internal Intelligence Tool | `UK SEO Growth Hub & Keyword Intelligence – ConcreteCalc UK` | Internal SEMrush keyword tracking, SERP simulator, and live On-Page SEO grading for ConcreteCalc.UK. | `noindex, nofollow` |

---

## 2. Technical Implementation Architecture

### A. Dedicated Route Layouts for Client Pages
Because interactive calculators (`app/concrete-block-calculator/page.tsx`, `app/postcrete-calculator/page.tsx`, `app/concrete-slab-calculator/page.tsx`, `app/concrete-footing-calculator/page.tsx`, `app/price-of-concrete-per-m3/page.tsx`) use Next.js `'use client'`, metadata cannot be exported directly from their `page.tsx`.
- We will create a dedicated Server Component `layout.tsx` for each calculator route.
- Each `layout.tsx` will export Next.js `Metadata` with:
  - Exact `title` and template branding (`| ConcreteCalc UK`)
  - Target-keyword-rich `description`
  - Explicit `keywords: [...]` array
  - `openGraph` tags (title, description, URL, image, siteName, locale: `en_GB`, type: `website`)
  - `twitter` card tags (`summary_large_image`)
  - `alternates: { canonical: '...' }`
  - Inline JSON-LD Schema.org scripts (`<script type="application/ld+json">`) for Google rich snippets.

### B. Blog & Guide Page Metadata Enrichment
- Update `app/how-many-bags-of-concrete-per-cubic-metre/page.tsx`, `app/concrete-shed-base-how-much-do-i-need/page.tsx`, and `app/ready-mix-vs-bagged-concrete/page.tsx`.
- Add explicit `keywords` array to each page's `Metadata` export.
- Add canonical URLs and ensure OpenGraph image coordinates and alt-text tags match Google Image SEO specifications.

### C. Root Layout (`app/layout.tsx`) Optimization
- Enhance global metadata with `metadataBase: new URL('https://concretecalc.co.uk')` to resolve absolute OpenGraph images.
- Add global `keywords` array targeting primary volume terms (`concrete calculator uk`, `concrete volume calculator`, `calculate concrete m3`).
- Refine existing `jsonLd` Graph (WebApplication + FAQPage).

---

## 3. Verification & SEO Compliance
1. Run `compile_applet` and `lint_applet` to confirm 0 TypeScript / build errors.
2. Verify with the **Live Page SEO Grader** in `/seo-dashboard` that page scores reach 95%+ with green indicators on Title lengths, Meta descriptions, and Schema.org validation.
