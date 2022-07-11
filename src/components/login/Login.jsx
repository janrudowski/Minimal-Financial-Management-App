import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
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
          <form>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='example@email.com'
            />
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              id='password'
              placeholder='Input password'
            />
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
              Don't have an account? <Link to='/signup'>Sign up</Link>
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
