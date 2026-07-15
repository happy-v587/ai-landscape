import { z } from 'zod';
import { mapIds } from './types';

const localizedText = z.object({ en: z.string().min(1), zh: z.string().min(1) });
const source = z.object({ url: z.string().url(), checked_at: z.iso.date() });
const timeline = z.object({
  released_at: z.iso.date(),
  provider_lane: z.string().min(1),
  capabilities: z.array(z.string().min(1)).min(1),
});

export const catalogEntrySchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    kind: z.string().min(1),
    map: z.enum(mapIds),
    category: z.string().min(1),
    name: localizedText,
    summary: localizedText,
    website: z.string().url(),
    logo: z.string().optional(),
    organization: z.string().optional(),
    subcategory: z.string().min(1).optional(),
    tags: z.array(z.string()).min(1),
    regions: z.array(z.string()).min(1),
    status: z.enum(['active', 'archived']),
    related: z.array(z.string()),
    facts: z.record(z.string(), z.unknown()),
    timeline: timeline.optional(),
    sources: z.array(source).min(1),
  })
  .superRefine((entry, ctx) => {
    if (entry.map === 'models' && entry.kind === 'foundation-model' && !entry.timeline) {
      ctx.addIssue({
        code: 'custom',
        path: ['timeline'],
        message: 'Foundation models require timeline metadata.',
      });
    }
    if (entry.map !== 'models' && entry.timeline) {
      ctx.addIssue({
        code: 'custom',
        path: ['timeline'],
        message: 'Only model-map entries may define timeline metadata.',
      });
    }
  });
