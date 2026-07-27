/**
 * Boot / LCP diagnosis against a running server (default localhost:5174).
 * Mobile Slow 4G + 4× CPU. Captures paints, LCP node, long tasks, resource timing.
 */
import { spawn } from "node:child_process";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";

const TARGET = process.argv[2] || "http://127.0.0.1:5174/";
const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const getJson = (port, path) =>
  new Promise((resolve, reject) => {
    http
      .get(`http://127.0.0.1:${port}${path}`, (res) => {
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
      }, 60000);
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

async function waitCdp(port) {
  for (let i = 0; i < 50; i++) {
    try {
      await getJson(port, "/json/version");
      return;
    } catch {
      await sleep(200);
    }
  }
  throw new Error("CDP not ready");
}

async function runProbe({ mobile, port }) {
  const profile = `${process.env.TEMP}\\mdf-boot-${randomUUID()}`;
  const chrome = spawn(
    CHROME,
    [
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      mobile ? "--window-size=390,844" : "--window-size=1440,900",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    await waitCdp(port);
    const tabs = await getJson(port, "/json/list");
    const page = tabs.find((t) => t.type === "page") || tabs[0];
    const cdp = new CdpClient(page.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send("Network.enable");
    await cdp.send("Page.enable");
    await cdp.send("Performance.enable");
    await cdp.send("DOM.enable");
    await cdp.send("Runtime.enable");

    if (mobile) {
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
    } else {
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      });
    }

    // Inject observers before navigation
    await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `
        window.__bootDiag = {
          longTasks: [],
          lcp: null,
          paints: {},
          marks: [],
        };
        try {
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) {
              window.__bootDiag.longTasks.push({
                start: Math.round(e.startTime),
                duration: Math.round(e.duration),
                name: e.name,
              });
            }
          }).observe({ type: "longtask", buffered: true });
        } catch (e) {}
        try {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const last = entries[entries.length - 1];
            if (!last) return;
            const el = last.element;
            let desc = null;
            if (el) {
              const tag = el.tagName?.toLowerCase() || "?";
              const id = el.id ? "#" + el.id : "";
              const cls = el.className && typeof el.className === "string"
                ? "." + el.className.trim().split(/\\s+/).slice(0, 3).join(".")
                : "";
              const src = el.currentSrc || el.src || el.getAttribute?.("src") || null;
              const text = (el.textContent || "").trim().slice(0, 80);
              desc = { tag, id, cls, src, text, outer: el.outerHTML?.slice(0, 220) };
            }
            window.__bootDiag.lcp = {
              startTime: Math.round(last.startTime),
              size: last.size,
              url: last.url || null,
              element: desc,
            };
          }).observe({ type: "largest-contentful-paint", buffered: true });
        } catch (e) {}
        try {
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) {
              window.__bootDiag.paints[e.name] = Math.round(e.startTime);
            }
          }).observe({ type: "paint", buffered: true });
        } catch (e) {}
      `,
    });

    const loadP = (async () => {
      const start = Date.now();
      while (Date.now() - start < 40000) {
        if (cdp.buffer.some((e) => e.method === "Page.loadEventFired")) return;
        await sleep(50);
      }
    })();

    await cdp.send("Page.navigate", { url: TARGET });
    await loadP;
    await sleep(mobile ? 7000 : 3500);

    const result = await cdp.send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `(() => {
        const nav = performance.getEntriesByType("navigation")[0];
        const resources = performance.getEntriesByType("resource").map((r) => ({
          name: r.name.split("/").pop().split("?")[0],
          full: r.name,
          start: Math.round(r.startTime),
          duration: Math.round(r.duration),
          transfer: r.transferSize || 0,
          encoded: r.encodedBodySize || 0,
          initiator: r.initiatorType,
        }));
        const fcp = window.__bootDiag.paints["first-contentful-paint"]
          ?? Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime || 0);
        const beforeFcp = resources
          .filter((r) => r.start < fcp)
          .sort((a, b) => a.start - b.start);
        const gsapHits = resources.filter((r) => /gsap|ScrollTrigger|lenis|Globe|three|WorldMap/i.test(r.full));
        return {
          mode: ${JSON.stringify(mobile ? "mobile Slow4G 4xCPU" : "desktop unthrottled")},
          url: location.href,
          timing: nav ? {
            ttfb: Math.round(nav.responseStart - nav.startTime),
            dcl: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
            load: Math.round(nav.loadEventEnd - nav.startTime),
          } : null,
          paints: window.__bootDiag.paints,
          lcp: window.__bootDiag.lcp,
          longTasksBeforeFcp: window.__bootDiag.longTasks.filter((t) => t.start < fcp),
          longTasksAll: window.__bootDiag.longTasks.slice(0, 40),
          resourcesBeforeFcp: beforeFcp,
          heavyLibs: gsapHits,
          fcp,
        };
      })()`,
    });

    cdp.close();
    return result.result.value;
  } finally {
    chrome.kill();
    await sleep(400);
    try {
      rmSync(profile, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

const desktop = await runProbe({ mobile: false, port: 9335 });
console.log(JSON.stringify({ desktop }, null, 2));
await sleep(800);
const mobile = await runProbe({ mobile: true, port: 9336 });
console.log(JSON.stringify({ mobile }, null, 2));
