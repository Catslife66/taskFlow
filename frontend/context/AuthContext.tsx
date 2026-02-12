"use client";

import { apiFetch } from "@/lib/api";
import { User } from "@/lib/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const GET_ME_API_PATH = "/api/auth/me";
const LOGIN_API_PATH = "/api/auth/login";
const LOGOUT_API_PATH = "/api/auth/logout";

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    try {
      const me = await apiFetch<User>(GET_ME_API_PATH);
      setUser(me);
    } catch (e: any) {
      setUser(null);
      setError(e?.message ?? "Not logged it");
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setError(null);
    await apiFetch<{ ok: boolean }>(LOGIN_API_PATH, {
      method: "POST",
      json: { email, password },
    });
    await refresh();
  }

  async function logout() {
    setError(null);
    await apiFetch<{ ok: boolean }>(LOGOUT_API_PATH, {
      method: "POST",
    });
    setUser(null);
  }

  useEffect(() => {
    refresh();
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, refresh, login, logout }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
