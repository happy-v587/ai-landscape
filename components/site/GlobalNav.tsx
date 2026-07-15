'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { copy, type Locale } from '@/lib/i18n';
import type { MapId } from '@/lib/catalog/types';
import styles from './GlobalNav.module.css';

const mapLinks: { id: MapId; key: keyof typeof copy.en }[] = [
  { id: 'models', key: 'models' },
  { id: 'model-infra', key: 'infra' },
  { id: 'agent-tools', key: 'agents' },
  { id: 'apps-saas', key: 'apps' },
];

export function GlobalNav({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const alternate = locale === 'en' ? 'zh' : 'en';
  const pathname = usePathname() ?? '';
  const activeMap = mapLinks.find((link) =>
    pathname.startsWith(`/${locale}/maps/${link.id}`)
  )?.id;
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <Link href={`/${locale}`} className={styles.brand}>AI Landscape</Link>
        <nav className={styles.links} aria-label="Maps">
          {mapLinks.map((link) => (
            <Link
              key={link.id}
              href={`/${locale}/maps/${link.id}`}
              className={`${styles.link} ${activeMap === link.id ? styles.active : ''}`}
              data-map={link.id}
              aria-current={activeMap === link.id ? 'page' : undefined}
            >
              {t[link.key]}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <input type="search" aria-label={t.search} placeholder={t.search} className={styles.search} />
          <Link href={`/${alternate}`} className={styles.locale}>{t.language}</Link>
          <a
            href="https://github.com/happy-v587/ai-landscape/issues/new?template=add-product.yml"
            className={styles.submit}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.submit}
          </a>
        </div>
      </div>
    </header>
  );
}
