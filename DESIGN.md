---
version: alpha
name: AI Landscape Visual System
description: >
  A high-density, logo-driven landscape interface for mapping the AI ecosystem.
  Light canvas, map-specific pastel category pills, strict 8px grid, precise typography,
  and no decorative gradients. Optimized for scanning many entries, categories, and
  relationships at a glance.

colors:
  canvas: "#ffffff"
  canvas-subtle: "#f7f8fa"
  ink: "#111827"
  body: "#4b5563"
  muted: "#9ca3af"
  hairline: "#e5e7eb"
  hairline-hover: "#d1d5db"
  action: "#2563eb"
  action-focus: "#1d4ed8"
  action-on-dark: "#60a5fa"
  on-action: "#ffffff"
  maps:
    models: "#6366f1"
    model-infra: "#3b82f6"
    agent-tools: "#ec4899"
    apps-saas: "#10b981"
  map-pills:
    models-bg: "#eef2ff"
    models-text: "#312e81"
    model-infra-bg: "#eff6ff"
    model-infra-text: "#1e40af"
    agent-tools-bg: "#fce7f3"
    agent-tools-text: "#831843"
    apps-saas-bg: "#ecfdf5"
    apps-saas-text: "#065f46"
  open-source: "#dbeafe"
  closed-source: "#ffffff"
  rank-gold: "#f59e0b"
  rank-silver: "#6b7280"
  rank-bronze: "#92400e"
  error: "#dc2626"

typography:
  fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  monoFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
  map-title:
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.5px
  section-title:
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.25px
  category-pill:
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0.5px
    textTransform: uppercase
  subcategory:
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
  item-primary:
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.3
  item-secondary:
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
  nav:
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1

spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  section: 48px
  page-gutter: 24px
  max-width: 1440px
  rail-width: 48px
  subcategory-label-width: 128px

rounded:
  none: 0px
  sm: 6px
  md: 10px
  lg: 16px
  pill: 9999px
  full: 9999px

components:
  global-nav:
    height: 56px
    backgroundColor: "{colors.canvas}"
    borderBottom: "1px solid {colors.hairline}"
    padding: "0 {spacing.page-gutter}"
  map-rail:
    width: "{spacing.rail-width}"
    backgroundColor: "{colors.maps.<mapId>}"
    textColor: "{colors.on-action}"
    writingMode: vertical-rl
    fontSize: 14px
    fontWeight: 600
    letterSpacing: 1px
  category-pill:
    backgroundColor: "{colors.map-pills.<mapId>-bg}"
    textColor: "{colors.map-pills.<mapId>-text}"
    borderRadius: "{rounded.pill}"
    padding: "6px 12px"
    typography: "{typography.category-pill}"
  section-card:
    backgroundColor: "{colors.canvas}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.lg}"
    padding: "{spacing.lg}"
  subcategory-row:
    gap: "{spacing.md}"
    separator: "1px dashed {colors.hairline}"
  item-chip-primary:
    height: 36px
    gap: 8px
    padding: "0 10px"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.md}"
    logoSize: 24px
    typography: "{typography.item-primary}"
  item-chip-secondary:
    height: 28px
    gap: 6px
    padding: "0 8px"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.sm}"
    logoSize: 18px
    typography: "{typography.item-secondary}"
  badge:
    height: 16px
    padding: "0 6px"
    borderRadius: "{rounded.pill}"
    fontSize: 10px
    fontWeight: 600
  timeline-axis:
    height: 28px
    borderTop: "1px solid {colors.hairline}"
    typography: "{typography.caption}"
  timeline-card:
    minWidth: 120px
    padding: "8px 12px"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.md}"
    openSourceBackground: "{colors.open-source}"
    closedSourceBackground: "{colors.closed-source}"
  search-input:
    height: 40px
    padding: "0 16px"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.pill}"
    typography: "{typography.body}"
  button-primary:
    height: 40px
    padding: "0 20px"
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    borderRadius: "{rounded.md}"
    typography: "{typography.nav}"
  button-secondary:
    height: 40px
    padding: "0 20px"
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.action}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.md}"
    typography: "{typography.nav}"
---

## Overview

The AI Landscape interface is a **technical ecosystem map**, not a marketing page.
The design borrows the density and readability of engineering architecture diagrams:
logo-driven entries, grouped by capability, with clear hierarchy created through
spacing, borders, and restrained color coding.

The previous Apple-style gallery vocabulary is replaced with a system that:
- Shows many entries at once without feeling cluttered.
- Uses color only for map/category identity and status, not decoration.
- Keeps a light, neutral canvas so that product logos remain the focal point.
- Maintains strict alignment and consistent sizing so the page feels engineered,
  not accidental.

## Design Principles

1. **Color means category.** Each map has a single identity color used for the
   left rail and its category pills. No other rainbow accents appear.
2. **Borders, not shadows.** Elevation and grouping come from `1px` hairlines,
   dashed row separators, and background changes. No drop shadows on cards or chips.
3. **Logos are content.** Entries are visualized as logo + name chips. Missing logos
   fall back to a neutral monogram, never a broken image.
4. **Density with rhythm.** Sections are dense, but whitespace inside cards and
   between rows prevents crowding.
5. **Responsive degradation.** On small screens, groups stack, labels move above
   rows, and the timeline becomes horizontally scrollable.

## Color

### Neutral Palette
- **Canvas** (`#ffffff`): primary background.
- **Canvas Subtle** (`#f7f8fa`): page backdrop, hover backgrounds, and alternating
  section rows.
- **Ink** (`#111827`): headings, primary text, and selected/active states.
- **Body** (`#4b5563`): secondary text, subcategory labels, and metadata.
- **Muted** (`#9ca3af`): placeholders, disabled text, and subtle dividers.
- **Hairline** (`#e5e7eb`): card borders, row separators, and chip borders.
- **Hairline Hover** (`#d1d5db`): hover state for bordered elements.

### Action Palette
- **Action Blue** (`#2563eb`): links, primary buttons, focus rings, and active
  filter states. The only interactive accent in the neutral UI layer.
- **Action Focus** (`#1d4ed8`): pressed/focus state.
- **Action on Dark** (`#60a5fa`): link color when used on dark surfaces (rare).

### Map Identity Colors
Each map receives one color used for the left rail and category pills:

| Map | Rail | Pill Background | Pill Text |
|-----|------|-----------------|-----------|
| Models | `#6366f1` | `#eef2ff` | `#312e81` |
| Model Infra | `#3b82f6` | `#eff6ff` | `#1e40af` |
| Agent & Tools | `#ec4899` | `#fce7f3` | `#831843` |
| Apps & SaaS | `#10b981` | `#ecfdf5` | `#065f46` |

### Status Colors
- **Open Source** (`#dbeafe`): timeline card fill for open-weight/open-source entries.
- **Closed Source** (`#ffffff`): timeline card fill for closed-source entries (white
  with hairline border).
- **Rank Gold / Silver / Bronze**: small ranking badges for leaderboards.

## Typography

The interface uses a single sans-serif family (`Inter`) and a monospace family for
metadata such as version strings or dates.

| Token | Size | Weight | Line Height | Use |
|-------|------|--------|-------------|-----|
| `map-title` | 36px | 600 | 1.2 | Page title above the map |
| `section-title` | 24px | 600 | 1.3 | Detail page section headings |
| `category-pill` | 12px | 600 | 1 | Section category labels |
| `subcategory` | 13px | 600 | 1.3 | Row labels inside cards |
| `item-primary` | 14px | 500 | 1.3 | Major entries |
| `item-secondary` | 13px | 500 | 1.3 | Secondary entries |
| `body` | 14px | 400 | 1.5 | Paragraphs and descriptions |
| `caption` | 12px | 400 | 1.4 | Badges, dates, metadata |
| `nav` | 14px | 500 | 1 | Global navigation |

## Layout

### Homepage

The homepage is a compact directory of the four maps rather than a gallery of
full-bleed tiles.

- Hero region: centered title, one-line subtitle, and a prominent search input.
- Map directory: a `2×2` grid on desktop, single column on mobile.
- Each map card:
  - `16px` radius, white background, hairline border.
  - Left `4px` accent strip in the map identity color.
  - Title in `section-title` style.
  - Short description in `body` style.
  - 2–3 representative category pills.
  - Entry count caption.
  - Primary "Explore" button aligned bottom-right.

### Page Grid
- Max content width: `1440px`, centered.
- Page gutter: `24px` on desktop, `16px` on mobile.
- Left rail: `48px` fixed width, map color, vertical map name.
- Main canvas: 12-column fluid grid with `24px` gutters.

### Section Card
- White background, `16px` radius, `1px` hairline border.
- Internal padding: `16px`.
- Category pill positioned top-left, `16px` from edges.
- Subcategory rows stacked vertically, separated by `1px dashed` hairlines.

### Subcategory Row
- Left label column: `128px` fixed, right-aligned text.
- Right items area: flex wrap, `12px` gap.
- On mobile, label moves above the items.

### Item Chip
- Two sizes maintain hierarchy.
- All chips align to a `28px` or `36px` height.
- Logo is vertically centered, never stretched.
- Text truncation with ellipsis if the name exceeds `160px`.

## Components

### Global Navigation
- Fixed 56px height, white background, bottom hairline.
- Left: site title and map tabs.
- Right: search input, locale switch, submit button.
- Active map tab underlined with the map identity color.

### Map Rail
- Full-height vertical strip on desktop.
- Background uses the current map identity color.
- White text, vertically rotated, centered.
- Hidden on tablet/mobile; replaced by a top badge.

### Category Pill
- Map-colored pastel background, dark text.
- Uppercase, letter-spaced, rounded pill.
- Clicking a pill toggles a filter for that category.

### Section Card
- Container for one capability area.
- No shadow; border defines the edge.
- Cards stack vertically with `24px` gaps.

### Item Chip
- Default state: transparent background, hairline border.
- Hover: `canvas-subtle` background, darker border.
- Active/pressed: `scale(0.98)`.
- Focus: `2px` action-blue outline.
- Badges appended inline after the name.

### Timeline (Models Map)
- Provider column on the left with logo and name.
- Horizontal month axis across the bottom.
- Each model appears as a card placed along the date axis.
- Card background indicates open/closed source.
- Connecting dots/lines between related model releases are optional and must be
  subtle (`1px dashed` hairline).

### Search & Filters
- Search input is pill-shaped, `40px` height.
- Active filters shown as removable pills.
- Empty states include a clear-filters action.

## Shapes

| Token | Value | Use |
|-------|-------|-----|
| `none` | 0px | Rail, full-width separators |
| `sm` | 6px | Secondary chips, small badges |
| `md` | 10px | Primary chips, buttons, timeline cards |
| `lg` | 16px | Section cards |
| `pill` | 9999px | Pills, search input, filter tags |
| `full` | 9999px | Avatars/monograms |

## Elevation & Depth

This system uses **no shadows**. Depth and grouping come from:
- Hairline borders around cards and chips.
- Dashed separators between rows.
- Background color changes for hover (`canvas-subtle`).
- Map color rail on the left edge.

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| `≥ 1280px` | Full 12-column canvas, rail visible, 5-column item rows possible |
| `1024–1279px` | 10-column canvas, rail visible, slightly smaller chips |
| `768–1023px` | Rail hidden, map badge in global nav, sections remain multi-column |
| `480–767px` | Section cards stack, subcategory rows become vertical, timeline scrolls horizontally |
| `< 480px` | Single-column items, badges hidden, search collapses to icon |

## Do's and Don'ts

### Do
- Use the map identity color only for the rail and category pills.
- Keep chip heights consistent (`28px` or `36px`).
- Use local SVG logos; fall back to monograms.
- Reserve Action Blue for interactive elements.
- Use `caption` size for badges and metadata.
- Provide horizontal scrolling for the model timeline on mobile.

### Don't
- Don't add decorative gradients.
- Don't use shadows on cards, chips, or buttons.
- Don't mix more than one accent color per map.
- Don't display broken logo links; always use a fallback.
- Don't shrink touch targets below `44 × 44px` on mobile.
- Don't use body text smaller than `12px`.

## Logo & Asset Guidelines

- Store logos in `public/logos/<id>.svg`.
- SVGs should be square viewboxes (e.g. `0 0 24 24` or `0 0 48 48`).
- Prefer monochrome or brand-color SVGs; the page does not recolor them.
- If no logo exists, render a `28px` or `36px` rounded monogram using the map
  identity color and the entry's initials.
