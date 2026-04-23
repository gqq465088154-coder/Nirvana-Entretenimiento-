'use client';

import { useMemo, useState } from 'react';
import NirvanaEntryAnimation from '../components/NirvanaEntryAnimation';
import PhoenixRebirth from '../components/PhoenixRebirth';
import { defaultLocale, localeLabels, locales, translations } from '../lib/i18n/config';
import { phoenixTheme } from '../lib/theme/phoenixTheme';
import styles from './page.module.css';

export default function HomePage() {
  const [locale, setLocale] = useState(defaultLocale);
  const t = useMemo(() => translations[locale] ?? translations[defaultLocale], [locale]);

  return (
    <main
      className={styles.page}
      style={{
        '--fire-gradient': phoenixTheme.effects.fireGradient,
        '--phoenix-shadow': phoenixTheme.shadows.flameHard
      }}
    >
      <header className={styles.header}>
        <div className={styles.logoWrap}>
          <span className={styles.logoMark}>🔥🕊️</span>
          <span>Nirvana 2026</span>
        </div>
        <nav className={styles.nav}>
          <a href="#home">{t.navHome}</a>
          <a href="#highlights">{t.navHighlights}</a>
          <a href="#games">{t.navGames}</a>
          <a href="#tickets">{t.navTickets}</a>
        </nav>
        <label className={styles.localeSwitcher}>
          <span>Locale</span>
          <select value={locale} onChange={(event) => setLocale(event.target.value)}>
            {locales.map((item) => (
              <option key={item} value={item}>
                {localeLabels[item]}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section id="home" className={styles.hero}>
        <span className={styles.badge}>{t.heroBadge}</span>
        <PhoenixRebirth />
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <div className={styles.heroActions}>
          <button type="button" className={styles.primaryBtn}>
            {t.ctaPrimary}
          </button>
          <button type="button" className={styles.secondaryBtn}>
            {t.ctaSecondary}
          </button>
        </div>
      </section>

      <section id="highlights" className={styles.section}>
        <h2>{t.highlightsTitle}</h2>
        <div className={styles.cardGrid}>
          <article className={styles.card}>{t.highlightA}</article>
          <article className={styles.card}>{t.highlightB}</article>
          <article className={styles.card}>{t.highlightC}</article>
        </div>
      </section>

      <section id="games" className={styles.section}>
        <h2>{t.gamesTitle}</h2>
        <div className={styles.cardGrid}>
          <article className={styles.card}>{t.gameA}</article>
          <article className={styles.card}>{t.gameB}</article>
          <article className={styles.card}>{t.gameC}</article>
        </div>
      </section>

      <section id="tickets" className={styles.section}>
        <h2>{t.ticketsTitle}</h2>
        <article className={styles.card}>{t.ticketsBody}</article>
      </section>
    </main>
  );
}
