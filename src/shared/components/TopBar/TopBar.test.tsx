import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import TopBar from './TopBar';

describe('TopBar', () => {
  it('renders the page title as a heading and the provided user profile summary', () => {
    render(
      <MemoryRouter>
        <TopBar
          title='Dashboard'
          profile={{
            displayName: 'Avery Stone',
            email: 'avery@example.com',
            photoURL: 'https://example.com/avatar.png',
          }}
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Dashboard' })
    ).toBeInTheDocument();

    const profile = screen.getByRole('region', { name: 'User profile' });

    expect(within(profile).getByText('Avery Stone')).toBeInTheDocument();
    expect(within(profile).getByRole('img', { name: /avery stone/i }))
      .toHaveAttribute('src', 'https://example.com/avatar.png');
  });

  it('opens a user accordion with account details and a settings link', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <TopBar
          title='Dashboard'
          profile={{
            displayName: 'Avery Stone',
            email: 'avery@example.com',
            photoURL: 'https://example.com/avatar.png',
          }}
        />
      </MemoryRouter>
    );

    const accountButton = screen.getByRole('button', {
      name: 'Avery Stone account menu',
    });

    expect(accountButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(accountButton);

    expect(accountButton).toHaveAttribute('aria-expanded', 'true');

    const userMenu = screen.getByRole('menu', { name: 'User menu' });

    expect(within(userMenu).getByText('avery@example.com')).toBeInTheDocument();
    expect(
      within(userMenu).getByRole('menuitem', { name: 'Account settings' })
    ).toHaveAttribute('href', '/settings');

    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('menu', { name: 'User menu' })
    ).not.toBeInTheDocument();
    expect(accountButton).toHaveAttribute('aria-expanded', 'false');
  });
});
