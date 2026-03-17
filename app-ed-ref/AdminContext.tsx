import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

interface AdminContextType {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  // true when auth is determined via main-app session (no JWT token needed)
  isSessionAdmin: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  token: null,
  username: null,
  isAuthenticated: false,
  isSessionAdmin: false,
  login: () => {},
  logout: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("admin_token"));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem("admin_username"));

  // Check if the main-app OAuth session has role=admin
  const { user, isAuthenticated: authReady } = useAuth();
  const isSessionAdmin = authReady && !!user && user.role === "admin";

  // When the main-app session is an admin, clear any stale JWT token so we
  // don't accidentally send both headers.
  useEffect(() => {
    if (isSessionAdmin && token) {
      // Session admin takes precedence — clear the separate JWT
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_username");
      setToken(null);
      setUsername(null);
    }
  }, [isSessionAdmin]);

  const login = (t: string, u: string) => {
    localStorage.setItem("admin_token", t);
    localStorage.setItem("admin_username", u);
    setToken(t);
    setUsername(u);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
    setToken(null);
    setUsername(null);
  };

  const isAuthenticated = isSessionAdmin || !!token;
  const effectiveUsername = isSessionAdmin ? (user?.name ?? null) : username;

  return (
    <AdminContext.Provider value={{ token, username: effectiveUsername, isAuthenticated, isSessionAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
