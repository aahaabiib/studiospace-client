'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { authClient, logout as doLogout } from '@/lib/auth-client';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const [tokenReady, setTokenReady] = useState(false);

  const user = session?.user
    ? { ...session.user, photoURL: session.user.image }
    : null;

  // session থাকলে API token cookie নিশ্চিত করা, শেষ না হওয়া পর্যন্ত loading থাকবে
  useEffect(() => {
    if (isPending) return;
    if (!session?.user?.email) {
      setTokenReady(false);
      return;
    }
    let cancelled = false;
    setTokenReady(false);
    fetch('/api/token', { cache: 'no-store' })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setTokenReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isPending, session?.user?.email]);

  const loading = isPending || (!!user && !tokenReady);

  const login = async (email, password) => {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message || 'Invalid email or password');

    const res = await fetch('/api/token', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Login succeeded but API token could not be created. Please try again.');
    }

    toast.success('Login successful');
  };

  const register = async (name, email, password, photoURL) => {
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      ...(photoURL ? { image: photoURL } : {}),
    });
    if (error) throw new Error(error.message || 'Registration failed');
    toast.success('Registration successful! Please login.');
  };

  const logout = async () => {
    await doLogout();
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};