import styles from './maps.module.css';

export function SubcategoryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.subcategoryRow}>
      <div className={styles.subcategoryLabel}>{label}</div>
      <div className={styles.subcategoryItems}>{children}</div>
    </div>
  );
}
