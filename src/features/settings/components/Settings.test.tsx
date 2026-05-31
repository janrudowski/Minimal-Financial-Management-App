import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Settings from './Settings';

const authMocks = vi.hoisted(() => ({
  currentUser: {
    displayName: 'Irumi Desu',
    email: 'irumi@example.com',
    phoneNumber: '+15555550123',
  },
  reauth: vi.fn(),
  updateEmail: vi.fn(),
  updatePassword: vi.fn(),
  updatePhoneNumber: vi.fn(),
  updateUser: vi.fn(),
}));

vi.mock('../../auth/context/AuthContext', () => ({
  useAuth: () => authMocks,
}));

vi.mock('../../../shared/components/TopBar/TopBar', () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe('Settings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMocks.updateEmail.mockResolvedValue(undefined);
    authMocks.updatePassword.mockResolvedValue(undefined);
    authMocks.updatePhoneNumber.mockResolvedValue(undefined);
    authMocks.updateUser.mockResolvedValue(undefined);
    authMocks.reauth.mockResolvedValue({ user: authMocks.currentUser });
  });

  it('updates changed profile, email, and password fields', async () => {
    const user = userEvent.setup();

    render(<Settings />);

    expect(screen.getByLabelText('Name')).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.clear(screen.getByLabelText('Name'));
    await user.type(screen.getByLabelText('Name'), 'Maki Desu');
    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'maki@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(authMocks.updateUser).toHaveBeenCalledWith(authMocks.currentUser, {
        displayName: 'Maki Desu',
      });
    });
    expect(authMocks.updateEmail).toHaveBeenCalledWith(
      authMocks.currentUser,
      'maki@example.com'
    );
    expect(authMocks.updatePassword).toHaveBeenCalledWith(
      authMocks.currentUser,
      'password123'
    );
  });

  it('shows a validation error when password confirmation does not match', async () => {
    const user = userEvent.setup();

    render(<Settings />);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'different123');
    await user.click(screen.getByRole('button', { name: 'Update' }));

    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveAccessibleDescription(
      'Passwords do not match.'
    );
    expect(screen.getByLabelText('Confirm Password')).toHaveAccessibleDescription(
      'Passwords do not match.'
    );
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(screen.getByLabelText('Confirm Password')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    expect(authMocks.updatePassword).not.toHaveBeenCalled();
    expect(authMocks.updateEmail).not.toHaveBeenCalled();
    expect(authMocks.updateUser).not.toHaveBeenCalled();
  });

  it('keeps labelled form controls disabled until editing starts', async () => {
    const user = userEvent.setup();

    render(<Settings />);

    const fields = [
      screen.getByLabelText('Name'),
      screen.getByLabelText('Email'),
      screen.getByLabelText('Mobile Number'),
      screen.getByLabelText('Password'),
      screen.getByLabelText('Confirm Password'),
    ];

    fields.forEach((field) => expect(field).toBeDisabled());
    expect(screen.getByRole('button', { name: 'Update' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: /edit/i }));

    fields.forEach((field) => expect(field).toBeEnabled());
    expect(screen.getByRole('button', { name: 'Update' })).toBeEnabled();
  });

  it('exposes the update loading state while saving changes', async () => {
    const user = userEvent.setup();
    let resolveUpdate: () => void = () => {};
    authMocks.updateUser.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveUpdate = resolve;
      })
    );

    render(<Settings />);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.clear(screen.getByLabelText('Name'));
    await user.type(screen.getByLabelText('Name'), 'Maki Desu');
    await user.click(screen.getByRole('button', { name: 'Update' }));

    const updateButton = screen.getByRole('button', {
      name: 'Updating settings',
    });

    expect(updateButton).toBeDisabled();
    expect(updateButton).toHaveAttribute('aria-busy', 'true');

    resolveUpdate();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Update' })
      ).not.toHaveAttribute('aria-busy');
    });
  });

  it('opens the reauthentication modal when Firebase requires a recent login', async () => {
    const user = userEvent.setup();
    authMocks.updateEmail.mockRejectedValueOnce({
      code: 'auth/requires-recent-login',
    });

    render(<Settings />);

    await user.click(screen.getByRole('button', { name: /edit/i }));
    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'maki@example.com');
    await user.click(screen.getByRole('button', { name: 'Update' }));

    expect(
      await screen.findByText(
        'You need to authenticate before changing your email/password.'
      )
    ).toBeInTheDocument();
  });
});
