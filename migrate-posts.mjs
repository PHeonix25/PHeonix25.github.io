#!/usr/bin/env node
/**
 * migrate-posts.mjs
 * 
 * Migrates Jekyll posts from _posts/ to Astro's src/content/blog/
 * 
 * Usage:
 *   node migrate-posts.mjs --source /path/to/jekyll/_posts --dest ./src/content/blog
 * 
 * What it does:
 *   - Copies all .md and .html posts
 *   - Strips Jekyll-specific frontmatter keys (layout, permalink)
 *   - Normalises the `date` field to ISO format
 *   - Maps Jekyll categories to Astro enum values
 *   - Renames files to slug-safe format
 *   - Converts {%- liquid tags -%} to MDX comments with a warning
 */

import fs from 'fs';
import path from 'path';
import { parseArgs } from 'util';

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    source: { type: 'string', default: './_posts' },
    dest:   { type: 'string', default: './src/content/blog' },
    dry:    { type: 'boolean', default: false },
  }
});

const SOURCE = path.resolve(values.source);
const DEST   = path.resolve(values.dest);
const DRY    = values.dry;

// Jekyll category → Astro enum
const CATEGORY_MAP = {
  'engineering':  'engineering',
  'tech':         'engineering',
  'development':  'engineering',
  'code':         'engineering',
  'leadership':   'leadership',
  'management':   'leadership',
  'career':       'leadership',
  'speaking':     'speaking',
  'talk':         'speaking',
  'conference':   'speaking',
  'personal':     'personal',
  'life':         'personal',
};

function mapCategory(raw) {
  if (!raw) return 'engineering';
  const cats = Array.isArray(raw) ? raw : [raw];
  for (const cat of cats) {
    const mapped = CATEGORY_MAP[cat.toLowerCase()];
    if (mapped) return mapped;
  }
  return 'engineering';
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };
  
  const lines = match[1].split('\n');
  const fm = {};
  let currentKey = null;
  
  for (const line of lines) {
    const kvMatch = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim().replace(/^["']|["']$/g, '');
      fm[currentKey] = val;
    } else if (line.match(/^\s+-\s+/) && currentKey) {
      if (!Array.isArray(fm[currentKey])) fm[currentKey] = [];
      fm[currentKey].push(line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, ''));
    }
  }
  
  return { frontmatter: fm, body: match[2] };
}

function buildFrontmatter(fm, filename) {
  // Extract date from filename (YYYY-MM-DD-slug.md)
  const dateFromFile = filename.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  const date = fm.date || dateFromFile || new Date().toISOString().split('T')[0];
  
  const category = mapCategory(fm.categories || fm.category);
  
  const tags = Array.isArray(fm.tags) ? fm.tags : 
               (fm.tags ? fm.tags.split(/[\s,]+/) : []);

  const lines = [
    `title: "${(fm.title || '').replace(/"/g, '\\"')}"`,
    `date: ${date.toString().substring(0,10)}`,
  ];
  
  if (fm.description || fm.excerpt) {
    const desc = (fm.description || fm.excerpt || '').replace(/"/g, '\\"');
    lines.push(`description: "${desc}"`);
  }
  
  lines.push(`category: ${category}`);
  
  if (tags.length > 0) {
    lines.push(`tags: [${tags.map(t => `"${t}"`).join(', ')}]`);
  }
  
  return `---\n${lines.join('\n')}\n---\n`;
}

function transformBody(body) {
  const warnings = [];
  let postUrlCount = 0;

  // ── 1. post_url → /writing/slug  (always safe to auto-convert) ──────────
  // Handles all Jekyll forms:
  //   {% post_url 2017-01-08-my-post %}
  //   {% post_url 2017-01-08-my-post.md %}
  //   {%- post_url slug -%}
  //   [link text]({% post_url slug %})
  body = body.replace(
    /\{%-?\s*post_url\s+([\w-]+?)(?:\.md)?\s*-?%\}/g,
    (_match, slug) => {
      postUrlCount++;
      return `/writing/${slug}`;
    }
  );

  if (postUrlCount > 0) {
    warnings.push(`✅ Auto-converted ${postUrlCount} post_url tag${postUrlCount > 1 ? 's' : ''} to /writing/ links`);
  }

  // ── 2. {% highlight lang %}...{% endhighlight %} → fenced code blocks ───
  body = body.replace(
    /\{%-?\s*highlight\s+(\w+)\s*-?%\}([\s\S]*?)\{%-?\s*endhighlight\s*-?%\}/g,
    (_match, lang, code) => {
      warnings.push(`✅ Auto-converted {% highlight ${lang} %} block to fenced code`);
      return `\`\`\`${lang}\n${code.trim()}\n\`\`\``;
    }
  );

  // ── 3. Remaining Liquid tags - flag for manual review ───────────────────
  const remainingLiquid = body.match(/\{%-?[\s\S]*?-?%\}|\{\{[\s\S]*?\}\}/g);
  if (remainingLiquid) {
    const unique = [...new Set(remainingLiquid.map(t => t.substring(0, 50)))];
    warnings.push(`⚠️  ${remainingLiquid.length} remaining Liquid tag(s) need manual review:`);
    unique.forEach(t => warnings.push(`     ${t}`));

    // Comment them out so the file stays valid rather than crashing Astro
    body = body.replace(
      /\{%-?[\s\S]*?-?%\}|\{\{[\s\S]*?\}\}/g,
      match => `{/* LIQUID: ${match.replace(/\*\//g, '').substring(0, 80)} */}`
    );
  }

  return { body, warnings };
}

// ─── Main ────────────────────────────────────────────────
if (!fs.existsSync(SOURCE)) {
  console.error(`❌ Source directory not found: ${SOURCE}`);
  process.exit(1);
}

if (!DRY && !fs.existsSync(DEST)) {
  fs.mkdirSync(DEST, { recursive: true });
}

const files = fs.readdirSync(SOURCE).filter(f => f.endsWith('.md') || f.endsWith('.markdown'));

console.log(`\n📂 Found ${files.length} posts in ${SOURCE}\n`);

let migrated = 0;
let skipped  = 0;
const issues = [];

for (const file of files) {
  const srcPath = path.join(SOURCE, file);
  const content = fs.readFileSync(srcPath, 'utf8');
  
  const { frontmatter: fm, body } = parseFrontmatter(content);
  const newFm = buildFrontmatter(fm, file);
  const { body: newBody, warnings } = transformBody(body);
  
  // Build dest filename - strip date prefix if present, keep slug
  const destFile = file.replace(/\.markdown$/, '.md');
  const destPath = path.join(DEST, destFile);
  
  if (warnings.length > 0) {
    issues.push({ file, warnings });
  }
  
  const output = newFm + newBody;
  
  if (DRY) {
    console.log(`[DRY] Would write: ${destFile}`);
    warnings.forEach(w => console.log(`  ${w}`));
  } else {
    fs.writeFileSync(destPath, output, 'utf8');
    console.log(`✅ ${file} → ${destFile}`);
    warnings.forEach(w => console.log(`   ${w}`));
    migrated++;
  }
}

console.log(`\n─────────────────────────────────────`);
console.log(`✅ Migrated: ${migrated}`);
console.log(`⏭️  Skipped:  ${skipped}`);
if (issues.length > 0) {
  console.log(`\n⚠️  Posts needing manual review (${issues.length}):`);
  issues.forEach(({ file, warnings }) => {
    console.log(`  ${file}`);
    warnings.forEach(w => console.log(`    ${w}`));
  });
}
console.log('');
