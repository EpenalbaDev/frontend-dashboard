'use client';

import React, { useState } from 'react';
import { useEmpresas, useCreateEmpresa, useUpdateEmpresa } from '@/hooks/useEmpresas';
import EmpresasTable from '@/components/empresas/EmpresasTable';
import EmpresaFiltersComponent from '@/components/empresas/EmpresaFilters';
import EmpresaForm from '@/components/empresas/EmpresaForm';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ApiErrorDisplay from '@/components/ui/ApiErrorDisplay';
import { Empresa, EmpresaFilters, EmpresaCreateData, EmpresaUpdateData } from '@/types';
import { Plus, Building } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function EmpresasPage() {
  const [filters, setFilters] = useState<EmpresaFilters>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);

  const { data: empresasData, isLoading, error, refetch } = useEmpresas({
    ...filters,
    limit: 100,
  });

  const createEmpresaMutation = useCreateEmpresa();
  const updateEmpresaMutation = useUpdateEmpresa();

  const empresas = empresasData || [];

  const handleFilterChange = (newFilters: EmpresaFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleCreateSubmit = async (data: EmpresaCreateData | EmpresaUpdateData) => {
    try {
      if (editingEmpresa) {
        await updateEmpresaMutation.mutateAsync({ id: editingEmpresa.id, data });
      } else {
        await createEmpresaMutation.mutateAsync(data as EmpresaCreateData);
      }
      setShowCreateForm(false);
      setEditingEmpresa(null);
      refetch();
    } catch (error) {
      console.error('Error saving empresa:', error);
    }
  };

  const handleEdit = (empresa: Empresa) => {
    setEditingEmpresa(empresa);
    setShowCreateForm(true);
  };

  const handleView = (empresa: Empresa) => {
    window.location.href = `/empresas/${empresa.id}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Building className="w-6 h-6 mr-2" />
              Empresas
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona las empresas del sistema
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEditingEmpresa(null);
              setShowCreateForm(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Empresa
          </Button>
        </div>

        {/* Filtros */}
        <EmpresaFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Formulario de creación/edición */}
        {showCreateForm && (
          <EmpresaForm
            empresa={editingEmpresa || undefined}
            mode={editingEmpresa ? 'edit' : 'create'}
            onSubmit={handleCreateSubmit}
            onCancel={() => {
              setShowCreateForm(false);
              setEditingEmpresa(null);
            }}
            loading={createEmpresaMutation.isPending || updateEmpresaMutation.isPending}
          />
        )}

        {/* Tabla de empresas */}
        {isLoading ? (
          <Card>
            <div className="p-8 text-center">
              <LoadingSpinner />
            </div>
          </Card>
        ) : error ? (
          <ApiErrorDisplay error={error} />
        ) : (
          <EmpresasTable
            empresas={empresas}
            onView={handleView}
            onEdit={handleEdit}
          />
        )}

        {/* Estadísticas rápidas */}
        {empresas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="p-4">
                <div className="text-sm text-gray-600">Total Empresas</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {empresas.length}
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <div className="text-sm text-gray-600">Empresas Activas</div>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {empresas.filter((e) => e.activo).length}
                </div>
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <div className="text-sm text-gray-600">Empresas Inactivas</div>
                <div className="text-2xl font-bold text-red-600 mt-1">
                  {empresas.filter((e) => !e.activo).length}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

