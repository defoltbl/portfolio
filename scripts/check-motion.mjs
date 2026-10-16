// Checks the site's motion frame by frame in headless Chrome (run after a build: npm run test:motion).
// Fails (exit 1) when:
//  - a page transition changes the page background in any frame (in dark mode that is a white blink),
//  - project cards on screen are not fully visible after "All projects" brings the visitor back,
//  - the category filter dims a shown card in any frame, or leaves view-transition names behind.
// Chrome: $CHROME, else the macOS app, else `google-chrome` on the PATH (as on GitHub's Ubuntu runners).
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, mkdtempSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join, normalize } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".webp": "image/webp", ".pdf": "application/pdf", ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "text/xml" };
const server = createServer((req, res) => {
  let file = join(dist, normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!file.startsWith(dist) || !existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const mac = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const binary = process.env.CHROME || (existsSync(mac) ? mac : "google-chrome");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Starts Chrome on a free port it picks itself (written to DevToolsActivePort in its profile) and returns
// the page to drive. A slow first start on a CI machine gets 30 s; on failure, Chrome's own error is shown.
async function launch() {
  const profile = mkdtempSync(join(tmpdir(), "motion-"));
  const linux = process.platform === "linux" ? ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] : [];
  const proc = spawn(binary, ["--headless=new", "--no-first-run", "--no-default-browser-check", `--user-data-dir=${profile}`,
    "--remote-debugging-port=0", "--window-size=1440,900", ...linux, "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
  let stderr = "", exited = null;
  proc.stderr.on("data", (d) => (stderr = (stderr + d).slice(-1500)));
  proc.on("error", (e) => (exited = e.message));
  proc.on("exit", (code) => (exited ??= `exited with code ${code}`));
  for (let waited = 0; waited < 30000 && !exited; waited += 250) {
    await sleep(250);
    const file = join(profile, "DevToolsActivePort");
    if (!existsSync(file)) continue;
    const port = readFileSync(file, "utf8").split("\n")[0].trim();
    try {
      const page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page");
      if (page) return { proc, page };
    } catch {}
  }
  proc.kill();
  throw new Error(`Chrome did not start (${binary}): ${exited ?? "no answer in 30 s"}${stderr.trim() ? `\n    ${stderr.trim().split("\n").slice(-3).join("\n    ")}` : ""}`);
}

const problems = [];
let chrome;
try {
  let target;
  for (let attempt = 1; !target; attempt++) {
    try {
      ({ proc: chrome, page: target } = await launch());
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  let id = 0;
  const waiting = new Map();
  ws.addEventListener("message", (m) => { const d = JSON.parse(m.data); if (d.id && waiting.has(d.id)) { waiting.get(d.id)(d.result); waiting.delete(d.id); } });
  const send = (method, params = {}) => new Promise((r) => { const n = ++id; waiting.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
  const ev = async (expr) => (await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true })).result.value;
  const open = async (path) => { await send("Page.navigate", { url: base + path }); await sleep(1800); };
  // Records `sample` on every frame for `ms` after clicking `selector`; returns the samples.
  const frames = async (selector, sample, ms) => {
    await ev(`(() => { window.__f = []; const t0 = performance.now();
      const tick = () => { window.__f.push(${sample}); if (performance.now() - t0 < ${ms}) requestAnimationFrame(tick); };
      document.querySelector(${JSON.stringify(selector)}).click(); requestAnimationFrame(tick); return 1; })()`);
    await sleep(ms + 300);
    return JSON.parse(await ev("JSON.stringify(window.__f)"));
  };
  await send("Page.enable");
  const project = await (async () => { await open("/"); return ev(`document.querySelector('.card a[href^="/projects/"]')?.getAttribute('href')`); })();
  if (!project) throw new Error("no case-study link on the home page");

  // 1. One background colour through every page transition, in both themes and both directions.
  for (const scheme of ["dark", "light"]) {
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: scheme }] });
    for (const [from, link] of [[project, ".back"], ["/", `.card a[href="${project}"]`]]) {
      await open(from);
      const colours = new Set(await frames(link, "getComputedStyle(document.body).backgroundColor", 900));
      if (colours.size !== 1) problems.push(`${scheme}: ${from} -> next page: the background changes in ${colours.size} steps (a blink)`);
    }
  }
  await send("Emulation.setEmulatedMedia", { features: [] });

  // 2. Back on the home page, the cards on screen are fully visible in every frame.
  await open(project);
  const back = await frames(".back", `location.pathname === "/" ? Math.min(1, ...[...document.querySelectorAll('.card')]
    .filter((c) => { const r = c.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }).map((c) => +getComputedStyle(c).opacity)) : 1`, 900);
  if (Math.min(...back) < 1) problems.push(`back to the projects: a card on screen dims to ${Math.min(...back)}`);

  // 3. The filter shows every card it keeps fully opaque, and cleans up after its view transition.
  await open("/");
  await ev(`document.querySelector('.filters').scrollIntoView({ block: 'start' }), 1`);
  await sleep(500);
  const filters = await ev(`[...document.querySelectorAll('.filter-btn')].map((b) => b.dataset.filter).filter((f) => f !== "All")`);
  for (const filter of [...filters, "All"]) {
    // From the second frame on (the first may still show the old set), every shown card is fully visible.
    const seen = await frames(`.filter-btn[data-filter="${filter}"]`,
      "Math.min(1, ...[...document.querySelectorAll('.card')].filter((c) => !c.hidden).map((c) => +getComputedStyle(c).opacity))", 500);
    if (Math.min(...seen.slice(2)) < 1) problems.push(`filter ${filter}: a shown card fades or dims (lowest ${Math.min(...seen.slice(2))})`);
    const state = JSON.parse(await ev(`JSON.stringify([...document.querySelectorAll('.card')].filter((c) => !c.hidden)
      .map((c) => [+getComputedStyle(c).opacity, c.style.viewTransitionName]))`));
    if (!state.length) problems.push(`filter ${filter}: no card shown`);
    if (state.some(([opacity]) => opacity < 1)) problems.push(`filter ${filter}: a shown card is not fully visible`);
    if (state.some(([, name]) => name)) problems.push(`filter ${filter}: view-transition names left on cards`);
  }
  ws.close();
} catch (error) {
  problems.push(String(error?.message ?? error));
} finally {
  chrome?.kill();
  server.close();
}

if (problems.length) {
  console.error(`check-motion: ${problems.length} problem(s)\n` + problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log("check-motion: page transitions keep one background, cards stay visible, the filter is clean");
