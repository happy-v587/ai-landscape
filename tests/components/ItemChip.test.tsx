import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ItemChip } from '@/components/maps/ItemChip';

const entry = {
  id: 'cursor',
  name: { en: 'Cursor', zh: 'Cursor' },
  tags: ['ide'],
};

it('renders the entry name and a monogram fallback', () => {
  render(<ItemChip entry={entry} locale="en" size="primary" />);
  expect(screen.getByText('Cursor')).toBeInTheDocument();
  expect(screen.getByLabelText('Cursor monogram')).toBeInTheDocument();
});
