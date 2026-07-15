import { ModelsTimeline } from '@/components/maps/ModelsTimeline';
import { CapabilityMap } from '@/components/maps/CapabilityMap';
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import styles from './home.module.css';

const mapOrder: ('models' | 'model-infra' | 'agent-tools' | 'apps-saas')[] = [
  'models',
  'model-infra',
  'agent-tools',
  'apps-saas',
];

const mapNames: Record<(typeof mapOrder)[number], Record<Locale, string>> = {
  models: { en: 'Models', zh: '模型' },
  'model-infra': { en: 'Model Infra', zh: '模型基础设施' },
  'agent-tools': { en: 'Agent & Tools', zh: 'Agent 与工具' },
  'apps-saas': { en: 'Apps & SaaS', zh: '应用与 SaaS' },
};

function MapSection({
  mapId,
  entries,
  locale,
  categoryLabels,
}: {
  mapId: (typeof mapOrder)[number];
  entries: CatalogEntry[];
  locale: Locale;
  categoryLabels: Record<string, string>;
}) {
  return (
    <section className={styles.mapSection} data-map={mapId}>
      <h2 className={styles.mapSectionTitle}>{mapNames[mapId][locale]}</h2>
      <div className={styles.mapSectionBody}>
        {mapId === 'models' ? (
          <ModelsTimeline entries={entries} locale={locale} />
        ) : (
          <CapabilityMap entries={entries} locale={locale} categoryLabels={categoryLabels} />
        )}
      </div>
    </section>
  );
}

export function FullLandscape({
  entries,
  locale,
  categoryLabels,
}: {
  entries: CatalogEntry[];
  locale: Locale;
  categoryLabels: Record<string, string>;
}) {
  const byMap = Object.fromEntries(
    mapOrder.map((mapId) => [mapId, entries.filter((entry) => entry.map === mapId)])
  );

  return (
    <div className={styles.fullLandscape}>
      <section className={styles.hero}>
        <h1 className={styles.title}>AI Landscape</h1>
        <p className={styles.subtitle}>
          {locale === 'en'
            ? 'A bilingual map of the global AI ecosystem.'
            : '全球 AI 生态的中英文双语地图。'}
        </p>
      </section>
      {mapOrder.map((mapId) => (
        <MapSection
          key={mapId}
          mapId={mapId}
          entries={byMap[mapId]}
          locale={locale}
          categoryLabels={categoryLabels}
        />
      ))}
    </div>
  );
}
