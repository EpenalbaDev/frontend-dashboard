'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EmpresaCreateData, EmpresaUpdateData } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const empresaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').min(3, 'El nombre debe tener al menos 3 caracteres'),
  ruc: z.string().min(1, 'El RUC es requerido').regex(/^\d{11}$/, 'El RUC debe tener 11 dígitos'),
  email_procesamiento: z.string().min(1, 'El email es requerido').email('Email inválido'),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  plan: z.string().optional(),
});

type EmpresaFormData = z.infer<typeof empresaSchema>;

interface EmpresaFormProps {
  empresa?: EmpresaCreateData | EmpresaUpdateData;
  onSubmit: (data: EmpresaCreateData | EmpresaUpdateData) => void;
  onCancel?: () => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
}

const EmpresaForm: React.FC<EmpresaFormProps> = ({
  empresa,
  onSubmit,
  onCancel,
  loading = false,
  mode = 'create',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
    defaultValues: empresa
      ? {
          nombre: empresa.nombre || '',
          ruc: empresa.ruc || '',
          email_procesamiento: empresa.email_procesamiento || '',
          direccion: empresa.direccion ?? undefined,
          telefono: empresa.telefono ?? undefined,
          plan: empresa.plan || 'basico',
        }
      : {
          nombre: '',
          ruc: '',
          email_procesamiento: '',
          direccion: '',
          telefono: '',
          plan: 'basico',
        },
  });

  const handleFormSubmit = (data: EmpresaFormData) => {
    onSubmit(data);
  };

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {mode === 'create' ? 'Crear Nueva Empresa' : 'Editar Empresa'}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Nombre de la Empresa"
                {...register('nombre')}
                error={errors.nombre?.message}
                required
                placeholder="Nombre comercial"
              />
            </div>

            <div>
              <Input
                label="RUC"
                {...register('ruc')}
                error={errors.ruc?.message}
                required
                placeholder="12345678901"
                maxLength={11}
              />
            </div>

            <div className="md:col-span-2">
              <Input
                label="Email de Procesamiento"
                type="email"
                {...register('email_procesamiento')}
                error={errors.email_procesamiento?.message}
                required
                placeholder="empresa@example.com"
              />
            </div>

            <div>
              <Input
                label="Dirección"
                {...register('direccion')}
                error={errors.direccion?.message}
                placeholder="Dirección completa"
              />
            </div>

            <div>
              <Input
                label="Teléfono"
                {...register('telefono')}
                error={errors.telefono?.message}
                placeholder="+507 1234-5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plan
              </label>
              <select
                {...register('plan')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="basico">Básico</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={loading || isSubmitting}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              disabled={loading || isSubmitting}
            >
              {loading || isSubmitting
                ? 'Guardando...'
                : mode === 'create'
                ? 'Crear Empresa'
                : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default EmpresaForm;

