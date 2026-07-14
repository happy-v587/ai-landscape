import Link from 'next/link';
import { copy, type Locale } from '@/lib/i18n';
import styles from './GlobalNav.module.css';

type MapId = 'models' | 'model-infra' | 'agent-tools' | 'apps-saas';

const mapLinks: { id: MapId; key: keyof typeof copy.en }[] = [
  { id: 'models', key: 'models' },
  { id: 'model-infra', key: 'infra' },
  { id: 'agent-tools', key: 'agents' },
  { id: 'apps-saas', key: 'apps' },
];

export function GlobalNav({ locale, activeMap }: { locale: Locale; activeMap?: MapId }) {
  const t = copy[locale];
  const alternate = locale === 'en' ? 'zh' : 'en';
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
          <input type="search" placeholder={t.search} className={styles.search} />
          <Link href={`/${locale}/submit`} className={styles.submit}>{t.submit}</Link>
          <Link href={`/${alternate}`} className={styles.locale}>{t.language}</Link>
        </div>
      </div>
    </header>
  );
}
