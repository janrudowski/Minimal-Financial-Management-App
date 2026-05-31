import {
  createContext,
  type Dispatch,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { createExpenseId, createInvoiceId } from '../../../shared/utils/id';
import {
  addExpenseDocument,
  subscribeToUserExpenses,
  updateExpenseDocument,
} from '../api/expensesApi';
import { createExpensePayload } from '../model/createExpensePayload';
import {
  ACTIONS,
  createInitialExpenseState,
  expenseActions,
  expenseReducer,
  type ExpenseAction,
  type ExpenseState,
} from '../model/expenseReducer';
import type { EditExpenseInput, ExpenseFilter, NewExpenseInput } from '../types';

type ExpensesContextValue = ExpenseState & {
  loading: boolean;
  dispatch: Dispatch<ExpenseAction>;
  addExpense: (
    title: string,
    business: string,
    type: NewExpenseInput['type'],
    amount: number,
    date: string,
    recurring: boolean
  ) => Promise<void>;
  editExpense: (id: string, data: EditExpenseInput) => Promise<void>;
  goToPage: (page: number) => void;
  changeChart: (days: number) => void;
  applyFilter: (filter: ExpenseFilter | null) => void;
  resetDisplayed: () => void;
};

const ExpensesContext = createContext<ExpensesContextValue | undefined>(
  undefined
);

type ExpensesContextProviderProps = {
  children: ReactNode;
};

export function useAPI(): ExpensesContextValue {
  const context = useContext(ExpensesContext);

  if (!context) {
    throw new Error('useAPI must be used within APIContextProvider.');
  }

  return context;
}

export function APIContextProvider({ children }: ExpensesContextProviderProps) {
  const [loading, setLoading] = useState(true);
  const [apiData, dispatch] = useReducer(
    expenseReducer,
    createInitialExpenseState()
  );
  const { currentUser } = useAuth();

  async function addExpense(
    title: string,
    business: string,
    type: NewExpenseInput['type'],
    amount: number,
    date: string,
    recurring: boolean
  ) {
    if (!currentUser) {
      throw new Error('Cannot add an expense without a signed-in user.');
    }

    const expense = createExpensePayload(
      { title, business, type, amount, date, recurring },
      currentUser.uid,
      createExpenseId,
      createInvoiceId
    );

    await addExpenseDocument(expense);
  }

  async function editExpense(id: string, data: EditExpenseInput) {
    await updateExpenseDocument(id, data);
  }

  function goToPage(page: number) {
    if (page > apiData.pages || page < 1) {
      return;
    }

    dispatch({ type: expenseActions.CHANGE_PAGE, payload: { page } });
  }

  function changeChart(days: number) {
    dispatch({ type: expenseActions.CHANGE_CHART_RANGE, payload: { days } });
  }

  function applyFilter(filter: ExpenseFilter | null) {
    dispatch({ type: expenseActions.FILTER, payload: { filter } });
  }

  function resetDisplayed() {
    dispatch({ type: expenseActions.RESET });
  }

  useEffect(() => {
    setLoading(true);

    if (!currentUser) {
      dispatch({
        type: expenseActions.SET_DATA,
        payload: { expenses: [] },
      });
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToUserExpenses(currentUser.uid, (expenses) => {
      dispatch({ type: expenseActions.SET_DATA, payload: { expenses } });
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  return (
    <ExpensesContext.Provider
      value={{
        ...apiData,
        loading,
        dispatch,
        addExpense,
        editExpense,
        goToPage,
        changeChart,
        applyFilter,
        resetDisplayed,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export { ACTIONS };
