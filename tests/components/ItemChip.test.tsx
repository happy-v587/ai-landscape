import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ItemChip } from '@/components/maps/ItemChip';
import type { CatalogEntry } from '@/lib/catalog/types';

const entry: CatalogEntry = {
  id: 'cursor',
  kind: 'coding-agent',
  map: 'agent-tools',
  category: 'coding-agents',
  name: { en: 'Cursor', zh: 'Cursor' },
  summary: { en: 'AI-first code editor.', zh: 'AI 优先的代码编辑器。' },
  website: 'https://cursor.com/',
  tags: ['ide'],
  regions: ['US'],
  status: 'active',
  related: [],
  facts: {},
  sources: [{ url: 'https://cursor.com/', checked_at: '2026-07-14' }],
};

it('renders the entry name and a monogram fallback', () => {
  render(<ItemChip entry={entry} entries={[entry]} locale="en" size="primary" />);
  expect(screen.getByText('Cursor')).toBeInTheDocument();
  expect(screen.getByLabelText('Cursor monogram')).toBeInTheDocument();
});
