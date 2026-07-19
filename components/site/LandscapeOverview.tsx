import Link from 'next/link';
import type { Category } from '@/lib/catalog/load';
import type { CatalogEntry, MapId } from '@/lib/catalog/types';
import { copy, type Locale } from '@/lib/i18n';
import { ItemChip } from '@/components/maps/ItemChip';
import styles from './LandscapeOverview.module.css';

/* Layers stack like the CNCF landscape: applications on top, models as the
   foundation at the bottom of the page. */
const bandOrder: MapId[] = ['apps-saas', 'agent-tools', 'model-infra', 'models'];

const mapCopyKeys: Record<MapId, 'models' | 'infra' | 'agents' | 'apps'> = {
  models: 'models',
  'model-infra': 'infra',
  'agent-tools': 'agents',
  'apps-saas': 'apps',
};

/* Categories shown as boxes on the homepage. Maps not listed show all of
   theirs; the models layer only shows the provider lane — everything else
   is one click away on the models map. */
const homepageCategories: Partial<Record<MapId, string[]>> = {
  models: ['model-providers'],
};

function byName(locale: Locale) {
  return (a: CatalogEntry, b: CatalogEntry) =>
    a.name[locale].localeCompare(b.name[locale], locale === 'zh' ? 'zh-Hans-CN' : 'en');
}

export function LandscapeOverview({
  entries,
  categories,
  locale,
}: {
  entries: CatalogEntry[];
  categories: Category[];
  locale: Locale;
}) {
  const t = copy[locale];
  const sections = bandOrder
    .map((mapId) => {
      const mapEntries = entries.filter((entry) => entry.map === mapId);
      const shownOnHome = homepageCategories[mapId];
      const groups = categories
        .filter((category) => category.map === mapId)
        .map((category) => ({
          category,
          items: mapEntries
            .filter((entry) => entry.category === category.id)
            .sort(byName(locale)),
        }))
        .filter((group) => group.items.length > 0);
      const shown = groups.filter(
        (group) => !shownOnHome || shownOnHome.includes(group.category.id)
      );
      const hidden = shownOnHome
        ? groups.filter((group) => !shownOnHome.includes(group.category.id))
        : [];
      return { mapId, name: t[mapCopyKeys[mapId]], count: mapEntries.length, shown, hidden };
    })
    .filter((section) => section.shown.length > 0 || section.hidden.length > 0);

  return (
    <div className={styles.page}>
      {sections.map((section) => (
        <section
          key={section.mapId}
          id={`map-${section.mapId}`}
          className={styles.band}
          data-map={section.mapId}
        >
          <div className={styles.bandStrip}>
            <span className={styles.stripKey} aria-hidden="true" />
            <h2 className={styles.stripName}>
              <Link href={`/${locale}/maps/${section.mapId}`}>{section.name}</Link>
            </h2>
            <span className={styles.stripCount}>{section.count}</span>
          </div>
          <div className={styles.bandBody}>
            {section.shown.map(({ category, items }) => (
              <div
                key={category.id}
                className={
                  items.length <= 2 ? `${styles.category} ${styles.boxXs}` : styles.category
                }
                style={{ flexGrow: items.length }}
              >
                <h3 className={styles.categoryLabel}>
                  {category.name[locale]}
                  <span className={styles.categoryCount} aria-hidden="true">{items.length}</span>
                </h3>
                <div className={styles.cellGrid}>
                  {items.map((entry) => (
                    <ItemChip
                      key={entry.id}
                      entry={entry}
                      entries={entries}
                      locale={locale}
                      size="primary"
                      mode="logo"
                    />
                  ))}
                </div>
              </div>
            ))}
            {section.hidden.map(({ category, items }) => (
              <Link
                key={category.id}
                href={`/${locale}/maps/${section.mapId}`}
                className={styles.moreTile}
              >
                <span className={styles.moreTileName}>{category.name[locale]}</span>
                <span className={styles.moreTileCount}>
                  {items.length} {locale === 'en' ? 'entries' : '条目'} →
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
