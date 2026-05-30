export const expenseCategories = [
  'Entertainment',
  'Shopping',
  'Software',
  'Subscription',
  'Withdraw',
  'Travel',
  'Food',
] as const;

export type ExpenseCategory = (typeof expenseCategories)[number];

export type FirestoreTimestampLike = {
  seconds: number;
  nanoseconds?: number;
  toDate?: () => Date;
};

export type Expense = {
  id: string;
  uid: string;
  invoiceid: string;
  name: string;
  business: string;
  type: ExpenseCategory;
  amount: number;
  date: FirestoreTimestampLike;
  recurring: boolean;
};

export type ExpenseFilter = {
  type: 'search';
  value: string;
};

export type NewExpenseInput = {
  title: string;
  business: string;
  type: ExpenseCategory;
  amount: number;
  date: string;
  recurring: boolean;
};

export type EditExpenseInput = NewExpenseInput;
