import { describe, expect, it } from 'vitest';
import { siteConfig } from '@/lib/site';

describe('siteConfig', () => {
  it('defines the public bilingual landscape identity', () => {
    expect(siteConfig).toEqual({
      name: 'AI Landscape',
      defaultLocale: 'en',
      locales: ['en', 'zh'],
    });
  });
});
