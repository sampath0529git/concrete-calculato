# Concrete Calculator UK

A React and TypeScript web application for UK DIYers, builders, and tradespeople to calculate concrete volumes, 25kg / 20kg bag requirements, wet weight, and ready-mix costs across standard shapes (slabs, strip footings, post holes, circular bases, and solid steps).

## Features

- **Multi-Shape Calculator**:
  - Slab / base (Length × Width × Thickness with quick presets for Paths, Shed bases, and Driveways)
  - Footings (Length × Width × Depth with Strip and Trench presets)
  - Post holes & cylindrical columns (Diameter × Depth with Fence post and Gate post presets)
  - Round slabs (Diameter × Thickness with Base and Heavy duty presets)
  - Solid steps (Number of steps, Step width, Rise, Going)
- **Waste & Specification Allowances**:
  - Waste allowance toggles (0%, 5%, 10% recommended, 15% uneven ground)
  - Mix specifications (C20 for paths & bases, C25 for footings, C30 for driveways)
- **Accurate Cost & Delivery Recommendations**:
  - Instant calculation of 25kg and 20kg bags with current UK price ranges (£5.50 – £9.00 / bag)
  - Ready-mix order volumes rounded to 0.25 m³ increments with price bands (£110 – £185 / m³)
  - Best-value recommendation badge and contextual advice
  - One-click "Copy Breakdown" to clipboard & printable estimate view
- **UK Concrete Guides & Knowledge Base**:
  - Interactive FAQs and domestic depth/mix tables
  - Worked guide articles for bag yields, shed bases, and ready-mix comparisons
- **Responsive & Accessible UI**:
  - Light and Dark mode toggle
  - Cookie consent banner with persistence
  - About, Contact, Privacy Policy, and Terms of Use views

## Tech Stack

- React 19
- TypeScript
- Vite
