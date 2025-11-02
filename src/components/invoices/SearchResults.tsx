import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Search, Filter, X } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  totalResults: number;
  searchTime?: number;
  activeFilters: string[];
  onClearSearch: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  totalResults,
  searchTime,
  activeFilters,
  onClearSearch
}) => {
  if (!query && activeFilters.length === 0) {
    return null;
  }

  const highlightQuery = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">
                Resultados de búsqueda
              </span>
            </div>
            
            {query && (
              <div className="text-sm text-gray-600">
                <span>Búsqueda: </span>
                <span className="font-medium">{highlightQuery(query, query)}</span>
              </div>
            )}

            <div className="text-sm text-gray-600">
              <span>{totalResults} factura{totalResults !== 1 ? 's' : ''} encontrada{totalResults !== 1 ? 's' : ''}</span>
              {searchTime && (
                <span className="ml-2 text-gray-500">
                  ({searchTime}ms)
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClearSearch}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
            Limpiar búsqueda
          </button>
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {activeFilters.map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchResults; 