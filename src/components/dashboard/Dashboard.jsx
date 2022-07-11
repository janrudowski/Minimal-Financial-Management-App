import React from 'react';
import './dashboard.css';

export default function Dashboard() {
  return (
    <main>
      <div className='main-container'>
        <div className='column column-two'>
          <h2 className='dashboard-title'>Dashboard</h2>
          <div className='dashboard-spending-cards'>
            <div className='dashboard-spending-card'>
              <div className='dashboard-spending-secondary'>
                <svg className='svg'>
                  <use href='icons/wallet-icon.svg#Capa_1'></use>
                </svg>
              </div>
              <div className='dashboard-spending-main'>
                <p>Total spending</p>
                <h4>$5240.21</h4>
              </div>
            </div>
            <div className='dashboard-spending-card'>
              <div className='dashboard-spending-secondary'>
                <svg className='svg'>
                  <use href='icons/wallet-icon.svg#Capa_1'></use>
                </svg>
              </div>
              <div className='dashboard-spending-main'>
                <p>Total spending</p>
                <h4>$5240.21</h4>
              </div>
            </div>
            <div className='dashboard-spending-card'>
              <div className='dashboard-spending-secondary'>
                <svg className='svg'>
                  <use href='icons/wallet-icon.svg#Capa_1'></use>
                </svg>
              </div>
              <div className='dashboard-spending-main'>
                <p>Total spending</p>
                <h4>$5240.21</h4>
              </div>
            </div>
          </div>
          <div className='chart-container'></div>
          <div className='recent-expenses-container'>
            <h3 className='expenses-title'>Recent Expenses</h3>
            <a className='expenses-view-all'>View All {'>'}</a>
            <table>
              <thead>
                <th>Name/Business</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <img src='' alt='business' />
                    <div>
                      <p>Iphone 13 Pro MAX</p>
                      <p>Apple. Inc</p>
                    </div>
                  </td>
                  <td>Mobile</td>
                  <td>$420.84</td>
                  <td>14 Apr 2022</td>
                </tr>
                <tr>
                  <td>
                    <img src='' alt='business' />
                    <div>
                      <p>Netflix Subscription</p>
                      <p>Netflix</p>
                    </div>
                  </td>
                  <td>Entertainment</td>
                  <td>$100.00</td>
                  <td>05 Apr 2022</td>
                </tr>
                <tr>
                  <td>
                    <img src='' alt='business' />
                    <div>
                      <p>Figma Subscription</p>
                      <p>Figma. Inc</p>
                    </div>
                  </td>
                  <td>Software</td>
                  <td>$244.20</td>
                  <td>02 Apr 2022</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className='column-one'>
          <div className='dashboard-profile'>
            <img src='' alt='profile picture' />
            <p className='dashboard-profile-name'>Mahfuzul Nabil</p>
            <img src='' alt='chevron down' />
          </div>
          <div className='recurring-expenses-container'>
            <h3 className='expenses-title'>Recent Expenses</h3>
            <a className='expenses-view-all'>View All {'>'}</a>
            <div className='reccuring-expense'>
              <img src='' alt='business' />
              <div>
                <p>Netflix Subscription</p>
                <p>Netflix</p>
              </div>
              <div className='reccuring-expense-price'>- $132.00</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
