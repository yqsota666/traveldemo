import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, MeUser } from '../services/api';
import { clearToken, getToken, setToken } from '../utils/request';

interface AuthContextValue {
  user: MeUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
  hasPermission: (code: string) => boolean;
  hasRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setLoading(false);
      return;
    }
    const { data } = await api.me();
    setUser(data.result);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshMe().catch(() => {
      clearToken();
      setUser(null);
      setLoading(false);
    });
  }, [refreshMe]);

  const login = useCallback(async (username: string, password: string) => {
    const { data } = await api.login(username, password);
    setToken(data.result.accessToken);
    setUser(data.result.user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const hasPermission = useCallback(
    (code: string) => {
      if (!user) return false;
      if (user.roles.includes('SUPER_ADMIN')) return true;
      return user.permissions.includes(code);
    },
    [user]
  );

  const hasRole = useCallback(
    (...roles: string[]) => {
      if (!user) return false;
      return roles.some((r) => user.roles.includes(r));
    },
    [user]
  );

  const value = useMemo(
    () => ({ user, loading, login, logout, refreshMe, hasPermission, hasRole }),
    [user, loading, login, logout, refreshMe, hasPermission, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
