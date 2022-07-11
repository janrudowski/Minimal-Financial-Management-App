import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './navbar.css';
export default function Navbar() {
  function handleLogout() {}
  return (
    <aside>
      <div className='sidebar-container'>
        <div className='sidebar-logo'>
          <img src='/images/logo.png' alt='logo' />
        </div>
        <nav>
          <NavLink className='sidebar-link' to='/'>
            <svg className='sidebar-link-icon'>
              <use href='/icons/home-icon.svg#Capa_1'></use>
            </svg>
            Dashboard
          </NavLink>
          <NavLink className='sidebar-link' to='/transactions'>
            <svg className='sidebar-link-icon'>
              <use href='/icons/chart-icon.svg#Capa_1'></use>
            </svg>
            Expenses
          </NavLink>
          <NavLink className='sidebar-link' to='/settings'>
            <svg className='sidebar-link-icon'>
              <use href='/icons/settings-icon.svg#Capa_1'></use>
            </svg>
            Settings
          </NavLink>
        </nav>
        <div className='sidebar-logout'>
          <button onClick={handleLogout}>
            <img
              className='sidebar-icon'
              src='/icons/logout-icon.svg'
              alt='logout'
            />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
