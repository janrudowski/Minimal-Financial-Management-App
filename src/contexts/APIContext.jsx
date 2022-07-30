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

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SET_DATA:
      const { expenses } = payload;
      const pages = Math.ceil(expenses.length / state.perPage);
      return {
        ...state,
        expenses: expenses,
        recentExpenses: expenses.slice(0, 3),
        currentPageExpenses: expenses.slice(0, state.perPage),
        recurringExpenses: getRecurringExpenses(expenses),
        // chartExpenses:
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
        currentPageExpenses: state.expenses.slice(start, end),
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
    currentPageExpenses: [],
    chartExpenses: [],
    chartOption: 7,
    currentPage: 1,
    pages: null,
    perPage: 10,
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

  // function handleChartRange(option) {
  //   dispatch({type: ACTIONS.CHANGE_CHART_RANGE, payload: {option: option}})
  // }

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
      }}
    >
      {children}
    </APIContext.Provider>
  );
}
