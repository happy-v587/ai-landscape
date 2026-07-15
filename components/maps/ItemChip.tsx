'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import { Monogram } from './Monogram';
import { ItemModal } from './ItemModal';
import styles from './maps.module.css';

export function ItemChip({
  entry,
  entries,
  locale,
  size,
}: {
  entry: CatalogEntry;
  entries: CatalogEntry[];
  locale: Locale;
  size: 'primary' | 'secondary';
}) {
  const [selected, setSelected] = useState(false);
  const className = size === 'primary' ? styles.itemPrimary : styles.itemSecondary;
  const logoSize = size === 'primary' ? 24 : 18;
  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setSelected(true)}
        aria-label={entry.name[locale]}
      >
        {entry.logo ? (
          <Image src={entry.logo} alt="" width={logoSize} height={logoSize} />
        ) : (
          <Monogram name={entry.name[locale]} size={size === 'primary' ? 'md' : 'sm'} />
        )}
        <span className={styles.itemName}>{entry.name[locale]}</span>
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
