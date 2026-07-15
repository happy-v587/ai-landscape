import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { FullLandscape } from '@/components/site/FullLandscape';

const entries: any[] = [];

it('renders all four map sections on the homepage', () => {
  render(
    <FullLandscape
      entries={entries}
      locale="en"
      categoryLabels={{}}
    />
  );
  expect(screen.getByRole('heading', { name: 'AI Landscape' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Models' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Model Infra' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Agent & Tools' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Apps & SaaS' })).toBeInTheDocument();
});
