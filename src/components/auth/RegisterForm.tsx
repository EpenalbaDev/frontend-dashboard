'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Building, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Link from 'next/link';

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register: registerUser, isLoading, error, clearError } = useAuth();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      await registerUser(data);
      // Redirigir a dashboard después de registro exitoso
      router.push('/dashboard');
    } catch (err) {
      // El error ya está manejado en AuthContext
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard de Facturas
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Crea tu cuenta y comienza a gestionar tus facturas
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro de Cuenta</CardTitle>
            <CardDescription>
              Completa el formulario para crear tu cuenta y empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              {/* Sección: Datos Personales */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Datos Personales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    placeholder="Juan"
                    leftIcon={<User className="h-4 w-4" />}
                    error={errors.nombre?.message}
                    {...register('nombre')}
                  />

                  <Input
                    label="Apellido"
                    placeholder="Pérez"
                    leftIcon={<User className="h-4 w-4" />}
                    error={errors.apellido?.message}
                    {...register('apellido')}
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Email"
                      type="email"
                      placeholder="usuario@empresa.com"
                      leftIcon={<Mail className="h-4 w-4" />}
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  <div className="md:col-span-2">
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
                      helperText="Debe contener mayúscula, minúscula y número"
                      {...register('password')}
                    />
                  </div>
                </div>
              </div>

              {/* Sección: Datos de Empresa */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Datos de Empresa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Nombre de la Empresa"
                      placeholder="Mi Empresa S.A."
                      leftIcon={<Building className="h-4 w-4" />}
                      error={errors.empresa_nombre?.message}
                      {...register('empresa_nombre')}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Input
                      label="RUC"
                      placeholder="12345678901"
                      leftIcon={<Building className="h-4 w-4" />}
                      error={errors.empresa_ruc?.message}
                      {...register('empresa_ruc')}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Input
                      label="Dirección (opcional)"
                      placeholder="Calle y número"
                      leftIcon={<MapPin className="h-4 w-4" />}
                      error={errors.empresa_direccion?.message}
                      {...register('empresa_direccion')}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Input
                      label="Teléfono (opcional)"
                      placeholder="+507 1234-5678"
                      leftIcon={<Phone className="h-4 w-4" />}
                      error={errors.empresa_telefono?.message}
                      {...register('empresa_telefono')}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Registrando...' : 'Registrarse'}
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  ¿Ya tienes cuenta?{' '}
                  <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;

