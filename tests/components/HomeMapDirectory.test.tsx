import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { HomeMapDirectory } from '@/components/site/HomeMapDirectory';

it('renders four map cards with explore links', () => {
  render(<HomeMapDirectory locale="en" />);
  expect(screen.getByRole('heading', { name: 'Models' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Apps & SaaS' })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /Explore/ })).toHaveLength(4);
});
