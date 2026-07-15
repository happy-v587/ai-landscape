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

const mapAnalysis: Record<(typeof mapOrder)[number], Record<Locale, string>> = {
  models: {
    en: 'Release cadence is accelerating; reasoning and multimodal variants now dominate new announcements.',
    zh: '发布节奏持续加快，推理与多模态变体已成为新模型发布的主流。',
  },
  'model-infra': {
    en: 'Inference and serving layers are the most crowded, driven by demand for efficient local and cloud deployment.',
    zh: '推理与服务层最为拥挤，反映出对本地与云端高效部署的强烈需求。',
  },
  'agent-tools': {
    en: 'Coding agents and composable frameworks are converging around open protocols like MCP and A2A.',
    zh: '编程 Agent 与可组合框架正围绕 MCP、A2A 等开放协议快速收敛。',
  },
  'apps-saas': {
    en: 'Chat interfaces and coding assistants remain the most visible end-user surfaces across regions.',
    zh: '对话界面与编程助手仍是各地区最可见的终端用户入口。',
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

function MapGuide({
  mapId,
  entries,
  locale,
  index,
}: {
  mapId: (typeof mapOrder)[number];
  entries: CatalogEntry[];
  locale: Locale;
  index: number;
}) {
  const stats = collectMapStats(mapId, entries);
  const number = String(index + 1).padStart(2, '0');
  return (
    <Link
      href={`/${locale}/maps/${mapId}`}
      className={styles.mapGuide}
      data-map={mapId}
    >
      <span className={styles.guideNumber} aria-hidden="true">
        {number}
      </span>
      <span className={styles.guideRule} aria-hidden="true" />
      <div className={styles.guideBody}>
        <div className={styles.guideHeader}>
          <h2 className={styles.guideTitle}>{mapNames[mapId][locale]}</h2>
          <span className={styles.guideAction}>
            {locale === 'en' ? 'Explore' : '探索'}
            <span aria-hidden="true">→</span>
          </span>
        </div>
        <p className={styles.guideDescription}>{mapDescriptions[mapId][locale]}</p>
        <div className={styles.guideStats}>
          <span className={styles.guideStat}>
            <strong>{stats.entryCount}</strong>
            {locale === 'en' ? 'entries' : '条目'}
          </span>
          <span className={styles.guideStat}>
            <strong>{stats.categoryCount}</strong>
            {locale === 'en' ? 'categories' : '分类'}
          </span>
          <span className={styles.guideInsight}>{stats.insight}</span>
        </div>
        <p className={styles.guideAnalysis}>{mapAnalysis[mapId][locale]}</p>
      </div>
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
  const activeCount = entries.filter((entry) => entry.status === 'active').length;
  const providers = new Set(
    entries
      .filter((entry) => entry.timeline != null)
      .map((entry) => entry.timeline?.provider_lane ?? entry.organization)
      .filter(Boolean)
  ).size;

  return (
    <div className={styles.fullLandscape}>
      <section className={styles.hero}>
        <h1 className={styles.title}>AI Landscape</h1>
        <p className={styles.subtitle}>
          {locale === 'en'
            ? 'A field atlas of models, infrastructure, agents, and applications.'
            : '模型、基础设施、Agent 与应用的中英文生态地图。'}
        </p>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <strong>{mapOrder.length}</strong>
            <span>{locale === 'en' ? 'maps' : '地图'}</span>
          </div>
          <div className={styles.heroStat}>
            <strong>{entries.length}</strong>
            <span>{locale === 'en' ? 'entries' : '条目'}</span>
          </div>
          <div className={styles.heroStat}>
            <strong>{activeCount}</strong>
            <span>{locale === 'en' ? 'active' : '活跃'}</span>
          </div>
          <div className={styles.heroStat}>
            <strong>{providers}</strong>
            <span>{locale === 'en' ? 'providers' : '厂商'}</span>
          </div>
        </div>
      </section>
      <nav className={styles.atlasIndex} aria-label={locale === 'en' ? 'Atlas index' : '图鉴索引'}>
        {mapOrder.map((mapId, index) => (
          <MapGuide key={mapId} mapId={mapId} entries={entries} locale={locale} index={index} />
        ))}
      </nav>
    </div>
  );
}
