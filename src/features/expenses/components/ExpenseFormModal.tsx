import type {
  ChangeEventHandler,
  FormEventHandler,
} from 'react';
import CustomSelect from '../../../shared/components/CustomSelect/CustomSelect';
import Spinner from '../../../shared/components/Spinner/Spinner';
import '../../../shared/styles/modals.css';
import type {
  ExpenseFormErrors,
  ExpenseFormValues,
} from './expenseFormValidation';

type ExpenseFormModalProps<T extends string> = {
  isVisible: boolean;
  onClose: () => void;
  formData: ExpenseFormValues;
  error: ExpenseFormErrors;
  expenseTypes: readonly T[];
  selected: T;
  setSelected: (item: T) => void;
  loading: boolean;
  submitDisabled: boolean;
  submitLabel: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

const expenseTypeSelectStyles = {
  background: 'var(--background-six)',
  border: 'solid 1px var(--border-one)',
  margin: '1em 0 0 0',
  color: 'var(--text-one)',
  fontSize: '0.8em',
  chevronFill: 'var(--text-one)',
};

export default function ExpenseFormModal<T extends string>({
  isVisible,
  onClose,
  formData,
  error,
  expenseTypes,
  selected,
  setSelected,
  loading,
  submitDisabled,
  submitLabel,
  onChange,
  onSubmit,
}: ExpenseFormModalProps<T>) {
  return (
    <div className={`modal ${!isVisible ? 'modal-hidden' : ''}`}>
      <div className='modal-window'>
        <button
          aria-label='Close expense form'
          className='modal-close'
          onClick={onClose}
          type='button'
        >
          X
        </button>
        <form onSubmit={onSubmit} className='modal-form'>
          <input
            className={`${error.title ? 'modal-form-invalid-input' : ''}`}
            onChange={onChange}
            aria-label='Title'
            type='text'
            placeholder='Title'
            name='title'
            value={formData.title}
          />
          <h6 className='modal-form-error-message'>{error.title}</h6>
          <input
            className={`${error.business ? 'modal-form-invalid-input' : ''}`}
            onChange={onChange}
            aria-label='Business'
            type='text'
            placeholder='Business (optional)'
            name='business'
            value={formData.business}
          />
          <h6 className='modal-form-error-message'>{error.business}</h6>
          <input
            className={`${error.amount ? 'modal-form-invalid-input' : ''}`}
            onChange={onChange}
            aria-label='Amount'
            type='text'
            placeholder='Amount'
            name='amount'
            value={formData.amount}
          />
          <h6 className='modal-form-error-message'>{error.amount}</h6>
          <CustomSelect
            label='Expense type'
            selected={selected}
            setSelected={setSelected}
            items={expenseTypes}
            styles={expenseTypeSelectStyles}
          />
          <div className='modal-form-row'>
            <input
              onChange={onChange}
              aria-label='Date'
              className={`modal-form-input-date ${
                error.date ? 'modal-form-invalid-input' : ''
              }`}
              type='date'
              name='date'
              value={formData.date}
            />
            <input
              onChange={onChange}
              checked={formData.recurring}
              type='checkbox'
              name='recurring'
              id='recurringcheckbox'
            />
            <label htmlFor='recurringcheckbox'>Recurring</label>
          </div>
          <h6 className='modal-form-error-message'>{error.date}</h6>
          <button
            disabled={submitDisabled}
            className='modal-form-submit'
            type='submit'
          >
            {loading ? <Spinner width='1rem' height='1rem' /> : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
