const { phoenixTheme } = require('../lib/theme/phoenixTheme');

describe('Phoenix theme', () => {
  it('defines all required color tokens', () => {
    const expectedColors = ['ember', 'flame', 'ash', 'night', 'glow', 'text'];
    for (const color of expectedColors) {
      expect(phoenixTheme.colors).toHaveProperty(color);
      expect(typeof phoenixTheme.colors[color]).toBe('string');
    }
  });

  it('defines typography settings', () => {
    expect(phoenixTheme.typography).toHaveProperty('heading');
    expect(phoenixTheme.typography).toHaveProperty('body');
  });

  it('defines shadows', () => {
    expect(phoenixTheme.shadows).toHaveProperty('card');
    expect(phoenixTheme.shadows).toHaveProperty('hero');
  });

  it('defines animations', () => {
    expect(phoenixTheme.animations).toHaveProperty('pulse');
    expect(phoenixTheme.animations).toHaveProperty('intro');
  });

  it('defines fire gradient effect', () => {
    expect(phoenixTheme.effects).toHaveProperty('fireGradient');
    expect(phoenixTheme.effects.fireGradient).toMatch(/linear-gradient/);
  });
});
