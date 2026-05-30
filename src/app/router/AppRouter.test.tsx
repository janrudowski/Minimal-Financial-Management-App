import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { AppRouter } from './AppRouter';

vi.mock('../../features/auth/context/AuthContext', () => ({
  useAuth: () => ({ currentUser: null }),
}));

vi.mock('../../shared/components/Navbar/Navbar', () => ({
  default: () => <nav aria-label="Main navigation">Navigation</nav>,
}));

vi.mock('../../features/dashboard/components/Dashboard', () => ({
  default: () => <h1>Dashboard page</h1>,
}));

vi.mock('../../features/expenses/components/Transactions', () => ({
  default: () => <h1>Transactions page</h1>,
}));

vi.mock('../../features/settings/components/Settings', () => ({
  default: () => <h1>Settings page</h1>,
}));

vi.mock('../../features/auth/components/Login', () => ({
  default: () => <h1>Login page</h1>,
}));

vi.mock('../../features/auth/components/Signup', () => ({
  default: () => <h1>Signup page</h1>,
}));

describe('AppRouter', () => {
  it('renders the login route for guests', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Login page' })
    ).toBeInTheDocument();
  });

  it('redirects guests away from the dashboard route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRouter />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Login page' })
    ).toBeInTheDocument();
  });
});
