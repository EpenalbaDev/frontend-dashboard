import React from 'react';
import { Invoice, PaginationParams, InvoiceStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  Eye, 
  Edit, 
  Download, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  FileText,
  Calendar,
  User,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils';
import { getOcrConfidenceColor } from '@/config/api';

interface InvoicesTableProps {
  invoices: Invoice[];
  loading?: boolean;
  error?: string | null;
  sortConfig: {
    key: keyof Invoice | null;
    direction: 'asc' | 'desc';
  };
  onSort: (key: keyof Invoice) => void;
  onViewInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDownloadInvoice: (invoice: Invoice) => void;
  pagination: PaginationParams & { 
    total: number; 
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({
  invoices,
  loading = false,
  error = null,
  sortConfig,
  onSort,
  onViewInvoice,
  onEditInvoice,
  onDownloadInvoice,
  pagination,
  onPageChange,
  onLimitChange,
}) => {
  const getSortIcon = (columnKey: keyof Invoice) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-blue-600" />
      : <ArrowDown className="h-4 w-4 text-blue-600" />;
  };

  const getConfidenceColorClasses = (confidence: number) => {
    const colors = getOcrConfidenceColor(confidence);
    return `${colors.text} ${colors.bg}`;
  };

  const renderPaginationInfo = () => {
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
    const end = Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.total);
    
    return (
      <div className="text-sm text-gray-700">
        Mostrando <span className="font-medium">{start}</span> a{' '}
        <span className="font-medium">{end}</span> de{' '}
        <span className="font-medium">{pagination.total}</span> facturas
      </div>
    );
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);
    
    let start = Math.max(1, pagination.currentPage - half);
    const end = Math.min(pagination.totalPages, start + maxButtons - 1);
    
    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }
    
    // Botón anterior
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(pagination.currentPage - 1)}
        disabled={!pagination.hasPrevPage}
        className="px-3 py-1"
      >
        Anterior
      </Button>
    );
    
    // Botones de páginas
    for (let i = start; i <= end; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === pagination.currentPage ? "primary" : "outline"}
          size="sm"
          onClick={() => onPageChange(i)}
          className="px-3 py-1"
        >
          {i}
        </Button>
      );
    }
    
    // Botón siguiente
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(pagination.currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className="px-3 py-1"
      >
        Siguiente
      </Button>
    );
    
    return buttons;
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando facturas...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Error al cargar facturas</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error}
          </p>
        </div>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay facturas</h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron facturas que coincidan con los filtros seleccionados.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tabla */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onSort('numero_factura')}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Número de Factura
                    {getSortIcon('numero_factura')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onSort('fecha_factura')}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha
                    {getSortIcon('fecha_factura')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onSort('emisor_nombre')}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Emisor
                    {getSortIcon('emisor_nombre')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onSort('total')}
                >
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total
                    {getSortIcon('total')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onSort('estado')}
                >
                  <div className="flex items-center gap-2">
                    Estado
                    {getSortIcon('estado')}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onSort('confianza_ocr')}
                >
                  <div className="flex items-center gap-2">
                    Confianza OCR
                    {getSortIcon('confianza_ocr')}
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.numero_factura}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {String(invoice.id).slice(0, 8)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(invoice.fecha_factura)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(invoice.fecha_factura).toLocaleDateString('es-PA', { 
                        weekday: 'short' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {invoice.emisor_nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        RUC: {invoice.emisor_ruc}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.total)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Subtotal: {formatCurrency(invoice.subtotal)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={invoice.estado} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColorClasses(invoice.confianza_ocr)}`}>
                      {invoice.confianza_ocr}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewInvoice(invoice)}
                        className="p-2 hover:bg-blue-50 hover:text-blue-600"
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditInvoice(invoice)}
                        className="p-2 hover:bg-yellow-50 hover:text-yellow-600"
                        title="Editar estado"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownloadInvoice(invoice)}
                        className="p-2 hover:bg-green-50 hover:text-green-600"
                        title="Descargar"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Paginación */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
        <div className="flex items-center gap-4">
          {renderPaginationInfo()}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Mostrar:</label>
            <select
              value={pagination.limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              title="Número de facturas por página"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">por página</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {renderPaginationButtons()}
        </div>
      </div>
    </div>
  );
};

export default InvoicesTable;