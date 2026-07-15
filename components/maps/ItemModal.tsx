'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { EntryDetail } from '@/components/catalog/EntryDetail';
import type { CatalogEntry } from '@/lib/catalog/types';
import type { Locale } from '@/lib/i18n';
import styles from './maps.module.css';

export function ItemModal({
  entry,
  locale,
  entries,
  onClose,
}: {
  entry: CatalogEntry;
  locale: Locale;
  entries: CatalogEntry[];
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const related = entry.related
    .map((id) => entries.find((item) => item.id === id))
    .filter((item): item is CatalogEntry => !!item);

  return createPortal(
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={entry.name[locale]}
    >
      <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className={styles.modalContent}>
          <EntryDetail entry={entry} locale={locale} related={related} compact />
        </div>
      </div>
    </div>,
    document.body
  );
}
