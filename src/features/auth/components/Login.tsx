import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../../shared/utils/cn';
import { useAuth } from '../context/AuthContext';
import { getLoginErrorMessage } from '../utils/authErrors';
import AuthFormError from './AuthFormError';

type LoginFormData = {
  email: string;
  password: string;
  isRemember: boolean;
};

type AuthAction = 'email' | 'google' | null;

const loginErrorId = 'login-error';
const inputClassName =
  'h-[38px] rounded-[10px] border border-[#282541] bg-transparent px-2.5 py-2.5 text-app-text outline-none transition focus:border-app-accent focus:ring-2 focus:ring-app-accent/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent dark:border-app-dark-border dark:text-slate-50';
const labelClassName = 'text-sm font-bold';
const secondaryButtonClassName =
  'flex h-12 items-center justify-center gap-2.5 rounded-[10px] border border-app-border bg-transparent font-semibold text-app-subtle transition hover:border-app-text hover:text-app-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent dark:border-app-dark-border dark:text-slate-300 dark:hover:border-slate-200 dark:hover:text-slate-50';

export default function Login() {
  const { login, signInWithGoogle } = useAuth();
  const navigation = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    isRemember: false,
  });
  const [errMsg, setErrMsg] = useState('');
  const [authAction, setAuthAction] = useState<AuthAction>(null);
  const isSubmitting = authAction !== null;
  const isEmailSubmitting = authAction === 'email';
  const isGoogleSubmitting = authAction === 'google';

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData((oldData) => {
      return {
        ...oldData,
        [name]: type === 'checkbox' ? checked : value,
      };
    });

    if (errMsg) {
      setErrMsg('');
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { email, password } = formData;

    setErrMsg('');
    setAuthAction('email');

    try {
      await login(email, password);
      navigation('/');
    } catch (error) {
      setErrMsg(getLoginErrorMessage(error));
      setFormData((currentFormData) => ({
        ...currentFormData,
        password: '',
      }));
    } finally {
      setAuthAction(null);
    }
  }

  async function handleGoogleSignIn() {
    setErrMsg('');
    setAuthAction('google');

    try {
      await signInWithGoogle();
      navigation('/');
    } catch (error) {
      setErrMsg(getLoginErrorMessage(error));
    } finally {
      setAuthAction(null);
    }
  }

  return (
    <div className='flex min-h-screen w-full bg-app-bg text-app-text dark:bg-app-dark-bg dark:text-slate-50'>
      <div className='flex w-full justify-center px-6 py-12 lg:py-[50px]'>
        <div className='w-full max-w-[400px]'>
          <svg className='h-12 w-auto'>
            <use href='/images/Logo.svg#Layer_1'></use>
          </svg>
          <h1 className='my-2.5 text-3xl font-bold'>Welcome back</h1>
          <p className='my-2.5 text-sm text-app-subtle dark:text-slate-300'>
            Welcome back! Please enter your details
          </p>
          <form className='mt-10 flex flex-col gap-2.5' onSubmit={handleSubmit}>
            <label className={labelClassName} htmlFor='email'>
              Email
            </label>
            <input
              className={inputClassName}
              type='email'
              name='email'
              id='email'
              placeholder='example@email.com'
              onChange={handleChange}
              value={formData.email}
              required={true}
              autoComplete='email'
              aria-invalid={errMsg.length > 0}
              aria-describedby={errMsg.length > 0 ? loginErrorId : undefined}
            />
            <label className={labelClassName} htmlFor='password'>
              Password
            </label>
            <input
              className={inputClassName}
              autoComplete='current-password'
              type='password'
              name='password'
              id='password'
              placeholder='Input password'
              onChange={handleChange}
              value={formData.password}
              required={true}
              minLength={8}
              aria-invalid={errMsg.length > 0}
              aria-describedby={errMsg.length > 0 ? loginErrorId : undefined}
            />
            <div className='flex items-center gap-2 text-sm font-light'>
              <input
                className='h-4 w-4 accent-app-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent'
                type='checkbox'
                name='isRemember'
                id='isRemember'
                onChange={handleChange}
                checked={formData.isRemember}
              />
              <label htmlFor='isRemember'>Remember for 30 days</label>
            </div>
            <AuthFormError id={loginErrorId} message={errMsg} />
            <button
              className={cn(
                'h-12 rounded-[10px] border-0 bg-app-accent font-semibold text-app-text transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent',
                isSubmitting && 'cursor-not-allowed opacity-70'
              )}
              disabled={isSubmitting}
              type='submit'
            >
              {isEmailSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
            <button
              aria-busy={isGoogleSubmitting}
              aria-label={
                isGoogleSubmitting
                  ? 'Signing in with Google'
                  : 'Sign in with google'
              }
              className={cn(
                secondaryButtonClassName,
                isSubmitting && 'cursor-not-allowed opacity-70'
              )}
              disabled={isSubmitting}
              onClick={handleGoogleSignIn}
              type='button'
            >
              <img
                className='h-6 w-6'
                src='/icons/Google.png'
                alt=''
              />
              {isGoogleSubmitting
                ? 'Signing in with Google...'
                : 'Sign in with google'}
            </button>
            <p className='text-center text-sm text-app-subtle dark:text-slate-300'>
              Don't have an account?{' '}
              <Link
                className='font-bold text-app-text no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent dark:text-slate-50'
                to='/signup'
              >
                Sign up for free
              </Link>
            </p>
          </form>
        </div>
      </div>
      <img
        className='hidden min-h-screen w-[45%] object-cover lg:block'
        src='/images/Image.png'
        alt='hand holding clock'
      />
    </div>
  );
}
