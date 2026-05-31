export function getFirebaseErrorCode(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String(error.code);
  }

  return '';
}

export function getLoginErrorMessage(error: unknown) {
  const code = getFirebaseErrorCode(error);

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';

    case 'auth/too-many-requests':
      return 'Too many sign in attempts. Please try again later.';

    default:
      return 'Could not sign in. Please try again.';
  }
}

export function getSignupErrorMessage(error: unknown) {
  const code = getFirebaseErrorCode(error);

  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email is already in use.';

    case 'auth/weak-password':
      return 'Password must be at least 8 characters.';

    case 'auth/invalid-email':
      return 'Enter a valid email address.';

    default:
      return 'Could not create your account. Please try again.';
  }
}
