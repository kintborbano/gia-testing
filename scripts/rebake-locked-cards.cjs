// Regenerates the locked pricing-card bakes (public/images/pricing-locked-*.webp).
//
// The two flanking cards on /pricing are images on purpose: the teaser copy and
// price must NOT exist in the served HTML, where inspect-element / Ctrl+F /
// crawlers would read straight through a CSS blur.
//
// Rather than re-creating the card markup by hand, this script drives the live
// /pricing page, blurs the real rendered side cards (filter:blur over each
// card's own solid background — NOT backdrop-blur, which samples the page
// behind the card and smears a pale rim into the edges), lays a frosted wash +
// lock icon over them, and screenshots each card. That way the bake always
// matches the real PricingCard design.
//
// Usage: start the dev server (npm run dev), then run
// `node scripts/rebake-locked-cards.cjs`. It drives the dev-only
// /pricing/bake route (which renders the tiers as real DOM) and writes the webp
// bakes directly into public/images. Production /pricing already serves the
// images — no code change is needed after a rebake unless the card height
// changed, in which case update LockedCard's height in Pricing.tsx.
const { chromium } = require('@playwright/test');
const path = require('path');

// sharp isn't hoisted to the top-level node_modules under pnpm; resolve it from
// its package folder so this script runs without an extra install.
const sharp = require(
  require.resolve('sharp', {
    paths: [path.join(__dirname, '..', 'node_modules', '.pnpm', 'sharp@0.34.5', 'node_modules')],
  })
);

const URL = 'http://localhost:3000/pricing/bake';
const BLUR_PX = 6.6;
const FROST = 'rgba(254, 247, 221, 0.5)'; // cream wash, matches the page bg
// Light card is the first .rounded-[30px], the gold card the third (the
// featured beta card sits between them and is left untouched).
const TARGETS = [
  { index: 0, name: 'light' },
  { index: 2, name: 'gold' },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1400 },
    deviceScaleFactor: 2,
  });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);

  // Blur each side card's content and overlay the frost + lock, in place.
  await page.evaluate(
    ({ BLUR_PX, FROST, indexes }) => {
      const cards = Array.from(
        document.querySelectorAll('.rounded-\\[30px\\]')
      );
      indexes.forEach((i) => {
        const card = cards[i];
        card.style.position = 'relative';
        // Blur the actual content; the blur fades to the card's solid bg at the
        // edges, so no teaser text survives legibly.
        Array.from(card.children).forEach((child) => {
          child.style.filter = `blur(${BLUR_PX}px)`;
        });
        const frost = document.createElement('div');
        frost.style.cssText = `position:absolute;inset:0;border-radius:30px;background:${FROST};`;
        card.appendChild(frost);
        const lockWrap = document.createElement('div');
        lockWrap.style.cssText =
          'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;';
        const lock = document.createElement('img');
        lock.src = '/images/gia-lock.png';
        lock.style.cssText = 'width:124px;height:109px;margin-top:-19px;';
        lockWrap.appendChild(lock);
        card.appendChild(lockWrap);
      });
    },
    { BLUR_PX, FROST, indexes: TARGETS.map((t) => t.index) }
  );

  await page.waitForTimeout(300);

  for (const { index, name } of TARGETS) {
    const card = page.locator('.rounded-\\[30px\\]').nth(index);
    const box = await card.boundingBox();
    const png = await card.screenshot({ omitBackground: true });
    const out = path.join(
      __dirname,
      '..',
      'public',
      'images',
      `pricing-locked-${name}.webp`
    );
    await sharp(png).webp({ quality: 88, effort: 6 }).toFile(out);
    console.log(
      `wrote ${out}  (card ${Math.round(box.width)}x${Math.round(box.height)} css px)`
    );
  }

  await browser.close();
})();
