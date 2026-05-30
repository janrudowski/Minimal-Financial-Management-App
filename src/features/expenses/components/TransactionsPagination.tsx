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

  return (
    <div className='transactions-expenses-table-navigation'>
      {currentPage !== 1 && (
        <button
          aria-label='Previous page'
          onClick={() => onGoToPage(currentPage - 1)}
          type='button'
        >
          <svg
            aria-hidden='true'
            className='transactions-expenses-table-navigation-icon chevron-left'
          >
            <use href='/icons/chevron-icon.svg#Layer_1'></use>
          </svg>
        </button>
      )}
      {pages > 1 && (
        <span>
          Page {currentPage}/{pages}
        </span>
      )}
      {currentPage !== pages && (
        <button
          aria-label='Next page'
          onClick={() => onGoToPage(currentPage + 1)}
          type='button'
        >
          <svg
            aria-hidden='true'
            className='transactions-expenses-table-navigation-icon chevron-right'
          >
            <use href='/icons/chevron-icon.svg#Layer_1'></use>
          </svg>
        </button>
      )}
    </div>
  );
}
