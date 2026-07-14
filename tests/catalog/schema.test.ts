import { describe, expect, it } from 'vitest';
import { catalogEntrySchema } from '@/lib/catalog/schema';

const baseEntry = {
  id: 'deepseek-v3',
  kind: 'foundation-model',
  map: 'models',
  category: 'foundation-models',
  name: { en: 'DeepSeek-V3', zh: 'DeepSeek-V3' },
  summary: { en: 'Open-weight model.', zh: '开放权重模型。' },
  website: 'https://example.com',
  tags: ['llm'],
  regions: ['CN'],
  status: 'active',
  related: [],
  facts: { modalities: ['text'] },
  timeline: { released_at: '2024-12-26', provider_lane: 'deepseek', capabilities: ['reasoning'] },
  sources: [{ url: 'https://example.com/source', checked_at: '2026-07-14' }],
};

describe('catalogEntrySchema', () => {
  it('requires timeline metadata for a timeline entry', () => {
    const { timeline, ...withoutTimeline } = baseEntry;
    expect(catalogEntrySchema.safeParse(withoutTimeline).success).toBe(false);
  });

  it('rejects an entry missing a Chinese summary', () => {
    expect(
      catalogEntrySchema.safeParse({ ...baseEntry, summary: { en: 'Only English.' } }).success
    ).toBe(false);
  });
});
