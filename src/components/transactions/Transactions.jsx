import React, { useEffect, useState } from 'react';
import { useAPI } from '../../contexts/APIContext';
import Spinner from '../Spinner/Spinner';
import TopBar from '../TopBar/TopBar';
import { formatDate } from '../../utils/formatDate';
import CreateExpense from '../Modals/CreateExpense';
import EditExpense from '../Modals/EditExpense';
import './transactions.css';

export default function Transactions() {
  const {
    currentPageExpenses,
    currentPage,
    pages,
    loading,
    goToPage,
    applyFilter,
  } = useAPI();
  const [createExpenseVisible, setCreateExpenseVisible] = useState(false);
  const [currentEdited, setCurrentEdited] = useState(null);
  const [editExpenseVisible, setEditExpenseVisible] = useState(false);

  function handleEdit(el) {
    setEditExpenseVisible(true);
    setCurrentEdited(el);
  }

  function handleSearch(event) {
    applyFilter({ type: 'search', value: event.target.value });
  }

  //todo: fix a bug when adding expense the search query remains the same (maybe add search query to reducer)

  const expensesRows = currentPageExpenses.map((el) => {
    return (
      <tr key={el.id}>
        <td className='expenses-table-name-column'>
          <svg className='expense-table-name-column-image'>
            <use href={`/icons/${el.type}.svg#Layer_1`}></use>
          </svg>
          <div className='expenses-table-name-column-title-container'>
            <p className='expenses-table-name-column-title'>{el.name}</p>
            <p className='expenses-table-name-column-subtitle'>{el.business}</p>
          </div>
        </td>
        <td>{el.type}</td>
        <td className='expenses-table-amount-column'>${el.amount}</td>
        <td>{formatDate(el.date.seconds)}</td>
        <td>{el.invoiceid}</td>
        <td>
          <button
            className='expenses-table-edit-button'
            onClick={() => handleEdit(el)}
          >
            Edit
          </button>
        </td>
      </tr>
    );
  });

  return (
    <main>
      <CreateExpense
        isVisible={createExpenseVisible}
        toggle={setCreateExpenseVisible}
      />
      {editExpenseVisible && (
        <EditExpense
          isVisible={editExpenseVisible}
          toggle={setEditExpenseVisible}
          currentEdited={currentEdited}
        />
      )}
      <div className='transactions-container'>
        <TopBar title='Expenses' />
        <div className='transactions-search-row'>
          <div className='transactions-search-container'>
            <svg className='transactions-search-icon'>
              <use href='/icons/search-icon.svg#Capa_1'></use>
            </svg>
            <input
              type='text'
              placeholder='Search anything on Transactions'
              onChange={handleSearch}
            />
          </div>
          <button
            className='transactions-create-expense-button'
            onClick={() => setCreateExpenseVisible(true)}
          >
            <svg className='transactions-icon'>
              <use href='/icons/hamburger-icon.svg#Layer_1'></use>
            </svg>
            Create Expense
          </button>
          <button className='transactions-filters-button'>
            <svg className='transactions-icon'>
              <use href='/icons/filter-icon.svg#Layer_1'></use>
            </svg>
            Filters
          </button>
        </div>
        <div className='transactions-expenses-table-container'>
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
            <tbody>{!loading && expensesRows}</tbody>
          </table>

          {loading && <Spinner marginTop='2em' />}

          <div className='transactions-expenses-table-navigation'>
            {expensesRows.length > 0 && !loading && currentPage !== 1 && (
              <button onClick={() => goToPage(currentPage - 1)}>
                <svg className='transactions-expenses-table-navigation-icon chevron-left'>
                  <use href='/icons/chevron-icon.svg#Layer_1'></use>
                </svg>
              </button>
            )}
            {expensesRows.length > 0 && pages > 1 && !loading && (
              <span>
                Page {currentPage}/{pages}
              </span>
            )}
            {expensesRows.length > 0 && !loading && currentPage !== pages && (
              <button onClick={() => goToPage(currentPage + 1)}>
                <svg className='transactions-expenses-table-navigation-icon chevron-right'>
                  <use href='/icons/chevron-icon.svg#Layer_1'></use>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
