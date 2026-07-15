---
version: beta
name: AI Landscape Visual System
description: >
  A refined "Field Atlas" interface for mapping the AI ecosystem. The design
  treats the site as a research annual or exhibition catalog: warm paper canvas,
  strong typographic hierarchy, muted pigment map colors, and a signature
  coordinate-rule motif that registers each section on the page.

colors:
  canvas: "#ffffff"
  canvas-paper: "#f6f4ef"
  canvas-subtle: "#edeae3"
  ink: "#111111"
  body: "#555550"
  muted: "#9c9a93"
  hairline: "#d8d5cc"
  hairline-hover: "#b8b5ad"
  accent: "#3d5a5a"
  accent-focus: "#2a3f3f"
  accent-on: "#ffffff"
  maps:
    models: "#5b5bd6"
    model-infra: "#2e7bbf"
    agent-tools: "#c44a8c"
    apps-saas: "#2e9e72"
  map-pills:
    models-bg: "#eaeaf9"
    models-text: "#2e2e7d"
    model-infra-bg: "#e6f0f9"
    model-infra-text: "#15406b"
    agent-tools-bg: "#f9e6f0"
    agent-tools-text: "#6b214b"
    apps-saas-bg: "#e6f5ee"
    apps-saas-text: "#15563d"
  open-source: "#e8f4f4"
  closed-source: "#ffffff"
  error: "#b91c1c"

typography:
  displayFamily: "Bricolage Grotesque, system-ui, sans-serif"
  bodyFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  monoFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
  page-title:
    fontSize: 72px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -2px
  map-title:
    fontSize: 42px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -1px
  section-title:
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 1px
    textTransform: uppercase
  subcategory:
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0.3px
    textTransform: uppercase
  item-primary:
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.3
  item-secondary:
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.3
  body:
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
  caption:
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.3px
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
  section: 64px
  page-gutter: 32px
  max-width: 1440px
  rail-width: 52px
  subcategory-label-width: 120px

rounded:
  none: 0px
  sm: 6px
  md: 10px
  lg: 16px
  xl: 20px
  pill: 9999px
  full: 9999px

components:
  global-nav:
    height: 64px
    backgroundColor: "rgba(255, 255, 255, 0.92)"
    backdropFilter: "blur(8px)"
    borderBottom: "1px solid {colors.hairline}"
    padding: "0 {spacing.page-gutter}"
  map-rail:
    width: "{spacing.rail-width}"
    backgroundColor: "{colors.maps.<mapId>}"
    textColor: "{colors.accent-on}"
    writingMode: vertical-rl
    fontSize: 13px
    fontWeight: 600
    letterSpacing: 1px
  category-label:
    fontFamily: "{typography.section-title.fontFamily}"
    fontSize: "{typography.section-title.fontSize}"
    color: "{colors.body}"
  coordinate-rule:
    height: 1px
    backgroundColor: "{colors.hairline}"
  section-card:
    backgroundColor: "{colors.canvas}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.xl}"
    padding: "{spacing.xxl}"
  subcategory-row:
    gap: "{spacing.lg}"
    separator: "1px solid {colors.hairline}"
  item-chip-primary:
    height: 40px
    gap: 8px
    padding: "0 12px"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.md}"
    logoSize: 22px
    typography: "{typography.item-primary}"
  item-chip-secondary:
    height: 32px
    gap: 6px
    padding: "0 10px"
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
    height: 32px
    borderBottom: "1px solid {colors.hairline}"
    typography: "{typography.caption}"
  timeline-card:
    minWidth: 140px
    padding: "6px 8px"
    border: "1px solid color-mix(in srgb, var(--lane-color) 30%, {colors.hairline})"
    borderLeft: "3px solid var(--lane-color)"
    borderRadius: "{rounded.sm}"
    openSourceBackground: "{colors.open-source}"
    closedSourceBackground: "{colors.closed-source}"
  search-input:
    height: 48px
    padding: "0 20px"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.pill}"
    typography: "{typography.body}"
  button-primary:
    height: 40px
    padding: "0 18px"
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-on}"
    borderRadius: "{rounded.md}"
    typography: "{typography.nav}"
  button-secondary:
    height: 40px
    padding: "0 18px"
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    border: "1px solid {colors.hairline}"
    borderRadius: "{rounded.md}"
    typography: "{typography.nav}"
---

## Overview

The AI Landscape interface is a **technical ecosystem atlas** — a reference work
rather than a marketing surface. The redesign moves away from the generic
AI-startup palette (pastel pills, `Inter` everywhere, flat cards) toward an
editorial, material feeling: a warm paper canvas, a characterful grotesque
display face, muted pigment colors, and a single signature motif.

The system still prioritizes density and scannability, because the page's job
is to show many entries at once. But it does so with the quiet confidence of a
well-printed annual or exhibition catalog.

## Design Principles

1. **Color means map identity.** Each map has one pigment color used for the
   left rail, active navigation markers, and timeline lane borders. It is not
   used as a decorative gradient or card shadow.
2. **Borders, not shadows.** Elevation and grouping come from `1px` hairlines,
   the coordinate rule, and background shifts. No drop shadows on cards or chips.
3. **Typography carries personality.** `Bricolage Grotesque` gives headings a
   slightly irregular, characterful voice; `Inter` keeps body copy neutral and
   readable; `JetBrains Mono` handles metadata.
4. **The coordinate rule is the signature.** Each section card is registered by
   a thin horizontal rule that extends from its category label. This is the one
   memorable detail that embodies the "atlas" metaphor.
5. **Logos are content.** Entries are logo + name chips. Missing logos fall back
   to a neutral monogram.
6. **Responsive degradation.** On small screens groups stack, labels move above
   rows, and the timeline scrolls horizontally.

## Color

### Neutral Palette

| Token | Hex | Use |
|-------|-----|-----|
| `canvas` | `#ffffff` | Card and modal backgrounds. |
| `canvas-paper` | `#f6f4ef` | Page background — warm, slightly greyed paper. |
| `canvas-subtle` | `#edeae3` | Hover backgrounds, alternating rows. |
| `ink` | `#111111` | Headings and primary text. |
| `body` | `#555550` | Secondary text and labels. |
| `muted` | `#9c9a93` | Placeholders, disabled text, axis labels. |
| `hairline` | `#d8d5cc` | Borders, rules, separators. |
| `hairline-hover` | `#b8b5ad` | Hover borders. |

### Action Palette

| Token | Hex | Use |
|-------|-----|-----|
| `accent` | `#3d5a5a` | Links, primary buttons, focus rings — a deep teal/slate. |
| `accent-focus` | `#2a3f3f` | Pressed/focus state. |
| `accent-on` | `#ffffff` | Text on accent surfaces. |

### Map Identity Colors

| Map | Rail | Pill Background | Pill Text |
|-----|------|-----------------|-----------|
| Models | `#5b5bd6` | `#eaeaf9` | `#2e2e7d` |
| Model Infra | `#2e7bbf` | `#e6f0f9` | `#15406b` |
| Agent & Tools | `#c44a8c` | `#f9e6f0` | `#6b214b` |
| Apps & SaaS | `#2e9e72` | `#e6f5ee` | `#15563d` |

Map colors are used for the rail and subtle active markers only. Category pills
on cards use the muted pastel background so they stay quiet.

## Typography

Three typefaces, loaded via `next/font/google`:

| Role | Face | Use |
|------|------|-----|
| Display | **Bricolage Grotesque** | Page titles, map titles, card titles. |
| Body | **Inter** | Body copy, labels, chips, navigation. |
| Mono | **JetBrains Mono** | Dates, versions, metadata, timeline axis. |

## Layout

### Homepage

- Hero region: large display title (clamp 52–96px), one-line subtitle, and a global stats band (maps · entries · active · providers).
- Atlas Index: a vertical stack of four full-width guide entries on desktop and mobile.
- Each guide is a doorway to a map, not a preview. It contains:
  - A monospaced index number (01–04).
  - Map name in display type.
  - A one-sentence description of the map's purpose.
  - Inline statistics: entry count, category count, and a compact insight line.
  - A short analytical sentence derived from the data (e.g., release cadence, layer distribution).
  - An "Explore" arrow call-to-action.
- Apple-like interactions:
  - Staggered entrance animation (fade + translate-y).
  - Hover: guide translates right, a map-color vertical line grows on the left, other guides dim to focus attention.
  - Active press scales down subtly.
  - Reduced motion is respected.

### Page Grid

- Max content width: `1440px`, centered.
- Page gutter: `32px` on desktop, `20px` on mobile.
- Left rail: `52px` fixed width, map color, vertical map name.
- Main canvas: fluid grid with `32px` gutters.

### Section Card

- White background, `20px` radius, `1px` hairline border.
- Internal padding: `32px`.
- Category label above the coordinate rule.
- Coordinate rule: `1px` hairline extending full-width, with small vertical ticks.

### Subcategory Row

- Left label column: `120px` fixed, uppercase, right-aligned.
- Right items area: flex wrap, `10px` gap.
- On mobile, label moves above the items.

### Item Chip

- **Name mode** (default on Models map):
  - Primary: `40px` height, `10px` radius, logo + name.
  - Secondary: `32px` height, `6px` radius, logo + name.
- **Logo-only mode** (used on Model Infra, Agent & Tools, Apps & SaaS maps):
  - `64px × 78px` rounded tile, `12px` radius, centered logo/monogram with a small name label below.
  - Label: `10px`, muted body color, max 2 lines, ellipsis.
- Logo source priority:
  1. Explicit `logo` field in entry YAML (local path or external URL).
  2. Derived from `website` domain via `https://logos.hunter.io/{domain}`.
  3. Monogram fallback using map color and entry initials.
- Hover: background shifts to `--canvas-subtle`, border darkens.
- Active/pressed: `scale(0.98)`.
- Focus: `2px` accent outline.

## Components

### Global Navigation

- Fixed `64px` height, frosted-glass white background (`rgba(255,255,255,0.92)`
  + `backdrop-filter: blur(8px)`), bottom hairline.
- Left: site title in display face.
- Center: map links as understated text.
- Right: search input, locale switch, submit button as subtle outline button.
- Active map link underlined with the map identity color.

### Map Rail

- Full-height vertical strip on desktop.
- Background uses the current map identity color.
- White text, vertically rotated, centered.
- Hidden on tablet/mobile; replaced by a top badge.

### Category Pill / Label

- Section cards use an uppercase label above the coordinate rule.
- Directory cards use outlined pills with the map color text.
- Filter pills use the muted map-pastel background.

### Coordinate Rule

The signature element. A `1px` horizontal rule spans the section card, starting
from a small vertical tick under the category label and ending at another tick
near the right edge. It registers the section on the page like a surveyor's
grid line.

### Timeline (Models Map)

- Provider column on the left with name.
- Horizontal month axis across the bottom.
- Each model appears as a card placed along the date axis.
- Card uses its provider's lane color for the left border.
- Connecting dots/lines between related releases are subtle (`1px dashed`
  hairline).

### Search & Filters

- Search input is pill-shaped, `48px` height.
- Active filters shown as removable pills.
- Empty states include a clear-filters action.

### Modal

- Overlay: `rgba(17, 17, 17, 0.5)`.
- Dialog: white, `20px` radius, no shadow (or a very subtle one), max-width
  `760px`.
- Close button: subtle outline circle.

## Shapes

| Token | Value | Use |
|-------|-------|-----|
| `none` | `0px` | Rail, full-width separators |
| `sm` | `6px` | Secondary chips, small badges |
| `md` | `10px` | Primary chips, buttons, timeline cards |
| `lg` | `16px` | Buttons, inputs |
| `xl` | `20px` | Section cards, modal |
| `pill` | `9999px` | Pills, search input, filter tags |
| `full` | `9999px` | Avatars/monograms |

## Elevation & Depth

No shadows. Depth comes from:

- Hairline borders around cards and chips.
- The coordinate rule inside section cards.
- Background color changes for hover (`canvas-subtle`).
- Map color rail on the left edge.
- Frosted-glass navigation bar.

## Motion

Keep motion restrained and purposeful:

- Page load: sections fade + translate-y by `16px` with a `60ms` stagger.
- Card/chip hover: border and background color transitions (`150ms ease`).
- Modal: overlay fades in, dialog scales from `0.98` to `1`.
- Respect `prefers-reduced-motion`.

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| `≥ 1280px` | Full canvas, rail visible, 2×2 directory |
| `1024–1279px` | Slightly reduced gutters |
| `768–1023px` | Rail hidden, map badge in nav, directory stacks |
| `480–767px` | Section cards stack, subcategory rows vertical, timeline scrolls horizontally |
| `< 480px` | Single-column items, badges hidden, search collapses to icon |

## Do's and Don'ts

### Do
- Use map identity color only for the rail, active nav marker, and timeline lane.
- Keep chip heights consistent (`40px` / `32px`).
- Use local SVG logos; fall back to monograms.
- Reserve Accent Teal for interactive elements.
- Use `caption` size for badges and metadata.
- Provide horizontal scrolling for the model timeline on mobile.
- Respect `prefers-reduced-motion`.

### Don't
- Don't add decorative gradients.
- Don't use shadows on cards, chips, or buttons (modal overlay excepted).
- Don't mix more than one accent color per map.
- Don't display broken logo links; always use a fallback.
- Don't shrink touch targets below `44 × 44px` on mobile.
- Don't use body text smaller than `11px`.

## Logo & Asset Guidelines

- Store logos in `public/logos/<id>.svg`.
- SVGs should be square viewboxes (e.g. `0 0 24 24` or `0 0 48 48`).
- Prefer monochrome or brand-color SVGs; the page does not recolor them.
- If no logo exists, render a rounded monogram using the map identity color and
  the entry's initials.
