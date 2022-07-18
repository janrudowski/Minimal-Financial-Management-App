import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import TopBar from '../TopBar/TopBar';
import './settings.css';

export default function Settings() {
  const {
    currentUser: { displayName, email, phoneNumber },
  } = useAuth();

  const [formData, setFormData] = useState({
    name: displayName,
    email: email,
    phone: phoneNumber,
    password: '',
  });

  const [disabled, setDisabled] = useState(true);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  return (
    <main>
      <div className='settings-container'>
        <TopBar title={'Settings'} />
        <div className='account-information-container'>
          <h3>Account Information</h3>
          <p>Update your account information</p>
          <div className='personal-information-container'>
            <h3>Personal Information</h3>
            <button className='edit-btn' onClick={() => setDisabled(false)}>
              <img
                src={`${process.env.PUBLIC_URL}/icons/edit-icon.png`}
                alt='edit icon'
              />
              Edit
            </button>
          </div>
          <form>
            <div className='form-row form-row-span-two'>
              <div className='input-container'>
                <label htmlFor='name'>Name</label>
                <input
                  disabled={disabled}
                  className={`${
                    disabled ? 'settings-form-disabled-input' : ''
                  }`}
                  type='text'
                  name='name'
                  id='name'
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='form-row'>
              <div className='input-container'>
                <label htmlFor='email'>Email</label>
                <input
                  disabled={disabled}
                  className={`${
                    disabled ? 'settings-form-disabled-input' : ''
                  }`}
                  type='email'
                  name='email'
                  id='email'
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className='input-container'>
                <label htmlFor='phone'>Mobile Number</label>
                <input
                  disabled={disabled}
                  className={`${
                    disabled ? 'settings-form-disabled-input' : ''
                  }`}
                  type='tel'
                  name='phone'
                  id='phone'
                />
              </div>
            </div>
            <div className='form-row'>
              <div className='inputEmail-container'></div>
            </div>
            <div className='form-row'>
              <div className='input-container'>
                <label htmlFor='password'>Password</label>
                <input
                  disabled={disabled}
                  className={`${
                    disabled ? 'settings-form-disabled-input' : ''
                  }`}
                  type='password'
                  name='password'
                  id='password'
                  placeholder='********'
                />
              </div>
              <div className='input-container'>
                <label htmlFor='passwordConfirm'>Confirm Password</label>
                <input
                  disabled={disabled}
                  className={`${
                    disabled ? 'settings-form-disabled-input' : ''
                  }`}
                  type='password'
                  name='passwordConfirm'
                  id='passwordConfirm'
                  placeholder='********'
                />
              </div>
            </div>
            <button
              disabled={disabled}
              className={`update-btn ${disabled ? 'update-btn-disabled' : ''}`}
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
