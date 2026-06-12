import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextValue {
  isLoggedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'demo_isLoggedIn';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(isLoggedIn));
    } catch {}
  }, [isLoggedIn]);

  const value = useMemo<AuthContextValue>(() => ({
    isLoggedIn,
    signIn: () => setIsLoggedIn(true),
    signOut: () => setIsLoggedIn(false),
  }), [isLoggedIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};