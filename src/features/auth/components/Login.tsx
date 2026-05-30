import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from '../context/AuthContext';

type LoginFormData = {
  email: string;
  password: string;
  isRemember: boolean;
};

function getFirebaseErrorCode(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return String(error.code);
  }

  return '';
}

export default function Login() {
  const { login } = useAuth();
  const navigation = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    isRemember: false,
  });
  const [errMsg, setErrMsg] = useState('');

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData((oldData) => {
      return {
        ...oldData,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { email, password } = formData;
    try {
      await login(email, password);
      navigation('/');
    } catch (error) {
      const errorCode = getFirebaseErrorCode(error);

      setErrMsg(() => {
        switch (errorCode) {
          case 'auth/user-not-found':
            return 'User not found. Please check your email and password';

          default:
            return errMsg;
        }
      });
      setFormData({
        email: '',
        password: '',
        isRemember: false,
      });
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
            />
            <label htmlFor='password'>Password</label>
            <input
              autoComplete='on'
              type='password'
              name='password'
              id='password'
              placeholder='Input password'
              onChange={handleChange}
              value={formData.password}
              required={true}
              minLength={8}
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
            {errMsg.length > 0 && <p className='invalid'>{errMsg}</p>}
            <button className='signin-btn'>Sign in</button>
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
