import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { InvoiceFilters, InvoiceStatus } from '@/types';
import { Search, Filter, X, Calendar, DollarSign, User, BarChart } from 'lucide-react';

interface InvoiceFiltersProps {
  filters: InvoiceFilters;
  onFiltersChange: (filters: InvoiceFilters) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

const InvoiceFiltersComponent: React.FC<InvoiceFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  searchQuery
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState<InvoiceFilters>(filters);

  const statusOptions: { value: InvoiceStatus; label: string; color: string }[] = [
    { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'procesado', label: 'Procesado', color: 'bg-green-100 text-green-800' },
    { value: 'error', label: 'Error', color: 'bg-red-100 text-red-800' },
    { value: 'revision', label: 'En Revisión', color: 'bg-gray-100 text-gray-800' },
  ];

  const handleFilterChange = (key: keyof InvoiceFilters, value: string | number | undefined) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const emptyFilters: InvoiceFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    onSearch('');
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== undefined && value !== '');

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* Búsqueda principal */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar por número de factura, emisor o RUC..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showAdvanced ? 'Ocultar filtros' : 'Filtros avanzados'}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Filtros rápidos por estado */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-2 py-2">
            <BarChart className="h-4 w-4" />
            Filtros rápidos:
          </span>
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => {
                const newStatus = localFilters.estado === status.value ? undefined : status.value;
                handleFilterChange('estado', newStatus);
                onFiltersChange({ ...localFilters, estado: newStatus });
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                localFilters.estado === status.value
                  ? status.color + ' border-current'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Filtros avanzados */}
        {showAdvanced && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Filtro por fechas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha desde
                </label>
                <Input
                  type="date"
                  value={localFilters.fechaInicio || ''}
                  onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha hasta
                </label>
                <Input
                  type="date"
                  value={localFilters.fechaFin || ''}
                  onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                />
              </div>

              {/* Filtro por emisor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  RUC del emisor
                </label>
                <Input
                  type="text"
                  placeholder="ej: 12345678-1-123456"
                  value={localFilters.emisor_ruc || ''}
                  onChange={(e) => handleFilterChange('emisor_ruc', e.target.value)}
                />
              </div>

              {/* Filtro por monto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Monto mínimo
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={localFilters.subtotal_min || ''}
                  onChange={(e) => handleFilterChange('subtotal_min', parseFloat(e.target.value) || undefined)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Monto máximo
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={localFilters.subtotal_max || ''}
                  onChange={(e) => handleFilterChange('subtotal_max', parseFloat(e.target.value) || undefined)}
                />
              </div>

              {/* Filtro por confianza OCR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confianza OCR mínima (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="80"
                  value={localFilters.confianza_ocr || ''}
                  onChange={(e) => handleFilterChange('confianza_ocr', parseInt(e.target.value) || undefined)}
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" onClick={clearFilters}>
                Limpiar filtros
              </Button>
              <Button onClick={applyFilters}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        )}

        {/* Indicadores de filtros activos */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
              {localFilters.estado && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Estado: {statusOptions.find(s => s.value === localFilters.estado)?.label}
                  <button
                    onClick={() => handleFilterChange('estado', undefined)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                    title="Quitar filtro de estado"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {localFilters.fechaInicio && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Desde: {localFilters.fechaInicio}
                  <button
                    onClick={() => handleFilterChange('fechaInicio', undefined)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                    title="Quitar filtro de fecha desde"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {localFilters.fechaFin && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Hasta: {localFilters.fechaFin}
                  <button
                    onClick={() => handleFilterChange('fechaFin', undefined)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                    title="Quitar filtro de fecha hasta"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {localFilters.emisor_ruc && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  RUC: {localFilters.emisor_ruc}
                  <button
                    onClick={() => handleFilterChange('emisor_ruc', undefined)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                    title="Quitar filtro de RUC"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceFiltersComponent;