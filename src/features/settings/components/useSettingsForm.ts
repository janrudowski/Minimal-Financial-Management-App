import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { getFirebaseErrorCode } from '../../auth/utils/authErrors';

export type SettingsFormValues = {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
};

export type SettingsFormErrors = Record<keyof SettingsFormValues, string>;

type UseSettingsFormParams = {
  currentUser: User;
  onRequiresRecentLogin: () => void;
  updateEmail: (user: User, email: string) => Promise<void>;
  updatePassword: (user: User, password: string) => Promise<void>;
  updateUser: (
    user: User,
    updates: { displayName?: string | null; photoURL?: string | null }
  ) => Promise<void>;
};

const emptyErrors: SettingsFormErrors = {
  name: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirm: '',
};

function getInitialValues(currentUser: User): SettingsFormValues {
  return {
    name: currentUser.displayName ?? '',
    email: currentUser.email ?? '',
    phone: currentUser.phoneNumber ?? '',
    password: '',
    passwordConfirm: '',
  };
}

export function useSettingsForm({
  currentUser,
  onRequiresRecentLogin,
  updateEmail,
  updatePassword,
  updateUser,
}: UseSettingsFormParams) {
  const [values, setValues] = useState(() => getInitialValues(currentUser));
  const [errors, setErrors] = useState<SettingsFormErrors>(emptyErrors);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValues(getInitialValues(currentUser));
    setErrors(emptyErrors);
    setIsEditing(false);
  }, [
    currentUser,
    currentUser.displayName,
    currentUser.email,
    currentUser.phoneNumber,
  ]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const field = name as keyof SettingsFormValues;

    setValues((previousValues) => ({
      ...previousValues,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [field]: '',
      }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isEditing) {
      return;
    }

    const { email, name, password, passwordConfirm } = values;

    if (password !== passwordConfirm) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        password: 'Passwords do not match.',
      }));
      return;
    }

    const updates: Array<Promise<void>> = [];

    if (password !== '') {
      updates.push(updatePassword(currentUser, password));
    }

    if (email !== '' && email !== currentUser.email) {
      updates.push(updateEmail(currentUser, email));
    }

    if (name !== '' && name !== currentUser.displayName) {
      updates.push(updateUser(currentUser, { displayName: name }));
    }

    setErrors(emptyErrors);
    setLoading(true);

    try {
      await Promise.all(updates);
      setIsEditing(false);
      setValues((previousValues) => ({
        ...previousValues,
        password: '',
        passwordConfirm: '',
      }));
    } catch (error) {
      const code = getFirebaseErrorCode(error);

      if (code === 'auth/requires-recent-login') {
        onRequiresRecentLogin();
      }

      if (code === 'auth/weak-password') {
        setErrors((previousErrors) => ({
          ...previousErrors,
          password: 'Password must be at least 8 characters.',
        }));
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    errors,
    handleChange,
    handleSubmit,
    isEditing,
    loading,
    setIsEditing,
    values,
  };
}
