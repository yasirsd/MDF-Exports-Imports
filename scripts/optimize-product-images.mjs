/**
 * Pre-generate responsive product/gallery/scene image variants.
 *
 * Reads first-party JPEG/PNG masters from src/images/, produces srcset-ready
 * variants under public/products/ at 480/768/1200/1600 widths in JPG + WebP,
 * plus a 32px LQ placeholder. Also runs the palm-sized brand logo PNGs
 * through basic optimisation (strips metadata, re-encodes).
 *
 *   node scripts/optimize-product-images.mjs
 *
 * The output filenames mirror the existing public/media/ pattern
 * (slug-<width>.<ext>) so images.js can serve them via localPath() with a
 * proper srcset — the browser downloads only the size that fits the viewport.
 */
import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname, join, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = join(root, "src/images");
const OUT_DIR = join(root, "public/products");

/** Widths we ship. Matches unsplashSrcSet defaults so the responsive markup
 *  can be identical for local and remote images. */
const WIDTHS = [480, 768, 1200, 1600];
/** Placeholder for LazyImage's LQIP blur. */
const LQ_WIDTH = 32;

const JPG_QUALITY = 78;
const WEBP_QUALITY = 72;
const PNG_QUALITY = 82;

/** Map source filename → output slug. Slugs feed images.js LOCAL_MEDIA keys. */
const SLUGS = {
  "MangoLot.jpeg": "mango-lot",
  "mangoCrop.jpeg": "mango-crop",
  "KinnaurAppleCloseUp1.jpeg": "apple-closeup-1",
  "KinnaurAppleCloseUp2.jpeg": "apple-closeup-2",
  "AppleColdStorage.jpeg": "apple-cold-storage",
  "pomegranateLot.jpeg": "pomegranate-lot",
  "orangeLot.jpeg": "orange-lot",
};

async function processImage(srcName, slug) {
  const srcPath = join(SRC_DIR, srcName);
  if (!existsSync(srcPath)) {
    console.warn(`[skip] source missing: ${srcName}`);
    return null;
  }
  const meta = await sharp(srcPath).metadata();
  const srcBytes = (await stat(srcPath)).size;
  const results = [];

  // Full-size variants
  for (const w of WIDTHS) {
    if (w >= (meta.width || 0) * 1.05) {
      // Skip upscaling above the source's native width by more than 5%.
      continue;
    }
    // JPEG
    const jpg = join(OUT_DIR, `${slug}-${w}.jpg`);
    await sharp(srcPath)
      .rotate() // respect EXIF orientation
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: JPG_QUALITY, mozjpeg: true, progressive: true })
      .toFile(jpg);
    // WebP
    const webp = join(OUT_DIR, `${slug}-${w}.webp`);
    await sharp(srcPath)
      .rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(webp);
    results.push({ w, jpg: (await stat(jpg)).size, webp: (await stat(webp)).size });
  }

  // LQ placeholder (heavy blur post-decode via CSS)
  const lqPath = join(OUT_DIR, `${slug}-lq.jpg`);
  await sharp(srcPath)
    .rotate()
    .resize({ width: LQ_WIDTH })
    .blur(1.2)
    .jpeg({ quality: 40 })
    .toFile(lqPath);
  results.push({ w: LQ_WIDTH, jpg: (await stat(lqPath)).size, webp: null });

  const totalOut = results.reduce((s, r) => s + (r.jpg || 0) + (r.webp || 0), 0);
  const savedPct = ((srcBytes - totalOut) / srcBytes) * 100;
  return {
    slug,
    src: srcName,
    srcW: meta.width,
    srcKB: Math.round(srcBytes / 1024),
    variants: results.length,
    outKB: Math.round(totalOut / 1024),
    savedPct: savedPct >= 0 ? `-${Math.round(savedPct)}%` : `+${Math.round(-savedPct)}%`,
  };
}

async function optimizeLogos() {
  // Re-encode the brand PNGs to strip metadata and apply lossless-ish compression.
  const jobs = [
    { file: "LightPNG.png", out: "logo-light" },
    { file: "DarkPNG.png", out: "logo-dark" },
  ];
  const results = [];
  for (const { file, out } of jobs) {
    const srcPath = join(SRC_DIR, file);
    if (!existsSync(srcPath)) continue;
    const outPath = join(OUT_DIR, `${out}.png`);
    const meta = await sharp(srcPath).metadata();
    const srcBytes = (await stat(srcPath)).size;
    await sharp(srcPath)
      .png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true })
      .toFile(outPath);
    const outBytes = (await stat(outPath)).size;
    results.push({
      logo: out,
      srcKB: Math.round(srcBytes / 1024),
      outKB: Math.round(outBytes / 1024),
      savedPct: `-${Math.round(((srcBytes - outBytes) / srcBytes) * 100)}%`,
      dims: `${meta.width}×${meta.height}`,
    });
  }
  return results;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const entries = await readdir(SRC_DIR);
  console.log(
    `[optimize] Source images in src/images/: ${entries.length}. Output → public/products/`
  );

  const reports = [];
  for (const [srcName, slug] of Object.entries(SLUGS)) {
    if (!entries.includes(srcName)) continue;
    const r = await processImage(srcName, slug);
    if (r) reports.push(r);
    console.log(
      `  ${r.slug.padEnd(20)} ${String(r.srcKB).padStart(6)} KB (${r.srcW}px)` +
        ` → ${String(r.outKB).padStart(5)} KB across ${r.variants} variants  ${r.savedPct}`
    );
  }

  const logos = await optimizeLogos();
  for (const l of logos) {
    console.log(
      `  ${l.logo.padEnd(20)} ${String(l.srcKB).padStart(6)} KB (${l.dims})` +
        ` → ${String(l.outKB).padStart(5)} KB  ${l.savedPct}`
    );
  }

  const totalIn = reports.reduce((s, r) => s + r.srcKB, 0) +
    logos.reduce((s, l) => s + l.srcKB, 0);
  const totalOut = reports.reduce((s, r) => s + r.outKB, 0) +
    logos.reduce((s, l) => s + l.outKB, 0);
  console.log(
    `\n[optimize] Totals: ${totalIn} KB in → ${totalOut} KB out ` +
      `(saved ${Math.round(((totalIn - totalOut) / totalIn) * 100)}%)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
