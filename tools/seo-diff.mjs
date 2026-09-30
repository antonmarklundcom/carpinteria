#!/usr/bin/env node
// Usage: node tools/seo-diff.mjs <before.json> <after.json> [--approved-titles file]
// Fails on: status not 200, canonical changed / not self, noindex added,
// H1 count not 1, title or description empty, unapproved title change,
// word_count_main down >10 %, lost in-links, lost schema type, URL left the
// sitemap. Prints a table of every difference (expected ones included).
// Approved-titles file: one line per URL, "/path/<TAB>New title".
import fs from 'node:fs';

const argv = process.argv.slice(2);
const [beforeF, afterF] = argv.filter((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1] !== '--approved-titles');
const ai = argv.indexOf('--approved-titles');
const approved = new Map();
if (ai >= 0) fs.readFileSync(argv[ai + 1], 'utf8').split('\n').filter((l) => l.trim() && !l.startsWith('#')).forEach((l) => { const [p, t] = l.split('\t'); approved.set(p.trim(), t?.trim()); });

const B = JSON.parse(fs.readFileSync(beforeF, 'utf8')).pages;
const A = JSON.parse(fs.readFileSync(afterF, 'utf8')).pages;
const rows = []; const fails = [];
const row = (p, field, before, after, bad) => { rows.push({ p, field, before, after, bad }); if (bad) fails.push(`${p} ${field}`); };
const s = (v) => (Array.isArray(v) ? v.join(', ') : String(v ?? ''));

for (const [p, b] of Object.entries(B)) {
  const a = A[p];
  if (!a) { row(p, 'sitemap', 'present', 'MISSING', true); continue; }
  if (a.status !== 200) row(p, 'status', b.status ?? 200, a.status, true);
  if (a.status !== 200) continue;
  if (a.canonical !== b.canonical || !a.canonical_self) row(p, 'canonical', b.canonical, a.canonical, true);
  if (/noindex/i.test(a.robots || '') && !/noindex/i.test(b.robots || '')) row(p, 'robots', b.robots, a.robots, true);
  if (a.h1.length !== 1) row(p, 'h1 count', b.h1.length, a.h1.length, true);
  if (s(a.h1) !== s(b.h1)) row(p, 'h1', s(b.h1), s(a.h1), false);
  if (!a.title || !a.meta_description) row(p, 'title/description', 'set', 'EMPTY', true);
  if (a.title !== b.title) row(p, 'title', b.title, a.title, approved.get(p) !== a.title);
  if (a.meta_description !== b.meta_description) row(p, 'description', b.meta_description, a.meta_description, false);
  if (a.word_count_main < b.word_count_main * 0.9) row(p, 'word_count_main', b.word_count_main, a.word_count_main, true);
  else if (a.word_count_main !== b.word_count_main) row(p, 'word_count_main', b.word_count_main, a.word_count_main, false);
  const lostIn = (b.internal_links_in || []).filter((x) => !(a.internal_links_in || []).includes(x));
  if (lostIn.length) row(p, 'in-links lost', '', lostIn.join(' '), true);
  const lostInMain = (b.internal_links_in_from_main || []).filter((x) => !(a.internal_links_in_from_main || []).includes(x));
  if (lostInMain.length) row(p, 'in-body in-links lost', '', lostInMain.join(' '), false);
  const lostSchema = (b.schema_types || []).filter((x) => !(a.schema_types || []).includes(x));
  if (lostSchema.length) row(p, 'schema lost', lostSchema.join(' '), '', true);
  for (const k of ['phone_display', 'tel_links', 'whatsapp_texts_distinct', 'cross_domain_links', 'whatsapp_ctas', 'external_media']) {
    const bv = JSON.stringify(b[k] ?? null); const av = JSON.stringify(a[k] ?? null);
    if (bv !== av) row(p, k, s(Array.isArray(b[k]) ? b[k].map((x) => x.href || x).map((x) => String(x).slice(0, 60)) : b[k]), s(Array.isArray(a[k]) ? a[k].map((x) => x.href || x).map((x) => String(x).slice(0, 60)) : a[k]), false);
  }
}
for (const p of Object.keys(A)) if (!B[p]) row(p, 'new URL', '', 'added', false);

const cut = (x, n = 70) => (String(x).length > n ? `${String(x).slice(0, n - 1)}…` : String(x));
console.log('| URL | field | before | after | gate |\n|---|---|---|---|---|');
rows.forEach((r) => console.log(`| ${r.p} | ${r.field} | ${cut(r.before).replace(/\|/g, '/')} | ${cut(r.after).replace(/\|/g, '/')} | ${r.bad ? 'FAIL' : 'ok'} |`));
console.log(`\nseo-diff: ${Object.keys(B).length} URLs, ${rows.length} differences, ${fails.length} failing`);
if (fails.length) { console.log(`  ${fails.join('\n  ')}`); process.exit(1); }
