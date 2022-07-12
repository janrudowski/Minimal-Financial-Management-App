import { hasFormSubmit } from '@testing-library/user-event/dist/utils';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './signup.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((oldData) => {
      return {
        ...oldData,
        [name]: value,
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);
  }

  return (
    <div className='signup-container'>
      <div className='signup-content'>
        <div className='signup-form'>
          <img
            src={`${process.env.PUBLIC_URL}/images/logo.png`}
            alt='maglo logo'
            className='logo'
          />
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
            />
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='irumi@desu.com'
              onChange={handleChange}
              value={formData.email}
            />
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              id='password'
              placeholder='Create your password'
              onChange={handleChange}
              value={formData.password}
            />

            <button className='signup-btn'>Create Account</button>
            <button className='signup-google-btn' type='button'>
              <img
                className='google-logo'
                src={`${process.env.PUBLIC_URL}/icons/Google.png`}
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
        src={`${process.env.PUBLIC_URL}/images/Image.png`}
        alt='hand holding clock'
      />
    </div>
  );
}
