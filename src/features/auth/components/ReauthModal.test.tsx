import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ReauthModal from './ReauthModal';

const authMocks = vi.hoisted(() => ({
  currentUser: {
    email: 'irumi@example.com',
  },
  reauth: vi.fn(),
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => authMocks,
}));

describe('ReauthModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authMocks.reauth.mockResolvedValue({ user: authMocks.currentUser });
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ReauthModal isVisible={true} onClose={onClose} />);

    await user.click(
      screen.getByRole('button', { name: 'Close authentication modal' })
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('reauthenticates with the current email and submitted password', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ReauthModal isVisible={true} onClose={onClose} />);

    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Authenticate' }));

    await waitFor(() => {
      expect(authMocks.reauth).toHaveBeenCalledWith(
        'irumi@example.com',
        'password123'
      );
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows an error and keeps the modal open when the password is wrong', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    authMocks.reauth.mockRejectedValueOnce({ code: 'auth/wrong-password' });

    render(<ReauthModal isVisible={true} onClose={onClose} />);

    await user.type(screen.getByLabelText('Password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Authenticate' }));

    expect(await screen.findByText('Password is incorrect.')).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });
});
