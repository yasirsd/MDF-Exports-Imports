/**
 * Verify Export Process horizontal scrub under Lenis + ScrollTrigger.
 */
import { spawn } from "node:child_process";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";

const TARGET = "http://127.0.0.1:4173/";
const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9335;
const PROFILE = `${process.env.TEMP}\\mdf-process-${randomUUID()}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getJson(path) {
  return new Promise((resolve, reject) => {
    http
      .get(`http://127.0.0.1:${PORT}${path}`, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", reject);
  });
}

async function main() {
  const chrome = spawn(
    CHROME,
    [
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${PROFILE}`,
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--window-size=1440,900",
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
    const buffer = [];
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id != null && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method) buffer.push(msg);
    });

    const send = (method, params = {}) => {
      const i = ++id;
      ws.send(JSON.stringify({ id: i, method, params }));
      return new Promise((resolve, reject) => {
        pending.set(i, { resolve, reject });
        setTimeout(() => {
          if (pending.has(i)) {
            pending.delete(i);
            reject(new Error(method));
          }
        }, 45000);
      });
    };

    await send("Page.enable");
    await send("Runtime.enable");
    const loadP = (async () => {
      const start = Date.now();
      while (Date.now() - start < 30000) {
        if (buffer.some((e) => e.method === "Page.loadEventFired")) return;
        await sleep(50);
      }
    })();
    await send("Page.navigate", { url: TARGET });
    await loadP;
    await sleep(3500);

    const result = await send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async () => {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        for (const id of ['story', 'products', 'about', 'why', 'process']) {
          window.dispatchEvent(new CustomEvent('ut:ensure-section', { detail: { target: '#' + id } }));
        }
        await sleep(2500);
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new CustomEvent('ut:media-loaded'));
        await sleep(800);

        const root = document.getElementById('process');
        const track = root?.querySelector('.will-change-transform');
        if (!track) return { ok: false, error: 'no track' };

        const spacer = [...document.querySelectorAll('.pin-spacer')].find((s) => s.contains(track));
        if (!spacer) return { ok: false, error: 'no process pin-spacer', pinCount: document.querySelectorAll('.pin-spacer').length };

        const top = spacer.getBoundingClientRect().top + window.scrollY;
        const height = spacer.getBoundingClientRect().height;

        const samples = [];
        for (const p of [0.05, 0.35, 0.65, 0.95]) {
          window.scrollTo({ top: top + height * p, behavior: 'instant' });
          window.dispatchEvent(new Event('scroll'));
          await sleep(250);
          const transform = getComputedStyle(track).transform;
          const x = (!transform || transform === 'none') ? 0 : new DOMMatrixReadOnly(transform).m41;
          samples.push({
            p,
            scrollY: Math.round(window.scrollY),
            x: Math.round(x),
            style: track.getAttribute('style') || '',
          });
        }

        return {
          ok: samples.some((s) => Math.abs(s.x) > 80),
          contentVisibility: getComputedStyle(root).contentVisibility,
          spacerTop: Math.round(top),
          spacerHeight: Math.round(height),
          trackScrollWidth: track.scrollWidth,
          samples,
        };
      })()`,
    });

    console.log(JSON.stringify(result.result?.value ?? result, null, 2));
    ws.close();
  } finally {
    try {
      chrome.kill();
    } catch {
      /* ignore */
    }
    await sleep(300);
    try {
      rmSync(PROFILE, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

main().catch((e) => {
  console.error(JSON.stringify({ error: String(e?.stack || e) }));
  process.exit(1);
});
