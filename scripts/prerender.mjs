/**
 * Build-time prerender for the Vite SPA.
 *
 * 1) Homepage → dist/index.html (never privacy / product landings)
 * 2) Privacy Policy → dist/privacy/index.html
 * 3) Guntur chilli → dist/products/guntur-red-chilli/index.html
 * 4) Indian apple → dist/products/indian-apple/index.html
 * 5) Indian pomegranate → dist/products/indian-pomegranate/index.html
 * 6) Banganapalli mango → dist/products/banganapalli-mango/index.html
 *
 * Capture host is localhost; Helmet URLs use VITE_SITE_URL.
 * Real users still boot createRoot CSR on top of this HTML.
 *
 * Deploy trigger check: keep this file in git so main → Vercel auto-deploys.
 */
import { execSync } from "node:child_process";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { preview } from "vite";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const INDEX = path.join(DIST, "index.html");
const INDEX_BEFORE = path.join(DIST, "index.before-prerender.html");
const PRIVACY_DIR = path.join(DIST, "privacy");
const PRIVACY_INDEX = path.join(PRIVACY_DIR, "index.html");
const GUNTUR_DIR = path.join(DIST, "products", "guntur-red-chilli");
const GUNTUR_INDEX = path.join(GUNTUR_DIR, "index.html");
const GUNTUR_PATH = "/products/guntur-red-chilli";
const APPLE_DIR = path.join(DIST, "products", "indian-apple");
const APPLE_INDEX = path.join(APPLE_DIR, "index.html");
const APPLE_PATH = "/products/indian-apple";
const POM_DIR = path.join(DIST, "products", "indian-pomegranate");
const POM_INDEX = path.join(POM_DIR, "index.html");
const POM_PATH = "/products/indian-pomegranate";
const MANGO_DIR = path.join(DIST, "products", "banganapalli-mango");
const MANGO_INDEX = path.join(MANGO_DIR, "index.html");
const MANGO_PATH = "/products/banganapalli-mango";

/** DeferMount ids that must be force-mounted for the home capture. */
const SECTION_IDS = [
  "products",
  "story",
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
  { label: "Story chapter", re: /Freshness\s+begins\s+at\s+the\s+farm/i },
  { label: "Products catalogue", re: /Export-ready\s+produce/i },
  { label: "Markets copy", re: /From\s+Andhra\s+Pradesh\s+to\s+the\s+world/i },
  { label: "Market name", re: /Dubai|Riyadh|Doha/i },
  { label: "FAQ", re: /Frequently\s+asked\s+questions/i },
  { label: "Contact", re: /Let's\s+Trade|Start\s+importing/i },
  { label: "Footer", re: /All\s+rights\s+reserved/i },
];

/** Per-section content that must exist — rejects DeferMount/Suspense placeholder shells. */
const SECTION_CONTENT = {
  story: {
    minChars: 120,
    re: /Freshness\s+begins\s+at\s+the\s+farm|Grown\s+by\s+hands\s+we\s+trust|The\s+Origin/i,
  },
  products: {
    minChars: 200,
    re: /(?=[\s\S]*Banganapalli\s+Mango)(?=[\s\S]*Indian\s+Apple)(?=[\s\S]*Pomegranate)(?=[\s\S]*Guntur)/i,
  },
  about: {
    minChars: 80,
    re: /Our\s+Story|MD\s+Fruits|Four\s+decades/i,
  },
  why: {
    minChars: 60,
    re: /Why\s+MDF/i,
  },
  process: {
    minChars: 80,
    re: /Farm\s+to\s+Port|Nine\s+steps/i,
  },
  statistics: {
    minChars: 40,
    re: /Years\s+Experience|Farm\s+Network|GCC/i,
  },
  markets: {
    minChars: 60,
    re: /From\s+Andhra\s+Pradesh\s+to\s+the\s+world|Global\s+Reach/i,
  },
  certifications: {
    minChars: 60,
    re: /Compliance|APEDA|Built\s+for\s+export/i,
  },
  gallery: {
    minChars: 40,
    re: /In\s+the\s+Field/i,
  },
  testimonials: {
    minChars: 60,
    re: /Buyer\s+Themes|importers/i,
  },
  faq: {
    minChars: 60,
    re: /Frequently\s+asked\s+questions/i,
  },
  contact: {
    minChars: 60,
    re: /Let's\s+Trade|Start\s+importing/i,
  },
  footer: {
    minChars: 40,
    re: /All\s+rights\s+reserved|Privacy\s+Policy/i,
  },
};

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

function assertSeoUrls(html, { pathSuffix = "/" } = {}) {
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

  const expectedPath =
    pathSuffix === "/"
      ? `${EXPECTED_SITE_ORIGIN}/`
      : `${EXPECTED_SITE_ORIGIN}${pathSuffix}`;
  if (!canonical.includes(expectedPath) && !ogUrl.includes(expectedPath)) {
    throw new Error(
      `[prerender] Expected canonical/og:url path ${expectedPath} — got canonical=${canonical} og:url=${ogUrl}`
    );
  }

  console.log(
    `[prerender] SEO URLs OK — ${expectedPath}; no localhost.`
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
  if (!/href=["']\/products\/guntur-red-chilli["']/i.test(html)) {
    throw new Error(
      "[prerender] Homepage missing crawlable link to /products/guntur-red-chilli."
    );
  }
  if (!/href=["']\/products\/indian-apple["']/i.test(html)) {
    throw new Error(
      "[prerender] Homepage missing crawlable link to /products/indian-apple."
    );
  }
  if (!/href=["']\/products\/indian-pomegranate["']/i.test(html)) {
    throw new Error(
      "[prerender] Homepage missing crawlable link to /products/indian-pomegranate."
    );
  }
  if (!/href=["']\/products\/banganapalli-mango["']/i.test(html)) {
    throw new Error(
      "[prerender] Homepage missing crawlable link to /products/banganapalli-mango."
    );
  }
  if (/Our\s+primary\s+export\s+guides/i.test(html)) {
    throw new Error(
      "[prerender] Homepage still contains removed Premium Exports spotlight."
    );
  }
  // Reject leftover DeferMount / Suspense placeholder shells in the capture.
  for (let i = 0; i < SECTION_IDS.length; i++) {
    const id = SECTION_IDS[i];
    const shell = new RegExp(
      `id=["']${id}["'][^>]*>\\s*<div class="[^"]*min-h-[^"]*"[^>]*aria-hidden=["']true["'][^>]*>\\s*</div>\\s*</div>`,
      "i"
    );
    const shellAlt = new RegExp(
      `id=["']${id}["'][^>]*>\\s*<div[^>]*aria-hidden=["']true["'][^>]*class="[^"]*min-h-[^"]*"[^>]*>\\s*</div>\\s*</div>`,
      "i"
    );
    if (shell.test(html) || shellAlt.test(html)) {
      throw new Error(
        `[prerender] Homepage section #${id} is still a DeferMount/Suspense placeholder shell — refusing to ship partial capture.`
      );
    }
    const cfg = SECTION_CONTENT[id];
    if (!cfg) continue;

    const startRe = new RegExp(`id=["']${id}["']`, "i");
    const startMatch = startRe.exec(html);
    if (!startMatch) {
      throw new Error(`[prerender] Homepage section #${id} id missing from capture.`);
    }
    const start = startMatch.index;
    let end = html.length;
    for (let j = i + 1; j < SECTION_IDS.length; j++) {
      const nextRe = new RegExp(`id=["']${SECTION_IDS[j]}["']`, "i");
      nextRe.lastIndex = start + 1;
      const nextMatch = nextRe.exec(html);
      if (nextMatch) {
        end = nextMatch.index;
        break;
      }
    }
    const chunk = html.slice(start, end);
    const text = chunk
      .replace(/&nbsp;/gi, " ")
      .replace(/&#160;/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (text.length < cfg.minChars || !cfg.re.test(text)) {
      throw new Error(
        `[prerender] Homepage section #${id} missing real content (chars=${text.length}, marker=${cfg.re}).`
      );
    }
  }
  assertSeoUrls(html, { pathSuffix: "/" });
}

function assertPrivacyHtml(html) {
  if (!html || typeof html !== "string") {
    throw new Error("[prerender] Privacy capture returned empty HTML.");
  }
  const normalized = html
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  if (!/Privacy\s+Policy/i.test(normalized)) {
    throw new Error("[prerender] Privacy HTML missing Privacy Policy heading/copy.");
  }
  if (!/enquiry|WhatsApp|Information we collect/i.test(normalized)) {
    throw new Error("[prerender] Privacy HTML missing policy body content.");
  }
  // Must not be a homepage duplicate.
  if (/Exporting\s+Freshness/i.test(normalized)) {
    throw new Error(
      "[prerender] Privacy HTML still contains homepage hero — wrong view captured."
    );
  }
  if (!/rel=["']canonical["']/i.test(html) || !/property=["']og:title["']/i.test(html)) {
    throw new Error("[prerender] Privacy HTML missing Helmet canonical / OG tags.");
  }
  if (!/<div id="root"[^>]*>[\s\S]{200,}<\/div>/i.test(html)) {
    throw new Error("[prerender] Privacy #root still looks empty after capture.");
  }
  assertSeoUrls(html, { pathSuffix: "/privacy" });
}

function assertGunturHtml(html) {
  if (!html || typeof html !== "string") {
    throw new Error("[prerender] Guntur capture returned empty HTML.");
  }
  const normalized = html
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  if (!/Guntur\s+Red\s+Chilli/i.test(normalized)) {
    throw new Error("[prerender] Guntur HTML missing product heading/copy.");
  }
  if (!/Why\s+Guntur\s+red\s+chilli\s+stands\s+apart/i.test(normalized)) {
    throw new Error("[prerender] Guntur HTML missing H2 sections.");
  }
  if (!/Scoville|packaging|import clearance/i.test(normalized)) {
    throw new Error("[prerender] Guntur HTML missing FAQ content.");
  }
  if (/Exporting\s+Freshness/i.test(normalized)) {
    throw new Error(
      "[prerender] Guntur HTML still contains homepage hero — wrong view captured."
    );
  }
  if (!/rel=["']canonical["']/i.test(html) || !/property=["']og:title["']/i.test(html)) {
    throw new Error("[prerender] Guntur HTML missing Helmet canonical / OG tags.");
  }
  const ldCompact = html.replace(/\s/g, "");
  if (!ldCompact.includes('"@type":"Service"')) {
    throw new Error("[prerender] Guntur HTML missing Service JSON-LD.");
  }
  if (!ldCompact.includes('"@type":"FAQPage"')) {
    throw new Error("[prerender] Guntur HTML missing FAQPage JSON-LD.");
  }
  if (!/<div id="root"[^>]*>[\s\S]{200,}<\/div>/i.test(html)) {
    throw new Error("[prerender] Guntur #root still looks empty after capture.");
  }
  assertSeoUrls(html, { pathSuffix: GUNTUR_PATH });
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
  return page.evaluate(
    ({ ids, content }) => {
      const root = document.getElementById("root");
      const bodyText = (root?.textContent || "").replace(/\u00a0/g, " ");

      const isPlaceholderShell = (el) => {
        if (!el) return true;
        const kids = Array.from(el.children);
        if (kids.length === 0) return true;
        // Classic Suspense/DeferMount fallback: single aria-hidden min-h box.
        if (kids.length === 1) {
          const only = kids[0];
          const cls = only.className || "";
          const ariaHidden = only.getAttribute("aria-hidden") === "true";
          if (ariaHidden && /min-h-\[/.test(cls) && !(only.textContent || "").trim()) {
            return true;
          }
        }
        return false;
      };

      const sections = {};
      const failures = [];

      for (const id of ids) {
        const el = document.getElementById(id);
        const cfg = content[id];
        const text = (el?.textContent || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
        const placeholder = isPlaceholderShell(el);
        const tooShort = !cfg || text.length < cfg.minChars;
        // Marker: rebuild RegExp from source string passed from Node.
        const markerOk = cfg && new RegExp(cfg.reSource, cfg.reFlags || "i").test(text);
        const ok = Boolean(el) && !placeholder && !tooShort && markerOk;
        sections[id] = {
          ok,
          placeholder,
          chars: text.length,
          hasEl: Boolean(el),
          childCount: el?.childElementCount ?? 0,
        };
        if (!ok) {
          const why = !el
            ? "missing"
            : placeholder
              ? "placeholder-shell"
              : tooShort
                ? `too-short(${text.length}<${cfg?.minChars})`
                : "marker-miss";
          failures.push(`${id}:${why}`);
        }
      }

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
        hasStory: /Freshness\s+begins\s+at\s+the\s+farm/i.test(bodyText),
        sections,
        failures,
        allSections: failures.length === 0,
        sample: bodyText.slice(0, 160),
      };
    },
    {
      ids: SECTION_IDS,
      content: Object.fromEntries(
        Object.entries(SECTION_CONTENT).map(([id, cfg]) => [
          id,
          {
            minChars: cfg.minChars,
            reSource: cfg.re.source,
            reFlags: cfg.re.flags,
          },
        ])
      ),
    }
  );
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
    state.hasStory &&
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
    const failed = last?.failures?.join(", ") || "unknown";
    throw new Error(
      `[prerender] Timed out waiting for home sections + Helmet. Failed sections: ${failed}`
    );
  }
}

async function waitForPrivacyReady(page) {
  const deadline = Date.now() + 60_000;
  let last = null;
  while (Date.now() < deadline) {
    last = await page.evaluate(() => {
      const root = document.getElementById("root");
      const bodyText = (root?.textContent || "").replace(/\u00a0/g, " ");
      const canonical =
        document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
        "";
      return {
        path: location.pathname,
        hash: location.hash,
        rootKids: root?.childElementCount ?? 0,
        hasPrivacy: /Privacy\s+Policy/i.test(bodyText),
        hasBody: /Information we collect/i.test(bodyText),
        hasHero: /Exporting\s+Freshness/i.test(bodyText),
        hasCanonical: /\/privacy\/?$/.test(canonical),
        hasOg: Boolean(document.querySelector('meta[property="og:title"]')),
      };
    });
    if (
      last.rootKids > 0 &&
      last.hasPrivacy &&
      last.hasBody &&
      !last.hasHero &&
      last.hasCanonical &&
      last.hasOg
    ) {
      return;
    }
    await sleep(400);
  }
  console.error("[prerender] Privacy ready state:", JSON.stringify(last, null, 2));
  throw new Error("[prerender] Timed out waiting for /privacy view + Helmet.");
}

async function waitForGunturReady(page) {
  const deadline = Date.now() + 60_000;
  let last = null;
  while (Date.now() < deadline) {
    last = await page.evaluate((path) => {
      const root = document.getElementById("root");
      const bodyText = (root?.textContent || "").replace(/\u00a0/g, " ");
      const canonical =
        document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
        "";
      const ld = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      )
        .map((s) => s.textContent || "")
        .join("");
      return {
        path: location.pathname,
        rootKids: root?.childElementCount ?? 0,
        hasTitle: /Guntur\s+Red\s+Chilli/i.test(bodyText),
        hasH2: /Why\s+Guntur\s+red\s+chilli\s+stands\s+apart/i.test(bodyText),
        hasHero: /Exporting\s+Freshness/i.test(bodyText),
        hasCanonical: canonical.includes(path),
        hasOg: Boolean(document.querySelector('meta[property="og:title"]')),
        hasProductLd: ld.includes('"Service"'),
        hasFaqLd: ld.includes('"FAQPage"'),
      };
    }, GUNTUR_PATH);
    if (
      last.rootKids > 0 &&
      last.hasTitle &&
      last.hasH2 &&
      !last.hasHero &&
      last.hasCanonical &&
      last.hasOg &&
      last.hasProductLd &&
      last.hasFaqLd
    ) {
      return;
    }
    await sleep(400);
  }
  console.error("[prerender] Guntur ready state:", JSON.stringify(last, null, 2));
  throw new Error("[prerender] Timed out waiting for Guntur chilli page + Helmet.");
}

function assertAppleHtml(html) {
  if (!html || typeof html !== "string") {
    throw new Error("[prerender] Indian apple capture returned empty HTML.");
  }
  const normalized = html
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  if (!/Premium\s+Indian\s+Apples/i.test(normalized)) {
    throw new Error("[prerender] Indian apple HTML missing product heading/copy.");
  }
  if (!/Where\s+our\s+apples\s+come\s+from/i.test(normalized)) {
    throw new Error("[prerender] Indian apple HTML missing H2 sections.");
  }
  if (!/cold\s+chain|shelf\s+life|Andhra\s+Pradesh/i.test(normalized)) {
    throw new Error("[prerender] Indian apple HTML missing FAQ content.");
  }
  if (/Exporting\s+Freshness/i.test(normalized)) {
    throw new Error(
      "[prerender] Indian apple HTML still contains homepage hero — wrong view captured."
    );
  }
  if (!/rel=["']canonical["']/i.test(html) || !/property=["']og:title["']/i.test(html)) {
    throw new Error("[prerender] Indian apple HTML missing Helmet canonical / OG tags.");
  }
  const ldCompact = html.replace(/\s/g, "");
  if (!ldCompact.includes('"@type":"Service"')) {
    throw new Error("[prerender] Indian apple HTML missing Service JSON-LD.");
  }
  if (!ldCompact.includes('"@type":"FAQPage"')) {
    throw new Error("[prerender] Indian apple HTML missing FAQPage JSON-LD.");
  }
  if (!/<div id="root"[^>]*>[\s\S]{200,}<\/div>/i.test(html)) {
    throw new Error("[prerender] Indian apple #root still looks empty after capture.");
  }
  assertSeoUrls(html, { pathSuffix: APPLE_PATH });
}

async function waitForAppleReady(page) {
  const deadline = Date.now() + 60_000;
  let last = null;
  while (Date.now() < deadline) {
    last = await page.evaluate((path) => {
      const root = document.getElementById("root");
      const bodyText = (root?.textContent || "").replace(/\u00a0/g, " ");
      const canonical =
        document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
        "";
      const ld = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      )
        .map((s) => s.textContent || "")
        .join("");
      return {
        path: location.pathname,
        rootKids: root?.childElementCount ?? 0,
        hasTitle: /Premium\s+Indian\s+Apples/i.test(bodyText),
        hasH2: /Where\s+our\s+apples\s+come\s+from/i.test(bodyText),
        hasHero: /Exporting\s+Freshness/i.test(bodyText),
        hasCanonical: canonical.includes(path),
        hasOg: Boolean(document.querySelector('meta[property="og:title"]')),
        hasProductLd: ld.includes('"Service"'),
        hasFaqLd: ld.includes('"FAQPage"'),
      };
    }, APPLE_PATH);
    if (
      last.rootKids > 0 &&
      last.hasTitle &&
      last.hasH2 &&
      !last.hasHero &&
      last.hasCanonical &&
      last.hasOg &&
      last.hasProductLd &&
      last.hasFaqLd
    ) {
      return;
    }
    await sleep(400);
  }
  console.error("[prerender] Indian apple ready state:", JSON.stringify(last, null, 2));
  throw new Error("[prerender] Timed out waiting for Indian apple page + Helmet.");
}

function assertPomegranateHtml(html) {
  if (!html || typeof html !== "string") {
    throw new Error("[prerender] Indian pomegranate capture returned empty HTML.");
  }
  const normalized = html
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  if (!/Indian\s+Pomegranates/i.test(normalized)) {
    throw new Error("[prerender] Indian pomegranate HTML missing product heading/copy.");
  }
  if (!/Where\s+our\s+pomegranates\s+come\s+from/i.test(normalized)) {
    throw new Error("[prerender] Indian pomegranate HTML missing H2 sections.");
  }
  if (!/Bhagwa|Ganesh|GI-tagged|shelf\s+life/i.test(normalized)) {
    throw new Error("[prerender] Indian pomegranate HTML missing FAQ/variety content.");
  }
  if (/Exporting\s+Freshness/i.test(normalized)) {
    throw new Error(
      "[prerender] Indian pomegranate HTML still contains homepage hero — wrong view captured."
    );
  }
  if (!/rel=["']canonical["']/i.test(html) || !/property=["']og:title["']/i.test(html)) {
    throw new Error("[prerender] Indian pomegranate HTML missing Helmet canonical / OG tags.");
  }
  const ldCompact = html.replace(/\s/g, "");
  if (!ldCompact.includes('"@type":"Service"')) {
    throw new Error("[prerender] Indian pomegranate HTML missing Service JSON-LD.");
  }
  if (!ldCompact.includes('"@type":"FAQPage"')) {
    throw new Error("[prerender] Indian pomegranate HTML missing FAQPage JSON-LD.");
  }
  if (!/<div id="root"[^>]*>[\s\S]{200,}<\/div>/i.test(html)) {
    throw new Error("[prerender] Indian pomegranate #root still looks empty after capture.");
  }
  assertSeoUrls(html, { pathSuffix: POM_PATH });
}

async function waitForPomegranateReady(page) {
  const deadline = Date.now() + 60_000;
  let last = null;
  while (Date.now() < deadline) {
    last = await page.evaluate((path) => {
      const root = document.getElementById("root");
      const bodyText = (root?.textContent || "").replace(/\u00a0/g, " ");
      const canonical =
        document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
        "";
      const ld = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      )
        .map((s) => s.textContent || "")
        .join("");
      return {
        path: location.pathname,
        rootKids: root?.childElementCount ?? 0,
        hasTitle: /Indian\s+Pomegranates/i.test(bodyText),
        hasH2: /Where\s+our\s+pomegranates\s+come\s+from/i.test(bodyText),
        hasHero: /Exporting\s+Freshness/i.test(bodyText),
        hasCanonical: canonical.includes(path),
        hasOg: Boolean(document.querySelector('meta[property="og:title"]')),
        hasProductLd: ld.includes('"Service"'),
        hasFaqLd: ld.includes('"FAQPage"'),
      };
    }, POM_PATH);
    if (
      last.rootKids > 0 &&
      last.hasTitle &&
      last.hasH2 &&
      !last.hasHero &&
      last.hasCanonical &&
      last.hasOg &&
      last.hasProductLd &&
      last.hasFaqLd
    ) {
      return;
    }
    await sleep(400);
  }
  console.error(
    "[prerender] Indian pomegranate ready state:",
    JSON.stringify(last, null, 2)
  );
  throw new Error(
    "[prerender] Timed out waiting for Indian pomegranate page + Helmet."
  );
}

function assertMangoHtml(html) {
  if (!html || typeof html !== "string") {
    throw new Error("[prerender] Banganapalli mango capture returned empty HTML.");
  }
  const normalized = html
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");

  if (!/Banganapalli\s+Mangoes/i.test(normalized)) {
    throw new Error("[prerender] Banganapalli mango HTML missing product heading/copy.");
  }
  if (!/Where\s+our\s+mangoes\s+come\s+from/i.test(normalized)) {
    throw new Error("[prerender] Banganapalli mango HTML missing H2 sections.");
  }
  if (!/Andhra|VHT|irradiation|10.?13/i.test(normalized)) {
    throw new Error("[prerender] Banganapalli mango HTML missing FAQ/compliance content.");
  }
  if (/Exporting\s+Freshness/i.test(normalized)) {
    throw new Error(
      "[prerender] Banganapalli mango HTML still contains homepage hero. Wrong view captured."
    );
  }
  if (!/rel=["']canonical["']/i.test(html) || !/property=["']og:title["']/i.test(html)) {
    throw new Error("[prerender] Banganapalli mango HTML missing Helmet canonical / OG tags.");
  }
  const ldCompact = html.replace(/\s/g, "");
  if (!ldCompact.includes('"@type":"Service"')) {
    throw new Error("[prerender] Banganapalli mango HTML missing Service JSON-LD.");
  }
  if (!ldCompact.includes('"@type":"FAQPage"')) {
    throw new Error("[prerender] Banganapalli mango HTML missing FAQPage JSON-LD.");
  }
  if (!/<div id="root"[^>]*>[\s\S]{200,}<\/div>/i.test(html)) {
    throw new Error("[prerender] Banganapalli mango #root still looks empty after capture.");
  }
  assertSeoUrls(html, { pathSuffix: MANGO_PATH });
}

async function waitForMangoReady(page) {
  const deadline = Date.now() + 60_000;
  let last = null;
  while (Date.now() < deadline) {
    last = await page.evaluate((path) => {
      const root = document.getElementById("root");
      const bodyText = (root?.textContent || "").replace(/\u00a0/g, " ");
      const canonical =
        document.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
        "";
      const ld = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      )
        .map((s) => s.textContent || "")
        .join("");
      return {
        path: location.pathname,
        rootKids: root?.childElementCount ?? 0,
        hasTitle: /Banganapalli\s+Mangoes/i.test(bodyText),
        hasH2: /Where\s+our\s+mangoes\s+come\s+from/i.test(bodyText),
        hasHero: /Exporting\s+Freshness/i.test(bodyText),
        hasCanonical: canonical.includes(path),
        hasOg: Boolean(document.querySelector('meta[property="og:title"]')),
        hasProductLd: ld.includes('"Service"'),
        hasFaqLd: ld.includes('"FAQPage"'),
      };
    }, MANGO_PATH);
    if (
      last.rootKids > 0 &&
      last.hasTitle &&
      last.hasH2 &&
      !last.hasHero &&
      last.hasCanonical &&
      last.hasOg &&
      last.hasProductLd &&
      last.hasFaqLd
    ) {
      return;
    }
    await sleep(400);
  }
  console.error(
    "[prerender] Banganapalli mango ready state:",
    JSON.stringify(last, null, 2)
  );
  throw new Error(
    "[prerender] Timed out waiting for Banganapalli mango page + Helmet."
  );
}

/**
 * Never ship the temporary visibility override. `#root * { opacity: 1 !important }`
 * breaks LazyImage LQIP fade-out (blur stuck forever) and tanks scroll compositing.
 */
function assertNoPrerenderVisLeak(html, label = "capture") {
  if (/data-prerender-vis/i.test(html)) {
    throw new Error(
      `[prerender] ${label} HTML still contains data-prerender-vis — refusing to ship.`
    );
  }
  if (/#root\s*,\s*#root\s*\*[\s\S]*?opacity\s*:\s*1\s*!important/i.test(html)) {
    throw new Error(
      `[prerender] ${label} HTML still contains #root opacity:1 !important leak — refusing to ship.`
    );
  }
}

async function captureHtml(page) {
  // Optional in-capture visibility force for debugging asserts only — always removed
  // before page.content() so it never reaches dist/ or production.
  await page.evaluate(() => {
    document.querySelectorAll("style[data-prerender-vis]").forEach((n) => n.remove());
  });

  let html = await page.content();
  if (!/^<!doctype/i.test(html)) {
    html = `<!doctype html>\n${html}`;
  }
  html = html.endsWith("\n") ? html : `${html}\n`;
  assertNoPrerenderVisLeak(html);
  return html;
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

    const elapsedHome = ((Date.now() - t0) / 1000).toFixed(1);
    const beforeBytes = Buffer.byteLength(beforeHtml, "utf8");
    const afterBytes = Buffer.byteLength(html, "utf8");
    console.log(
      `[prerender] Wrote ${INDEX} (${beforeBytes} → ${afterBytes} bytes) in ${elapsedHome}s`
    );
    console.log(
      `[prerender] Shell snapshot saved at ${INDEX_BEFORE} for before/after compare`
    );

    // --- Privacy page (crawlable /privacy) ---
    console.log("[prerender] Starting /privacy capture…");
    const privacyUrl = new URL("/privacy", baseUrl).href;
    await page.goto(privacyUrl, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    await page.waitForSelector("#root > *", { timeout: 60_000 });
    await waitForPrivacyReady(page);

    const privacyHtml = await captureHtml(page);
    console.log(
      "[prerender] Privacy captured bytes:",
      Buffer.byteLength(privacyHtml, "utf8")
    );
    try {
      assertPrivacyHtml(privacyHtml);
    } catch (err) {
      await writeFile(
        path.join(DIST, "privacy.prerender-failed.html"),
        privacyHtml,
        "utf8"
      );
      throw err;
    }

    await mkdir(PRIVACY_DIR, { recursive: true });
    await writeFile(PRIVACY_INDEX, privacyHtml, "utf8");
    console.log(
      `[prerender] Wrote ${PRIVACY_INDEX} (${Buffer.byteLength(privacyHtml, "utf8")} bytes)`
    );

    // --- Guntur chilli product landing ---
    console.log(`[prerender] Starting ${GUNTUR_PATH} capture…`);
    const gunturUrl = new URL(GUNTUR_PATH, baseUrl).href;
    await page.goto(gunturUrl, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    await page.waitForSelector("#root > *", { timeout: 60_000 });
    await waitForGunturReady(page);

    const gunturHtml = await captureHtml(page);
    console.log(
      "[prerender] Guntur captured bytes:",
      Buffer.byteLength(gunturHtml, "utf8")
    );
    try {
      assertGunturHtml(gunturHtml);
    } catch (err) {
      await writeFile(
        path.join(DIST, "guntur.prerender-failed.html"),
        gunturHtml,
        "utf8"
      );
      throw err;
    }

    await mkdir(GUNTUR_DIR, { recursive: true });
    await writeFile(GUNTUR_INDEX, gunturHtml, "utf8");
    console.log(
      `[prerender] Wrote ${GUNTUR_INDEX} (${Buffer.byteLength(gunturHtml, "utf8")} bytes)`
    );

    // --- Indian apple product landing ---
    console.log(`[prerender] Starting ${APPLE_PATH} capture…`);
    const appleUrl = new URL(APPLE_PATH, baseUrl).href;
    await page.goto(appleUrl, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    await page.waitForSelector("#root > *", { timeout: 60_000 });
    await waitForAppleReady(page);

    const appleHtml = await captureHtml(page);
    console.log(
      "[prerender] Indian apple captured bytes:",
      Buffer.byteLength(appleHtml, "utf8")
    );
    try {
      assertAppleHtml(appleHtml);
    } catch (err) {
      await writeFile(
        path.join(DIST, "apple.prerender-failed.html"),
        appleHtml,
        "utf8"
      );
      throw err;
    }

    await mkdir(APPLE_DIR, { recursive: true });
    await writeFile(APPLE_INDEX, appleHtml, "utf8");
    console.log(
      `[prerender] Wrote ${APPLE_INDEX} (${Buffer.byteLength(appleHtml, "utf8")} bytes)`
    );

    // --- Indian pomegranate product landing ---
    console.log(`[prerender] Starting ${POM_PATH} capture…`);
    const pomUrl = new URL(POM_PATH, baseUrl).href;
    await page.goto(pomUrl, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    await page.waitForSelector("#root > *", { timeout: 60_000 });
    await waitForPomegranateReady(page);

    const pomHtml = await captureHtml(page);
    console.log(
      "[prerender] Indian pomegranate captured bytes:",
      Buffer.byteLength(pomHtml, "utf8")
    );
    try {
      assertPomegranateHtml(pomHtml);
    } catch (err) {
      await writeFile(
        path.join(DIST, "pomegranate.prerender-failed.html"),
        pomHtml,
        "utf8"
      );
      throw err;
    }

    await mkdir(POM_DIR, { recursive: true });
    await writeFile(POM_INDEX, pomHtml, "utf8");
    console.log(
      `[prerender] Wrote ${POM_INDEX} (${Buffer.byteLength(pomHtml, "utf8")} bytes)`
    );

    // --- Banganapalli mango product landing ---
    console.log(`[prerender] Starting ${MANGO_PATH} capture…`);
    const mangoUrl = new URL(MANGO_PATH, baseUrl).href;
    await page.goto(mangoUrl, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    await page.waitForSelector("#root > *", { timeout: 60_000 });
    await waitForMangoReady(page);

    const mangoHtml = await captureHtml(page);
    console.log(
      "[prerender] Banganapalli mango captured bytes:",
      Buffer.byteLength(mangoHtml, "utf8")
    );
    try {
      assertMangoHtml(mangoHtml);
    } catch (err) {
      await writeFile(
        path.join(DIST, "mango.prerender-failed.html"),
        mangoHtml,
        "utf8"
      );
      throw err;
    }

    await mkdir(MANGO_DIR, { recursive: true });
    await writeFile(MANGO_INDEX, mangoHtml, "utf8");
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(
      `[prerender] Wrote ${MANGO_INDEX} (${Buffer.byteLength(mangoHtml, "utf8")} bytes); total ${elapsed}s`
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
