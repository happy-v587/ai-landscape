import Link from 'next/link';
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

const mapDescriptions: Record<(typeof mapOrder)[number], Record<Locale, string>> = {
  models: {
    en: 'Foundation models and release timelines from major providers.',
    zh: '主流厂商的基础模型与发布时间表。',
  },
  'model-infra': {
    en: 'The stack that trains, serves, and evaluates models.',
    zh: '训练、推理和评测模型的基础设施栈。',
  },
  'agent-tools': {
    en: 'Frameworks, coding agents, and runtimes for building agents.',
    zh: '构建 Agent 的框架、编程 Agent 和运行时。',
  },
  'apps-saas': {
    en: 'End-user products and SaaS applications powered by AI.',
    zh: '面向终端用户的 AI 产品与 SaaS 应用。',
  },
};

function collectMapStats(mapId: (typeof mapOrder)[number], entries: CatalogEntry[]) {
  const mapEntries = entries.filter((entry) => entry.map === mapId);
  const categories = new Set(mapEntries.map((entry) => entry.category));
  const subcategories = new Set(
    mapEntries.map((entry) => entry.subcategory).filter(Boolean)
  );

  if (mapId === 'models') {
    const timelineEntries = mapEntries.filter((entry) => entry.timeline != null);
    const providers = new Set(
      timelineEntries.map((entry) => entry.timeline?.provider_lane ?? entry.organization)
    );
    return {
      entryCount: mapEntries.length,
      categoryCount: categories.size,
      insight: `${providers.size} ${providers.size === 1 ? 'provider' : 'providers'} · ${timelineEntries.length} ${timelineEntries.length === 1 ? 'release' : 'releases'}`,
    };
  }

  if (mapId === 'model-infra') {
    return {
      entryCount: mapEntries.length,
      categoryCount: categories.size,
      insight: `${categories.size} ${categories.size === 1 ? 'layer' : 'layers'} · ${subcategories.size} ${subcategories.size === 1 ? 'area' : 'areas'}`,
    };
  }

  if (mapId === 'agent-tools') {
    return {
      entryCount: mapEntries.length,
      categoryCount: categories.size,
      insight: `${categories.size} ${categories.size === 1 ? 'category' : 'categories'} · ${subcategories.size} ${subcategories.size === 1 ? 'use case' : 'use cases'}`,
    };
  }

  return {
    entryCount: mapEntries.length,
    categoryCount: categories.size,
    insight: `${categories.size} ${categories.size === 1 ? 'scenario' : 'scenarios'} · ${mapEntries.length} ${mapEntries.length === 1 ? 'product' : 'products'}`,
  };
}

function MapPlate({
  mapId,
  entries,
  locale,
}: {
  mapId: (typeof mapOrder)[number];
  entries: CatalogEntry[];
  locale: Locale;
}) {
  const stats = collectMapStats(mapId, entries);
  return (
    <Link
      href={`/${locale}/maps/${mapId}`}
      className={styles.mapPlate}
      data-map={mapId}
    >
      <div className={styles.plateHeader}>
        <span className={styles.plateDot} />
        <h2 className={styles.plateTitle}>{mapNames[mapId][locale]}</h2>
      </div>
      <p className={styles.plateDescription}>{mapDescriptions[mapId][locale]}</p>
      <div className={styles.plateStats}>
        <div className={styles.plateStat}>
          <strong>{stats.entryCount}</strong>
          <span>{locale === 'en' ? 'entries' : '条目'}</span>
        </div>
        <div className={styles.plateStat}>
          <strong>{stats.categoryCount}</strong>
          <span>{locale === 'en' ? 'categories' : '分类'}</span>
        </div>
      </div>
      <p className={styles.plateInsight}>{stats.insight}</p>
      <span className={styles.plateAction}>
        {locale === 'en' ? 'Explore' : '探索'}
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

export function FullLandscape({
  entries,
  locale,
}: {
  entries: CatalogEntry[];
  locale: Locale;
}) {
  return (
    <div className={styles.fullLandscape}>
      <section className={styles.hero}>
        <h1 className={styles.title}>AI Landscape</h1>
        <p className={styles.subtitle}>
          {locale === 'en'
            ? 'A field atlas of models, infrastructure, agents, and applications.'
            : '模型、基础设施、Agent 与应用的中英文生态地图。'}
        </p>
      </section>
      <div className={styles.mapGrid}>
        {mapOrder.map((mapId) => (
          <MapPlate key={mapId} mapId={mapId} entries={entries} locale={locale} />
        ))}
      </div>
    </div>
  );
}
