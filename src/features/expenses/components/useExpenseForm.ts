import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from 'react';
import { useCustomSelect } from '../../../shared/components/CustomSelect/CustomSelect';
import {
  createEmptyExpenseFormErrors,
  type ExpenseFormErrors,
  type ExpenseFormValues,
  validateExpenseFormData,
} from './expenseFormValidation';

type UseExpenseFormParams<T extends string> = {
  initialValues: ExpenseFormValues;
  expenseTypes: readonly T[];
  initialSelected?: T;
  submitLabel: string;
  onSubmit: (formData: ExpenseFormValues, selected: T) => Promise<void>;
  onSuccessClose: () => void;
};

export function useExpenseForm<T extends string>({
  initialValues,
  expenseTypes,
  initialSelected,
  submitLabel,
  onSubmit,
  onSuccessClose,
}: UseExpenseFormParams<T>) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useCustomSelect(expenseTypes, initialSelected);
  const [formData, setFormData] = useState({ ...initialValues });
  const [error, setError] = useState<ExpenseFormErrors>(
    createEmptyExpenseFormErrors
  );
  const [currentSubmitLabel, setCurrentSubmitLabel] = useState(submitLabel);

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
      await onSubmit(formData, selected);
    } catch (err) {
      console.log(err); //handle errors here
      setLoading(false);
      return;
    }

    setLoading(false);
    setCurrentSubmitLabel('✔');
    setTimeout(() => {
      setCurrentSubmitLabel(submitLabel);
      setFormData({ ...initialValues });
      onSuccessClose();
    }, 1000);
  }

  return {
    error,
    formData,
    loading,
    onChange: handleChange,
    onSubmit: handleSubmit,
    selected,
    setSelected,
    submitLabel: currentSubmitLabel,
  };
}
