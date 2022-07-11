import React from 'react';

export default function Signup() {
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
          <form>
            <label htmlFor='name'>Full Name</label>
            <input type='text' name='name' id='name' placeholder='Irumi Desu' />
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='irumi@desu.com'
            />
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              name='password'
              id='password'
              placeholder='Create your password'
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
