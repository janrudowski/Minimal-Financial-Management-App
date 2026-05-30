import { Timestamp } from 'firebase/firestore';
import type { ExpenseCategory, NewExpenseInput } from '../types';

export type ExpenseWritePayload = {
  id: string;
  uid: string;
  invoiceid: string;
  name: string;
  business: string;
  type: ExpenseCategory;
  amount: number;
  date: Timestamp;
  recurring: boolean;
};

export function createExpensePayload(
  input: NewExpenseInput,
  uid: string,
  createId: () => string,
  createInvoiceId: () => string
): ExpenseWritePayload {
  const id = createId();

  return {
    uid,
    id,
    invoiceid: createInvoiceId(),
    name: input.title,
    business: input.business,
    type: input.type,
    amount: input.amount,
    date: Timestamp.fromDate(new Date(input.date)),
    recurring: input.recurring,
  };
}
