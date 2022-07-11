import React from 'react';
import Navbar from './Navbar/Navbar';
export default function PrivateRoute({ children }) {
  //todo: if user render else navigate to /login
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
