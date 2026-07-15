import type { CatalogEntry } from './types';

export function getLogoUrl(entry: CatalogEntry): string | null {
  if (entry.logo) return entry.logo;

  try {
    const url = new URL(entry.website);
    const domain = url.hostname.replace(/^www\./, '');
    if (!domain) return null;
    return `https://logos.hunter.io/${domain}`;
  } catch {
    return null;
  }
}

export function isLocalLogo(src: string): boolean {
  return src.startsWith('/');
}
