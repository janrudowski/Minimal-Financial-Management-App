import type { ChangeEventHandler, FormEventHandler } from 'react';
import Spinner from '../../../shared/components/Spinner/Spinner';
import type { SettingsFormErrors, SettingsFormValues } from './useSettingsForm';

type SettingsFormProps = {
  errors: SettingsFormErrors;
  isEditing: boolean;
  loading: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onEdit: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  values: SettingsFormValues;
};

export default function SettingsForm({
  errors,
  isEditing,
  loading,
  onChange,
  onEdit,
  onSubmit,
  values,
}: SettingsFormProps) {
  const inputClassName = isEditing ? '' : 'settings-form-disabled-input';
  const isSubmitDisabled = !isEditing || loading;

  return (
    <div className='account-information-container'>
      <h3>Account Information</h3>
      <p>Update your account information</p>
      <div className='personal-information-container'>
        <h3>Personal Information</h3>
        <button
          className='edit-btn'
          onClick={onEdit}
          type='button'
        >
          <img
            src='/icons/edit-icon.png'
            alt='edit icon'
          />
          Edit
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <div className='form-row form-row-span-two'>
          <div className='input-container'>
            <label htmlFor='name'>Name</label>
            <input
              disabled={!isEditing}
              className={inputClassName}
              type='text'
              name='name'
              id='name'
              value={values.name}
              onChange={onChange}
            />
          </div>
        </div>
        <div className='form-row'>
          <div className='input-container'>
            <label htmlFor='email'>Email</label>
            <input
              disabled={!isEditing}
              className={inputClassName}
              type='email'
              name='email'
              id='email'
              value={values.email}
              onChange={onChange}
            />
          </div>
          <div className='input-container'>
            <label htmlFor='phone'>Mobile Number</label>
            <input
              disabled={!isEditing}
              className={inputClassName}
              type='tel'
              name='phone'
              id='phone'
              value={values.phone}
              onChange={onChange}
            />
          </div>
        </div>
        <div className='form-row'>
          <div className='input-container'>
            <label htmlFor='password'>Password</label>
            <input
              disabled={!isEditing}
              className={inputClassName}
              type='password'
              name='password'
              id='password'
              placeholder='********'
              value={values.password}
              onChange={onChange}
              autoComplete='new-password'
            />
          </div>
          <div className='input-container'>
            <label htmlFor='passwordConfirm'>Confirm Password</label>
            <input
              disabled={!isEditing}
              className={inputClassName}
              type='password'
              name='passwordConfirm'
              id='passwordConfirm'
              placeholder='********'
              value={values.passwordConfirm}
              onChange={onChange}
              autoComplete='new-password'
            />
            <h5 className='settings-form-error-message'>{errors.password}</h5>
          </div>
        </div>
        <button
          disabled={isSubmitDisabled}
          className={`update-btn ${
            isSubmitDisabled ? 'update-btn-disabled' : ''
          }`}
        >
          {loading ? (
            <Spinner
              width='1em'
              height='1em'
            />
          ) : (
            'Update'
          )}
        </button>
      </form>
    </div>
  );
}
