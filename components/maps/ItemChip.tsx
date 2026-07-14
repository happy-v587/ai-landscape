import Image from 'next/image';
import Link from 'next/link';
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
    <Link href={`/${locale}/item/${entry.id}`} className={className}>
      {entry.logo ? (
        <Image src={entry.logo} alt="" width={logoSize} height={logoSize} />
      ) : (
        <Monogram name={entry.name[locale]} size={size === 'primary' ? 'md' : 'sm'} />
      )}
      <span className={styles.itemName}>{entry.name[locale]}</span>
    </Link>
  );
}
