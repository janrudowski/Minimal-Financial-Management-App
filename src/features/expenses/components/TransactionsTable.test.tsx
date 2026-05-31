import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Expense } from '../types';
import TransactionsTable from './TransactionsTable';

function seconds(isoDate: string): number {
  return Math.floor(new Date(isoDate).getTime() / 1000);
}

function expense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: overrides.id ?? 'expense-id',
    uid: overrides.uid ?? 'user-id',
    invoiceid: overrides.invoiceid ?? 'MGL0123456789',
    name: overrides.name ?? 'Cloud hosting',
    business: overrides.business ?? 'Infra Co',
    type: overrides.type ?? 'Software',
    amount: overrides.amount ?? 29,
    date: overrides.date ?? { seconds: seconds('2026-05-31T12:00:00.000Z') },
    recurring: overrides.recurring ?? true,
  };
}

describe('TransactionsTable', () => {
  it('uses one accessible edit action while rows can reflow into mobile cards', () => {
    const onEditExpense = vi.fn();
    const { container } = render(
      <TransactionsTable expenses={[expense()]} onEditExpense={onEditExpense} />
    );

    expect(
      screen.getAllByRole('button', { name: 'Edit Cloud hosting' })
    ).toHaveLength(1);

    const table = screen.getByRole('table');
    expect(table).not.toHaveClass('min-w-[720px]');

    expect(
      container.querySelector('tbody tr[class*="block"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('td[data-label="Type"]')
    ).toHaveTextContent('Software');
    expect(
      container.querySelector('td[data-label="Amount"]')
    ).toHaveTextContent('$29.00');
    expect(
      container.querySelector('td[data-label="Invoice Id"]')
    ).toHaveTextContent('MGL0123456789');
  });
});
