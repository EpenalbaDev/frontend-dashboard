import { useState, useCallback, useEffect } from 'react';
import { Invoice, InvoiceFilters, PaginationParams, PaginatedResponse } from '@/types';
import { invoiceService } from '@/lib/api';

// Configuración de paginación por defecto
const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 25,
  SORT_BY: 'created_at',
  SORT_ORDER: 'DESC' as const,
  MAX_LIMIT: 100,
  VALID_LIMITS: [10, 25, 50, 100]
};

// Mapeo de campos del frontend a campos del backend
const FIELD_MAPPING = {
  invoice: {
    'id': 'id',
    'numero_factura': 'numero_factura',
    'emisor_nombre': 'emisor_nombre',
    'emisor_ruc': 'emisor_ruc',
    'fecha_factura': 'fecha_factura',
    'total': 'total',
    'estado': 'estado',
    'confianza_ocr': 'confianza_ocr',
    'created_at': 'created_at',
    'updated_at': 'updated_at'
  }
};

// Campos válidos para ordenamiento según el backend
const VALID_SORT_FIELDS = {
  invoices: [
    'created_at',
    'fecha_factura',
    'total',
    'numero_factura',
    'emisor_nombre',
    'confianza_ocr',
    'estado'
  ]
};

// Utilidades para mapeo de campos
function mapFrontendFieldToBackend(
  entityType: keyof typeof FIELD_MAPPING,
  frontendField: string
): string {
  const mapping = FIELD_MAPPING[entityType];
  return mapping[frontendField as keyof typeof mapping] || frontendField;
}

function isValidSortField(
  entityType: keyof typeof VALID_SORT_FIELDS,
  field: string
): boolean {
  return VALID_SORT_FIELDS[entityType].includes(field);
}

// Interface para la respuesta del backend que incluye paginación
interface InvoiceApiResponse {
  success: boolean;
  data: Invoice[];
  message?: string;
  error?: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filtros?: {
    page: number;
    limit: number;
    estado?: string;
    fechaInicio?: string;
    fechaFin?: string;
    sortBy: string;
    sortOrder: string;
  };
  query?: string;
  resultados?: number;
}

interface UseInvoicesOptions {
  initialFilters?: InvoiceFilters;
  initialPagination?: Partial<PaginationParams>;
}

interface UseInvoicesReturn {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  filters: InvoiceFilters;
  searchQuery: string;
  pagination: PaginationParams & { 
    total: number; 
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  sortConfig: { key: keyof Invoice | null; direction: 'asc' | 'desc' };
  
  // Actions
  setFilters: (filters: InvoiceFilters) => void;
  setSearchQuery: (query: string) => void;
  setPagination: (pagination: Partial<PaginationParams>) => void;
  setSort: (key: keyof Invoice) => void;
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useInvoices = (options: UseInvoicesOptions = {}): UseInvoicesReturn => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFiltersState] = useState<InvoiceFilters>(options.initialFilters || {});
  const [searchQuery, setSearchQueryState] = useState('');
  
  const [pagination, setPaginationState] = useState<PaginationParams & { 
    total: number; 
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }>({
    page: PAGINATION_DEFAULTS.PAGE,
    limit: PAGINATION_DEFAULTS.LIMIT,
    sortBy: PAGINATION_DEFAULTS.SORT_BY,
    sortOrder: PAGINATION_DEFAULTS.SORT_ORDER,
    total: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 25,
    hasNextPage: false,
    hasPrevPage: false,
    ...options.initialPagination,
  });
  
  const [sortConfig, setSortConfig] = useState<{ key: keyof Invoice | null; direction: 'asc' | 'desc' }>({
    key: 'fecha_factura',
    direction: 'desc'
  });

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Convertir sortOrder a mayúsculas para el backend
      const apiParams = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sortBy: pagination.sortBy,
        sortOrder: pagination.sortOrder,
        search: searchQuery || undefined
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('Fetching invoices with params:', apiParams);
      }

      const response = await invoiceService.getAll(apiParams) as InvoiceApiResponse;
      setInvoices(response.data);
      setPaginationState(prev => ({
        ...prev,
        total: response.pagination.totalItems,
        totalPages: response.pagination.totalPages,
        currentPage: response.pagination.currentPage,
        itemsPerPage: response.pagination.itemsPerPage,
        hasNextPage: response.pagination.hasNextPage,
        hasPrevPage: response.pagination.hasPrevPage,
      }));
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Invoices fetched successfully:', response.data.length, 'items');
      }
    } catch (err: unknown) {
      console.error('Error fetching invoices:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las facturas';
      setError(errorMessage);
      setInvoices([]);
      setPaginationState(prev => ({
        ...prev,
        total: 0,
        totalPages: 0,
        currentPage: 1,
        itemsPerPage: 25,
        hasNextPage: false,
        hasPrevPage: false,
      }));
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, pagination.page, pagination.limit, pagination.sortBy, pagination.sortOrder]);

  // Actualizar configuración de ordenamiento
  const setSort = useCallback((key: keyof Invoice) => {
    const newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    
    setSortConfig({
      key,
      direction: newDirection
    });
    
    // Mapear el campo del frontend al campo del backend
    const backendField = mapFrontendFieldToBackend('invoice', key as string);
    
    // Validar que el campo sea válido para ordenamiento
    const finalSortField = isValidSortField('invoices', backendField) ? backendField : PAGINATION_DEFAULTS.SORT_BY;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Sorting by: ${key} -> ${backendField} -> ${finalSortField} (${newDirection.toUpperCase()})`);
    }
    
    setPaginationState(prev => ({
      ...prev,
      sortBy: finalSortField,
      sortOrder: newDirection.toUpperCase() as 'ASC' | 'DESC',
      page: 1 // Reset to first page when sorting
    }));
  }, [sortConfig]);

  // Setters que resetean la página
  const setFilters = useCallback((newFilters: InvoiceFilters) => {
    setFiltersState(newFilters);
    setPaginationState(prev => ({ ...prev, page: 1 }));
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
    setPaginationState(prev => ({ ...prev, page: 1 }));
  }, []);

  const setPagination = useCallback((newPagination: Partial<PaginationParams>) => {
    setPaginationState(prev => ({ ...prev, ...newPagination }));
  }, []);

  // Funciones de utilidad
  const refetch = useCallback(() => fetchInvoices(), [fetchInvoices]);
  const refresh = useCallback(() => fetchInvoices(), [fetchInvoices]);

  // Efecto para cargar datos iniciales y cuando cambien los parámetros
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  return {
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
    refetch,
    refresh
  };
};