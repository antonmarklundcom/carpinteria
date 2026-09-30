#!/usr/bin/env node
// Duplicate-copy check for content PRs. Compares every text block in <main>
// (p, li, h2, h3, summary, figcaption) across all sitemap pages using 8-word
// shingles. Fails when a block of 12+ words on one page shares >= 50 % of its
// shingles with a block on another page, or when a whole page shares > 15 %
// of its shingles with another page. Shared components (mid-page CTA, quote
// band, breadcrumbs, related links, process band) are skipped.
// Usage: node tools/overlap.mjs [--only=/cocinas/,/placares/] [--allow=file]
// --allow: lines "/a/ | /b/" of page pairs whose overlap is expected.
import fs from 'node:fs';
import * as cheerio from 'cheerio';
import { REPO_ROOT, sitemapPaths, fileForPath } from './lib.mjs';

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const only = args.only ? String(args.only).split(',') : null;
const allowed = new Set();
if (args.allow) for (const l of fs.readFileSync(args.allow, 'utf8').split('\n')) {
  const m = l.split('|').map((s) => s.trim());
  if (m.length === 2 && m[0].startsWith('/')) { allowed.add(`${m[0]}|${m[1]}`); allowed.add(`${m[1]}|${m[0]}`); }
}
const SKIP = '.mid-cta, .quote-band, .breadcrumbs, .related-links, .process-band';
const N = 8;
const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ ]+/g, ' ').split(/\s+/).filter(Boolean);
const shingles = (w) => { const s = new Set(); for (let i = 0; i + N <= w.length; i++) s.add(w.slice(i, i + N).join(' ')); return s; };

const paths = (await sitemapPaths(REPO_ROOT)).filter((p) => !['/cotizar/', '/privacidad/'].includes(p));
const pages = paths.map((p) => {
  const $ = cheerio.load(fs.readFileSync(fileForPath(REPO_ROOT, p), 'utf8'));
  $(SKIP).remove();
  const blocks = [];
  $('main').find('p, li, h2, h3, summary, figcaption').each((_, el) => {
    if ($(el).find('p, li').length) return;
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    const w = norm(text);
    if (w.length >= 12) blocks.push({ text, sh: shingles(w) });
  });
  const all = new Set(); for (const b of blocks) for (const s of b.sh) all.add(s);
  return { p, blocks, all };
});

const fails = [];
for (const a of pages) {
  if (only && !only.includes(a.p)) continue;
  for (const b of pages) {
    if (a.p === b.p || allowed.has(`${a.p}|${b.p}`)) continue;
    let shared = 0; for (const s of a.all) if (b.all.has(s)) shared++;
    const pct = a.all.size ? shared / a.all.size : 0;
    if (pct > 0.15) fails.push(`${a.p} shares ${(pct * 100).toFixed(0)} % of its shingles with ${b.p}`);
    for (const blk of a.blocks) {
      let hit = 0; for (const s of blk.sh) if (b.all.has(s)) hit++;
      if (blk.sh.size && hit / blk.sh.size >= 0.5) fails.push(`${a.p} ≈ ${b.p}: "${blk.text.slice(0, 90)}…"`);
    }
  }
}
const uniq = [...new Set(fails)];
if (uniq.length) { console.log(uniq.join('\n')); console.log(`overlap: ${uniq.length} problem(s)`); process.exit(1); }
console.log(`overlap: OK — ${only ? only.length : pages.length} page(s) checked against ${pages.length}`);
