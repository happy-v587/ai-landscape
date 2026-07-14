# AI Landscape MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a bilingual, YAML-driven public AI Landscape with four purpose-specific maps, a searchable catalog, and a GitHub-Issue submission flow.

**Architecture:** Next.js renders locale routes at build time from a validated YAML catalog. A Node-only catalog layer reads and validates YAML, then supplies typed entries to map, explorer, and detail-page server components; browser components only receive JSON-safe catalog data. A small Vercel route handler validates public submissions and creates a structured GitHub Issue using configured repository credentials.

**Tech Stack:** Next.js App Router, React, TypeScript strict mode, Zod, `yaml`, Vitest, Playwright, CSS Modules/global CSS custom properties, Vercel, GitHub REST API.

## Global Constraints

- `data/**/*.yaml` is the only source for public catalog entries, category definitions, filters, and map configuration.
- Locales are exactly `en` and `zh`; every entry and taxonomy label has both translations.
- An entry has exactly one `map` and one `category`; cross-map discovery uses tags, facts, and `related` IDs.
- Maps are `models`, `model-infra`, `agent-tools`, and `apps-saas`.
- The root `DESIGN.md` governs visual implementation: Action Blue `#0066cc` is the only interactive accent; no decorative gradients or UI shadows; light/parchment/near-black full-bleed tiles alternate; all interactive targets are at least 44px square.
- `Models` uses provider lanes plus a release-time axis. `Model Infra`, `Agent & Tools`, and `Apps & SaaS` use independent capability/scenario maps, not one universal card grid.
- All source URLs and `checked_at` dates are required. Invalid data fails test and production build.
- Use local SVG logo assets only after their public-display rights have been checked; render an accessible text fallback if no logo is available.

---

## Planned File Structure

```text
app/
├─ [locale]/
│  ├─ explore/page.tsx
│  ├─ item/[id]/page.tsx
│  ├─ maps/[mapId]/page.tsx
│  ├─ layout.tsx
│  └─ page.tsx
├─ api/submissions/route.ts
├─ globals.css
├─ layout.tsx
└─ page.tsx
components/
├─ catalog/CatalogExplorer.tsx
├─ catalog/EntryCard.tsx
├─ catalog/FilterBar.tsx
├─ maps/AgentToolsMap.tsx
├─ maps/AppsSaasMap.tsx
├─ maps/MapShell.tsx
├─ maps/ModelInfraMap.tsx
├─ maps/ModelsTimeline.tsx
├─ site/GlobalNav.tsx
├─ site/MapGallery.tsx
├─ site/MapTile.tsx
└─ submit/SubmissionForm.tsx
data/
├─ categories.yaml
├─ filters.yaml
├─ maps.yaml
└─ items/*.yaml
lib/
├─ catalog/load.ts
├─ catalog/query.ts
├─ catalog/schema.ts
├─ catalog/types.ts
├─ github/createIssue.ts
├─ i18n.ts
└─ site.ts
public/logos/*.svg
tests/
├─ catalog/load.test.ts
├─ catalog/query.test.ts
├─ catalog/schema.test.ts
├─ github/createIssue.test.ts
├─ components/MapGallery.test.tsx
└─ e2e/landscape.spec.ts
```

### Task 1: Bootstrap the application and the visual-token foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `lib/site.ts`
- Create: `tests/site.test.ts`
- Create: `.gitignore`

**Interfaces:**
- Produces `siteConfig` from `lib/site.ts` for layouts, metadata, and tests.
- Produces `npm run check`, `npm run test`, `npm run build`, and `npm run test:e2e` commands used by all later tasks.

- [ ] **Step 1: Write the failing site-config test**

```ts
// tests/site.test.ts
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
```

- [ ] **Step 2: Run the test to verify the scaffold is absent**

Run: `npm run test -- tests/site.test.ts`

Expected: FAIL because `package.json` and `@/lib/site` do not yet exist.

- [ ] **Step 3: Create the project configuration and minimal implementation**

```json
// package.json
{
  "name": "ai-landscape",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "^16.2.10",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "yaml": "^2.7.0",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.61.1",
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^26.0.0",
    "typescript": "^5.8.0",
    "vitest": "^4.1.10"
  }
}
```

```json
// tsconfig.json
{ "compilerOptions": { "target": "ES2022", "lib": ["dom", "dom.iterable", "es2022"], "strict": true, "noEmit": true, "module": "esnext", "moduleResolution": "bundler", "jsx": "preserve", "incremental": true, "baseUrl": ".", "plugins": [{ "name": "next" }], "paths": { "@/*": ["./*"] } }, "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], "exclude": ["node_modules"] }
```

```ts
// next.config.ts
import type { NextConfig } from 'next';
const nextConfig: NextConfig = { reactStrictMode: true };
export default nextConfig;
```

```gitignore
# .gitignore
node_modules
.next
playwright-report
test-results
.env.local
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({ plugins: [react()], test: { environment: 'jsdom', setupFiles: ['./tests/setup.ts'] }, resolve: { alias: { '@': path.resolve(__dirname) } } });
```

```ts
// tests/setup.ts
import '@testing-library/jest-dom/vitest';
```

```ts
// lib/site.ts
export const siteConfig = {
  name: 'AI Landscape',
  defaultLocale: 'en',
  locales: ['en', 'zh'] as const,
};
```

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Landscape',
  description: 'A bilingual map of the global AI ecosystem.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
```

```tsx
// app/page.tsx
import { redirect } from 'next/navigation';
export default function IndexPage() { redirect('/en'); }
```

```css
/* app/globals.css */
:root { --action-blue: #0066cc; --ink: #1d1d1f; --canvas: #ffffff; --parchment: #f5f5f7; --tile-dark: #272729; --hairline: #e0e0e0; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--canvas); color: var(--ink); font-family: "SF Pro Text", system-ui, -apple-system, BlinkMacSystemFont, "Inter", sans-serif; font-size: 17px; line-height: 1.47; }
a, button, input, select { font: inherit; }
a { color: var(--action-blue); }
button, a, input, select { min-height: 44px; }
```

- [ ] **Step 4: Install dependencies and run the test**

Run: `npm install && npm run test -- tests/site.test.ts`

Expected: PASS with one test.

- [ ] **Step 5: Verify type checking and commit**

Run: `npm run check && git add package.json package-lock.json tsconfig.json next.config.ts vitest.config.ts app lib/site.ts tests/site.test.ts tests/setup.ts .gitignore && git commit -m "feat: bootstrap AI landscape application"`

Expected: type check succeeds and commit contains only bootstrap files.

### Task 2: Define and validate the YAML catalog contract

**Files:**
- Create: `lib/catalog/types.ts`
- Create: `lib/catalog/schema.ts`
- Create: `data/maps.yaml`
- Create: `data/categories.yaml`
- Create: `data/filters.yaml`
- Create: `data/items/deepseek.yaml`
- Create: `data/items/deepseek-v3.yaml`
- Create: `data/items/vllm.yaml`
- Create: `data/items/cursor.yaml`
- Create: `data/items/chatgpt.yaml`
- Create: `tests/catalog/schema.test.ts`

**Interfaces:**
- Produces `MapId`, `CatalogEntry`, `Category`, `MapDefinition`, and `catalogEntrySchema`.
- Consumes no application code; Task 3 consumes these types and schemas.

- [ ] **Step 1: Write failing schema tests**

```ts
// tests/catalog/schema.test.ts
import { describe, expect, it } from 'vitest';
import { catalogEntrySchema } from '@/lib/catalog/schema';

const baseEntry = {
  id: 'deepseek-v3', kind: 'foundation-model', map: 'models', category: 'foundation-models',
  name: { en: 'DeepSeek-V3', zh: 'DeepSeek-V3' },
  summary: { en: 'Open-weight model.', zh: '开放权重模型。' },
  website: 'https://example.com', tags: ['llm'], regions: ['CN'], status: 'active',
  related: [], facts: { modalities: ['text'] },
  timeline: { released_at: '2024-12-26', provider_lane: 'deepseek', capabilities: ['reasoning'] },
  sources: [{ url: 'https://example.com/source', checked_at: '2026-07-14' }]
};

describe('catalogEntrySchema', () => {
  it('requires timeline metadata for a timeline entry', () => {
    const { timeline, ...withoutTimeline } = baseEntry;
    expect(catalogEntrySchema.safeParse(withoutTimeline).success).toBe(false);
  });

  it('rejects an entry missing a Chinese summary', () => {
    expect(catalogEntrySchema.safeParse({ ...baseEntry, summary: { en: 'Only English.' } }).success).toBe(false);
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm run test -- tests/catalog/schema.test.ts`

Expected: FAIL because the catalog schema module does not exist.

- [ ] **Step 3: Implement the exact data types and discriminated schema**

```ts
// lib/catalog/types.ts
export const mapIds = ['models', 'model-infra', 'agent-tools', 'apps-saas'] as const;
export type MapId = (typeof mapIds)[number];
export type Locale = 'en' | 'zh';
export type LocalizedText = Record<Locale, string>;
export type Timeline = { released_at: string; provider_lane: string; capabilities: string[] };
export type CatalogEntry = { id: string; kind: string; map: MapId; category: string; name: LocalizedText; summary: LocalizedText; website: string; logo?: string; organization?: string; tags: string[]; regions: string[]; status: 'active' | 'archived'; related: string[]; facts: Record<string, unknown>; timeline?: Timeline; sources: { url: string; checked_at: string }[] };
```

```ts
// lib/catalog/schema.ts
import { z } from 'zod';
import { mapIds } from './types';

const localizedText = z.object({ en: z.string().min(1), zh: z.string().min(1) });
const source = z.object({ url: z.string().url(), checked_at: z.iso.date() });
const timeline = z.object({ released_at: z.iso.date(), provider_lane: z.string().min(1), capabilities: z.array(z.string().min(1)).min(1) });

export const catalogEntrySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), kind: z.string().min(1), map: z.enum(mapIds), category: z.string().min(1),
  name: localizedText, summary: localizedText, website: z.string().url(), logo: z.string().startsWith('/').optional(), organization: z.string().optional(),
  tags: z.array(z.string()).min(1), regions: z.array(z.string()).min(1), status: z.enum(['active', 'archived']),
  related: z.array(z.string()), facts: z.record(z.string(), z.unknown()), timeline: timeline.optional(), sources: z.array(source).min(1),
}).superRefine((entry, ctx) => {
  if (entry.map === 'models' && entry.kind === 'foundation-model' && !entry.timeline) {
    ctx.addIssue({ code: 'custom', path: ['timeline'], message: 'Foundation models require timeline metadata.' });
  }
  if (entry.map !== 'models' && entry.timeline) {
    ctx.addIssue({ code: 'custom', path: ['timeline'], message: 'Only model-map entries may define timeline metadata.' });
  }
});
```

- [ ] **Step 4: Add bilingual map/category YAML and five valid representative entries**

```yaml
# data/maps.yaml
- id: models
  name: { en: Models, zh: 模型 }
  presentation: timeline
- id: model-infra
  name: { en: Model Infra, zh: 模型基础设施 }
  presentation: lifecycle-map
- id: agent-tools
  name: { en: Agent & Tools, zh: Agent 与工具 }
  presentation: capability-map
- id: apps-saas
  name: { en: Apps & SaaS, zh: 应用与 SaaS }
  presentation: scenario-map
```

```yaml
# data/categories.yaml
- id: model-providers
  map: models
  name: { en: Model Providers, zh: 模型厂商 }
  presentation: provider-lane
- id: foundation-models
  map: models
  name: { en: Foundation Models, zh: 基础模型 }
  presentation: timeline
- id: inference
  map: model-infra
  name: { en: Inference, zh: 推理 }
  presentation: lifecycle-map
- id: coding-agents
  map: agent-tools
  name: { en: Coding Agents, zh: 编程 Agent }
  presentation: capability-map
- id: productivity
  map: apps-saas
  name: { en: Productivity, zh: 生产力 }
  presentation: scenario-map
```

```yaml
# data/filters.yaml
open_source: { en: Open source, zh: 开源 }
closed_source: { en: Closed source, zh: 闭源 }
active: { en: Active, zh: 活跃 }
archived: { en: Archived, zh: 已归档 }
```

```yaml
# data/items/deepseek-v3.yaml
id: deepseek-v3
kind: foundation-model
map: models
category: foundation-models
name: { en: DeepSeek-V3, zh: DeepSeek-V3 }
summary: { en: Open-weight language model from DeepSeek., zh: DeepSeek 推出的开放权重大语言模型。 }
website: https://www.deepseek.com/
organization: deepseek
tags: [llm, text, open-weights]
regions: [CN]
status: active
related: [deepseek]
facts: { modalities: [text], license: MIT }
timeline: { released_at: 2024-12-26, provider_lane: deepseek, capabilities: [reasoning] }
sources: [{ url: https://www.deepseek.com/, checked_at: 2026-07-14 }]
```

```yaml
# data/items/deepseek.yaml
id: deepseek
kind: model-provider
map: models
category: model-providers
name: { en: DeepSeek, zh: 深度求索 }
summary: { en: AI company and model provider., zh: 人工智能公司与模型提供方。 }
website: https://www.deepseek.com/
tags: [provider, llm]
regions: [CN]
status: active
related: [deepseek-v3]
facts: { open_source: true }
sources: [{ url: https://www.deepseek.com/, checked_at: 2026-07-14 }]
```

```yaml
# data/items/vllm.yaml
id: vllm
kind: inference-engine
map: model-infra
category: inference
name: { en: vLLM, zh: vLLM }
summary: { en: Open-source inference and serving engine., zh: 开源推理与服务引擎。 }
website: https://vllm.ai/
tags: [inference, serving, open-source]
regions: [US]
status: active
related: []
facts: { deployment: [self-hosted], open_source: true }
sources: [{ url: https://vllm.ai/, checked_at: 2026-07-14 }]
```

```yaml
# data/items/cursor.yaml
id: cursor
kind: coding-agent
map: agent-tools
category: coding-agents
name: { en: Cursor, zh: Cursor }
summary: { en: AI code editor for software teams., zh: 面向软件团队的 AI 代码编辑器。 }
website: https://cursor.com/
tags: [ide, coding-agent]
regions: [US]
status: active
related: []
facts: { platforms: [macos, windows, linux], audience: developers }
sources: [{ url: https://cursor.com/, checked_at: 2026-07-14 }]
```

```yaml
# data/items/chatgpt.yaml
id: chatgpt
kind: desktop-mobile-app
map: apps-saas
category: productivity
name: { en: ChatGPT, zh: ChatGPT }
summary: { en: General-purpose AI assistant and productivity application., zh: 通用 AI 助手与生产力应用。 }
website: https://chatgpt.com/
tags: [assistant, productivity, desktop, mobile]
regions: [US]
status: active
related: []
facts: { audience: individuals, platforms: [web, macos, windows, ios, android] }
sources: [{ url: https://chatgpt.com/, checked_at: 2026-07-14 }]
```

- [ ] **Step 5: Run schema tests and commit the contract**

Run: `npm run test -- tests/catalog/schema.test.ts && git add lib/catalog data tests/catalog/schema.test.ts && git commit -m "feat: define YAML catalog contract"`

Expected: both schema tests pass and all starter YAML parses against the documented contract.

### Task 3: Build the catalog loader, integrity checks, and query service

**Files:**
- Create: `lib/catalog/load.ts`
- Create: `lib/catalog/query.ts`
- Create: `tests/catalog/load.test.ts`
- Create: `tests/catalog/query.test.ts`

**Interfaces:**
- Consumes `catalogEntrySchema` and YAML files from Task 2.
- Produces `loadCatalog(root?: string): Catalog`, where `Catalog` contains `entries`, `entriesById`, `categoriesById`, and `mapsById`; also produces `searchEntries(catalog, query, filters)` for routes in Tasks 4–7.

- [ ] **Step 1: Write failing loader and query tests**

```ts
// tests/catalog/load.test.ts
import { describe, expect, it } from 'vitest';
import { loadCatalog } from '@/lib/catalog/load';

describe('loadCatalog', () => {
  it('loads entries and resolves their relationships', () => {
    const catalog = loadCatalog();
    expect(catalog.entriesById.get('deepseek-v3')?.related).toContain('deepseek');
    expect(catalog.categoriesById.get('foundation-models')?.map).toBe('models');
  });

  it('rejects an unknown related id', () => {
    expect(() => loadCatalog('tests/fixtures/invalid-related')).toThrow('unknown related entry');
  });

  it('rejects a category assigned to the wrong map', () => {
    expect(() => loadCatalog('tests/fixtures/invalid-category-map')).toThrow('does not belong to map');
  });
});
```

```ts
// tests/catalog/query.test.ts
import { expect, it } from 'vitest';
import { loadCatalog } from '@/lib/catalog/load';
import { searchEntries } from '@/lib/catalog/query';

it('finds an English query and limits it to one map', () => {
  const results = searchEntries(loadCatalog(), 'deepseek', { map: 'models' });
  expect(results.map((entry) => entry.id)).toContain('deepseek-v3');
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test -- tests/catalog/load.test.ts tests/catalog/query.test.ts`

Expected: FAIL because loader and query modules do not exist.

- [ ] **Step 3: Implement build-time loading and deterministic querying**

```ts
// lib/catalog/load.ts
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { catalogEntrySchema } from './schema';
import type { CatalogEntry } from './types';

export type Category = { id: string; map: CatalogEntry['map']; name: Record<'en' | 'zh', string>; presentation: string };
export type MapDefinition = { id: CatalogEntry['map']; name: Record<'en' | 'zh', string>; presentation: string };
export type Catalog = { entries: CatalogEntry[]; entriesById: Map<string, CatalogEntry>; categoriesById: Map<string, Category>; mapsById: Map<string, MapDefinition> };

export function loadCatalog(root = join(process.cwd(), 'data')): Catalog {
  const readList = <T,>(file: string) => parse(readFileSync(join(root, file), 'utf8')) as T[];
  const categories = readList<Category>('categories.yaml');
  const maps = readList<MapDefinition>('maps.yaml');
  const itemDir = join(root, 'items');
  const entries = readdirSync(itemDir).filter((file) => file.endsWith('.yaml')).sort().map((file) => {
    const parsed = parse(readFileSync(join(itemDir, file), 'utf8'));
    return catalogEntrySchema.parse(parsed) as CatalogEntry;
  });
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const mapsById = new Map(maps.map((map) => [map.id, map]));
  for (const entry of entries) {
    const category = categoriesById.get(entry.category);
    if (!category) throw new Error(`Entry ${entry.id} has unknown category: ${entry.category}`);
    if (category.map !== entry.map) throw new Error(`Category ${entry.category} does not belong to map ${entry.map}`);
  }
  for (const entry of entries) for (const relatedId of entry.related) {
    if (!entriesById.has(relatedId)) throw new Error(`Entry ${entry.id} has unknown related entry: ${relatedId}`);
  }
  return { entries, entriesById, categoriesById, mapsById };
}
```

```ts
// lib/catalog/query.ts
import type { Catalog, } from './load';
import type { MapId } from './types';

export function searchEntries(catalog: Catalog, query: string, filters: { map?: MapId; category?: string; tag?: string }) {
  const needle = query.trim().toLocaleLowerCase();
  return catalog.entries.filter((entry) => {
    const haystack = [entry.id, entry.name.en, entry.name.zh, entry.summary.en, entry.summary.zh, ...entry.tags].join(' ').toLocaleLowerCase();
    return (!filters.map || entry.map === filters.map) && (!filters.category || entry.category === filters.category) && (!filters.tag || entry.tags.includes(filters.tag)) && (!needle || haystack.includes(needle));
  });
}
```

- [ ] **Step 4: Add invalid-related fixture and rerun tests**

```yaml
# tests/fixtures/invalid-related/items/broken.yaml
id: broken
kind: app
map: apps-saas
category: productivity
name: { en: Broken, zh: 损坏条目 }
summary: { en: Invalid relationship fixture., zh: 无效关联测试条目。 }
website: https://example.com/
tags: [fixture]
regions: [US]
status: active
related: [missing]
facts: {}
sources: [{ url: https://example.com/, checked_at: 2026-07-14 }]
```

```yaml
# tests/fixtures/invalid-related/categories.yaml and tests/fixtures/invalid-category-map/categories.yaml
- id: productivity
  map: apps-saas
  name: { en: Productivity, zh: 生产力 }
  presentation: scenario-map
```

```yaml
# tests/fixtures/invalid-related/maps.yaml and tests/fixtures/invalid-category-map/maps.yaml
- id: apps-saas
  name: { en: Apps & SaaS, zh: 应用与 SaaS }
  presentation: scenario-map
```

```yaml
# tests/fixtures/invalid-category-map/items/wrong-map.yaml
id: wrong-map
kind: app
map: agent-tools
category: productivity
name: { en: Wrong Map, zh: 错误地图 }
summary: { en: Invalid category map fixture., zh: 无效分类地图测试条目。 }
website: https://example.com/
tags: [fixture]
regions: [US]
status: active
related: []
facts: {}
sources: [{ url: https://example.com/, checked_at: 2026-07-14 }]
```

Run: `npm run test -- tests/catalog/load.test.ts tests/catalog/query.test.ts`

Expected: PASS with the invalid relationship rejected and English/Chinese text searchable.

- [ ] **Step 5: Commit the catalog service**

Run: `git add lib/catalog tests/catalog && git commit -m "feat: load and query landscape catalog"`

Expected: commit contains loader, query code, and fixtures only.

### Task 4: Add locale routing, metadata, and the Apple-style navigation shell

**Files:**
- Create: `lib/i18n.ts`
- Create: `components/site/GlobalNav.tsx`
- Create: `components/site/GlobalNav.module.css`
- Create: `app/[locale]/layout.tsx`
- Create: `app/[locale]/page.tsx`
- Modify: `app/page.tsx`
- Create: `tests/components/GlobalNav.test.tsx`

**Interfaces:**
- Consumes `siteConfig` and `Locale`.
- Produces a locale-validating route shell used by every public page.

- [ ] **Step 1: Write the failing navigation test**

```tsx
// tests/components/GlobalNav.test.tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { GlobalNav } from '@/components/site/GlobalNav';

it('links to all four English maps and the Chinese homepage', () => {
  render(<GlobalNav locale="en" />);
  expect(screen.getByRole('link', { name: 'Models' })).toHaveAttribute('href', '/en/maps/models');
  expect(screen.getByRole('link', { name: '中文' })).toHaveAttribute('href', '/zh');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/components/GlobalNav.test.tsx`

Expected: FAIL because the locale module and navigation component do not exist.

- [ ] **Step 3: Implement locale validation and navigation**

```ts
// lib/i18n.ts
import { notFound } from 'next/navigation';
export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export function assertLocale(value: string): asserts value is Locale { if (!locales.includes(value as Locale)) notFound(); }
export const copy = { en: { models: 'Models', infra: 'Model Infra', agents: 'Agent & Tools', apps: 'Apps & SaaS', language: '中文' }, zh: { models: '模型', infra: '模型基础设施', agents: 'Agent 与工具', apps: '应用与 SaaS', language: 'English' } } as const;
```

```tsx
// components/site/GlobalNav.tsx
import Link from 'next/link';
import { copy, type Locale } from '@/lib/i18n';
import styles from './GlobalNav.module.css';
export function GlobalNav({ locale }: { locale: Locale }) {
  const t = copy[locale]; const alternate = locale === 'en' ? 'zh' : 'en';
  return <nav aria-label="Global" className={styles.globalNav}><Link href={`/${locale}`}>AI Landscape</Link><Link href={`/${locale}/maps/models`}>{t.models}</Link><Link href={`/${locale}/maps/model-infra`}>{t.infra}</Link><Link href={`/${locale}/maps/agent-tools`}>{t.agents}</Link><Link href={`/${locale}/maps/apps-saas`}>{t.apps}</Link><Link href={`/${alternate}`}>{t.language}</Link></nav>;
}
```

- [ ] **Step 4: Add the locale layout and visual shell CSS**

```tsx
// app/[locale]/layout.tsx
import { GlobalNav } from '@/components/site/GlobalNav';
import { assertLocale, locales } from '@/lib/i18n';
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) { const { locale } = await params; assertLocale(locale); return <><GlobalNav locale={locale} /><main>{children}</main></>; }
```

```css
/* components/site/GlobalNav.module.css */
.globalNav { height: 44px; display: flex; align-items: center; gap: 20px; padding: 0 24px; background: #000; color: #fff; font-size: 12px; }
.globalNav a { color: inherit; min-height: 44px; display: inline-flex; align-items: center; text-decoration: none; }
.globalNav a:last-child { margin-left: auto; }
```

- [ ] **Step 5: Run component tests, type check, and commit**

Run: `npm run test -- tests/components/GlobalNav.test.tsx && npm run check && git add app components/site lib/i18n.ts tests/components/GlobalNav.test.tsx && git commit -m "feat: add bilingual navigation shell"`

Expected: test passes, `/en` and `/zh` are pre-renderable, and navigation maintains 44px targets.

### Task 5: Build the four-map gallery homepage

**Files:**
- Create: `components/site/MapTile.tsx`
- Create: `components/site/MapGallery.tsx`
- Create: `components/site/MapGallery.module.css`
- Modify: `app/[locale]/page.tsx`
- Create: `tests/components/MapGallery.test.tsx`

**Interfaces:**
- Consumes locale copy and `MapId`.
- Produces homepage links to exactly the four map routes.

- [ ] **Step 1: Write the failing gallery test**

```tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MapGallery } from '@/components/site/MapGallery';

it('renders four distinct map links', () => {
  render(<MapGallery locale="en" />);
  expect(screen.getAllByRole('link', { name: /Explore/ })).toHaveLength(4);
  expect(screen.getByRole('heading', { name: 'Models' })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/components/MapGallery.test.tsx`

Expected: FAIL because gallery components do not exist.

- [ ] **Step 3: Implement tile data and accessible gallery markup**

```tsx
// components/site/MapGallery.tsx
import { MapTile } from './MapTile';
import type { Locale } from '@/lib/i18n';
import styles from './MapGallery.module.css';
const maps = { en: [{ id: 'models', title: 'Models', description: 'Follow model families across providers and time.' }, { id: 'model-infra', title: 'Model Infra', description: 'Explore the training-to-serving lifecycle.' }, { id: 'agent-tools', title: 'Agent & Tools', description: 'See the systems that make agents useful.' }, { id: 'apps-saas', title: 'Apps & SaaS', description: 'Browse AI products by user and use case.' }], zh: [{ id: 'models', title: '模型', description: '沿时间线查看厂商与模型家族。' }, { id: 'model-infra', title: '模型基础设施', description: '探索从训练到推理的技术生命周期。' }, { id: 'agent-tools', title: 'Agent 与工具', description: '查看让 Agent 可用的系统与工具。' }, { id: 'apps-saas', title: '应用与 SaaS', description: '按用户和场景浏览 AI 产品。' }] } as const;
export function MapGallery({ locale }: { locale: Locale }) { return <section className={styles.gallery} aria-label="Landscape maps">{maps[locale].map((map, index) => <MapTile key={map.id} {...map} locale={locale} dark={index % 2 === 1} />)}</section>; }
```

```tsx
// components/site/MapTile.tsx
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import styles from './MapGallery.module.css';
export function MapTile({ id, title, description, locale, dark }: { id: string; title: string; description: string; locale: Locale; dark: boolean }) { return <article className={styles.tile} data-theme={dark ? 'dark' : 'light'}><h2>{title}</h2><p>{description}</p><Link href={`/${locale}/maps/${id}`}>{locale === 'en' ? `Explore ${title}` : `探索${title}`}</Link></article>; }
```

```tsx
// app/[locale]/page.tsx
import { MapGallery } from '@/components/site/MapGallery';
import { assertLocale } from '@/lib/i18n';
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; assertLocale(locale); return <MapGallery locale={locale} />; }
```

- [ ] **Step 4: Style full-bleed alternating tiles without gradients or UI shadows**

```css
/* components/site/MapGallery.module.css */
.tile { min-height: 500px; padding: 80px 24px; display: grid; place-content: center; text-align: center; background: var(--canvas); }
.tile[data-theme="dark"] { background: var(--tile-dark); color: #fff; }
.tile h2 { margin: 0; font-family: "SF Pro Display", system-ui, sans-serif; font-size: clamp(40px, 6vw, 56px); font-weight: 600; letter-spacing: -0.28px; line-height: 1.07; }
.tile p { max-width: 620px; margin: 16px auto 24px; }
.tile a { justify-self: center; display: inline-flex; align-items: center; padding: 11px 22px; border-radius: 9999px; background: var(--action-blue); color: #fff; text-decoration: none; }
```

- [ ] **Step 5: Run test, inspect the home route, and commit**

Run: `npm run test -- tests/components/MapGallery.test.tsx && npm run dev`

Expected: tests pass; manually inspect `http://localhost:3000/en` and `/zh` for four full-bleed alternating map tiles.

Run: `git add app/[locale]/page.tsx components/site tests/components/MapGallery.test.tsx && git commit -m "feat: add four-map gallery homepage"`

### Task 6: Implement Models timeline and the three specialized map renderers

**Files:**
- Create: `components/maps/MapShell.tsx`
- Create: `components/maps/ModelsTimeline.tsx`
- Create: `components/maps/ModelInfraMap.tsx`
- Create: `components/maps/AgentToolsMap.tsx`
- Create: `components/maps/AppsSaasMap.tsx`
- Create: `components/maps/maps.module.css`
- Create: `app/[locale]/maps/[mapId]/page.tsx`
- Create: `tests/components/ModelsTimeline.test.tsx`
- Create: `tests/components/CapabilityMap.test.tsx`

**Interfaces:**
- Consumes `Catalog`, `MapId`, and `CatalogEntry` from Tasks 2–3.
- Produces a server-rendered map route for each supported `mapId`; `categoryLabels: Record<string, string>` provides locale-correct headings and unknown maps return 404.

- [ ] **Step 1: Write failing renderer tests**

```tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ModelsTimeline } from '@/components/maps/ModelsTimeline';

it('groups models by provider lane and exposes their release date', () => {
  render(<ModelsTimeline entries={[{ id: 'deepseek-v3', kind: 'foundation-model', map: 'models', category: 'foundation-models', name: { en: 'DeepSeek-V3', zh: 'DeepSeek-V3' }, summary: { en: 'x', zh: 'x' }, website: 'https://example.com', tags: ['llm'], regions: ['CN'], status: 'active', related: [], facts: {}, timeline: { released_at: '2024-12-26', provider_lane: 'deepseek', capabilities: ['reasoning'] }, sources: [{ url: 'https://example.com', checked_at: '2026-07-14' }] }]} locale="en" />);
  expect(screen.getByRole('rowheader', { name: 'deepseek' })).toBeInTheDocument();
  expect(screen.getByText('Dec 26, 2024')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test -- tests/components/ModelsTimeline.test.tsx tests/components/CapabilityMap.test.tsx`

Expected: FAIL because map components do not exist.

- [ ] **Step 3: Implement a dispatcher with separate renderers rather than a generic grid**

```tsx
// components/maps/MapShell.tsx
import type { CatalogEntry, MapId } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import { ModelsTimeline } from './ModelsTimeline';
import { ModelInfraMap } from './ModelInfraMap';
import { AgentToolsMap } from './AgentToolsMap';
import { AppsSaasMap } from './AppsSaasMap';

const labels = { en: { models: 'Model release timeline', 'model-infra': 'Model infrastructure lifecycle', 'agent-tools': 'Agent and tools ecosystem', 'apps-saas': 'Apps and SaaS scenarios' }, zh: { models: '模型发布时间线', 'model-infra': '模型基础设施生命周期', 'agent-tools': 'Agent 与工具生态', 'apps-saas': '应用与 SaaS 场景' } } as const;
export function groupEntries(entries: CatalogEntry[]) { return entries.reduce<Record<string, CatalogEntry[]>>((groups, entry) => ({ ...groups, [entry.category]: [...(groups[entry.category] ?? []), entry] }), {}); }
export function MapShell({ map, entries, locale, categoryLabels }: { map: MapId; entries: CatalogEntry[]; locale: Locale; categoryLabels: Record<string, string> }) {
  const content = map === 'models' ? <ModelsTimeline entries={entries} locale={locale} /> : map === 'model-infra' ? <ModelInfraMap entries={entries} locale={locale} categoryLabels={categoryLabels} /> : map === 'agent-tools' ? <AgentToolsMap entries={entries} locale={locale} categoryLabels={categoryLabels} /> : <AppsSaasMap entries={entries} locale={locale} categoryLabels={categoryLabels} />;
  return <section data-map-canvas aria-label={labels[locale][map]}>{content}</section>;
}
```

```tsx
// components/maps/ModelsTimeline.tsx
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import { groupEntries } from './MapShell';
export function ModelsTimeline({ entries, locale }: { entries: CatalogEntry[]; locale: Locale }) {
  const lanes = Object.entries(entries.reduce<Record<string, CatalogEntry[]>>((groups, entry) => { const lane = entry.timeline?.provider_lane ?? entry.organization ?? 'other'; groups[lane] = [...(groups[lane] ?? []), entry]; return groups; }, {}));
  return <section aria-label="Model release timeline">{lanes.map(([lane, laneEntries]) => <div key={lane} role="row"><h2 role="rowheader">{lane}</h2>{laneEntries?.sort((a, b) => a.timeline!.released_at.localeCompare(b.timeline!.released_at)).map((entry) => <article key={entry.id}><time dateTime={entry.timeline!.released_at}>{new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${entry.timeline!.released_at}T00:00:00Z`))}</time><strong>{entry.name[locale]}</strong><span>{entry.timeline!.capabilities.join(' · ')}</span></article>)}</div>)}</section>;
}
```

- [ ] **Step 4: Implement capability/scenario maps using category sections and neutral map styling**

```tsx
// components/maps/ModelInfraMap.tsx
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import { groupEntries } from './MapShell';
export function ModelInfraMap({ entries, locale, categoryLabels }: { entries: CatalogEntry[]; locale: Locale; categoryLabels: Record<string, string> }) {
  return <section>{Object.entries(groupEntries(entries)).map(([category, group]) => <section key={category}><h2>{categoryLabels[category] ?? category}</h2><ul>{group.map((entry) => <li key={entry.id}>{entry.name[locale]}</li>)}</ul></section>)}</section>;
}
```

```tsx
// components/maps/AgentToolsMap.tsx
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import { groupEntries } from './MapShell';
export function AgentToolsMap({ entries, locale, categoryLabels }: { entries: CatalogEntry[]; locale: Locale; categoryLabels: Record<string, string> }) { return <section>{Object.entries(groupEntries(entries)).map(([category, group]) => <section key={category}><h2>{categoryLabels[category] ?? category}</h2><ul>{group.map((entry) => <li key={entry.id}>{entry.name[locale]}<span>{entry.tags.join(' · ')}</span></li>)}</ul></section>)}</section>; }
```

```tsx
// components/maps/AppsSaasMap.tsx
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import { groupEntries } from './MapShell';
export function AppsSaasMap({ entries, locale, categoryLabels }: { entries: CatalogEntry[]; locale: Locale; categoryLabels: Record<string, string> }) { return <section>{Object.entries(groupEntries(entries)).map(([category, group]) => <section key={category}><h2>{categoryLabels[category] ?? category}</h2><ul>{group.map((entry) => <li key={entry.id}>{entry.name[locale]}<span>{String(entry.facts.audience ?? '')}</span></li>)}</ul></section>)}</section>; }
```

In `components/maps/maps.module.css`, style all category sections with `border: 1px solid var(--hairline)`, neutral white or parchment fills, no `box-shadow`, and blue only on links.

- [ ] **Step 5: Implement static route generation and verify all four maps**

```tsx
// app/[locale]/maps/[mapId]/page.tsx
import { notFound } from 'next/navigation';
import { MapShell } from '@/components/maps/MapShell';
import { loadCatalog } from '@/lib/catalog/load';
import { assertLocale, locales } from '@/lib/i18n';
import { mapIds } from '@/lib/catalog/types';
export function generateStaticParams() { return locales.flatMap((locale) => mapIds.map((mapId) => ({ locale, mapId }))); }
export default async function MapPage({ params }: { params: Promise<{ locale: string; mapId: string }> }) { const { locale, mapId } = await params; assertLocale(locale); if (!mapIds.includes(mapId as (typeof mapIds)[number])) notFound(); const catalog = loadCatalog(); const entries = catalog.entries.filter((entry) => entry.map === mapId); const categoryLabels = Object.fromEntries([...catalog.categoriesById.values()].map((category) => [category.id, category.name[locale]])); return <MapShell map={mapId as (typeof mapIds)[number]} entries={entries} locale={locale} categoryLabels={categoryLabels} />; }
```

- [ ] **Step 6: Run map tests, production build, and commit**

Run: `npm run test -- tests/components/ModelsTimeline.test.tsx tests/components/CapabilityMap.test.tsx && npm run build && git add app/[locale]/maps components/maps tests/components && git commit -m "feat: render specialized AI landscape maps"`

Expected: all four route pairs build, models render lanes/times, and other maps render category sections.

### Task 7: Add catalog exploration and localized entry detail pages

**Files:**
- Create: `components/catalog/CatalogExplorer.tsx`
- Create: `components/catalog/FilterBar.tsx`
- Create: `components/catalog/EntryCard.tsx`
- Create: `components/catalog/catalog.module.css`
- Create: `app/[locale]/explore/page.tsx`
- Create: `app/[locale]/item/[id]/page.tsx`
- Create: `tests/components/CatalogExplorer.test.tsx`

**Interfaces:**
- Consumes the query service from Task 3 and catalog JSON-safe entries from server pages.
- Produces client-side query and map filtering without reading YAML in the browser.

- [ ] **Step 1: Write a failing explorer test**

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { CatalogExplorer } from '@/components/catalog/CatalogExplorer';

it('filters entries by text and map', () => {
  render(<CatalogExplorer locale="en" entries={[{ id: 'deepseek-v3', map: 'models', name: { en: 'DeepSeek-V3', zh: 'DeepSeek-V3' }, summary: { en: 'model', zh: '模型' }, tags: ['llm'] }]} />);
  fireEvent.change(screen.getByLabelText('Search catalog'), { target: { value: 'deepseek' } });
  expect(screen.getByText('DeepSeek-V3')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Map'), { target: { value: 'apps-saas' } });
  expect(screen.queryByText('DeepSeek-V3')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/components/CatalogExplorer.test.tsx`

Expected: FAIL because explorer components do not exist.

- [ ] **Step 3: Implement browser-side filtering over build-time catalog data**

```tsx
// components/catalog/CatalogExplorer.tsx
'use client';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/i18n';
export function CatalogExplorer({ locale, entries }: { locale: Locale; entries: { id: string; map: string; name: Record<Locale, string>; summary: Record<Locale, string>; tags: string[] }[] }) {
  const [query, setQuery] = useState(''); const [map, setMap] = useState('');
  const results = useMemo(() => entries.filter((entry) => (!map || entry.map === map) && `${entry.name.en} ${entry.name.zh} ${entry.summary.en} ${entry.summary.zh} ${entry.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [entries, map, query]);
  return <><label>Search catalog<input aria-label="Search catalog" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label>Map<select aria-label="Map" value={map} onChange={(event) => setMap(event.target.value)}><option value="">All maps</option><option value="models">Models</option><option value="model-infra">Model Infra</option><option value="agent-tools">Agent & Tools</option><option value="apps-saas">Apps & SaaS</option></select></label><ul>{results.map((entry) => <li key={entry.id}>{entry.name[locale]}</li>)}</ul></>;
}
```

- [ ] **Step 4: Create static explorer and entry pages with related/source sections**

```tsx
// app/[locale]/item/[id]/page.tsx
import { notFound } from 'next/navigation';
import { loadCatalog } from '@/lib/catalog/load';
import { assertLocale } from '@/lib/i18n';
export default async function EntryPage({ params }: { params: Promise<{ locale: string; id: string }> }) { const { locale, id } = await params; assertLocale(locale); const catalog = loadCatalog(); const entry = catalog.entriesById.get(id); if (!entry) notFound(); return <article><h1>{entry.name[locale]}</h1><p>{entry.summary[locale]}</p><a href={entry.website}>Website</a><h2>Sources</h2><ul>{entry.sources.map((source) => <li key={source.url}><a href={source.url}>{source.url}</a><time dateTime={source.checked_at}>{source.checked_at}</time></li>)}</ul><h2>Related</h2><ul>{entry.related.map((relatedId) => <li key={relatedId}>{catalog.entriesById.get(relatedId)?.name[locale]}</li>)}</ul></article>; }
```

```tsx
// app/[locale]/explore/page.tsx
import { CatalogExplorer } from '@/components/catalog/CatalogExplorer';
import { loadCatalog } from '@/lib/catalog/load';
import { assertLocale } from '@/lib/i18n';
export default async function ExplorePage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; assertLocale(locale); const entries = loadCatalog().entries.map(({ id, map, name, summary, tags }) => ({ id, map, name, summary, tags })); return <CatalogExplorer locale={locale} entries={entries} />; }
```

- [ ] **Step 5: Run tests and commit explorer/detail work**

Run: `npm run test -- tests/components/CatalogExplorer.test.tsx && npm run build && git add app/[locale]/explore app/[locale]/item components/catalog tests/components/CatalogExplorer.test.tsx && git commit -m "feat: add searchable catalog and entry details"`

Expected: explorer filters in browser, detail pages are static, and every source is visible.

### Task 8: Implement structured public submissions as GitHub Issues

**Files:**
- Create: `lib/github/createIssue.ts`
- Create: `app/api/submissions/route.ts`
- Create: `components/submit/SubmissionForm.tsx`
- Create: `app/[locale]/submit/page.tsx`
- Create: `tests/github/createIssue.test.ts`
- Create: `tests/api/submissions.test.ts`
- Create: `.env.example`

**Interfaces:**
- Consumes `GITHUB_ISSUES_TOKEN` and `GITHUB_REPOSITORY` (`owner/repository`) only at Vercel runtime.
- Produces `createSubmissionIssue(input, env, fetchImpl)` and `POST /api/submissions`.

- [ ] **Step 1: Write failing issue-format tests**

```ts
import { expect, it, vi } from 'vitest';
import { createSubmissionIssue } from '@/lib/github/createIssue';

it('posts a labelled issue with bilingual entry fields', async () => {
  const fetchImpl = vi.fn().mockResolvedValue(new Response(JSON.stringify({ html_url: 'https://github.com/o/r/issues/1' }), { status: 201 }));
  await createSubmissionIssue({ kind: 'addition', name: 'Example', website: 'https://example.com', category: 'apps-saas', message: 'Add this product.' }, { GITHUB_ISSUES_TOKEN: 'token', GITHUB_REPOSITORY: 'o/r' }, fetchImpl);
  expect(fetchImpl).toHaveBeenCalledWith('https://api.github.com/repos/o/r/issues', expect.objectContaining({ method: 'POST' }));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/github/createIssue.test.ts`

Expected: FAIL because the issue client does not exist.

- [ ] **Step 3: Implement issue creation with validation and no client-side secret**

```ts
// lib/github/createIssue.ts
export type SubmissionInput = { kind: 'addition' | 'correction'; name: string; website: string; category: string; message: string };
export async function createSubmissionIssue(input: SubmissionInput, env: { GITHUB_ISSUES_TOKEN: string; GITHUB_REPOSITORY: string }, fetchImpl: typeof fetch = fetch) {
  const response = await fetchImpl(`https://api.github.com/repos/${env.GITHUB_REPOSITORY}/issues`, { method: 'POST', headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${env.GITHUB_ISSUES_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ title: `[${input.kind}] ${input.name}`, labels: ['landscape-submission'], body: `## Request\n${input.kind}\n\n## Name\n${input.name}\n\n## Website\n${input.website}\n\n## Suggested map or category\n${input.category}\n\n## Details\n${input.message}` }) });
  if (!response.ok) throw new Error(`GitHub issue creation failed: ${response.status}`);
  return (await response.json() as { html_url: string }).html_url;
}
```

```ts
// app/api/submissions/route.ts
import { z } from 'zod';
import { createSubmissionIssue } from '@/lib/github/createIssue';
const submissionSchema = z.object({ kind: z.enum(['addition', 'correction']), name: z.string().min(2).max(120), website: z.url(), category: z.string().min(2), message: z.string().min(20).max(4000) });
export async function POST(request: Request) { const parsed = submissionSchema.safeParse(await request.json()); if (!parsed.success) return Response.json({ error: 'Invalid submission.' }, { status: 400 }); try { const issueUrl = await createSubmissionIssue(parsed.data, { GITHUB_ISSUES_TOKEN: process.env.GITHUB_ISSUES_TOKEN ?? '', GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY ?? '' }); return Response.json({ issueUrl }, { status: 201 }); } catch { return Response.json({ error: 'Submission service unavailable.' }, { status: 503 }); } }
```

- [ ] **Step 4: Build the accessible form and document Vercel environment variables**

```env
# .env.example
GITHUB_ISSUES_TOKEN=
GITHUB_REPOSITORY=
```

The form must collect the exact `SubmissionInput` fields, show a localized inline error for non-201 responses, and link to `issueUrl` after success. It must not expose either environment variable in client code.

```tsx
// components/submit/SubmissionForm.tsx
'use client';
import { useState } from 'react';
export function SubmissionForm() { const [state, setState] = useState<{ error?: string; issueUrl?: string }>({}); async function submit(formData: FormData) { const response = await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(formData)) }); const body = await response.json() as { error?: string; issueUrl?: string }; setState(response.ok ? { issueUrl: body.issueUrl } : { error: body.error ?? 'Submission service unavailable.' }); } return <form action={submit}><label>Request type<select name="kind"><option value="addition">Addition</option><option value="correction">Correction</option></select></label><label>Name<input name="name" required minLength={2} maxLength={120} /></label><label>Website<input name="website" type="url" required /></label><label>Suggested map or category<input name="category" required /></label><label>Details<textarea name="message" required minLength={20} maxLength={4000} /></label><button type="submit">Submit</button>{state.error && <p role="alert">{state.error}</p>}{state.issueUrl && <a href={state.issueUrl}>View submission</a>}</form>; }
```

```tsx
// app/[locale]/submit/page.tsx
import { SubmissionForm } from '@/components/submit/SubmissionForm';
import { assertLocale } from '@/lib/i18n';
export default async function SubmitPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; assertLocale(locale); return <main><h1>{locale === 'en' ? 'Submit an entry or correction' : '提交收录或纠错'}</h1><SubmissionForm /></main>; }
```

- [ ] **Step 5: Run API tests and commit**

Run: `npm run test -- tests/github/createIssue.test.ts tests/api/submissions.test.ts && git add app/api app/[locale]/submit components/submit lib/github tests/github tests/api .env.example && git commit -m "feat: add GitHub issue submission flow"`

Expected: valid input creates one labelled issue request; invalid input returns 400; GitHub failures return 503.

### Task 9: Add responsive accessibility coverage and production deployment checks

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/landscape.spec.ts`
- Create: `.github/workflows/validate.yml`
- Create: `README.md`
- Modify: `app/globals.css`
- Modify: `components/site/GlobalNav.module.css`

**Interfaces:**
- Consumes all routes and `npm` scripts from previous tasks.
- Produces a GitHub pull-request quality gate and Vercel configuration instructions.

- [ ] **Step 1: Write failing end-to-end tests for the public path**

```ts
import { expect, test } from '@playwright/test';

test('English visitor can enter Models, search, and open a source-backed entry', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('link', { name: 'Explore Models' }).click();
  await expect(page.getByRole('region', { name: 'Model release timeline' })).toBeVisible();
  await page.goto('/en/explore');
  await page.getByLabel('Search catalog').fill('deepseek');
  await page.getByText('DeepSeek-V3').click();
  await expect(page.getByRole('heading', { name: 'Sources' })).toBeVisible();
});

test('mobile navigation preserves a usable map entry target', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/zh');
  await expect(page.getByRole('link', { name: '探索模型' })).toBeVisible();
});
```

- [ ] **Step 2: Run E2E tests to verify current gaps**

Run: `npm run test:e2e`

Expected: FAIL until explorer links, accessible labels, and mobile styles are complete.

- [ ] **Step 3: Implement final responsive and accessibility requirements**

```css
/* append to app/globals.css */
:focus-visible { outline: 2px solid #0071e3; outline-offset: 2px; }
@media (max-width: 833px) { [data-map-canvas] { overflow-x: auto; } [data-map-canvas] > * { min-width: 760px; } }
@media (max-width: 640px) { article[data-theme] { min-height: 420px; padding-block: 48px; } }
```

```css
/* append to components/site/GlobalNav.module.css */
@media (max-width: 833px) { .globalNav { overflow-x: auto; gap: 12px; padding-inline: 16px; } }
```

In every map renderer, wrap visual content in the `MapShell` `data-map-canvas` element, use the localized label it supplies, render logos as `<img alt={entry.name[locale]} />`, and output `entry.status` as visible localized text next to each item. Do not encode status only through fill or border color.

- [ ] **Step 4: Add CI and deployment documentation**

```yaml
# .github/workflows/validate.yml
name: Validate landscape
on: [pull_request, push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run check
      - run: npm run test
      - run: npm run build
```

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
export default defineConfig({ testDir: './tests/e2e', use: { baseURL: 'http://127.0.0.1:3000', ...devices['Desktop Chrome'] }, webServer: { command: 'npm run dev', url: 'http://127.0.0.1:3000', reuseExistingServer: !process.env.CI } });
```

`README.md` must include local commands, YAML contribution rules, required logo-rights review, Vercel import steps, Preview behavior for Pull Requests, and the two server-side Vercel variables required only for submissions.

- [ ] **Step 5: Run full verification and commit**

Run: `npm run check && npm run test && npm run build && npm run test:e2e && git add app/globals.css playwright.config.ts tests/e2e .github/workflows/validate.yml README.md && git commit -m "chore: verify and document landscape deployment"`

Expected: all static map pages build, all unit/E2E tests pass, and Vercel can create a Preview from a pull request.

## Plan Self-Review

- Spec coverage: Tasks 2–3 implement YAML-only data, bilingual fields, integrity checks, and sources; Tasks 4–7 implement bilingual routes, four specialized map views, search, filters, and detail pages; Task 8 implements structured GitHub Issue submission; Task 9 implements responsive constraints, CI, and Vercel documentation.
- Visual coverage: Tasks 1, 4, 5, 6, and 9 enforce `DESIGN.md` tokens, full-bleed alternating tiles, the single interactive blue, no gradients, no UI shadows, minimum targets, and mobile map alternatives.
- Consistency review: `MapId`, `CatalogEntry`, `loadCatalog`, and `searchEntries` are defined before their consumers; timeline metadata is required only for foundation-model entries in the `models` map.
- Placeholder scan: this plan contains no deferred implementation steps; every task has named files, test commands, expected results, and a commit boundary.
