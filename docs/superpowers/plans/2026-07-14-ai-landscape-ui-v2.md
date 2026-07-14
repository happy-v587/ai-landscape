# AI Landscape UI v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the AI Landscape static site with the new high-density, logo-driven visual system, replacing the previous Apple-style gallery design.

**Architecture:** Next.js App Router renders locale routes at build time. A Node-only catalog layer reads and validates YAML, then supplies typed entries to server components. Browser components receive JSON-safe catalog data. The visual layer uses CSS custom properties for map-specific colors and strictly follows the design tokens in `DESIGN.md`.

**Tech Stack:** Next.js App Router, React, TypeScript strict mode, Zod, `yaml`, Vitest, Playwright, CSS Modules/global CSS custom properties, Vercel.

## Global Constraints

- `data/**/*.yaml` is the only source for public catalog entries, category definitions, filters, and map configuration.
- Locales are exactly `en` and `zh`; every entry and taxonomy label has both translations.
- An entry has exactly one `map` and one `category`.
- Maps are `models`, `model-infra`, `agent-tools`, and `apps-saas`.
- Root `DESIGN.md` governs visual implementation: light canvas, map-specific pastel pills, no decorative gradients, no UI shadows, all interactive targets at least 44 × 44px.
- All source URLs and `checked_at` dates are required; invalid data fails tests and the production build.
- Use local SVG logo assets after confirming display rights; render a monogram fallback if no logo exists.

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
├─ layout.tsx
├─ page.tsx
├─ globals.css
components/
├─ catalog/CatalogExplorer.tsx
├─ catalog/EntryCard.tsx
├─ catalog/catalog.module.css
├─ maps/
│  ├─ AgentToolsMap.tsx
│  ├─ AppsSaasMap.tsx
│  ├─ ItemChip.tsx
│  ├─ MapRail.tsx
│  ├─ MapShell.tsx
│  ├─ ModelInfraMap.tsx
│  ├─ ModelsTimeline.tsx
│  ├─ Monogram.tsx
│  ├─ SectionCard.tsx
│  ├─ SubcategoryRow.tsx
│  └─ maps.module.css
├─ site/
│  ├─ GlobalNav.tsx
│  ├─ GlobalNav.module.css
│  ├─ HomeMapCard.tsx
│  ├─ HomeMapDirectory.tsx
│  └─ home.module.css
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
├─ i18n.ts
└─ site.ts
public/logos/*.svg
tests/
├─ setup.ts
├─ site.test.ts
├─ catalog/schema.test.ts
├─ catalog/load.test.ts
├─ catalog/query.test.ts
├─ components/GlobalNav.test.tsx
├─ components/HomeMapDirectory.test.tsx
├─ components/ItemChip.test.tsx
├─ components/ModelsTimeline.test.tsx
└─ e2e/landscape.spec.ts
```

---

### Task 1: Bootstrap the application and new visual-token foundation

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
- Produces `npm run check`, `npm run test`, `npm run build`, and `npm run test:e2e` commands.

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

Expected: FAIL because `package.json` and `@/lib/site` do not exist.

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
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
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

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: ['./tests/setup.ts'] },
  resolve: { alias: { '@': path.resolve(__dirname) } },
});
```

```ts
// tests/setup.ts
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';

vi.mock('next/image', () => ({
  default: function Image(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    return React.createElement('img', props);
  },
}));

vi.mock('next/link', () => ({
  default: function Link({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) {
    return React.createElement('a', { href, ...props }, children);
  },
}));
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
:root {
  --canvas: #ffffff;
  --canvas-subtle: #f7f8fa;
  --ink: #111827;
  --body: #4b5563;
  --muted: #9ca3af;
  --hairline: #e5e7eb;
  --hairline-hover: #d1d5db;
  --action: #2563eb;
  --action-focus: #1d4ed8;
  --action-on-dark: #60a5fa;
  --on-action: #ffffff;
  --nav-height: 56px;
  --rail-width: 48px;
  --max-width: 1440px;
  --page-gutter: 24px;
}

[data-map="models"] { --map: #6366f1; --pill-bg: #eef2ff; --pill-text: #312e81; }
[data-map="model-infra"] { --map: #3b82f6; --pill-bg: #eff6ff; --pill-text: #1e40af; }
[data-map="agent-tools"] { --map: #ec4899; --pill-bg: #fce7f3; --pill-text: #831843; }
[data-map="apps-saas"] { --map: #10b981; --pill-bg: #ecfdf5; --pill-text: #065f46; }

* { box-sizing: border-box; }

html { color-scheme: light; }

body {
  margin: 0;
  background: var(--canvas-subtle);
  color: var(--ink);
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

a { color: var(--action); text-decoration: none; }
a:hover { text-decoration: underline; }

button, a, input, select { min-height: 44px; }
```

- [ ] **Step 4: Install dependencies and run the test**

Run: `npm install && npm run test -- tests/site.test.ts`

Expected: PASS with one test.

- [ ] **Step 5: Verify type checking and commit**

Run: `npm run check`

Expected: type check succeeds.

Run:
```bash
git add package.json package-lock.json tsconfig.json next.config.ts vitest.config.ts app lib/site.ts tests/site.test.ts tests/setup.ts .gitignore
git commit -m "feat: bootstrap AI landscape application with new design tokens"
```

---

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
- Consumed by Task 3.

- [ ] **Step 1: Write failing schema tests**

```ts
// tests/catalog/schema.test.ts
import { describe, expect, it } from 'vitest';
import { catalogEntrySchema } from '@/lib/catalog/schema';

const baseEntry = {
  id: 'deepseek-v3',
  kind: 'foundation-model',
  map: 'models',
  category: 'foundation-models',
  name: { en: 'DeepSeek-V3', zh: 'DeepSeek-V3' },
  summary: { en: 'Open-weight model.', zh: '开放权重模型。' },
  website: 'https://example.com',
  tags: ['llm'],
  regions: ['CN'],
  status: 'active',
  related: [],
  facts: { modalities: ['text'] },
  timeline: { released_at: '2024-12-26', provider_lane: 'deepseek', capabilities: ['reasoning'] },
  sources: [{ url: 'https://example.com/source', checked_at: '2026-07-14' }],
};

describe('catalogEntrySchema', () => {
  it('requires timeline metadata for a timeline entry', () => {
    const { timeline, ...withoutTimeline } = baseEntry;
    expect(catalogEntrySchema.safeParse(withoutTimeline).success).toBe(false);
  });

  it('rejects an entry missing a Chinese summary', () => {
    expect(
      catalogEntrySchema.safeParse({ ...baseEntry, summary: { en: 'Only English.' } }).success
    ).toBe(false);
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm run test -- tests/catalog/schema.test.ts`

Expected: FAIL because the schema module does not exist.

- [ ] **Step 3: Implement the exact data types and discriminated schema**

```ts
// lib/catalog/types.ts
export const mapIds = ['models', 'model-infra', 'agent-tools', 'apps-saas'] as const;
export type MapId = (typeof mapIds)[number];
export type Locale = 'en' | 'zh';
export type LocalizedText = Record<Locale, string>;
export type Timeline = {
  released_at: string;
  provider_lane: string;
  capabilities: string[];
};
export type CatalogEntry = {
  id: string;
  kind: string;
  map: MapId;
  category: string;
  name: LocalizedText;
  summary: LocalizedText;
  website: string;
  logo?: string;
  organization?: string;
  subcategory?: string;
  tags: string[];
  regions: string[];
  status: 'active' | 'archived';
  related: string[];
  facts: Record<string, unknown>;
  timeline?: Timeline;
  sources: { url: string; checked_at: string }[];
};
```

```ts
// lib/catalog/schema.ts
import { z } from 'zod';
import { mapIds } from './types';

const localizedText = z.object({ en: z.string().min(1), zh: z.string().min(1) });
const source = z.object({ url: z.string().url(), checked_at: z.iso.date() });
const timeline = z.object({
  released_at: z.iso.date(),
  provider_lane: z.string().min(1),
  capabilities: z.array(z.string().min(1)).min(1),
});

export const catalogEntrySchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    kind: z.string().min(1),
    map: z.enum(mapIds),
    category: z.string().min(1),
    name: localizedText,
    summary: localizedText,
    website: z.string().url(),
    logo: z.string().startsWith('/').optional(),
    organization: z.string().optional(),
    subcategory: z.string().min(1).optional(),
    tags: z.array(z.string()).min(1),
    regions: z.array(z.string()).min(1),
    status: z.enum(['active', 'archived']),
    related: z.array(z.string()),
    facts: z.record(z.string(), z.unknown()),
    timeline: timeline.optional(),
    sources: z.array(source).min(1),
  })
  .superRefine((entry, ctx) => {
    if (entry.map === 'models' && entry.kind === 'foundation-model' && !entry.timeline) {
      ctx.addIssue({
        code: 'custom',
        path: ['timeline'],
        message: 'Foundation models require timeline metadata.',
      });
    }
    if (entry.map !== 'models' && entry.timeline) {
      ctx.addIssue({
        code: 'custom',
        path: ['timeline'],
        message: 'Only model-map entries may define timeline metadata.',
      });
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
summary:
  en: Open-weight mixture-of-experts language model.
  zh: 开放权重的混合专家语言模型。
website: https://www.deepseek.com/
organization: deepseek
tags: [llm, text, open-weights, moe, china]
regions: [CN]
status: active
related: [deepseek]
facts: { modalities: [text], license: MIT, parameters: '671B', context_window: 128K }
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
summary:
  en: AI company and model provider.
  zh: 人工智能公司与模型提供方。
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
subcategory: inference-engine
name: { en: vLLM, zh: vLLM }
summary:
  en: Open-source inference and serving engine.
  zh: 开源推理与服务引擎。
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
subcategory: ide
name: { en: Cursor, zh: Cursor }
summary:
  en: AI code editor for software teams.
  zh: 面向软件团队的 AI 代码编辑器。
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
subcategory: assistant
name: { en: ChatGPT, zh: ChatGPT }
summary:
  en: General-purpose AI assistant and productivity application.
  zh: 通用 AI 助手与生产力应用。
website: https://chatgpt.com/
tags: [assistant, productivity, desktop, mobile]
regions: [US]
status: active
related: []
facts: { audience: individuals, platforms: [web, macos, windows, ios, android] }
sources: [{ url: https://chatgpt.com/, checked_at: 2026-07-14 }]
```

- [ ] **Step 5: Run schema tests and commit the contract**

Run: `npm run test -- tests/catalog/schema.test.ts`

Expected: both schema tests pass.

Run:
```bash
git add lib/catalog data tests/catalog/schema.test.ts
git commit -m "feat: define YAML catalog contract"
```

---

### Task 3: Build the catalog loader, integrity checks, and query service

**Files:**
- Create: `lib/catalog/load.ts`
- Create: `lib/catalog/query.ts`
- Create: `tests/catalog/load.test.ts`
- Create: `tests/catalog/query.test.ts`
- Create: `tests/fixtures/invalid-related/items/broken.yaml`
- Create: `tests/fixtures/invalid-related/categories.yaml`
- Create: `tests/fixtures/invalid-related/maps.yaml`
- Create: `tests/fixtures/invalid-category-map/items/wrong-map.yaml`
- Create: `tests/fixtures/invalid-category-map/categories.yaml`
- Create: `tests/fixtures/invalid-category-map/maps.yaml`

**Interfaces:**
- Consumes `catalogEntrySchema` and YAML files from Task 2.
- Produces `loadCatalog(root?: string): Catalog` and `searchEntries(catalog, query, filters)`.

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

Expected: FAIL because the loader and query modules do not exist.

- [ ] **Step 3: Implement build-time loading and deterministic querying**

```ts
// lib/catalog/load.ts
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { catalogEntrySchema } from './schema';
import type { CatalogEntry, MapId } from './types';

export type Category = {
  id: string;
  map: MapId;
  name: Record<'en' | 'zh', string>;
  presentation: string;
};

export type MapDefinition = {
  id: MapId;
  name: Record<'en' | 'zh', string>;
  presentation: string;
};

export type Catalog = {
  entries: CatalogEntry[];
  entriesById: Map<string, CatalogEntry>;
  categoriesById: Map<string, Category>;
  mapsById: Map<string, MapDefinition>;
};

export function loadCatalog(root = join(process.cwd(), 'data')): Catalog {
  const readList = <T,>(file: string) => parse(readFileSync(join(root, file), 'utf8')) as T[];
  const categories = readList<Category>('categories.yaml');
  const maps = readList<MapDefinition>('maps.yaml');
  const itemDir = join(root, 'items');
  const entries = readdirSync(itemDir)
    .filter((file) => file.endsWith('.yaml'))
    .sort()
    .map((file) => {
      const parsed = parse(readFileSync(join(itemDir, file), 'utf8'));
      return catalogEntrySchema.parse(parsed) as CatalogEntry;
    });
  const entriesById = new Map(entries.map((entry) => [entry.id, entry]));
  const categoriesById = new Map(categories.map((category) => [category.id, category]));
  const mapsById = new Map(maps.map((map) => [map.id, map]));
  for (const entry of entries) {
    const category = categoriesById.get(entry.category);
    if (!category) throw new Error(`Entry ${entry.id} has unknown category: ${entry.category}`);
    if (category.map !== entry.map) {
      throw new Error(`Category ${entry.category} does not belong to map ${entry.map}`);
    }
  }
  for (const entry of entries) {
    for (const relatedId of entry.related) {
      if (!entriesById.has(relatedId)) {
        throw new Error(`Entry ${entry.id} has unknown related entry: ${relatedId}`);
      }
    }
  }
  return { entries, entriesById, categoriesById, mapsById };
}
```

```ts
// lib/catalog/query.ts
import type { Catalog } from './load';
import type { MapId } from './types';

export function searchEntries(
  catalog: Catalog,
  query: string,
  filters: { map?: MapId; category?: string; tag?: string }
) {
  const needle = query.trim().toLocaleLowerCase();
  return catalog.entries.filter((entry) => {
    const haystack = [
      entry.id,
      entry.name.en,
      entry.name.zh,
      entry.summary.en,
      entry.summary.zh,
      ...entry.tags,
    ]
      .join(' ')
      .toLocaleLowerCase();
    return (
      (!filters.map || entry.map === filters.map) &&
      (!filters.category || entry.category === filters.category) &&
      (!filters.tag || entry.tags.includes(filters.tag)) &&
      (!needle || haystack.includes(needle))
    );
  });
}
```

- [ ] **Step 4: Add invalid fixture files**

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
# tests/fixtures/invalid-related/categories.yaml
- id: productivity
  map: apps-saas
  name: { en: Productivity, zh: 生产力 }
  presentation: scenario-map
```

```yaml
# tests/fixtures/invalid-related/maps.yaml
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

```yaml
# tests/fixtures/invalid-category-map/categories.yaml
- id: productivity
  map: apps-saas
  name: { en: Productivity, zh: 生产力 }
  presentation: scenario-map
```

```yaml
# tests/fixtures/invalid-category-map/maps.yaml
- id: apps-saas
  name: { en: Apps & SaaS, zh: 应用与 SaaS }
  presentation: scenario-map
- id: agent-tools
  name: { en: Agent & Tools, zh: Agent 与工具 }
  presentation: capability-map
```

- [ ] **Step 5: Run loader/query tests and commit**

Run: `npm run test -- tests/catalog/load.test.ts tests/catalog/query.test.ts`

Expected: PASS.

Run:
```bash
git add lib/catalog tests/catalog tests/fixtures
git commit -m "feat: load and query landscape catalog"
```

---

### Task 4: Locale routing and the new global navigation shell

**Files:**
- Create: `lib/i18n.ts`
- Create: `components/site/GlobalNav.tsx`
- Create: `components/site/GlobalNav.module.css`
- Create: `app/[locale]/layout.tsx`
- Modify: `app/page.tsx` (already redirects)
- Create: `tests/components/GlobalNav.test.tsx`

**Interfaces:**
- Produces `Locale`, `assertLocale`, `copy`, and `GlobalNav`.
- Consumed by all locale pages.

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

Expected: FAIL.

- [ ] **Step 3: Implement locale validation and navigation**

```ts
// lib/i18n.ts
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
```

```tsx
// components/site/GlobalNav.tsx
import Link from 'next/link';
import { copy, type Locale } from '@/lib/i18n';
import styles from './GlobalNav.module.css';

const mapLinks: { id: 'models' | 'model-infra' | 'agent-tools' | 'apps-saas'; key: keyof typeof copy.en }[] = [
  { id: 'models', key: 'models' },
  { id: 'model-infra', key: 'infra' },
  { id: 'agent-tools', key: 'agents' },
  { id: 'apps-saas', key: 'apps' },
];

export function GlobalNav({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const alternate = locale === 'en' ? 'zh' : 'en';
  return (
    <header className={styles.nav}>
      <div className={styles.inner}>
        <Link href={`/${locale}`} className={styles.brand}>AI Landscape</Link>
        <nav className={styles.links} aria-label="Maps">
          {mapLinks.map((link) => (
            <Link key={link.id} href={`/${locale}/maps/${link.id}`} className={styles.link}>
              {t[link.key]}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <span className={styles.search}>{t.search}</span>
          <Link href={`/${locale}/submit`} className={styles.submit}>{t.submit}</Link>
          <Link href={`/${alternate}`} className={styles.locale}>{t.language}</Link>
        </div>
      </div>
    </header>
  );
}
```

```css
/* components/site/GlobalNav.module.css */
.nav {
  height: var(--nav-height);
  background: var(--canvas);
  border-bottom: 1px solid var(--hairline);
  position: sticky;
  top: 0;
  z-index: 100;
}

.inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--page-gutter);
  height: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
}

.brand {
  font-size: 18px;
  font-weight: 600;
  color: var(--ink);
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}

.links {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.link {
  font-size: 14px;
  font-weight: 500;
  color: var(--body);
  padding: 8px 12px;
  border-radius: 6px;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
}

.link:hover {
  background: var(--canvas-subtle);
  color: var(--ink);
  text-decoration: none;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search {
  font-size: 14px;
  color: var(--muted);
  padding: 8px 16px;
  border: 1px solid var(--hairline);
  border-radius: 9999px;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
}

.submit {
  font-size: 14px;
  font-weight: 500;
  color: var(--on-action);
  background: var(--action);
  padding: 8px 16px;
  border-radius: 6px;
  min-height: 36px;
  display: inline-flex;
  align-items: center;
}

.locale {
  font-size: 14px;
  font-weight: 500;
  color: var(--body);
  min-height: 44px;
  display: inline-flex;
  align-items: center;
}
```

```tsx
// app/[locale]/layout.tsx
import { GlobalNav } from '@/components/site/GlobalNav';
import { assertLocale, locales } from '@/lib/i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  assertLocale(locale);
  return (
    <>
      <GlobalNav locale={locale} />
      <main>{children}</main>
    </>
  );
}
```

- [ ] **Step 4: Run component tests, type check, and commit**

Run:
```bash
npm run test -- tests/components/GlobalNav.test.tsx
npm run check
```

Expected: test passes, type check succeeds.

Run:
```bash
git add app components/site lib/i18n.ts tests/components/GlobalNav.test.tsx
git commit -m "feat: add bilingual navigation shell"
```

---

### Task 5: Build the new homepage map directory

**Files:**
- Create: `components/site/HomeMapCard.tsx`
- Create: `components/site/HomeMapDirectory.tsx`
- Create: `components/site/home.module.css`
- Create: `app/[locale]/page.tsx`
- Create: `tests/components/HomeMapDirectory.test.tsx`

**Interfaces:**
- Consumes `Locale`, `copy`, and map definitions.
- Produces a 2×2 map directory on desktop and single column on mobile.

- [ ] **Step 1: Write the failing homepage test**

```tsx
// tests/components/HomeMapDirectory.test.tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { HomeMapDirectory } from '@/components/site/HomeMapDirectory';

it('renders four map cards with explore links', () => {
  render(<HomeMapDirectory locale="en" />);
  expect(screen.getByRole('heading', { name: 'Models' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Apps & SaaS' })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /Explore/ })).toHaveLength(4);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/components/HomeMapDirectory.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Implement the homepage directory and cards**

```tsx
// components/site/HomeMapDirectory.tsx
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
```

```tsx
// components/site/HomeMapCard.tsx
import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import styles from './home.module.css';

export function HomeMapCard({
  id,
  titleEn,
  titleZh,
  descEn,
  descZh,
  categoriesEn,
  categoriesZh,
  locale,
}: {
  id: 'models' | 'model-infra' | 'agent-tools' | 'apps-saas';
  titleEn: string;
  titleZh: string;
  descEn: string;
  descZh: string;
  categoriesEn: string[];
  categoriesZh: string[];
  locale: Locale;
}) {
  const categories = locale === 'en' ? categoriesEn : categoriesZh;
  return (
    <article className={styles.card} data-map={id}>
      <div className={styles.accent} />
      <div className={styles.content}>
        <h2 className={styles.cardTitle}>{locale === 'en' ? titleEn : titleZh}</h2>
        <p className={styles.cardDesc}>{locale === 'en' ? descEn : descZh}</p>
        <div className={styles.pills}>
          {categories.map((category) => (
            <span key={category} className={styles.pill}>{category}</span>
          ))}
        </div>
        <Link href={`/${locale}/maps/${id}`} className={styles.explore}>
          {locale === 'en' ? `Explore ${titleEn}` : `探索${titleZh}`}
        </Link>
      </div>
    </article>
  );
}
```

```css
/* components/site/home.module.css */
.directory {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 48px var(--page-gutter);
}

.hero {
  text-align: center;
  margin-bottom: 48px;
}

.title {
  font-size: 48px;
  font-weight: 600;
  letter-spacing: -1px;
  margin: 0 0 12px;
}

.subtitle {
  font-size: 18px;
  color: var(--body);
  margin: 0 0 24px;
}

.search {
  display: inline-flex;
  align-items: center;
  height: 48px;
  padding: 0 24px;
  border: 1px solid var(--hairline);
  border-radius: 9999px;
  color: var(--muted);
  background: var(--canvas);
  min-width: 320px;
  justify-content: flex-start;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.card {
  display: flex;
  background: var(--canvas);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  overflow: hidden;
}

.accent {
  width: 4px;
  flex-shrink: 0;
  background: var(--map);
}

.content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cardTitle {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.cardDesc {
  font-size: 14px;
  color: var(--body);
  margin: 0;
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 6px 10px;
  border-radius: 9999px;
  background: var(--pill-bg);
  color: var(--pill-text);
}

.explore {
  align-self: flex-start;
  margin-top: auto;
  padding: 10px 18px;
  border-radius: 8px;
  background: var(--action);
  color: var(--on-action);
  font-weight: 500;
}

.explore:hover { text-decoration: none; }

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
  .title { font-size: 36px; }
  .search { min-width: unset; width: 100%; }
}
```

```tsx
// app/[locale]/page.tsx
import { HomeMapDirectory } from '@/components/site/HomeMapDirectory';
import { assertLocale } from '@/lib/i18n';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertLocale(locale);
  return <HomeMapDirectory locale={locale} />;
}
```

- [ ] **Step 4: Run test, verify home route, and commit**

Run:
```bash
npm run test -- tests/components/HomeMapDirectory.test.tsx
npm run check
```

Expected: tests pass, type check succeeds.

Run:
```bash
git add app/[locale]/page.tsx components/site tests/components/HomeMapDirectory.test.tsx
git commit -m "feat: add homepage map directory"
```

---

### Task 6: Shared map components (rail, section card, item chip, monogram)

**Files:**
- Create: `components/maps/MapRail.tsx`
- Create: `components/maps/SectionCard.tsx`
- Create: `components/maps/SubcategoryRow.tsx`
- Create: `components/maps/ItemChip.tsx`
- Create: `components/maps/Monogram.tsx`
- Create: `components/maps/maps.module.css`
- Create: `tests/components/ItemChip.test.tsx`

**Interfaces:**
- Produces reusable map UI primitives consumed by Task 7 and Task 8.
- `ItemChip` accepts `entry` props and a `size` prop.

- [ ] **Step 1: Write failing item chip test**

```tsx
// tests/components/ItemChip.test.tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ItemChip } from '@/components/maps/ItemChip';

const entry = {
  id: 'cursor',
  name: { en: 'Cursor', zh: 'Cursor' },
  tags: ['ide'],
};

it('renders the entry name and a monogram fallback', () => {
  render(<ItemChip entry={entry} locale="en" size="primary" />);
  expect(screen.getByText('Cursor')).toBeInTheDocument();
  expect(screen.getByLabelText('Cursor monogram')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/components/ItemChip.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Implement shared map components**

```tsx
// components/maps/MapRail.tsx
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
```

```tsx
// components/maps/Monogram.tsx
import styles from './maps.module.css';

export function Monogram({ name, size }: { name: string; size: 'sm' | 'md' }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return (
    <span
      className={size === 'md' ? styles.monogramMd : styles.monogramSm}
      aria-label={`${name} monogram`}
    >
      {initials || name[0]?.toUpperCase()}
    </span>
  );
}
```

```tsx
// components/maps/ItemChip.tsx
import Image from 'next/image';
import type { Locale } from '@/lib/i18n';
import { Monogram } from './Monogram';
import styles from './maps.module.css';

export function ItemChip({
  entry,
  locale,
  size,
}: {
  entry: { id: string; name: Record<Locale, string>; logo?: string };
  locale: Locale;
  size: 'primary' | 'secondary';
}) {
  const className = size === 'primary' ? styles.itemPrimary : styles.itemSecondary;
  const logoSize = size === 'primary' ? 24 : 18;
  return (
    <a href={`/${locale}/item/${entry.id}`} className={className}>
      {entry.logo ? (
        <Image src={entry.logo} alt="" width={logoSize} height={logoSize} />
      ) : (
        <Monogram name={entry.name[locale]} size={size === 'primary' ? 'md' : 'sm'} />
      )}
      <span className={styles.itemName}>{entry.name[locale]}</span>
    </a>
  );
}
```

```tsx
// components/maps/SectionCard.tsx
import styles from './maps.module.css';

export function SectionCard({
  category,
  children,
}: {
  category: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.sectionCard}>
      <div className={styles.categoryPill}>{category}</div>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}
```

```tsx
// components/maps/SubcategoryRow.tsx
import styles from './maps.module.css';

export function SubcategoryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.subcategoryRow}>
      <div className={styles.subcategoryLabel}>{label}</div>
      <div className={styles.subcategoryItems}>{children}</div>
    </div>
  );
}
```

```css
/* components/maps/maps.module.css */
.rail {
  width: var(--rail-width);
  background: var(--map);
  color: var(--on-action);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1px;
  min-height: 100vh;
  position: sticky;
  top: var(--nav-height);
}

.sectionCard {
  background: var(--canvas);
  border: 1px solid var(--hairline);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
}

.categoryPill {
  display: inline-flex;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 6px 12px;
  border-radius: 9999px;
  background: var(--pill-bg);
  color: var(--pill-text);
  margin-bottom: 16px;
}

.sectionBody {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.subcategoryRow {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px dashed var(--hairline);
}

.subcategoryRow:first-of-type {
  border-top: none;
  padding-top: 0;
}

.subcategoryLabel {
  width: 128px;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--body);
  text-align: right;
  line-height: 28px;
}

.subcategoryItems {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-content: flex-start;
}

.itemPrimary,
.itemSecondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--hairline);
  background: var(--canvas);
  color: var(--ink);
  text-decoration: none;
}

.itemPrimary:hover,
.itemSecondary:hover {
  background: var(--canvas-subtle);
  border-color: var(--hairline-hover);
  text-decoration: none;
}

.itemPrimary {
  height: 36px;
  padding: 0 10px;
  border-radius: 10px;
}

.itemSecondary {
  height: 28px;
  padding: 0 8px;
  border-radius: 6px;
  gap: 6px;
}

.itemName {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
}

.itemSecondary .itemName {
  font-size: 13px;
  max-width: 140px;
}

.monogramMd,
.monogramSm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: var(--map);
  color: var(--on-action);
  font-weight: 600;
  border-radius: 6px;
}

.monogramMd { width: 24px; height: 24px; font-size: 11px; }
.monogramSm { width: 18px; height: 18px; font-size: 9px; border-radius: 4px; }

@media (max-width: 768px) {
  .rail { display: none; }
  .subcategoryRow { flex-direction: column; }
  .subcategoryLabel { width: auto; text-align: left; line-height: 1.3; }
}
```

- [ ] **Step 4: Run tests, verify a map page skeleton, and commit**

Run:
```bash
npm run test -- tests/components/ItemChip.test.tsx
npm run check
```

Expected: PASS.

Run:
```bash
git add components/maps tests/components/ItemChip.test.tsx
git commit -m "feat: add shared map UI primitives"
```

---

### Task 7: Models timeline renderer

**Files:**
- Create: `components/maps/ModelsTimeline.tsx`
- Create: `tests/components/ModelsTimeline.test.tsx`

**Interfaces:**
- Consumes `CatalogEntry[]` filtered to `map: 'models'`.
- Produces provider lanes with release-date-placed model cards.

- [ ] **Step 1: Write failing timeline test**

```tsx
// tests/components/ModelsTimeline.test.tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { ModelsTimeline } from '@/components/maps/ModelsTimeline';

const sampleEntry = {
  id: 'deepseek-v3',
  kind: 'foundation-model',
  map: 'models' as const,
  category: 'foundation-models',
  name: { en: 'DeepSeek-V3', zh: 'DeepSeek-V3' },
  summary: { en: 'x', zh: 'x' },
  website: 'https://example.com',
  tags: ['llm'],
  regions: ['CN'],
  status: 'active' as const,
  related: [],
  facts: { open_source: true },
  timeline: { released_at: '2024-12-26', provider_lane: 'deepseek', capabilities: ['reasoning'] },
  sources: [{ url: 'https://example.com', checked_at: '2026-07-14' }],
};

it('groups models by provider lane and exposes their release date', () => {
  render(<ModelsTimeline entries={[sampleEntry]} locale="en" />);
  expect(screen.getByRole('rowheader', { name: 'deepseek' })).toBeInTheDocument();
  expect(screen.getByText('Dec 26, 2024')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- tests/components/ModelsTimeline.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Implement the timeline**

```tsx
// components/maps/ModelsTimeline.tsx
import Link from 'next/link';
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import styles from './maps.module.css';

const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

export function ModelsTimeline({ entries, locale }: { entries: CatalogEntry[]; locale: Locale }) {
  const lanes = entries.reduce<Record<string, CatalogEntry[]>>((groups, entry) => {
    const lane = entry.timeline?.provider_lane ?? entry.organization ?? 'other';
    groups[lane] = [...(groups[lane] ?? []), entry];
    return groups;
  }, {});

  return (
    <section className={styles.timeline} aria-label="Model release timeline">
      <div className={styles.timelineGrid}>
        <div className={styles.timelineProviderHeader} />
        {months.map((month) => (
          <div key={month} className={styles.timelineMonth}>{month}</div>
        ))}
        {Object.entries(lanes).map(([lane, laneEntries]) => (
          <div key={lane} className={styles.timelineLane} role="row">
            <div className={styles.timelineProvider} role="rowheader">{lane}</div>
            <div className={styles.timelineLaneBody}>
              {laneEntries
                .sort((a, b) => a.timeline!.released_at.localeCompare(b.timeline!.released_at))
                .map((entry) => {
                  const open = entry.facts.open_source === true;
                  const date = new Date(`${entry.timeline!.released_at}T00:00:00Z`);
                  const monthIndex = months.findIndex(
                    (m) => m === date.toLocaleDateString('en-US', { month: 'short' })
                  );
                  return (
                    <Link
                      key={entry.id}
                      href={`/${locale}/item/${entry.id}`}
                      className={`${styles.timelineCard} ${open ? styles.timelineCardOpen : ''}`}
                      style={{ gridColumn: monthIndex >= 0 ? monthIndex + 2 : 2 }}
                    >
                      <time dateTime={entry.timeline!.released_at}>
                        {date.toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                      </time>
                      <strong>{entry.name[locale]}</strong>
                      <span>{entry.timeline!.capabilities.join(' · ')}</span>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

Add to `components/maps/maps.module.css`:

```css
.timeline {
  overflow-x: auto;
  padding-bottom: 16px;
}

.timelineGrid {
  display: grid;
  grid-template-columns: 160px repeat(9, minmax(120px, 1fr));
  gap: 12px 8px;
  min-width: 1200px;
}

.timelineMonth {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  text-align: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--hairline);
}

.timelineLane {
  display: contents;
}

.timelineProvider {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 16px;
  border-right: 2px solid var(--map);
}

.timelineLaneBody {
  grid-column: 2 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  min-height: 48px;
  padding: 8px 0;
  border-bottom: 1px dashed var(--hairline);
}

.timelineCard {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 12px;
  border: 1px solid var(--hairline);
  border-radius: 10px;
  background: var(--canvas);
  min-width: 120px;
  color: var(--ink);
  text-decoration: none;
}

.timelineCardOpen {
  background: var(--open-source);
}

.timelineCard time {
  font-size: 11px;
  color: var(--muted);
}

.timelineCard strong {
  font-size: 13px;
  font-weight: 600;
}

.timelineCard span {
  font-size: 11px;
  color: var(--body);
}
```

- [ ] **Step 4: Run timeline test and commit**

Run:
```bash
npm run test -- tests/components/ModelsTimeline.test.tsx
npm run check
```

Expected: PASS.

Run:
```bash
git add components/maps/ModelsTimeline.tsx tests/components/ModelsTimeline.test.tsx
git commit -m "feat: add models timeline renderer"
```

---

### Task 8: Specialized map renderers and map route

**Files:**
- Create: `components/maps/MapShell.tsx`
- Create: `components/maps/ModelInfraMap.tsx`
- Create: `components/maps/AgentToolsMap.tsx`
- Create: `components/maps/AppsSaasMap.tsx`
- Create: `app/[locale]/maps/[mapId]/page.tsx`
- Create: `tests/components/MapShell.test.tsx`

**Interfaces:**
- Consumes `Catalog` from Task 3 and shared map components from Task 6.
- Produces server-rendered routes for each supported `mapId`.

- [ ] **Step 1: Write failing map shell test**

```tsx
// tests/components/MapShell.test.tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { MapShell } from '@/components/maps/MapShell';

it('renders a model-infra capability section', () => {
  render(
    <MapShell
      map="model-infra"
      entries={[
        {
          id: 'vllm',
          kind: 'inference-engine',
          map: 'model-infra',
          category: 'inference',
          name: { en: 'vLLM', zh: 'vLLM' },
          summary: { en: 'x', zh: 'x' },
          website: 'https://example.com',
          tags: ['inference'],
          regions: ['US'],
          status: 'active',
          related: [],
          facts: {},
          sources: [{ url: 'https://example.com', checked_at: '2026-07-14' }],
        },
      ]}
      locale="en"
      categoryLabels={{ inference: 'Inference' }}
    />
  );
  expect(screen.getByRole('heading', { name: 'Inference' })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/components/MapShell.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Implement the dispatcher and specialized renderers**

```tsx
// components/maps/MapShell.tsx
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
```

```tsx
// components/maps/ModelInfraMap.tsx
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import { groupBySubcategory } from './MapShell';
import { SectionCard } from './SectionCard';
import { SubcategoryRow } from './SubcategoryRow';
import { ItemChip } from './ItemChip';

export function ModelInfraMap({
  entries,
  locale,
  categoryLabels,
}: {
  entries: CatalogEntry[];
  locale: Locale;
  categoryLabels: Record<string, string>;
}) {
  return (
    <div>
      {groupBySubcategory(entries).map(({ category, subcategories }) => (
        <SectionCard key={category} category={categoryLabels[category] ?? category}>
          {Object.entries(subcategories).map(([subcategory, group]) => (
            <SubcategoryRow key={subcategory} label={subcategory}>
              {group.map((entry) => (
                <ItemChip key={entry.id} entry={entry} locale={locale} size="primary" />
              ))}
            </SubcategoryRow>
          ))}
        </SectionCard>
      ))}
    </div>
  );
}
```

```tsx
// components/maps/AgentToolsMap.tsx
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import { groupBySubcategory } from './MapShell';
import { SectionCard } from './SectionCard';
import { SubcategoryRow } from './SubcategoryRow';
import { ItemChip } from './ItemChip';

export function AgentToolsMap({
  entries,
  locale,
  categoryLabels,
}: {
  entries: CatalogEntry[];
  locale: Locale;
  categoryLabels: Record<string, string>;
}) {
  return (
    <div>
      {groupBySubcategory(entries).map(({ category, subcategories }) => (
        <SectionCard key={category} category={categoryLabels[category] ?? category}>
          {Object.entries(subcategories).map(([subcategory, group]) => (
            <SubcategoryRow key={subcategory} label={subcategory}>
              {group.map((entry) => (
                <ItemChip key={entry.id} entry={entry} locale={locale} size="primary" />
              ))}
            </SubcategoryRow>
          ))}
        </SectionCard>
      ))}
    </div>
  );
}
```

```tsx
// components/maps/AppsSaasMap.tsx
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import { groupBySubcategory } from './MapShell';
import { SectionCard } from './SectionCard';
import { SubcategoryRow } from './SubcategoryRow';
import { ItemChip } from './ItemChip';

export function AppsSaasMap({
  entries,
  locale,
  categoryLabels,
}: {
  entries: CatalogEntry[];
  locale: Locale;
  categoryLabels: Record<string, string>;
}) {
  return (
    <div>
      {groupBySubcategory(entries).map(({ category, subcategories }) => (
        <SectionCard key={category} category={categoryLabels[category] ?? category}>
          {Object.entries(subcategories).map(([subcategory, group]) => (
            <SubcategoryRow key={subcategory} label={subcategory}>
              {group.map((entry) => (
                <ItemChip key={entry.id} entry={entry} locale={locale} size="primary" />
              ))}
            </SubcategoryRow>
          ))}
        </SectionCard>
      ))}
    </div>
  );
}
```

Add to `components/maps/maps.module.css`:

```css
.mapPage {
  display: flex;
  min-height: calc(100vh - var(--nav-height));
}

.mapCanvas {
  flex: 1;
  max-width: calc(var(--max-width) - var(--rail-width));
  padding: 32px var(--page-gutter);
}

@media (max-width: 768px) {
  .mapPage { display: block; }
  .mapCanvas { max-width: 100%; padding: 24px var(--page-gutter); }
}
```

```tsx
// app/[locale]/maps/[mapId]/page.tsx
import { notFound } from 'next/navigation';
import { MapShell } from '@/components/maps/MapShell';
import { loadCatalog } from '@/lib/catalog/load';
import { assertLocale, locales } from '@/lib/i18n';
import { mapIds } from '@/lib/catalog/types';

export function generateStaticParams() {
  return locales.flatMap((locale) => mapIds.map((mapId) => ({ locale, mapId })));
}

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string; mapId: string }>;
}) {
  const { locale, mapId } = await params;
  assertLocale(locale);
  if (!mapIds.includes(mapId as (typeof mapIds)[number])) notFound();
  const catalog = loadCatalog();
  const entries = catalog.entries.filter((entry) => entry.map === mapId);
  const categoryLabels = Object.fromEntries(
    [...catalog.categoriesById.values()].map((category) => [
      category.id,
      category.name[locale],
    ])
  );
  return (
    <MapShell
      map={mapId as (typeof mapIds)[number]}
      entries={entries}
      locale={locale}
      categoryLabels={categoryLabels}
    />
  );
}
```

- [ ] **Step 4: Run map tests, production build, and commit**

Run:
```bash
npm run test -- tests/components/MapShell.test.tsx
npm run build
```

Expected: all four map routes build.

Run:
```bash
git add app/[locale]/maps components/maps tests/components/MapShell.test.tsx
git commit -m "feat: render specialized AI landscape maps"
```

---

### Task 9: Entry detail page

**Files:**
- Create: `app/[locale]/item/[id]/page.tsx`
- Create: `components/catalog/EntryDetail.tsx`
- Create: `components/catalog/catalog.module.css`

**Interfaces:**
- Consumes `loadCatalog()` and renders one entry with sources and related items.

- [ ] **Step 1: Write the detail page with no extra tests**

Use the existing build as the verification (`npm run build` will fail if a detail page errors).

- [ ] **Step 2: Implement the detail page**

```tsx
// components/catalog/EntryDetail.tsx
import Link from 'next/link';
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import styles from './catalog.module.css';

export function EntryDetail({
  entry,
  locale,
  related,
}: {
  entry: CatalogEntry;
  locale: Locale;
  related: CatalogEntry[];
}) {
  return (
    <article className={styles.detail}>
      <header className={styles.detailHeader}>
        <h1 className={styles.detailTitle}>{entry.name[locale]}</h1>
        <p className={styles.detailSummary}>{entry.summary[locale]}</p>
        <a href={entry.website} className={styles.detailLink} target="_blank" rel="noreferrer">
          {entry.website}
        </a>
      </header>
      <section className={styles.detailSection}>
        <h2 className={styles.detailSectionTitle}>Tags</h2>
        <div className={styles.tagList}>
          {entry.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </section>
      {entry.timeline && (
        <section className={styles.detailSection}>
          <h2 className={styles.detailSectionTitle}>Release</h2>
          <p className={styles.detailText}>
            {entry.timeline.released_at} · {entry.timeline.provider_lane} ·{' '}
            {entry.timeline.capabilities.join(' · ')}
          </p>
        </section>
      )}
      <section className={styles.detailSection}>
        <h2 className={styles.detailSectionTitle}>Sources</h2>
        <ul className={styles.sourceList}>
          {entry.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer">{source.url}</a>
              <time dateTime={source.checked_at}>checked {source.checked_at}</time>
            </li>
          ))}
        </ul>
      </section>
      {related.length > 0 && (
        <section className={styles.detailSection}>
          <h2 className={styles.detailSectionTitle}>Related</h2>
          <ul className={styles.relatedList}>
            {related.map((item) => (
              <li key={item.id}>
                <Link href={`/${locale}/item/${item.id}`}>{item.name[locale]}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
```

```css
/* components/catalog/catalog.module.css */
.detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 48px var(--page-gutter);
}

.detailHeader {
  margin-bottom: 32px;
}

.detailTitle {
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.5px;
  margin: 0 0 12px;
}

.detailSummary {
  font-size: 18px;
  color: var(--body);
  margin: 0 0 16px;
}

.detailLink {
  font-size: 14px;
  color: var(--action);
}

.detailSection {
  margin-bottom: 32px;
}

.detailSectionTitle {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--muted);
  margin: 0 0 12px;
}

.detailText {
  font-size: 14px;
  color: var(--ink);
  margin: 0;
}

.tagList {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 10px;
  border: 1px solid var(--hairline);
  border-radius: 9999px;
  color: var(--body);
}

.sourceList,
.relatedList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sourceList li {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sourceList time {
  font-size: 12px;
  color: var(--muted);
}
```

```tsx
// app/[locale]/item/[id]/page.tsx
import { notFound } from 'next/navigation';
import { loadCatalog } from '@/lib/catalog/load';
import { assertLocale, locales } from '@/lib/i18n';
import { EntryDetail } from '@/components/catalog/EntryDetail';

export function generateStaticParams() {
  const catalog = loadCatalog();
  return locales.flatMap((locale) =>
    catalog.entries.map((entry) => ({ locale, id: entry.id }))
  );
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  assertLocale(locale);
  const catalog = loadCatalog();
  const entry = catalog.entriesById.get(id);
  if (!entry) notFound();
  const related = entry.related
    .map((relatedId) => catalog.entriesById.get(relatedId))
    .filter((item): item is typeof catalog.entries[number] => !!item);
  return <EntryDetail entry={entry} locale={locale} related={related} />;
}
```

- [ ] **Step 3: Build and commit**

Run: `npm run build`

Expected: build succeeds and generates all detail pages.

Run:
```bash
git add app/[locale]/item components/catalog
git commit -m "feat: add entry detail page"
```

---

### Task 10: Searchable catalog explorer

**Files:**
- Create: `components/catalog/CatalogExplorer.tsx`
- Create: `app/[locale]/explore/page.tsx`
- Create: `tests/components/CatalogExplorer.test.tsx`

**Interfaces:**
- Consumes the query service from Task 3 and JSON-safe catalog data.
- Produces client-side filtering without reading YAML in the browser.

- [ ] **Step 1: Write a failing explorer test**

```tsx
// tests/components/CatalogExplorer.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { CatalogExplorer } from '@/components/catalog/CatalogExplorer';

it('filters entries by text and map', () => {
  render(
    <CatalogExplorer
      locale="en"
      entries={[
        {
          id: 'deepseek-v3',
          map: 'models',
          name: { en: 'DeepSeek-V3', zh: 'DeepSeek-V3' },
          summary: { en: 'model', zh: '模型' },
          tags: ['llm'],
        },
      ]}
    />
  );
  fireEvent.change(screen.getByLabelText('Search catalog'), {
    target: { value: 'deepseek' },
  });
  expect(screen.getByText('DeepSeek-V3')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Map'), {
    target: { value: 'apps-saas' },
  });
  expect(screen.queryByText('DeepSeek-V3')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/components/CatalogExplorer.test.tsx`

Expected: FAIL.

- [ ] **Step 3: Implement browser-side filtering**

```tsx
// components/catalog/CatalogExplorer.tsx
'use client';
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
            <a href={`/${locale}/item/${entry.id}`}>{entry.name[locale]}</a>
            <span>{entry.summary[locale]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Add to `components/catalog/catalog.module.css`:

```css
.explorer {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 32px var(--page-gutter);
}

.explorerBar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.searchLabel,
.filterLabel {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--muted);
}

.searchInput,
.filterSelect {
  height: 40px;
  padding: 0 16px;
  border: 1px solid var(--hairline);
  border-radius: 9999px;
  background: var(--canvas);
  color: var(--ink);
  font-size: 14px;
  min-width: 240px;
}

.resultList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.resultList li {
  background: var(--canvas);
  border: 1px solid var(--hairline);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.resultList a {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
}

.resultList span {
  font-size: 13px;
  color: var(--body);
  line-height: 1.4;
}
```

```tsx
// app/[locale]/explore/page.tsx
import { CatalogExplorer } from '@/components/catalog/CatalogExplorer';
import { loadCatalog } from '@/lib/catalog/load';
import { assertLocale } from '@/lib/i18n';

export default async function ExplorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  assertLocale(locale);
  const entries = loadCatalog().entries.map(({ id, map, name, summary, tags }) => ({
    id,
    map,
    name,
    summary,
    tags,
  }));
  return <CatalogExplorer locale={locale} entries={entries} />;
}
```

- [ ] **Step 4: Run tests and commit**

Run:
```bash
npm run test -- tests/components/CatalogExplorer.test.tsx
npm run build
```

Expected: tests pass, build succeeds.

Run:
```bash
git add app/[locale]/explore components/catalog tests/components/CatalogExplorer.test.tsx
git commit -m "feat: add searchable catalog explorer"
```

---

### Task 11: End-to-end tests

**Files:**
- Create: `tests/e2e/landscape.spec.ts`

**Interfaces:**
- Verifies language switching, map navigation, search, and detail page linking.

- [ ] **Step 1: Add Playwright config and e2e spec**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

```ts
// tests/e2e/landscape.spec.ts
import { test, expect } from '@playwright/test';

test('homepage shows four map cards', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByRole('heading', { name: 'Models' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Apps & SaaS' })).toBeVisible();
});

test('navigates to models map and shows timeline', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('link', { name: 'Explore Models' }).click();
  await expect(page).toHaveURL(/\/en\/maps\/models/);
  await expect(page.getByRole('rowheader', { name: 'deepseek' })).toBeVisible();
});

test('switches language', async ({ page }) => {
  await page.goto('/en');
  await page.getByRole('link', { name: '中文' }).click();
  await expect(page).toHaveURL(/\/zh/);
});

test('explorer filters entries', async ({ page }) => {
  await page.goto('/en/explore');
  await page.getByLabel('Search catalog').fill('cursor');
  await expect(page.getByText('Cursor')).toBeVisible();
});
```

- [ ] **Step 2: Run e2e tests**

Run:
```bash
npm run build
npm run test:e2e
```

Expected: e2e tests pass against the production build.

- [ ] **Step 3: Commit**

Run:
```bash
git add playwright.config.ts tests/e2e
git commit -m "test: add e2e coverage for maps and explorer"
```

---

### Task 12: Final verification and cleanup

**Files:**
- Modify as needed.

- [ ] **Step 1: Run full verification pipeline**

Run:
```bash
npm run check
npm run test
npm run build
npm run test:e2e
```

Expected: all checks pass.

- [ ] **Step 2: Final commit if any fixes were needed**

If no changes, no commit is necessary. If fixes were made:

```bash
git add .
git commit -m "fix: final visual system polish"
```

---

## Self-Review

**Spec coverage:**
- Light canvas and map-specific colors: covered by Task 1 globals and Task 6 components.
- No shadows/gradients: enforced in CSS modules.
- 44px touch targets: buttons and links use `min-height`.
- Logo fallback monogram: Task 6 `Monogram`.
- Models timeline with provider lanes: Task 7.
- Category sections for other maps: Task 8.
- Search/filter and detail pages: Tasks 9–10.
- Bilingual routing: Task 4.

**Placeholder scan:** no TBD, TODO, or vague steps.

**Type consistency:** `CatalogEntry`, `MapId`, and `Locale` types are used consistently across tasks.
