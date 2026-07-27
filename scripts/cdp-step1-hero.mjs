/**
 * Step 1 verification: GSAP timing vs FP/FCP + Hero parallax transform sample.
 */
import { spawn } from "node:child_process";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";

const TARGET = process.argv[2] || "http://127.0.0.1:4173/";
const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9340;
const PROFILE = `${process.env.TEMP}\\mdf-step1-${randomUUID()}`;
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

async function main() {
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
      const start = Date.now();
      while (Date.now() - start < 35000) {
        if (buffer.some((e) => e.method === "Page.loadEventFired")) return;
        await sleep(50);
      }
    })();
    await send("Page.navigate", { url: TARGET });
    await loadP;
    await sleep(6000);

    const boot = await send("Runtime.evaluate", {
      returnByValue: true,
      expression: `(() => {
        const paints = Object.fromEntries(
          performance.getEntriesByType("paint").map((p) => [p.name, Math.round(p.startTime)])
        );
        const fp = paints["first-paint"] ?? null;
        const fcp = paints["first-contentful-paint"] ?? null;
        const res = performance.getEntriesByType("resource").map((r) => ({
          name: r.name.split("/").pop(),
          start: Math.round(r.startTime),
          transferKB: Math.round((r.transferSize || 0) / 1024),
        }));
        const gsap = res.filter((r) => /gsap/i.test(r.name));
        const beforeFp = gsap.filter((r) => fp != null && r.start < fp);
        const beforeFcp = gsap.filter((r) => fcp != null && r.start < fcp);
        return { fp, fcp, gsap, gsapBeforeFp: beforeFp, gsapBeforeFcp: beforeFcp };
      })()`,
    });

    // Sample Hero parallax: scroll and read transform on cinematic bg
    const parallax = await send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async () => {
        const section = document.querySelector("#top");
        const bg = section?.querySelector(".absolute.inset-0");
        if (!bg) return { ok: false, reason: "bg missing" };
        const read = () => {
          const t = getComputedStyle(bg).transform;
          return t;
        };
        const at0 = read();
        window.scrollTo(0, Math.round(window.innerHeight * 0.45));
        await new Promise((r) => setTimeout(r, 400));
        const atMid = read();
        window.scrollTo(0, 0);
        await new Promise((r) => setTimeout(r, 200));
        return { ok: true, at0, atMid, changed: at0 !== atMid };
      })()`,
    });

    console.log(
      JSON.stringify(
        {
          mode: "mobile Slow4G 4xCPU",
          boot: boot.result.value,
          parallax: parallax.result.value,
        },
        null,
        2
      )
    );

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
