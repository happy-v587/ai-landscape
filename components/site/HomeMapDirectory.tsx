import { HomeMapCard } from './HomeMapCard';
import type { Locale } from '@/lib/i18n';
import styles from './home.module.css';

const maps: {
  id: 'models' | 'model-infra' | 'agent-tools' | 'apps-saas';
  titleEn: string;
  titleZh: string;
  descEn: string;
  descZh: string;
  categoriesEn: string[];
  categoriesZh: string[];
}[] = [
  {
    id: 'models',
    titleEn: 'Models',
    titleZh: '模型',
    descEn: 'Model families, providers, and release timeline.',
    descZh: '模型家族、厂商与发布时间线。',
    categoriesEn: ['Foundation Models', 'Model Providers'],
    categoriesZh: ['基础模型', '模型厂商'],
  },
  {
    id: 'model-infra',
    titleEn: 'Model Infra',
    titleZh: '模型基础设施',
    descEn: 'Training, serving, data, and evaluation infrastructure.',
    descZh: '训练、推理、数据与评测基础设施。',
    categoriesEn: ['Inference', 'Pre-Train', 'Post-Train'],
    categoriesZh: ['推理', '预训练', '后训练'],
  },
  {
    id: 'agent-tools',
    titleEn: 'Agent & Tools',
    titleZh: 'Agent 与工具',
    descEn: 'Coding agents, frameworks, runtimes, and observability.',
    descZh: '编程 Agent、框架、运行时与可观测性。',
    categoriesEn: ['Coding Agents', 'Agent Framework'],
    categoriesZh: ['编程 Agent', 'Agent 框架'],
  },
  {
    id: 'apps-saas',
    titleEn: 'Apps & SaaS',
    titleZh: '应用与 SaaS',
    descEn: 'AI products across productivity, creation, and enterprise.',
    descZh: '生产力、创作与企业级 AI 产品。',
    categoriesEn: ['Productivity', 'Content Creation'],
    categoriesZh: ['生产力', '内容创作'],
  },
];

export function HomeMapDirectory({ locale }: { locale: Locale }) {
  return (
    <div className={styles.directory}>
      <section className={styles.hero}>
        <h1 className={styles.title}>AI Landscape</h1>
        <p className={styles.subtitle}>
          {locale === 'en'
            ? 'A bilingual map of the global AI ecosystem.'
            : '全球 AI 生态的中英文双语地图。'}
        </p>
        <div className={styles.search}>{locale === 'en' ? 'Search catalog' : '搜索目录'}</div>
      </section>
      <section className={styles.grid} aria-label="Landscape maps">
        {maps.map((map) => (
          <HomeMapCard key={map.id} {...map} locale={locale} />
        ))}
      </section>
    </div>
  );
}
