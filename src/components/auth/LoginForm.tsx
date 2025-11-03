'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, isLoading, error, clearError } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    await login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard de Facturas
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Inicia sesión para acceder al sistema
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                type="email"
                placeholder="usuario@empresa.com"
                leftIcon={<Mail className="h-4 w-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <Link
                    href="/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </div>

              {/* Botón de prueba para verificar conexión */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={async () => {
                  try {
                    console.log('Testing API connection...');
                    const response = await fetch('http://localhost:3001/api/v1/auth/me', {
                      headers: {
                        'Authorization': 'Bearer test-token'
                      }
                    });
                    console.log('Test response:', response.status, response.statusText);
                    const data = await response.text();
                    console.log('Test data:', data);
                  } catch (error) {
                    console.error('Test error:', error);
                  }
                }}
              >
                Probar Conexión API
              </Button>

              {/* Botón de prueba para dashboard */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={async () => {
                  try {
                    console.log('=== TESTING DASHBOARD ENDPOINT ===');
                    const token = localStorage.getItem('auth_token');
                    console.log('Current token:', token);
                    console.log('Token length:', token ? token.length : 0);
                    
                    const headers = {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    };
                    console.log('Request headers:', headers);
                    
                    const response = await fetch('http://localhost:3001/api/v1/dashboard/data', {
                      method: 'GET',
                      headers: headers,
                      credentials: 'include'
                    });
                    
                    console.log('Response status:', response.status);
                    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
                    
                    const data = await response.json();
                    console.log('Response data:', data);
                    
                    // También probar con axios para comparar
                    console.log('=== TESTING WITH AXIOS ===');
                    const axios = (await import('axios')).default;
                    try {
                      const axiosResponse = await axios.get('http://localhost:3001/api/v1/dashboard/data', {
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        }
                      });
                      console.log('Axios response:', axiosResponse.data);
                    } catch (axiosError: unknown) {
                      const error = axiosError as { response?: { data?: unknown }; message?: string };
                      console.error('Axios error:', error.response?.data || error.message);
                    }
                  } catch (error) {
                    console.error('Dashboard test error:', error);
                  }
                }}
              >
                Probar Dashboard API (Debug)
              </Button>

              {/* Botón de prueba para auth/me */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={async () => {
                  try {
                    console.log('=== TESTING AUTH/ME ENDPOINT ===');
                    const token = localStorage.getItem('auth_token');
                    console.log('Current token:', token);
                    
                    const response = await fetch('http://localhost:3001/api/v1/auth/me', {
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                    });
                    
                    console.log('Auth/me response status:', response.status);
                    const data = await response.json();
                    console.log('Auth/me response data:', data);
                  } catch (error) {
                    console.error('Auth/me test error:', error);
                  }
                }}
              >
                Probar Auth/Me
              </Button>

              {/* Botón para limpiar localStorage */}
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  console.log('=== CLEARING LOCALSTORAGE ===');
                  localStorage.removeItem('auth_token');
                  localStorage.removeItem('user');
                  console.log('localStorage cleared');
                  window.location.reload();
                }}
              >
                Limpiar localStorage y recargar
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Problemas para acceder?{' '}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Contacta al administrador
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm; 