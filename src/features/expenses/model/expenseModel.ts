import type { Expense, ExpenseFilter, FirestoreTimestampLike } from '../types';
import { toExpenseDate } from './expenseDate';

export type SpendingSummary = {
  totalSpending: string;
  dailySpending: string;
  monthlySpending: string;
};

function toDate(timestamp: FirestoreTimestampLike): Date {
  return toExpenseDate(timestamp);
}

function sumAmounts(total: number, expense: Expense): number {
  return total + expense.amount;
}

export function calculateSpendings(
  expenses: Expense[],
  now = new Date()
): SpendingSummary {
  const monthNow = now.getMonth();
  const dayNow = now.getDate();
  const yearNow = now.getFullYear();

  const totalSpending = expenses.reduce(sumAmounts, 0).toFixed(2);

  const dailySpending = expenses
    .filter((expense) => {
      const date = toDate(expense.date);
      return (
        date.getDate() === dayNow &&
        date.getMonth() === monthNow &&
        date.getFullYear() === yearNow
      );
    })
    .reduce(sumAmounts, 0)
    .toFixed(2);

  const monthlySpending = expenses
    .filter((expense) => {
      const date = toDate(expense.date);
      return date.getMonth() === monthNow && date.getFullYear() === yearNow;
    })
    .reduce(sumAmounts, 0)
    .toFixed(2);

  return { totalSpending, dailySpending, monthlySpending };
}

export function getRecurringExpenses(expenses: Expense[]): Expense[] {
  return expenses.filter((expense) => expense.recurring === true);
}

export function getChartExpenses(
  expenses: Expense[],
  days: number,
  now = Date.now()
): Expense[] {
  if (days < 0) {
    return expenses;
  }

  const daysInMilliseconds = days * 24 * 60 * 60 * 1000;

  return expenses.filter((expense) => {
    const timestamp = toDate(expense.date).getTime();
    return timestamp >= now - daysInMilliseconds;
  });
}

export function getFilteredExpenses(
  expenses: Expense[],
  filter: ExpenseFilter | null
): Expense[] {
  if (!filter) {
    return expenses;
  }

  switch (filter.type) {
    case 'search': {
      const searchValue = filter.value.toLowerCase();
      return expenses.filter((expense) =>
        expense.name.toLowerCase().includes(searchValue)
      );
    }
  }
}

export function getCurrentPageExpenses(
  expenses: Expense[],
  page: number,
  perPage: number
): Expense[] {
  const start = (page - 1) * perPage;
  const end = page * perPage;

  return expenses.slice(start, end);
}
