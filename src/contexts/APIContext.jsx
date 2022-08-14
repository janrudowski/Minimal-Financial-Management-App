/*

 FIREBASE EXPENSES COLLECTION SCHEMA:

 doc = {
   uid:string,
   name:string,
   business:string,
   type:string,
   amount:number,
   date:timestamp,
   image:string,
   invoiceid:string,
 }


*/

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { db } from '../config';
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { nanoid, invoice } from '../utils/generateId';
import { useAuth } from './AuthContext';
const APIContext = createContext();

export function useAPI() {
  return useContext(APIContext);
}

export const ACTIONS = {
  SET_DATA: 'set-data', //update state with data from db
  CHANGE_PAGE: 'change-page', //change the current expenses page
  CHANGE_CHART_RANGE: 'change-chart-range',
  FILTER: 'filter',
  RESET: 'reset',
};

function sumCallback(acc, el) {
  return acc + el.amount;
}

function getSpendings(expenses) {
  const now = new Date();
  const monthNow = now.getMonth();
  const dayNow = now.getDate();
  const yearNow = now.getFullYear();

  const totalSpending = expenses.reduce(sumCallback, 0).toFixed(2);

  const dailySpending = expenses
    .filter((el) => {
      const date = new Date(el.date.seconds * 1000);
      if (
        date.getDate() === dayNow &&
        date.getMonth() === monthNow &&
        date.getFullYear() === yearNow
      ) {
        return true;
      } else {
        return false;
      }
    })
    .reduce(sumCallback, 0)
    .toFixed(2);

  const monthlySpending = expenses
    .filter((el) => {
      const date = new Date(el.date.seconds * 1000);
      if (date.getMonth() === monthNow && date.getFullYear() === yearNow) {
        return true;
      } else {
        return false;
      }
    })
    .reduce(sumCallback, 0)
    .toFixed(2);

  return { totalSpending, dailySpending, monthlySpending };
}

function getRecurringExpenses(expenses) {
  return expenses.filter((el) => el.recurring === true);
}

function getChartExpenses(expenses, days) {
  if (days < 0) return expenses;
  return expenses.filter((el) => {
    const now = Date.now();
    const timestamp = el.date.seconds * 1000;
    const daysInMiliSeconds = days * 24 * 60 * 60 * 1000;
    if (timestamp >= now - daysInMiliSeconds) return true;
    return false;
  });
}

function getFiltered(expenses, { type, value }) {
  switch (type) {
    case 'search':
      return expenses.filter((el) => {
        return el.name.toLowerCase().includes(value);
      });
  }
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SET_DATA:
      const { expenses } = payload;
      const pages = Math.ceil(expenses.length / state.perPage);
      return {
        ...state,
        expenses: expenses,
        displayedExpenses: expenses,
        recentExpenses: expenses.slice(0, 3),
        currentPageExpenses: expenses.slice(0, state.perPage),
        recurringExpenses: getRecurringExpenses(expenses),
        chartExpenses: getChartExpenses(expenses, state.chartDays),
        pages: pages,
        ...getSpendings(expenses),
      };
    case ACTIONS.CHANGE_PAGE:
      const { page } = payload;
      let start = (page - 1) * state.perPage;
      let end = page * state.perPage;
      return {
        ...state,
        currentPage: page,
        currentPageExpenses: state.displayedExpenses.slice(start, end),
      };
    case ACTIONS.CHANGE_CHART_RANGE:
      const { days } = payload;
      return {
        ...state,
        chartExpenses: getChartExpenses(state.expenses, days),
        chartDays: days,
      };
    case ACTIONS.FILTER:
      const { filter } = payload;
      const displayedExpenses = filter
        ? getFiltered(state.expenses, filter)
        : state.expenses;
      return {
        ...state,
        displayedExpenses: displayedExpenses,
        currentPageExpenses: displayedExpenses.slice(0, state.perPage),
        pages: Math.ceil(displayedExpenses.length / state.perPage),
        currentPage: 1,
      };
    case ACTIONS.RESET:
      return {
        ...state,
        displayedExpenses: state.expenses,
        currentPage: 1,
        pages: Math.ceil(state.expenses.length / state.perPage),
        currentPageExpenses: state.expenses.slice(0, state.perPage),
      };
  }
}

function init() {
  return {
    totalSpending: 0,
    monthlySpending: 0,
    dailySpending: 0,
    expenses: [],
    recurringExpenses: [],
    recentExpenses: [],
    displayedExpenses: [],
    currentPageExpenses: [],
    chartExpenses: [],
    chartDays: 7,
    currentPage: 1,
    pages: null,
    perPage: 10,
    expenseTypes: [
      'Entertainment',
      'Shopping',
      'Software',
      'Subscription',
      'Withdraw',
      'Travel',
      'Food',
    ],
  };
}

export function APIContextProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [apiData, dispatch] = useReducer(reducer, {}, init);

  const { currentUser } = useAuth();

  class Expense {
    constructor(name, business, type, amount, date, recurring) {
      this.uid = currentUser.uid;
      this.id = nanoid();
      this.invoiceid = invoice();
      this.name = name;
      this.business = business;
      this.type = type;
      this.amount = amount;
      this.date = this._convertToTimestamp(new Date(date));
      this.recurring = recurring;
    }
    _convertToTimestamp(date) {
      return Timestamp.fromDate(date);
    }
  }

  // async function getExpenses() {
  //   if (!currentUser) return;

  //   const expensesColRef = collection(db, 'expenses');
  //   const expensesOrderedQuery = query(
  //     expensesColRef,
  //     where('uid', '==', currentUser.uid),
  //     orderBy('date', 'desc')
  //   );
  //   const snapshot = await getDocs(expensesOrderedQuery);
  //   const expenses = snapshot.docs.map((doc) => {
  //     return { id: doc.id, ...doc.data() };
  //   });
  //   dispatch({ type: ACTIONS.SET_DATA, payload: { expenses: expenses } });
  //   setLoading(false);
  // }

  async function getExpenses() {
    if (!currentUser) return;
    const expensesColRef = collection(db, 'expenses');
    const expensesOrderedQuery = query(
      expensesColRef,
      where('uid', '==', currentUser.uid),
      orderBy('date', 'desc')
    );
    onSnapshot(expensesOrderedQuery, (snapshot) => {
      const expenses = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      dispatch({ type: ACTIONS.SET_DATA, payload: { expenses: expenses } });
      setLoading(false);
    });
  }

  async function addExpense(title, business, type, amount, date, recurring) {
    const expense = new Expense(title, business, type, amount, date, recurring);
    try {
      await setDoc(doc(db, 'expenses', expense.id), { ...expense });
    } catch (err) {
      throw err;
    }
  }

  async function editExpense(id, data) {
    const { date } = data;
    const timestamp = Timestamp.fromDate(new Date(date));
    try {
      const docRef = doc(db, 'expenses', id);
      await updateDoc(docRef, { ...data, date: timestamp });
    } catch (err) {
      throw err;
    }
  }

  function goToPage(page) {
    if (page > apiData.pages || page < 1) return;
    dispatch({ type: ACTIONS.CHANGE_PAGE, payload: { page: page } });
  }

  function changeChart(days) {
    dispatch({ type: ACTIONS.CHANGE_CHART_RANGE, payload: { days: days } });
  }

  function applyFilter(filter) {
    dispatch({ type: ACTIONS.FILTER, payload: { filter: filter } });
  }

  function resetDisplayed() {
    dispatch({ type: ACTIONS.RESET });
  }

  useEffect(() => {
    setLoading(true);
    getExpenses();
  }, [currentUser]);

  return (
    <APIContext.Provider
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
    </APIContext.Provider>
  );
}
