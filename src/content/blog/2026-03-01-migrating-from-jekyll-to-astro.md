---
title: "Migrating from Jekyll to Astro"
date: 2026-03-01
description: "After eight years on Jekyll and GitHub Pages, I redesigned hermens.com.au from scratch using Astro - new design, better reading experience, and a migration script that handled most of the heavy lifting."
category: engineering
tags: [astro, jekyll, github-pages, migration, css, design]
---

I've been running this blog on Jekyll since 2016. For most of that time it's been fine - GitHub Pages handles the hosting for free, posts are just Markdown files, and it largely stays out of the way. But after eight years, a growing backlog of things I want to write about, and a site that was genuinely unpleasant to read, I decided to scrap it and start fresh.

This post documents what I did, why I made the decisions I made, and the specific technical steps in case it's useful to anyone else doing the same thing.

## Why leave Jekyll

Jekyll isn't bad. But it has accumulated some friction over the years that I'd stopped noticing until I sat down to actually think about it:

- **Slow local builds** as the post count grows - Ruby, Bundler, and the gem dependency chain all take time to set up on a new machine
- **Limited component model** - customising a Jekyll theme means overriding `_includes` and `_layouts` files, which works but leaves you maintaining a fork of someone else's structure
- **Liquid templating** - fine for simple cases, but the moment you want to do anything non-trivial it becomes verbose fast
- **No modern tooling** - no Vite, no TypeScript support out of the box, no content collections

The thing I actually cared about most was the reading experience. I want to write long-form technical posts and I want people to be able to read them comfortably. The old site wasn't set up for that.

## Why Astro

I looked at a few options - Next.js, Hugo, Gatsby - before settling on Astro. The reasons were pretty straightforward:

**Content-first by design.** Astro's content collections give you a typed, schema-validated layer over your Markdown files. You define what frontmatter fields a post requires and TypeScript enforces it at build time. That's the kind of guardrail I actually want.

**Jekyll posts migrate almost directly.** Astro uses the same Markdown + YAML frontmatter format that Jekyll does. Most posts need minimal changes - the filenames stay the same, the content stays the same, and the frontmatter keys mostly translate 1:1.

**GitHub Pages deployment is straightforward.** The `withastro/action` GitHub Action handles the build and deploy in about 15 lines of YAML. No more relying on GitHub's built-in Jekyll support.

**Stays out of your way.** Astro doesn't push you toward React or any other framework. I wrote plain CSS and Astro components, which compile to zero JavaScript by default. The result is fast.

## Designing the new site

Before writing any code, I built an HTML mockup to validate the design direction. The goal was sharp, modern, and optimised for long-form reading - high contrast, geometric structure, distinctive typography.

The design uses three font families:

- **Barlow Condensed** (display) - for headings, the site name, and any large typographic elements. The condensed weight gives it a strong editorial presence without taking up too much space.
- **Newsreader** (body) - an optical-size serif designed specifically for on-screen reading. It's comfortable at body sizes in a way that most sans-serifs aren't.
- **JetBrains Mono** (monospace) - for all metadata: dates, categories, nav links, reading times. Gives those elements a technical, precise character that fits the content.

The colour palette went through one revision. My first pass used electric chartreuse (`#e8ff47`) as the primary accent, which looked striking but had accessibility problems - the contrast ratio against the near-black background was fine for large elements but marginal for body text. I swapped it for:

- **Cyan `#00d4d4`** - 7.2:1 contrast ratio on the background, AAA compliant
- **Orange `#ff7a3d`** - 4.8:1, AA compliant, used for the leadership category and callout borders
- **Background `#1c1e22`** - a dark blue-grey rather than pure black, which reads as softer and less fatiguing over long sessions

All text colours were checked against WCAG AA/AAA thresholds before finalising:

| Role | Colour | Contrast |
|---|---|---|
| Body text | `#d0d4db` | 9.8:1 ✅ |
| Supporting text | `#b8bec8` | 7.1:1 ✅ |
| UI / metadata | `#9aa0aa` | 4.6:1 ✅ |
| Accent (cyan) | `#00d4d4` | 7.2:1 ✅ |
| Secondary (orange) | `#ff7a3d` | 4.8:1 ✅ |

## Project structure

The final Astro project looks like this:

```
src/
├── components/
│   ├── Nav.astro
│   ├── Footer.astro
│   ├── PostCard.astro      # Card for the 3-column grid
│   └── PostRow.astro       # Row for the year-grouped archive
├── content/
│   ├── config.ts           # Content collection schema
│   └── blog/               # Posts live here
├── layouts/
│   ├── BaseLayout.astro    # HTML shell, meta tags, OG, RSS link
│   └── ArticleLayout.astro # Reading layout with TOC and drop cap
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── archive.astro
│   ├── 404.astro
│   ├── feed.xml.ts
│   └── writing/
│       ├── index.astro     # Filterable post grid
│       └── [slug].astro    # Dynamic article pages
└── styles/
    └── global.css          # Design tokens and base styles
```

The content collection schema defines what frontmatter is valid for a blog post:

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    category: z.enum(['engineering', 'leadership', 'speaking', 'personal'])
      .default('engineering'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});
```

The `draft: true` flag is particularly useful - drafts are visible in local development but excluded from production builds.

## Article reading experience

The article layout was the part I spent the most time on. A few decisions worth calling out:

**Table of contents with scrollspy.** The TOC is built from the post's `h2` and `h3` headings using JavaScript at runtime, then an `IntersectionObserver` tracks which heading is in view and highlights the corresponding TOC entry. No library needed - about 25 lines of vanilla JS.

**Drop cap.** The `::first-letter` pseudo-element on the first paragraph gives articles a proper editorial opener. Combined with the Barlow Condensed display font at `4.2rem`, it gives each post a distinct visual start.

**Code block styling.** Astro uses Shiki for syntax highlighting, which runs at build time and produces zero client-side JavaScript. The `one-dark-pro` theme fits the colour palette well. All code blocks get a left border in the accent cyan colour to make them visually distinct from prose.

**Sticky TOC sidebar.** On wide viewports the TOC sits in a sticky sidebar to the right of the prose column, positioned so it scrolls with you. On narrower viewports it disappears - the post is readable without it.

## Migrating posts

The migration from Jekyll to Astro was mostly mechanical. I wrote a Node.js script - `migrate-posts.mjs` - that handles the conversion automatically.

The initial version just flagged any file containing Liquid tags for manual review. That turned out to be too conservative - most of my posts only contained Liquid for two specific things that could be converted automatically.

The final script handles them in order:

**`post_url` tags** are the most common. Jekyll uses them for internal links:

```liquid
[Read my earlier post]({% post_url 2017-01-08-my-post-title %})
```

In Astro, posts are served at `/writing/[slug]` where the slug is the filename minus `.md`. Since I kept the same filenames, every `post_url` reference maps directly to a `/writing/` path. The script converts them with a single regex:

```javascript
body = body.replace(
  /\{%-?\s*post_url\s+([\w-]+?)(?:\.md)?\s*-?%\}/g,
  (_match, slug) => `/writing/${slug}`
);
```

**`{% highlight %}` blocks** are Jekyll's code fence syntax. They convert directly to standard Markdown fenced code blocks, preserving the language identifier:

```javascript
body = body.replace(
  /\{%-?\s*highlight\s+(\w+)\s*-?%\}([\s\S]*?)\{%-?\s*endhighlight\s*-?%\}/g,
  (_match, lang, code) => `\`\`\`${lang}\n${code.trim()}\n\`\`\``
);
```

Anything else that remains gets commented out with a `{/* LIQUID: ... */}` marker and logged to the console, so you know exactly which files need a manual look.

Running it looks like this:

```bash
# Dry run - see what will change without writing anything
node migrate-posts.mjs --source ../_posts --dry

# Then for real
node migrate-posts.mjs --source ../_posts --dest ./src/content/blog
```

## Deployment

Deployment to GitHub Pages uses the official Astro GitHub Action. The workflow file is straightforward:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - uses: actions/configure-pages@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
```

One thing to note: in your repo's GitHub Pages settings, you need to switch the source from the legacy "Deploy from a branch" option to **GitHub Actions**. It's a one-click change under Settings → Pages, but it's easy to miss.

## What I'd do differently

A few things I'd approach differently if I were starting again:

**Start with the content collection schema.** I defined it fairly late in the process, after I'd already written several components. Defining the schema first and letting TypeScript enforce it throughout would have caught a few frontmatter inconsistencies earlier.

**Write the migration script before the site.** I built the site first, then wrote the migration script. Doing it in the opposite order would have let me validate the schema against real posts earlier and catch edge cases in the frontmatter before they became component bugs.

**Keep a changelog for the design.** The accessibility pass on the colour palette was the right call but it happened mid-process. Tracking design decisions and their rationale as they're made - even just in a scratch file - would have saved some back-and-forth.

## Result

The new site is faster, more readable, and easier to extend. Build times are well under a second for the current post count. The TOC, drop caps, and code block styling make long technical posts significantly more pleasant to read. And writing new posts is identical to before - just a Markdown file with YAML frontmatter dropped into `src/content/blog/`.

If you're on Jekyll and have been thinking about moving, Astro is worth a serious look. The migration is more mechanical than it sounds, and the result is a considerably better platform for writing.
