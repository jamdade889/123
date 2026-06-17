// src/context/AuthContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types/User";

/* ================= TYPES ================= */

interface AuthContextType {
  user: User | null;
  loading: boolean; // ✅ required
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isAuthenticated: boolean;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* ================= PROVIDER ================= */

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ✅ ADD THIS

  /* 🔁 Restore session on refresh */
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }

    setLoading(false); // ✅ AUTH RESTORED
  }, []);

  /* ================= LOGIN ================= */
  const login = (user: User, token: string) => {
    const userWithToken = { ...user, token };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userWithToken));

    setUser(userWithToken);
    setToken(token);
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

  /* ================= UPDATE USER ================= */
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading, // ✅ PASS IT HERE
        token,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};