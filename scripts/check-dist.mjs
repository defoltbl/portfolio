// Checks the built site in dist/ before it is published. Fails (exit 1) when a page has:
//  - an inline <script> (the Content-Security-Policy in vercel.json allows scripts from 'self' only),
//  - an internal link or anchor that leads nowhere,
//  - an image without alt text, or a figure without a caption,
//  - no <title> or no meta description,
//  - a link to localhost.
// Run: npm run verify (type check, build, then this).
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;

function pages(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return pages(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

// Addresses that vercel.json rewrites to another site (the CV): valid links though no file in dist/ has them.
const rewritten = new Set((JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8")).rewrites || []).map((r) => r.source));

const ids = new Map();
const files = pages(dist);
for (const file of files) {
  const html = readFileSync(file, "utf8");
  ids.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

function target(from, href) {
  const [path, hash] = href.split("#");
  let file = from;
  if (path) {
    const clean = path.startsWith("/") ? path : join("/", relative(dist, from), "..", path);
    file = join(dist, clean.endsWith("/") ? `${clean}index.html` : clean);
    if (!existsSync(file) && existsSync(`${file}/index.html`)) file = `${file}/index.html`;
    if (!existsSync(file)) return `missing page ${path}`;
  }
  if (hash && file.endsWith(".html") && !ids.get(file)?.has(hash)) return `missing #${hash} on ${relative(dist, file)}`;
  return "";
}

const problems = [];
for (const file of files) {
  const html = readFileSync(file, "utf8");
  const page = relative(dist, file);
  for (const m of html.matchAll(/<script\b([^>]*)>/g)) {
    if (!/\bsrc=/.test(m[1])) problems.push(`${page}: an inline <script> (blocked by the CSP)`);
  }
  for (const m of html.matchAll(/<img\b([^>]*)>/g)) {
    if (!/\balt="[^"]+"/.test(m[1])) problems.push(`${page}: an image without alt text`);
  }
  for (const m of html.matchAll(/<figure\b[^>]*>([\s\S]*?)<\/figure>/g)) {
    if (!/<figcaption>[^<]+<\/figcaption>/.test(m[1])) problems.push(`${page}: a figure without a caption`);
  }
  if (!/<title>[^<]+<\/title>/.test(html)) problems.push(`${page}: no <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) problems.push(`${page}: no meta description`);
  if (/\s(?:href|src)="[^"]*(?:localhost|127\.0\.0\.1)/.test(html)) problems.push(`${page}: a link to localhost`);
  for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(href) || href.startsWith("//")) continue;
    if (rewritten.has(href.split("#")[0])) continue;
    const why = target(file, href);
    if (why) problems.push(`${page}: ${href} – ${why}`);
  }
}

if (problems.length) {
  console.error(`check-dist: ${problems.length} problem(s)\n` + [...new Set(problems)].map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log(`check-dist: ${files.length} page(s) OK – no inline scripts, links resolve, images have alt text`);
