import Link from 'next/link';
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import styles from './maps.module.css';

const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

export function ModelsTimeline({ entries, locale }: { entries: CatalogEntry[]; locale: Locale }) {
  const lanes = entries.reduce<Record<string, CatalogEntry[]>>((groups, entry) => {
    const lane = entry.timeline?.provider_lane ?? entry.organization ?? 'other';
    groups[lane] = [...(groups[lane] ?? []), entry];
    return groups;
  }, {});

  return (
    <section className={styles.timeline} aria-label="Model release timeline">
      <div className={styles.timelineGrid}>
        <div className={styles.timelineProviderHeader} />
        {months.map((month) => (
          <div key={month} className={styles.timelineMonth}>{month}</div>
        ))}
        {Object.entries(lanes).map(([lane, laneEntries]) => (
          <div key={lane} className={styles.timelineLane} role="row">
            <div className={styles.timelineProvider} role="rowheader">{lane}</div>
            <div className={styles.timelineLaneBody}>
              {laneEntries
                .sort((a, b) => a.timeline!.released_at.localeCompare(b.timeline!.released_at))
                .map((entry) => {
                  const open = entry.facts.open_source === true;
                  const date = new Date(`${entry.timeline!.released_at}T00:00:00Z`);
                  const monthIndex = months.findIndex(
                    (m) => m === date.toLocaleDateString('en-US', { month: 'short' })
                  );
                  return (
                    <Link
                      key={entry.id}
                      href={`/${locale}/item/${entry.id}`}
                      className={`${styles.timelineCard} ${open ? styles.timelineCardOpen : ''}`}
                      style={{ gridColumn: monthIndex >= 0 ? monthIndex + 2 : 2 }}
                    >
                      <time dateTime={entry.timeline!.released_at}>
                        {date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                      <strong>{entry.name[locale]}</strong>
                      <span>{entry.timeline!.capabilities.join(' · ')}</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
