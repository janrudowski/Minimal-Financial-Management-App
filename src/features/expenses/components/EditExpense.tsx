import { type Dispatch, type SetStateAction } from 'react';
import { useAPI } from '../context/ExpensesContext';
import type { EditExpenseInput, Expense } from '../types';
import ExpenseFormModal from './ExpenseFormModal';
import type { ExpenseFormValues } from './expenseFormValidation';
import { useExpenseForm } from './useExpenseForm';

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

  const expenseForm = useExpenseForm({
    initialValues: initialFormData,
    expenseTypes,
    initialSelected: currentEdited.type,
    submitLabel: 'Save',
    onSuccessClose: () => toggle(false),
    onSubmit: async (formData, selected) => {
      clearSearch('');
      const editedExpense: EditExpenseInput = {
        ...formData,
        type: selected,
        amount: Number(formData.amount),
      };
      await editExpense(currentEdited.id, editedExpense);
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
