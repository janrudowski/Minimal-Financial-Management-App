import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DarkModeSwitch from './DarkModeSwitch';

describe('DarkModeSwitch', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders an accessible switch named Dark mode with the provided checked state', () => {
    render(<DarkModeSwitch checked={true} onToggle={() => undefined} />);

    expect(screen.getByRole('switch', { name: 'Dark mode' })).toBeChecked();
  });

  it('toggles from the keyboard using native button semantics', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<DarkModeSwitch checked={false} onToggle={onToggle} />);

    const switchControl = screen.getByRole('switch', { name: 'Dark mode' });

    await user.tab();
    expect(switchControl).toHaveFocus();

    await user.keyboard('[Space]');

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
