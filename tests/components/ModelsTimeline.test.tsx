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

it('orders months newest-first so the latest releases need no scrolling', () => {
  const newerEntry = {
    ...sampleEntry,
    id: 'deepseek-r1',
    name: { en: 'DeepSeek-R1', zh: 'DeepSeek-R1' },
    timeline: { released_at: '2025-01-20', provider_lane: 'deepseek', capabilities: ['reasoning'] },
  };
  render(<ModelsTimeline entries={[sampleEntry, newerEntry]} locale="en" />);
  const older = screen.getByText('Dec 2024');
  const newer = screen.getByText('Jan 2025');
  expect(newer.compareDocumentPosition(older) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});
