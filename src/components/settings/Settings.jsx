import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../Modals/AuthModal';
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
    updatePhoneNumber,
  } = useAuth();

  const [formData, setFormData] = useState({
    name: displayName || '',
    email: email || '',
    phone: phoneNumber || '',
    password: '',
    passwordConfirm: '',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
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

    if (password !== passwordConfirm) {
      setError((prev) => {
        return {
          ...prev,
          password: 'Passwords do not match.',
        };
      });
      return;
    }

    if (password !== '' && passwordConfirm !== '') {
      promises.push(updatePassword(currentUser, password));
    }

    if (email !== '' && email !== currentUser.email) {
      promises.push(updateEmail(currentUser, email));
    }

    if (name !== currentUser.displayName && name !== '') {
      promises.push(
        updateUser(currentUser, {
          displayName: name,
        })
      );
    }

    // if (phoneNumber !== '' && phoneNumber !== phone) {
    //   promises.push(updatePhoneNumber(currentUser, phone));
    // }

    setError((prev) => {
      return {
        ...prev,
        password: '',
      };
    });

    try {
      setLoading(true);
      setDisabled(true);
      await Promise.all(promises);
    } catch (err) {
      setDisabled(false);
      console.error(err.code);
      if (err.code === 'auth/requires-recent-login') {
        setIsModalVisible(true);
      }

      if (err.code === 'auth/weak-password') {
        setError((prev) => {
          return {
            ...prev,
            password: 'Password must be at lest 8 characters.',
          };
        });
      }
      // ///TODO: add requires recent login handler and add proper error handling overall (done ✔)
      //TODO: FIX PHONE cant update with updateuser use updatePhoneNumbercredentails (hard to do needs captcha and sending sms verification)
    }

    // console.log(currentUser);
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
                <h5 className='settings-form-error-message'>
                  {error.password}
                </h5>
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
      <AuthModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </main>
  );
}
