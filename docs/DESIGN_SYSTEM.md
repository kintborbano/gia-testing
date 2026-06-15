# GIA Design System

A reference for the visual language of the GIA marketing site (`gia-frontend`), powered by SOFI AI. It documents the tokens, typography, layout shells, and components that the landing pages, sub-pages, and report views are built from, so new pages stay on-brand.

> **Source of truth:** styling tokens live in [src/styles/globals.css](../src/styles/globals.css) (`@theme` block). The same hex values are mirrored in [src/styles/palette.ts](../src/styles/palette.ts) for JS color math (canvas, scroll interpolation). A rebrand updates **both**.

---

## 1. Brand & Personality

GIA is an AI TikTok analyst with a warm, editorial, slightly playful character. The visual language pairs a **deep maroon** with a **soft cream** and **gold**, set in **serif display headings** over a clean sans body. Pages favor generous whitespace, rounded panels, and gentle scroll-driven motion.

Three surface modes recur across the site:

| Mode      | Background      | Foreground / accents          | Example pages       |
| --------- | --------------- | ----------------------------- | ------------------- |
| **Light** | White `#ffffff` | Maroon text + maroon header   | FAQ, Privacy, Terms |
| **Cream** | Cream `#fef7dd` | Maroon, gold accents          | Pricing             |
| **Dark**  | Black `#000000` | Cream text, gold + yellow CTA | About               |

---

## 2. Color Tokens

Defined as Tailwind v4 `@theme` tokens — reference them as utilities (`bg-brand-primary`, `text-brand-cream`) or as `var(--color-…)` inside arbitrary values.

### Brand

| Token                        | Hex       | Usage                                           |
| ---------------------------- | --------- | ----------------------------------------------- |
| `--color-brand-primary`      | `#8c1f2e` | Maroon — primary text, fills, header foreground |
| `--color-brand-primary-dark` | `#751a26` | Pressed/hover-deepened maroon, hard shadows     |
| `--color-brand-secondary`    | `#eed03a` | Yellow — highlight words on dark surfaces       |
| `--color-brand-cream`        | `#fef7dd` | Cream — warm surface + on-brand CTA hover       |
| `--color-brand-gold`         | `#c2992e` | Gold — accents, emphasis on dark surfaces       |
| `--color-brand-gold-shadow`  | `#8a6a1c` | Depth under gold elements                       |
| `--color-text`               | `#1a1208` | Near-black body text on light/cream surfaces    |
| `--color-white`              | `#ffffff` | White surfaces, on-brand fills                  |

Transparent helpers: `--color-brand-primary-transparent` (`#8c1f2e80`), `--color-brand-secondary-transparent`. For one-off opacity use Tailwind's slash syntax (`text-brand-primary/30`, `border-white/55`).

### Verdict scale

Mirrors the PDF report (`pdf_gen.py`) so the web report and the downloaded PDF speak the same green/amber/red language. Each has a `*-deep` (text) and `*-soft` (fill) companion.

| Token group              | Base      | Meaning         |
| ------------------------ | --------- | --------------- |
| `--color-verdict-strong` | `#5baa39` | Good / passing  |
| `--color-verdict-mixed`  | `#c9a227` | Mixed / caution |
| `--color-verdict-weak`   | `#b83847` | Weak / failing  |

---

## 3. Typography

Fonts are loaded as local `woff2`/`otf` via `next/font/local` in [src/app/layout.tsx](../src/app/layout.tsx) and exposed as CSS variables.

| Family                             | Token / class         | Role                                              |
| ---------------------------------- | --------------------- | ------------------------------------------------- |
| **Young Serif** (400)              | `font-young-serif`    | Display headings (`h1`/`h2`) — the signature look |
| **Averia Serif Libre** (700, 700i) | `font-averia-serif`   | Decorative serif accents                          |
| **Instrument Sans** (400/500/600)  | `font-sans` (default) | Body copy, labels, nav, buttons                   |
| **ITC Garamond** (book condensed)  | `font-itc-garamond`   | Editorial serif used in report/story contexts     |
| **Pixelify Sans** (Google)         | `font-pixelify`       | Pixel accent (loaders, playful bits)              |

### Type scale (observed)

Headings use Young Serif with tight tracking and `leading-[1.1]`. Body uses Instrument Sans with slightly negative tracking.

| Element            | Classes                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------- |
| Page title `h1/h2` | `font-young-serif text-[32px] sm:text-[44px] md:text-[56px] leading-[1.1] tracking-[-1.12px]` |
| Eyebrow / label    | `font-sans text-[15px]–[18px] font-bold tracking-[-0.09px]` (often `uppercase`)               |
| Section heading    | `font-sans text-[20px] font-semibold tracking-[-0.1px]` (maroon)                              |
| Lead paragraph     | `font-sans text-[18px] md:text-[24px] font-medium leading-[1.3] tracking-[-0.12px]`           |
| Body paragraph     | `font-sans text-[16px] leading-7 tracking-[-0.08px]`                                          |
| Meta / legal       | `font-sans text-[13px] leading-[1.5] tracking-[-0.065px]`                                     |

---

## 4. Layout & Spacing

- **Content width:** sections cap their inner column at `w-[1152px] max-w-full`; reading-heavy columns narrow to `max-w-[820px]` (FAQ answers, legal copy).
- **Horizontal gutters:** `px-5 sm:px-8 md:px-16` on full-bleed sections.
- **Vertical rhythm:** sections breathe with `py-16 md:py-20`; stacked blocks use `gap-` utilities (`gap-6`, `gap-10`, `gap-16`, `gap-20`).
- **Centering pattern:** `flex w-full flex-col items-center` on the section, an inner fixed-width column, content centered or `text-left` for body.
- **Rounded panels:** large surfaces use `rounded-[32px]` → `md:rounded-[44px]` (footer); cards and pills use `rounded-[25px]`/`rounded-[34px]`.

---

## 5. Page Shell — `SubPageShell`

Every standalone sub-page (Meet GIA, Pricing, FAQ, About, and the legal pages) renders through [SubPageShell](../src/components/landing/SubPageShell.tsx). It mounts the shared `StickyHeader` + `Footer`, reserves header height, and resets the scroll-driven page background.

```tsx
// Light page (default): white header, maroon foreground, light footer
<SubPageShell>
  <YourContent />
</SubPageShell>

// Cream page (Pricing)
<SubPageShell
  headerBackground="rgb(254, 247, 221)"
  surfaceClassName="bg-brand-cream"
  footerVariant="cream"
/>

// Dark page (About)
<SubPageShell
  headerBackground="rgb(0, 0, 0)"
  headerForeground={BRAND.cream}
  surfaceClassName="bg-black"
  footerVariant="dark"
  flushContent
/>
```

Key props: `headerBackground`, `headerForeground`, `surfaceClassName`, `footerVariant` (`light` | `cream` | `dark`), `showFooter`, `flushContent`.

---

## 6. Components

### Button — [src/components/ui/Button.tsx](../src/components/ui/Button.tsx)

The single source of truth for CTAs. Renders an `<a>`/`next/link` when given `href`, else a `<button>`. Four states: default, hover (per variant), pressed (`active:scale-[0.97]`), disabled.

**Variants:** `filled` (maroon, inverts on hover), `filledStatic`, `outlined`, `onBrand` (white CTA on maroon), `onGold`, `onCream`, `whiteStatic`, `adaptive` (tracks `--page-fg/bg`), `glass` (frosted liquid-glass pill).
**Sizes:** `sm` 38px/13px · `default` 48px/14px · `lg` 60px/16px. `withArrow` appends an arrow that rotates north-east on hover.

### Footer — [src/components/landing/Footer.tsx](../src/components/landing/Footer.tsx)

Rounded maroon (or cream) panel with a lead-magnet form, nav column, masked GIA logo, and legal links. Variant (`light`/`cream`/`dark`) sets the band + panel palette. Legal links point to `/privacy`, `/terms`, `/data-retention`.

### Other building blocks

- **StickyHeader** — collapsing header that adapts its palette to the page/section.
- **FAQ** accordion — `grid-rows-[0fr→1fr]` expand pattern, `lucide-react` `Plus`/`Minus` toggles.
- **Cards** — white surfaces share the `.report-card` hover lift (`translateY(-3px)` + soft maroon shadow).
- **Checkboxes** — hand-drawn `notebook-checkbox` (form radios) and the hard-shadow `consent-checkbox` (CTA tick), both defined in `globals.css`.

---

## 7. Motion

- **Smooth scroll:** Lenis drives the page (see `SmoothScroll`, `useLenis`). Avoid `dvh` (resizes mid-scroll); use `svh`/`vh`.
- **Reveal-on-scroll:** report sections fade/translate in via `Reveal.tsx`.
- **Signature animations** (all in `globals.css`, all gated behind `@media (prefers-reduced-motion: reduce)`): `btn-glass-shine`, `report-title-sheen` (maroon→gold text sweep), `report-bar-glint`, `report-ring-glow`, `notebook-mark`.
- **Defaults:** transitions are `duration-200 ease-out`; expanders `duration-300 ease-in-out`.

> **Always** provide a `prefers-reduced-motion` fallback for new animations, matching the existing blocks.

---

## 8. Conventions

- **Icons:** `lucide-react`.
- **Whitespace + JSX entities:** this repo's Next.js drops the space before a text node that follows an inline element and uses `&apos;`. Prefer wrapping apostrophes inside `{"…"}` string tails (see `MEMORY.md`).
- **Images/canvas:** globally `pointer-events: none` + non-selectable as casual download deterrence.
- **`'use client'`** only where interactivity/hooks are needed; page route files stay server components exporting `metadata`.
