import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { UserRole } from '../types';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  token: string;
  is_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (data: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Auth: Check if token exists and verify with Backend
  useEffect(() => {
    const verifySession = async () => {
      const saved = localStorage.getItem('safestay_user');
      
      if (saved) {
        try {
          const localData = JSON.parse(saved);
          
          // Verify token by calling /auth/me
          // The apiClient interceptor will automatically attach the token
          const response = await apiClient.get('/auth/me');
          
          // Sync state with fresh data from MSSQL
          const freshUser: User = {
            id: response.data.id,
            name: response.data.full_name,
            email: response.data.email,
            role: response.data.role,
            token: localData.token, // Keep existing token
            is_verified: response.data.is_verified,
          };

          setUser(freshUser);
        } catch (e) {
          console.error("Session expired or invalid token");
          localStorage.removeItem('safestay_user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const login = (data: User) => {
    setUser(data);
    localStorage.setItem('safestay_user', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('safestay_user');
    // Optional: Redirect to login
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {/* Prevent app flicker by waiting for verification to finish */}
      {!isLoading ? children : null}
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