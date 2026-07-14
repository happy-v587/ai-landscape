import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { GlobalNav } from '@/components/site/GlobalNav';

it('links to all four English maps and the Chinese homepage', () => {
  render(<GlobalNav locale="en" />);
  expect(screen.getByRole('link', { name: 'Models' })).toHaveAttribute('href', '/en/maps/models');
  expect(screen.getByRole('link', { name: '中文' })).toHaveAttribute('href', '/zh');
});
