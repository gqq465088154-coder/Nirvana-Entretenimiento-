import styles from './PhoenixRebirth.module.css';

export default function PhoenixRebirth() {
  return (
    <div className={styles.sequence} aria-label="phoenix-rebirth-animation">
      <div className={styles.stageDark} />
      <div className={styles.stageFlame} />
      <div className={styles.core}>
        <span className={styles.phoenix}>🔥🕊️</span>
      </div>
      <div className={styles.explosion} />
    </div>
  );
}
