import { spawn } from "node:child_process";
import http from "node:http";
import { randomUUID } from "node:crypto";
import { rmSync } from "node:fs";
const PORT = 9334;
const PROFILE = `${process.env.TEMP}\\mdf-chrome-d-${randomUUID()}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const getJson = (path) => new Promise((resolve, reject) => {
  http.get(`http://127.0.0.1:${PORT}${path}`, (res) => {
    let data = ""; res.on("data", c => data += c); res.on("end", () => resolve(JSON.parse(data)));
  }).on("error", reject);
});
const chrome = spawn("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", [
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, "--headless=new", "--disable-gpu",
  "--no-first-run", "--window-size=1440,900", "about:blank"
], { stdio: "ignore" });
for (let i = 0; i < 40; i++) { try { await getJson("/json/version"); break; } catch { await sleep(200); } }
const tabs = await getJson("/json/list");
const page = tabs.find(t => t.type === "page") || tabs[0];
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.addEventListener("open", res); ws.addEventListener("error", rej); });
let id = 0; const pending = new Map(); const buffer = [];
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id != null && pending.has(msg.id)) { const {resolve,reject}=pending.get(msg.id); pending.delete(msg.id); msg.error?reject(new Error(JSON.stringify(msg.error))):resolve(msg.result); }
  else if (msg.method) buffer.push(msg);
});
const send = (method, params={}) => { const i=++id; ws.send(JSON.stringify({id:i,method,params})); return new Promise((resolve,reject)=>{ pending.set(i,{resolve,reject}); setTimeout(()=>{ if(pending.has(i)){pending.delete(i); reject(new Error(method)); }},45000); }); };
await send("Network.enable"); await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
const loadP = (async () => { const start=Date.now(); while(Date.now()-start<30000){ if(buffer.some(e=>e.method==="Page.loadEventFired")) return; await sleep(50);} })();
await send("Page.navigate", { url: "http://127.0.0.1:4173/" });
await loadP; await sleep(3000);
const perf = await send("Runtime.evaluate", { awaitPromise: true, returnByValue: true, expression: `(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  const paints = performance.getEntriesByType('paint');
  return {
    timing: nav ? { ttfb: Math.round(nav.responseStart-nav.startTime), dcl: Math.round(nav.domContentLoadedEventEnd-nav.startTime), load: Math.round(nav.loadEventEnd-nav.startTime) } : null,
    paints: Object.fromEntries(paints.map(p => [p.name, Math.round(p.startTime)]))
  };
})()`});
const lcp = await send("Runtime.evaluate", { awaitPromise: true, returnByValue: true, expression: `new Promise(resolve => {
  let last=null; const po=new PerformanceObserver(list=>{ last=list.getEntries().at(-1)||last; });
  po.observe({type:'largest-contentful-paint', buffered:true});
  setTimeout(()=>{ po.disconnect(); resolve(last?{startTime:Math.round(last.startTime), size:last.size, url:last.url||null}:null); },600);
})`});
console.log(JSON.stringify({ mode: "desktop unthrottled", ...perf.result.value, lcp: lcp.result.value }, null, 2));
ws.close(); chrome.kill(); await sleep(300); try { rmSync(PROFILE,{recursive:true,force:true}); } catch {}
