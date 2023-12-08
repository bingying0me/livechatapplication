import React, { useState, useEffect, useContext, ReactNode } from "react";
import { UserAuthType } from "../types/userAuth.types";
import { auth } from "../utils/firebaseConfig";

type AuthContextType = {
  authUser: UserAuthType | null;
  setAuthUser: React.Dispatch<React.SetStateAction<UserAuthType | null>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};

const defaultAuthContext: AuthContextType = {
  authUser: null,
  setAuthUser: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  isLoading: true,
};
const AuthContext = React.createContext(defaultAuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoading(false);

      if (user) {
        setAuthUser(user);
        setIsLoggedIn(true);
      } else {
        setAuthUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, [authUser]);

  const value = {
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};