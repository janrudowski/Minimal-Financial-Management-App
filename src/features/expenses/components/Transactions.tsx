import { type ChangeEvent, useEffect, useState } from 'react';
import Spinner from '../../../shared/components/Spinner/Spinner';
import TopBar from '../../../shared/components/TopBar/TopBar';
import { useAPI } from '../context/ExpensesContext';
import type { Expense } from '../types';
import CreateExpense from './CreateExpense';
import EditExpense from './EditExpense';
import TransactionsPagination from './TransactionsPagination';
import TransactionsTable from './TransactionsTable';
import TransactionsToolbar from './TransactionsToolbar';
import './transactions.css';

export default function Transactions() {
  const {
    currentPageExpenses,
    currentPage,
    pages,
    loading,
    goToPage,
    applyFilter,
    resetDisplayed,
  } = useAPI();
  const [createExpenseVisible, setCreateExpenseVisible] = useState(false);
  const [currentEdited, setCurrentEdited] = useState<Expense | null>(null);
  const [editExpenseVisible, setEditExpenseVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    return () => {
      resetDisplayed();
    };
  }, []);

  function handleEdit(el: Expense) {
    setCreateExpenseVisible(false);
    setEditExpenseVisible(true);
    setCurrentEdited(el);
  }

  function handleCreateExpense() {
    setEditExpenseVisible(false);
    setCurrentEdited(null);
    setCreateExpenseVisible(true);
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setSearchInput(value);
    applyFilter({ type: 'search', value: value });
  }

  const hasCurrentPageExpenses = currentPageExpenses.length > 0;

  return (
    <main>
      <CreateExpense
        isVisible={createExpenseVisible}
        toggle={setCreateExpenseVisible}
        clearSearch={setSearchInput}
      />
      {editExpenseVisible && currentEdited && (
        <EditExpense
          isVisible={editExpenseVisible}
          toggle={setEditExpenseVisible}
          currentEdited={currentEdited}
          clearSearch={setSearchInput}
        />
      )}
      <div className='transactions-container'>
        <TopBar title='Expenses' />
        <TransactionsToolbar
          searchValue={searchInput}
          onCreateExpense={handleCreateExpense}
          onSearchChange={handleSearch}
        />
        <div className='transactions-expenses-table-container'>
          {!loading && (
            <TransactionsTable
              expenses={currentPageExpenses}
              onEditExpense={handleEdit}
            />
          )}

          {loading && <Spinner marginTop='2em' />}

          {!loading && (
            <TransactionsPagination
              currentPage={currentPage}
              hasExpenses={hasCurrentPageExpenses}
              onGoToPage={goToPage}
              pages={pages}
            />
          )}
        </div>
      </div>
    </main>
  );
}
