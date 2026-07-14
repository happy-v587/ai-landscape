import { describe, expect, it } from 'vitest';
import { loadCatalog } from '@/lib/catalog/load';

describe('loadCatalog', () => {
  it('loads entries and resolves their relationships', () => {
    const catalog = loadCatalog();
    expect(catalog.entriesById.get('deepseek-v3')?.related).toContain('deepseek');
    expect(catalog.categoriesById.get('foundation-models')?.map).toBe('models');
  });

  it('rejects an unknown related id', () => {
    expect(() => loadCatalog('tests/fixtures/invalid-related')).toThrow('unknown related entry');
  });

  it('rejects a category assigned to the wrong map', () => {
    expect(() => loadCatalog('tests/fixtures/invalid-category-map')).toThrow('does not belong to map');
  });
});
