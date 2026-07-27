/**
 * Step 2: LCP element + timing (desktop unthrottled + mobile Slow4G 4×CPU).
 */
import { spawn } from "node:child_process";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";

const TARGET = process.argv[2] || "http://127.0.0.1:4173/";
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
        res.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", reject);
  });

async function probe({ mobile, port }) {
  const profile = `${process.env.TEMP}\\mdf-step2-${randomUUID()}`;
  const chrome = spawn(
    CHROME,
    [
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      mobile ? "--window-size=390,844" : "--window-size=1440,900",
      "about:blank",
    ],
    { stdio: "ignore" }
  );

  try {
    for (let i = 0; i < 40; i++) {
      try {
        await getJson(port, "/json/version");
        break;
      } catch {
        await sleep(200);
      }
    }
    const tabs = await getJson(port, "/json/list");
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
        }, 45000);
      });
    };

    await send("Network.enable");
    await send("Page.enable");
    await send("Page.addScriptToEvaluateOnNewDocument", {
      source: `
        window.__lcp = null;
        try {
          new PerformanceObserver((list) => {
            const last = list.getEntries().at(-1);
            if (!last) return;
            const el = last.element;
            let desc = null;
            if (el) {
              desc = {
                tag: el.tagName?.toLowerCase(),
                cls: typeof el.className === "string"
                  ? el.className.trim().split(/\\s+/).slice(0, 4).join(".")
                  : "",
                src: el.currentSrc || el.src || null,
                text: (el.textContent || "").trim().slice(0, 90),
              };
            }
            window.__lcp = {
              startTime: Math.round(last.startTime),
              size: last.size,
              url: last.url || null,
              element: desc,
            };
          }).observe({ type: "largest-contentful-paint", buffered: true });
        } catch (e) {}
      `,
    });

    if (mobile) {
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
    } else {
      await send("Emulation.setDeviceMetricsOverride", {
        width: 1440,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      });
    }

    const loadP = (async () => {
      const start = Date.now();
      while (Date.now() - start < 35000) {
        if (buffer.some((e) => e.method === "Page.loadEventFired")) return;
        await sleep(50);
      }
    })();
    await send("Page.navigate", { url: TARGET });
    await loadP;
    await sleep(mobile ? 7000 : 3500);

    const out = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const paints = Object.fromEntries(
          performance.getEntriesByType("paint").map((p) => [p.name, Math.round(p.startTime)])
        );
        return {
          mode: ${JSON.stringify(mobile ? "mobile Slow4G 4xCPU" : "desktop unthrottled")},
          paints,
          lcp: window.__lcp,
        };
      })()`,
    });

    ws.close();
    return out.result.value;
  } finally {
    chrome.kill();
    await sleep(300);
    try {
      rmSync(profile, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

const desktop = await probe({ mobile: false, port: 9341 });
console.log(JSON.stringify(desktop, null, 2));
await sleep(600);
const mobile = await probe({ mobile: true, port: 9342 });
console.log(JSON.stringify(mobile, null, 2));
