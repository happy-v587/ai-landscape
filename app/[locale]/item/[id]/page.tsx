import { notFound } from 'next/navigation';
import { loadCatalog } from '@/lib/catalog/load';
import { assertLocale, locales } from '@/lib/i18n';
import { EntryDetail } from '@/components/catalog/EntryDetail';

export function generateStaticParams() {
  const catalog = loadCatalog();
  return locales.flatMap((locale) =>
    catalog.entries.map((entry) => ({ locale, id: entry.id }))
  );
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  assertLocale(locale);
  const catalog = loadCatalog();
  const entry = catalog.entriesById.get(id);
  if (!entry) notFound();
  const related = entry.related
    .map((relatedId) => catalog.entriesById.get(relatedId))
    .filter((item): item is typeof catalog.entries[number] => !!item);
  return <EntryDetail entry={entry} locale={locale} related={related} />;
}
