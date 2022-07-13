import React from 'react';
import Spinner from '../Spinner/Spinner';
import TopBar from '../TopBar/TopBar';
import './transactions.css';
export default function Transactions() {
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
          {/* <table className='transactions-expenses-table'>
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
                <td>MGL0124877</td>
                <td>
                  <button className='expenses-table-edit-button'>Edit</button>
                </td>
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
                <td>MGL0124877</td>
                <td>
                  <button className='expenses-table-edit-button'>Edit</button>
                </td>
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
                <td>MGL0124877</td>
                <td>
                  <button className='expenses-table-edit-button'>Edit</button>
                </td>
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
                <td>MGL0124877</td>
                <td>
                  <button className='expenses-table-edit-button'>Edit</button>
                </td>
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
                <td>MGL0124877</td>
                <td>
                  <button className='expenses-table-edit-button'>Edit</button>
                </td>
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
                <td>MGL0124877</td>
                <td>
                  <button className='expenses-table-edit-button'>Edit</button>
                </td>
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
                <td>MGL0124877</td>
                <td>
                  <button className='expenses-table-edit-button'>Edit</button>
                </td>
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
                <td>MGL0124877</td>
                <td>
                  <button className='expenses-table-edit-button'>Edit</button>
                </td>
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
                <td>MGL0124877</td>
                <td>
                  <button className='expenses-table-edit-button'>Edit</button>
                </td>
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
                <td>MGL0124877</td>
                <td>
                  <button className='expenses-table-edit-button'>Edit</button>
                </td>
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
                <td>MGL0124877</td>
                <td>
                  <button className='expenses-table-edit-button'>Edit</button>
                </td>
              </tr>
            </tbody>
          </table> */}
          <Spinner />
        </div>
      </div>
    </main>
  );
}
