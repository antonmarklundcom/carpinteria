// Shared helpers for the QA tools. Works against the repo (static files)
// or against the live site (fetch). Live fetches honour HTTPS_PROXY when
// Node is started with NODE_USE_ENV_PROXY=1 (Node 22+).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

export const ORIGIN = 'https://carpinteria.com.py';
export const NUMBER = '595992279599';
export const TEL = '+595992279599';
export const DISPLAY = '+595 992 279 599';
export const OLD_PATTERNS = [/595\s*995\s*628\s*862/, /995[\s-]*628[\s-]*862/, /0995\s*628\s*862/];

export const TOOLS_DIR = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(TOOLS_DIR, '..');

export const isLive = (src) => /^https?:\/\//.test(src);

export async function fetchText(url, opts = {}) {
  const res = await fetch(url, { redirect: opts.redirect || 'follow', headers: { 'user-agent': 'carpinteria-qa/1.0' } });
  const text = opts.head ? '' : await res.text();
  return { status: res.status, url: res.url, headers: Object.fromEntries(res.headers), text };
}

// Sitemap paths, in sitemap order.
export async function sitemapPaths(src) {
  let xml;
  if (isLive(src)) xml = (await fetchText(`${src.replace(/\/$/, '')}/sitemap.xml`)).text;
  else xml = fs.readFileSync(path.join(src, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

export function fileForPath(root, p) {
  if (p === '/') return path.join(root, 'index.html');
  if (p.endsWith('.html')) return path.join(root, p);
  return path.join(root, p.replace(/^\//, ''), 'index.html');
}

export async function loadPage(src, p) {
  if (isLive(src)) {
    const r = await fetchText(`${src.replace(/\/$/, '')}${p}`);
    return { status: r.status, html: r.text, headers: r.headers, finalUrl: r.url };
  }
  const f = fileForPath(src, p);
  if (!fs.existsSync(f)) return { status: 404, html: '', file: f };
  return { status: 200, html: fs.readFileSync(f, 'utf8'), file: path.relative(src, f) };
}

export const load = (html) => cheerio.load(html);

export const words = (text) => (text || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;

export function normInternal(href, base = ORIGIN) {
  if (!href) return null;
  if (/^(mailto:|tel:|javascript:|#)/i.test(href)) return null;
  let u;
  try { u = new URL(href, `${base}/`); } catch { return null; }
  const host = u.hostname.replace(/^www\./, '');
  if (host !== 'carpinteria.com.py' && !(u.hostname === '127.0.0.1' || u.hostname === 'localhost')) return null;
  return u.pathname;
}

export function jsonLdBlocks($) {
  const out = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).contents().text();
    try { out.push({ ok: true, data: JSON.parse(raw) }); } catch (e) { out.push({ ok: false, error: e.message }); }
  });
  return out;
}

export function collectSchema(node, types = new Set(), phones = []) {
  if (Array.isArray(node)) { node.forEach((n) => collectSchema(n, types, phones)); return { types, phones }; }
  if (node && typeof node === 'object') {
    const t = node['@type'];
    if (t) (Array.isArray(t) ? t : [t]).forEach((x) => types.add(x));
    if (typeof node.telephone === 'string') phones.push(node.telephone);
    Object.values(node).forEach((v) => collectSchema(v, types, phones));
  }
  return { types, phones };
}

// wa.me / api.whatsapp.com links → { number, text }
export function parseWa(href) {
  let u;
  try { u = new URL(href); } catch { return null; }
  if (u.hostname === 'wa.me') return { number: u.pathname.replace(/\//g, ''), text: u.searchParams.get('text') };
  if (/whatsapp\.com$/.test(u.hostname)) return { number: u.searchParams.get('phone') || '', text: u.searchParams.get('text') };
  return null;
}

export function walk(dir, skip = new Set(['.git', 'node_modules', 'audit-shots'])) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p, skip));
    else out.push(p);
  }
  return out;
}

export const PHONE_DISPLAY_RE = /\+?595[\s\d]{9,14}\d/g;
