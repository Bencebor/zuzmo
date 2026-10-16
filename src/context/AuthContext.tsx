import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSetupStatus: () => Promise<{ hasOwner: boolean; userCount: number }>;
  setupMaster: (data: { username: string; email: string; password: string; name: string }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('zuzmara_admin_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Verify current session
  useEffect(() => {
    async function verifySession() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem('zuzmara_admin_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Session verify error:', err);
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [token]);

  const login = async (usernameOrEmail: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Sikertelen bejelentkezés' };
      }
      localStorage.setItem('zuzmara_admin_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Hálózati hiba történt a bejelentkezés során' };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.removeItem('zuzmara_admin_token');
    setToken(null);
    setUser(null);
  };

  const checkSetupStatus = async () => {
    try {
      const res = await fetch('/api/auth/setup-status');
      return await res.json();
    } catch {
      return { hasOwner: true, userCount: 1 };
    }
  };

  const setupMaster = async (data: { username: string; email: string; password: string; name: string }) => {
    try {
      const res = await fetch('/api/auth/setup-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Sikertelen regisztráció' };
      }
      localStorage.setItem('zuzmara_admin_token', resData.token);
      setToken(resData.token);
      setUser(resData.user);
      return { success: true };
    } catch {
      return { success: false, error: 'Hálózati hiba a rendszergazdai fiók létrehozásakor' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, checkSetupStatus, setupMaster }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
