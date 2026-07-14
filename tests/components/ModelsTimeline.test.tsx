import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ModelsTimeline } from '@/components/maps/ModelsTimeline';

const sampleEntry = {
  id: 'deepseek-v3',
  kind: 'foundation-model',
  map: 'models' as const,
  category: 'foundation-models',
  name: { en: 'DeepSeek-V3', zh: 'DeepSeek-V3' },
  summary: { en: 'x', zh: 'x' },
  website: 'https://example.com',
  tags: ['llm'],
  regions: ['CN'],
  status: 'active' as const,
  related: [],
  facts: { open_source: true },
  timeline: { released_at: '2024-12-26', provider_lane: 'deepseek', capabilities: ['reasoning'] },
  sources: [{ url: 'https://example.com', checked_at: '2026-07-14' }],
};

it('groups models by provider lane and exposes their release date', () => {
  render(<ModelsTimeline entries={[sampleEntry]} locale="en" />);
  expect(screen.getByRole('rowheader', { name: 'deepseek' })).toBeInTheDocument();
  expect(screen.getByText('Dec 26')).toBeInTheDocument();
});
