import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import Spinner from '../../../shared/components/Spinner/Spinner';
import { cn } from '../../../shared/utils/cn';
import {
  focusFirstDialogControl,
  keepFocusInDialog,
} from '../../../shared/utils/dialogFocus';
import { useAuth } from '../context/AuthContext';
import { getFirebaseErrorCode } from '../utils/authErrors';

type ReauthModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const reauthTitleId = 'reauth-modal-title';
const inputClassName =
  'my-4 rounded-[10px] border border-app-border bg-transparent px-4 py-3 text-app-text outline-none transition focus-visible:border-app-text focus-visible:ring-4 focus-visible:ring-app-accent/30 dark:border-app-dark-border dark:text-slate-50';

export default function ReauthModal({ isVisible, onClose }: ReauthModalProps) {
  const { currentUser, reauth } = useAuth();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const isOpen = isVisible && Boolean(currentUser);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previouslyFocusedElement = document.activeElement;
    focusFirstDialogControl(dialogRef.current);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }

      keepFocusInDialog(event, dialogRef);
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen || !currentUser) {
    return null;
  }

  const currentEmail = currentUser.email ?? '';

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
    setErrorMessage('');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await reauth(currentEmail, password);
      onClose();
    } catch (error) {
      const errorCode = getFirebaseErrorCode(error);

      if (
        errorCode === 'auth/wrong-password' ||
        errorCode === 'auth/invalid-credential'
      ) {
        setErrorMessage('Password is incorrect.');
      } else {
        setErrorMessage('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm'>
      <div
        aria-labelledby={reauthTitleId}
        aria-modal='true'
        className='relative max-h-[450px] w-full max-w-[600px] rounded-[10px] bg-app-surface text-app-text shadow-2xl dark:bg-app-dark-surface dark:text-slate-50'
        ref={dialogRef}
        role='dialog'
      >
        <button
          type='button'
          className='m-2 flex h-8 w-8 items-center justify-center rounded-[10px] bg-app-muted text-app-text transition hover:bg-app-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent dark:bg-app-dark-muted dark:text-slate-50 dark:hover:bg-app-dark-border'
          aria-label='Close authentication modal'
          onClick={onClose}
        >
          X
        </button>
        <form
          onSubmit={handleSubmit}
          className='relative z-10 mx-auto flex h-full w-[90%] flex-col px-0 pb-16 pt-8'
        >
          <h2
            className='mb-8 text-center text-xl font-semibold text-app-text dark:text-slate-50'
            id={reauthTitleId}
          >
            You need to authenticate before changing your email/password.
          </h2>

          <label className='text-sm font-semibold' htmlFor='reauth-password'>
            Password
          </label>
          <input
            id='reauth-password'
            name='password'
            type='password'
            value={password}
            onChange={handlePasswordChange}
            autoComplete='current-password'
            className={cn(
              inputClassName,
              errorMessage && 'border-app-danger focus-visible:ring-app-danger/20'
            )}
          />

          <button
            type='submit'
            disabled={loading}
            aria-label={loading ? 'Authenticating' : undefined}
            className={cn(
              'mt-4 rounded-[10px] border-0 bg-app-accent px-4 py-3 font-semibold text-app-text transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent',
              loading && 'cursor-not-allowed opacity-70'
            )}
          >
            {loading ? <Spinner width='1rem' height='1rem' /> : 'Authenticate'}
          </button>

          {errorMessage.length > 0 && (
            <p
              className='mt-4 text-center text-sm font-medium text-app-danger'
              role='alert'
            >
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
