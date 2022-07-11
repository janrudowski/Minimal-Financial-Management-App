import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './contexts/AuthContext';
import { DarkModeContextProvider } from './contexts/DarkModeContext';
import './style.css';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/login/Login';
import Signup from './components/login/Signup';
import Transactions from './components/transactions/Transactions';
import Settings from './components/settings/Settings';

export default function App() {
  return (
    <AuthContextProvider>
      <DarkModeContextProvider>
        <Routes>
          <Route index path='/' element={<Dashboard />} />
          <Route path='/transactions' element={<Transactions />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </DarkModeContextProvider>
    </AuthContextProvider>
  );
}
