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
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { nanoid, invoice } from '../utils/generateId';
import { useAuth } from './AuthContext';
const APIContext = createContext();

export function useAPI() {
  return useContext(APIContext);
}

export const ACTIONS = {
  SET_DATA: 'set-data', //update state with data from db
};

function getTotalSpending(expenses) {
  const value = expenses.reduce((acc, el) => {
    return acc + el.amount;
  }, 0);
  return value.toFixed(2);
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SET_DATA:
      const { expenses } = payload;
      return {
        ...state,
        expenses: expenses,
        recentExpenses: expenses.slice(0, 3),
        totalSpending: getTotalSpending(expenses),
      };
  }
}

console.log(nanoid());
console.log(invoice());

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

  async function getExpenses() {
    if (!currentUser) return;

    const expensesColRef = collection(db, 'expenses');
    const expensesOrderedQuery = query(
      expensesColRef,
      where('uid', '==', currentUser.uid),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(expensesOrderedQuery);
    const expenses = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    dispatch({ type: ACTIONS.SET_DATA, payload: { expenses: expenses } });
    setLoading(false);
  }

  useEffect(() => {
    getExpenses();
  }, []);
  console.log(currentUser);
  return (
    <APIContext.Provider value={{ ...apiData, loading, dispatch }}>
      {children}
    </APIContext.Provider>
  );
}
