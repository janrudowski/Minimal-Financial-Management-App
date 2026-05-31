import {
  createContext,
  useCallback,
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

const darkModeStorageKey = 'darkmode';

function saveDarkModePreference(darkMode: boolean) {
  try {
    localStorage.setItem(darkModeStorageKey, JSON.stringify(darkMode));
  } catch {
    // Ignore storage failures so theme selection still works in restricted browsers.
  }
}

function readSavedDarkModePreference(): boolean | null {
  try {
    const savedPreference = localStorage.getItem(darkModeStorageKey);

    if (savedPreference === null) {
      return null;
    }

    return JSON.parse(savedPreference) === true;
  } catch {
    return null;
  }
}

function readSystemDarkModePreference(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches === true;
}

function readInitialDarkMode(): boolean {
  const savedPreference = readSavedDarkModePreference();

  if (savedPreference !== null) {
    return savedPreference;
  }

  const systemPreference = readSystemDarkModePreference();
  saveDarkModePreference(systemPreference);

  return systemPreference;
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
  const [darkMode, setDarkModeState] = useState(readInitialDarkMode);
  const setDarkMode = useCallback<Dispatch<SetStateAction<boolean>>>(
    (nextDarkMode) => {
      setDarkModeState((previousDarkMode) => {
        const resolvedDarkMode =
          typeof nextDarkMode === 'function'
            ? nextDarkMode(previousDarkMode)
            : nextDarkMode;

        saveDarkModePreference(resolvedDarkMode);

        return resolvedDarkMode;
      });
    },
    []
  );

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
