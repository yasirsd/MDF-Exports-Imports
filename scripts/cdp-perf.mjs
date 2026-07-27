/**
 * Chrome CDP lab probe — mobile viewport, Slow 4G, 4× CPU.
 * No npm dependencies (requires Node with global WebSocket).
 */
import { spawn } from "node:child_process";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";

const TARGET = process.argv[2] || "http://127.0.0.1:4173/";
const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9333;
const PROFILE = `${process.env.TEMP}\\mdf-chrome-profile-${randomUUID()}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getJson(path) {
  return new Promise((resolve, reject) => {
    http
      .get(`http://127.0.0.1:${PORT}${path}`, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 0;
    this.pending = new Map();
    this.buffer = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.addEventListener("open", () => resolve());
      this.ws.addEventListener("error", (e) => reject(e));
      this.ws.addEventListener("message", (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.id != null && this.pending.has(msg.id)) {
          const { resolve: res, reject: rej } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) rej(new Error(JSON.stringify(msg.error)));
          else res(msg.result);
        } else if (msg.method) {
          this.buffer.push(msg);
        }
      });
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`Timeout: ${method}`));
        }
      }, 45000);
    });
  }

  waitEvent(method, timeoutMs = 30000) {
    const start = Date.now();
    return new Promise(async (resolve, reject) => {
      while (Date.now() - start < timeoutMs) {
        const hit = this.buffer.find((e) => e.method === method);
        if (hit) return resolve(hit);
        await sleep(50);
      }
      reject(new Error(`Event timeout: ${method}`));
    });
  }

  close() {
    try {
      this.ws.close();
    } catch {
      /* ignore */
    }
  }
}

async function waitCdp(tries = 50) {
  for (let i = 0; i < tries; i++) {
    try {
      await getJson("/json/version");
      return;
    } catch {
      await sleep(200);
    }
  }
  throw new Error("Chrome CDP not ready");
}

async function main() {
  if (typeof WebSocket === "undefined") {
    throw new Error("Global WebSocket missing — use Node 22+");
  }

  const chrome = spawn(
    CHROME,
    [
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${PROFILE}`,
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--window-size=390,844",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    await waitCdp();
    const tabs = await getJson("/json/list");
    const page = tabs.find((t) => t.type === "page") || tabs[0];
    const cdp = new CdpClient(page.webSocketDebuggerUrl);
    await cdp.connect();

    const transfers = new Map();

    // Tap network via periodic drain of buffer after enabling
    await cdp.send("Network.enable");
    await cdp.send("Page.enable");
    await cdp.send("Performance.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2.625,
      mobile: true,
    });
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      connectionType: "cellular4g",
    });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

    const navPromise = cdp.waitEvent("Page.loadEventFired", 35000);
    await cdp.send("Page.navigate", { url: TARGET });
    await navPromise;
    await sleep(4000);

    // Collect network sizes from buffered events
    for (const ev of cdp.buffer) {
      if (ev.method === "Network.requestWillBeSent") {
        transfers.set(ev.params.requestId, {
          url: ev.params.request.url,
          encoded: 0,
        });
      }
      if (ev.method === "Network.loadingFinished") {
        const row = transfers.get(ev.params.requestId);
        if (row) row.encoded = ev.params.encodedDataLength || 0;
      }
    }

    const metrics = await cdp.send("Performance.getMetrics");
    const metricMap = Object.fromEntries(metrics.metrics.map((m) => [m.name, m.value]));

    const perf = await cdp.send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const paints = performance.getEntriesByType('paint');
        const resources = performance.getEntriesByType('resource').map(r => ({
          name: r.name,
          transferSize: r.transferSize,
          encodedBodySize: r.encodedBodySize,
          duration: Math.round(r.duration),
          initiatorType: r.initiatorType
        }));
        return {
          timing: nav ? {
            ttfb: Math.round(nav.responseStart - nav.startTime),
            responseStart: Math.round(nav.responseStart),
            domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
            load: Math.round(nav.loadEventEnd - nav.startTime)
          } : null,
          paints: Object.fromEntries(paints.map(p => [p.name, Math.round(p.startTime)])),
          resources,
          jsHeap: performance.memory ? performance.memory.usedJSHeapSize : null
        };
      })()`,
    });

    const lcp = await cdp.send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `new Promise((resolve) => {
        let last = null;
        try {
          const po = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            last = entries[entries.length - 1] || last;
          });
          po.observe({ type: 'largest-contentful-paint', buffered: true });
          setTimeout(() => {
            po.disconnect();
            resolve(last ? {
              startTime: Math.round(last.startTime),
              size: last.size,
              url: last.url || null
            } : null);
          }, 800);
        } catch (e) {
          resolve({ error: String(e) });
        }
      })`,
    });

    const resources = perf.result?.value?.resources || [];
    const jsResources = resources.filter(
      (r) => r.name.includes("/assets/") && r.name.endsWith(".js")
    );
    const cssResources = resources.filter((r) => r.name.endsWith(".css"));
    const imgResources = resources.filter((r) =>
      /\.(jpg|jpeg|webp|png|svg|woff2)/i.test(r.name)
    );
    const sum = (arr, key) => arr.reduce((a, b) => a + (b[key] || 0), 0);

    const encodedList = [...transfers.values()];
    const report = {
      url: TARGET,
      mode: "CDP lab · mobile 390×844 · Slow 4G · 4× CPU",
      navigation: perf.result?.value?.timing,
      paints: perf.result?.value?.paints,
      lcp: lcp.result?.value,
      chromeMetrics: {
        TaskDuration: metricMap.TaskDuration,
        ScriptDuration: metricMap.ScriptDuration,
        LayoutCount: metricMap.LayoutCount,
        RecalcStyleCount: metricMap.RecalcStyleCount,
        JSHeapUsedSize: metricMap.JSHeapUsedSize,
      },
      bytes: {
        jsTransferKB: Math.round((sum(jsResources, "transferSize") / 1024) * 10) / 10,
        cssTransferKB: Math.round((sum(cssResources, "transferSize") / 1024) * 10) / 10,
        mediaTransferKB:
          Math.round((sum(imgResources, "transferSize") / 1024) * 10) / 10,
        allResourceTransferKB:
          Math.round((sum(resources, "transferSize") / 1024) * 10) / 10,
        networkEncodedKB:
          Math.round(
            (encodedList.reduce((a, b) => a + (b.encoded || 0), 0) / 1024) * 10
          ) / 10,
      },
      topJs: jsResources
        .sort((a, b) => b.transferSize - a.transferSize)
        .slice(0, 10)
        .map((r) => ({
          name: r.name.split("/").pop(),
          transferKB: Math.round((r.transferSize / 1024) * 10) / 10,
          ms: r.duration,
        })),
      topMedia: imgResources
        .sort((a, b) => b.transferSize - a.transferSize)
        .slice(0, 8)
        .map((r) => ({
          name: r.name.split("/").pop(),
          transferKB: Math.round((r.transferSize / 1024) * 10) / 10,
        })),
      jsHeapMB: perf.result?.value?.jsHeap
        ? Math.round((perf.result.value.jsHeap / 1024 / 1024) * 10) / 10
        : null,
    };

    console.log(JSON.stringify(report, null, 2));
    cdp.close();
  } finally {
    try {
      chrome.kill();
    } catch {
      /* ignore */
    }
    await sleep(400);
    try {
      rmSync(PROFILE, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

main().catch((err) => {
  console.error(JSON.stringify({ error: String(err?.stack || err) }));
  process.exit(1);
});
