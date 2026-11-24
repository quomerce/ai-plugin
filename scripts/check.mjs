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
  for (const [, ref] of text.matchAll(/`(references\/[^`\s]+\.md)`/g)) {
    if (!existsSync(join(root, 'skills', dir, ref))) fail(`${where}: names ${ref}, which does not exist`);
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
// Every JSON manifest that carries a version must carry the same one.
const MANIFESTS = [
  '.claude-plugin/plugin.json',
  '.claude-plugin/marketplace.json',
  '.mcp.json',
];
for (const file of MANIFESTS) {
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
  if (typeof json.version === 'string') versions.set(file, json.version);
}
const distinct = new Set(versions.values());
if (distinct.size > 1) {
  fail(`versions differ: ${[...versions].map(([f, v]) => `${f}=${v}`).join(', ')}`);
}

if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`);
  process.exit(1);
}
console.log(`✓ ${skills.length} skills, ${MANIFESTS.length} manifests, version ${[...distinct][0] ?? 'none'}`);
