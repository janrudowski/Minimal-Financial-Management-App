import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  //todo: firebase login
  //todo: firebase signin
  //todo: firebase logout
  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
