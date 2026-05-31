import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase/firebase';
import type { ExpenseWritePayload } from '../model/createExpensePayload';
import type { EditExpenseInput, Expense } from '../types';

const expensesCollection = 'expenses';

export function subscribeToUserExpenses(
  uid: string,
  onExpenses: (expenses: Expense[]) => void
): Unsubscribe {
  const expensesColRef = collection(db, expensesCollection);
  const expensesOrderedQuery = query(
    expensesColRef,
    where('uid', '==', uid),
    orderBy('date', 'desc')
  );

  return onSnapshot(expensesOrderedQuery, (snapshot) => {
    const expenses = snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })) as Expense[];

    onExpenses(expenses);
  });
}

export async function addExpenseDocument(
  expense: ExpenseWritePayload
): Promise<void> {
  await setDoc(doc(db, expensesCollection, expense.id), { ...expense });
}

export async function updateExpenseDocument(
  id: string,
  data: EditExpenseInput
): Promise<void> {
  const { title, date, ...rest } = data;
  const docRef = doc(db, expensesCollection, id);

  await updateDoc(docRef, {
    ...rest,
    name: title,
    date: Timestamp.fromDate(new Date(date)),
  });
}
