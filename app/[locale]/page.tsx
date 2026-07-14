import { HomeMapDirectory } from '@/components/site/HomeMapDirectory';
import { assertLocale } from '@/lib/i18n';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertLocale(locale);
  return <HomeMapDirectory locale={locale} />;
}
