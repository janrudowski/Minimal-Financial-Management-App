import {
  EmailAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword,
  updatePhoneNumber,
  updateProfile,
  type User,
  type UserCredential,
} from 'firebase/auth';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { auth } from '../../../lib/firebase/firebase';

type AuthContextValue = {
  loading: boolean;
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateUser: (
    user: User,
    properties: Parameters<typeof updateProfile>[1]
  ) => Promise<void>;
  updatePassword: typeof updatePassword;
  updateEmail: typeof updateEmail;
  updatePhoneNumber: typeof updatePhoneNumber;
  reauth: (email: string, password: string) => Promise<UserCredential>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

type AuthContextProviderProps = {
  children: ReactNode;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthContextProvider.');
  }

  return context;
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signInWithGoogle() {
    return signInWithPopup(auth, googleProvider);
  }

  function updateUser(
    user: User,
    properties: Parameters<typeof updateProfile>[1]
  ) {
    return updateProfile(user, properties);
  }

  function logout() {
    return signOut(auth);
  }

  function reauth(email: string, password: string) {
    if (!currentUser) {
      return Promise.reject(
        new Error('Cannot reauthenticate without a signed-in user.')
      );
    }

    const credential = EmailAuthProvider.credential(email, password);
    return reauthenticateWithCredential(currentUser, credential);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        currentUser,
        signup,
        login,
        signInWithGoogle,
        logout,
        updateUser,
        updatePassword,
        updateEmail,
        updatePhoneNumber,
        reauth,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
