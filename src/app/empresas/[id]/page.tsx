'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEmpresa, useUpdateEmpresa, useEmpresaUsers } from '@/hooks/useEmpresas';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ApiErrorDisplay from '@/components/ui/ApiErrorDisplay';
import EmpresaForm from '@/components/empresas/EmpresaForm';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  ArrowLeft,
  Users,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { formatDate } from '@/utils';
import { EmpresaUpdateData } from '@/types';

export default function EmpresaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const empresaId = parseInt(params.id as string);

  const [isEditing, setIsEditing] = useState(false);

  const { data: empresa, isLoading, error, refetch } = useEmpresa(empresaId);
  const { data: usuarios, isLoading: loadingUsers } = useEmpresaUsers(empresaId);
  const updateEmpresaMutation = useUpdateEmpresa();

  const handleUpdate = async (data: EmpresaUpdateData) => {
    try {
      await updateEmpresaMutation.mutateAsync({ id: empresaId, data });
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Error updating empresa:', error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <Card>
          <div className="p-8 text-center">
            <LoadingSpinner />
          </div>
        </Card>
      </DashboardLayout>
    );
  }

  if (error || !empresa) {
    return (
      <DashboardLayout>
        <ApiErrorDisplay error={error} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="secondary"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Building className="w-6 h-6 mr-2" />
                {empresa.nombre}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Detalle de la empresa
              </p>
            </div>
          </div>
          {!isEditing && (
            <Button
              variant="primary"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </div>

        {/* Formulario de edición */}
        {isEditing ? (
          <EmpresaForm
            empresa={{
              nombre: empresa.nombre,
              ruc: empresa.ruc,
              email_procesamiento: empresa.email_procesamiento,
              direccion: empresa.direccion ?? undefined,
              telefono: empresa.telefono ?? undefined,
              plan: empresa.plan,
            }}
            mode="edit"
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            loading={updateEmpresaMutation.isPending}
          />
        ) : (
          <>
            {/* Información principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Información General
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Building className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Nombre</div>
                        <div className="text-base font-medium text-gray-900">
                          {empresa.nombre}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex items-center justify-center">
                        RUC
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">RUC</div>
                        <div className="text-base font-medium text-gray-900">
                          {empresa.ruc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Email de Procesamiento</div>
                        <div className="text-base font-medium text-gray-900">
                          {empresa.email_procesamiento}
                        </div>
                      </div>
                    </div>

                    {empresa.telefono && (
                      <div className="flex items-start">
                        <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <div className="text-sm text-gray-500">Teléfono</div>
                          <div className="text-base font-medium text-gray-900">
                            {empresa.telefono}
                          </div>
                        </div>
                      </div>
                    )}

                    {empresa.direccion && (
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <div className="text-sm text-gray-500">Dirección</div>
                          <div className="text-base font-medium text-gray-900">
                            {empresa.direccion}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Estado y Configuración
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Estado</div>
                      {empresa.activo ? (
                        <Badge variant="success" className="flex items-center w-fit">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Activa
                        </Badge>
                      ) : (
                        <Badge variant="danger" className="flex items-center w-fit">
                          <XCircle className="w-4 h-4 mr-1" />
                          Inactiva
                        </Badge>
                      )}
                    </div>

                    <div>
                      <div className="text-sm text-gray-500 mb-2">Plan</div>
                      <Badge variant="secondary">
                        {empresa.plan || 'basico'}
                      </Badge>
                    </div>

                    {empresa.created_at && (
                      <div className="flex items-start">
                        <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <div className="text-sm text-gray-500">Fecha de Creación</div>
                          <div className="text-base font-medium text-gray-900">
                            {formatDate(empresa.created_at)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Usuarios de la empresa */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Usuarios Asociados
                  </h2>
                  {usuarios && usuarios.length > 0 && (
                    <Badge variant="secondary">
                      {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>

                {loadingUsers ? (
                  <div className="p-4 text-center">
                    <LoadingSpinner />
                  </div>
                ) : usuarios && usuarios.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Rol
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {usuarios.map((usuario) => (
                          <tr key={usuario.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {usuario.nombre} {usuario.apellido}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {usuario.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="secondary">
                                {usuario.rol}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {usuario.activo !== false ? (
                                <Badge variant="success">Activo</Badge>
                              ) : (
                                <Badge variant="danger">Inactivo</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No hay usuarios asociados a esta empresa
                  </div>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

