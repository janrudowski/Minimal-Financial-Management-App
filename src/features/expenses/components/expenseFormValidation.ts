export type ExpenseFormValues = {
  title: string;
  business: string;
  amount: string | number;
  date: string;
  recurring: boolean;
};

export type ExpenseFormErrors = {
  title: string | null;
  business: string | null;
  amount: string | null;
  date: string | null;
};

const requiredFields = ['title', 'amount', 'date'] as const;

export function createEmptyExpenseFormErrors(): ExpenseFormErrors {
  return {
    title: '',
    business: '',
    amount: null,
    date: null,
  };
}

export function validateExpenseFormData(formData: ExpenseFormValues) {
  const errors = createEmptyExpenseFormErrors();
  let isValid = true;

  requiredFields.forEach((field) => {
    const value = formData[field];
    let message: string | null = null;

    if (value === '') {
      message = `${field} cannot be empty.`;
    }

    if (field === 'amount' && Number.isNaN(Number(value))) {
      message = `${field} must be a number.`;
    }

    errors[field] = message;

    if (message) {
      isValid = false;
    }
  });

  return { errors, isValid };
}
