#!/usr/bin/env node
// Builds one self-contained report from the Quomerce template and the report's body.
//
// The body is the HTML that goes inside <main> (masthead to footer, see
// references/report-design.md). Pictures it names with a relative src
// (images/home-phone.png) are embedded as data URIs, so the result is one file
// to send, open or print. Nothing is fetched and nothing outside the body's
// folder is read.
//
//   node scripts/build-report.mjs --body body.html --out report.html \
//     --lang pl --title "Audyt nawigacji myshop.pl" --description "One sentence."
//
// Exits 1 when something is missing; warns about placeholders left in the body.

import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve, relative, isAbsolute } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, a, i, all) => {
    if (a.startsWith('--')) pairs.push([a.slice(2), all[i + 1]?.startsWith('--') ? 'true' : all[i + 1]]);
    return pairs;
  }, []),
);

const fail = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

if (!args.body || !args.out) {
  fail('usage: node build-report.mjs --body body.html --out report.html [--lang en] [--title "…"] [--description "…"]');
}

const here = dirname(new URL(import.meta.url).pathname);
const templatePath = resolve(here, '../assets/report-template.html');
const bodyPath = resolve(args.body);
if (!existsSync(bodyPath)) fail(`no body at ${bodyPath}`);

const template = readFileSync(templatePath, 'utf8');
let body = readFileSync(bodyPath, 'utf8');
const bodyDir = dirname(bodyPath);

// A body may be a whole page someone started from the template: keep only what is inside the markers.
const marked = body.match(/<!-- report:start -->([\s\S]*?)<!-- report:end -->/);
if (marked) body = marked[1];
else if (/<main[\s>]/.test(body)) body = body.replace(/^[\s\S]*?<main[^>]*>/, '').replace(/<\/main>[\s\S]*$/, '');

// ── Pictures ──────────────────────────────────────────────────────────────
const TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' };
let embedded = 0;
let bytes = 0;
const missing = [];
body = body.replace(/(<img\b[^>]*?\bsrc=")([^"]+)(")/g, (whole, before, src, after) => {
  if (/^(data:|https?:|\/\/)/.test(src) || src.includes('{{')) return whole;
  const file = resolve(bodyDir, src);
  const inside = relative(bodyDir, file);
  if (inside.startsWith('..') || isAbsolute(inside)) {
    missing.push(`${src} (outside the body's folder, not read)`);
    return whole;
  }
  const type = TYPES[extname(file).toLowerCase()];
  if (!type || !existsSync(file)) {
    missing.push(src);
    return whole;
  }
  const data = readFileSync(file);
  embedded++;
  bytes += data.length;
  return `${before}data:${type};base64,${data.toString('base64')}${after}`;
});

// ── Head ──────────────────────────────────────────────────────────────────
const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let page = template.replace(/<!-- report:start -->[\s\S]*<!-- report:end -->/, () => `<!-- report:start -->\n${body.trim()}\n<!-- report:end -->`);
// The template's own comment block only helps whoever fills it in.
page = page.replace(/^<!doctype html>\n<!--[\s\S]*?-->\n/, '<!doctype html>\n');
if (args.lang) page = page.replace(/<html lang="[^"]*">/, `<html lang="${escape(args.lang)}">`);
if (args.title) page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(args.title)}</title>`);
if (args.description) {
  page = page.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escape(args.description)}">`);
}
page = page.replace(/\n<!-- Two to four words:[^\n]*-->/, '');

writeFileSync(args.out, page);

// ── Report ────────────────────────────────────────────────────────────────
const left = [...page.matchAll(/\{\{[^}]*\}\}/g)].map((m) => m[0]);
const size = statSync(args.out).size;
console.log(`✓ ${args.out}: ${(size / 1024 / 1024).toFixed(1)} MB, ${embedded} picture(s) embedded (${(bytes / 1024).toFixed(0)} kB)`);
if (missing.length) console.warn(`! pictures not found, left as links: ${missing.join(', ')}`);
if (left.length) console.warn(`! ${left.length} placeholder(s) left: ${[...new Set(left)].slice(0, 8).join('  ')}`);
if (/<html lang="\{\{/.test(page) || /<title>[^<]*\{\{/.test(page)) console.warn('! pass --lang and --title');
if (size > 12 * 1024 * 1024) console.warn('! over 12 MB: use fewer or smaller pictures (JPEG, 780 px wide is plenty for a phone)');
