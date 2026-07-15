import { FullLandscape } from '@/components/site/FullLandscape';
import { loadCatalog } from '@/lib/catalog/load';
import { assertLocale } from '@/lib/i18n';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertLocale(locale);
  const catalog = loadCatalog();
  return (
    <FullLandscape
      entries={catalog.entries}
      locale={locale}
    />
  );
}
