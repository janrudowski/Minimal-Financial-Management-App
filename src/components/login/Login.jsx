import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const { login } = useAuth();
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    isRemember: false,
  });
  const [errMsg, setErrMsg] = useState('');

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((oldData) => {
      return {
        ...oldData,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { email, password } = formData;
    try {
      await login(email, password);
      navigation('/');
    } catch (error) {
      setErrMsg(() => {
        switch (error.code) {
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
          <img
            src={`${process.env.PUBLIC_URL}/images/logo.png`}
            alt='maglo logo'
            className='logo'
          />
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
              <label htmlFor='remember'>Remember for 30 days</label>
            </div>
            {errMsg.length > 0 && <p className='invalid'>{errMsg}</p>}
            <button className='signin-btn'>Sign in</button>
            <button className='signin-google-btn' type='button'>
              <img
                className='google-logo'
                src={`${process.env.PUBLIC_URL}/icons/Google.png`}
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
        src={`${process.env.PUBLIC_URL}/images/Image.png`}
        alt='hand holding clock'
      />
    </div>
  );
}
