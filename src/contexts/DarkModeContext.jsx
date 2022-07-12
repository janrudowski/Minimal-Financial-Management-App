import React, { createContext, useContext, useState } from 'react';

const DarkModeContext = createContext();

export function useDarkMode() {
  return useContext(DarkModeContext);
}

export function DarkModeContextProvider({ children }) {
  const setting = JSON.parse(localStorage.getItem('darkmode'));
  const [darkMode, setDarkMode] = useState(setting || false);
  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
