import { describe, expect, it } from 'vitest';
import { createExpenseId, createInvoiceId } from './id';

describe('id utilities', () => {
  it('creates 16-character expense ids', () => {
    expect(createExpenseId()).toMatch(/^[0-9A-Za-z]{16}$/);
  });

  it('creates invoice ids with the Maglo prefix and 10 digits', () => {
    expect(createInvoiceId()).toMatch(/^MGL0[0-9]{10}$/);
  });
});
