import React, { useState } from 'react';
import './modals.css';
import Spinner from '../Spinner/Spinner';
import { useAuth } from '../../contexts/AuthContext';
export default function FilterExpenses({ isModalVisible, setIsModalVisible }) {
  const { currentUser, reauth } = useAuth();
  const toggle = () => {};

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: currentUser.email,
    password: '',
  });

  const [error, setError] = useState('');

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
    try {
      setLoading(true);
      await reauth(formData.email, formData.password);
      setIsModalVisible(false);
    } catch (err) {
      if (err.code === 'auth/wrong-password') {
        setError('Password is incorrect.');
      }
    }
    setLoading(false);
  }

  return (
    <div className={`modal ${!isModalVisible ? 'modal-hidden' : ''}`}>
      <div className='modal-window modal-window-auth'>
        <div className='modal-close' onClick={() => toggle(false)}>
          X
        </div>
        <form onSubmit={handleSubmit} className='modal-form'>
          <h2 className='modal-window-title'>
            You need to authenticate before changing your email/password.
          </h2>
          <input
            className={`${error.email ? 'modal-form-invalid-input' : ''}`}
            onChange={handleChange}
            type='text'
            placeholder='Email'
            name='email'
            value={formData.email}
            disabled={true}
          />
          <h6 className='modal-form-error-message'>{error.title}</h6>
          <input
            className={`${error.password ? 'modal-form-invalid-input' : ''}`}
            onChange={handleChange}
            type='password'
            placeholder='Password'
            name='password'
            value={formData.password}
            autoComplete='on'
          />
          <h6 className='modal-form-error-message'>{error.password}</h6>
          <button
            disabled={loading}
            className='modal-form-submit modal-form-submit-auth'
          >
            {loading ? <Spinner width='1rem' height='1rem' /> : 'Authenticate'}
          </button>
          <h5 className='modal-form-error-message-auth'>{error}</h5>
        </form>
      </div>
    </div>
  );
}
