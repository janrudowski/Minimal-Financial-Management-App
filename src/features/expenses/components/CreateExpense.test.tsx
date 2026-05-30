import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CreateExpense from './CreateExpense';

const mockApi = vi.hoisted(() => ({
  addExpense: vi.fn(),
  expenseTypes: ['Food', 'Travel'],
}));

vi.mock('../context/ExpensesContext', () => ({
  useAPI: () => mockApi,
}));

function setup() {
  const toggle = vi.fn();
  const clearSearch = vi.fn();

  render(
    <CreateExpense isVisible={true} toggle={toggle} clearSearch={clearSearch} />
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

describe('CreateExpense', () => {
  beforeEach(() => {
    mockApi.addExpense.mockReset();
    mockApi.addExpense.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('shows validation messages and does not submit when required fields are empty', async () => {
    const user = userEvent.setup();
    const { clearSearch } = setup();

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('title cannot be empty.')).toBeInTheDocument();
    expect(screen.getByText('amount cannot be empty.')).toBeInTheDocument();
    expect(screen.getByText('date cannot be empty.')).toBeInTheDocument();
    expect(mockApi.addExpense).not.toHaveBeenCalled();
    expect(clearSearch).not.toHaveBeenCalled();
  });

  it('shows the numeric amount validation message when amount is not a number', async () => {
    const user = userEvent.setup();
    const { clearSearch } = setup();
    const dateInput = document.querySelector<HTMLInputElement>(
      'input[name="date"]'
    );

    expect(dateInput).not.toBeNull();

    await user.type(screen.getByPlaceholderText('Title'), 'Team lunch');
    await user.type(screen.getByPlaceholderText('Amount'), 'forty');
    await user.type(dateInput as HTMLInputElement, '2026-05-30');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('amount must be a number.')).toBeInTheDocument();
    expect(mockApi.addExpense).not.toHaveBeenCalled();
    expect(clearSearch).not.toHaveBeenCalled();
  });

  it('submits a valid expense with a numeric amount and clears search', async () => {
    const user = userEvent.setup();
    const { clearSearch } = setup();
    const dateInput = document.querySelector<HTMLInputElement>(
      'input[name="date"]'
    );

    expect(dateInput).not.toBeNull();

    await user.type(screen.getByPlaceholderText('Title'), 'Team lunch');
    await user.type(
      screen.getByPlaceholderText('Business (optional)'),
      'Corner Cafe'
    );
    await user.type(screen.getByPlaceholderText('Amount'), '42.75');
    await user.type(dateInput as HTMLInputElement, '2026-05-30');
    await user.click(screen.getByLabelText('Recurring'));
    await user.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      expect(mockApi.addExpense).toHaveBeenCalledWith(
        'Team lunch',
        'Corner Cafe',
        'Food',
        42.75,
        '2026-05-30',
        true
      );
    });
    expect(clearSearch).toHaveBeenCalledWith('');
  });

  it('keeps the modal open and preserves form data when adding fails', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const deferredAdd = createDeferred<void>();
    mockApi.addExpense.mockReturnValueOnce(deferredAdd.promise);
    const user = userEvent.setup();
    const { toggle } = setup();
    const dateInput = document.querySelector<HTMLInputElement>(
      'input[name="date"]'
    );

    expect(dateInput).not.toBeNull();

    await user.type(screen.getByPlaceholderText('Title'), 'Team lunch');
    await user.type(
      screen.getByPlaceholderText('Business (optional)'),
      'Corner Cafe'
    );
    await user.type(screen.getByPlaceholderText('Amount'), '42.75');
    await user.type(dateInput as HTMLInputElement, '2026-05-30');
    await user.click(screen.getByLabelText('Recurring'));
    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(mockApi.addExpense).toHaveBeenCalledTimes(1);

    vi.useFakeTimers();

    await act(async () => {
      deferredAdd.reject(new Error('Network failed'));
      await deferredAdd.promise.catch(() => undefined);
    });

    expect(screen.queryByRole('button', { name: '✔' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeEnabled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(toggle).not.toHaveBeenCalled();
    expect(screen.getByPlaceholderText('Title')).toHaveValue('Team lunch');
    expect(screen.getByPlaceholderText('Business (optional)')).toHaveValue(
      'Corner Cafe'
    );
    expect(screen.getByPlaceholderText('Amount')).toHaveValue('42.75');
    expect(dateInput as HTMLInputElement).toHaveValue('2026-05-30');
    expect(screen.getByLabelText('Recurring')).toBeChecked();
  });
});
