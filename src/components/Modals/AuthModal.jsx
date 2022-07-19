import React from 'react';
import './modals.css';
import Spinner from '../Spinner/Spinner';
export default function FilterExpenses() {
  const toggle = () => {};
  const handleSubmit = 12;
  const handleChange = 12;
  const handleError = 12;
  const formData = {};
  const error = 12;
  const loading = 23;
  const success = 12;
  const isVisible = true;
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
