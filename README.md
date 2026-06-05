# hermens.com.au - Astro Blog

Redesigned blog for [hermens.com.au](https://hermens.com.au) - migrated from Jekyll to Astro.

## Stack

- **[Astro 6](https://astro.build)** - static site generator (content collections via the `glob` loader)
- **Vanilla CSS** - no Tailwind; all design tokens via CSS custom properties
- **Shiki** - syntax highlighting (theme: `one-dark-pro`)
- **GitHub Actions** - build and deploy to GitHub Pages
- **`@astrojs/rss`** - RSS feed at `/feed.xml`
- **`@astrojs/sitemap`** - auto-generated sitemap

## Local development

```powershell
npm install
npm run dev       # http://localhost:4321
npm run build     # production build into ./dist
npm run preview   # preview the production build locally
```

Requires Node 20+.

## Project structure

```plain
public/
├── CNAME                    # Custom domain for GitHub Pages (hermens.com.au)
├── favicon.svg
└── assets/                  # Static assets passed through as-is

src/
├── content.config.ts        # Content collection schema + glob loader
├── components/
│   ├── Nav.astro            # Sticky nav with mobile hamburger
│   ├── Footer.astro
│   ├── PostCard.astro       # Card for the 3-col grid
│   └── PostRow.astro        # Row for the archive list
├── content/
│   └── blog/                # ← Your posts live here
│       └── YYYY-MM-DD-slug.md
├── layouts/
│   ├── BaseLayout.astro     # HTML shell + meta + nav + footer
│   └── ArticleLayout.astro  # Reading layout with TOC
├── pages/
│   ├── index.astro          # Homepage
│   ├── about.astro
│   ├── archive.astro        # All posts grouped by year
│   ├── speaking.astro       # Talks list
│   ├── speaking/
│   │   └── video.astro      # Video gallery
│   ├── smart-home.astro     # Home automation context page
│   ├── privacy.astro        # Privacy policy
│   ├── 404.astro
│   ├── feed.xml.ts          # RSS feed
│   └── writing/
│       ├── index.astro      # Filterable post grid
│       └── [slug].astro     # Individual post page
└── styles/
    └── global.css           # Design tokens + base styles
```

## Writing posts

Create a new file in `src/content/blog/`:

```plain
src/content/blog/YYYY-MM-DD-my-post-title.md
```

**Frontmatter:**

```yaml
---
title: "Your post title"
date: 2024-03-15
description: "One or two sentences for previews and SEO."
category: engineering   # engineering | leadership | speaking | personal | books
tags: [dotnet, azure]
draft: false            # true = hidden from prod, visible in dev
---

Your content here in Markdown...
```

Category styling lives in [`src/styles/global.css`](src/styles/global.css) (`.cat-eng`, `.cat-lead`, `.cat-speak`, `.cat-per`, `.cat-book`). To add a new category: extend the `z.enum([...])` in [`src/content.config.ts`](src/content.config.ts), add a `cat-*` class in global.css, wire it into the three category maps in `PostCard.astro`, `PostRow.astro`, and `ArticleLayout.astro`, and add it to the filter bar in `src/pages/writing/index.astro`.

## Migrating from Jekyll

Run the migration script against your old `_posts/` directory:

```powershell
# Dry run - preview what would change
node migrate-posts.mjs --source ../PHeonix25.github.io/_posts --dry

# For real
node migrate-posts.mjs --source ../PHeonix25.github.io/_posts --dest ./src/content/blog
```

The script:

- Copies all `.md` / `.markdown` files
- Normalises frontmatter to Astro's schema
- Maps Jekyll categories to the Astro enum
- Flags posts containing Liquid tags for manual review

## Deployment

The site lives in the **`PHeonix25/PHeonix25.github.io`** repo and is served by GitHub Pages at `hermens.com.au`. Push to `main` and the workflow at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) will:

1. Install dependencies (`npm ci`)
2. Build (`npm run build`)
3. Deploy `./dist` to GitHub Pages

The `public/CNAME` file is what keeps the custom domain attached on every deploy.

**One-time GitHub setup:**

1. Go to repo **Settings → Pages**
2. Set Source to **GitHub Actions** (not the legacy "Deploy from a branch" option)
3. Confirm the custom domain reads `hermens.com.au`
4. Push to `main` - it deploys automatically

The site URL (`https://hermens.com.au`) is set in `astro.config.mjs`.

### First-time migration from the Jekyll repo

See [`deploy.ps1`](deploy.ps1) — it archives the existing Jekyll site on a branch, then publishes this Astro source to the same repo so the GitHub Pages + custom-domain setup carries over with no DNS changes.

## Design tokens

All colours, fonts, and spacing are in `src/styles/global.css`:

```css
:root {
  --black:   #1c1e22;   /* page background */
  --accent:  #00d4d4;   /* cyan - primary accent */
  --accent2: #ff7a3d;   /* orange - secondary / leadership category */
  --accent3: #4ade80;   /* green - speaking category */
  --accent4: #a8b2bc;   /* gray - personal category */
  --accent5: #f5b941;   /* amber - books category */
  /* ... */
}
```
