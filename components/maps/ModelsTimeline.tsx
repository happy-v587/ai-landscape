import Link from 'next/link';
import type { CSSProperties } from 'react';
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import styles from './maps.module.css';

const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function parseDateUTC(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function formatMonthKey(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split('-');
  return `${monthNames[Number(month) - 1]} ${year}`;
}

function laneColor(lane: string) {
  let hash = 0;
  for (const char of lane) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 72%, 45%)`;
}

export function ModelsTimeline({ entries, locale }: { entries: CatalogEntry[]; locale: Locale }) {
  const timelineEntries = entries.filter((entry) => entry.timeline != null);
  if (timelineEntries.length === 0) return null;

  const releaseDates = timelineEntries.map((entry) => parseDateUTC(entry.timeline!.released_at));
  const minDate = new Date(Math.min(...releaseDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...releaseDates.map((d) => d.getTime())));
  minDate.setUTCMonth(minDate.getUTCMonth() - 1);
  maxDate.setUTCMonth(maxDate.getUTCMonth() + 1);

  const months: string[] = [];
  const cursor = new Date(minDate);
  while (cursor <= maxDate) {
    months.push(formatMonthKey(cursor));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  const lanes = timelineEntries.reduce<Record<string, CatalogEntry[]>>((groups, entry) => {
    const lane = entry.timeline!.provider_lane ?? entry.organization ?? 'other';
    groups[lane] = [...(groups[lane] ?? []), entry];
    return groups;
  }, {});

  const gridTemplateColumns = `160px repeat(${months.length}, minmax(150px, 1fr))`;
  const minWidth = 160 + months.length * 150;

  return (
    <section className={styles.timeline} aria-label="Model release timeline">
      <div
        className={styles.timelineGrid}
        style={{ gridTemplateColumns, minWidth }}
      >
        <div className={styles.timelineProviderHeader} />
        {months.map((key) => (
          <div key={key} className={styles.timelineMonth}>{monthLabel(key)}</div>
        ))}
        {Object.entries(lanes)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([lane, laneEntries]) => (
          <div key={lane} className={styles.timelineLane} role="row" style={{ '--lane-color': laneColor(lane) } as CSSProperties}>
            <div className={styles.timelineProvider} role="rowheader">{lane}</div>
            {months.map((key) => (
              <div key={key} className={styles.timelineMonthCell}>
                {laneEntries
                  .filter((entry) => formatMonthKey(parseDateUTC(entry.timeline!.released_at)) === key)
                  .sort((a, b) => a.timeline!.released_at.localeCompare(b.timeline!.released_at))
                  .map((entry) => {
                    const date = parseDateUTC(entry.timeline!.released_at);
                    return (
                      <Link
                        key={entry.id}
                        href={`/${locale}/item/${entry.id}`}
                        className={styles.timelineCard}
                      >
                        <time dateTime={entry.timeline!.released_at}>
                          {date.toLocaleDateString(locale, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: 'UTC',
                          })}
                        </time>
                        <strong>{entry.name[locale]}</strong>
                        <span>{entry.timeline!.capabilities.join(' · ')}</span>
                      </Link>
                    );
                  })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
