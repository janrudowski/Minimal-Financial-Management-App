import { describe, expect, it } from 'vitest';
import {
  formatExpenseDisplayDate,
  formatExpenseInputDate,
  toExpenseDate,
} from './expenseDate';

describe('expenseDate', () => {
  it('converts Firestore-like seconds timestamps to Date objects', () => {
    const seconds = Math.floor(
      new Date('2026-05-31T10:30:00.000Z').getTime() / 1000
    );

    expect(
      toExpenseDate({ seconds }).toISOString()
    ).toBe('2026-05-31T10:30:00.000Z');
  });

  it('converts Firestore toDate timestamps to Date objects', () => {
    const timestamp = {
      seconds: 0,
      toDate: () => new Date('2026-05-20T12:00:00.000Z'),
    };

    expect(toExpenseDate(timestamp).toISOString()).toBe(
      '2026-05-20T12:00:00.000Z'
    );
  });

  it('formats timestamps for table display and date inputs', () => {
    const timestamp = {
      seconds: 0,
      toDate: () => new Date('2026-05-20T12:00:00.000Z'),
    };

    expect(formatExpenseDisplayDate(timestamp, 'en-US')).toBe('May 20, 2026');
    expect(formatExpenseInputDate(timestamp)).toBe('2026-05-20');
  });
});
