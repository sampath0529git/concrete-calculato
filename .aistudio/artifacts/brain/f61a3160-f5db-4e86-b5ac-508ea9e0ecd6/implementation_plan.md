# Professional Dark & Light Theme Optimization System

A comprehensive, production-grade overhaul of the Light and Dark Mode experience for ConcreteCalc.UK. This plan unifies semantic design tokens across the application, eliminates unreadable hardcoded colors, implements a robust 3-state theme switcher (Light, Dark, System) with zero flash of incorrect theme, ensures WCAG 2.2 AA contrast compliance across all tools and SVG diagrams, and preserves the clean, high-utility UK construction brand identity.

### User Review & Critical Decisions

> [!IMPORTANT]
> **Theme Switching Strategy**:
> - We will expand the current 2-way toggle to a clean, accessible 3-state segmented control (**Light**, **System**, **Dark**) featuring `Sun`, `Monitor`, and `Moon` icons from `lucide-react`.
> - When set to **System**, the application dynamically listens to OS dark mode changes via `matchMedia('(prefers-color-scheme: dark)')` with zero page reloads.
> - The user's explicit preference is stored in `localStorage` under `concretecalc_theme` and synchronized across browser tabs.
> - An ultra-fast inline script in `<head>` applies the `data-theme` attribute and `color-scheme` CSS property prior to first paint, eliminating any white or dark theme flash.

---

## 1. Overview & Core Concept

ConcreteCalc.UK is an engineering and trade estimation suite used on desktop computers, tablets, and on-site mobile phones by UK builders, tradespeople, and DIY homeowners.
The goal of this optimization is to make the application visually exceptional and comfortable for extended daily use in both bright daylight (Light Mode) and low-light environments (Dark Mode).

### Target Audience & Use Contexts
1. **On-Site Tradespeople & Builders**: Requiring high-contrast, glare-resistant readability on mobile devices in outdoor lighting conditions.
2. **Estimators, Architects & DIYers**: Requiring a soothing, dark slate environment during evening desktop planning sessions without harsh white flashes or illegible gray-on-dark text.

### Key Value
- **Zero Illegible States**: Eliminates dark text on dark backgrounds and low-contrast muted labels.
- **Semantic Token Architecture**: Centralizes all colors into CSS custom properties so no component relies on hardcoded hex codes.
- **Theme-Adaptive Visuals**: Diagrams, specification tables, calculation result badges, and formula cards automatically adjust their strokes, fills, and backgrounds.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme Tokens

#### 1. Light Mode Palette ("Architectural Precision")
- **Main Canvas (`--bg`)**: `#f8fafc` (Slate 50 — calm, comfortable off-white that prevents harsh eye strain).
- **Surfaces & Cards (`--surface`, `--surface-card`)**: `#ffffff` with subtle hairline border `#e2e8f0` and soft dual-stop shadow `0 2px 8px -2px rgba(15, 23, 42, 0.04)`.
- **Elevated & Sunken Surfaces (`--surface-elevated`, `--surface-sunken`)**: `#f1f5f9` (Slate 100).
- **Primary Ink (`--ink`)**: `#0f172a` (Slate 900 — crisp, 14:1 contrast ratio against canvas).
- **Secondary Ink (`--ink-secondary`)**: `#334155` (Slate 700 — 8:1 contrast).
- **Muted Metadata (`--muted`)**: `#64748b` (Slate 500 — 4.6:1 contrast, exceeding WCAG AA).
- **Brand Blue (`--calc-blue`)**: `#034694` (BS construction navy blue, accessible 8.5:1 contrast).
- **Action Green (`--calc-green`)**: `#1b7a2d` (Vibrant trade green CTA with hover `#145e22`).

#### 2. Dark Mode Palette ("Deep Obsidian Studio")
- **Main Canvas (`--bg`)**: `#0b0f19` (Rich midnight slate; avoids pure `#000000` to prevent harsh OLED smear and optical vibration).
- **Primary Surfaces (`--surface`)**: `#111827` (Gray 900).
- **Card Surfaces (`--surface-card`)**: `#151e32` (Subtly elevated slate navy with 1px border `rgba(255, 255, 255, 0.08)`).
- **Elevated Surfaces (`--surface-elevated`)**: `#1e293b` (Slate 800 for tabs, dropdowns, and table headers).
- **Sunken Surfaces (`--surface-sunken`)**: `#0d1322` (For input fields and diagram containers).
- **Primary Ink (`--ink`)**: `#f8fafc` (Slate 50 — bright, crystal-clear 15.5:1 contrast).
- **Secondary Ink (`--ink-secondary`)**: `#cbd5e1` (Slate 300 — 9:1 contrast).
- **Muted Metadata (`--muted`)**: `#94a3b8` (Slate 400 — 5.8:1 contrast).
- **Brand Blue (`--calc-blue`)**: `#60a5fa` (Luminous sky blue — 7:1 contrast on dark canvas).
- **Action Green (`--calc-green`)**: `#22c55e` (Emerald green with dark hover `#16a34a`).
- **Input Fields (`--field`)**: `#0d1322` with border `#28354d` and text `#f8fafc`.

#### 3. Semantic Status Tokens (Light & Dark)
```css
/* Light Mode */
--status-success-bg: #ecfdf5;
--status-success-border: #a7f3d0;
--status-success-text: #065f46;

--status-warning-bg: #fffbeb;
--status-warning-border: #fde68a;
--status-warning-text: #92400e;

--status-info-bg: #f0f9ff;
--status-info-border: #bae6fd;
--status-info-text: #0369a1;

/* Dark Mode */
--status-success-bg: rgba(16, 185, 129, 0.14);
--status-success-border: rgba(16, 185, 129, 0.35);
--status-success-text: #34d399;

--status-warning-bg: rgba(245, 158, 11, 0.14);
--status-warning-border: rgba(245, 158, 11, 0.35);
--status-warning-text: #fbbf24;

--status-info-bg: rgba(56, 189, 248, 0.14);
--status-info-border: rgba(56, 189, 248, 0.35);
--status-info-text: #7dd3fc;
```

### Interactive Feedback & Component Styling
- **Theme Toggle**: Accessible 3-way segment control (`Light` | `System` | `Dark`) located in header action zone and mobile navigation drawer. Keyboard-focusable with `tabindex="0"`, `role="radiogroup"`, and clear active pill sliding indicator.
- **Inputs & Selects**: Consistent 44px touch targets on mobile with smooth focus rings (`box-shadow: 0 0 0 2px var(--accent-subtle)`).
- **SVG Diagrams**: Converted to responsive strokes using CSS variables (`stroke: var(--calc-blue)`, `fill: var(--surface-elevated)`), eliminating invisible lines in dark mode.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Pure CSS Custom Properties vs Runtime Provider Library
- **Chosen Approach**: Use native CSS custom properties applied at `:root[data-theme="light"]`, `:root[data-theme="dark"]`, and `@media (prefers-color-scheme: dark)`.
- **Why**: Zero runtime overhead, 0 kB bundle addition, zero hydration mismatch errors, and instant paint with no flash of unstyled theme (FOUT). Avoids adding `next-themes` which can cause React 19 peer dependency conflicts.
- **Alternatives Considered**: Installing `next-themes`. Passed over because the app already has a lightweight inline script in `<head>` that can be perfected to handle `system`, `light`, and `dark` flawlessly.

### Decision 2: SVG Shape Diagrams Theme Synchronization
- **Chosen Approach**: Update `ShapeDiagrams.tsx` (Slab, Column, Tube, Curb, Stairs) to use semantic theme classes and `currentColor` / CSS custom properties rather than hardcoded `#333`, `#e0e0e0`, or `#0056b3`.
- **Why**: Ensures structural geometry and measurement dimension lines remain crisp and readable against both light and dark card backgrounds.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js Root Layout (<head>)                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │   themeInitializerScript (Synchronous IIFE before React mounts) │  │
│  │   - Reads localStorage ('concretecalc_theme')                    │  │
│  │   - Checks window.matchMedia('(prefers-color-scheme: dark)')     │  │
│  │   - Sets document.documentElement.setAttribute('data-theme', ...)│  │
│  │   - Sets document.documentElement.style.colorScheme = ...        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Centralized Design Tokens (globals.css)             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐              │
│  │ :root[data-theme="light"]│  │ :root[data-theme="dark"]│              │
│  │ - --bg: #f8fafc         │  │ - --bg: #0b0f19         │              │
│  │ - --surface: #ffffff    │  │ - --surface: #111827    │              │
│  │ - --ink: #0f172a        │  │ - --ink: #f8fafc        │              │
│  │ - --calc-blue: #034694  │  │ - --calc-blue: #60a5fa  │              │
│  │ - Status & Form tokens  │  │ - Status & Form tokens  │              │
│  └─────────────────────────┘  └─────────────────────────┘              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ Header & Mobile │       │ Calculator Core │       │ Dedicated Calcs │
│ - 3-Way Toggle  │       │ - Form tables   │       │ - Weight Conv.  │
│ - Brand Wordmark│       │ - Result tiles  │       │ - Block Calc    │
│ - Nav Links     │       │ - SVG Diagrams  │       │ - Footing Calc  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

### Component Audit & Modifications Plan

1. **`app/globals.css` & `app/styles.ts`**:
   - Complete token dictionary: canvas, surfaces, text tiers, borders, status banners, forms, buttons, tables, shadows.
   - Refine optical contrast for both themes to ensure 100% WCAG 2.2 AA compliance.
   - Set `color-scheme: light dark;` so native scrollbars, form controls, and select dropdown arrows adapt automatically.

2. **`app/layout.tsx`**:
   - Update `themeInitializerScript` to parse `'system' | 'light' | 'dark'`.
   - Ensure `suppressHydrationWarning` on `<html>` and `<body>` prevents React mismatches.

3. **`app/components/Header.tsx`**:
   - Build a 3-way toggle component: `[ Sun (Light) | Monitor (System) | Moon (Dark) ]`.
   - Add event listener for `mediaQuery.addEventListener('change', ...)` when theme is `'system'`.
   - Synchronize desktop and mobile drawer instances with ARIA accessibility roles (`role="radiogroup"` / `role="radio"`).

4. **`app/components/ShapeDiagrams.tsx`**:
   - Upgrade diagram stroke and fill definitions to use CSS variables (`var(--line-strong)`, `var(--calc-blue)`, `var(--ink-secondary)`).

5. **`app/components/Calculator.tsx` & `app/components/UnitConverter.tsx`**:
   - Eliminate all inline `#084298`, `#2e7d32`, `#64748b`, `#f8faff` colors.
   - Replace with `--calc-blue`, `--calc-green`, `--muted`, `--surface-card`.

6. **All Calculator Pages & Guides**:
   - Audit `app/concrete-weight-converter/page.tsx`, `app/concrete-block-calculator/page.tsx`, `app/concrete-footing-calculator/page.tsx`, `app/concrete-slab-calculator/page.tsx`, `app/postcrete-calculator/page.tsx`, `app/price-of-concrete-per-m3/page.tsx`.
   - Replace hardcoded alert boxes (`#ecfdf5`, `#fef3c7`, `#fee2e2`) with semantic status variables.

7. **Verification & Testing**:
   - Execute `npm run lint` (`tsc --noEmit`) and `compile_applet` (`npm run build`).
   - Validate contrast across key views in both themes.
