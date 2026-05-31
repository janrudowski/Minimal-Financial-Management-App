import { expenseCategories, type Expense, type ExpenseFilter } from '../types';
import {
  calculateSpendings,
  getChartExpenses,
  getCurrentPageExpenses,
  getFilteredExpenses,
  getRecurringExpenses,
  type SpendingSummary,
} from './expenseModel';

export const expenseActions = {
  SET_DATA: 'set-data',
  CHANGE_PAGE: 'change-page',
  CHANGE_CHART_RANGE: 'change-chart-range',
  FILTER: 'filter',
  RESET: 'reset',
} as const;

export const ACTIONS = expenseActions;

export type ExpenseState = SpendingSummary & {
  expenses: Expense[];
  recurringExpenses: Expense[];
  recentExpenses: Expense[];
  displayedExpenses: Expense[];
  currentPageExpenses: Expense[];
  chartExpenses: Expense[];
  chartDays: number;
  currentPage: number;
  pages: number;
  perPage: number;
  expenseTypes: typeof expenseCategories;
};

export type ExpenseAction =
  | {
      type: typeof expenseActions.SET_DATA;
      payload: { expenses: Expense[]; now?: Date };
    }
  | {
      type: typeof expenseActions.CHANGE_PAGE;
      payload: { page: number };
    }
  | {
      type: typeof expenseActions.CHANGE_CHART_RANGE;
      payload: { days: number };
    }
  | {
      type: typeof expenseActions.FILTER;
      payload: { filter: ExpenseFilter | null };
    }
  | {
      type: typeof expenseActions.RESET;
    };

export function createInitialExpenseState(): ExpenseState {
  return {
    totalSpending: '0.00',
    monthlySpending: '0.00',
    dailySpending: '0.00',
    expenses: [],
    recurringExpenses: [],
    recentExpenses: [],
    displayedExpenses: [],
    currentPageExpenses: [],
    chartExpenses: [],
    chartDays: 7,
    currentPage: 1,
    pages: 0,
    perPage: 10,
    expenseTypes: expenseCategories,
  };
}

export function expenseReducer(
  state: ExpenseState,
  action: ExpenseAction
): ExpenseState {
  switch (action.type) {
    case expenseActions.SET_DATA: {
      const { expenses, now } = action.payload;
      const pages = Math.ceil(expenses.length / state.perPage);

      return {
        ...state,
        expenses,
        displayedExpenses: expenses,
        recentExpenses: expenses.slice(0, 3),
        currentPageExpenses: getCurrentPageExpenses(expenses, 1, state.perPage),
        recurringExpenses: getRecurringExpenses(expenses),
        chartExpenses: getChartExpenses(expenses, state.chartDays),
        pages,
        currentPage: 1,
        ...calculateSpendings(expenses, now),
      };
    }

    case expenseActions.CHANGE_PAGE: {
      const { page } = action.payload;

      return {
        ...state,
        currentPage: page,
        currentPageExpenses: getCurrentPageExpenses(
          state.displayedExpenses,
          page,
          state.perPage
        ),
      };
    }

    case expenseActions.CHANGE_CHART_RANGE: {
      const { days } = action.payload;

      return {
        ...state,
        chartExpenses: getChartExpenses(state.expenses, days),
        chartDays: days,
      };
    }

    case expenseActions.FILTER: {
      const { filter } = action.payload;
      const displayedExpenses = getFilteredExpenses(state.expenses, filter);

      return {
        ...state,
        displayedExpenses,
        currentPageExpenses: getCurrentPageExpenses(
          displayedExpenses,
          1,
          state.perPage
        ),
        pages: Math.ceil(displayedExpenses.length / state.perPage),
        currentPage: 1,
      };
    }

    case expenseActions.RESET:
      return {
        ...state,
        displayedExpenses: state.expenses,
        currentPage: 1,
        pages: Math.ceil(state.expenses.length / state.perPage),
        currentPageExpenses: getCurrentPageExpenses(
          state.expenses,
          1,
          state.perPage
        ),
      };
  }
}
