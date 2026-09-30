#!/usr/bin/env node
// QA gate. Exit 1 on any failure.
// Rules 1–2 (one WhatsApp number, pre-written distinct messages) and HTML
// sanity (1 H1, self canonical, title/description, JSON-LD parses, internal
// hrefs and /assets/ paths exist, sitemap and pages match).
import fs from 'node:fs';
import path from 'node:path';
import { REPO_ROOT, ORIGIN, NUMBER, TEL, DISPLAY, OLD_PATTERNS, sitemapPaths, fileForPath, load, jsonLdBlocks, collectSchema, parseWa, walk } from './lib.mjs';

const root = path.resolve(process.argv[2] || REPO_ROOT);
const fails = [];
const warns = [];
const fail = (where, msg) => fails.push(`${where}: ${msg}`);
const rel = (f) => path.relative(root, f);

const BAD_MSG = [/\bGs\.?\b/i, /\$/, /\bUSD\b/i, /\bguaran[ií]es\b/i, /\bprecio de\b/i, /\d[\d.]{3,}\s*(gs|₲)/i, /\b(tú|tienes|puedes)\b/i];
const checkMessage = (where, text) => {
  if (!text || !text.trim()) { fail(where, 'WhatsApp link without text'); return; }
  for (const re of BAD_MSG) if (re.test(text)) fail(where, `message breaks rule 2 (${re}): "${text.slice(0, 80)}…"`);
};

// ---------- 1. whole-repo text scan ----------
const TEXT_EXT = /\.(html|js|mjs|css|xml|md|json|txt|svg|example)$|\.htaccess$/;
const files = walk(root).filter((f) => TEXT_EXT.test(f));
for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  txt.split('\n').forEach((line, i) => {
    if (OLD_PATTERNS.some((re) => re.test(line))) fail(`${rel(f)}:${i + 1}`, 'old WhatsApp number');
  });
  // any wa.me / api.whatsapp.com number other than ours
  for (const m of txt.matchAll(/wa\.me\/(\+?\d+)/g)) if (m[1] !== NUMBER) fail(rel(f), `wa.me number ${m[1]}`);
  for (const m of txt.matchAll(/api\.whatsapp\.com\/send\?phone=(\+?\d+)/g)) if (m[1] !== NUMBER) fail(rel(f), `api.whatsapp number ${m[1]}`);
  for (const m of txt.matchAll(/tel:(\+?\d[\d\s-]*)/g)) if (m[1].trim() !== TEL) fail(rel(f), `tel:${m[1]}`);
  // any other Paraguayan mobile-looking number (595 9xx… or 09xx…) in served files
  if (/\.(html|js|css|xml)$/.test(f)) {
    for (const m of txt.matchAll(/(?<![\d/])(?:\+?595[\s-]?9\d{2}|09\d{2})[\s-]?\d{3}[\s-]?\d{3}(?!\d)/g)) {
      if (m[0].replace(/\D/g, '').replace(/^0/, '595') !== NUMBER) fail(rel(f), `foreign phone number ${m[0]}`);
    }
  }
}

// ---------- 2. message map ----------
const mapFile = path.join(root, 'data/whatsapp.json');
let map = null;
if (fs.existsSync(mapFile)) {
  try { map = JSON.parse(fs.readFileSync(mapFile, 'utf8')); } catch (e) { fail('data/whatsapp.json', `invalid JSON ${e.message}`); }
}
if (map) {
  if (map.number !== NUMBER) fail('data/whatsapp.json', 'number');
  if (map.tel !== TEL) fail('data/whatsapp.json', 'tel');
  if (map.display !== DISPLAY) fail('data/whatsapp.json', 'display');
  const seen = new Map();
  const all = [...Object.entries(map.pages || {}).map(([k, v]) => [`page ${k}`, v.text]), ...Object.entries(map.services || {}).map(([k, v]) => [`service ${k}`, typeof v === 'string' ? v : v.text])];
  for (const [k, t] of all) {
    checkMessage(`data/whatsapp.json ${k}`, t);
    if (seen.has(t)) fail('data/whatsapp.json', `${k} duplicates ${seen.get(t)}`);
    seen.set(t, k);
  }
  const collect = (o, pre) => { if (typeof o === 'string') checkMessage(`data/whatsapp.json ${pre}`, o); else if (o && typeof o === 'object') Object.entries(o).forEach(([k, v]) => collect(v, `${pre}.${k}`)); };
  collect(map.form?.templates, 'form.templates');
}

// ---------- 3. pages ----------
const paths = await sitemapPaths(root);
const htmlFiles = files.filter((f) => f.endsWith('.html') && !rel(f).startsWith('docs') && !rel(f).startsWith('tools'));
const pageFiles = new Set(paths.map((p) => fileForPath(root, p)));
for (const f of htmlFiles) {
  const r = rel(f);
  if (r !== '404.html' && !pageFiles.has(f)) fail(r, 'HTML page not in sitemap');
}
const pageMsg = new Map();
const targets = [...paths.map((p) => [p, fileForPath(root, p)]), ['/404.html', path.join(root, '404.html')]];
for (const [p, f] of targets) {
  if (!fs.existsSync(f)) { fail(p, 'sitemap URL has no file'); continue; }
  const html = fs.readFileSync(f, 'utf8');
  const $ = load(html);
  const is404 = p === '/404.html';
  const h1 = $('h1').length;
  if (h1 !== 1) fail(p, `${h1} H1`);
  if (!$('head title').text().trim()) fail(p, 'no title');
  if (!is404 && !($('meta[name="description"]').attr('content') || '').trim()) fail(p, 'no meta description');
  const canon = $('link[rel="canonical"]').attr('href');
  if (!is404 && canon !== `${ORIGIN}${p}`) fail(p, `canonical ${canon}`);
  if (!is404 && /noindex/i.test($('meta[name="robots"]').attr('content') || '')) fail(p, 'noindex');
  const ld = jsonLdBlocks($);
  ld.filter((b) => !b.ok).forEach((b) => fail(p, `JSON-LD parse error ${b.error}`));
  const { phones } = collectSchema(ld.filter((b) => b.ok).map((b) => b.data));
  phones.forEach((t) => { if (t !== TEL) fail(p, `JSON-LD telephone "${t}"`); });
  // visible phone strings
  const $t = load(html); $t('script,style').remove();
  const bodyText = $t('body').text();
  for (const m of bodyText.matchAll(/\+?595[\s\d]{8,14}\d/g)) if (m[0].trim() !== DISPLAY) fail(p, `phone display "${m[0].trim()}"`);
  // WhatsApp links
  const texts = new Set();
  $('a[href]').each((_, a) => {
    const href = $(a).attr('href');
    if (/wa\.me|whatsapp\.com/.test(href)) {
      const wa = parseWa(href);
      if (!wa) { fail(p, `unparseable WhatsApp link ${href}`); return; }
      if (wa.number !== NUMBER) fail(p, `WhatsApp number ${wa.number}`);
      checkMessage(p, wa.text);
      if (wa.text && $(a).attr('data-wa') !== undefined && !String($(a).attr('data-wa')).startsWith('service:')) texts.add(wa.text);
      if (map && $(a).attr('data-wa') === undefined) warns.push(`${p}: WhatsApp link without data-wa (${$(a).attr('class') || $(a).text().trim().slice(0, 20)})`);
    }
    // internal links
    if (/^\/(?!\/)/.test(href) || href.startsWith(ORIGIN)) {
      const u = new URL(href, ORIGIN);
      if (u.hostname !== 'carpinteria.com.py') return;
      const target = u.pathname;
      const tf = target.startsWith('/assets/') || /\.[a-z0-9]+$/i.test(target) ? path.join(root, target) : fileForPath(root, target);
      if (!fs.existsSync(tf)) fail(p, `broken internal link ${href}`);
    }
  });
  // form fallback wa links
  $('form[action*="wa.me"]').each((_, fm) => {
    const a = $(fm).attr('action');
    if (!a.includes(NUMBER)) fail(p, `form action ${a}`);
    if (!($(fm).find('input[name="text"]').attr('value') || '').trim()) fail(p, 'no-JS form fallback without text');
  });
  // assets referenced by src/srcset/href/poster
  $('[src],[srcset],link[href],[poster],[data-src]').each((_, e) => {
    const vals = [];
    ['src', 'href', 'poster', 'data-src', 'data-poster'].forEach((k) => { const v = $(e).attr(k); if (v) vals.push(v); });
    const ss = $(e).attr('srcset'); if (ss) ss.split(',').forEach((s) => vals.push(s.trim().split(/\s+/)[0]));
    vals.filter((v) => v.startsWith('/assets/') || v === '/sitemap.xml').forEach((v) => {
      if (!fs.existsSync(path.join(root, v.split(/[?#]/)[0]))) fail(p, `missing asset ${v}`);
    });
  });
  if (map) {
    if (texts.size > 1) fail(p, `${texts.size} different page messages on one page`);
    const [t] = [...texts];
    if (t) {
      if (pageMsg.has(t)) fail(p, `page message shared with ${pageMsg.get(t)}`);
      pageMsg.set(t, p);
    }
  }
}

// ---------- 4. scripts ----------
for (const f of files.filter((x) => rel(x).startsWith('assets/js/'))) {
  const txt = fs.readFileSync(f, 'utf8');
  if (/wa\.me\/\d/.test(txt) && !rel(f).endsWith('wa-config.js')) fail(rel(f), 'hard-coded wa.me number in script (use wa-config.js)');
}

// ---------- report ----------
const uniq = [...new Set(fails)];
if (warns.length) console.log(`warnings (${warns.length}):\n  ${[...new Set(warns)].slice(0, 20).join('\n  ')}`);
if (uniq.length) {
  console.log(`verify: FAIL (${uniq.length})\n  ${uniq.join('\n  ')}`);
  process.exit(1);
}
console.log(`verify: OK — ${targets.length} pages, ${files.length} text files scanned, ${pageMsg.size} distinct page messages`);
