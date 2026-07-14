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
      <h2 className={styles.categoryPill}>{category}</h2>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}
