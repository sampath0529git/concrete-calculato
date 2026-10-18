# Concrete Unit & Weight Converter – Standalone Page Implementation Plan

## Overview
Create a dedicated standalone page at `/concrete-weight-converter` for **ConcreteCalc.UK** providing full construction-grade unit and weight conversions between volume (m³, yd³, ft³, litres), weight (tonnes, kg, lbs, bulk bags, 25kg bags), and density-based volume-to-weight conversions (wet concrete weight across BS 8500 concrete grades).

---

## 1. Page Architecture & Routing

### Route: `/concrete-weight-converter`
- **Layout (`/app/concrete-weight-converter/layout.tsx`)**:
  - **SEO Title**: `Concrete Weight & Unit Converter UK – m³, Tonnes, kg & Bags`
  - **Meta Description**: `Free UK concrete weight and volume converter. Convert m³ to tonnes, kg to cubic metres, 25kg bags, bulk bags, wheelbarrows, and imperial yards. Based on BS 8500.`
  - **Target Keywords**: `concrete weight converter`, `convert m3 to tonnes concrete`, `how much does 1m3 of concrete weigh uk`, `concrete volume converter`, `cubic metres to tonnes`, `25kg bags to m3`, `concrete density calculator uk`
  - **Canonical URL**: `https://concretecalc.co.uk/concrete-weight-converter`
  - **Structured Data (JSON-LD)**: `WebApplication` + `HowTo` + `FAQPage` schema.

- **Interactive Page (`/app/concrete-weight-converter/page.tsx`)**:
  - **Header & Breadcrumbs**: Seamless navigation back to Home Calculator and Guides.
  - **Hero & Intro**: Clear explanation of wet concrete density (~2,400 kg/m³ or 2.4 tonnes/m³) vs lightweight and heavy mixes.
  - **Conversion Suite**:
    1. **Volume Unit Converter**:
       - Inputs: m³, yd³, ft³, Litres, 25kg pre-mix bags (yield ~0.012 m³), Wheelbarrows (~0.07 m³).
       - Live synchronized outputs with one-click copy.
    2. **Weight Converter**:
       - Inputs: Tonnes (t), Kilograms (kg), Imperial Pounds (lbs), 850kg Bulk Bags (dumpy bags), 25kg Cement/Pre-mix bags.
       - Live synchronized outputs.
    3. **Volume ⇄ Wet Weight Converter (Density Matrix)**:
       - Direct conversion between volume (m³) and weight (tonnes/kg).
       - Selectable Concrete Grades & Densities according to BS 8500 / BS EN 206:
         - Standard Domestic Slab / C20/25 (2,400 kg/m³)
         - Pavement / Commercial C30/37 (2,420 kg/m³)
         - Lightweight Concrete (1,800 – 2,000 kg/m³)
         - High-Density Concrete (2,500+ kg/m³)
         - Custom density override input (kg/m³).
    4. **Quick Presets**:
       - 0.5 m³ (Small garden footing / 1.2 t)
       - 1.0 m³ (Standard yard / 2.4 t / 83 bags)
       - 1 Bulk Bag (~850 kg aggregate)
       - 6.0 m³ (Standard UK Ready-Mix Truck capacity / 14.4 t)
       - 8.0 m³ (Large 8-wheeler transit mixer / 19.2 t)
    5. **Trade Reference Cheat Sheet & Table**:
       - Quick reference table: Volume (m³) | Wet Weight (Tonnes) | 25kg Bags | Wheelbarrows | Ready-Mix Truck %
    6. **Comprehensive FAQ Section**:
       - How much does 1 cubic metre of concrete weigh in the UK?
       - How many 25kg bags make 1 tonne of concrete?
       - How many wheelbarrows in 1 cubic metre of concrete?
       - What is the difference between wet concrete weight and cured dry concrete weight?

---

## 2. Navigation & Platform Integration

1. **Header Navigation (`/app/components/Header.tsx`)**:
   - Add **"Converter"** (`/concrete-weight-converter`) to the main desktop navigation bar and mobile drawer.
2. **Footer Navigation (`/app/components/Footer.tsx`)**:
   - Update `Unit & Volume Converter` link to point directly to `/concrete-weight-converter`.
3. **Internal Cross-Links**:
   - Add a callout box in `/app/components/Calculator.tsx` and educational guides (`/how-many-bags-of-concrete-per-cubic-metre`, `/ready-mix-vs-bagged-concrete`) linking users to the standalone converter.
4. **SEMrush Growth Hub (`/app/lib/semrushData.ts`)**:
   - Register the new page profile in `PAGE_AUDIT_PROFILES` with target volume and SEO scorecard benchmarks.

---

## 3. Verification & Quality Assurance

- **Build Verification**: Run `compile_applet` to ensure full Next.js server-side and client-side compilation without TypeScript errors.
- **Lint Check**: Run `lint_applet` to confirm strict typing and clean syntax.
- **Accuracy Test**: Verify mathematical conversion formulas (e.g. 1 m³ = 2.4 t, 1.30795 yd³, 35.3147 ft³, 1,000 L, ~83.33 bags of 25kg, ~14.28 wheelbarrows).
