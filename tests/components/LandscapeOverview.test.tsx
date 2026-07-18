import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { LandscapeOverview } from '@/components/site/LandscapeOverview';
import type { Category } from '@/lib/catalog/load';
import type { CatalogEntry, MapId } from '@/lib/catalog/types';

function makeEntry(id: string, map: MapId, category: string, name: string): CatalogEntry {
  return {
    id,
    kind: 'tool',
    map,
    category,
    name: { en: name, zh: name },
    summary: { en: `${name} summary.`, zh: `${name} 简介。` },
    website: `https://${id}.example.com/`,
    tags: [],
    regions: ['US'],
    status: 'active',
    related: [],
    facts: {},
    sources: [{ url: `https://${id}.example.com/`, checked_at: '2026-07-14' }],
  };
}

const categories: Category[] = [
  { id: 'model-providers', map: 'models', name: { en: 'Model Providers', zh: '模型厂商' }, presentation: 'provider-lane' },
  { id: 'foundation-models', map: 'models', name: { en: 'Foundation Models', zh: '基础模型' }, presentation: 'timeline' },
  { id: 'coding-agents', map: 'agent-tools', name: { en: 'Coding Agents', zh: '编程 Agent' }, presentation: 'capability-map' },
  { id: 'chat', map: 'apps-saas', name: { en: 'Chat', zh: '聊天' }, presentation: 'scenario-map' },
];

const entries: CatalogEntry[] = [
  makeEntry('openai', 'models', 'model-providers', 'OpenAI'),
  makeEntry('gpt-5', 'models', 'foundation-models', 'GPT-5'),
  makeEntry('claude-5', 'models', 'foundation-models', 'Claude 5'),
  makeEntry('cursor', 'agent-tools', 'coding-agents', 'Cursor'),
  makeEntry('cline', 'agent-tools', 'coding-agents', 'Cline'),
  makeEntry('kimi', 'apps-saas', 'chat', 'Kimi'),
];

function renderOverview(locale: 'en' | 'zh' = 'en') {
  return render(<LandscapeOverview entries={entries} categories={categories} locale={locale} />);
}

it('renders a layer band per map with category boxes and one cell per entry', () => {
  renderOverview();
  expect(screen.getByRole('heading', { name: 'Apps & SaaS' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Agent & Tools' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Coding Agents' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Chat' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cursor' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cline' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Kimi' })).toBeInTheDocument();
});

it('links each layer strip to its full map page', () => {
  renderOverview();
  expect(screen.getByRole('link', { name: 'Agent & Tools' })).toHaveAttribute('href', '/en/maps/agent-tools');
  expect(screen.getByRole('link', { name: 'Apps & SaaS' })).toHaveAttribute('href', '/en/maps/apps-saas');
});

it('shows only providers on the models layer and links out for the rest', () => {
  renderOverview();
  expect(screen.getByRole('button', { name: 'OpenAI' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'GPT-5' })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Claude 5' })).not.toBeInTheDocument();
  const more = screen.getByRole('link', { name: /Foundation Models/ });
  expect(more).toHaveAttribute('href', '/en/maps/models');
  expect(more).toHaveTextContent('2');
});

it('skips maps and categories that have no entries', () => {
  renderOverview();
  expect(screen.queryByRole('heading', { name: 'Model Infra' })).not.toBeInTheDocument();
});

it('renders localized labels in zh', () => {
  renderOverview('zh');
  expect(screen.getByRole('heading', { name: 'Agent 与工具' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: '编程 Agent' })).toBeInTheDocument();
});
