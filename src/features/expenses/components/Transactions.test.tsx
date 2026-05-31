import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Expense } from '../types';
import Transactions from './Transactions';

const mockApi = vi.hoisted(() => ({
  applyFilter: vi.fn(),
  currentPage: 1,
  currentPageExpenses: [] as Expense[],
  goToPage: vi.fn(),
  loading: false,
  pages: 1,
  resetDisplayed: vi.fn(),
}));

vi.mock('../context/ExpensesContext', () => ({
  useAPI: () => mockApi,
}));

vi.mock('../../auth/context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: {
      displayName: 'Avery Stone',
      photoURL: 'https://example.com/avatar.png',
    },
  }),
}));

vi.mock('../../../shared/components/TopBar/TopBar', () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock('./CreateExpense', () => ({
  default: ({ isVisible }: { isVisible: boolean }) =>
    isVisible ? <div role='dialog'>Create expense dialog</div> : null,
}));

vi.mock('./EditExpense', () => ({
  default: ({
    currentEdited,
    isVisible,
  }: {
    currentEdited: Expense;
    isVisible: boolean;
  }) =>
    isVisible ? (
      <div role='dialog'>Edit {currentEdited.name} expense</div>
    ) : null,
}));

function seconds(isoDate: string): number {
  return Math.floor(new Date(isoDate).getTime() / 1000);
}

function expense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: overrides.id ?? 'expense-id',
    uid: overrides.uid ?? 'user-id',
    invoiceid: overrides.invoiceid ?? 'MGL0123456789',
    name: overrides.name ?? 'Coffee',
    business: overrides.business ?? 'Cafe',
    type: overrides.type ?? 'Food',
    amount: overrides.amount ?? 10,
    date: overrides.date ?? { seconds: seconds('2026-05-15T12:00:00.000Z') },
    recurring: overrides.recurring ?? false,
  };
}

function renderTransactions(initialEntries = ['/transactions']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Transactions />
    </MemoryRouter>
  );
}

describe('Transactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi.currentPage = 1;
    mockApi.currentPageExpenses = [expense()];
    mockApi.loading = false;
    mockApi.pages = 1;
  });

  it('filters by an accessible search field and resets displayed expenses on unmount', async () => {
    const user = userEvent.setup();
    const { unmount } = renderTransactions();

    await user.type(
      screen.getByRole('searchbox', { name: 'Search expenses' }),
      'coffee'
    );

    expect(mockApi.applyFilter).toHaveBeenLastCalledWith({
      search: 'coffee',
    });

    unmount();

    expect(mockApi.resetDisplayed).toHaveBeenCalledTimes(1);
  });

  it('opens the create and edit expense dialogs from row actions', async () => {
    const user = userEvent.setup();
    mockApi.currentPageExpenses = [
      expense({ id: 'coffee', name: 'Coffee beans' }),
      expense({ id: 'rent', name: 'Rent' }),
    ];

    renderTransactions();

    await user.click(screen.getByRole('button', { name: 'Create Expense' }));
    expect(screen.getByRole('dialog')).toHaveTextContent(
      'Create expense dialog'
    );

    expect(
      screen.getByRole('button', { name: 'Edit Coffee beans' })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit Rent' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit Coffee beans' }));
    expect(screen.getByRole('dialog')).toHaveTextContent(
      'Edit Coffee beans expense'
    );
  });

  it('does not render unavailable filter controls', () => {
    renderTransactions();

    expect(
      screen.queryByRole('button', { name: 'Filters' })
    ).not.toBeInTheDocument();
  });

  it('exposes named pagination controls', async () => {
    const user = userEvent.setup();
    mockApi.currentPage = 2;
    mockApi.pages = 3;

    renderTransactions();

    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(mockApi.goToPage).toHaveBeenCalledWith(1);

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(mockApi.goToPage).toHaveBeenCalledWith(3);
  });

  it('exposes disabled pagination states at page boundaries', async () => {
    const user = userEvent.setup();
    mockApi.currentPage = 1;
    mockApi.pages = 3;

    const { unmount } = renderTransactions();

    const previousPageButton = screen.getByRole('button', {
      name: 'Previous page',
    });
    const nextPageButton = screen.getByRole('button', { name: 'Next page' });

    expect(previousPageButton).toBeDisabled();
    expect(nextPageButton).toBeEnabled();

    await user.click(previousPageButton);
    expect(mockApi.goToPage).not.toHaveBeenCalled();

    unmount();
    vi.clearAllMocks();
    mockApi.currentPage = 3;

    renderTransactions();

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('applies a recurring-only filter from the transactions URL', () => {
    renderTransactions(['/transactions?recurring=true']);

    expect(mockApi.applyFilter).toHaveBeenCalledWith({ recurringOnly: true });
    expect(
      screen.getByRole('checkbox', { name: 'Recurring only' })
    ).toBeChecked();
  });

  it('combines recurring-only and search filters', async () => {
    const user = userEvent.setup();

    renderTransactions(['/transactions?recurring=true']);
    vi.clearAllMocks();

    await user.type(
      screen.getByRole('searchbox', { name: 'Search expenses' }),
      'cloud'
    );

    expect(mockApi.applyFilter).toHaveBeenLastCalledWith({
      recurringOnly: true,
      search: 'cloud',
    });
  });
});
