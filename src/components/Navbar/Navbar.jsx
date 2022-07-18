import React from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../../contexts/AuthContext';
import Darkmodeswitch from '../DarkModeSwitch/DarkModeSwitch';
export default function Navbar() {
  const { logout } = useAuth();

  function handleLogout() {
    logout();
  }

  return (
    <aside>
      <div className='sidebar-container'>
        <div className='sidebar-logo'>
          <svg className='logo'>
            <use href='/images/Logo.svg#Layer_1'></use>
          </svg>
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
          <Darkmodeswitch />
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
