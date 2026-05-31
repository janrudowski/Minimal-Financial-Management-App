import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DarkModeContextProvider,
  useDarkMode,
} from './DarkModeProvider';

function setSystemDarkMode(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      addEventListener: vi.fn(),
      addListener: vi.fn(),
      dispatchEvent: vi.fn(),
      matches,
      media: query,
      onchange: null,
      removeEventListener: vi.fn(),
      removeListener: vi.fn(),
    })),
  });
}

function TestDarkModeConsumer() {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <button
      aria-checked={darkMode}
      onClick={() => setDarkMode((previousDarkMode) => !previousDarkMode)}
      role='switch'
      type='button'
    >
      Dark mode
    </button>
  );
}

function renderProvider() {
  render(
    <DarkModeContextProvider>
      <TestDarkModeConsumer />
    </DarkModeContextProvider>
  );
}

describe('DarkModeContextProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('uses and stores the dark system preference on first load', () => {
    setSystemDarkMode(true);

    renderProvider();

    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeChecked();
    expect(localStorage.getItem('darkmode')).toBe('true');
  });

  it('uses and stores the light system preference on first load', () => {
    setSystemDarkMode(false);

    renderProvider();

    expect(screen.getByRole('switch', { name: 'Dark mode' })).not.toBeChecked();
    expect(localStorage.getItem('darkmode')).toBe('false');
  });

  it('keeps a saved preference instead of replacing it with the system preference', () => {
    localStorage.setItem('darkmode', 'false');
    setSystemDarkMode(true);

    renderProvider();

    expect(screen.getByRole('switch', { name: 'Dark mode' })).not.toBeChecked();
    expect(localStorage.getItem('darkmode')).toBe('false');
  });

  it('saves user toggles through the provider setter', async () => {
    const user = userEvent.setup();
    setSystemDarkMode(false);
    renderProvider();

    await user.click(screen.getByRole('switch', { name: 'Dark mode' }));

    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeChecked();
    expect(localStorage.getItem('darkmode')).toBe('true');
  });
});
