import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';
import './style.css';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import Signup from './components/login/Signup';
import Transactions from './components/transactions/Transactions';
import Settings from './components/settings/Settings';
import PrivateRoute from './components/PrivateRoute';
import { useDarkMode } from './contexts/DarkModeContext';
export default function App() {
  const { darkMode } = useDarkMode();
  return (
    <div className={`flex ${darkMode ? 'flex-dark' : ''}`}>
      <AuthContextProvider>
        <Routes>
          <Route
            index
            path='/'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path='/transactions'
            element={
              <PrivateRoute>
                <Transactions />
              </PrivateRoute>
            }
          />
          <Route
            path='/settings'
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path='/login'
            element={
              <PrivateRoute loginPage={true}>
                <Login />
              </PrivateRoute>
            }
          />
          <Route
            path='/signup'
            element={
              <PrivateRoute loginPage={true}>
                <Signup />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}
