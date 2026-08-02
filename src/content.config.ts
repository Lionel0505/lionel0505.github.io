import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  // Content Layer API. There is no `type: 'content'` in Astro 7.
  // base is the cases directory, so an entry's id is "fr/sif" or "en/sif".
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  // Only fields that cannot be derived from somewhere else.
  //   lang    -> the fr/ or en/ directory already encodes it
  //   weight  -> order === 1 is the major case
  //   diagram -> dispatched on the slug
  // Every one of those was a second source of truth waiting to disagree.
  schema: z.object({
    order: z.number().int().positive(),
    role: z.enum(['or', 'tl', 'yw', 'lv']),
    client: z.string().min(1),
    period: z.string().min(1),
    stack: z.array(z.string()).min(1),
    title: z.string().min(1).max(80),
    teaser: z.string().min(1).max(280),
    // Content rule 6, made mechanical: no case ships without declaring its sources.
    // Range runs to F, not E: the F markers are Lionel's own recorded feedback,
    // the highest-authority source, and a schema that rejected them would be
    // the defect. \d{1,2} because some refs (e.g. F12) run past a single digit.
    sourceRefs: z.array(z.string().regex(/^[A-F]\d{1,2}$|^[A-ZÉ]+$/)).min(1),
  }),
});

export const collections = { cases };
