import { CatalogExplorer } from '@/components/catalog/CatalogExplorer';
import { loadCatalog } from '@/lib/catalog/load';
import { assertLocale } from '@/lib/i18n';

export default async function ExplorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  assertLocale(locale);
  const entries = loadCatalog().entries.map(({ id, map, name, summary, tags }) => ({
    id,
    map,
    name,
    summary,
    tags,
  }));
  return <CatalogExplorer locale={locale} entries={entries} />;
}
