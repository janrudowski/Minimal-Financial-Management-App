import { Route, Routes } from 'react-router-dom';
import Login from '../../features/auth/components/Login';
import Signup from '../../features/auth/components/Signup';
import Dashboard from '../../features/dashboard/components/Dashboard';
import Transactions from '../../features/expenses/components/Transactions';
import Settings from '../../features/settings/components/Settings';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <ProtectedRoute loginPage>
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedRoute loginPage>
            <Signup />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
