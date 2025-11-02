import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Search, X, FileText, User, Calendar, DollarSign, Filter } from 'lucide-react';

interface GlobalSearchProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  onClear: () => void;
  placeholder?: string;
}

interface SearchSuggestion {
  type: 'invoice' | 'emitter' | 'date' | 'amount';
  label: string;
  value: string;
  icon: React.ReactNode;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  onSearch,
  searchQuery,
  onClear,
  placeholder = "Buscar facturas, emisores, fechas..."
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sugerencias de búsqueda
  const searchSuggestions: SearchSuggestion[] = [
    {
      type: 'invoice',
      label: 'Buscar por número de factura',
      value: 'numero:',
      icon: <FileText className="h-4 w-4" />
    },
    {
      type: 'emitter',
      label: 'Buscar por emisor',
      value: 'emisor:',
      icon: <User className="h-4 w-4" />
    },
    {
      type: 'date',
      label: 'Buscar por fecha',
      value: 'fecha:',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      type: 'amount',
      label: 'Buscar por monto',
      value: 'monto:',
      icon: <DollarSign className="h-4 w-4" />
    }
  ];

  // Filtros rápidos
  const quickFilters = [
    { label: 'Pendientes', value: 'estado:pendiente', color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Procesadas', value: 'estado:procesado', color: 'bg-green-100 text-green-800' },
    { label: 'Con Errores', value: 'estado:error', color: 'bg-red-100 text-red-800' },
    { label: 'En Revisión', value: 'estado:revision', color: 'bg-blue-100 text-blue-800' }
  ];

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const newQuery = suggestion.value;
    setLocalQuery(newQuery);
    handleSearch(newQuery);
    inputRef.current?.focus();
  };

  const handleQuickFilterClick = (filterValue: string) => {
    setLocalQuery(filterValue);
    handleSearch(filterValue);
  };

  const handleClear = () => {
    setLocalQuery('');
    onClear();
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(localQuery);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
    setIsExpanded(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Barra de búsqueda principal */}
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={placeholder}
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onKeyDown={handleKeyDown}
                  className="pl-10 pr-10"
                />
                                 {localQuery && (
                   <button
                     onClick={handleClear}
                     aria-label="Limpiar búsqueda"
                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                   >
                     <X className="h-4 w-4" />
                   </button>
                 )}
              </div>
              <Button
                onClick={() => handleSearch(localQuery)}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Buscar
              </Button>
            </div>

            {/* Sugerencias de búsqueda */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 mb-2 px-2">Sugerencias de búsqueda:</div>
                  <div className="space-y-1">
                    {searchSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.type}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-50 rounded-md transition-colors"
                      >
                        {suggestion.icon}
                        <div>
                          <div className="font-medium text-gray-900">{suggestion.label}</div>
                          <div className="text-xs text-gray-500">Ejemplo: {suggestion.value}valor</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filtros rápidos */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2 py-1">
              <Filter className="h-4 w-4" />
              Filtros rápidos:
            </span>
            {quickFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleQuickFilterClick(filter.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                  localQuery === filter.value
                    ? filter.color + ' border-current'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Información de ayuda */}
          {isExpanded && (
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
              <div className="font-medium mb-1">Consejos de búsqueda:</div>
              <ul className="space-y-1">
                <li>• <strong>numero:123</strong> - Buscar por número de factura</li>
                <li>• <strong>emisor:Cable</strong> - Buscar por nombre del emisor</li>
                <li>• <strong>fecha:2024-01</strong> - Buscar por fecha</li>
                                 <li>• <strong>monto:{'>'}1000</strong> - Buscar facturas con monto mayor a 1000</li>
                <li>• <strong>estado:pendiente</strong> - Filtrar por estado</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalSearch; 