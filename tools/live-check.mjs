#!/usr/bin/env node
// Live check after every merge/deploy.
// - every sitemap URL returns 200, title equals the repo title, canonical is
//   self, HTML contains 595992279599 and not the old number
// - /no-existe/ returns 404
// - non-public files return 403 or 404
// - live /assets/js/site.js has no old number
// - (info) www → apex behaviour, response headers of /
// Usage: NODE_USE_ENV_PROXY=1 node tools/live-check.mjs [https://carpinteria.com.py]
import fs from 'node:fs';
import { REPO_ROOT, NUMBER, OLD_PATTERNS, sitemapPaths, fileForPath, load, fetchText } from './lib.mjs';

const base = (process.argv[2] || 'https://carpinteria.com.py').replace(/\/$/, '');
const fails = []; const lines = [];
const ok = (cond, msg) => { lines.push(`${cond ? 'OK  ' : 'FAIL'} ${msg}`); if (!cond) fails.push(msg); };

let probe;
try { probe = await fetchText(`${base}/`); } catch (e) {
  console.log(`live-check: NOT RUN — ${base} unreachable (${e.cause?.code || e.message}). Allow the host in the environment network settings.`);
  process.exit(2);
}
if (probe.status === 403 && /policy|proxy|forbidden/i.test(probe.text) && !/<html/i.test(probe.text)) {
  console.log(`live-check: NOT RUN — egress proxy answered 403 for ${base}`);
  process.exit(2);
}

const paths = await sitemapPaths(REPO_ROOT);
for (const p of paths) {
  let r;
  try { r = await fetchText(`${base}${p}`); } catch (e) { ok(false, `${p} fetch error ${e.message}`); continue; }
  const $ = load(r.text);
  const repoTitle = load(fs.readFileSync(fileForPath(REPO_ROOT, p), 'utf8'))('head title').text().trim();
  const liveTitle = $('head title').text().trim();
  const canon = $('link[rel="canonical"]').attr('href');
  const probs = [];
  if (r.status !== 200) probs.push(`status ${r.status}`);
  if (liveTitle !== repoTitle) probs.push(`title "${liveTitle}" ≠ repo "${repoTitle}"`);
  if (canon !== `https://carpinteria.com.py${p}`) probs.push(`canonical ${canon}`);
  if (!r.text.includes(NUMBER)) probs.push('number missing');
  if (OLD_PATTERNS.some((re) => re.test(r.text))) probs.push('OLD NUMBER present');
  ok(!probs.length, `${p} ${probs.join('; ') || '200, title, canonical, number'}`);
}
const nf = await fetchText(`${base}/no-existe/`);
ok(nf.status === 404, `/no-existe/ → ${nf.status}`);
for (const p of ['/docs/seo/entrega.md', '/data/whatsapp.json', '/audit-before.json', '/tools/verify.mjs', '/tools/package.json', '/docs/IMPROVE-PLAN.md']) {
  const r = await fetchText(`${base}${p}`, { redirect: 'manual' });
  ok([403, 404].includes(r.status), `${p} → ${r.status}`);
}
const js = await fetchText(`${base}/assets/js/site.js`);
ok(js.status === 200 && !OLD_PATTERNS.some((re) => re.test(js.text)), `/assets/js/site.js ${js.status}, old number ${OLD_PATTERNS.some((re) => re.test(js.text)) ? 'PRESENT' : 'absent'}`);
const idx = await fetchText(`${base}/cocinas/index.html`, { redirect: 'manual' });
lines.push(`info /cocinas/index.html → ${idx.status} ${idx.headers.location || ''}`);
try {
  const www = await fetchText(base.replace('://', '://www.') + '/', { redirect: 'manual' });
  lines.push(`info www → ${www.status} ${www.headers.location || ''}`);
} catch (e) { lines.push(`info www → error ${e.cause?.code || e.message}`); }
lines.push(`info headers /: ${['server', 'content-type', 'cache-control', 'x-content-type-options', 'x-frame-options', 'referrer-policy', 'strict-transport-security'].map((h) => `${h}=${probe.headers[h] ?? '-'}`).join(' ')}`);

console.log(lines.join('\n'));
console.log(`\nlive-check: ${fails.length ? `FAIL (${fails.length})` : 'OK'}`);
process.exit(fails.length ? 1 : 0);
