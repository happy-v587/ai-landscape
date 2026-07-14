import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MapShell } from '@/components/maps/MapShell';

it('renders a model-infra capability section', () => {
  render(
    <MapShell
      map="model-infra"
      entries={[
        {
          id: 'vllm',
          kind: 'inference-engine',
          map: 'model-infra',
          category: 'inference',
          name: { en: 'vLLM', zh: 'vLLM' },
          summary: { en: 'x', zh: 'x' },
          website: 'https://example.com',
          tags: ['inference'],
          regions: ['US'],
          status: 'active',
          related: [],
          facts: {},
          sources: [{ url: 'https://example.com', checked_at: '2026-07-14' }],
        },
      ]}
      locale="en"
      categoryLabels={{ inference: 'Inference' }}
    />
  );
  expect(screen.getByRole('heading', { name: 'Inference' })).toBeInTheDocument();
});
