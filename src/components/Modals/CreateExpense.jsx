import React, { useState } from 'react';
import { useAPI } from '../../contexts/APIContext';
import Spinner from '../Spinner/Spinner';
import './modals.css';

export default function CreateExpense({ isVisible, toggle }) {
  const { addExpense } = useAPI();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    business: '',
    amount: '',
    type: '',
    date: '',
    recurring: false,
  });

  const [error, setError] = useState({
    title: '',
    business: '',
    amount: null,
    date: null,
    type: '',
  });

  const [success, setSuccess] = useState('Add');

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let isCorrect = true;
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'business') return;
      let message;
      if (value === '') message = `${key} cannot be empty.`; //TODO: FIX DATE GOES THROUGH EVEN THO ITS EMPTY
      if (key === 'amount' && isNaN(value))
        message = `${key} must be a number.`;
      setError((prev) => {
        return {
          ...prev,
          [key]: message,
        };
      });
      if (message) isCorrect = false;
    });

    if (!isCorrect) return;
    const { title, business, amount, type, date } = formData;
    try {
      setLoading(true);
      await addExpense(title, business, type, Number(amount), date);
    } catch (err) {
      console.log(err); //handle errors here
    }
    setLoading(false);
    setSuccess('✔');
    setTimeout(() => {
      toggle(false);
    }, 1000);
  }

  return (
    <div className={`modal ${!isVisible ? 'modal-hidden' : ''}`}>
      <div className='modal-window'>
        <div className='modal-close' onClick={() => toggle(false)}>
          X
        </div>
        <form onSubmit={handleSubmit} className='modal-form'>
          <input
            className={`${error.title ? 'modal-form-invalid-input' : ''}`}
            onChange={handleChange}
            type='text'
            placeholder='Title'
            name='title'
            value={formData.title}
          />
          <h6 className='modal-form-error-message'>{error.title}</h6>
          <input
            className={`${error.business ? 'modal-form-invalid-input' : ''}`}
            onChange={handleChange}
            type='text'
            placeholder='Business (optional)'
            name='business'
            value={formData.business}
          />
          <h6 className='modal-form-error-message'>{error.business}</h6>
          <input
            className={`${error.amount ? 'modal-form-invalid-input' : ''}`}
            onChange={handleChange}
            type='text'
            placeholder='Amount'
            name='amount'
            value={formData.amount}
          />
          <h6 className='modal-form-error-message'>{error.amount}</h6>
          <input
            className={`${error.type ? 'modal-form-invalid-input' : ''}`}
            onChange={handleChange}
            type='text'
            placeholder='Type'
            name='type'
            value={formData.type}
          />
          <h6 className='modal-form-error-message'>{error.type}</h6>
          <div className='modal-form-row'>
            <input
              onChange={handleChange}
              className={`modal-form-input-date ${
                error.date ? 'modal-form-invalid-input' : ''
              }`}
              type='date'
              name='date'
              value={formData.date}
            />
            <input
              onChange={handleChange}
              checked={formData.recurring}
              type='checkbox'
              name='recurring'
              id='recurringcheckbox'
            />
            <label htmlFor='recurringcheckbox'>Recurring</label>
          </div>
          <button className='modal-form-image-upload-button'>
            <svg className='modal-form-image-upload-icon'>
              <use href='/icons/camera-icon.svg#Capa_1'></use>
            </svg>
          </button>
          <button disabled={loading} className='modal-form-submit'>
            {loading ? <Spinner width='1rem' height='1rem' /> : success}
          </button>
        </form>
      </div>
    </div>
  );
}
