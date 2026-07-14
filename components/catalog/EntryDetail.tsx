import Link from 'next/link';
import type { CatalogEntry } from '@/lib/catalog/types';
import { copy, type Locale } from '@/lib/i18n';
import styles from './catalog.module.css';

export function EntryDetail({
  entry,
  locale,
  related,
  compact = false,
}: {
  entry: CatalogEntry;
  locale: Locale;
  related: CatalogEntry[];
  compact?: boolean;
}) {
  const t = copy[locale];
  return (
    <article className={compact ? styles.detailCompact : styles.detail}>
      <header className={styles.detailHeader}>
        <h1 className={styles.detailTitle}>{entry.name[locale]}</h1>
        <p className={styles.detailSummary}>{entry.summary[locale]}</p>
        <a href={entry.website} className={styles.detailLink} target="_blank" rel="noreferrer">
          {entry.website}
        </a>
      </header>
      <section className={styles.detailSection}>
        <h2 className={styles.detailSectionTitle}>{t.tags}</h2>
        <div className={styles.tagList}>
          {entry.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </section>
      {entry.timeline && (
        <section className={styles.detailSection}>
          <h2 className={styles.detailSectionTitle}>{t.release}</h2>
          <p className={styles.detailText}>
            {entry.timeline.released_at} · {entry.timeline.provider_lane} ·{' '}
            {entry.timeline.capabilities.join(' · ')}
          </p>
        </section>
      )}
      <section className={styles.detailSection}>
        <h2 className={styles.detailSectionTitle}>{t.sources}</h2>
        <ul className={styles.sourceList}>
          {entry.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">{source.url}</a>
              <time dateTime={source.checked_at}>checked {source.checked_at}</time>
            </li>
          ))}
        </ul>
      </section>
      {related.length > 0 && (
        <section className={styles.detailSection}>
          <h2 className={styles.detailSectionTitle}>{t.related}</h2>
          <ul className={styles.relatedList}>
            {related.map((item) => (
              <li key={item.id}>
                <Link href={`/${locale}/item/${item.id}`}>{item.name[locale]}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
