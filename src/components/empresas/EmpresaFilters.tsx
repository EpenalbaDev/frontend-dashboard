'use client';

import React from 'react';
import { EmpresaFilters } from '@/types';
import Input from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Search, X } from 'lucide-react';

interface EmpresaFiltersProps {
  filters: EmpresaFilters;
  onFilterChange: (filters: EmpresaFilters) => void;
  onReset: () => void;
}

const EmpresaFiltersComponent: React.FC<EmpresaFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const handleSearchChange = (value: string) => {
    onFilterChange({
      ...filters,
      search: value || undefined,
    });
  };

  const handleActivoChange = (value: string) => {
    onFilterChange({
      ...filters,
      activo: value === 'all' ? undefined : value === 'true',
    });
  };

  const handlePlanChange = (value: string) => {
    onFilterChange({
      ...filters,
      plan: value === 'all' ? undefined : value,
    });
  };

  return (
    <Card>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nombre o RUC..."
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={
                filters.activo === undefined
                  ? 'all'
                  : filters.activo
                  ? 'true'
                  : 'false'
              }
              onChange={(e) => handleActivoChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filtrar por estado"
            >
              <option value="all">Todos</option>
              <option value="true">Activas</option>
              <option value="false">Inactivas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan
            </label>
            <select
              value={filters.plan || 'all'}
              onChange={(e) => handlePlanChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filtrar por plan"
            >
              <option value="all">Todos</option>
              <option value="basico">Básico</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>

        {(filters.search || filters.activo !== undefined || filters.plan) && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={onReset}
            >
              <X className="w-4 h-4 mr-1" />
              Limpiar Filtros
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EmpresaFiltersComponent;

