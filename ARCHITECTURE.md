<!--
AUDIT RESULTS — what was moved from where
==========================================

src/components/sections/Hero.tsx  (deleted)
  → scroll listener + RAF throttle         → src/hooks/useScrollProgress.js
  → lerp / clamp / phaseT utilities        → src/animations/interpolate.js
  → @keyframes chibi-float, bubble-float   → src/animations/keyframes.css
  → getScrollTransform(), bubbleOpacity    → src/animations/chibiAnimations.js
  → JSX + SCROLL_RANGE constant            → src/components/HeroWithChibis/index.jsx
                                             (SCROLL_RANGE re-exported from chibiAnimations.js)

src/components/sections/FeatureSection.tsx  (deleted)
  → section-relative scroll listener + RAF → src/hooks/useSectionProgress.js
  → lerp / clamp / phaseT utilities        → src/animations/interpolate.js  (deduplicated)
  → @keyframes chibi-bob                   → src/animations/keyframes.css
  → chibiBigTx / laptopTx / box opacity   → src/animations/laptopAnimations.js
  → TechFeatureBox component               → src/components/TechFeatureBox/index.jsx
  → TechModal component                    → src/components/TechModal/index.jsx
  → JSX + TECHS / TECH_POSITIONS data     → src/components/FeatureSection/index.jsx

src/components/ui/SpeechBubble.tsx  (deleted)
  → moved verbatim, import path updated    → src/components/SpeechBubble/index.jsx

src/components/ui/HeroBubbles.tsx  (updated import only)
  → SpeechBubble import path updated to @/components/SpeechBubble
-->

# Architecture

## Final file tree

```
src/
├── animations/
│   ├── keyframes.css          All @keyframes declarations. No other CSS.
│   ├── interpolate.js         Pure math utilities: lerp, clamp, mapRange, phaseProgress.
│   ├── chibiAnimations.js     Hero chibi phase calculators + SCROLL_RANGE constant.
│   ├── laptopAnimations.js    FeatureSection scene calculators (chibi, laptop, tech boxes).
│   └── featureAnimations.js   Generic feature-box stagger calculator (for future FeatureBox use).
├── hooks/
│   ├── useScrollProgress.js   Global scrollY → t (0–1) hook, RAF-throttled.
│   └── useSectionProgress.js  Section-relative scrollY → t (0–1) hook, RAF-throttled.
├── components/
│   ├── HeroWithChibis/
│   │   ├── HeroWithChibis.tsx  Hero section: JSX only. No math, no scroll setup.
│   │   └── index.ts            Barrel re-export.
│   ├── sections/
│   │   └── FeatureSection/
│   │       ├── FeatureSection.tsx  Laptop scene section: JSX only. No math, no scroll setup.
│   │       └── index.ts            Barrel re-export.
│   ├── SpeechBubble/
│   │   ├── SpeechBubble.tsx    Floating speech bubble with hover state.
│   │   └── index.ts            Barrel re-export.
│   ├── TechModal/
│   │   ├── TechModal.tsx       Full-screen overlay modal for a tech item.
│   │   └── index.ts            Barrel re-export.
│   ├── FeatureBox/
│   │   ├── FeatureBox.tsx      Generic feature label card (placeholder).
│   │   └── index.ts            Barrel re-export.
│   └── FeatureModal/
│       ├── FeatureModal.tsx    Generic feature modal (placeholder).
│       └── index.ts            Barrel re-export.
└── styles/
    └── globals.css            Tailwind + CSS variables. Imports nothing from animations/.
```

`keyframes.css` is imported once in `src/app/layout.tsx` so all keyframe names are globally
available without duplication.

---

## For frontend engineers

### To change animation timing or distances

| What you want to change              | File to edit                                                  |
| ------------------------------------ | ------------------------------------------------------------- |
| Hero chibi scroll phases (0.3, 0.7…) | `src/animations/chibiAnimations.js`                           |
| Hero scroll range (600px)            | `src/animations/chibiAnimations.js` → `SCROLL_RANGE`          |
| Speech bubble fade timing            | `src/animations/chibiAnimations.js` → `BUBBLE_FADE_END`       |
| FeatureSection slide-in timing       | `src/animations/laptopAnimations.js` → `SLIDE_END`            |
| Tech box stagger timing              | `src/animations/laptopAnimations.js` → `TECH_BOX_*` constants |
| Any keyframe curve or distance       | `src/animations/keyframes.css`                                |
| Lerp / clamp / mapRange behaviour    | `src/animations/interpolate.js`                               |

### To add a new animated element

1. **Define phase constants** at the top of the appropriate `animations/*.js` file
   (or create a new one if the element belongs to a new scene).
2. **Write a pure calculator function** that takes `t` (0–1) and returns a plain style object.
   Import `lerp`, `clamp`, `phaseProgress` from `interpolate.js`.
3. **Add any new keyframe** to `keyframes.css` only — never inline `@keyframes` in a component.
4. **In the component**, call `useScrollProgress` or `useSectionProgress` for the `t` value,
   then spread the calculator's return value into the element's `style` prop.
   Keep the component file free of math.

### To add a new section with scroll animation

1. Add a `useRef` for the section wrapper and pass it to `useSectionProgress`.
2. Create `src/animations/mySceneAnimations.js` following the pattern in `laptopAnimations.js`.
3. Keep the component's JSX readable — a reader unfamiliar with the animation system should
   understand layout and UI flow without opening any `animations/` file.

---

## StickyHeader

| File                                           | Responsibility                                                       |
| ---------------------------------------------- | -------------------------------------------------------------------- |
| `src/components/StickyHeader/StickyHeader.tsx` | Fixed header JSX; edit brand/nav content here only                   |
| `src/animations/headerAnimations.js`           | Header size, background color, and border values keyed to scroll `t` |

- To change header colors: edit `COLOR_TRANSPARENT` and `COLOR_SOLID` in `headerAnimations.js`
- To change scroll distance: edit `SCROLL_RANGE` in `headerAnimations.js`
- To change header sizes: edit `HEIGHT_LARGE` and `HEIGHT_SMALL` in `headerAnimations.js`
