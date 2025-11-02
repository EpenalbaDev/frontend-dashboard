'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import InvoiceFilters from '@/components/invoices/InvoiceFilters';
import InvoicesTable from '@/components/invoices/InvoicesTable';
import GlobalSearch from '@/components/invoices/GlobalSearch';
import SearchResults from '@/components/invoices/SearchResults';
import Button from '@/components/ui/Button';
import { useInvoices } from '@/hooks/useInvoices';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';
import { Invoice } from '@/types';
import { FileText, Plus, RefreshCw } from 'lucide-react';

export default function InvoicesPage() {
  const router = useRouter();
  const {
    invoices,
    loading,
    error,
    filters,
    searchQuery,
    pagination,
    sortConfig,
    setFilters,
    setSearchQuery,
    setPagination,
    setSort,
    refresh
  } = useInvoices();

  const { query: advancedQuery, setQuery: setAdvancedQuery, clearQuery: clearAdvancedQuery } = useAdvancedSearch();

  const handleViewInvoice = (invoice: Invoice) => {
    router.push(`/invoices/${invoice.id}`);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    // TODO: Abrir modal de edición de estado
    console.log('Editar factura:', invoice.id);
    alert(`Editar estado de la factura: ${invoice.numero_factura}`);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // TODO: Implementar descarga de factura
    console.log('Descargar factura:', invoice.id);
    alert(`Descargar factura: ${invoice.numero_factura}`);
  };

  const handlePageChange = (page: number) => {
    setPagination({ page });
  };

  const handleLimitChange = (limit: number) => {
    setPagination({ limit, page: 1 });
  };

  // Helper function to count invoices by status
  const countInvoicesByStatus = (targetStatus: string): number => {
    return invoices.filter(inv => inv.estado === targetStatus).length;
  };

  // Handle advanced search
  const handleAdvancedSearch = (query: string) => {
    setAdvancedQuery(query);
    setSearchQuery(query);
  };

  const handleClearAdvancedSearch = () => {
    clearAdvancedQuery();
    setSearchQuery('');
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const activeFilters: string[] = [];
    if (filters.estado) activeFilters.push(`Estado: ${filters.estado}`);
    if (filters.fechaInicio) activeFilters.push(`Desde: ${filters.fechaInicio}`);
    if (filters.fechaFin) activeFilters.push(`Hasta: ${filters.fechaFin}`);
    if (filters.emisor_ruc) activeFilters.push(`RUC: ${filters.emisor_ruc}`);
    if (filters.subtotal_min) activeFilters.push(`Monto min: ${filters.subtotal_min}`);
    if (filters.subtotal_max) activeFilters.push(`Monto max: ${filters.subtotal_max}`);
    if (filters.confianza_ocr) activeFilters.push(`OCR min: ${filters.confianza_ocr}%`);
    return activeFilters;
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  Facturas
                </h1>
                {process.env.NODE_ENV === 'development' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Modo Desarrollo
                  </span>
                )}

              </div>
              <p className="text-gray-600 mt-1">
                Gestiona y revisa todas las facturas del sistema
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={refresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Factura
              </Button>
            </div>
          </div>

          {/* Resumen rápido */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Facturas</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {countInvoicesByStatus('pendiente')}
                  </p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <FileText className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Procesadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {countInvoicesByStatus('procesado')}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Con Errores</p>
                  <p className="text-2xl font-bold text-red-600">
                    {countInvoicesByStatus('error')}
                  </p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Búsqueda global */}
          <GlobalSearch
            onSearch={handleAdvancedSearch}
            searchQuery={searchQuery}
            onClear={handleClearAdvancedSearch}
          />

          {/* Resultados de búsqueda */}
          <SearchResults
            query={searchQuery}
            totalResults={pagination.total}
            activeFilters={getActiveFilters()}
            onClearSearch={handleClearAdvancedSearch}
          />

          {/* Filtros */}
          <InvoiceFilters
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
          />

          {/* Tabla */}
          <InvoicesTable
            invoices={invoices}
            loading={loading}
            error={error}
            sortConfig={sortConfig}
            onSort={setSort}
            onViewInvoice={handleViewInvoice}
            onEditInvoice={handleEditInvoice}
            onDownloadInvoice={handleDownloadInvoice}
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 