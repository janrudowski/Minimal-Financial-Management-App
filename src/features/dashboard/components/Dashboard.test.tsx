import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Expense } from '../../expenses/types';
import Dashboard from './Dashboard';

const mockApi = vi.hoisted(() => ({
  changeChart: vi.fn(),
  chartExpenses: [] as Expense[],
  dailySpending: '12.00',
  expenses: [] as Expense[],
  loading: false,
  monthlySpending: '120.00',
  recentExpenses: [] as Expense[],
  recurringExpenses: [] as Expense[],
  totalSpending: '240.00',
}));

vi.mock('../../expenses/context/ExpensesContext', () => ({
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

vi.mock('recharts', () => {
  function ChartContainer({ children }: { children?: ReactNode }) {
    return <div>{children}</div>;
  }

  function ChartLeaf() {
    return null;
  }

  return {
    CartesianGrid: ChartLeaf,
    Legend: ChartLeaf,
    Line: ChartLeaf,
    LineChart: ChartContainer,
    ResponsiveContainer: ChartContainer,
    Tooltip: ChartLeaf,
    XAxis: ChartLeaf,
    YAxis: ChartLeaf,
  };
});

vi.mock('../../../shared/components/TopBar/TopBar', () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
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

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApi.changeChart.mockReset();
    mockApi.chartExpenses = [expense()];
    mockApi.dailySpending = '12.00';
    mockApi.expenses = [expense()];
    mockApi.loading = false;
    mockApi.monthlySpending = '120.00';
    mockApi.recentExpenses = [expense({ name: 'Coffee beans' })];
    mockApi.recurringExpenses = [
      expense({ id: 'subscription', name: 'Streaming', recurring: true }),
    ];
    mockApi.totalSpending = '240.00';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders spending summaries and expense sections', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText('Total spending')).toBeInTheDocument();
    expect(screen.getByText('$240.00')).toBeInTheDocument();
    expect(screen.getByText('Monthly spending')).toBeInTheDocument();
    expect(screen.getByText('$120.00')).toBeInTheDocument();
    expect(screen.getByText('Daily spending')).toBeInTheDocument();
    expect(screen.getByText('$12.00')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Recent Expenses' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Recurring Expenses' })
    ).toBeInTheDocument();
  });

  it('links the recurring expenses section to a recurring-only transactions view', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: 'View all recurring expenses' })
    ).toHaveAttribute('href', '/transactions?recurring=true');
  });

  it('lets the recent expenses table reflow on mobile without fixed mobile width', () => {
    const { container } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const recentTable = container.querySelector(
      '[aria-labelledby="dashboard-recent-expenses-title"] table'
    );

    expect(recentTable).toBeInTheDocument();
    expect(recentTable).not.toHaveClass('min-w-[38rem]');
    expect(recentTable).not.toHaveClass('sm:min-w-[42rem]');
    expect(
      container.querySelector(
        '[aria-labelledby="dashboard-recent-expenses-title"] tbody tr[class*="block"]'
      )
    ).toBeInTheDocument();
    expect(
      container.querySelector(
        '[aria-labelledby="dashboard-recent-expenses-title"] td[data-label="Amount"]'
      )
    ).toHaveTextContent('$10.00');
  });

  it('changes the chart range with a number value from a labelled select', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Chart range' }),
      '30'
    );

    expect(mockApi.changeChart).toHaveBeenCalledWith(30);
  });

  it('renders loading spending cards without invalid paragraph nesting', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    mockApi.loading = true;

    const { container } = render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(container.querySelector('p > div')).toBeNull();
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('validateDOMNesting'),
      expect.anything(),
      expect.anything()
    );
  });
});
