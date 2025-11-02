import { useState, useEffect, useCallback } from 'react';
import { emitterService } from '@/lib/api';
import { Emitter, PaginationParams, PaginatedResponse } from '@/types';

interface UseEmittersReturn {
  emitters: Emitter[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  };
  setFilters: (filters: Partial<UseEmittersReturn['filters']>) => void;
  setPage: (page: number) => void;
  refreshEmitters: () => void;
}

const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 25,
  SORT_BY: 'total_facturas',
  SORT_ORDER: 'DESC' as const,
};

const VALID_SORT_FIELDS = [
  'emisor_nombre',
  'emisor_ruc',
  'total_facturas',
  'monto_total',
  'promedio_factura',
  'ultima_factura',
  'confianza_promedio',
];

export function useEmitters(): UseEmittersReturn {
  const [emitters, setEmitters] = useState<Emitter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: PAGINATION_DEFAULTS.PAGE,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: PAGINATION_DEFAULTS.LIMIT,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFiltersState] = useState({
    search: '',
    sortBy: PAGINATION_DEFAULTS.SORT_BY,
    sortOrder: PAGINATION_DEFAULTS.SORT_ORDER,
  });

  const fetchEmitters = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: PaginationParams = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      const response = await emitterService.getAll(params);
      
      if (response.success && response.data) {
        setEmitters(response.data || []);
        setPagination({
          currentPage: response.pagination?.currentPage || 1,
          totalPages: response.pagination?.totalPages || 1,
          totalItems: response.pagination?.totalItems || 0,
          itemsPerPage: response.pagination?.itemsPerPage || 25,
          hasNextPage: response.pagination?.hasNextPage || false,
          hasPrevPage: response.pagination?.hasPrevPage || false,
        });
      } else {
        setEmitters([]);
        setError('Error al cargar los emisores');
      }
    } catch (apiError: unknown) {
      console.error('Error fetching emitters:', apiError);
      setEmitters([]);
      setError('Error al cargar los emisores');
      
      // Reset pagination on error
      setPagination({
        currentPage: PAGINATION_DEFAULTS.PAGE,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: PAGINATION_DEFAULTS.LIMIT,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, filters.sortBy, filters.sortOrder]);

  const setFilters = useCallback((newFilters: Partial<UseEmittersReturn['filters']>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when filters change
  }, []);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  const refreshEmitters = useCallback(() => {
    fetchEmitters();
  }, [fetchEmitters]);

  useEffect(() => {
    fetchEmitters();
  }, [fetchEmitters]);

  return {
    emitters,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    setPage,
    refreshEmitters,
  };
} 