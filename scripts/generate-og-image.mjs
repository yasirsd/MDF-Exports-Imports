/**
 * Generate public/og-image.jpg — 1200×630 Open Graph share image for MDF
 * Exports & Imports. Replaces the older "Universal Traders" branded image.
 *
 * Uses Playwright to render an HTML card, then screenshots it as JPEG. Run
 * this whenever brand copy or the master logo (src/images/LightPNG.png)
 * changes:
 *
 *   node scripts/generate-og-image.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const logoPath = resolve(root, "src/images/LightPNG.png");
const outPath = resolve(root, "public/og-image.jpg");

const logoDataUri = `data:image/png;base64,${readFileSync(logoPath).toString(
  "base64"
)}`;

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body {
        width: 1200px;
        height: 630px;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        color: #fff;
        overflow: hidden;
      }
      .stage {
        position: relative;
        width: 1200px;
        height: 630px;
        background: #0a0806;
      }
      /* Warm cinematic wash matching the site's Origin chapter atmosphere */
      .glow {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse at 22% 32%, rgba(255,160,40,0.22), transparent 55%),
          radial-gradient(ellipse at 82% 78%, rgba(120,60,20,0.55), transparent 60%);
      }
      .grain {
        position: absolute;
        inset: 0;
        opacity: 0.05;
        background-image: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,0.06) 3px
        );
      }
      .content {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 72px 96px;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 10px 20px;
        border: 1px solid rgba(255,255,255,0.22);
        border-radius: 999px;
        background: rgba(255,255,255,0.04);
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.78);
        margin-bottom: 40px;
      }
      .pill .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ff7a1a;
        box-shadow: 0 0 12px rgba(255,122,26,0.9);
      }
      .logo {
        width: 620px;
        height: auto;
        margin-bottom: 40px;
      }
      .tagline {
        font-size: 42px;
        font-weight: 700;
        line-height: 1.15;
        letter-spacing: -0.02em;
        color: #ffffff;
        max-width: 900px;
      }
      .tagline .accent {
        color: #ff7a1a;
      }
      .footer {
        position: absolute;
        left: 96px;
        right: 96px;
        bottom: 56px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 15px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.55);
      }
      .footer .strong { color: rgba(255,255,255,0.85); font-weight: 600; }
    </style>
  </head>
  <body>
    <div class="stage">
      <div class="glow"></div>
      <div class="grain"></div>
      <div class="content">
        <span class="pill">
          <span class="dot"></span>
          Andhra Pradesh · India
        </span>
        <img class="logo" src="${logoDataUri}" alt="MDF Exports & Imports" />
        <p class="tagline">
          Exporting India's <span class="accent">Freshness</span> to the World.
        </p>
      </div>
      <div class="footer">
        <span>Banganapalli Mango · Indian Apple · Pomegranate · Guntur Chilli</span>
        <span class="strong">mdfexport.com</span>
      </div>
    </div>
  </body>
</html>`;

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: "load" });
  // Wait one paint frame so the embedded logo decodes before we screenshot.
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      })
  );
  const buf = await page.screenshot({
    type: "jpeg",
    quality: 88,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  writeFileSync(outPath, buf);
  await browser.close();
  // eslint-disable-next-line no-console
  console.log(`Wrote ${outPath} (${buf.length.toLocaleString()} bytes)`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
