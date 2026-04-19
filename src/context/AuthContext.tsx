import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import axiosInstance from '../utils/axiosInstance';
import type { User, AuthContextType, SignupCredentials } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await axiosInstance.get<User>('/auth/me');
        setUser(response.data);
      } catch (error) {
        localStorage.clear();
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        username,
        password,
        expiresInMins: 30,
      });
      
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      const userResponse = await axiosInstance.get<User>('/auth/me');
      setUser(userResponse.data);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (userData: SignupCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const { confirmPassword, ...signupData } = userData;
      const response = await axiosInstance.post('/users/add', signupData);
      if (response.data) {
        return await login(signupData.username, signupData.password);
      }
      return { success: false, error: 'Signup failed' };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};