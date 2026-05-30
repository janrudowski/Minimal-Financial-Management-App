import {
  type ChangeEvent,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useState,
} from 'react';
import CustomSelect, {
  useCustomSelect,
} from '../../../shared/components/CustomSelect/CustomSelect';
import Spinner from '../../../shared/components/Spinner/Spinner';
import '../../../shared/styles/modals.css';
import { useAPI } from '../context/ExpensesContext';
import type { EditExpenseInput, Expense } from '../types';
import {
  createEmptyExpenseFormErrors,
  type ExpenseFormErrors,
  type ExpenseFormValues,
  validateExpenseFormData,
} from './expenseFormValidation';

type EditExpenseProps = {
  isVisible: boolean;
  toggle: Dispatch<SetStateAction<boolean>>;
  currentEdited: Expense;
  clearSearch: Dispatch<SetStateAction<string>>;
};

export default function EditExpense({
  isVisible,
  toggle,
  currentEdited,
  clearSearch,
}: EditExpenseProps) {
  const { editExpense, expenseTypes } = useAPI();

  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useCustomSelect(
    expenseTypes,
    currentEdited.type
  );

  function formatDate(seconds: number) {
    const date = new Date(seconds * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const initialFormData: ExpenseFormValues = {
    title: currentEdited.name,
    business: currentEdited.business,
    amount: currentEdited.amount,
    date: formatDate(currentEdited.date.seconds),
    recurring: currentEdited.recurring,
  };

  const [formData, setFormData] = useState({ ...initialFormData });

  const [error, setError] = useState<ExpenseFormErrors>(
    createEmptyExpenseFormErrors
  );

  const [success, setSuccess] = useState('Save');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { errors, isValid } = validateExpenseFormData(formData);
    setError(errors);

    if (!isValid) return;
    try {
      setLoading(true);
      clearSearch('');
      const editedExpense: EditExpenseInput = {
        ...formData,
        type: selected,
        amount: Number(formData.amount),
      };
      await editExpense(currentEdited.id, editedExpense);
    } catch (err) {
      console.log(err); //handle errors here
    }

    setLoading(false);
    setSuccess('✔');
    setTimeout(() => {
      setSuccess('Save');
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
          <h6 className='modal-form-error-message'>{error.date}</h6>
          <button disabled={loading} className='modal-form-submit'>
            {loading ? <Spinner width='1rem' height='1rem' /> : success}
          </button>
        </form>
      </div>
    </div>
  );
}
