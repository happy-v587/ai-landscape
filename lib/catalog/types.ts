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
