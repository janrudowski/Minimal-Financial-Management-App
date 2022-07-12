import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import './darkmodeswitch.css';

export default function DarkModeSwitch() {
  const { darkMode, setDarkMode } = useDarkMode();
  function toggleDarkMode() {
    setDarkMode((prev) => !prev);
    localStorage.setItem('darkmode', JSON.stringify(!darkMode)); //because state here is not updated
  }
  return (
    <div className='darkmode-container' onClick={toggleDarkMode}>
      <div className='darkmode-switch-container'>
        <div
          className={`darkmode-switch ${
            darkMode ? 'darkmode-switch-active' : ''
          }`}
        ></div>
      </div>
      <p>Dark mode</p>
    </div>
  );
}
