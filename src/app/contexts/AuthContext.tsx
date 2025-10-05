"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";

export interface LoginResponse {
  token?: string;
  error?: string;
  errorcode?: string;
  message?: string;
}

export interface User {
  username: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  clearSuccessMessage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Función para cargar usuario desde localStorage
  const loadUserFromStorage = useCallback(() => {
    const savedUser = localStorage.getItem("moodle_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        return parsedUser;
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("moodle_user");
        setUser(null);
        return null;
      }
    }
    return null;
  }, []);

  // Verificar si hay un usuario logueado al cargar la página
  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  // Listener para cambios en localStorage (para sincronización entre pestañas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "moodle_user") {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error("Error parsing user from storage event:", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error en el login");
      }

      if (data.error) {
        throw new Error(data.message || "Credenciales incorrectas");
      }

      if (data.token) {
        const userData: User = {
          username,
          token: data.token,
        };

        // Actualizar estado y localStorage
        setUser(userData);
        localStorage.setItem("moodle_user", JSON.stringify(userData));

        setSuccessMessage(
          `¡Bienvenido, ${username}! Sesión iniciada correctamente.`
        );
        return true;
      } else {
        throw new Error("No se recibió token de autenticación");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("moodle_user");
    setSuccessMessage("Sesión cerrada correctamente.");
  };

  const clearError = () => setError(null);
  const clearSuccessMessage = () => setSuccessMessage(null);

  const isAuthenticated = !!user;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    error,
    successMessage,
    login,
    logout,
    clearError,
    clearSuccessMessage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
