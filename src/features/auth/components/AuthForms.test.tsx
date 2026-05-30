import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Login from './Login';
import Signup from './Signup';

const { loginMock, navigateMock, signupMock, updateUserMock } = vi.hoisted(
  () => ({
    loginMock: vi.fn(),
    navigateMock: vi.fn(),
    signupMock: vi.fn(),
    updateUserMock: vi.fn(),
  })
);

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: loginMock,
    signup: signupMock,
    updateUser: updateUserMock,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('auth forms', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loginMock.mockResolvedValue({ user: { uid: 'user-1' } });
    signupMock.mockResolvedValue({ user: { uid: 'user-1' } });
    updateUserMock.mockResolvedValue(undefined);
  });

  it('signs in with the entered credentials', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Email'), 'irumi@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith(
        'irumi@example.com',
        'password123'
      );
    });
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('creates the user profile with the submitted full name', async () => {
    const user = userEvent.setup();
    const firebaseUser = { uid: 'user-1' };
    signupMock.mockResolvedValue({ user: firebaseUser });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('Full Name'), 'Irumi Desu');
    await user.type(screen.getByLabelText('Email'), 'irumi@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(
      screen.getByRole('button', { name: /^create account$/i })
    );

    await waitFor(() => {
      expect(signupMock).toHaveBeenCalledWith(
        'irumi@example.com',
        'password123'
      );
    });
    expect(updateUserMock).toHaveBeenCalledWith(firebaseUser, {
      displayName: 'Irumi Desu',
    });
    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});
