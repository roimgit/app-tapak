"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  email: string;
  name?: string;
  type?: string;
  verified?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  checkAuth: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      // Sesi disimpan di sessionStorage (otomatis terhapus saat browser/tab ditutup)
      const rawSession = sessionStorage.getItem("tapak_owner_session");
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        if (parsed && parsed.email) {
          setUser(parsed);
          setIsAuthenticated(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    setIsAuthenticated(true);
    try {
      sessionStorage.setItem("tapak_owner_session", JSON.stringify(userData));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem("tapak_owner_session");
      localStorage.removeItem("tapak_owner_session");
    } catch {
      // ignore
    }
  };

  const checkAuth = (): boolean => {
    try {
      const rawSession = sessionStorage.getItem("tapak_owner_session");
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        if (parsed && parsed.email) {
          setIsAuthenticated(true);
          setUser(parsed);
          return true;
        }
      }
    } catch {
      // ignore
    }
    return isAuthenticated;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
