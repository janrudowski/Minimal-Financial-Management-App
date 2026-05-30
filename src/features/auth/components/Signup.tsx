import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import { useAuth } from '../context/AuthContext';
import { getSignupErrorMessage } from '../utils/authErrors';
import AuthFormError from './AuthFormError';

type SignupFormData = {
  fullName: string;
  email: string;
  password: string;
};

const signupErrorId = 'signup-error';

export default function Signup() {
  const { signup, updateUser } = useAuth();
  const navigation = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
  });
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((oldData) => {
      return {
        ...oldData,
        [name]: value,
      };
    });

    if (errMsg) {
      setErrMsg('');
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { email, password, fullName } = formData;

    setErrMsg('');
    setIsSubmitting(true);

    try {
      const { user } = await signup(email, password);
      await updateUser(user, { displayName: fullName });
      navigation('/');
    } catch (error) {
      setErrMsg(getSignupErrorMessage(error));
      setFormData((currentFormData) => ({
        ...currentFormData,
        password: '',
      }));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='signup-container'>
      <div className='signup-content'>
        <div className='signup-form'>
          <svg className='logo'>
            <use href='/images/Logo.svg#Layer_1'></use>
          </svg>
          <h1>Create new account</h1>
          <p>Welcome back! Please enter your details</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor='fullName'>Full Name</label>
            <input
              type='text'
              name='fullName'
              id='fullName'
              placeholder='Irumi Desu'
              onChange={handleChange}
              value={formData.fullName}
              required={true}
              autoComplete='name'
            />
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='irumi@desu.com'
              onChange={handleChange}
              value={formData.email}
              required={true}
              autoComplete='email'
              aria-invalid={errMsg.length > 0}
              aria-describedby={errMsg.length > 0 ? signupErrorId : undefined}
            />
            <label htmlFor='password'>Password</label>
            <input
              autoComplete='new-password'
              type='password'
              name='password'
              id='password'
              placeholder='Create your password'
              onChange={handleChange}
              value={formData.password}
              required={true}
              minLength={8}
              aria-invalid={errMsg.length > 0}
              aria-describedby={errMsg.length > 0 ? signupErrorId : undefined}
            />
            <AuthFormError id={signupErrorId} message={errMsg} />

            <button
              className='signup-btn'
              disabled={isSubmitting}
              type='submit'
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
            <button className='signup-google-btn' type='button'>
              <img
                className='google-logo'
                src='/icons/Google.png'
                alt=''
              />
              Sign up with google
            </button>
            <p className='have-account'>
              Already have an account? <Link to='/login'>Sign in</Link>
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
