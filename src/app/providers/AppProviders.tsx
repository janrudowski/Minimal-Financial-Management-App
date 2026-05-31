import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from '../../features/auth/context/AuthContext';
import { APIContextProvider } from '../../features/expenses/context/ExpensesContext';
import { DarkModeContextProvider } from './DarkModeProvider';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <DarkModeContextProvider>
      <BrowserRouter>
        <AuthContextProvider>
          <APIContextProvider>{children}</APIContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </DarkModeContextProvider>
  );
}
