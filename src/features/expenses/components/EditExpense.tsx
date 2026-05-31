import { type Dispatch, type SetStateAction } from 'react';
import { useAPI } from '../context/ExpensesContext';
import { formatExpenseInputDate } from '../model/expenseDate';
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

  const initialFormData: ExpenseFormValues = {
    title: currentEdited.name,
    business: currentEdited.business,
    amount: currentEdited.amount,
    date: formatExpenseInputDate(currentEdited.date),
    recurring: currentEdited.recurring,
  };

  const expenseForm = useExpenseForm({
    initialValues: initialFormData,
    expenseTypes,
    initialSelected: currentEdited.type,
    submitLabel: 'Save',
    onSuccessClose: () => toggle(false),
    onSubmit: async (formData, selected) => {
      const editedExpense: EditExpenseInput = {
        ...formData,
        type: selected,
        amount: Number(formData.amount),
      };
      await editExpense(currentEdited.id, editedExpense);
      clearSearch('');
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
