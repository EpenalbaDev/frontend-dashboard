'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { TrendingUp, TrendingDown, DollarSign, FileText, Clock, Building2 } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    totalFacturas: number;
    montoTotal: number;
    facturasPendientes: number;
    emisoresActivos: number;
    crecimientoFacturas?: number;
    crecimientoMonto?: number;
  };
  isLoading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isLoading = false }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PA', {
      style: 'currency',
      currency: 'PAB',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-PA').format(num);
  };

  const getGrowthIcon = (growth?: number) => {
    if (!growth) return null;
    return growth > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getGrowthText = (growth?: number) => {
    if (!growth) return null;
    const sign = growth > 0 ? '+' : '';
    return `${sign}${growth}% desde el mes pasado`;
  };

  const getGrowthColor = (growth?: number) => {
    if (!growth) return 'text-gray-500';
    return growth > 0 ? 'text-green-600' : 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Facturas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Total Facturas
          </CardTitle>
          <FileText className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(stats.totalFacturas)}
          </div>
          <div className="flex items-center space-x-1 text-xs">
            {getGrowthIcon(stats.crecimientoFacturas)}
            <span className={getGrowthColor(stats.crecimientoFacturas)}>
              {getGrowthText(stats.crecimientoFacturas) || 'Este mes'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Monto Total */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Monto Total
          </CardTitle>
          <DollarSign className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.montoTotal)}
          </div>
          <div className="flex items-center space-x-1 text-xs">
            {getGrowthIcon(stats.crecimientoMonto)}
            <span className={getGrowthColor(stats.crecimientoMonto)}>
              {getGrowthText(stats.crecimientoMonto) || 'Este mes'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Facturas Pendientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Pendientes
          </CardTitle>
          <Clock className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(stats.facturasPendientes)}
          </div>
          <p className="text-xs text-gray-500">
            Requieren revisión
          </p>
        </CardContent>
      </Card>

      {/* Emisores Activos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Emisores Activos
          </CardTitle>
          <Building2 className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(stats.emisoresActivos)}
          </div>
          <p className="text-xs text-gray-500">
            Este mes
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats; 