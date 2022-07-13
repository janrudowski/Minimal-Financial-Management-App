import React from 'react';
import TopBar from '../TopBar/TopBar';
import { useAPI } from '../../contexts/APIContext';
import { formatDate } from '../../utils/formatDate';
import Spinner from '../Spinner/Spinner';
import './dashboard.css';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { recentExpenses, totalSpending, loading } = useAPI();
  const recentExpensesRows = recentExpenses.map((el) => {
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
      </tr>
    );
  });
  return (
    <main>
      <div className='dashboard-container'>
        <TopBar title='Dashboard' />
        <div className='column column-two'>
          <div className='dashboard-spending-cards'>
            <div className='dashboard-spending-card dashboard-spending-card-first'>
              <div className='dashboard-spending-card-secondary dashboard-spending-card-secondary-first'>
                <svg className='dashboard-icon dashboard-icon-first'>
                  <use href='icons/wallet-icon.svg#Capa_1'></use>
                </svg>
              </div>
              <div className='dashboard-spending-card-main'>
                <p className='dashboard-spending-card-main-title dashboard-spending-card-main-title-first'>
                  Total spending
                </p>
                <h4 className='dashboard-spending-card-main-price dashboard-spending-card-main-price-first'>
                  {loading ? (
                    <Spinner width='1.2rem' height='1.2rem' />
                  ) : (
                    `$${totalSpending}`
                  )}
                </h4>
              </div>
            </div>
            <div className='dashboard-spending-card'>
              <div className='dashboard-spending-card-secondary'>
                <svg className='dashboard-icon'>
                  <use href='icons/wallet-icon.svg#Capa_1'></use>
                </svg>
              </div>
              <div className='dashboard-spending-card-main'>
                <p className='dashboard-spending-card-main-title'>
                  Monthly spending
                </p>
                <h4 className='dashboard-spending-card-main-price'>$250.80</h4>
              </div>
            </div>
            <div className='dashboard-spending-card'>
              <div className='dashboard-spending-card-secondary'>
                <svg className='dashboard-icon'>
                  <use href='icons/wallet-icon.svg#Capa_1'></use>
                </svg>
              </div>
              <div className='dashboard-spending-card-main'>
                <p className='dashboard-spending-card-main-title'>
                  Daily spending
                </p>
                <h4 className='dashboard-spending-card-main-price'>$10.25</h4>
              </div>
            </div>
          </div>
          <div className='chart-container'>
            {/* todo: use recharts library and generate graph based on data */}
            <img src='/images/Graph.png' alt='graph' />
          </div>
          <div className='recent-expenses-container'>
            <div className='expenses-header'>
              <h3 className='expenses-title'>Recent Expenses</h3>
              <Link to='/transactions' className='expenses-view-all'>
                View All{' '}
                <svg className='expenses-view-all-icon'>
                  <use href='/icons/chevron-icon.svg#Layer_1'></use>
                </svg>
              </Link>
            </div>
            <table className='expenses-table'>
              <thead>
                <tr>
                  <th>Name/Business</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>{!loading && recentExpensesRows}</tbody>
            </table>
            {loading && <Spinner marginTop='2em' />}
          </div>
        </div>
        <div className='column column-one'>
          <div className='recurring-expenses-container'>
            <div className='expenses-header'>
              <h3 className='expenses-title'>Recurring Expenses</h3>
              <Link to='/transactions' className='expenses-view-all'>
                View All{' '}
                <svg className='expenses-view-all-icon'>
                  <use href='/icons/chevron-icon.svg#Layer_1'></use>
                </svg>
              </Link>
            </div>
            <div className='reccuring-expense'>
              <img src='/images/netflix.png' alt='business' />
              <div className='reccuring-expense-title-container'>
                <p className='expenses-table-name-column-title'>
                  Netflix Subscription
                </p>
                <p className='expenses-table-name-column-subtitle'>Netflix</p>
              </div>
              <div className='expenses-table-amount-column'>$132.00</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
