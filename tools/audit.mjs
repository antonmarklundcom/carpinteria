#!/usr/bin/env node
// Usage: node tools/audit.mjs <repoRoot|https://carpinteria.com.py> <out.json>
// Per sitemap URL: status, title, description, H1s, canonical, robots, word
// counts, internal links out/in, images without alt, schema types, WhatsApp
// numbers and texts, tel links, phone display strings, cross-domain links.
// Output has the same shape as audit-before.json.
import fs from 'node:fs';
import path from 'node:path';
import { ORIGIN, isLive, sitemapPaths, loadPage, load, words, normInternal, jsonLdBlocks, collectSchema, parseWa, PHONE_DISPLAY_RE, walk, OLD_PATTERNS, REPO_ROOT } from './lib.mjs';

const [src = '.', out = 'audit-after.json'] = process.argv.slice(2);
const root = isLive(src) ? src.replace(/\/$/, '') : path.resolve(src);
const live = isLive(src);

let paths;
try { paths = await sitemapPaths(root); } catch (e) { console.log(`audit: NOT RUN — cannot read ${root}/sitemap.xml (${e.cause?.code || e.message})`); process.exit(2); }
const pages = {};
for (const p of paths) {
  const r = await loadPage(root, p);
  const rec = { url: `${ORIGIN}${p}`, file: r.file || null, status: r.status };
  if (live) { rec.final_url = r.finalUrl; }
  if (r.status !== 200 || !r.html) { pages[p] = rec; continue; }
  const $ = load(r.html);
  const title = $('head title').first().text().trim();
  const desc = $('meta[name="description"]').attr('content') || '';
  Object.assign(rec, {
    title, title_len: title.length,
    meta_description: desc, meta_description_len: desc.length,
    h1: $('h1').map((_, e) => $(e).text().replace(/\s+/g, ' ').trim()).get(),
    h2_count: $('h2').length,
    canonical: $('link[rel="canonical"]').attr('href') || null,
  });
  rec.canonical_self = rec.canonical === rec.url;
  rec.robots = $('meta[name="robots"]').attr('content') || null;
  rec.og_image = $('meta[property="og:image"]').attr('content') || null;
  const $body = load(r.html);
  $body('script,style,noscript,template').remove();
  rec.word_count_main = words($body('main').text());
  rec.word_count_body = words($body('body').text());

  const out = new Set(); const outMain = new Set(); const extHosts = new Set(); const cross = [];
  const waNums = new Set(); const waTexts = new Set(); const tels = new Set(); let waCount = 0;
  $('a[href]').each((_, a) => {
    const href = $(a).attr('href');
    const inMain = $(a).closest('main').length > 0;
    const ip = normInternal(href);
    if (ip) { out.add(ip); if (inMain) outMain.add(ip); return; }
    if (/^tel:/i.test(href)) { tels.add(href); return; }
    let u; try { u = new URL(href, ORIGIN); } catch { return; }
    if (!/^https?:$/.test(u.protocol)) return;
    extHosts.add(u.hostname);
    const wa = parseWa(u.href);
    if (wa) { waCount++; waNums.add(wa.number); waTexts.add(wa.text || ''); return; }
    if (/\.com\.py$/.test(u.hostname) && !/(^|\.)carpinteria\.com\.py$/.test(u.hostname)) cross.push({ href: u.href, anchor: $(a).text().replace(/\s+/g, ' ').trim(), in_main: inMain });
  });
  rec.internal_links_out = [...out].sort();
  rec.internal_links_out_in_main = [...outMain].sort();
  rec.external_link_hosts = [...extHosts].sort();
  const imgs = $('img');
  rec.images = imgs.length;
  rec.images_without_alt = imgs.filter((_, i) => $(i).attr('alt') === undefined).map((_, i) => $(i).attr('src')).get();
  const media = new Set();
  $('img[src],video[src],video[data-src],source[src],video[poster]').each((_, e) => {
    ['src', 'data-src', 'poster'].forEach((k) => { const v = $(e).attr(k); if (v && /^https?:/.test(v) && !v.includes('carpinteria.com.py')) media.add(v); });
  });
  rec.external_media = [...media];
  const ld = jsonLdBlocks($);
  rec.jsonld_parse_errors = ld.filter((b) => !b.ok).map((b) => b.error);
  const { types, phones } = collectSchema(ld.filter((b) => b.ok).map((b) => b.data));
  rec.schema_types = [...types].sort();
  rec.schema_telephones = [...new Set(phones)];
  rec.faq_items = $('.faq-item').length;
  rec.whatsapp_ctas = waCount;
  rec.whatsapp_numbers = [...waNums];
  rec.whatsapp_texts_distinct = [...waTexts];
  rec.tel_links = [...tels];
  $body('a[href^="tel:"]');
  rec.phone_display = [...new Set(($body('body').text().match(PHONE_DISPLAY_RE) || []).map((s) => s.trim()))];
  rec.cross_domain_links = cross;
  rec.old_number_present = OLD_PATTERNS.some((re) => re.test(r.html));
  pages[p] = rec;
}

// in-links
for (const p of paths) {
  const rec = pages[p];
  const from = []; const fromMain = [];
  for (const q of paths) {
    if (q === p || !pages[q].internal_links_out) continue;
    if (pages[q].internal_links_out.includes(p)) from.push(q);
    if (pages[q].internal_links_out_in_main.includes(p)) fromMain.push(q);
  }
  rec.internal_links_in = from;
  rec.internal_links_in_count = from.length;
  rec.internal_links_in_from_main = fromMain;
}

// summary
const list = Object.entries(pages);
const titles = {};
list.forEach(([p, r]) => { if (r.title) (titles[r.title] ||= []).push(p); });
const oldHits = [];
if (!live) {
  for (const f of walk(root)) {
    if (!/\.(html|js|css|xml|md|json|txt|mjs|htaccess)$|\.htaccess$/.test(f) || f.includes(`${path.sep}tools${path.sep}`)) continue;
    if (/audit-(before|live-before|after)[^/]*\.json$/.test(f)) continue;
    fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      if (OLD_PATTERNS.some((re) => re.test(line))) oldHits.push(`${path.relative(root, f)}:${i + 1}`);
    });
  }
} else {
  list.forEach(([p, r]) => { if (r.old_number_present) oldHits.push(p); });
}
const summary = {
  not_200: list.filter(([, r]) => r.status !== 200).map(([p, r]) => `${p} ${r.status}`),
  old_number_hits: oldHits,
  pages_missing_meta_description: list.filter(([, r]) => r.status === 200 && !r.meta_description).map(([p]) => p),
  pages_multi_or_no_h1: list.filter(([, r]) => r.status === 200 && r.h1.length !== 1).map(([p]) => p),
  pages_canonical_not_self: list.filter(([, r]) => r.status === 200 && !r.canonical_self).map(([p]) => p),
  duplicate_titles: Object.entries(titles).filter(([, v]) => v.length > 1),
  pages_without_cross_domain_link: list.filter(([, r]) => r.status === 200 && !r.cross_domain_links.length).map(([p]) => p),
  images_without_alt_total: list.reduce((n, [, r]) => n + (r.images_without_alt?.length || 0), 0),
  external_media_hosts: [...new Set(list.flatMap(([, r]) => (r.external_media || []).map((u) => new URL(u).hostname)))],
  phone_display_variants: [...new Set(list.flatMap(([, r]) => r.phone_display || []))],
  whatsapp_numbers: [...new Set(list.flatMap(([, r]) => r.whatsapp_numbers || []))],
  word_count_main_min_max: (() => { const w = list.map(([, r]) => r.word_count_main).filter(Number.isFinite); return [Math.min(...w), Math.max(...w)]; })(),
};

const result = {
  generated: new Date().toISOString(),
  source: live ? `live ${root}` : `repo ${path.relative(REPO_ROOT, root) || '.'}`,
  sitemap_url_count: paths.length,
  summary,
  pages,
};
fs.writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
console.log(`audit: ${paths.length} URLs → ${out}`);
console.log(JSON.stringify({ not_200: summary.not_200, old_number_hits: summary.old_number_hits, h1: summary.pages_multi_or_no_h1, canon: summary.pages_canonical_not_self, phones: summary.phone_display_variants }, null, 1));
