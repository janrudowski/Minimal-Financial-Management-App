import React, { useState } from 'react';
import { useAPI } from '../../contexts/APIContext';
import { useCustomSelect } from '../CustomSelect/CustomSelect';
import CustomSelect from '../CustomSelect/CustomSelect';
import Spinner from '../Spinner/Spinner';
import './modals.css';

export default function CreateExpense({ isVisible, toggle }) {
  const { addExpense, expenseTypes } = useAPI();

  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useCustomSelect(expenseTypes);

  const initialFormData = {
    title: '',
    business: '',
    amount: '',
    date: '',
    recurring: false,
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  const [error, setError] = useState({
    title: '',
    business: '',
    amount: null,
    date: null,
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
    const { title, business, amount, date, recurring } = formData;
    try {
      setLoading(true);
      await addExpense(
        title,
        business,
        selected,
        Number(amount),
        date,
        recurring
      );
    } catch (err) {
      console.log(err); //handle errors here
    }
    setLoading(false);
    setSuccess('✔');
    setTimeout(() => {
      setSuccess('Add');
      setFormData({ ...initialFormData });
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
          {/* <input
            className={`${error.type ? 'modal-form-invalid-input' : ''}`}
            onChange={handleChange}
            type='text'
            placeholder='Type'
            name='type'
            value={formData.type}
          /> */}
          <CustomSelect
            selected={selected}
            setSelected={setSelected}
            items={expenseTypes}
            styles={{
              background: 'var(--background-six)',
              border: 'solid 1px var(--border-one)',
              margin: '1em 0 0 0',
              color: 'var(--text-one)',
              fontSize: '0.8em',
              chevronFill: 'var(--text-one)',
            }}
          />
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
          <button disabled={loading} className='modal-form-submit'>
            {loading ? <Spinner width='1rem' height='1rem' /> : success}
          </button>
        </form>
      </div>
    </div>
  );
}
