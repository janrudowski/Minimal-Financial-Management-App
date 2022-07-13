import React, { useState } from 'react';
import './modals.css';

export default function CreateExpense({ isVisible, toggle }) {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: '',
    date: '',
    recurring: false,
  });

  const [error, setError] = useState({
    title: '',
    amount: null,
    date: null,
    type: '',
  });

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    let isCorrect = true;
    Object.entries(formData).forEach(([key, value]) => {
      let message;
      if (value === '') message = `${key} cannot be empty.`;
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
    //todo: handle sending expense to db here
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
                error.type ? 'modal-form-invalid-input' : ''
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
          <button className='modal-form-submit'>Add</button>
        </form>
      </div>
    </div>
  );
}
