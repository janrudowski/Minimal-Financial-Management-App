import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../context/AuthContext';
import { getLoginErrorMessage } from '../utils/authErrors';
import AuthFormError from './AuthFormError';

type LoginFormData = {
  email: string;
  password: string;
  isRemember: boolean;
};

const loginErrorId = 'login-error';

export default function Login() {
  const { login } = useAuth();
  const navigation = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    isRemember: false,
  });
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

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
      setIsSubmitting(false);
    }
  }

  return (
    <div className='signin-container'>
      <div className='signin-content'>
        <div className='signin-form'>
          <svg className='logo'>
            <use href='/images/Logo.svg#Layer_1'></use>
          </svg>
          <h1>Welcome back</h1>
          <p>Welcome back! Please enter your details</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor='email'>Email</label>
            <input
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
            <label htmlFor='password'>Password</label>
            <input
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
            <div className='remember-me-container'>
              <input
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
              className='signin-btn'
              disabled={isSubmitting}
              type='submit'
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
            <button className='signin-google-btn' type='button'>
              <img
                className='google-logo'
                src='/icons/Google.png'
                alt=''
              />
              Sign in with google
            </button>
            <p className='have-account'>
              Don't have an account? <Link to='/signup'>Sign up for free</Link>
            </p>
          </form>
        </div>
      </div>
      <img
        className='hand-image'
        src='/images/Image.png'
        alt='hand holding clock'
      />
    </div>
  );
}
