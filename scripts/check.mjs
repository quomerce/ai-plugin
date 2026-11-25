#!/usr/bin/env node
// Checks the package before it ships: skills follow the Agent Skills format
// (https://agentskills.io/specification), every reference a skill names
// exists, the copied shared references are current, the manifests parse and
// carry one version.
//
//   node scripts/check.mjs

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const errors = [];
const fail = (msg) => errors.push(msg);
const read = (p) => readFileSync(join(root, p), 'utf8');

/** The frontmatter as flat `key: value` pairs; nested `metadata:` keys come back as `metadata.key`. */
function frontmatter(text, where) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) {
    fail(`${where}: no frontmatter`);
    return {};
  }
  const out = {};
  let parent = null;
  for (const line of m[1].split('\n')) {
    const nested = line.match(/^ {2}([a-z-]+):\s*(.*)$/);
    const top = line.match(/^([a-z-]+):\s*(.*)$/);
    if (nested && parent) out[`${parent}.${nested[1]}`] = nested[2].replace(/^"|"$/g, '');
    else if (top) {
      parent = top[2] === '' ? top[1] : null;
      out[top[1]] = top[2];
    } else if (line.trim()) fail(`${where}: cannot read frontmatter line "${line}"`);
  }
  return out;
}

// ── Skills ────────────────────────────────────────────────────────────────
const ALLOWED = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
const skills = readdirSync(join(root, 'skills'), { withFileTypes: true }).filter((d) => d.isDirectory());
const versions = new Map();

for (const { name: dir } of skills) {
  const where = `skills/${dir}/SKILL.md`;
  if (!existsSync(join(root, where))) {
    fail(`${where}: missing`);
    continue;
  }
  const text = read(where);
  const fm = frontmatter(text, where);
  for (const key of Object.keys(fm)) {
    if (!ALLOWED.has(key.split('.')[0])) fail(`${where}: frontmatter field "${key}" is not in the Agent Skills spec`);
  }
  if (fm.name !== dir) fail(`${where}: name "${fm.name}" must equal the folder name "${dir}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name ?? '') || fm.name.length > 64)
    fail(`${where}: name must be lowercase letters, digits and single hyphens, at most 64`);
  if (!fm.description) fail(`${where}: description is empty`);
  else if (fm.description.length > 1024) fail(`${where}: description is ${fm.description.length} chars, at most 1024`);
  if (/[<>]/.test(fm.description ?? '')) fail(`${where}: description must not contain < or >`);
  if ((fm.compatibility ?? '').length > 500) fail(`${where}: compatibility is over 500 chars`);
  const lines = text.split('\n').length;
  if (lines > 500) fail(`${where}: ${lines} lines, keep SKILL.md under 500`);
  // Files a skill names, in SKILL.md or in its references: references, assets and scripts it ships.
  const refDir = join(root, 'skills', dir, 'references');
  const texts = [[where, text]];
  if (existsSync(refDir)) {
    for (const f of readdirSync(refDir).filter((f) => f.endsWith('.md'))) {
      texts.push([`skills/${dir}/references/${f}`, readFileSync(join(refDir, f), 'utf8')]);
    }
  }
  for (const [file, body] of texts) {
    for (const [, ref] of body.matchAll(/`((?:references\/[^`\s]+\.md)|(?:(?:assets|scripts)\/[^`\s]+\.[a-z]+))`/g)) {
      if (!existsSync(join(root, 'skills', dir, ref))) fail(`${file}: names ${ref}, which does not exist`);
    }
  }
  // A report template is filled between its markers (scripts/build-report.mjs).
  const template = join(root, 'skills', dir, 'assets', 'report-template.html');
  if (existsSync(template)) {
    const html = readFileSync(template, 'utf8');
    if (!/<!-- report:start -->[\s\S]*<!-- report:end -->/.test(html))
      fail(`skills/${dir}/assets/report-template.html: the report:start and report:end markers are missing`);
    if (/<script\b/i.test(html)) fail(`skills/${dir}/assets/report-template.html: no <script> in the template`);
  }
  if (fm['metadata.version']) versions.set(where, fm['metadata.version']);
}

// ── Shared references ─────────────────────────────────────────────────────
try {
  execFileSync(process.execPath, [join(root, 'scripts/sync-shared.mjs'), '--check'], { stdio: 'pipe' });
} catch (err) {
  fail(String(err.stderr || err.message).trim());
}

// ── Manifests ─────────────────────────────────────────────────────────────
// One package, one manifest per host family (see README, "What is inside").
// Every manifest names the plugin `quomerce` and carries the same version,
// and every MCP config points at the same server.
const MCP_URL = 'https://api.quomerce.com/mcp';
const MANIFESTS = {
  '.claude-plugin/plugin.json': { name: 'quomerce' },
  '.claude-plugin/marketplace.json': { name: 'quomerce' },
  'plugin.json': { name: 'quomerce' },
  '.agents/plugins/marketplace.json': { name: 'quomerce' },
  '.antigravity-plugin/plugin.json': { name: 'quomerce' },
  'gemini-extension.json': { name: 'quomerce', mcp: (j) => j.mcpServers?.quomerce?.httpUrl },
  '.mcp.json': { mcp: (j) => j.mcpServers?.quomerce?.type === 'http' && j.mcpServers.quomerce.url },
  'mcp.json': { mcp: (j) => j.mcpServers?.quomerce?.type === 'streamable-http' && j.mcpServers.quomerce.url },
  'mcp_config.json': { mcp: (j) => j.mcpServers?.quomerce?.serverUrl },
};
for (const [file, want] of Object.entries(MANIFESTS)) {
  if (!existsSync(join(root, file))) {
    fail(`${file}: missing`);
    continue;
  }
  let json;
  try {
    json = JSON.parse(read(file));
  } catch (err) {
    fail(`${file}: not valid JSON (${err.message})`);
    continue;
  }
  if (want.name && json.name !== want.name) fail(`${file}: name is "${json.name}", expected "${want.name}"`);
  if (want.mcp && want.mcp(json) !== MCP_URL) fail(`${file}: the quomerce MCP server must be ${MCP_URL} in this file's format`);
  if (typeof json.version === 'string') versions.set(file, json.version);
  for (const [i, p] of (json.plugins ?? []).entries()) {
    if (typeof p.version === 'string') versions.set(`${file} plugins[${i}]`, p.version);
  }
}
const distinct = new Set(versions.values());
if (distinct.size > 1) {
  fail(`versions differ: ${[...versions].map(([f, v]) => `${f}=${v}`).join(', ')}`);
}

if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log(`✓ ${skills.length} skills, ${Object.keys(MANIFESTS).length} manifests, version ${[...distinct][0] ?? 'none'}`);
