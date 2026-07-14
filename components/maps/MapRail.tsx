import type { MapId } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import styles from './maps.module.css';

const labels: Record<MapId, Record<Locale, string>> = {
  models: { en: 'Models', zh: '模型' },
  'model-infra': { en: 'Model Infra', zh: '模型基础设施' },
  'agent-tools': { en: 'Agent & Tools', zh: 'Agent 与工具' },
  'apps-saas': { en: 'Apps & SaaS', zh: '应用与 SaaS' },
};

export function MapRail({ map, locale }: { map: MapId; locale: Locale }) {
  return <div className={styles.rail}>{labels[map][locale]}</div>;
}
