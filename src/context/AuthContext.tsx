"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Role } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios hardcodeados para demo - reemplazar con API real
const MOCK_USERS: Record<string, { password: string; nombre: string; role: Role }> = {
  "gerente@promotick.com": {
    password: "gerente123",
    nombre: "Carlos Mendoza",
    role: "gerente",
  },
  "soporte@promotick.com": {
    password: "soporte123",
    nombre: "Alexia Torres",
    role: "soporte",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("promotick_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    const mockUser = MOCK_USERS[email.toLowerCase()];
    if (!mockUser) {
      return { success: false, error: "Usuario no encontrado" };
    }
    if (mockUser.password !== password) {
      return { success: false, error: "Contraseña incorrecta" };
    }
    const loggedUser: User = {
      email: email.toLowerCase(),
      nombre: mockUser.nombre,
      role: mockUser.role,
    };
    setUser(loggedUser);
    localStorage.setItem("promotick_user", JSON.stringify(loggedUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("promotick_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
