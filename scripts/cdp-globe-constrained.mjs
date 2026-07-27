/**
 * Confirm constrained (saveData / 3g) path keeps StaticGlobe and never mounts R3F.
 */
import { spawn } from "node:child_process";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";

const TARGET = process.argv[2] || "http://127.0.0.1:4173/";
const PORT = 9352;
const PROFILE = `${process.env.TEMP}\\mdf-globe-constrained-${randomUUID()}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJson = (path) =>
  new Promise((resolve, reject) => {
    http
      .get(`http://127.0.0.1:${PORT}${path}`, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", reject);
  });

const chrome = spawn(
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--window-size=390,844",
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
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
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
      }, 60000);
    });
  };

  await send("Network.enable");
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      Object.defineProperty(Navigator.prototype, "connection", {
        configurable: true,
        get() {
          return { saveData: true, effectiveType: "3g", downlink: 0.4, rtt: 600 };
        },
      });
    `,
  });
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2.625,
    mobile: true,
  });

  const loadP = (async () => {
    const s = Date.now();
    while (Date.now() - s < 30000) {
      if (buffer.some((e) => e.method === "Page.loadEventFired")) return;
      await sleep(50);
    }
  })();
  await send("Page.navigate", { url: TARGET });
  await loadP;
  await sleep(800);

  const out = await send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `(async () => {
      window.dispatchEvent(
        new CustomEvent("ut:ensure-section", { detail: { target: "#markets" } })
      );
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      document.getElementById("markets")?.scrollIntoView({ block: "center" });
      await new Promise((r) => setTimeout(r, 4000));
      const wrap = document.getElementById("markets");
      const heavy = performance
        .getEntriesByType("resource")
        .filter((r) => /Globe-|three|earth-topology/i.test(r.name))
        .map((r) => r.name.split("/").pop());
      return {
        connection: {
          saveData: navigator.connection?.saveData,
          effectiveType: navigator.connection?.effectiveType,
        },
        hasStaticEarth: !!wrap?.querySelector('img[src*="earth-blue-marble"]'),
        hasCanvas: !!wrap?.querySelector("canvas"),
        hasShellOrSlot: !!(
          wrap?.querySelector("[data-globe-shell]") ||
          wrap?.querySelector("[data-globe-slot]")
        ),
        globeChunkLoaded: heavy.some((n) => /Globe-/.test(n)),
        heavy,
      };
    })()`,
  });

  console.log(JSON.stringify(out.result.value, null, 2));
  ws.close();
} finally {
  chrome.kill();
  await sleep(200);
  try {
    rmSync(PROFILE, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}
