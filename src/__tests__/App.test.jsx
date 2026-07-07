import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App integration', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('PatternForge')).toBeInTheDocument();
  });

  it('renders the regex input', () => {
    render(<App />);
    const input = screen.getByLabelText('Espressione regolare');
    expect(input).toBeInTheDocument();
  });

  it('renders flag selector', () => {
    render(<App />);
    expect(screen.getByText('Flag')).toBeInTheDocument();
    expect(screen.getByText('Globale')).toBeInTheDocument();
  });

  it('renders test text area', () => {
    render(<App />);
    const textarea = screen.getByLabelText('Testo di prova');
    expect(textarea).toBeInTheDocument();
  });

  it('shows error for invalid regex', async () => {
    render(<App />);
    const input = screen.getByLabelText('Espressione regolare');
    fireEvent.change(input, { target: { value: '[a-z' } });
    fireEvent.blur(input);

    // Should show an error message
    const error = await screen.findByRole('alert');
    expect(error).toBeInTheDocument();
  });

  it('does not show error for valid regex', async () => {
    render(<App />);
    const input = screen.getByLabelText('Espressione regolare');
    fireEvent.change(input, { target: { value: '[a-z]+' } });
    fireEvent.blur(input);

    // Should not show error
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders pattern library sidebar', () => {
    render(<App />);
    const libraryHeadings = screen.getAllByText('Libreria pattern');
    expect(libraryHeadings.length).toBeGreaterThanOrEqual(1);
    const contattiElements = screen.getAllByText('Contatti');
    expect(contattiElements.length).toBeGreaterThanOrEqual(1);
  });

  it('has results tabs', () => {
    render(<App />);
    expect(screen.getByText('Dettaglio match')).toBeInTheDocument();
  });

  it('shows Libreria pattern tab', () => {
    render(<App />);
    // The results area has a "Libreria pattern" tab
    const tabs = screen.getAllByText('Libreria pattern');
    expect(tabs.length).toBeGreaterThanOrEqual(1);
  });
});
