import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Expense } from '../types';
import EditExpense from './EditExpense';

const mockApi = vi.hoisted(() => ({
  editExpense: vi.fn(),
  expenseTypes: ['Food', 'Travel'],
}));

vi.mock('../context/ExpensesContext', () => ({
  useAPI: () => mockApi,
}));

const currentEdited: Expense = {
  id: 'expense-1',
  uid: 'user-1',
  invoiceid: 'MGL0000000001',
  name: 'Hotel',
  business: 'Lucchese Travel',
  type: 'Travel',
  amount: 129.95,
  date: {
    seconds: Math.floor(new Date('2026-05-20T12:00:00Z').getTime() / 1000),
  },
  recurring: false,
};

function setup(expense: Expense = currentEdited) {
  const toggle = vi.fn();
  const clearSearch = vi.fn();

  render(
    <EditExpense
      isVisible={true}
      toggle={toggle}
      currentEdited={expense}
      clearSearch={clearSearch}
    />
  );

  return { toggle, clearSearch };
}

describe('EditExpense', () => {
  beforeEach(() => {
    mockApi.editExpense.mockReset();
    mockApi.editExpense.mockResolvedValue(undefined);
  });

  it('shows validation messages and does not submit when required fields are empty', async () => {
    const user = userEvent.setup();
    const { clearSearch } = setup();
    const dateInput = document.querySelector<HTMLInputElement>(
      'input[name="date"]'
    );

    expect(dateInput).not.toBeNull();

    await user.clear(screen.getByPlaceholderText('Title'));
    await user.clear(screen.getByPlaceholderText('Amount'));
    fireEvent.change(dateInput as HTMLInputElement, { target: { value: '' } });
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('title cannot be empty.')).toBeInTheDocument();
    expect(screen.getByText('amount cannot be empty.')).toBeInTheDocument();
    expect(screen.getByText('date cannot be empty.')).toBeInTheDocument();
    expect(mockApi.editExpense).not.toHaveBeenCalled();
    expect(clearSearch).not.toHaveBeenCalled();
  });

  it('preselects recurring when the edited expense is recurring', () => {
    setup({ ...currentEdited, recurring: true });

    expect(screen.getByLabelText('Recurring')).toBeChecked();
  });

  it('submits edited expense data with a numeric amount and clears search', async () => {
    const user = userEvent.setup();
    const { clearSearch } = setup();
    const dateInput = document.querySelector<HTMLInputElement>(
      'input[name="date"]'
    );

    expect(dateInput).not.toBeNull();

    await user.clear(screen.getByPlaceholderText('Title'));
    await user.type(screen.getByPlaceholderText('Title'), 'Updated hotel');
    await user.clear(screen.getByPlaceholderText('Business (optional)'));
    await user.type(
      screen.getByPlaceholderText('Business (optional)'),
      'Downtown Hotel'
    );
    await user.clear(screen.getByPlaceholderText('Amount'));
    await user.type(screen.getByPlaceholderText('Amount'), '150.5');
    fireEvent.change(dateInput as HTMLInputElement, {
      target: { value: '2026-05-21' },
    });
    await user.click(screen.getByLabelText('Recurring'));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(mockApi.editExpense).toHaveBeenCalledWith('expense-1', {
        title: 'Updated hotel',
        business: 'Downtown Hotel',
        amount: 150.5,
        date: '2026-05-21',
        recurring: true,
        type: 'Travel',
      });
    });
    expect(clearSearch).toHaveBeenCalledWith('');
  });
});
