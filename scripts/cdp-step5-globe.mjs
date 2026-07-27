import { spawn } from "node:child_process";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";

const PORT = 9348;
const PROFILE = `${process.env.TEMP}\\mdf-step5-${randomUUID()}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJson = (p) =>
  new Promise((res, rej) => {
    http
      .get(`http://127.0.0.1:${PORT}${p}`, (r) => {
        let d = "";
        r.on("data", (c) => (d += c));
        r.on("end", () => res(JSON.parse(d)));
      })
      .on("error", rej);
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
    const m = JSON.parse(ev.data);
    if (m.id != null && pending.has(m.id)) {
      const { resolve, reject } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
    } else if (m.method) buffer.push(m);
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
    while (Date.now() - s < 35000) {
      if (buffer.some((e) => e.method === "Page.loadEventFired")) return;
      await sleep(50);
    }
  })();
  await send("Page.navigate", { url: "http://127.0.0.1:4173/" });
  await loadP;
  // Stay at top — Globe should not warm from eagerIdle anymore.
  await sleep(5000);

  const out = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const paints = Object.fromEntries(
        performance.getEntriesByType("paint").map((p) => [p.name, Math.round(p.startTime)])
      );
      const heavy = performance.getEntriesByType("resource")
        .filter((r) => /Globe|WorldMap|three|earth-blue|earth-topology/i.test(r.name))
        .map((r) => ({
          name: r.name.split("/").pop(),
          start: Math.round(r.startTime),
          kb: Math.round((r.transferSize || 0) / 1024),
        }));
      return { paints, heavyAtTop: heavy, load: Math.round(performance.getEntriesByType("navigation")[0]?.loadEventEnd || 0) };
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
