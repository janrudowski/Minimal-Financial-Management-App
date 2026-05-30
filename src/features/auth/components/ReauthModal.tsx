import { useState, type ChangeEvent, type FormEvent } from 'react';
import Spinner from '../../../shared/components/Spinner/Spinner';
import '../../../shared/styles/modals.css';
import { useAuth } from '../context/AuthContext';
import { getFirebaseErrorCode } from '../utils/authErrors';

type ReauthModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function ReauthModal({ isVisible, onClose }: ReauthModalProps) {
  const { currentUser, reauth } = useAuth();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isVisible || !currentUser) {
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
    <div className='modal'>
      <div className='modal-window modal-window-auth'>
        <button
          type='button'
          className='modal-close'
          aria-label='Close authentication modal'
          onClick={onClose}
        >
          X
        </button>
        <form onSubmit={handleSubmit} className='modal-form'>
          <h2 className='modal-window-title'>
            You need to authenticate before changing your email/password.
          </h2>

          <label htmlFor='reauth-password'>Password</label>
          <input
            id='reauth-password'
            name='password'
            type='password'
            value={password}
            onChange={handlePasswordChange}
            autoComplete='current-password'
            className={errorMessage ? 'modal-form-invalid-input' : ''}
          />

          <button
            type='submit'
            disabled={loading}
            className='modal-form-submit modal-form-submit-auth'
          >
            {loading ? <Spinner width='1rem' height='1rem' /> : 'Authenticate'}
          </button>

          {errorMessage.length > 0 && (
            <h5 className='modal-form-error-message-auth'>{errorMessage}</h5>
          )}
        </form>
      </div>
    </div>
  );
}
