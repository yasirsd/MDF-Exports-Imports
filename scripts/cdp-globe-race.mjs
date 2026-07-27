/**
 * Reproduce fast-scroll race to #markets under Slow 4G + 4× CPU.
 */
import { spawn } from "node:child_process";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";

const TARGET = process.argv[2] || "http://127.0.0.1:4173/";
const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9351;
const PROFILE = `${process.env.TEMP}\\mdf-globe-race-${randomUUID()}`;
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
  CHROME,
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
      }, 90000);
    });
  };

  await send("Network.enable");
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2.625,
    mobile: true,
  });
  await send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    connectionType: "cellular4g",
  });
  await send("Emulation.setCPUThrottlingRate", { rate: 4 });

  const loadP = (async () => {
    const s = Date.now();
    while (Date.now() - s < 40000) {
      if (buffer.some((e) => e.method === "Page.loadEventFired")) return;
      await sleep(50);
    }
  })();
  await send("Page.navigate", { url: TARGET });
  await loadP;
  await sleep(1500);

  const result = await send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `(async () => {
      const sample = () => {
        const wrap = document.getElementById("markets");
        if (!wrap) {
          return { t: Math.round(performance.now()), state: "no-#markets" };
        }
        const html = wrap.innerHTML;
        const text = (wrap.innerText || "").replace(/\\s+/g, " ").trim().slice(0, 120);
        const childCount = wrap.childElementCount;
        const hasCanvas = !!wrap.querySelector("canvas");
        const imgs = Array.from(wrap.querySelectorAll("img")).map((img) => ({
          src: (img.currentSrc || img.src || "").split("/").pop(),
          complete: img.complete,
          natural: img.naturalWidth,
          opacity: getComputedStyle(img.closest("[aria-hidden], .absolute") || img).opacity,
        }));
        const slot = wrap.querySelector("[data-globe-slot]");
        const staticLayer = slot?.children?.[0];
        const liveLayer = slot?.children?.[1];
        const staticOpacity = staticLayer
          ? parseFloat(getComputedStyle(staticLayer).opacity)
          : null;
        const liveOpacity = liveLayer
          ? parseFloat(getComputedStyle(liveLayer).opacity)
          : null;
        const loadingCopy = /loading globe/i.test(text);
        const hasHeading = /Andhra Pradesh|Global Reach/i.test(text);
        const hasShell = !!wrap.querySelector("[data-globe-shell]");
        const hasSlot = !!wrap.querySelector("[data-globe-slot]");
        let state = "empty-placeholder";
        if (hasCanvas && liveOpacity > 0.5) state = "r3f-visible";
        else if (hasCanvas && staticOpacity > 0.5) state = "static-over-loading-canvas";
        else if (
          hasShell ||
          (imgs.some((i) => /earth/i.test(i.src)) &&
            (staticOpacity == null || staticOpacity > 0.2))
        )
          state = "static-earth-visible";
        else if (loadingCopy) state = "text-loading-globe";
        else if (hasHeading && childCount > 0) state = "worldmap-no-visual";
        else if (childCount === 0) state = "empty-placeholder";
        else state = "other";

        const canvas = wrap.querySelector("canvas");
        return {
          t: Math.round(performance.now()),
          state,
          childCount,
          hasHeading,
          hasShell,
          hasSlot,
          loadingCopy,
          hasCanvas,
          staticOpacity,
          liveOpacity,
          canvas: canvas
            ? { w: canvas.width, h: canvas.height, clientW: canvas.clientWidth }
            : null,
          imgs,
          textSnippet: text.slice(0, 90),
          htmlLen: html.length,
        };
      };

      const timeline = [];
      timeline.push({ phase: "at-top", ...sample() });

      // Simulate flick: force mount + hard jump (no smooth scroll).
      window.dispatchEvent(
        new CustomEvent("ut:ensure-section", { detail: { target: "#markets" } })
      );
      // Two rAFs so React can commit DeferMount ready state.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const el = document.getElementById("markets");
      const top =
        (el?.getBoundingClientRect().top || 0) +
        (window.scrollY || document.documentElement.scrollTop) -
        80;
      window.scrollTo(0, Math.max(0, top));
      timeline.push({ phase: "t+0-flick-arrive", ...sample() });

      const waits = [16, 34, 50, 100, 200, 400, 800, 1200, 2000, 3000, 5000];
      let elapsed = 0;
      for (const w of waits) {
        await new Promise((r) => setTimeout(r, w));
        elapsed += w;
        timeline.push({ phase: "t+" + elapsed + "ms", ...sample() });
      }

      const heavy = performance
        .getEntriesByType("resource")
        .filter((r) => /Globe|WorldMap|three|earth-blue|earth-topology/i.test(r.name))
        .map((r) => ({
          name: r.name.split("/").pop(),
          start: Math.round(r.startTime),
          kb: Math.round((r.transferSize || 0) / 1024),
        }));

      // Compact state sequence for the report
      const states = timeline.map((s) => s.phase + ":" + s.state);
      return { states, timeline, heavy };
    })()`,
  });

  console.log(JSON.stringify(result.result.value, null, 2));
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
