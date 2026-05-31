import { cn } from '../../../shared/utils/cn';

type TransactionsPaginationProps = {
  currentPage: number;
  hasExpenses: boolean;
  onGoToPage: (page: number) => void;
  pages: number;
};

export default function TransactionsPagination({
  currentPage,
  hasExpenses,
  onGoToPage,
  pages,
}: TransactionsPaginationProps) {
  if (!hasExpenses) {
    return null;
  }

  const isPreviousDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= pages;
  const paginationButtonClassName =
    'inline-flex items-center justify-center rounded-[10px] border-0 bg-app-accent px-4 py-2 text-app-text transition-colors hover:bg-app-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-green/40 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg disabled:cursor-not-allowed disabled:bg-app-muted disabled:text-app-subtle disabled:hover:bg-app-muted disabled:hover:text-app-subtle dark:disabled:bg-app-dark-muted dark:disabled:text-slate-400 dark:focus-visible:ring-offset-app-dark-bg';

  return (
    <nav
      aria-label='Transactions pagination'
      className='mt-4 flex items-center justify-center gap-2 text-app-text dark:text-slate-50'
    >
      <button
        aria-label='Previous page'
        className={paginationButtonClassName}
        disabled={isPreviousDisabled}
        onClick={() => onGoToPage(currentPage - 1)}
        type='button'
      >
        <svg
          aria-hidden='true'
          className='h-4 w-4 rotate-180 fill-current'
        >
          <use href='/icons/chevron-icon.svg#Layer_1'></use>
        </svg>
      </button>
      {pages > 1 && (
        <span className='min-w-20 text-center text-sm font-medium'>
          Page {currentPage}/{pages}
        </span>
      )}
      <button
        aria-label='Next page'
        className={cn(paginationButtonClassName, 'disabled:opacity-70')}
        disabled={isNextDisabled}
        onClick={() => onGoToPage(currentPage + 1)}
        type='button'
      >
        <svg
          aria-hidden='true'
          className='h-4 w-4 fill-current'
        >
          <use href='/icons/chevron-icon.svg#Layer_1'></use>
        </svg>
      </button>
    </nav>
  );
}
