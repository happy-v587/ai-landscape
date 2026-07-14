import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { usePathname } from 'next/navigation';
import { GlobalNav } from '@/components/site/GlobalNav';

vi.mock('next/navigation', () => ({ usePathname: vi.fn() }));

it('links to all four English maps and the Chinese homepage', () => {
  vi.mocked(usePathname).mockReturnValue('/en');
  render(<GlobalNav locale="en" />);
  expect(screen.getByRole('link', { name: 'Models' })).toHaveAttribute('href', '/en/maps/models');
  expect(screen.getByRole('link', { name: 'Model Infra' })).toHaveAttribute('href', '/en/maps/model-infra');
  expect(screen.getByRole('link', { name: 'Agent & Tools' })).toHaveAttribute('href', '/en/maps/agent-tools');
  expect(screen.getByRole('link', { name: 'Apps & SaaS' })).toHaveAttribute('href', '/en/maps/apps-saas');
  expect(screen.getByRole('link', { name: '中文' })).toHaveAttribute('href', '/zh');
});

it('renders a real search input with placeholder', () => {
  vi.mocked(usePathname).mockReturnValue('/en');
  render(<GlobalNav locale="en" />);
  expect(screen.getByRole('searchbox')).toHaveAttribute('placeholder', 'Search catalog');
});

it('marks the active map link', () => {
  vi.mocked(usePathname).mockReturnValue('/en/maps/model-infra');
  render(<GlobalNav locale="en" />);
  expect(screen.getByRole('link', { name: 'Model Infra' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('link', { name: 'Models' })).not.toHaveAttribute('aria-current');
});

it('applies active style to the current map link', () => {
  vi.mocked(usePathname).mockReturnValue('/en/maps/agent-tools');
  render(<GlobalNav locale="en" />);
  expect(screen.getByRole('link', { name: 'Agent & Tools' }).className).toContain('active');
});
