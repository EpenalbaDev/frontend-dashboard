'use client';

import React from 'react';
import { AlertTriangle, X, Copy, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ApiErrorDisplayProps {
  error: Error | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  title?: string;
}

const ApiErrorDisplay: React.FC<ApiErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  onDismiss,
  title = "Error de API" 
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!error || !isDevelopment) {
    return null;
  }

  const copyToClipboard = () => {
    const errorText = `
Error: ${error.message}
Stack: ${error.stack}
Time: ${new Date().toISOString()}
    `.trim();
    
    navigator.clipboard.writeText(errorText);
  };

  return (
    <Card className="border-red-200 bg-red-50 mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span>{title}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                title="Reintentar"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={copyToClipboard}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
              title="Copiar error"
            >
              <Copy className="h-4 w-4" />
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                title="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-red-800 mb-1">Mensaje:</h4>
            <p className="text-sm text-red-700 bg-red-100 p-2 rounded">
              {error.message}
            </p>
          </div>
          
          {error.stack && (
            <div>
              <h4 className="font-medium text-red-800 mb-1">Stack Trace:</h4>
              <pre className="text-xs text-red-700 bg-red-100 p-2 rounded overflow-x-auto">
                {error.stack}
              </pre>
            </div>
          )}
          
          <div className="text-xs text-red-600">
            <p>🛠️ Modo desarrollo: Los errores se muestran para facilitar el debugging</p>
            <p>⏰ {new Date().toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiErrorDisplay; 