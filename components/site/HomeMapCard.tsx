import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import styles from './home.module.css';

export function HomeMapCard({
  id,
  titleEn,
  titleZh,
  descEn,
  descZh,
  categoriesEn,
  categoriesZh,
  locale,
}: {
  id: 'models' | 'model-infra' | 'agent-tools' | 'apps-saas';
  titleEn: string;
  titleZh: string;
  descEn: string;
  descZh: string;
  categoriesEn: string[];
  categoriesZh: string[];
  locale: Locale;
}) {
  const categories = locale === 'en' ? categoriesEn : categoriesZh;
  return (
    <article className={styles.card} data-map={id}>
      <div className={styles.accent} />
      <div className={styles.content}>
        <h2 className={styles.cardTitle}>{locale === 'en' ? titleEn : titleZh}</h2>
        <p className={styles.cardDesc}>{locale === 'en' ? descEn : descZh}</p>
        <div className={styles.pills}>
          {categories.map((category) => (
            <span key={category} className={styles.pill}>{category}</span>
          ))}
        </div>
        <Link href={`/${locale}/maps/${id}`} className={styles.explore}>
          {locale === 'en' ? `Explore ${titleEn}` : `探索${titleZh}`}
        </Link>
      </div>
    </article>
  );
}
