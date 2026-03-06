"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import api, { ApiError } from "@/lib/api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "STUDENT" | "ADMIN" | "INSTRUCTOR";
  avatar?: string;
  emailVerified?: boolean;
  phone?: string;
}

interface AuthResponse {
  accessToken: string;
  user: User;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resendVerification: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function setAuthCookies(token: string, role: string) {
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `ll-auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Strict`;
  document.cookie = `ll-user-role=${role}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

function clearAuthCookies() {
  document.cookie = "ll-auth-token=; path=/; max-age=0";
  document.cookie = "ll-user-role=; path=/; max-age=0";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("lla_token");
    if (token) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      api.get<User>("/auth/profile")
        .then((u) => {
          setUser(u);
          localStorage.setItem("lla_user", JSON.stringify(u));
        })
        .catch(() => {
          localStorage.removeItem("lla_token");
          localStorage.removeItem("lla_user");
          clearAuthCookies();
        })
        .finally(() => { clearTimeout(timeout); setLoading(false); });
    } else {
      const cached = localStorage.getItem("lla_user");
      if (cached) {
        localStorage.removeItem("lla_user");
        clearAuthCookies();
      }
      setLoading(false);
    }
  }, []);

  const saveAuth = (data: AuthResponse) => {
    setUser(data.user);
    localStorage.setItem("lla_user", JSON.stringify(data.user));
    localStorage.setItem("lla_token", data.accessToken);
    setAuthCookies(data.accessToken, data.user.role);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post<AuthResponse>("/auth/login", { email, password });
      saveAuth(data);
      if (!data.user.emailVerified) {
        router.push("/verification-requise");
      } else {
        router.push(data.user.role === "ADMIN" ? "/admin" : "/dashboard");
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erreur de connexion au serveur";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.post<AuthResponse>("/auth/register", data);
      saveAuth(result);
      router.push("/verification-requise");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erreur lors de l'inscription";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "https://prod-llm.onrender.com/api/v1"}/auth/google`;
    } catch {
      setError("Google login non disponible");
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!user?.email) return;
    try {
      await api.post("/auth/resend-verification", { email: user.email });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Erreur lors du renvoi";
      setError(msg);
    }
  };

  const refreshProfile = async () => {
    try {
      const u = await api.get<User>("/auth/profile");
      setUser(u);
      localStorage.setItem("lla_user", JSON.stringify(u));
    } catch {}
  };

  const logout = () => {
    localStorage.removeItem("lla_user");
    localStorage.removeItem("lla_token");
    clearAuthCookies();
    setUser(null);
    setError(null);
    setLoading(false);
    window.location.replace("/connexion?logout=1");
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, loginWithGoogle, resendVerification, refreshProfile, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
