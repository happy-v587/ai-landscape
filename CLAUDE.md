# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common commands

- `npm install` — install dependencies.
- `npm run dev` — start the Next.js dev server on `http://localhost:3000`.
- `npm run build` — production build (statically generates all locale/map/item pages).
- `npm run start` — serve a production build locally (used by Playwright).
- `npm run check` — run `tsc --noEmit`.
- `npm run test` — run all Vitest unit tests once.
- `npm run test:watch` — run Vitest in watch mode.
- `npm run test:e2e` — run Playwright end-to-end tests.

Run a single Vitest file: `npx vitest run tests/catalog/load.test.ts`.
Run a single Playwright test: `npx playwright test tests/e2e/landscape.spec.ts`.

## High-level architecture

**Next.js 16 App Router + React 19 + TypeScript.** The site is statically generated at build time. There is no runtime database; all catalog data is read from YAML files under `data/`.

**Internationalization** is implemented through the `[locale]` route segment. Supported locales are `en` and `zh`, defined in `lib/i18n.ts`. `app/[locale]/layout.tsx` renders `GlobalNav` and an `HtmlLang` wrapper; `app/layout.tsx` is the minimal root layout.

**Routes:**
- `/[locale]` — homepage showing all four maps (`components/site/FullLandscape.tsx`).
- `/[locale]/maps/[mapId]` — single map page (`components/maps/MapShell.tsx`).
- `/[locale]/item/[id]` — entry detail page (`components/catalog/EntryDetail.tsx`).
- `/[locale]/explore` — searchable/filterable catalog explorer (`components/catalog/CatalogExplorer.tsx`).

**Data model:**
- `data/maps.yaml` defines the four maps: `models`, `model-infra`, `agent-tools`, `apps-saas`.
- `data/categories.yaml` assigns each category to one map and a `presentation` type.
- `data/items/*.yaml` contains one bilingual entry per file. Each entry must validate against `lib/catalog/schema.ts` (`zod`). Foundation models on the `models` map must include `timeline`; other entries must not.
- `lib/catalog/load.ts` reads and validates all YAML at build time, returning a `Catalog` object with `entries`, `entriesById`, `categoriesById`, and `mapsById`.
- `lib/catalog/query.ts` exposes `searchEntries` for the explore page.

**Component structure:**
- `components/site/` — global chrome (navigation, homepage layout).
- `components/maps/` — map rendering: `MapShell`, `CapabilityMap`, `ModelsTimeline`, `SectionCard`, `SubcategoryRow`, `ItemChip`, `ItemModal`, `MapRail`, `Monogram`.
- `components/catalog/` — search and detail views.
- CSS modules live next to their components; global styles and CSS variables are in `app/globals.css`.

**Design system:** `DESIGN.md` is the source of truth. Key constraints: light canvas, map-specific identity colors, no decorative gradients, no shadows, 8px grid, hairline borders, and logo-driven chips with monogram fallbacks.

**Testing:**
- Vitest with `jsdom` and `@testing-library/react` for unit/component tests. Setup is in `tests/setup.ts`, which mocks `next/image` and `next/link`.
- Playwright for end-to-end tests in `tests/e2e/`; config starts the production server on `http://localhost:3000`.
- Catalog fixture tests in `tests/fixtures/` assert that invalid YAML is rejected by the schema.

## Important notes

- The `@/` path alias maps to the repository root (`./`).
- There is no `public/` directory yet. Logos are intended to be local SVGs at `public/logos/<id>.svg`; until they exist, entries render monograms.
- All catalog and map pages are statically generated. The only potential server route is `/api/submissions`, which is not currently present in the codebase.
- The project is configured for Vercel (see `.vercel/project.json`). The build command is `npm run build`.
