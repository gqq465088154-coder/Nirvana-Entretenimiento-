import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhoenixRebirth from '../components/PhoenixRebirth';

describe('PhoenixRebirth', () => {
  it('renders with phoenix-rebirth-animation aria-label', () => {
    const { container } = render(<PhoenixRebirth />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveAttribute('aria-label', 'phoenix-rebirth-animation');
  });

  it('renders the fire emoji core element', () => {
    const { container } = render(<PhoenixRebirth />);
    expect(container.textContent).toContain('🔥');
  });
});
