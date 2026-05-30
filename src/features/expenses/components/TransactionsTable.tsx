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
  return (
    <table className='transactions-expenses-table'>
      <thead>
        <tr>
          <th>Name/Business</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Invoice Id</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td className='expenses-table-name-column'>
              <svg
                aria-hidden='true'
                className='expense-table-name-column-image'
              >
                <use href={`/icons/${expense.type}.svg#Layer_1`}></use>
              </svg>
              <div className='expenses-table-name-column-title-container'>
                <p className='expenses-table-name-column-title'>
                  {expense.name}
                </p>
                <p className='expenses-table-name-column-subtitle'>
                  {expense.business}
                </p>
              </div>
            </td>
            <td>{expense.type}</td>
            <td className='expenses-table-amount-column'>
              ${expense.amount.toFixed(2)}
            </td>
            <td>{formatExpenseDisplayDate(expense.date)}</td>
            <td>{expense.invoiceid}</td>
            <td>
              <button
                aria-label={`Edit ${expense.name}`}
                className='expenses-table-edit-button'
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
