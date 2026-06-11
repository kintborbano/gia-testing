// Regenerates the locked pricing-card bakes (public/images/pricing-locked-*.webp).
//
// The locked cards on /pricing are images on purpose: the teaser copy and
// price must not exist in the served HTML, where inspect-element / Ctrl+F /
// crawlers would read straight through a CSS backdrop blur. This script
// renders the card markup in an isolated page and blurs the content with
// filter:blur over a solid background — NOT backdrop-blur, which samples the
// page behind the card and smears a pale rim into the edges.
//
// Usage: with the dev server running on localhost:3000 (for fonts + lock
// image), run `node scripts/rebake-locked-cards.cjs`. It writes 2x PNGs next
// to this script; convert them to webp into public/images, e.g.:
//   python -c "from PIL import Image; [Image.open(f'scripts/rebake-{n}.png').save(f'public/images/pricing-locked-{n}.webp', quality=88, method=6) for n in ['light','gold']]"
const { chromium } = require('@playwright/test');
const path = require('path');

const CONTENT = `
  <div class="inner">
    <div class="hdr">
      <div class="tier">DEEP<br>DIVE</div>
      <div class="price">₱700.00</div>
    </div>
    <div class="desc">GIA is still in beta — which means you get in early, pay less, and help shape what this becomes.</div>
    <div class="bottom">
      <div class="rule"></div>
      <div class="inc">Includes:</div>
      <ul>
        <li><b>Hook scoring</b> across your top-performing content</li>
        <li>Your <b>ideal hook formula</b>, broken down</li>
        <li><b>Hook variations</b> built for comments, shares, and saves</li>
        <li><b>Content pillar breakdown:</b> what's working and what to drop</li>
        <li><b>Performance snapshot</b> of your account across 20 videos</li>
      </ul>
    </div>
  </div>
  <div class="frost"></div>
  <div class="lock"><img src="http://localhost:3000/images/gia-lock.png"></div>
`;

const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Instrument Sans';src:url('http://localhost:3000/fonts/InstrumentSans-Regular.woff2') format('woff2');font-weight:400;}
@font-face{font-family:'Instrument Sans';src:url('http://localhost:3000/fonts/InstrumentSans-SemiBold.woff2') format('woff2');font-weight:700;}
@font-face{font-family:'Averia Serif Libre';src:url('http://localhost:3000/fonts/AveriaSerifLibre-Bold.woff2') format('woff2');font-weight:700;}
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fef7dd;display:flex;gap:40px;padding:40px;font-family:'Instrument Sans',sans-serif;-webkit-font-smoothing:antialiased}
/* Square corners: the LockedCard wrapper clips the image to rounded-[30px].
   A border-radius here would leave transparent corners that show through. */
.card{position:relative;width:350px;height:400px;overflow:hidden;display:flex;flex-direction:column;padding:24px 27px 23px}
.card.light{background:#ffffff;color:#8c1f2e}
.card.gold{background:#c9920a;color:#ffffff}
.inner{display:flex;flex-direction:column;flex:1 1 auto;filter:blur(6.6px)}
.hdr{display:flex;justify-content:space-between;align-items:flex-start}
.tier{font-weight:700;font-size:20px;line-height:1.45;letter-spacing:-0.1px}
.price{font-family:'Averia Serif Libre',serif;font-weight:700;font-size:40px;line-height:1.1;letter-spacing:-0.8px}
.desc{margin-top:19px;width:290px;font-size:13px;line-height:1.45;letter-spacing:-0.065px}
.bottom{margin-top:auto;padding-top:20px}
.rule{height:1px;width:100%;background:currentColor}
.inc{margin-top:8px;font-size:13px;line-height:1.45;letter-spacing:-0.065px}
ul{margin-top:16px;padding-left:20px;font-size:13px;line-height:1.45;letter-spacing:-0.065px}
li b{font-weight:700}
.frost{position:absolute;inset:0;background:rgba(254,247,221,0.5)}
.lock{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.lock img{width:124px;height:109px;margin-top:-19px}
</style></head><body>
<div class="card light" id="light">${CONTENT}</div>
<div class="card gold" id="gold">${CONTENT}</div>
</body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 900, height: 600 },
    deviceScaleFactor: 2,
  });
  await page.setContent(HTML, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  for (const id of ['light', 'gold']) {
    const out = path.join(__dirname, `rebake-${id}.png`);
    await page.locator(`#${id}`).screenshot({ path: out });
    console.log('wrote', out);
  }
  await browser.close();
})();
