import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import Navbar from '../../shared/components/Navbar/Navbar';

type ProtectedRouteProps = {
  children: ReactNode;
  loginPage?: boolean;
};

export function ProtectedRoute({
  children,
  loginPage = false,
}: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  if (loginPage) {
    return currentUser ? <Navigate to="/" /> : children;
  }

  return currentUser ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default ProtectedRoute;
