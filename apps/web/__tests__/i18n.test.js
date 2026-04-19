const { locales, defaultLocale, translations } = require('../lib/i18n/config');

describe('i18n configuration', () => {
  it('exports the expected locales', () => {
    expect(locales).toEqual(['zh-CN', 'es-AR', 'es-CL', 'en-US', 'pt-BR']);
  });

  it('sets en-US as the default locale', () => {
    expect(defaultLocale).toBe('en-US');
  });

  it('has translations for every declared locale', () => {
    for (const locale of locales) {
      expect(translations).toHaveProperty(locale);
    }
  });

  it('each locale has all required keys', () => {
    const requiredKeys = [
      'locale', 'brand', 'navHome', 'navCampaign', 'navGames', 'navTickets',
      'title', 'subtitle', 'cta', 'campaignTitle', 'campaignBody',
      'gamesTitle', 'ticketTitle', 'ticketBody', 'gameCards'
    ];

    for (const locale of locales) {
      const t = translations[locale];
      for (const key of requiredKeys) {
        expect(t).toHaveProperty(key);
      }
    }
  });

  it('each locale has exactly 3 game cards', () => {
    for (const locale of locales) {
      expect(translations[locale].gameCards).toHaveLength(3);
    }
  });

  it('each game card has title, description and badge', () => {
    for (const locale of locales) {
      for (const card of translations[locale].gameCards) {
        expect(card).toHaveProperty('title');
        expect(card).toHaveProperty('description');
        expect(card).toHaveProperty('badge');
      }
    }
  });
});
