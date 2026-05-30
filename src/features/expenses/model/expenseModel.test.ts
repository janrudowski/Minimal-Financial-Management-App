import { describe, expect, it } from 'vitest';
import type { Expense } from '../types';
import {
  calculateSpendings,
  getChartExpenses,
  getCurrentPageExpenses,
  getFilteredExpenses,
  getRecurringExpenses,
} from './expenseModel';
import {
  createInitialExpenseState,
  expenseActions,
  expenseReducer,
} from './expenseReducer';

function seconds(isoDate: string): number {
  return Math.floor(new Date(isoDate).getTime() / 1000);
}

function expense(overrides: Partial<Expense>): Expense {
  return {
    id: overrides.id ?? 'expense-id',
    uid: overrides.uid ?? 'user-id',
    invoiceid: overrides.invoiceid ?? 'MGL0123456789',
    name: overrides.name ?? 'Coffee',
    business: overrides.business ?? 'Cafe',
    type: overrides.type ?? 'Food',
    amount: overrides.amount ?? 10,
    date: overrides.date ?? { seconds: seconds('2026-05-15T12:00:00.000Z') },
    recurring: overrides.recurring ?? false,
  };
}

describe('expense model', () => {
  it('calculates total, monthly, and daily spendings from deterministic dates', () => {
    const now = new Date('2026-05-15T18:00:00.000Z');
    const expenses = [
      expense({
        id: 'today',
        amount: 25.25,
        date: { seconds: seconds('2026-05-15T12:00:00.000Z') },
      }),
      expense({
        id: 'month',
        amount: 50.5,
        date: { seconds: seconds('2026-05-02T12:00:00.000Z') },
      }),
      expense({
        id: 'past',
        amount: 100,
        date: { seconds: seconds('2026-04-30T12:00:00.000Z') },
      }),
    ];

    expect(calculateSpendings(expenses, now)).toEqual({
      totalSpending: '175.75',
      dailySpending: '25.25',
      monthlySpending: '75.75',
    });
  });

  it('returns recurring expenses', () => {
    const recurring = expense({ id: 'recurring', recurring: true });
    const oneTime = expense({ id: 'one-time', recurring: false });

    expect(getRecurringExpenses([recurring, oneTime])).toEqual([recurring]);
  });

  it('filters chart expenses by relative day ranges', () => {
    const now = new Date('2026-05-15T12:00:00.000Z').getTime();
    const today = expense({
      id: 'today',
      date: { seconds: seconds('2026-05-15T10:00:00.000Z') },
    });
    const tenDaysAgo = expense({
      id: 'ten-days',
      date: { seconds: seconds('2026-05-05T10:00:00.000Z') },
    });
    const fortyDaysAgo = expense({
      id: 'forty-days',
      date: { seconds: seconds('2026-04-05T10:00:00.000Z') },
    });

    expect(getChartExpenses([today, tenDaysAgo, fortyDaysAgo], 7, now)).toEqual([
      today,
    ]);
    expect(getChartExpenses([today, tenDaysAgo, fortyDaysAgo], 30, now)).toEqual([
      today,
      tenDaysAgo,
    ]);
    expect(getChartExpenses([today, tenDaysAgo, fortyDaysAgo], -1, now)).toEqual([
      today,
      tenDaysAgo,
      fortyDaysAgo,
    ]);
  });

  it('filters expenses by name search', () => {
    const coffee = expense({ id: 'coffee', name: 'Coffee beans' });
    const rent = expense({ id: 'rent', name: 'Apartment rent' });

    expect(
      getFilteredExpenses([coffee, rent], { type: 'search', value: 'coffee' })
    ).toEqual([coffee]);
  });

  it('returns current page expenses', () => {
    const expenses = Array.from({ length: 12 }, (_, index) =>
      expense({ id: `expense-${index + 1}` })
    );

    expect(getCurrentPageExpenses(expenses, 2, 10).map((item) => item.id)).toEqual([
      'expense-11',
      'expense-12',
    ]);
  });
});

describe('expense reducer', () => {
  it('sets derived state when data loads', () => {
    const expenses = Array.from({ length: 12 }, (_, index) =>
      expense({
        id: `expense-${index + 1}`,
        date: { seconds: seconds('2026-05-15T12:00:00.000Z') },
      })
    );

    const state = expenseReducer(createInitialExpenseState(), {
      type: expenseActions.SET_DATA,
      payload: { expenses, now: new Date('2026-05-15T18:00:00.000Z') },
    });

    expect(state.pages).toBe(2);
    expect(state.recentExpenses.map((item) => item.id)).toEqual([
      'expense-1',
      'expense-2',
      'expense-3',
    ]);
    expect(state.currentPageExpenses).toHaveLength(10);
    expect(state.totalSpending).toBe('120.00');
  });

  it('resets pagination to page 1 after filtering', () => {
    const stateWithData = expenseReducer(createInitialExpenseState(), {
      type: expenseActions.SET_DATA,
      payload: {
        expenses: [
          expense({ id: 'coffee', name: 'Coffee' }),
          expense({ id: 'rent', name: 'Rent' }),
        ],
      },
    });

    const filteredState = expenseReducer(stateWithData, {
      type: expenseActions.FILTER,
      payload: { filter: { type: 'search', value: 'coffee' } },
    });

    expect(filteredState.currentPage).toBe(1);
    expect(filteredState.pages).toBe(1);
    expect(filteredState.currentPageExpenses.map((item) => item.id)).toEqual([
      'coffee',
    ]);
  });
});
