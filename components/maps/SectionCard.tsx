import styles from './maps.module.css';

export function SectionCard({
  category,
  children,
}: {
  category: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.categoryLabel}>{category}</h2>
        <div className={styles.coordinateRule}>
          <span className={styles.coordinateTick} />
          <span className={styles.coordinateLine} />
          <span className={styles.coordinateTick} />
        </div>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}
