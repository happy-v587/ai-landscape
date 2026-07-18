import { fireEvent, render, screen } from '@testing-library/react';
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

it('renders the entry name and a logo derived from website', () => {
  const { container } = render(<ItemChip entry={entry} entries={[entry]} locale="en" size="primary" />);
  expect(screen.getByText('Cursor')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cursor' })).toBeInTheDocument();
  const img = container.querySelector('img');
  expect(img).toHaveAttribute('src', 'https://logos.hunter.io/cursor.com');
});

it('renders logo-only mode with a small label below the logo', () => {
  render(<ItemChip entry={entry} entries={[entry]} locale="en" size="primary" mode="logo" />);
  expect(screen.getByText('Cursor')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cursor' })).toBeInTheDocument();
});

it('falls back to monogram when no logo or website is available', () => {
  const noLogoEntry: CatalogEntry = {
    ...entry,
    website: 'invalid',
    logo: undefined,
  };
  render(<ItemChip entry={noLogoEntry} entries={[noLogoEntry]} locale="en" size="primary" />);
  expect(screen.getByLabelText('Cursor monogram')).toBeInTheDocument();
});

it('falls back to monogram when the logo image fails to load', () => {
  const { container } = render(
    <ItemChip entry={entry} entries={[entry]} locale="en" size="primary" mode="logo" />
  );
  const img = container.querySelector('img');
  expect(img).toBeInTheDocument();
  fireEvent.error(img!);
  expect(screen.getByLabelText('Cursor monogram')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cursor' })).toBeInTheDocument();
});
