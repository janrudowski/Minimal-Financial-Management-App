import type { ChangeEventHandler } from 'react';

type TransactionsToolbarProps = {
  recurringOnly: boolean;
  searchValue: string;
  onCreateExpense: () => void;
  onRecurringOnlyChange: ChangeEventHandler<HTMLInputElement>;
  onSearchChange: ChangeEventHandler<HTMLInputElement>;
};

export default function TransactionsToolbar({
  recurringOnly,
  searchValue,
  onCreateExpense,
  onRecurringOnlyChange,
  onSearchChange,
}: TransactionsToolbarProps) {
  return (
    <div className='mt-8 flex w-full flex-col gap-4 sm:flex-row sm:items-center'>
      <div className='flex w-full items-center rounded-2xl bg-app-muted px-4 py-2.5 text-app-text sm:mr-auto sm:w-[30%] sm:min-w-72 dark:bg-app-dark-muted dark:text-slate-50'>
        <svg
          aria-hidden='true'
          className='mr-3 h-5 w-5 shrink-0 fill-current'
        >
          <use href='/icons/search-icon.svg#Capa_1'></use>
        </svg>
        <label
          className='sr-only'
          htmlFor='transactions-search'
        >
          Search expenses
        </label>
        <input
          id='transactions-search'
          type='search'
          placeholder='Search anything on Transactions'
          onChange={onSearchChange}
          value={searchValue}
          className='w-full border-0 bg-transparent text-sm text-app-text outline-none placeholder:text-app-subtle focus-visible:outline-none dark:text-slate-50 dark:placeholder:text-slate-400'
        />
      </div>
      <label className='inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-app-border bg-app-surface px-4 py-2 text-sm font-semibold text-app-text transition-colors hover:bg-app-muted sm:w-auto dark:border-app-dark-border dark:bg-app-dark-surface dark:text-slate-50 dark:hover:bg-app-dark-muted'>
        <input
          checked={recurringOnly}
          className='h-4 w-4 accent-app-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent'
          onChange={onRecurringOnlyChange}
          type='checkbox'
        />
        Recurring only
      </label>
      <button
        className='inline-flex min-h-11 w-full items-center justify-center rounded-[10px] border-0 bg-app-accent px-4 py-2 text-sm font-semibold text-app-text transition-colors hover:bg-app-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-green/40 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg sm:w-auto dark:focus-visible:ring-offset-app-dark-bg'
        onClick={onCreateExpense}
        type='button'
      >
        <svg
          aria-hidden='true'
          className='mr-2 h-6 w-6 fill-current'
        >
          <use href='/icons/hamburger-icon.svg#Layer_1'></use>
        </svg>
        Create Expense
      </button>
    </div>
  );
}
