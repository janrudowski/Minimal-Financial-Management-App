import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useDarkMode } from '../providers/DarkModeProvider';
import { useAuth } from '../../features/auth/context/AuthContext';
import DarkModeSwitch from '../../shared/components/DarkModeSwitch/DarkModeSwitch';
import Navbar from '../../shared/components/Navbar/Navbar';

type ProtectedRouteProps = {
  children: ReactNode;
  loginPage?: boolean;
};

export function ProtectedRoute({
  children,
  loginPage = false,
}: ProtectedRouteProps) {
  const { currentUser, logout } = useAuth();
  const { darkMode, setDarkMode } = useDarkMode();

  if (loginPage) {
    return currentUser ? <Navigate to="/" /> : children;
  }

  function toggleDarkMode() {
    setDarkMode((previousDarkMode) => !previousDarkMode);
  }

  return currentUser ? (
    <>
      <Navbar
        darkModeSwitch={
          <DarkModeSwitch checked={darkMode} onToggle={toggleDarkMode} />
        }
        onLogout={logout}
      />
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
}

export default ProtectedRoute;
