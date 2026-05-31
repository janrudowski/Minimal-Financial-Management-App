import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

function createDeferred<T>() {
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((_resolve, promiseReject) => {
    reject = promiseReject;
  });

  return {
    promise,
    reject,
  };
}

describe('EditExpense', () => {
  beforeEach(() => {
    mockApi.editExpense.mockReset();
    mockApi.editExpense.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
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

  it('shows the numeric amount validation message when amount is not a number', async () => {
    const user = userEvent.setup();
    const { clearSearch } = setup();
    const dateInput = document.querySelector<HTMLInputElement>(
      'input[name="date"]'
    );

    expect(dateInput).not.toBeNull();

    await user.clear(screen.getByPlaceholderText('Amount'));
    await user.type(screen.getByPlaceholderText('Amount'), 'one hundred');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('amount must be a number.')).toBeInTheDocument();
    expect(mockApi.editExpense).not.toHaveBeenCalled();
    expect(clearSearch).not.toHaveBeenCalled();
  });

  it('preselects recurring when the edited expense is recurring', () => {
    setup({ ...currentEdited, recurring: true });

    expect(screen.getByLabelText('Recurring')).toBeChecked();
  });

  it('renders as a labelled edit expense dialog', () => {
    setup();

    const dialog = screen.getByRole('dialog', { name: 'Edit expense' });

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(
      screen.getByRole('heading', { name: 'Edit expense' })
    ).toBeInTheDocument();
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

  it('keeps the modal open and preserves form data when editing fails', async () => {
    const consoleLogSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    const deferredEdit = createDeferred<void>();
    mockApi.editExpense.mockReturnValueOnce(deferredEdit.promise);
    const user = userEvent.setup();
    const { clearSearch, toggle } = setup();
    const dateInput = document.querySelector<HTMLInputElement>(
      'input[name="date"]'
    );

    expect(dateInput).not.toBeNull();

    await user.clear(screen.getByPlaceholderText('Title'));
    await user.type(screen.getByPlaceholderText('Title'), 'Rejected hotel');
    await user.clear(screen.getByPlaceholderText('Business (optional)'));
    await user.type(
      screen.getByPlaceholderText('Business (optional)'),
      'Airport Hotel'
    );
    await user.clear(screen.getByPlaceholderText('Amount'));
    await user.type(screen.getByPlaceholderText('Amount'), '175');
    fireEvent.change(dateInput as HTMLInputElement, {
      target: { value: '2026-05-22' },
    });
    await user.click(screen.getByLabelText('Recurring'));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(mockApi.editExpense).toHaveBeenCalledTimes(1);

    vi.useFakeTimers();

    await act(async () => {
      deferredEdit.reject(new Error('Network failed'));
      await deferredEdit.promise.catch(() => undefined);
    });

    expect(clearSearch).not.toHaveBeenCalled();
    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: '✔' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(toggle).not.toHaveBeenCalled();
    expect(screen.getByPlaceholderText('Title')).toHaveValue('Rejected hotel');
    expect(screen.getByPlaceholderText('Business (optional)')).toHaveValue(
      'Airport Hotel'
    );
    expect(screen.getByPlaceholderText('Amount')).toHaveValue('175');
    expect(dateInput as HTMLInputElement).toHaveValue('2026-05-22');
    expect(screen.getByLabelText('Recurring')).toBeChecked();
  });
});
