'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  const refresh = async () => {
    try {
      const data = await fetch('http://localhost:3000/api/v1/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await data.json();
      console.log(result);
      setAccessToken(result.accessToken);
    } catch (error) {
      console.log('Refresh failed: ', error);
      setAccessToken(null);
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:3000/api/v1/auth/logout');
    } finally {
      setAccessToken(null);
      router.push('/signin');
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
};
