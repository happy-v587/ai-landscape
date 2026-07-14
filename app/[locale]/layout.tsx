import { ReactNode } from 'react';

import { GlobalNav } from '@/components/site/GlobalNav';
import { assertLocale, locales } from '@/lib/i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  assertLocale(locale);
  return (
    <>
      <GlobalNav locale={locale} />
      <main>{children}</main>
    </>
  );
}
