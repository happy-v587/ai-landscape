import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { GlobalNav } from '@/components/site/GlobalNav';

it('links to all four English maps and the Chinese homepage', () => {
  render(<GlobalNav locale="en" />);
  expect(screen.getByRole('link', { name: 'Models' })).toHaveAttribute('href', '/en/maps/models');
  expect(screen.getByRole('link', { name: 'Model Infra' })).toHaveAttribute('href', '/en/maps/model-infra');
  expect(screen.getByRole('link', { name: 'Agent & Tools' })).toHaveAttribute('href', '/en/maps/agent-tools');
  expect(screen.getByRole('link', { name: 'Apps & SaaS' })).toHaveAttribute('href', '/en/maps/apps-saas');
  expect(screen.getByRole('link', { name: '中文' })).toHaveAttribute('href', '/zh');
});

it('renders a real search input with placeholder', () => {
  render(<GlobalNav locale="en" />);
  expect(screen.getByRole('searchbox')).toHaveAttribute('placeholder', 'Search catalog');
});

it('marks the active map link', () => {
  render(<GlobalNav locale="en" activeMap="model-infra" />);
  expect(screen.getByRole('link', { name: 'Model Infra' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('link', { name: 'Models' })).not.toHaveAttribute('aria-current');
});
