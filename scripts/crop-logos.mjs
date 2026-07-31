/**
 * Lossless-ish crop: decode source logos in Chromium, crop by ink bbox (pixel copy),
 * write tight PNGs. Prefers .webp masters when present (pre-crop originals).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PAD_RATIO = 0.04;

const JOBS = [
  {
    out: "src/images/LightPNG.png",
    masters: ["src/images/LightPNG.webp", "src/images/LightPNG.png"],
    mime: { webp: "image/webp", png: "image/png" },
  },
  {
    out: "src/images/DarkPNG.png",
    masters: ["src/images/DarkPNG.webp", "src/images/DarkPNG.png"],
    mime: { webp: "image/webp", png: "image/png" },
  },
];

function pickMaster(job) {
  for (const rel of job.masters) {
    const abs = resolve(root, rel);
    if (!existsSync(abs)) continue;
    const ext = rel.endsWith(".webp") ? "webp" : "png";
    return { abs, mime: job.mime[ext], rel };
  }
  throw new Error(`No master found for ${job.out}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const job of JOBS) {
    const master = pickMaster(job);
    const buf = readFileSync(master.abs);
    const dataUrl = `data:${master.mime};base64,${buf.toString("base64")}`;

    const result = await page.evaluate(
      async ({ dataUrl, padRatio }) => {
        const img = new Image();
        img.src = dataUrl;
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = () => rej(new Error("image load failed"));
        });

        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0);
        const { data } = ctx.getImageData(0, 0, w, h);

        let minX = w;
        let minY = h;
        let maxX = -1;
        let maxY = -1;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const a = data[i + 3];
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (a < 10) continue;
            if (r > 245 && g > 245 && b > 245) continue;
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
        if (maxX < 0) throw new Error("no ink");

        const cw = maxX - minX + 1;
        const ch = maxY - minY + 1;
        const pad = Math.ceil(Math.max(cw, ch) * padRatio);
        const x0 = Math.max(0, minX - pad);
        const y0 = Math.max(0, minY - pad);
        const x1 = Math.min(w - 1, maxX + pad);
        const y1 = Math.min(h - 1, maxY + pad);
        const outW = x1 - x0 + 1;
        const outH = y1 - y0 + 1;

        // Pixel-exact crop: copy getImageData → putImageData (no resample)
        const crop = ctx.getImageData(x0, y0, outW, outH);
        const out = document.createElement("canvas");
        out.width = outW;
        out.height = outH;
        const octx = out.getContext("2d");
        octx.putImageData(crop, 0, 0);

        const blob = await new Promise((res) => out.toBlob(res, "image/png"));
        if (!blob) throw new Error("toBlob failed");
        const ab = await blob.arrayBuffer();
        const bytes = new Uint8Array(ab);
        let bin = "";
        for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        return {
          b64: btoa(bin),
          outW,
          outH,
          source: `${w}x${h}`,
          ink: `${cw}x${ch}`,
          pad,
        };
      },
      { dataUrl, padRatio: PAD_RATIO }
    );

    const outPath = resolve(root, job.out);
    writeFileSync(outPath, Buffer.from(result.b64, "base64"));
    console.log(
      `${job.out}: ${master.rel} ${result.source} → ${result.outW}x${result.outH} (ink ${result.ink}, pad ${result.pad}) · ${(Buffer.from(result.b64, "base64").length / 1024).toFixed(1)} KB`
    );
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
