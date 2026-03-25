import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accountType, setAccountType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

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
      const accType = res.data.accountType || res.data.user?.accountType;
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

  const login = async (email, password, type = 'user') => {
    const res = await api.post('/auth/login', { email, password, accountType: type });
    const { token: newToken, user: userData, accountType: accType } = res.data;
    localStorage.setItem('token', newToken);
    localStorage.setItem('accountType', accType);
    setToken(newToken);
    setUser(userData);
    setAccountType(accType);
    return res.data;
  };

  const register = async (userData) => {
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

  const value = {
    user,
    accountType,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLawyer: accountType === 'lawyer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
