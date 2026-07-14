import { notFound } from 'next/navigation';

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];

export function assertLocale(value: string): asserts value is Locale {
  if (!locales.includes(value as Locale)) notFound();
}

export const copy = {
  en: {
    models: 'Models',
    infra: 'Model Infra',
    agents: 'Agent & Tools',
    apps: 'Apps & SaaS',
    language: '中文',
    search: 'Search catalog',
    submit: 'Submit',
  },
  zh: {
    models: '模型',
    infra: '模型基础设施',
    agents: 'Agent 与工具',
    apps: '应用与 SaaS',
    language: 'English',
    search: '搜索目录',
    submit: '提交',
  },
} as const;
