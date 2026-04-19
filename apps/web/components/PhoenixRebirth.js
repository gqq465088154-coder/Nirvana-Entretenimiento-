import styles from './PhoenixRebirth.module.css';

export default function PhoenixRebirth() {
  return (
    <div className={styles.wrapper} aria-label="phoenix-rebirth-animation">
      <div className={styles.core}>🔥</div>
      <div className={styles.ring} />
      <div className={`${styles.ring} ${styles.ringTwo}`} />
    </div>
  );
}
