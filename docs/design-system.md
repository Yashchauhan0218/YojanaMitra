# YojanaMitra Design System: Civic Editorial & Minimal Fintech

## 1. Vision & Philosophy
YojanaMitra is a mission-critical civic-tech platform empowering Indian citizens to discover and verify public welfare schemes with clarity, dignity, and trust. 

This design system moves away from generic, AI-generated SaaS aesthetics (characterized by dark purple gradients, neon glowing borders, floating blobs, and excessive rounded pills). Instead, it fuses **Civic Editorial Design** (authoritative, typographic, clear, and grounded in public service trust) with **Minimal Fintech Design** (structured, data-dense, crisp inputs, and readable tabular/card formats for search and eligibility assessment).

---

## 2. Color Palette & Design Tokens

### Primary Palette
| Token | Hex | Role / Application |
| :--- | :--- | :--- |
| `--color-civic-forest` | `#173F35` | **Primary Brand & Action**: Navbar headers, primary buttons, major section titles, authoritative badges |
| `--color-civic-green` | `#2F6B52` | **Secondary Green**: Interactive hovers, verified checkmarks, category accents, active filter states |
| `--color-civic-sage` | `#E8F0E8` | **Soft Sage Surface**: Card sub-surfaces, subtle pill backgrounds, active tab containers |
| `--color-civic-ivory` | `#F7F5EF` | **Warm Ivory Canvas**: Main site background, editorial hero background, warm paper-like civic feel |
| `--color-civic-saffron`| `#D99A42` | **Muted Saffron Accent**: *Used sparingly* for high-priority alerts, key badges, status highlights, national context |
| `--color-civic-text` | `#202923` | **Primary Ink / Typography**: High contrast body text, headlines, form inputs (WCAG AAA compliant) |
| `--color-civic-muted` | `#69756D` | **Secondary Ink**: Subheadings, helper text, timestamps, input placeholders, metadata labels |
| `--color-civic-border`| `#E3E7E1` | **Structural Borders**: Subtle 1px dividers, card boundaries, table gridlines |
| `--color-civic-card` | `#FFFFFF` | **Elevated White Surface**: Scheme cards, modal surfaces, form container backgrounds |

### Semantic State Colors
* **Verified / Match**: `#1B6A47` text on `#EAF4EE` background (1px border `#C8E6D3`)
* **Needs Information / Pending**: `#9E6714` text on `#FCF5E8` background (1px border `#F5DFB5`)
* **Ineligible / Restrictive**: `#8E3030` text on `#FCEEEE` background (1px border `#F4C7C7`)
* **Official Source Badge**: `#173F35` text on `#E8F0E8` background

---

## 3. Typography Hierarchy

### Font Families
1. **Headings**: `Manrope`, sans-serif (Display, bold, editorial, authoritative)
2. **English Body**: `Inter`, sans-serif (Engineered for micro-readability, forms, and data tables)
3. **Hindi Body / Devanagari**: `Noto Sans Devanagari`, sans-serif (Harmonious weight and baseline alignment with Inter)

### Type Scale
* **Display 1 (Editorial Hero)**: `text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight` (Manrope)
* **Section Title (H2)**: `text-2xl sm:text-3xl font-bold tracking-tight text-civic-forest` (Manrope)
* **Card Title (H3)**: `text-lg font-bold text-civic-text leading-snug group-hover:text-civic-forest transition-colors`
* **Subheading / Lead**: `text-base sm:text-lg text-civic-muted leading-relaxed`
* **Body Regular**: `text-sm sm:text-base text-civic-text leading-normal` (Inter / Noto Sans)
* **Meta / Caption**: `text-xs sm:text-sm text-civic-muted font-normal`
* **Micro Badges**: `text-[11px] font-semibold uppercase tracking-wider`

---

## 4. Spacing, Geometry & Radii

* **Border Radius**:
  * Default Cards & Content Blocks: `12px` (`rounded-xl`) to `16px` (`rounded-2xl`)
  * Buttons & Inputs: `8px` (`rounded-lg`) to `10px`
  * Status Badges: `6px` (`rounded-md`) to `8px` (`rounded-lg`)
  * *Pills (`rounded-full`) are reserved strictly for small numerical tags or language switcher toggles; cards and form inputs are never pills.*
* **Borders**:
  * Uniform `1px solid var(--color-civic-border)` (#E3E7E1). No thick borders or double borders.
* **Shadows**:
  * Restrained elevation: `shadow-xs` (`0 1px 2px 0 rgba(16, 24, 40, 0.05)`) and `shadow-sm` on hover (`0 2px 4px -1px rgba(16, 24, 40, 0.06)`).
  * No colored glow shadows or multi-stage blur drops.

---

## 5. Component Patterns

### A. Compact Civic Navigation Bar
* Clean, white/ivory surface with subtle bottom border (`#E3E7E1`).
* Minimal top national identity indicator: crisp, elegant tricolor hairline (1.5px) or understated emblem text.
* Brandmark: YojanaMitra with localized Devanagari subtitle "सरकारी योजनाओं का पारदर्शी मंच".
* Clean text links (`Explore Schemes`, `How It Works`, `AI Assistant`, `About`, `Admin`).
* Language switcher toggle (`हिन्दी` / `EN`) with crisp active state.

### B. Hero Section (Civic Editorial)
* Editorial headline: *"Government schemes made easier to find."*
* Subtitle: *"Discover verified central and state welfare benefits tailored to your profile, family needs, and eligibility — grounded in official gazettes."*
* Prominent, centered **Civic Search Bar**:
  * Generous input with voice button (`useVoiceRecognition`) and natural language prompt suggestions.
  * Progressive disclosure: quick-filter chips beneath the bar for citizen categories (Farmers, Students, Women, Seniors, Small Businesses).
  * Clean submit button in forest green (`#173F35`).

### C. Category Shortcuts
* 6 Primary Domains:
  1. Agriculture & Rural (`कृषि एवं ग्रामीण`)
  2. Education & Skill (`शिक्षा एवं कौशल`)
  3. Healthcare & Medical (`स्वास्थ्य एवं चिकित्सा`)
  4. Women & Child Development (`महिला एवं बाल विकास`)
  5. Housing & Urban (`आवास एवं शहरी विकास`)
  6. Small Business & Employment (`स्वरोजगार एवं व्यवसाय`)
* Clean card format with subtle border, 12px border radius, Lucide line icon in `#173F35`, and category counts.

### D. Scheme Cards (Minimal Fintech)
* Flat white surface (`#FFFFFF`), 1px `#E3E7E1` border, 12px radius.
* Header: Category tag in `#E8F0E8` + State / Central indicator + Verified shield.
* Typography: Bilingual or selected-language Scheme Title with clean typography.
* Benefit summary in structured highlight container (clean `#F7F5EF` background with `#2F6B52` icon).
* Key eligibility highlights (Age, Income, Occupation).
* Explicit call-to-action button: *"View Full Scheme & Criteria"*.

### E. Search & Results Experience
* Top search summary and active filter chips with easy clearing.
* Left filter sidebar (Desktop) or collapsible drawer (Mobile):
  * State selector
  * Category checklist
  * Beneficiary type (Gender, Caste, Occupation, Income threshold)
* Real-time matching counter ("Showing 7 verified government schemes").
* Accessible empty, loading skeleton, and fallback states.

### F. Scheme Details Page
* Breadcrumb navigation (`Home > Schemes > [Scheme Title]`).
* Authority banner: Official Ministry source link, verified date, and unique scheme code.
* 4 Structured Sections:
  1. Scheme Overview & Objectives
  2. Financial & Non-Financial Benefits
  3. Deterministic Eligibility Rules (Passed, Required, Exclusions)
  4. Application Steps & Required Documentation
* Transparent disclaimer callout regarding official authority sovereignty.

### G. AI & Voice Assistant Interface
* Conversational pane paired with dynamic citizen profile summary.
* Step-by-step progressive questionnaire (conversational profile extraction).
* Transparent rule-engine feedback showing *why* a citizen qualifies or what missing information is needed.

### H. Footer
* Institutional footer: Ministry / Government portal citations, RTI & data policy, disclaimer regarding non-affiliation, sitemap, and bilingual toggle.

---

## 6. Implementation Architecture

### Phase 1: Design Tokens & Base Setup
* Inject Google Fonts (`Manrope`, `Inter`, `Noto Sans Devanagari`) into `frontend-react/index.html` and `frontend-next/src/app/layout.tsx`.
* Define Tailwind CSS v4 `@theme` tokens in `frontend-react/src/index.css` and `frontend-next/src/app/globals.css`.

### Phase 2: Core Components Redesign
* Redesign `Navbar.tsx` (both React & Next).
* Redesign `Footer.tsx` (both React & Next).
* Redesign `SchemeCard.tsx` (both React & Next).

### Phase 3: Page Redesigns
* Redesign `HomePage` / `app/page.tsx` (Civic Editorial Hero, Categories, How It Works, Trust Section).
* Redesign `SchemesPage` / `app/schemes/page.tsx` (Minimal Fintech search & filtering experience).
* Redesign `SchemeDetailPage` / `app/schemes/[id]/page.tsx` (Editorial authority page).
* Redesign `AssistantPage` / `app/assistant/page.tsx` (Civic voice & eligibility assistant).
* Redesign `AboutPage` & `AdminPage` (Consistent institutional dashboard styling).

### Phase 4: Verification & Quality Assurance
* Verify production builds for both `frontend-react` and `frontend-next`.
* Test responsive breakpoints on mobile, tablet, and desktop.
* Confirm all backend API endpoints, Gemini AI calls, voice recognition, and database queries continue to function seamlessly.
