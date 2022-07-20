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
  EmailAuthProvider,
  reauthenticateWithCredential,
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

  function reauth(email, password) {
    const credential = EmailAuthProvider.credential(email, password);
    return reauthenticateWithCredential(currentUser, credential);
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
        reauth,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
