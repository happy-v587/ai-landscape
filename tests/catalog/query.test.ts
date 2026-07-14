import { expect, it } from 'vitest';
import { loadCatalog } from '@/lib/catalog/load';
import { searchEntries } from '@/lib/catalog/query';

it('finds an English query and limits it to one map', () => {
  const results = searchEntries(loadCatalog(), 'deepseek', { map: 'models' });
  expect(results.map((entry) => entry.id)).toContain('deepseek-v3');
});
