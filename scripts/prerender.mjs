/**
 * Build-time homepage prerender for the Vite SPA.
 *
 * Loads dist/ via Vite preview in Playwright, forces every DeferMount section
 * to mount (home only — never #privacy), waits for Helmet + body content, then
 * writes the rendered HTML back to dist/index.html.
 *
 * Real users still boot createRoot CSR on top of this HTML; crawlers get
 * meaningful first-byte markup.
 *
 * Deploy trigger check: keep this file in git so main → Vercel auto-deploys.
 */
import { execSync } from "node:child_process";
import { copyFile, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { preview } from "vite";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const INDEX = path.join(DIST, "index.html");
const INDEX_BEFORE = path.join(DIST, "index.before-prerender.html");

/** DeferMount ids that must be force-mounted for the home capture. */
const SECTION_IDS = [
  "story",
  "products",
  "about",
  "why",
  "process",
  "statistics",
  "markets",
  "certifications",
  "gallery",
  "testimonials",
  "faq",
  "contact",
  "footer",
];

const REQUIRED_SNIPPETS = [
  { label: "Hero copy", re: /Exporting\s+Freshness/i },
  { label: "Markets copy", re: /From\s+Andhra\s+Pradesh\s+to\s+the\s+world/i },
  { label: "Market name", re: /Dubai|Riyadh|Doha/i },
  { label: "FAQ", re: /Frequently\s+asked\s+questions/i },
];

const PRIVACY_ONLY_MARKERS = [
  /How MDF Exports &amp; Imports collects and uses enquiry/i,
  /title>\s*Privacy Policy\s*—/i,
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Production canonical origin baked into Helmet / JSON-LD via VITE_SITE_URL. */
const EXPECTED_SITE_ORIGIN = (
  process.env.VITE_SITE_URL || "https://www.mdfexport.com"
).replace(/\/$/, "");

/**
 * Vercel build images are Amazon Linux — `playwright install --with-deps`
 * fails there (no apt-get). On Vercel we launch via @sparticuz/chromium.
 * Locally we only need `playwright install chromium` (no --with-deps).
 */
async function ensureLocalChromium() {
  try {
    const browser = await chromium.launch({ headless: true });
    await browser.close();
  } catch {
    console.log(
      "[prerender] Chromium missing — installing via Playwright (chromium only, no --with-deps)…"
    );
    execSync("npx playwright install chromium", {
      cwd: ROOT,
      stdio: "inherit",
      env: process.env,
    });
  }
}

async function launchBrowser() {
  const onVercel = Boolean(process.env.VERCEL);
  if (onVercel) {
    console.log(
      "[prerender] Vercel build detected — launching @sparticuz/chromium (skip --with-deps)"
    );
    const sparticuzMod = await import("@sparticuz/chromium");
    const sparticuz = sparticuzMod.default;
    return chromium.launch({
      args: [...sparticuz.args, "--disable-dev-shm-usage"],
      executablePath: await sparticuz.executablePath(),
      headless: true,
    });
  }

  await ensureLocalChromium();
  return chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage"],
  });
}

function assertSeoUrls(html) {
  const canonical =
    html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] || "";
  const ogUrl =
    html.match(/<meta[^>]+property=["']og:url["'][^>]*>/i)?.[0] || "";
  const ldBlock =
    html.match(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i
    )?.[1] || "";

  const haystack = `${canonical}\n${ogUrl}\n${ldBlock}`;
  if (/localhost|127\.0\.0\.1/i.test(haystack)) {
    throw new Error(
      "[prerender] SEO URLs contain localhost/127.0.0.1 — refusing to ship. Set VITE_SITE_URL to the production domain for this build."
    );
  }

  if (!haystack.includes(EXPECTED_SITE_ORIGIN)) {
    throw new Error(
      `[prerender] Expected site origin ${EXPECTED_SITE_ORIGIN} missing from canonical/og:url/JSON-LD. Set VITE_SITE_URL in the build env (Vercel Production).`
    );
  }

  console.log(
    `[prerender] SEO URLs OK — origin ${EXPECTED_SITE_ORIGIN} present; no localhost.`
  );
}

function assertHomeHtml(html) {
  if (!html || typeof html !== "string") {
    throw new Error("[prerender] Capture returned empty HTML.");
  }
  // Motion splits words across spans and often uses &nbsp; — check a text-ish form.
  const normalized = html
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
  const missing = REQUIRED_SNIPPETS.filter(({ re }) => !re.test(normalized)).map(
    (s) => s.label
  );
  if (missing.length) {
    throw new Error(
      `[prerender] Captured HTML missing required content: ${missing.join(", ")} (bytes=${Buffer.byteLength(html, "utf8")})`
    );
  }
  for (const re of PRIVACY_ONLY_MARKERS) {
    if (re.test(normalized)) {
      throw new Error(
        "[prerender] Captured HTML looks like the #privacy view — aborting so index.html stays home-only."
      );
    }
  }
  // Structural checks on raw HTML (ids / meta survive tag stripping poorly).
  if (!/id=["']products["']/i.test(html) || !/id=["']about["']/i.test(html)) {
    throw new Error("[prerender] Missing section ids in captured HTML.");
  }
  if (
    !/rel=["']canonical["']/i.test(html) ||
    !/property=["']og:title["']/i.test(html) ||
    !/application\/ld\+json/i.test(html)
  ) {
    throw new Error("[prerender] Missing Helmet canonical / OG / JSON-LD in head.");
  }
  if (!/<div id="root"[^>]*>[\s\S]{200,}<\/div>/i.test(html)) {
    throw new Error("[prerender] #root still looks empty after capture.");
  }
  assertSeoUrls(html);
}

async function forceEnsureSections(page) {
  await page.evaluate((ids) => {
    window.dispatchEvent(
      new CustomEvent("ut:ensure-section", { detail: { target: "*" } })
    );
    for (const id of ids) {
      window.dispatchEvent(
        new CustomEvent("ut:ensure-section", { detail: { target: id } })
      );
    }
  }, SECTION_IDS);
}

async function readReadyState(page) {
  return page.evaluate((ids) => {
    const root = document.getElementById("root");
    const bodyText = (root?.textContent || "").replace(/\u00a0/g, " ");
    const sections = Object.fromEntries(
      ids.map((id) => {
        const el = document.getElementById(id);
        return [id, Boolean(el && el.childElementCount > 0)];
      })
    );
    return {
      hash: location.hash,
      rootKids: root?.childElementCount ?? 0,
      hasLd: Boolean(
        document.querySelector('script[type="application/ld+json"]')
      ),
      hasCanonical: Boolean(document.querySelector('link[rel="canonical"]')),
      hasOg: Boolean(document.querySelector('meta[property="og:title"]')),
      hasHero: /Exporting\s+Freshness/i.test(bodyText),
      hasMarkets: /From\s+Andhra\s+Pradesh\s+to\s+the\s+world/i.test(bodyText),
      hasFaq: /Frequently\s+asked\s+questions/i.test(bodyText),
      sections,
      allSections: ids.every((id) => sections[id]),
      sample: bodyText.slice(0, 160),
    };
  }, SECTION_IDS);
}

function isReady(state) {
  return (
    state.hash !== "#privacy" &&
    state.rootKids > 0 &&
    state.hasLd &&
    state.hasCanonical &&
    state.hasOg &&
    state.hasHero &&
    state.hasMarkets &&
    state.hasFaq &&
    state.allSections
  );
}

async function waitForHomeReady(page) {
  await forceEnsureSections(page);

  const deadline = Date.now() + 90_000;
  let last = null;
  while (Date.now() < deadline) {
    last = await readReadyState(page);
    if (isReady(last)) break;
    await forceEnsureSections(page);
    await sleep(500);
  }

  if (!last || !isReady(last)) {
    console.error("[prerender] Last ready state:", JSON.stringify(last, null, 2));
    throw new Error("[prerender] Timed out waiting for home sections + Helmet.");
  }

  // Avoid scrollIntoView during capture — Story/GSAP scroll handlers can briefly
  // empty #story (and similar) even though content was already mounted.
}

async function captureHtml(page) {
  await page.evaluate(() => {
    const style = document.createElement("style");
    style.setAttribute("data-prerender-vis", "");
    style.textContent = `
      #root, #root * {
        opacity: 1 !important;
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);
  });

  let html = await page.content();
  if (!/^<!doctype/i.test(html)) {
    html = `<!doctype html>\n${html}`;
  }
  return html.endsWith("\n") ? html : `${html}\n`;
}

async function main() {
  const t0 = Date.now();
  console.log("[prerender] Starting homepage capture…");

  await copyFile(INDEX, INDEX_BEFORE);
  const beforeHtml = await readFile(INDEX_BEFORE, "utf8");
  if (!beforeHtml.includes('<div id="root"></div>')) {
    console.warn(
      "[prerender] Unexpected shell (root already filled?) — continuing."
    );
  }

  console.log(
    `[prerender] Expected SEO origin: ${EXPECTED_SITE_ORIGIN} (from VITE_SITE_URL or default)`
  );

  const previewServer = await preview({
    root: ROOT,
    preview: {
      port: 4179,
      host: "127.0.0.1",
      strictPort: true,
    },
  });

  const baseUrl =
    previewServer.resolvedUrls?.local?.[0] || "http://127.0.0.1:4179/";
  // Localhost is only the capture host — Helmet URLs come from VITE_SITE_URL baked at vite build.
  const homeUrl = new URL("/", baseUrl).href;

  let browser;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });

    page.on("pageerror", (err) => {
      console.warn("[prerender:pageerror]", err.message);
    });

    // Do NOT emulate prefers-reduced-motion — it triggers a React removeChild
    // crash in this app's motion tree. Globe is skipped via window.__PRERENDER__.

    // Must run before any app script so DeferMount initializes ready=true.
    await page.addInitScript(() => {
      window.__PRERENDER__ = true;
    });

    await page.goto(homeUrl, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    await page.waitForSelector("#root > *", { timeout: 60_000 });

    const hash = await page.evaluate(() => location.hash);
    if (hash === "#privacy") {
      throw new Error(
        "[prerender] Landed on #privacy — refusing to write index.html"
      );
    }

    await waitForHomeReady(page);

    const html = await captureHtml(page);
    console.log("[prerender] Captured bytes:", Buffer.byteLength(html, "utf8"));
    try {
      assertHomeHtml(html);
    } catch (err) {
      await writeFile(
        path.join(DIST, "index.prerender-failed.html"),
        html,
        "utf8"
      );
      throw err;
    }

    await writeFile(INDEX, html, "utf8");

    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    const beforeBytes = Buffer.byteLength(beforeHtml, "utf8");
    const afterBytes = Buffer.byteLength(html, "utf8");
    console.log(
      `[prerender] Wrote ${INDEX} (${beforeBytes} → ${afterBytes} bytes) in ${elapsed}s`
    );
    console.log(
      `[prerender] Shell snapshot saved at ${INDEX_BEFORE} for before/after compare`
    );
  } finally {
    await browser?.close().catch(() => {});
    await previewServer.close().catch(() => {});
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
