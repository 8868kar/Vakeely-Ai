import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api.js';
import { IUser } from '../types/index.js';

interface AuthContextType {
  user: IUser | null;
  accountType: string | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, type?: string) => Promise<any>;
  googleLogin: (token: string, type?: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLawyer: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [accountType, setAccountType] = useState<string | null>(localStorage.getItem('accountType'));
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      const accType = res.data.accountType || res.data.user?.accountType || 'user';
      setAccountType(accType);
      if (accType) {
        localStorage.setItem('accountType', accType);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string, type: string = 'user') => {
    const res = await api.post('/auth/login', { email, password, accountType: type });
    const { token: newToken, user: userData, accountType: accType } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('accountType', accType);
    setToken(newToken);
    setUser(userData);
    setAccountType(accType);
    return res.data;
  };

  const googleLogin = async (googleToken: string, type: string = 'user') => {
    const res = await api.post('/auth/google', { token: googleToken, accountType: type });
    const { token: newToken, user: userData, accountType: accType } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('accountType', accType);
    setToken(newToken);
    setUser(userData);
    setAccountType(accType);
    return res.data;
  };

  const register = async (userData: any) => {
    const res = await api.post('/auth/register', userData);
    const { token: newToken, user: newUser, accountType: accType } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('accountType', accType);
    setToken(newToken);
    setUser(newUser);
    setAccountType(accType);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accountType');
    setToken(null);
    setUser(null);
    setAccountType(null);
  };

  const value: AuthContextType = {
    user,
    accountType,
    token,
    loading,
    login,
    googleLogin,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLawyer: accountType === 'lawyer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
