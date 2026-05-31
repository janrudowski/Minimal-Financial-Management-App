import { cn } from '../../../shared/utils/cn';
import { formatExpenseDisplayDate } from '../model/expenseDate';
import type { Expense } from '../types';

type TransactionsTableProps = {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
};

export default function TransactionsTable({
  expenses,
  onEditExpense,
}: TransactionsTableProps) {
  const headerClassName =
    'px-3 pb-4 text-center text-xs font-semibold uppercase text-app-subtle dark:text-slate-300';
  const rowClassName =
    'block rounded-lg border border-app-border bg-app-surface p-4 shadow-sm md:table-row md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none dark:border-app-dark-border dark:bg-app-dark-surface md:dark:bg-transparent';
  const mobileLabelClassName =
    "before:text-xs before:font-semibold before:uppercase before:text-app-subtle before:content-[attr(data-label)] md:before:hidden dark:before:text-slate-400";
  const cellClassName = cn(
    'flex items-center justify-between gap-4 border-t border-app-border py-3 text-right font-medium text-app-subtle md:table-cell md:border-t-0 md:px-3 md:py-4 md:text-center dark:border-app-dark-border dark:text-slate-300',
    mobileLabelClassName
  );

  return (
    <table className='w-full border-separate border-spacing-y-3 text-sm md:border-collapse md:border-spacing-y-0'>
      <thead className='hidden md:table-header-group'>
        <tr>
          <th className={cn(headerClassName, 'text-left')}>Name/Business</th>
          <th className={headerClassName}>Type</th>
          <th className={headerClassName}>Amount</th>
          <th className={headerClassName}>Date</th>
          <th className={headerClassName}>Invoice Id</th>
          <th className={headerClassName}>Action</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr
            className={rowClassName}
            key={expense.id}
          >
            <td className='block pb-3 text-left md:table-cell md:px-3 md:py-4'>
              <div className='flex items-center gap-3'>
                <svg
                  aria-hidden='true'
                  className='h-9 w-9 shrink-0 fill-app-green'
                >
                  <use href={`/icons/${expense.type}.svg#Layer_1`}></use>
                </svg>
                <div>
                  <p className='font-semibold text-app-text dark:text-slate-50'>
                    {expense.name}
                  </p>
                  <p className='mt-1 text-xs text-app-subtle dark:text-slate-400'>
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
              className={cn(cellClassName, 'text-app-text dark:text-slate-50')}
              data-label='Amount'
            >
              <span className='sr-only'>Amount: </span>
              ${expense.amount.toFixed(2)}
            </td>
            <td className={cellClassName} data-label='Date'>
              <span className='sr-only'>Date: </span>
              {formatExpenseDisplayDate(expense.date)}
            </td>
            <td className={cellClassName} data-label='Invoice Id'>
              <span className='sr-only'>Invoice Id: </span>
              {expense.invoiceid}
            </td>
            <td className={cellClassName} data-label='Action'>
              <button
                aria-label={`Edit ${expense.name}`}
                className='rounded-md border-0 bg-app-accent px-5 py-2 text-xs font-semibold text-app-text transition-colors hover:bg-app-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-green/40 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg dark:focus-visible:ring-offset-app-dark-bg'
                onClick={() => onEditExpense(expense)}
                type='button'
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
