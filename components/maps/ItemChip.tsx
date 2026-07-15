'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import { getLogoUrl, isLocalLogo } from '@/lib/catalog/logo';
import { Monogram } from './Monogram';
import { ItemModal } from './ItemModal';
import styles from './maps.module.css';

export function ItemChip({
  entry,
  entries,
  locale,
  size,
  mode = 'name',
}: {
  entry: CatalogEntry;
  entries: CatalogEntry[];
  locale: Locale;
  size: 'primary' | 'secondary';
  mode?: 'name' | 'logo';
}) {
  const [selected, setSelected] = useState(false);
  const className = mode === 'logo'
    ? styles.itemLogo
    : size === 'primary'
      ? styles.itemPrimary
      : styles.itemSecondary;
  const logoSize = mode === 'logo' ? 28 : size === 'primary' ? 24 : 18;
  const logoSrc = getLogoUrl(entry);
  const useNextImage = logoSrc ? isLocalLogo(logoSrc) : false;

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setSelected(true)}
        aria-label={entry.name[locale]}
        title={entry.name[locale]}
      >
        {logoSrc ? (
          useNextImage ? (
            <Image src={logoSrc} alt="" width={logoSize} height={logoSize} />
          ) : (
            <img src={logoSrc} alt="" width={logoSize} height={logoSize} />
          )
        ) : (
          <Monogram name={entry.name[locale]} size={mode === 'logo' ? 'md' : size === 'primary' ? 'md' : 'sm'} />
        )}
        {mode === 'logo' ? (
          <span className={styles.itemLogoLabel}>{entry.name[locale]}</span>
        ) : (
          <span className={styles.itemName}>{entry.name[locale]}</span>
        )}
      </button>
      {selected && (
        <ItemModal
          entry={entry}
          locale={locale}
          entries={entries}
          onClose={() => setSelected(false)}
        />
      )}
    </>
  );
}
