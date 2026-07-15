# AI Landscape

A bilingual, statically-generated map of the global AI ecosystem.

[中文介绍](./README.zh-CN.md)

**Live site:** [llm-landscape.vercel.app](https://llm-landscape.vercel.app)

## What is this?

AI Landscape organizes the fast-moving AI space into four visual maps:

- **Models** — model providers and foundation-model release timelines.
- **Model Infra** — inference, training, data, evaluation, and observability tools.
- **Agent & Tools** — agent frameworks, coding agents, runtimes, and SDKs.
- **Apps & SaaS** — chat apps, productivity tools, and research/knowledge products.

The site is built with [Next.js](https://nextjs.org/) and statically exported, so every map, category, and entry page loads fast and works without a runtime database.

## Tech stack

- **Framework:** Next.js 16 App Router + React 19 + TypeScript
- **Styling:** CSS Modules + a design-token system in `app/globals.css`
- **Data:** YAML files under `data/`, validated with Zod at build time
- **I18n:** English (`en`) and Chinese (`zh`) locales via `[locale]` routes
- **Analytics:** Vercel Analytics
- **Testing:** Vitest + jsdom, Playwright for end-to-end tests

## Development

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Run type checks
npm run check

# Run unit tests
npm run test

# Run end-to-end tests (requires a production build)
npm run build
npm run test:e2e
```

## Project structure

```
app/              # Next.js app router pages
components/       # React components (site chrome, maps, catalog)
data/             # YAML data: maps, categories, and item entries
lib/              # Catalog loading, schema validation, queries, i18n
tests/            # Vitest and Playwright tests
```

## Contributing data

Catalog entries live in `data/items/*.yaml`. If you want to add or update a product, open an issue using the **Add product** template in `.github/ISSUE_TEMPLATE/add-product.yml`.

## License

This project is private and not currently licensed for redistribution.
