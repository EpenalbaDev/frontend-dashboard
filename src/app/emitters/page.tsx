'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ApiErrorDisplay from '@/components/ui/ApiErrorDisplay';
import { 
  Search, 
  Filter, 
  Building2, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Eye,
  Calendar,
  Phone,
  MapPin
} from 'lucide-react';
import { useEmitters } from '@/hooks/useEmitters';
import { formatCurrency, formatDate } from '@/utils';

export default function EmittersPage() {
  const router = useRouter();
  const {
    emitters,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    setPage,
    refreshEmitters
  } = useEmitters();

  const handleSearch = (query: string) => {
    setFilters({ search: query });
  };

  const handleSort = (sortBy: string) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    setFilters({ sortBy, sortOrder: newSortOrder });
  };

  const handleViewEmitter = (emisorRuc: string) => {
    router.push(`/emitters/${emisorRuc}`);
  };

  // Calculate summary statistics
  const totalEmitters = pagination.totalItems;
  const totalFacturas = emitters.reduce((sum, emitter) => sum + emitter.total_facturas, 0);
  const totalMonto = emitters.reduce((sum, emitter) => sum + emitter.monto_total, 0);
  const avgFacturas = totalEmitters > 0 ? (totalFacturas / totalEmitters).toFixed(1) : '0';

  if (loading && emitters.length === 0) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emisores</h1>
          <p className="text-gray-600">Gestiona y visualiza todos los emisores de facturas</p>
        </div>
        <Button onClick={refreshEmitters} disabled={loading}>
          <TrendingUp className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Error Display */}
      {error && <ApiErrorDisplay error={new Error(error)} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emisores</CardTitle>
            <Building2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmitters}</div>
            <p className="text-xs text-gray-600">Emisores registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFacturas}</div>
            <p className="text-xs text-gray-600">Facturas procesadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMonto)}</div>
            <p className="text-xs text-gray-600">Valor total facturado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Facturas</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgFacturas}</div>
            <p className="text-xs text-gray-600">Por emisor</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Búsqueda y Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, RUC o dirección..."
                  value={filters.search || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filters.sortBy === 'total_facturas' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleSort('total_facturas')}
              >
                Más Facturas
              </Button>
              <Button
                variant={filters.sortBy === 'monto_total' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleSort('monto_total')}
              >
                Mayor Monto
              </Button>
              <Button
                variant={filters.sortBy === 'ultima_factura' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleSort('ultima_factura')}
              >
                Más Reciente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emitters List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Emisores</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : emitters.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron emisores</h3>
              <p className="text-gray-600">No hay emisores que coincidan con los criterios de búsqueda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {emitters.map((emitter) => (
                <div
                  key={emitter.emisor_ruc}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {emitter.emisor_nombre}
                        </h3>
                        <Badge variant="default" className="text-xs">
                          {emitter.total_facturas} facturas
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{emitter.emisor_direccion}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{emitter.emisor_telefono}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Total: {formatCurrency(emitter.monto_total)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Última: {formatDate(emitter.ultima_factura)}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <span>RUC: {emitter.emisor_ruc}</span>
                        <span>Promedio: {formatCurrency(emitter.promedio_factura)}</span>
                        <span>Confianza: {emitter.confianza_promedio}%</span>
                        {emitter.facturas_pendientes > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {emitter.facturas_pendientes} pendientes
                          </Badge>
                        )}
                        {emitter.facturas_error > 0 && (
                          <Badge variant="danger" className="text-xs">
                            {emitter.facturas_error} errores
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleViewEmitter(emitter.emisor_ruc)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalle
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} a{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de{' '}
                {pagination.totalItems} emisores
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Anterior
                </Button>
                <span className="flex items-center px-3 text-sm">
                  Página {pagination.currentPage} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 