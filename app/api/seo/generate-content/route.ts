import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

interface GenerateRequest {
  topic: string;
  keyword: string;
  targetVolume?: number;
  intent?: string;
  articleType?: 'technical-guide' | 'how-to' | 'cost-comparison' | 'material-spec';
  targetAudience?: 'diy' | 'builder' | 'both';
  bsGrade?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();
    const {
      topic = 'Concrete Block Wall Construction',
      keyword = 'concrete blocks',
      targetVolume = 14800,
      intent = 'Informational / Commercial',
      articleType = 'technical-guide',
      bsGrade = 'C20 / C25',
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are an expert UK construction technical writer, Chartered Civil Engineer, and senior technical SEO strategist.
Write a comprehensive, professional, British English article and guide targeting the following primary UK keyword:
- Primary Target Keyword: "${keyword}"
- UK Search Volume: ${targetVolume} monthly searches
- UK Search Intent: ${intent}
- Topic: ${topic}
- Recommended Concrete/Mortar Grade: ${bsGrade} (BS 8500 / BS EN 206)
- Article Type: ${articleType}

Follow these strict UK editorial & SEO guidelines:
1. Language: Strictly British English (e.g. metres, tonnes, labour, formwork, aggregate, ballast, specialised).
2. Accuracy: Grounded in UK Building Regulations (Approved Document A for structures) and British Standard BS 8500. Standard UK concrete blocks are 440mm × 215mm × 100mm, with 10mm mortar bed joints (yielding 10 blocks/m²). Standard dry mix bags are 25kg or 20kg. MOT Type 1 sub-base thickness is typically 100–150mm.
3. Structure:
   - Optimized Title Tag (H1, max 60 chars)
   - Meta Description (140-155 chars, engaging UK search intent, includes primary keyword)
   - Key Takeaways box (bullet points with numbers)
   - Detailed Sections with H2 and H3 subheadings
   - Worked calculation examples with realistic UK prices in Pounds Sterling (£)
   - UK Common Mistakes & Pro-Tips
   - 3 to 4 Frequently Asked Questions with clear, direct answers
4. Formatting: Return clean Markdown with clear headings and bullet points. Do NOT include markdown code fences around the whole response.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const generatedMarkdown = response.text || '';
        return NextResponse.json({
          success: true,
          content: generatedMarkdown,
          model: 'gemini-2.5-flash',
          source: 'gemini-api',
        });
      } catch (geminiError: any) {
        console.error('Gemini API execution error, falling back to expert UK template:', geminiError);
        // Fall back gracefully to high-quality curated template
      }
    }

    // High quality fallback template curated for UK construction & SEO
    const fallbackTemplate = `# ${keyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}: The Complete UK Trade & DIY Guide

> **Quick Summary (TL;DR):** Standard UK concrete blocks measure **440mm × 215mm × 100mm**. When laid with standard 10mm mortar joints, you need exactly **10 blocks per square metre (m²)** of wall. For structural footings or load-bearing cavity walls, use **7.3 N/mm² dense concrete blocks**; for interior thermal partitions, use **3.6 N/mm² lightweight aerated blocks**. Always add **10% contingency** for cuts and wastage.

---

## 1. Standard UK Dimensions & Yield per m²

In the UK, masonry construction relies on the standard metric coordinating size:
- **Work Size (actual block):** 440mm (Length) × 215mm (Height) × 100mm (Thickness)
- **Coordinating Size (with 10mm joint):** 450mm × 225mm
- **Face Area per Block:** $0.45\\text{m} \\times 0.225\\text{m} = 0.10125\\text{ m}^2$
- **Blocks per m²:** $1 \\div 0.10125 \\approx 9.88$ blocks $\\rightarrow$ **10 blocks per m²** (industry standard rule).

### Block Types & Strength Grades (BS EN 771-3)
1. **Dense Concrete Blocks (7.3 N/mm² – 10.4 N/mm²):** Made with crushed rock aggregate. High compressive strength, excellent sound insulation, and moisture resistance. Ideal for external leaf, foundations below DPC, and retaining walls.
2. **Lightweight Aggregate Blocks (3.6 N/mm² – 7.3 N/mm²):** Expanded clay or furnace clinker aggregate. Moderate thermal insulation and manageable weight (~12–14kg per block).
3. **Aerated / Thermalite Autoclaved Blocks (2.9 N/mm² – 3.6 N/mm²):** Lightweight (~7–9kg per block), easily sawn by hand. Exceptional thermal insulation ($U$-values) for internal load-bearing and cavity inner leaves.

---

## 2. Mortar Requirements & Sand/Cement Ratio

For standard bricklaying and blockwork in the UK:
- **Mortar Mix Specification:** Class M4 mortar (1 part Portland Cement : 4 to 5 parts washed Building Sand) or 1:1:6 (Cement : Lime : Sand).
- **Mortar Yield per 100 Blocks:** Approximately **0.05 m³ of wet mortar** is consumed per 100 blocks (10 m² of wall).
- **Material Quantities per 100 Blocks:**
  - Building Sand: ~125kg (~5 bags of 25kg or 0.15 of an 850kg bulk bag)
  - Portland Cement (CEM II 32.5N): ~25kg (1 bag of 25kg)
  - Plasticiser additive to improve workability and freeze-thaw resistance.

---

## 3. Worked Step-by-Step UK Calculation Example

**Scenario:** Building a single-skin garden retaining wall measuring **6.0 metres long** by **1.2 metres high**.

1. **Calculate Gross Wall Face Area:**
   $$\\text{Area} = 6.0\\text{m} \\times 1.2\\text{m} = 7.20\\text{ m}^2$$

2. **Calculate Base Block Count (at 10 blocks/m²):**
   $$\\text{Net Blocks} = 7.20 \\times 10 = 72\\text{ blocks}$$

3. **Add 10% Waste & Cutting Allowance:**
   $$72 \\times 1.10 = 79.2 \\rightarrow \\mathbf{80\\text{ blocks}}$$

4. **Mortar Required:**
   $$\\text{Building Sand} = 80 \\times 1.25\\text{kg} = 100\\text{kg} \\text{ (4 bags of 25kg)}$$
   $$\\text{Cement} = 80 \\times 0.25\\text{kg} = 20\\text{kg} \\text{ (1 bag of 25kg)}$$

5. **Estimated Material Cost (UK 2026 Merchant Average):**
   - 80 × 7.3 N/mm² Dense Blocks @ £1.85 each = **£148.00**
   - 4 × 25kg Building Sand @ £3.20 each = **£12.80**
   - 1 × 25kg Mastercrete Cement = **£6.80**
   - **Total Estimated Materials: £167.60 + VAT**

---

## 4. Key Building Regulation Checks (Approved Document A)
- **Sub-Base & Footing:** Minimum 150mm depth C20 concrete trench foundation placed on undisturbed firm ground below the frost line (minimum 450mm below finished ground level).
- **Damp Proof Course (DPC):** Install a BS 8215 compliant polymer DPC minimum 150mm above adjacent ground level.
- **Cavity Wall Ties:** For cavity walls, install stainless steel wall ties at minimum 900mm horizontal × 450mm vertical spacing (2.5 ties/m²).

---

## Frequently Asked Questions

### How many concrete blocks do I need per square metre?
You need exactly 10 standard UK concrete blocks (440mm × 215mm × 100mm) per square metre of single-skin wall, allowing for standard 10mm mortar joints. For a cavity wall with two blockwork skins, double this to 20 blocks per square metre.

### What is the difference between dense and lightweight concrete blocks?
Dense concrete blocks (approx. 18kg each, 7.3 N/mm² strength) are made with dense aggregates and provide high strength and sound reduction. Lightweight aerated blocks (approx. 7–9kg, 3.6 N/mm²) offer superior thermal insulation and are easier to cut and lift.

### Can I lay concrete blocks directly on the ground?
No. Concrete blocks must be bedded on a cured concrete strip foundation (minimum 150mm thick C20 concrete) with a damp proof course (DPC) positioned 150mm above ground level to prevent moisture rising into the wall.`;

    return NextResponse.json({
      success: true,
      content: fallbackTemplate,
      model: 'uk-trade-curated',
      source: 'expert-template',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Generation failed' },
      { status: 500 }
    );
  }
}
