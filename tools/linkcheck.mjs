#!/usr/bin/env node
// Link check. Internal: every <a href>, src, srcset and asset path in every
// page resolves to a file in the repo. External (with --external): every
// cross-domain *.com.py link returns 200 (redirects followed).
// Usage: node tools/linkcheck.mjs [--external]
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, ORIGIN, sitemapPaths, fileForPath, load, fetchText } from './lib.mjs';

const external = process.argv.includes('--external');
const paths = [...await sitemapPaths(REPO_ROOT), '/404.html'];
const broken = []; const ext = new Map(); let checked = 0;
for (const p of paths) {
  const f = fileForPath(REPO_ROOT, p);
  if (!fs.existsSync(f)) { broken.push(`${p}: page file missing`); continue; }
  const $ = load(fs.readFileSync(f, 'utf8'));
  const refs = [];
  $('a[href],link[href]:not([rel=canonical]):not([rel=preconnect]):not([rel=dns-prefetch])').each((_, e) => refs.push($(e).attr('href')));
  $('[src],[data-src],[poster]').each((_, e) => ['src', 'data-src', 'poster'].forEach((k) => $(e).attr(k) && refs.push($(e).attr(k))));
  $('[srcset]').each((_, e) => $(e).attr('srcset').split(',').forEach((s) => refs.push(s.trim().split(/\s+/)[0])));
  for (const href of refs) {
    if (!href || /^(#|mailto:|tel:|javascript:|data:)/.test(href)) continue;
    let u; try { u = new URL(href, `${ORIGIN}${p}`); } catch { broken.push(`${p}: bad URL ${href}`); continue; }
    if (u.hostname === 'carpinteria.com.py') {
      checked++;
      const t = u.pathname;
      const file = /\.[a-z0-9]+$/i.test(t) ? path.join(REPO_ROOT, decodeURIComponent(t)) : fileForPath(REPO_ROOT, t);
      if (!fs.existsSync(file)) broken.push(`${p}: ${href}`);
    } else if (/\.com\.py$/.test(u.hostname)) {
      if (!ext.has(u.href)) ext.set(u.href, []);
      ext.get(u.href).push(p);
    }
  }
}
console.log(`linkcheck: ${checked} internal refs in ${paths.length} pages, ${broken.length} broken`);
broken.forEach((b) => console.log(`  BROKEN ${b}`));
let extBad = 0;
if (ext.size) {
  console.log(`cross-domain links: ${ext.size}`);
  for (const [u, from] of ext) {
    if (!external) { console.log(`  (not fetched) ${u} ← ${from.join(' ')}`); continue; }
    let st = 'ERR';
    try { st = (await fetchText(u)).status; } catch (e) { st = `ERR ${e.cause?.code || e.message}`; }
    if (st !== 200) extBad++;
    console.log(`  ${st} ${u} ← ${from.join(' ')}`);
  }
}
if (broken.length || extBad) process.exit(1);
