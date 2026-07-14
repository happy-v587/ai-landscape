'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import styles from './catalog.module.css';

const mapOptions = [
  { value: '', labelEn: 'All maps', labelZh: '所有地图' },
  { value: 'models', labelEn: 'Models', labelZh: '模型' },
  { value: 'model-infra', labelEn: 'Model Infra', labelZh: '模型基础设施' },
  { value: 'agent-tools', labelEn: 'Agent & Tools', labelZh: 'Agent 与工具' },
  { value: 'apps-saas', labelEn: 'Apps & SaaS', labelZh: '应用与 SaaS' },
];

export function CatalogExplorer({
  locale,
  entries,
}: {
  locale: Locale;
  entries: { id: string; map: string; name: Record<Locale, string>; summary: Record<Locale, string>; tags: string[] }[];
}) {
  const [query, setQuery] = useState('');
  const [map, setMap] = useState('');
  const results = useMemo(
    () =>
      entries.filter((entry) => {
        const haystack = `${entry.name.en} ${entry.name.zh} ${entry.summary.en} ${entry.summary.zh} ${entry.tags.join(' ')}`.toLowerCase();
        return (
          (!map || entry.map === map) &&
          (!query || haystack.includes(query.toLowerCase()))
        );
      }),
    [entries, map, query]
  );
  return (
    <div className={styles.explorer}>
      <div className={styles.explorerBar}>
        <label className={styles.searchLabel}>
          {locale === 'en' ? 'Search catalog' : '搜索目录'}
          <input
            aria-label={locale === 'en' ? 'Search catalog' : '搜索目录'}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={styles.searchInput}
          />
        </label>
        <label className={styles.filterLabel}>
          {locale === 'en' ? 'Map' : '地图'}
          <select
            aria-label={locale === 'en' ? 'Map' : '地图'}
            value={map}
            onChange={(event) => setMap(event.target.value)}
            className={styles.filterSelect}
          >
            {mapOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {locale === 'en' ? option.labelEn : option.labelZh}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ul className={styles.resultList}>
        {results.map((entry) => (
          <li key={entry.id}>
            <Link href={`/${locale}/item/${entry.id}`}>{entry.name[locale]}</Link>
            <span>{entry.summary[locale]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
