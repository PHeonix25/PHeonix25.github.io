import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    category: z.enum(['engineering', 'leadership', 'speaking', 'personal', 'books']).default('engineering'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Jekyll compat aliases
    layout: z.string().optional(),
    permalink: z.string().optional(),
  }),
});

export const collections = { blog };
