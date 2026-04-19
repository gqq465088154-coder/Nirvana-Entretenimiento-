'use client';

import { useMemo, useState } from 'react';
import NirvanaEntryAnimation from '../components/NirvanaEntryAnimation';
import PhoenixRebirth from '../components/PhoenixRebirth';
import { defaultLocale, locales, translations } from '../lib/i18n/config';
import { phoenixTheme } from '../lib/theme/phoenixTheme';
import styles from './page.module.css';

export default function HomePage() {
  const [locale, setLocale] = useState(defaultLocale);
  const t = useMemo(() => translations[locale] ?? translations[defaultLocale], [locale]);

  return (
    <>
      <NirvanaEntryAnimation />
      <main
        className={styles.page}
        style={{
          '--fire-gradient': phoenixTheme.effects.fireGradient,
          '--ember': phoenixTheme.colors.ember,
          '--flame': phoenixTheme.colors.flame,
          '--glow': phoenixTheme.colors.glow,
          '--night': phoenixTheme.colors.night,
          '--ash': phoenixTheme.colors.ash,
          '--text-main': phoenixTheme.colors.text,
          '--card-shadow': phoenixTheme.shadows.card,
          '--hero-shadow': phoenixTheme.shadows.hero,
          '--heading-font': phoenixTheme.typography.heading,
          '--body-font': phoenixTheme.typography.body
        }}
      >
        <header className={styles.topNav}>
          <div className={styles.logoWrap}>
            <span className={styles.logoMark} aria-hidden="true">
              🔥
            </span>
            <span>{t.brand}</span>
          </div>

          <nav className={styles.navLinks}>
            <a href="#home">{t.navHome}</a>
            <a href="#campaign">{t.navCampaign}</a>
            <a href="/sportsbook">{t.navGames}</a>
            <a href="/casino">Casino</a>
            <a href="/profile">👤</a>
          </nav>

          <label className={styles.localeSwitcher}>
            <span>{t.locale}</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value)}>
              {locales.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </header>

        <section id="home" className={styles.hero}>
          <PhoenixRebirth />
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <button type="button">{t.cta}</button>
        </section>

        <section id="campaign" className={styles.campaign}>
          <h2>{t.campaignTitle}</h2>
          <p>{t.campaignBody}</p>
        </section>

        <section id="games" className={styles.games}>
          <h2>{t.gamesTitle}</h2>
          <div className={styles.cardGrid}>
            {t.gameCards.map((item) => (
              <article className={styles.gameCard} key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>{item.badge}</span>
              </article>
            ))}
          </div>
        </section>

        <section id="tickets" className={styles.tickets}>
          <h3>{t.ticketTitle}</h3>
          <p>{t.ticketBody}</p>
        </section>
      </main>
    </>
  );
}
