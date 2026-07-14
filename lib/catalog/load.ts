import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { catalogEntrySchema } from './schema';
import type { CatalogEntry, MapId } from './types';

export type Category = {
  id: string;
  map: MapId;
  name: Record<'en' | 'zh', string>;
  presentation: string;
};

export type MapDefinition = {
  id: MapId;
  name: Record<'en' | 'zh', string>;
  presentation: string;
};

export type Catalog = {
  entries: CatalogEntry[];
  entriesById: Map<string, CatalogEntry>;
  categoriesById: Map<string, Category>;
  mapsById: Map<string, MapDefinition>;
};

export function loadCatalog(root = join(process.cwd(), 'data')): Catalog {
  const readList = <T,>(file: string) => parse(readFileSync(join(root, file), 'utf8')) as T[];
  const categories = readList<Category>('categories.yaml');
  const maps = readList<MapDefinition>('maps.yaml');
  const itemDir = join(root, 'items');
  const entries = readdirSync(itemDir)
    .filter((file) => file.endsWith('.yaml'))
    .sort()
    .map((file) => {
      const parsed = parse(readFileSync(join(itemDir, file), 'utf8'));
      return catalogEntrySchema.parse(parsed) as CatalogEntry;
    });
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const mapsById = new Map(maps.map((map) => [map.id, map]));
  for (const entry of entries) {
    const category = categoriesById.get(entry.category);
    if (!category) throw new Error(`Entry ${entry.id} has unknown category: ${entry.category}`);
    if (category.map !== entry.map) {
      throw new Error(`Category ${entry.category} does not belong to map ${entry.map}`);
    }
  }
  for (const entry of entries) {
    for (const relatedId of entry.related) {
      if (!entriesById.has(relatedId)) {
        throw new Error(`Entry ${entry.id} has unknown related entry: ${relatedId}`);
      }
    }
  }
  return { entries, entriesById, categoriesById, mapsById };
}
