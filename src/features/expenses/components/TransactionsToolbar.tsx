import type { ChangeEventHandler } from 'react';

type TransactionsToolbarProps = {
  searchValue: string;
  onCreateExpense: () => void;
  onSearchChange: ChangeEventHandler<HTMLInputElement>;
};

export default function TransactionsToolbar({
  searchValue,
  onCreateExpense,
  onSearchChange,
}: TransactionsToolbarProps) {
  return (
    <div className='transactions-search-row'>
      <div className='transactions-search-container'>
        <svg
          aria-hidden='true'
          className='transactions-search-icon'
        >
          <use href='/icons/search-icon.svg#Capa_1'></use>
        </svg>
        <input
          type='search'
          aria-label='Search expenses'
          placeholder='Search anything on Transactions'
          onChange={onSearchChange}
          value={searchValue}
        />
      </div>
      <button
        className='transactions-create-expense-button'
        onClick={onCreateExpense}
        type='button'
      >
        <svg
          aria-hidden='true'
          className='transactions-icon'
        >
          <use href='/icons/hamburger-icon.svg#Layer_1'></use>
        </svg>
        Create Expense
      </button>
      <button
        className='transactions-filters-button'
        type='button'
      >
        <svg
          aria-hidden='true'
          className='transactions-icon'
        >
          <use href='/icons/filter-icon.svg#Layer_1'></use>
        </svg>
        Filters
      </button>
    </div>
  );
}
