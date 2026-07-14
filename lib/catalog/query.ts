import type { Catalog } from './load';
import type { MapId } from './types';

export function searchEntries(
  catalog: Catalog,
  query: string,
  filters: { map?: MapId; category?: string; tag?: string }
) {
  const needle = query.trim().toLocaleLowerCase();
  return catalog.entries.filter((entry) => {
    const haystack = [
      entry.id,
      entry.name.en,
      entry.name.zh,
      entry.summary.en,
      entry.summary.zh,
      ...entry.tags,
    ]
      .join(' ')
      .toLocaleLowerCase();
    return (
      (!filters.map || entry.map === filters.map) &&
      (!filters.category || entry.category === filters.category) &&
      (!filters.tag || entry.tags.includes(filters.tag)) &&
      (!needle || haystack.includes(needle))
    );
  });
}
