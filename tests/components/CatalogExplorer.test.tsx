import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { CatalogExplorer } from '@/components/catalog/CatalogExplorer';

it('filters entries by text and map', () => {
  render(
    <CatalogExplorer
      locale="en"
      entries={[
        {
          id: 'deepseek-v3',
          map: 'models',
          name: { en: 'DeepSeek-V3', zh: 'DeepSeek-V3' },
          summary: { en: 'model', zh: '模型' },
          tags: ['llm'],
        },
      ]}
    />
  );
  fireEvent.change(screen.getByLabelText('Search catalog'), {
    target: { value: 'deepseek' },
  });
  expect(screen.getByText('DeepSeek-V3')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Map'), {
    target: { value: 'apps-saas' },
  });
  expect(screen.queryByText('DeepSeek-V3')).not.toBeInTheDocument();
});
