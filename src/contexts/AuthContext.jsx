import React, { createContext, useContext, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  updatePassword,
  updateEmail,
  updatePhoneNumber,
} from 'firebase/auth';
import { auth } from '../config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function updateUser(user, properties) {
    return updateProfile(user, properties);
  }

  function logout() {
    signOut(auth);
  }

  React.useEffect(() => {
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
        logout,
        updateUser,
        updatePassword,
        updateEmail,
        updatePhoneNumber,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
