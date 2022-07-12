import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
export default function PrivateRoute({ children, loginPage = false }) {
  // const { currentUser } = useAuth();
  const currentUser = '';

  if (loginPage) return currentUser ? <Navigate to='/' /> : children;
  else
    return currentUser ? (
      <>
        <Navbar />
        {children}
      </>
    ) : (
      <Navigate to='/login' />
    );
}
