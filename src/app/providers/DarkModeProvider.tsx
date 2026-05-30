import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

type DarkModeContextValue = {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
};

const DarkModeContext = createContext<DarkModeContextValue | undefined>(
  undefined
);

type DarkModeContextProviderProps = {
  children: ReactNode;
};

function readInitialDarkMode(): boolean {
  try {
    return JSON.parse(localStorage.getItem('darkmode') ?? 'false') === true;
  } catch {
    return false;
  }
}

export function useDarkMode(): DarkModeContextValue {
  const context = useContext(DarkModeContext);

  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeContextProvider.');
  }

  return context;
}

export function DarkModeContextProvider({
  children,
}: DarkModeContextProviderProps) {
  const [darkMode, setDarkMode] = useState(readInitialDarkMode);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
