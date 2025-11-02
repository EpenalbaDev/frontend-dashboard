'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentInvoices from '@/components/dashboard/RecentInvoices';
import TopEmitters from '@/components/dashboard/TopEmitters';
import ApiErrorDisplay from '@/components/ui/ApiErrorDisplay';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { data: dashboardData, isLoading, error, refetch } = useDashboard();
  const { user, isAuthenticated } = useAuth();

  // Datos de ejemplo si no hay datos reales
  const fallbackData = {
    overview: {
      total_facturas: 1234,
      facturas_mes_actual: 45,
      total_monto: 45678,
      monto_mes_actual: 1234,
      promedio_factura: 37.02,
      facturas_pendientes: 23,
      facturas_procesadas: 1150,
      facturas_error: 15,
      facturas_revisadas: 46,
      confianza_ocr_promedio: 92.5,
      emisores_activos: 156,
      alertas: [],
    },
    charts: {
      facturas_por_mes: [
        {
          mes: '2025-07',
          cantidad: 45,
          monto_total: 1234,
        },
      ],
      top_emisores: [
        {
          emisor: 'Empresa ABC S.A.',
          ruc: '123456789',
          cantidad: 45,
          monto: 125000,
        },
        {
          emisor: 'Comercial XYZ Ltda.',
          ruc: '987654321',
          cantidad: 32,
          monto: 89000,
        },
      ],
      distribucion_estado: [
        {
          estado: 'procesado',
          cantidad: 1150,
          porcentaje: 80,
        },
        {
          estado: 'pendiente',
          cantidad: 23,
          porcentaje: 2,
        },
        {
          estado: 'revision',
          cantidad: 46,
          porcentaje: 3,
        },
        {
          estado: 'error',
          cantidad: 15,
          porcentaje: 1,
        },
      ],
      actividad_semanal: [
        { dia: 'Monday', cantidad: 10 },
        { dia: 'Tuesday', cantidad: 15 },
        { dia: 'Wednesday', cantidad: 12 },
        { dia: 'Thursday', cantidad: 8 },
        { dia: 'Friday', cantidad: 5 },
      ],
      tendencia_ocr: [
        {
          fecha: '2025-07-20',
          confianza: 92,
          total: 45,
        },
      ],
    },
    alertas: [],
    timestamp: new Date().toISOString(),
  };

  const data = dashboardData || fallbackData;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Bienvenido al sistema de gestión de facturas
            </p>
          </div>

          {/* Métricas principales */}
          <DashboardStats 
            stats={{
              totalFacturas: data.overview.total_facturas,
              montoTotal: data.overview.total_monto,
              facturasPendientes: data.overview.facturas_pendientes,
              emisoresActivos: data.overview.emisores_activos,
              crecimientoFacturas: data.overview.facturas_mes_actual,
              crecimientoMonto: data.overview.monto_mes_actual,
            }} 
            isLoading={isLoading} 
          />

          {/* Contenido adicional */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Facturas Recientes - Por ahora usamos datos de ejemplo */}
            <RecentInvoices 
              invoices={[]} 
              isLoading={isLoading} 
            />

            {/* Emisores Principales */}
            <TopEmitters 
              emitters={(data.charts.top_emisores || []).map((emisor: { ruc: string; emisor: string; cantidad: number; monto: number }) => ({
                ruc: emisor.ruc,
                nombre: emisor.emisor,
                totalFacturas: emisor.cantidad,
                montoTotal: emisor.monto,
              }))} 
              isLoading={isLoading} 
            />
          </div>

          {/* Display de errores en desarrollo */}
          <ApiErrorDisplay 
            error={error} 
            onRetry={refetch}
            title="Error al cargar datos del dashboard"
          />

          {/* Información de debug en desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Debug Info:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Usuario autenticado: {isAuthenticated ? 'Sí' : 'No'}</p>
                <p>Usuario: {user?.name || 'No disponible'}</p>
                <p>Email: {user?.email || 'No disponible'}</p>
                <p>Token en localStorage: {typeof window !== 'undefined' && localStorage.getItem('auth_token') ? 'Sí' : 'No'}</p>
                <p>Longitud del token: {typeof window !== 'undefined' && localStorage.getItem('auth_token') ? localStorage.getItem('auth_token')!.length : 0}</p>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const token = localStorage.getItem('auth_token');
                      console.log('Token completo:', token);
                      console.log('Headers que se enviarían:', {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      });
                    }
                  }}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  Log Token Info
                </button>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 