import { spawn } from "node:child_process";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";

const PORT = 9346;
const PROFILE = `${process.env.TEMP}\\mdf-logo-chk-${randomUUID()}`;
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
      }, 30000);
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
  const loadP = (async () => {
    const s = Date.now();
    while (Date.now() - s < 20000) {
      if (buffer.some((e) => e.method === "Page.loadEventFired")) return;
      await sleep(50);
    }
  })();
  await send("Page.navigate", { url: "http://127.0.0.1:4173/" });
  await loadP;
  await sleep(2500);

  const dark = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const logos = performance.getEntriesByType("resource")
        .filter((r) => /LightPNG|DarkPNG|logo-(light|dark)/i.test(r.name))
        .map((r) => ({
          name: r.name.split("/").pop(),
          kb: +(r.transferSize / 1024).toFixed(1),
        }));
      const img = document.querySelector('a[aria-label] img');
      return {
        theme: document.documentElement.className,
        logos,
        navSrc: img?.currentSrc || img?.src || null,
        natural: img ? { w: img.naturalWidth, h: img.naturalHeight } : null,
      };
    })()`,
  });

  // Light theme + scrolled: Navbar stops inverting → dark mark on light glass.
  await send("Runtime.evaluate", {
    expression: `localStorage.setItem("mdf-theme", "light");`,
  });
  buffer.length = 0;
  const loadLight = (async () => {
    const s = Date.now();
    while (Date.now() - s < 20000) {
      if (buffer.some((e) => e.method === "Page.loadEventFired")) return;
      await sleep(50);
    }
  })();
  await send("Page.navigate", { url: "http://127.0.0.1:4173/" });
  await loadLight;
  await sleep(1500);
  await send("Runtime.evaluate", {
    expression: `window.scrollTo(0, 400);`,
  });
  await sleep(800);

  const lightScrolled = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const logos = performance.getEntriesByType("resource")
        .filter((r) => /LightPNG|DarkPNG|logo-(light|dark)/i.test(r.name))
        .map((r) => ({
          name: r.name.split("/").pop(),
          kb: +(r.transferSize / 1024).toFixed(1),
        }));
      const img = document.querySelector('a[aria-label] img');
      return {
        theme: document.documentElement.className,
        logos,
        navSrc: img?.currentSrc || img?.src || null,
        natural: img ? { w: img.naturalWidth, h: img.naturalHeight } : null,
      };
    })()`,
  });

  console.log(
    JSON.stringify(
      { darkHero: dark.result.value, lightScrolled: lightScrolled.result.value },
      null,
      2
    )
  );
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
