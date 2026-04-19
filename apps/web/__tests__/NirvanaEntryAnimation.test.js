import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NirvanaEntryAnimation from '../components/NirvanaEntryAnimation';

describe('NirvanaEntryAnimation', () => {
  it('renders the overlay with aria-hidden', () => {
    const { container } = render(<NirvanaEntryAnimation />);
    const overlay = container.firstChild;
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the NIRVANA 2026 caption', () => {
    render(<NirvanaEntryAnimation />);
    expect(screen.getByText('NIRVANA 2026')).toBeInTheDocument();
  });
});
