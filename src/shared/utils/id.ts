import { customAlphabet } from 'nanoid';

const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export const createExpenseId = customAlphabet(alphabet, 16);

const randomNumbers = customAlphabet('0123456789', 10);

export function createInvoiceId(): string {
  return `MGL0${randomNumbers()}`;
}

export const nanoid = createExpenseId;
export const invoice = createInvoiceId;
