import type { ChangeEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Spinner from '../../../shared/components/Spinner/Spinner';
import TopBar from '../../../shared/components/TopBar/TopBar';
import { cn } from '../../../shared/utils/cn';
import { formatDate } from '../../../shared/utils/date';
import { useAuth } from '../../auth/context/AuthContext';
import { useAPI } from '../../expenses/context/ExpensesContext';
import type { Expense } from '../../expenses/types';

type SpendingCardProps = {
  iconClassName?: string;
  isPrimary?: boolean;
  label: string;
  loading: boolean;
  value: string;
};

function SpendingCard({
  iconClassName,
  isPrimary = false,
  label,
  loading,
  value,
}: SpendingCardProps) {
  return (
    <section
      aria-label={label}
      className={cn(
        'flex min-h-32 items-center gap-4 rounded-lg border border-app-border bg-app-surface p-5 shadow-sm transition-colors dark:border-app-dark-border dark:bg-app-dark-surface',
        isPrimary && 'border-app-text bg-app-text text-slate-50 dark:bg-slate-900'
      )}
    >
      <span
        aria-hidden='true'
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-full bg-app-muted text-app-text dark:bg-app-dark-muted dark:text-slate-50',
          isPrimary && 'bg-slate-700 text-app-accent'
        )}
      >
        <svg className={cn('size-5 fill-current', iconClassName)}>
          <use href='/icons/wallet-icon.svg#Capa_1' />
        </svg>
      </span>
      <div>
        <p
          className={cn(
            'mb-2 text-sm font-medium text-app-subtle dark:text-slate-300',
            isPrimary && 'text-slate-300'
          )}
        >
          {label}
        </p>
        <div className='text-xl font-semibold' aria-live='polite'>
          {loading ? <Spinner width='1.2rem' height='1.2rem' /> : `$${value}`}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  children,
  titleId,
  to = '/transactions',
  viewAllLabel,
}: {
  children: ReactNode;
  titleId?: string;
  to?: string;
  viewAllLabel: string;
}) {
  return (
    <div className='mb-6 flex items-center gap-4'>
      <h3 className='mr-auto text-lg font-semibold' id={titleId}>
        {children}
      </h3>
      <Link
        to={to}
        className='inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-semibold text-app-green outline-none transition hover:text-app-text focus-visible:ring-2 focus-visible:ring-app-green focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg dark:focus-visible:ring-offset-app-dark-bg'
        aria-label={viewAllLabel}
      >
        View All
        <svg aria-hidden='true' className='size-3 fill-current'>
          <use href='/icons/chevron-icon.svg#Layer_1' />
        </svg>
      </Link>
    </div>
  );
}

function RecentExpenseRow({ expense }: { expense: Expense }) {
  const mobileLabelClassName =
    "before:text-xs before:font-semibold before:uppercase before:text-app-subtle before:content-[attr(data-label)] md:before:hidden dark:before:text-slate-400";
  const cellClassName = cn(
    'flex items-center justify-between gap-4 border-t border-app-border py-3 text-right text-sm font-medium text-app-subtle md:table-cell md:border-t-0 md:px-4 md:py-4 md:text-center dark:border-app-dark-border dark:text-slate-300',
    mobileLabelClassName
  );

  return (
    <tr className='block rounded-lg border border-app-border bg-app-surface p-4 shadow-sm md:table-row md:rounded-none md:border-t md:border-x-0 md:border-b-0 md:bg-transparent md:p-0 md:shadow-none dark:border-app-dark-border md:dark:bg-transparent'>
      <td className='block pb-3 text-left md:table-cell md:py-4 md:pr-4'>
        <div className='flex items-center gap-3'>
          <span className='flex size-10 shrink-0 items-center justify-center rounded-md bg-sky-50 p-1.5 dark:bg-slate-800'>
            <svg aria-hidden='true' className='size-7'>
              <use href={`/icons/${expense.type}.svg#Layer_1`} />
            </svg>
          </span>
          <div className='min-w-0 text-left'>
            <p className='truncate font-medium text-app-text dark:text-slate-50'>
              {expense.name}
            </p>
            <p className='truncate text-sm text-app-subtle dark:text-slate-300'>
              {expense.business}
            </p>
          </div>
        </div>
      </td>
      <td className={cellClassName} data-label='Type'>
        <span className='sr-only'>Type: </span>
        {expense.type}
      </td>
      <td
        className={cn(cellClassName, 'font-semibold text-app-text dark:text-slate-50')}
        data-label='Amount'
      >
        <span className='sr-only'>Amount: </span>
        ${expense.amount.toFixed(2)}
      </td>
      <td className={cellClassName} data-label='Date'>
        <span className='sr-only'>Date: </span>
        {formatDate(expense.date.seconds)}
      </td>
    </tr>
  );
}

function RecurringExpenseItem({ expense }: { expense: Expense }) {
  return (
    <li className='flex items-center gap-4 border-b border-app-border py-4 last:border-b-0 dark:border-app-dark-border'>
      <img
        className='size-10 rounded-md object-cover'
        src='/images/netflix.png'
        alt=''
      />
      <div className='min-w-0 flex-1'>
        <p className='truncate font-medium text-app-text dark:text-slate-50'>
          {expense.name}
        </p>
        <p className='truncate text-sm text-app-subtle dark:text-slate-300'>
          {expense.business}
        </p>
      </div>
      <p className='font-semibold text-app-text dark:text-slate-50'>
        ${expense.amount.toFixed(2)}
      </p>
    </li>
  );
}

export default function Dashboard() {
  const { currentUser } = useAuth();
  const {
    recentExpenses,
    recurringExpenses,
    chartExpenses,
    changeChart,
    totalSpending,
    monthlySpending,
    dailySpending,
    loading,
  } = useAPI();

  const chartData = chartExpenses
    .map((expense) => {
      return { amount: expense.amount, date: formatDate(expense.date.seconds) };
    })
    .reverse();

  function handleChartChange(event: ChangeEvent<HTMLSelectElement>) {
    changeChart(Number(event.target.value));
  }

  return (
    <main className='min-h-[calc(100vh-4rem)] flex-1 overflow-x-hidden bg-app-bg transition-colors lg:min-h-screen dark:bg-app-dark-bg'>
      <div className='mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:py-8'>
        <TopBar
          title='Dashboard'
          profile={currentUser}
          profileLoading={loading}
        />
        <div className='grid gap-6 lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)]'>
          <div className='min-w-0 space-y-8'>
            <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
              <SpendingCard
                isPrimary
                label='Total spending'
                loading={loading}
                value={totalSpending}
              />
              <SpendingCard
                label='Monthly spending'
                loading={loading}
                value={monthlySpending}
              />
              <SpendingCard
                label='Daily spending'
                loading={loading}
                value={dailySpending}
              />
            </div>

            <section
              aria-labelledby='dashboard-chart-title'
              className='min-h-[22rem] rounded-lg border border-app-border bg-app-surface p-4 shadow-sm dark:border-app-dark-border dark:bg-app-dark-surface'
            >
              <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <h3 id='dashboard-chart-title' className='text-lg font-semibold'>
                  Expenses
                </h3>
                <label className='flex w-full flex-col gap-2 text-sm font-medium text-app-subtle sm:w-auto sm:flex-row sm:items-center dark:text-slate-300'>
                  Chart range
                  <select
                    className='min-h-11 w-full rounded-md border border-app-border bg-app-surface px-3 text-app-text outline-none transition focus-visible:ring-2 focus-visible:ring-app-green focus-visible:ring-offset-2 focus-visible:ring-offset-app-surface sm:w-auto dark:border-app-dark-border dark:bg-app-dark-muted dark:text-slate-50 dark:focus-visible:ring-offset-app-dark-surface'
                    onChange={handleChartChange}
                  >
                    <option value={7}>7 days</option>
                    <option value={30}>Month</option>
                    <option value={-1}>All time</option>
                  </select>
                </label>
              </div>
              <div className='h-72 min-w-0'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray='0' horizontal={false} />
                    <XAxis dataKey='date' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey='amount'
                      stroke='oklch(0.63 0.14 158)'
                      activeDot={{ r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section
              aria-labelledby='dashboard-recent-expenses-title'
              className='rounded-lg border border-app-border bg-app-surface p-4 shadow-sm dark:border-app-dark-border dark:bg-app-dark-surface'
            >
              <SectionHeader
                titleId='dashboard-recent-expenses-title'
                viewAllLabel='View all recent expenses'
              >
                Recent Expenses
              </SectionHeader>
              <div>
                <table className='w-full border-separate border-spacing-y-3 text-sm md:border-collapse md:border-spacing-y-0'>
                  <thead className='hidden md:table-header-group'>
                    <tr>
                      <th className='pb-3 pr-4 text-left text-xs font-semibold uppercase text-app-subtle dark:text-slate-300'>
                        Name/Business
                      </th>
                      <th className='px-4 pb-3 text-center text-xs font-semibold uppercase text-app-subtle dark:text-slate-300'>
                        Type
                      </th>
                      <th className='px-4 pb-3 text-center text-xs font-semibold uppercase text-app-subtle dark:text-slate-300'>
                        Amount
                      </th>
                      <th className='pl-4 pb-3 text-center text-xs font-semibold uppercase text-app-subtle dark:text-slate-300'>
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading &&
                      recentExpenses.map((expense) => (
                        <RecentExpenseRow key={expense.id} expense={expense} />
                      ))}
                  </tbody>
                </table>
              </div>
              {loading && <Spinner marginTop='2em' />}
            </section>
          </div>

          <aside className='min-w-0'>
            <section className='rounded-lg border border-app-border bg-app-surface p-4 shadow-sm dark:border-app-dark-border dark:bg-app-dark-surface'>
              <SectionHeader
                to='/transactions?recurring=true'
                viewAllLabel='View all recurring expenses'
              >
                Recurring Expenses
              </SectionHeader>
              <ul>
                {recurringExpenses.slice(0, 3).map((expense) => (
                  <RecurringExpenseItem key={expense.id} expense={expense} />
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
