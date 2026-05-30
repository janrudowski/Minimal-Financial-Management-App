import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('CreateExpense', () => {
  beforeEach(() => {
    mockApi.addExpense.mockReset();
    mockApi.addExpense.mockResolvedValue(undefined);
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
});
