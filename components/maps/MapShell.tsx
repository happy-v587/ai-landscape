import type { CatalogEntry, MapId } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import { ModelsTimeline } from './ModelsTimeline';
import { ModelInfraMap } from './ModelInfraMap';
import { AgentToolsMap } from './AgentToolsMap';
import { AppsSaasMap } from './AppsSaasMap';
import { MapRail } from './MapRail';
import styles from './maps.module.css';

export function groupEntries(entries: CatalogEntry[]) {
  return entries.reduce<Record<string, CatalogEntry[]>>((groups, entry) => {
    groups[entry.category] = [...(groups[entry.category] ?? []), entry];
    return groups;
  }, {});
}

export function groupBySubcategory(entries: CatalogEntry[]) {
  const byCategory = groupEntries(entries);
  return Object.entries(byCategory).map(([category, items]) => ({
    category,
    subcategories: items.reduce<Record<string, CatalogEntry[]>>((acc, entry) => {
      const sub = entry.subcategory ?? 'General';
      acc[sub] = [...(acc[sub] ?? []), entry];
      return acc;
    }, {}),
  }));
}

export function MapShell({
  map,
  entries,
  locale,
  categoryLabels,
}: {
  map: MapId;
  entries: CatalogEntry[];
  locale: Locale;
  categoryLabels: Record<string, string>;
}) {
  return (
    <div className={styles.mapPage} data-map={map}>
      <MapRail map={map} locale={locale} />
      <div className={styles.mapCanvas}>
        {map === 'models' ? (
          <ModelsTimeline entries={entries} locale={locale} />
        ) : map === 'model-infra' ? (
          <ModelInfraMap entries={entries} locale={locale} categoryLabels={categoryLabels} />
        ) : map === 'agent-tools' ? (
          <AgentToolsMap entries={entries} locale={locale} categoryLabels={categoryLabels} />
        ) : (
          <AppsSaasMap entries={entries} locale={locale} categoryLabels={categoryLabels} />
        )}
      </div>
    </div>
  );
}
