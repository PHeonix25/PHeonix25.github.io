#!/usr/bin/env node
/**
 * migrate-assets.mjs
 *
 * Migrates images and other assets from a Jekyll site to the Astro public/
 * directory, then rewrites all image references in your already-migrated posts.
 *
 * Usage:
 *   node migrate-assets.mjs --jekyll ../PHeonix25.github.io --dest .
 *   node migrate-assets.mjs --jekyll ../PHeonix25.github.io --dest . --dry
 *
 * Options:
 *   --jekyll  Path to the root of your Jekyll repo   (default: ../PHeonix25.github.io)
 *   --dest    Path to the root of your Astro project (default: .)
 *   --dry     Preview changes without writing anything
 *
 * What it does:
 *   1. Finds all image/asset files in the Jekyll repo under common locations:
 *        assets/img/, assets/images/, assets/, images/, img/, _assets/
 *   2. Copies them into public/assets/ in your Astro project,
 *      preserving the relative subdirectory structure within each source folder.
 *   3. Scans every .md file in src/content/blog/ and rewrites image references:
 *        - Markdown:  ![alt]({{ site.baseurl }}/assets/img/foo.png)
 *        - Markdown:  ![alt](/assets/img/foo.png)
 *        - Markdown:  ![alt](../assets/img/foo.png)  (relative paths)
 *        - HTML:      <img src="{{ site.baseurl }}/assets/img/foo.png" ...>
 *        - HTML:      <img src="/assets/img/foo.png" ...>
 *      All rewritten to: ![alt](/assets/foo.png)  (Astro public/ relative)
 *   4. Reports anything it couldn't resolve automatically.
 */

import fs   from 'fs';
import path from 'path';
import { parseArgs } from 'util';

// ─── CLI args ─────────────────────────────────────────────────────────────────

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    jekyll: { type: 'string', default: '../PHeonix25.github.io' },
    dest:   { type: 'string', default: '.' },
    dry:    { type: 'boolean', default: false },
  },
});

const JEKYLL = path.resolve(values.jekyll);
const DEST   = path.resolve(values.dest);
const DRY    = values.dry;

// Where Astro serves static files from
const PUBLIC_DIR  = path.join(DEST, 'public');
// Where we'll put migrated assets inside public/
const ASSETS_DEST = path.join(PUBLIC_DIR, 'assets');
// The URL path that will work in Astro (served from public/)
const ASSETS_URL  = '/assets';

// Where to look for assets in the Jekyll repo, in priority order.
// We'll search all of these and de-duplicate by filename.
const JEKYLL_ASSET_DIRS = [
  'assets/img',
  'assets/images',
  'assets',
  'images',
  'img',
  '_assets',
];

// File extensions to treat as assets worth migrating
const ASSET_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif',
  '.pdf', '.zip',
  '.mp4', '.webm', '.mov',
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(msg)  { console.log(msg); }
function info(msg) { console.log(`   ${msg}`); }
function ok(msg)   { console.log(`   ✅ ${msg}`); }
function warn(msg) { console.log(`   ⚠️  ${msg}`); }
function err(msg)  { console.error(`   ❌ ${msg}`); }

/** Recursively collect all files under a directory. */
function walkDir(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

/** Copy a file, creating parent directories as needed. */
function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// ─── Step 1: Discover all Jekyll assets ───────────────────────────────────────

log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
log('  Jekyll → Astro Asset Migration');
log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

if (!fs.existsSync(JEKYLL)) {
  err(`Jekyll repo not found at: ${JEKYLL}`);
  err(`Pass the correct path with --jekyll /path/to/repo`);
  process.exit(1);
}

log(`📂 Jekyll repo : ${JEKYLL}`);
log(`📂 Astro root  : ${DEST}`);
log(`📂 Assets dest : ${ASSETS_DEST}`);
log(`${DRY ? '🔍 DRY RUN - no files will be written\n' : ''}`);

// Build a map: filename (lowercase) → { srcPath, relPath }
// relPath is relative to the asset source dir so we can preserve subdirs.
// We also keep an ordered list so we can write them all out.
/** @type {Map<string, { srcPath: string, relFromAssetDir: string, assetDir: string }>} */
const assetMap = new Map();

let totalFound = 0;

for (const assetDir of JEKYLL_ASSET_DIRS) {
  const absDir = path.join(JEKYLL, assetDir);
  if (!fs.existsSync(absDir)) continue;

  const files = walkDir(absDir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!ASSET_EXTENSIONS.has(ext)) continue;

    const relFromAssetDir = path.relative(absDir, file);
    // Key by the file's path relative to its asset dir, normalised.
    const key = relFromAssetDir.toLowerCase().replace(/\\/g, '/');

    if (!assetMap.has(key)) {
      assetMap.set(key, { srcPath: file, relFromAssetDir, assetDir });
      totalFound++;
    }
    // If already seen (e.g. same file in assets/ and assets/img/), first wins.
  }
}

log(`🔎 Found ${totalFound} asset file${totalFound !== 1 ? 's' : ''} in Jekyll repo\n`);

if (totalFound === 0) {
  warn('No assets found. Check that --jekyll points to your Jekyll repo root.');
  warn(`Searched: ${JEKYLL_ASSET_DIRS.map(d => path.join(JEKYLL, d)).join(', ')}`);
}

// ─── Step 2: Copy assets to public/assets/ ────────────────────────────────────

log('── Step 1: Copying assets ──────────────────────\n');

let copied   = 0;
let skipped  = 0;

// Also build a lookup we'll need for rewriting: maps the original Jekyll
// asset path (as it would appear in a URL, e.g. /assets/img/foo.png) to
// the new Astro URL (/assets/foo.png or /assets/subdir/foo.png).
/** @type {Map<string, string>} */
const urlRewriteMap = new Map();

for (const [key, { srcPath, relFromAssetDir, assetDir }] of assetMap) {
  const filename     = path.basename(relFromAssetDir);
  // Preserve subdir structure within the asset dir, but flatten the
  // top-level dir name (assets/img/ → assets/, images/ → assets/, etc.)
  const relSubdir    = path.dirname(relFromAssetDir);
  const destRelPath  = relSubdir === '.' ? filename : path.join(relSubdir, filename);
  const destFullPath = path.join(ASSETS_DEST, destRelPath);
  // New URL as Astro will serve it
  const newUrl       = `${ASSETS_URL}/${destRelPath.replace(/\\/g, '/')}`;

  // Register rewrites for every variant of the old URL that might appear
  // in posts:  /assets/img/foo.png, /images/foo.png, /img/foo.png, etc.
  const variants = [
    // Absolute path from Jekyll asset dir
    `/${assetDir}/${relFromAssetDir}`.replace(/\\/g, '/'),
    // Just the filename - some posts use bare filenames
    `/${filename}`,
  ];
  for (const v of variants) {
    if (!urlRewriteMap.has(v)) urlRewriteMap.set(v, newUrl);
  }
  // Also register without leading slash for relative-path references
  urlRewriteMap.set(variants[0].replace(/^\//, ''), newUrl);

  if (DRY) {
    log(`  [DRY] ${path.relative(JEKYLL, srcPath).replace(/\\/g, '/')} → public/${destRelPath.replace(/\\/g, '/')}`);
    copied++;
    continue;
  }

  if (fs.existsSync(destFullPath)) {
    // Don't re-copy if identical
    const srcStat  = fs.statSync(srcPath);
    const destStat = fs.statSync(destFullPath);
    if (srcStat.size === destStat.size) {
      skipped++;
      continue;
    }
  }

  copyFile(srcPath, destFullPath);
  log(`  ✅ ${path.relative(JEKYLL, srcPath).replace(/\\/g, '/')} → public/${destRelPath.replace(/\\/g, '/')}`);
  copied++;
}

log(`\n   Copied:  ${copied}`);
log(`   Skipped (already exists): ${skipped}\n`);

// ─── Step 3: Rewrite image references in migrated posts ───────────────────────

log('── Step 2: Rewriting image references in posts ─\n');

const POSTS_DIR = path.join(DEST, 'src', 'content', 'blog');

if (!fs.existsSync(POSTS_DIR)) {
  warn(`Posts directory not found: ${POSTS_DIR}`);
  warn('Skipping reference rewriting.');
  process.exit(0);
}

const postFiles = walkDir(POSTS_DIR).filter(f => f.endsWith('.md'));
log(`   Found ${postFiles.length} post${postFiles.length !== 1 ? 's' : ''} to scan\n`);

let postsUpdated = 0;
let totalRewrites = 0;
const unresolvedByPost = [];

for (const postPath of postFiles) {
  const original = fs.readFileSync(postPath, 'utf8');
  let updated = original;
  let rewrites = 0;
  const unresolved = [];

  // ── Pattern A: {{ site.baseurl }}/path/to/img.png ───────────────────────
  // Covers both Markdown and HTML src= attributes
  updated = updated.replace(
    /\{\{\s*site\.baseurl\s*\}\}([^\s"')>]+\.(png|jpg|jpeg|gif|webp|svg|avif|pdf))/gi,
    (_match, assetPath) => {
      const norm = assetPath.replace(/\\/g, '/');
      const newUrl = resolveAssetUrl(norm, urlRewriteMap);
      if (newUrl) { rewrites++; return newUrl; }
      unresolved.push(norm);
      return _match; // leave unchanged so the author can fix it
    }
  );

  // ── Pattern B: Standard absolute paths - /assets/..., /images/..., /img/...
  // Markdown: ![alt](/assets/img/foo.png)
  // HTML:     src="/assets/img/foo.png"
  updated = updated.replace(
    /(!\[[^\]]*\]\(|src=["'])(\/(assets|images?|img)[^\s"')>]*\.(png|jpg|jpeg|gif|webp|svg|avif|pdf))(["')]?)/gi,
    (_match, prefix, assetPath, _dir, _ext, suffix) => {
      const newUrl = resolveAssetUrl(assetPath, urlRewriteMap);
      if (newUrl) { rewrites++; return `${prefix}${newUrl}${suffix}`; }
      unresolved.push(assetPath);
      return _match;
    }
  );

  // ── Pattern C: Relative paths - ../assets/img/foo.png or ./img/foo.png ──
  updated = updated.replace(
    /(!\[[^\]]*\]\(|src=["'])(\.\.?\/[^\s"')>]*\.(png|jpg|jpeg|gif|webp|svg|avif|pdf))(["')]?)/gi,
    (_match, prefix, assetPath, _ext, suffix) => {
      // Strip leading ../ or ./ and try to resolve
      const stripped = '/' + assetPath.replace(/^(\.\.?\/)+/, '');
      const newUrl = resolveAssetUrl(stripped, urlRewriteMap);
      if (newUrl) { rewrites++; return `${prefix}${newUrl}${suffix}`; }
      unresolved.push(assetPath);
      return _match;
    }
  );

  if (rewrites > 0 || unresolved.length > 0) {
    const postName = path.relative(POSTS_DIR, postPath).replace(/\\/g, '/');
    log(`  📄 ${postName}`);

    if (rewrites > 0) {
      ok(`${rewrites} reference${rewrites !== 1 ? 's' : ''} rewritten`);
      totalRewrites += rewrites;
      postsUpdated++;
    }

    if (unresolved.length > 0) {
      unresolved.forEach(u => warn(`Unresolved: ${u}`));
      unresolvedByPost.push({ post: path.relative(POSTS_DIR, postPath), unresolved });
    }

    if (!DRY && rewrites > 0) {
      fs.writeFileSync(postPath, updated, 'utf8');
    }
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────

log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
log('  Summary');
log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
log(`  Assets copied   : ${copied}`);
log(`  Assets skipped  : ${skipped}`);
log(`  Posts scanned   : ${postFiles.length}`);
log(`  Posts updated   : ${postsUpdated}`);
log(`  References fixed: ${totalRewrites}`);

if (unresolvedByPost.length > 0) {
  log(`\n  ⚠️  Unresolved references (${unresolvedByPost.reduce((n, p) => n + p.unresolved.length, 0)}):`);
  log('  These images were referenced in posts but not found in the Jekyll asset dirs.');
  log('  You may need to copy them manually into public/assets/\n');
  for (const { post, unresolved } of unresolvedByPost) {
    log(`  📄 ${post}`);
    unresolved.forEach(u => log(`       ${u}`));
  }
}

if (DRY) {
  log('\n  🔍 Dry run complete - no files were written.');
  log('  Run without --dry to apply changes.\n');
} else {
  log('\n  ✅ Done. Run `npm run dev` to verify images are loading.\n');
}

// ─── Resolver helper ─────────────────────────────────────────────────────────

/**
 * Try to resolve a Jekyll asset path to an Astro public/ URL.
 * Falls back to a best-effort match on just the filename.
 *
 * @param {string} assetPath  e.g. "/assets/img/foo.png"
 * @param {Map<string, string>} urlMap
 * @returns {string|null}
 */
function resolveAssetUrl(assetPath, urlMap) {
  const norm = assetPath.replace(/\\/g, '/');

  // 1. Exact match
  if (urlMap.has(norm)) return urlMap.get(norm);

  // 2. Without leading slash
  const noSlash = norm.replace(/^\//, '');
  if (urlMap.has(noSlash)) return urlMap.get(noSlash);

  // 3. Filename-only fallback - works when the subdir structure differs
  const filename = path.basename(norm).toLowerCase();
  for (const [key, val] of urlMap) {
    if (path.basename(key).toLowerCase() === filename) return val;
  }

  return null;
}
