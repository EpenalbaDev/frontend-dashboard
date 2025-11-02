'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials } from '@/types';
import { authService } from '@/lib/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEncryptedToken, cleanExpiredTokens } from '@/utils/encryption';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken, setToken, removeToken } = useEncryptedToken();
  const [, setStoredUser, removeStoredUser] = useLocalStorage<User | null>('user', null);

  const isAuthenticated = !!user;

  // Verificar token al cargar la aplicación SOLO UNA VEZ
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // No verificar auth si estamos en la página de login
        if (typeof window !== 'undefined' && window.location.pathname === '/login') {
          console.log('On login page, skipping auth check');
          setIsLoading(false);
          return;
        }

        // Limpiar tokens expirados primero
        cleanExpiredTokens();
        
        const initialToken = getToken();
        const initialStoredUser = localStorage.getItem('user');
        
        console.log('Checking auth on app load...', { 
          token: !!initialToken, 
          storedUser: !!initialStoredUser 
        });
        
        // Si tenemos un usuario almacenado, usarlo
        if (initialStoredUser) {
          try {
            const parsedUser = JSON.parse(initialStoredUser);
            console.log('Using stored user:', parsedUser);
            setUser(parsedUser);
          } catch (e) {
            console.error('Error parsing stored user:', e);
            localStorage.removeItem('user');
          }
        }
        
        // Verificar token con el servidor SOLO si tenemos token
        if (initialToken) {
          console.log('Verifying token with server...');
          try {
            const response = await authService.me();
            console.log('Server response:', response);
            
            if (response.success) {
              setUser(response.data);
              // Solo actualizar localStorage si el usuario cambió
              if (JSON.stringify(response.data) !== initialStoredUser) {
                localStorage.setItem('user', JSON.stringify(response.data));
              }
            } else {
              console.log('Token invalid, clearing...');
              removeToken();
              removeStoredUser();
              setUser(null);
            }
          } catch (apiError: unknown) {
            console.error('API error checking auth:', apiError);
            
            // Solo limpiar la sesión si es un error 401 (no autorizado)
            if ((apiError as { response?: { status: number } }).response?.status === 401) {
              console.log('Token invalid, clearing auth');
              removeToken();
              removeStoredUser();
              setUser(null);
            } else {
              // Para otros errores (429, 500, network, etc.), mantener usuario si existe
              if (initialStoredUser) {
                console.log('API error but keeping stored user:', (apiError as { response?: { status: number } }).response?.status || 'network error');
                // Usuario ya está seteado arriba, no hacer nada más
              } else {
                console.log('No stored user available, clearing auth');
                removeToken();
                removeStoredUser();
                setUser(null);
              }
            }
          }
        } else {
          console.log('No token found');
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        removeToken();
        removeStoredUser();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []); // Sin dependencias para que solo se ejecute una vez

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting login with:', credentials.email);
      const response = await authService.login(credentials.email, credentials.password);
      console.log('Login response:', response);
      
      if (response.success) {
        const { token: newToken, user: userData } = response.data;
        console.log('Login successful, saving token and user data');
        
        // Guardar en localStorage usando el hook
        setToken(newToken);
        setStoredUser(userData);
        setUser(userData);
        
        console.log('Token and user saved successfully');
      } else {
        console.log('Login failed:', response.message);
        setError(response.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Limpiar estado local usando el hook
      removeToken();
      removeStoredUser();
      setUser(null);
      setError(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 