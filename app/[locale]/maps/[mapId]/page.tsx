import { notFound } from 'next/navigation';
import { MapShell } from '@/components/maps/MapShell';
import { loadCatalog } from '@/lib/catalog/load';
import { assertLocale, locales } from '@/lib/i18n';
import { mapIds } from '@/lib/catalog/types';

export function generateStaticParams() {
  return locales.flatMap((locale) => mapIds.map((mapId) => ({ locale, mapId })));
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string; mapId: string }>;
}) {
  const { locale, mapId } = await params;
  assertLocale(locale);
  if (!mapIds.includes(mapId as (typeof mapIds)[number])) notFound();
  const catalog = loadCatalog();
  const entries = catalog.entries.filter((entry) => entry.map === mapId);
  const categoryLabels = Object.fromEntries(
    [...catalog.categoriesById.values()].map((category) => [
      category.id,
      category.name[locale],
    ])
  );
  return (
    <MapShell
      map={mapId as (typeof mapIds)[number]}
      entries={entries}
      locale={locale}
      categoryLabels={categoryLabels}
    />
  );
}
