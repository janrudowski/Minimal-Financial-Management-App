import { type ChangeEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../../../shared/components/Spinner/Spinner';
import TopBar from '../../../shared/components/TopBar/TopBar';
import { useAuth } from '../../auth/context/AuthContext';
import { useAPI } from '../context/ExpensesContext';
import type { Expense, ExpenseFilter } from '../types';
import CreateExpense from './CreateExpense';
import EditExpense from './EditExpense';
import TransactionsPagination from './TransactionsPagination';
import TransactionsTable from './TransactionsTable';
import TransactionsToolbar from './TransactionsToolbar';

function createExpenseFilter(
  searchValue: string,
  recurringOnly: boolean
): ExpenseFilter | null {
  const search = searchValue.trim();

  if (!search && !recurringOnly) {
    return null;
  }

  return {
    ...(search ? { search } : {}),
    ...(recurringOnly ? { recurringOnly: true } : {}),
  };
}

export default function Transactions() {
  const { currentUser } = useAuth();
  const {
    currentPageExpenses,
    currentPage,
    pages,
    loading,
    goToPage,
    applyFilter,
    resetDisplayed,
  } = useAPI();
  const [searchParams, setSearchParams] = useSearchParams();
  const [createExpenseVisible, setCreateExpenseVisible] = useState(false);
  const [currentEdited, setCurrentEdited] = useState<Expense | null>(null);
  const [editExpenseVisible, setEditExpenseVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [recurringOnly, setRecurringOnly] = useState(
    () => searchParams.get('recurring') === 'true'
  );

  useEffect(() => {
    const initialFilter = createExpenseFilter(searchInput, recurringOnly);

    if (initialFilter) {
      applyFilter(initialFilter);
    }

    return () => {
      resetDisplayed();
    };
  }, []);

  function applyCurrentFilter(nextSearch: string, nextRecurringOnly: boolean) {
    applyFilter(createExpenseFilter(nextSearch, nextRecurringOnly));
  }

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
    applyCurrentFilter(value, recurringOnly);
  }

  function handleRecurringOnlyChange(event: ChangeEvent<HTMLInputElement>) {
    const nextRecurringOnly = event.target.checked;
    const nextSearchParams = new URLSearchParams(searchParams);

    setRecurringOnly(nextRecurringOnly);
    applyCurrentFilter(searchInput, nextRecurringOnly);

    if (nextRecurringOnly) {
      nextSearchParams.set('recurring', 'true');
    } else {
      nextSearchParams.delete('recurring');
    }

    setSearchParams(nextSearchParams, { replace: true });
  }

  const hasCurrentPageExpenses = currentPageExpenses.length > 0;

  return (
    <main className='min-h-[calc(100vh-4rem)] flex-1 overflow-x-hidden bg-app-bg transition-colors lg:min-h-screen dark:bg-app-dark-bg'>
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
      <div className='mx-auto flex w-full max-w-[1500px] flex-col px-4 py-6 sm:px-6 lg:py-8'>
        <TopBar
          title='Expenses'
          profile={currentUser}
          profileLoading={loading}
        />
        <TransactionsToolbar
          recurringOnly={recurringOnly}
          searchValue={searchInput}
          onCreateExpense={handleCreateExpense}
          onRecurringOnlyChange={handleRecurringOnlyChange}
          onSearchChange={handleSearch}
        />
        <div className='mt-8 overflow-x-auto border-t border-app-border py-8 dark:border-app-dark-border'>
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
