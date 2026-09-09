"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  email: string;
  name?: string;
  role?: string;
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
    // 1. Cek sesi dari sessionStorage (otomatis terhapus saat browser/tab ditutup)
    try {
      const rawSession = sessionStorage.getItem("tapak_owner_session");
      if (rawSession) {
        const parsed = JSON.parse(rawSession);
        if (parsed && parsed.email) {
          setUser(parsed);
          setIsAuthenticated(true);
          return;
        }
      }
    } catch {
      // ignore
    }

    // 2. Cek sesi Google OAuth via /api/auth/me (cookie tapak_google_session)
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          try {
            sessionStorage.setItem("tapak_owner_session", JSON.stringify(data.user));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // ignore
      });
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.removeItem("tapak_owner_session");
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
      fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
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
