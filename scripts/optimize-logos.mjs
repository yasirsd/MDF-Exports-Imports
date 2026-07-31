/**
 * Resize brand marks via headless Chrome canvas → PNG.
 * Optional helper: the site imports src/images/*PNG.png directly.
 * Outputs density variants under public/brand/ if you need static URLs.
 */
import { spawn } from "node:child_process";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9345;
const PROFILE = `${process.env.TEMP}\\mdf-logo-${randomUUID()}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getJson(path) {
  return new Promise((resolveP, reject) => {
    http
      .get(`http://127.0.0.1:${PORT}${path}`, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolveP(JSON.parse(data)));
      })
      .on("error", reject);
  });
}

const JOBS = [
  { src: "src/images/LightPNG.png", out: "logo-light", widths: [220, 440, 880] },
  { src: "src/images/DarkPNG.png", out: "logo-dark", widths: [220, 440, 880] },
];

async function main() {
  mkdirSync(resolve(root, "public/brand"), { recursive: true });

  const chrome = spawn(
    CHROME,
    [
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${PROFILE}`,
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    for (let i = 0; i < 40; i++) {
      try {
        await getJson("/json/version");
        break;
      } catch {
        await sleep(200);
      }
    }
    const tabs = await getJson("/json/list");
    const page = tabs.find((t) => t.type === "page") || tabs[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.addEventListener("open", res);
      ws.addEventListener("error", rej);
    });
    let id = 0;
    const pending = new Map();
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id != null && pending.has(msg.id)) {
        const { resolve: r, reject: j } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? j(new Error(JSON.stringify(msg.error))) : r(msg.result);
      }
    });
    const send = (method, params = {}) => {
      const i = ++id;
      ws.send(JSON.stringify({ id: i, method, params }));
      return new Promise((resolveP, reject) => {
        pending.set(i, { resolve: resolveP, reject });
        setTimeout(() => {
          if (pending.has(i)) {
            pending.delete(i);
            reject(new Error(method));
          }
        }, 60000);
      });
    };

    await send("Runtime.enable");
    await send("Page.enable");

    for (const job of JOBS) {
      const abs = resolve(root, job.src);
      const buf = readFileSync(abs);
      const dataUrl = `data:image/png;base64,${buf.toString("base64")}`;

      for (const width of job.widths) {
        const result = await send("Runtime.evaluate", {
          awaitPromise: true,
          returnByValue: true,
          expression: `(async () => {
            const img = new Image();
            img.src = ${JSON.stringify(dataUrl)};
            await new Promise((res, rej) => {
              img.onload = res;
              img.onerror = rej;
            });
            const ratio = img.naturalHeight / img.naturalWidth;
            const w = ${width};
            const h = Math.max(1, Math.round(w * ratio));
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(img, 0, 0, w, h);
            const blob = await new Promise((res) =>
              canvas.toBlob(res, "image/png")
            );
            if (!blob) throw new Error("toBlob failed");
            const ab = await blob.arrayBuffer();
            const bytes = new Uint8Array(ab);
            let bin = "";
            for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
            return { b64: btoa(bin), w, h, bytes: bytes.length };
          })()`,
        });

        const { b64, w, h, bytes } = result.result.value;
        const outName = `${job.out}-${width}w.png`;
        const outPath = resolve(root, "public/brand", outName);
        writeFileSync(outPath, Buffer.from(b64, "base64"));
        console.log(
          `${outName}: ${w}x${h} · ${(bytes / 1024).toFixed(1)} KB`
        );
      }
    }

    ws.close();
  } finally {
    chrome.kill();
    await sleep(300);
    try {
      rmSync(PROFILE, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
