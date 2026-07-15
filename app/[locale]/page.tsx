import { FullLandscape } from '@/components/site/FullLandscape';
import { loadCatalog } from '@/lib/catalog/load';
import { assertLocale } from '@/lib/i18n';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertLocale(locale);
  const catalog = loadCatalog();
  const categoryLabels = Object.fromEntries(
    [...catalog.categoriesById.values()].map((category) => [
      category.id,
      category.name[locale],
    ])
  );
  return (
    <FullLandscape
      entries={catalog.entries}
      locale={locale}
      categoryLabels={categoryLabels}
    />
  );
}
