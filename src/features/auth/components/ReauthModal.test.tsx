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

  it('renders as a labelled modal dialog', () => {
    render(<ReauthModal isVisible={true} onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog', {
      name: 'You need to authenticate before changing your email/password.',
    });

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(
      screen.getByRole('heading', {
        name: 'You need to authenticate before changing your email/password.',
      })
    ).toBeInTheDocument();
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

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ReauthModal isVisible={true} onClose={onClose} />);

    await user.keyboard('{Escape}');

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

  it('keeps an accessible submit button name while authentication is loading', async () => {
    const user = userEvent.setup();
    let resolveReauth!: () => void;
    authMocks.reauth.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveReauth = resolve;
      })
    );

    render(<ReauthModal isVisible={true} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Authenticate' }));

    expect(
      screen.getByRole('button', { name: 'Authenticating' })
    ).toBeDisabled();

    resolveReauth();
  });

  it('moves focus into the dialog and keeps Tab focus inside it', async () => {
    const user = userEvent.setup();

    render(<ReauthModal isVisible={true} onClose={vi.fn()} />);

    expect(
      screen.getByRole('button', { name: 'Close authentication modal' })
    ).toHaveFocus();

    await user.tab();
    expect(screen.getByLabelText('Password')).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Authenticate' })).toHaveFocus();

    await user.tab();
    expect(
      screen.getByRole('button', { name: 'Close authentication modal' })
    ).toHaveFocus();
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
