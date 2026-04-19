import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../app/page';

describe('HomePage', () => {
  it('renders the brand name', () => {
    render(<HomePage />);
    expect(screen.getByText('Nirvana Entertainment · Phoenix')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<HomePage />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('World Cup')).toBeInTheDocument();
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.getByText('Tickets')).toBeInTheDocument();
  });

  it('renders the hero section with title', () => {
    render(<HomePage />);
    expect(screen.getByText('FIFA World Cup 2026 · Phoenix Rebirth Season')).toBeInTheDocument();
  });

  it('renders the CTA button', () => {
    render(<HomePage />);
    expect(screen.getByText('Join now')).toBeInTheDocument();
  });

  it('renders all 3 game cards', () => {
    render(<HomePage />);
    expect(screen.getByText('FIFA Predictor Pro')).toBeInTheDocument();
    expect(screen.getByText('Phoenix Stadium Slots')).toBeInTheDocument();
    expect(screen.getByText('Champion Sprint Live')).toBeInTheDocument();
  });

  it('renders the locale switcher with all locale options', () => {
    render(<HomePage />);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(5);
    expect(options.map((opt) => opt.value)).toEqual([
      'zh-CN', 'es-AR', 'es-CL', 'en-US', 'pt-BR'
    ]);
  });

  it('renders the campaign section', () => {
    render(<HomePage />);
    expect(screen.getByText('World Cup 2026 Global Campaign')).toBeInTheDocument();
  });

  it('renders the tickets section', () => {
    render(<HomePage />);
    expect(screen.getByText('Tickets and member zone')).toBeInTheDocument();
  });
});
