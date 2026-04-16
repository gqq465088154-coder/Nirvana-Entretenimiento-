'use client';

import { useMemo, useState } from 'react';
import PhoenixRebirth from '../components/PhoenixRebirth';
import { defaultLocale, locales, translations } from '../lib/i18n/config';
import { phoenixTheme } from '../lib/theme/phoenixTheme';

export default function HomePage() {
  const [locale, setLocale] = useState(defaultLocale);

  const t = useMemo(() => translations[locale] ?? translations[defaultLocale], [locale]);

  return (
    <main className="phoenix-page" style={{ '--fire-gradient': phoenixTheme.effects.fireGradient }}>
      <header className="top-nav">
        <div className="logo-wrap">
          <span className="logo-mark">🕊️</span>
          <span>Nirvana 2026</span>
        </div>
        <nav>
          <a href="#home">{t.navHome}</a>
          <a href="#highlights">{t.navHighlights}</a>
          <a href="#tickets">{t.navTickets}</a>
        </nav>
        <label className="locale-switcher">
          <span>Locale</span>
          <select value={locale} onChange={(e) => setLocale(e.target.value)}>
            {locales.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </header>

      <section id="home" className="hero">
        <PhoenixRebirth />
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
        <button type="button">{t.cta}</button>
      </section>

      <section id="highlights" className="highlights">
        <h2>{t.highlightsTitle}</h2>
        <div className="cards">
          <article>{t.highlightA}</article>
          <article>{t.highlightB}</article>
          <article>{t.highlightC}</article>
        </div>
      </section>

      <section id="tickets" className="layout-demo">
        <h3>Layout Demo</h3>
        <p>
          Phoenix grid + glow style demo for upcoming ticketing and campaign modules.
        </p>
      </section>
    </main>
  );
}
