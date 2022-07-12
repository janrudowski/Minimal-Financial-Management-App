import React from 'react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import './darkmodeswitch.css';

export default function DarkModeSwitch() {
  const { darkMode, setDarkMode } = useDarkMode();
  return (
    <div
      className='darkmode-container'
      onClick={() => setDarkMode((prev) => !prev)}
    >
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
