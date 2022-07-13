import React from 'react';
import { useAPI } from '../../contexts/APIContext';
import Spinner from '../Spinner/Spinner';
import TopBar from '../TopBar/TopBar';
import { formatDate } from '../../utils/formatDate';
import './transactions.css';

export default function Transactions() {
  const { expenses, loading } = useAPI();
  const expensesRows = expenses.map((el) => {
    return (
      <tr key={el.id}>
        <td className='expenses-table-name-column'>
          <img src='/images/apple.png' alt='business' />
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
          <button className='expenses-table-edit-button'>Edit</button>
        </td>
      </tr>
    );
  });
  return (
    <main>
      <div className='transactions-container'>
        <TopBar title='Expenses' />
        <div className='transactions-search-row'>
          <div className='transactions-search-container'>
            <svg className='transactions-search-icon'>
              <use href='/icons/search-icon.svg#Capa_1'></use>
            </svg>
            <input type='text' placeholder='Search anything on Transactions' />
          </div>
          <button className='transactions-create-expense-button'>
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
        </div>
      </div>
    </main>
  );
}
