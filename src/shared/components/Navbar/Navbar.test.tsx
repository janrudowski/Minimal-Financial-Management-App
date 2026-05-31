import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Navbar from './Navbar';

const onLogout = vi.fn();

function renderNavbar(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Navbar
        darkModeSwitch={<button type='button'>Dark mode</button>}
        onLogout={onLogout}
      />
    </MemoryRouter>
  );
}

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    onLogout.mockResolvedValue(undefined);
    localStorage.clear();
  });

  it('renders a labelled navigation region with app shell links', () => {
    renderNavbar('/transactions');

    const nav = screen.getByRole('navigation', { name: 'Main navigation' });

    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute(
      'href',
      '/'
    );
    expect(screen.getByRole('link', { name: /expenses/i })).toHaveAttribute(
      'href',
      '/transactions'
    );
    expect(screen.getByRole('link', { name: /settings/i })).toHaveAttribute(
      'href',
      '/settings'
    );
    expect(screen.getByRole('link', { name: /expenses/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('keeps the current logout behavior on the Logout button', async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('opens and closes a mobile navigation menu', async () => {
    const user = userEvent.setup();
    renderNavbar('/transactions');

    expect(
      screen.queryByRole('dialog', { name: 'Mobile menu' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const dialog = screen.getByRole('dialog', { name: 'Mobile menu' });
    expect(dialog).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Mobile navigation' })
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('navigation', { name: 'Mobile navigation' }))
        .getByRole('link', { name: /expenses/i })
    ).toHaveAttribute('aria-current', 'page');

    await user.click(screen.getByRole('button', { name: 'Close menu' }));

    expect(
      screen.queryByRole('dialog', { name: 'Mobile menu' })
    ).not.toBeInTheDocument();
  });

  it('closes the mobile menu after choosing a navigation link', async () => {
    const user = userEvent.setup();
    renderNavbar('/');

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getAllByRole('link', { name: /settings/i })[1]);

    expect(
      screen.queryByRole('dialog', { name: 'Mobile menu' })
    ).not.toBeInTheDocument();
  });

  it('closes the mobile menu with Escape', async () => {
    const user = userEvent.setup();
    renderNavbar();

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.keyboard('{Escape}');

    expect(
      screen.queryByRole('dialog', { name: 'Mobile menu' })
    ).not.toBeInTheDocument();
  });
});
