#!/usr/bin/env node
// Copies shared/*.md into every skill's references/ folder.
//
// A skill must be self-contained: claude.ai and Cowork upload one skill
// folder at a time, `npx skills` copies one folder, and no host follows a
// link out of a skill. So the references every skill needs live once in
// shared/ and are copied here. Edit shared/, never the copies.
//
//   node scripts/sync-shared.mjs          write the copies
//   node scripts/sync-shared.mjs --check  exit 1 if a copy is out of date

import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const check = process.argv.includes('--check');
const banner = (file) =>
  `<!-- Copied from shared/${file} by scripts/sync-shared.mjs. Edit that file, not this one. -->\n\n`;

const shared = readdirSync(join(root, 'shared')).filter((f) => f.endsWith('.md'));
const skills = readdirSync(join(root, 'skills'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

let stale = 0;
for (const skill of skills) {
  const dir = join(root, 'skills', skill, 'references');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  for (const file of shared) {
    const want = banner(file) + readFileSync(join(root, 'shared', file), 'utf8');
    const target = join(dir, file);
    const have = existsSync(target) ? readFileSync(target, 'utf8') : null;
    if (have === want) continue;
    if (check) {
      console.error(`out of date: skills/${skill}/references/${file} (run node scripts/sync-shared.mjs)`);
      stale++;
    } else {
      writeFileSync(target, want);
      console.log(`wrote skills/${skill}/references/${file}`);
    }
  }
}
process.exit(stale ? 1 : 0);
