import { type Dispatch, type SetStateAction } from 'react';
import { useAPI } from '../context/ExpensesContext';
import ExpenseFormModal from './ExpenseFormModal';
import type { ExpenseFormValues } from './expenseFormValidation';
import { useExpenseForm } from './useExpenseForm';

type CreateExpenseProps = {
  isVisible: boolean;
  toggle: Dispatch<SetStateAction<boolean>>;
  clearSearch: Dispatch<SetStateAction<string>>;
};

export default function CreateExpense({
  isVisible,
  toggle,
  clearSearch,
}: CreateExpenseProps) {
  const { addExpense, expenseTypes } = useAPI();

  const initialFormData: ExpenseFormValues = {
    title: '',
    business: '',
    amount: '',
    date: '',
    recurring: false,
  };

  const expenseForm = useExpenseForm({
    initialValues: initialFormData,
    expenseTypes,
    submitLabel: 'Add',
    onSuccessClose: () => toggle(false),
    onSubmit: async (formData, selected) => {
      const { title, business, amount, date, recurring } = formData;
      clearSearch('');
      await addExpense(
        title,
        business,
        selected,
        Number(amount),
        date,
        recurring
      );
    },
  });

  return (
    <ExpenseFormModal
      isVisible={isVisible}
      onClose={() => toggle(false)}
      expenseTypes={expenseTypes}
      {...expenseForm}
    />
  );
}
