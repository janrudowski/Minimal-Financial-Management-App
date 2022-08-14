import React from 'react';
import TopBar from '../TopBar/TopBar';
import { useAPI } from '../../contexts/APIContext';
import { formatDate } from '../../utils/formatDate';
import Spinner from '../Spinner/Spinner';
import './dashboard.css';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
  const {
    recentExpenses,
    recurringExpenses,
    chartExpenses,
    changeChart,
    totalSpending,
    monthlySpending,
    dailySpending,
    loading,
    expenses,
  } = useAPI();

  const chartData = chartExpenses
    .map((expense) => {
      return { amount: expense.amount, date: formatDate(expense.date.seconds) };
    })
    .reverse();

  const recentExpensesRows = recentExpenses.map((el) => {
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
        <td className='expenses-table-amount-column'>
          ${el.amount.toFixed(2)}
        </td>
        <td>{formatDate(el.date.seconds)}</td>
      </tr>
    );
  });

  const recentRecurringExpenses = recurringExpenses.slice(0, 3);

  const recentRecurringExpensesRows = recentRecurringExpenses.map((el) => {
    return (
      <div key={el.id} className='reccuring-expense'>
        <img src='/images/netflix.png' alt='business' />
        <div className='reccuring-expense-title-container'>
          <p className='expenses-table-name-column-title'>{el.name}</p>
          <p className='expenses-table-name-column-subtitle'>{el.business}</p>
        </div>
        <div className='expenses-table-amount-column'>
          ${el.amount.toFixed(2)}
        </div>
      </div>
    );
  });

  function handleChartChange(event) {
    const { value: days } = event.target;
    changeChart(days);
  }

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
                <h4 className='dashboard-spending-card-main-price'>
                  {' '}
                  {loading ? (
                    <Spinner width='1.2rem' height='1.2rem' />
                  ) : (
                    `$${monthlySpending}`
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
                  Daily spending
                </p>
                <h4 className='dashboard-spending-card-main-price'>
                  {' '}
                  {loading ? (
                    <Spinner width='1.2rem' height='1.2rem' />
                  ) : (
                    `$${dailySpending}`
                  )}
                </h4>
              </div>
            </div>
          </div>
          <div className='chart-container'>
            <div className='chart-container-header'>
              <h3>Expenses</h3>
              {/* //todo: handleChartRange */}
              <select onChange={handleChartChange}>
                <option value={7}>7 days</option>
                <option value={30}>Month</option>
                <option value={-1}>All time</option>
              </select>
            </div>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray='0' horizontal={false} />
                <XAxis dataKey='date' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='amount'
                  stroke='#8884d8'
                  activeDot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
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
            {recentRecurringExpensesRows}
          </div>
        </div>
      </div>
    </main>
  );
}
