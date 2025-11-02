import { useState, useCallback } from 'react';

interface SearchQuery {
  raw: string;
  filters: {
    numero?: string;
    emisor?: string;
    fecha?: string;
    monto?: string;
    estado?: string;
  };
  hasFilters: boolean;
}

interface UseAdvancedSearchReturn {
  query: SearchQuery;
  setQuery: (query: string) => void;
  clearQuery: () => void;
  parseQuery: (rawQuery: string) => SearchQuery;
}

export const useAdvancedSearch = (): UseAdvancedSearchReturn => {
  const [query, setQueryState] = useState<SearchQuery>({
    raw: '',
    filters: {},
    hasFilters: false
  });

  const parseQuery = useCallback((rawQuery: string): SearchQuery => {
    const filters: SearchQuery['filters'] = {};
    let hasFilters = false;

    // Patrones de búsqueda avanzada
    const patterns = [
      { key: 'numero', pattern: /numero:([^\s]+)/i },
      { key: 'emisor', pattern: /emisor:([^\s]+)/i },
      { key: 'fecha', pattern: /fecha:([^\s]+)/i },
      { key: 'monto', pattern: /monto:([^\s]+)/i },
      { key: 'estado', pattern: /estado:([^\s]+)/i }
    ];

    // Extraer filtros del query
    patterns.forEach(({ key, pattern }) => {
      const match = rawQuery.match(pattern);
      if (match) {
        filters[key as keyof SearchQuery['filters']] = match[1];
        hasFilters = true;
      }
    });

    return {
      raw: rawQuery,
      filters,
      hasFilters
    };
  }, []);

  const setQuery = useCallback((rawQuery: string) => {
    const parsedQuery = parseQuery(rawQuery);
    setQueryState(parsedQuery);
  }, [parseQuery]);

  const clearQuery = useCallback(() => {
    setQueryState({
      raw: '',
      filters: {},
      hasFilters: false
    });
  }, []);

  return {
    query,
    setQuery,
    clearQuery,
    parseQuery
  };
}; 