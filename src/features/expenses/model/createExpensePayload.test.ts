import { describe, expect, it } from 'vitest';
import { createExpensePayload } from './createExpensePayload';

describe('createExpensePayload', () => {
  it('maps form data to the persisted expense shape', () => {
    const payload = createExpensePayload(
      {
        title: 'Coffee',
        business: 'Cafe',
        type: 'Food',
        amount: 12.5,
        date: '2026-05-15',
        recurring: true,
      },
      'user-1',
      () => 'expense-1',
      () => 'MGL0123456789'
    );

    expect(payload.id).toBe('expense-1');
    expect(payload.uid).toBe('user-1');
    expect(payload.invoiceid).toBe('MGL0123456789');
    expect(payload.name).toBe('Coffee');
    expect(payload.business).toBe('Cafe');
    expect(payload.type).toBe('Food');
    expect(payload.amount).toBe(12.5);
    expect(payload.recurring).toBe(true);
    expect(payload.date.seconds).toBeGreaterThan(0);
  });
});
