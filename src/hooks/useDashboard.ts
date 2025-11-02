import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/lib/api';

export interface DashboardData {
  overview: {
    total_facturas: number;
    facturas_mes_actual: number;
    total_monto: number;
    monto_mes_actual: number;
    promedio_factura: number;
    facturas_pendientes: number;
    facturas_procesadas: number;
    facturas_error: number;
    facturas_revisadas: number;
    confianza_ocr_promedio: number;
    emisores_activos: number;
    alertas: unknown[];
  };
  charts: {
    facturas_por_mes: Array<{
      mes: string;
      cantidad: number;
      monto_total: number;
    }>;
    top_emisores: Array<{
      emisor: string;
      ruc: string;
      cantidad: number;
      monto: number;
    }>;
    distribucion_estado: Array<{
      estado: string;
      cantidad: number;
      porcentaje: number;
    }>;
    actividad_semanal: Array<{
      dia: string;
      cantidad: number;
    }>;
    tendencia_ocr: Array<{
      fecha: string;
      confianza: number;
      total: number;
    }>;
  };
  alertas: unknown[];
  timestamp: string;
}

export const useDashboard = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['dashboard', params],
    queryFn: async () => {
      // Usar el endpoint /dashboard/data que incluye todos los datos
      const response = await dashboardService.getAllData(params);
      if (!response.success) {
        throw new Error(response.message || 'Error al cargar datos del dashboard');
      }
      return response.data as DashboardData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
}; 