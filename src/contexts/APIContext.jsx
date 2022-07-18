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

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SET_DATA:
      const { expenses } = payload;
      return {
        ...state,
        expenses: expenses,
        recentExpenses: expenses.slice(0, 3),
        ...getSpendings(expenses),
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
  };
}

export function APIContextProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [apiData, dispatch] = useReducer(reducer, {}, init);

  const { currentUser } = useAuth();

  class Expense {
    constructor(name, business, type, amount, date) {
      this.uid = currentUser.uid;
      this.id = nanoid();
      this.invoiceid = invoice();
      this.name = name;
      this.business = business;
      this.type = type;
      this.amount = amount;
      this.date = this._convertToTimestamp(new Date(date));
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

  async function addExpense(title, business, type, amount, date) {
    const expense = new Expense(title, business, type, amount, date);
    try {
      await setDoc(doc(db, 'expenses', expense.id), { ...expense });
    } catch (err) {
      throw err;
    }
  }

  useEffect(() => {
    setLoading(true);
    getExpenses();
  }, [currentUser]);

  return (
    <APIContext.Provider value={{ ...apiData, loading, dispatch, addExpense }}>
      {children}
    </APIContext.Provider>
  );
}
