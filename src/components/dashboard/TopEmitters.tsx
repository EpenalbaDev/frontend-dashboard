'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowRight, Building2 } from 'lucide-react';
import { ROUTES } from '@/constants';

interface TopEmitter {
  ruc: string;
  nombre: string;
  totalFacturas: number;
  montoTotal: number;
}

interface TopEmittersProps {
  emitters: TopEmitter[];
  isLoading?: boolean;
}

const TopEmitters: React.FC<TopEmittersProps> = ({ emitters, isLoading = false }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PA', {
      style: 'currency',
      currency: 'PAB',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-PA').format(num);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Emisores Principales</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <span>Emisores Principales</span>
        </CardTitle>
        <Link
          href={ROUTES.EMITTERS}
          className="text-sm text-blue-600 hover:text-blue-500 flex items-center space-x-1"
        >
          <span>Ver todos</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {emitters.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay emisores disponibles</p>
          </div>
        ) : (
          <div className="space-y-4">
            {emitters.slice(0, 5).map((emitter, index) => (
              <div
                key={emitter.ruc}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {emitter.nombre}
                    </div>
                    <div className="text-xs text-gray-500">
                      RUC: {emitter.ruc}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(emitter.montoTotal)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatNumber(emitter.totalFacturas)} facturas
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopEmitters; 