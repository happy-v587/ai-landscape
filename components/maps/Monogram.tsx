import styles from './maps.module.css';

export function Monogram({ name, size }: { name: string; size: 'sm' | 'md' }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
  return (
    <span
      className={size === 'md' ? styles.monogramMd : styles.monogramSm}
      aria-label={`${name} monogram`}
    >
      {initials || name[0]?.toUpperCase()}
    </span>
  );
}
