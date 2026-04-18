import styles from './NirvanaEntryAnimation.module.css';

export default function NirvanaEntryAnimation() {
  return (
    <div className={styles.overlay} aria-hidden="true">
      <div className={styles.darkPhase} />
      <div className={styles.flamePhase} />
      <div className={styles.phoenixPhase}>🕊️</div>
      <div className={styles.burstPhase} />
      <div className={styles.caption}>NIRVANA 2026</div>
    </div>
  );
}
