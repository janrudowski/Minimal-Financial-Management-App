import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../Spinner/Spinner';
import TopBar from '../TopBar/TopBar';
import './settings.css';

export default function Settings() {
  const {
    currentUser: { displayName, email, phoneNumber },
    currentUser,
    updatePassword,
    updateUser,
    updateEmail,
  } = useAuth();

  const [formData, setFormData] = useState({
    name: displayName || '',
    email: email || '',
    phone: phoneNumber || '',
    password: '',
    passwordConfirm: '',
  });

  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const { name, email, phone, password, passwordConfirm } = formData;
    let promises = [];
    console.log(formData);
    if (
      password === passwordConfirm &&
      password !== '' &&
      passwordConfirm !== ''
    ) {
      promises.push(updatePassword(currentUser, password));
    }

    if (email !== '' && email !== currentUser.email) {
      promises.push(updateEmail(currentUser, email));
    }

    promises.push(
      updateUser(currentUser, {
        ...(name !== '' &&
          name !== currentUser.displayName && { displayName: name }),
        ...(phone !== '' &&
          phone !== currentUser.phoneNumber && { phoneNumber: phone }),
      })
    );

    try {
      setLoading(true);
      setDisabled(true);
      await Promise.all(promises);
    } catch (err) {
      console.log(err.code);
      //TODO: add requires recent login handler and add proper error handling overall
    }

    setLoading(false);
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
          <form onSubmit={handleSubmit}>
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
                  value={formData.phone}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete='on'
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
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  autoComplete='on'
                />
                <h6>Passwords do not match</h6>
              </div>
            </div>
            <button
              disabled={disabled}
              className={`update-btn ${disabled ? 'update-btn-disabled' : ''}`}
            >
              {loading ? <Spinner width='1em' height='1em' /> : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
