import React from 'react';
import './dashboard.css';

export default function Dashboard() {
  return (
    <main>
      <div className='main-container'>
        <div className='column column-two'>
          <h2 className='dashboard-title'>Dashboard</h2>
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
                  $5240.21
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
              <a href='#' className='expenses-view-all'>
                View All{' '}
                <svg className='expenses-view-all-icon'>
                  <use href='/icons/chevron-icon.svg#Layer_1'></use>
                </svg>
              </a>
            </div>
            <table className='expenses-table'>
              <thead>
                <th>Name/Business</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </thead>
              <tbody>
                <tr>
                  <td className='expenses-table-name-column'>
                    <img src='/images/apple.png' alt='business' />
                    <div className='expenses-table-name-column-title-container'>
                      <p className='expenses-table-name-column-title'>
                        Iphone 13 Pro MAX
                      </p>
                      <p className='expenses-table-name-column-subtitle'>
                        Apple. Inc
                      </p>
                    </div>
                  </td>
                  <td>Mobile</td>
                  <td className='expenses-table-amount-column'>$420.84</td>
                  <td>14 Apr 2022</td>
                </tr>
                <tr>
                  <td className='expenses-table-name-column'>
                    <img src='/images/netflix.png' alt='business' />
                    <div className='expenses-table-name-column-title-container'>
                      <p className='expenses-table-name-column-title'>
                        Netflix Subscription
                      </p>
                      <p className='expenses-table-name-column-subtitle'>
                        Netflix
                      </p>
                    </div>
                  </td>
                  <td>Entertainment</td>
                  <td className='expenses-table-amount-column'>$100.00</td>
                  <td>05 Apr 2022</td>
                </tr>
                <tr>
                  <td className='expenses-table-name-column'>
                    <img src='/images/figma.png' alt='business' />
                    <div className='expenses-table-name-column-title-container'>
                      <p className='expenses-table-name-column-title'>
                        Figma Subscription
                      </p>
                      <p className='expenses-table-name-column-subtitle'>
                        Figma. Inc
                      </p>
                    </div>
                  </td>
                  <td>Software</td>
                  <td className='expenses-table-amount-column'>$244.20</td>
                  <td>02 Apr 2022</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className='column-one'>
          <div className='dashboard-profile'>
            <div className='profile-picture-container'>
              <img src='/images/profile-picture.jpg' alt='profile picture' />
            </div>
            <p className='dashboard-profile-name'>Mahfuzul Nabil</p>
            <img
              className='dashboard-profile-chevron'
              src='/icons/chevron-icon.svg'
              alt='chevron down'
            />
          </div>
          <div className='recurring-expenses-container'>
            <div className='expenses-header'>
              <h3 className='expenses-title'>Recurring Expenses</h3>
              <a href='#' className='expenses-view-all'>
                View All{' '}
                <svg className='expenses-view-all-icon'>
                  <use href='/icons/chevron-icon.svg#Layer_1'></use>
                </svg>
              </a>
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
