import axios from 'axios';
import { 
  User, 
  Invoice, 
  Emitter, 
  EmitterDetail,
  DashboardOverview,
  DashboardMetrics,
  DashboardCharts,
  DashboardData,
  DashboardReporte,
  ReporteVentas,
  ReporteOCR,
  ReporteActividadEmisores,
  ExportRequest,
  Empresa,
  EmpresaCreateData,
  EmpresaUpdateData
} from '@/types';
import { decryptToken, isTokenEncrypted } from '@/utils/encryption';

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

console.log('API Base URL:', API_BASE_URL);

// Flag para verificar si la API está disponible
let apiAvailable = true;

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      
      if (process.env.NODE_ENV === 'development') {
        console.log('=== AXIOS REQUEST INTERCEPTOR ===');
        console.log('URL:', config.url);
        console.log('Method:', config.method);
      }
      
      if (storedToken) {
        let actualToken = storedToken;
        
        // Si está encriptado, desencriptarlo
        if (isTokenEncrypted(storedToken)) {
          actualToken = decryptToken(storedToken);
          if (!actualToken) {
            console.warn('Failed to decrypt token, removing...');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            return config;
          }
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Has token:', !!actualToken);
          console.log('Token encrypted:', isTokenEncrypted(storedToken));
          console.log('Token length:', actualToken.length);
          console.log('Token preview:', `${actualToken.substring(0, 20)}...`);
        }
        
        if (config.headers) {
          config.headers.Authorization = `Bearer ${actualToken}`;
          if (process.env.NODE_ENV === 'development') {
            console.log('Authorization header set:', `Bearer ${actualToken.substring(0, 20)}...`);
          }
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.log('No token found');
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('=== END INTERCEPTOR ===');
      }
    }
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Request interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Response interceptor:', { 
        url: response.config?.url, 
        status: response.status 
      });
    }
    return response;
  },
  (error) => {
    // Manejo muy seguro de errores
    let errorInfo: Record<string, unknown> = {
      type: 'unknown',
      message: 'Unknown error occurred'
    };

    try {
      if (error) {
        errorInfo = {
          type: error.name || 'Error',
          message: error.message || 'No message available',
          url: error.config?.url || 'No URL',
          method: error.config?.method || 'No method',
          status: error.response?.status || 'No status',
          statusText: error.response?.statusText || 'No status text'
        };
      }
    } catch {
      errorInfo = {
        type: 'ErrorParsingError',
        message: 'Could not parse error object',
        originalError: String(error)
      };
    }
    
    // Marcar API como no disponible según el tipo de error
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || !error.response) {
      apiAvailable = false;
      if (process.env.NODE_ENV === 'development') {
        console.warn('API appears to be unavailable. Running in offline mode.');
      }
    } else if (error.response?.status === 429) {
      // Rate limiting - la API está disponible pero temporalmente limitada
      apiAvailable = true;
      if (process.env.NODE_ENV === 'development') {
        console.warn('API rate limit exceeded. Consider implementing request throttling.');
      }
    } else {
      apiAvailable = true;
    }

    if (process.env.NODE_ENV === 'development') {
      console.error('API Response Error:', errorInfo);
      if (error?.response?.data) {
        console.error('Response Data:', error.response.data);
      }
    }

    // Emitir evento personalizado para el indicador de estado
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('api-error', { 
        detail: error 
      }));
    }
    
    // Solo redirigir si no estamos en la página de login Y no estamos en desarrollo
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      if (currentPath !== '/login' && !isDevelopment) {
        console.log('Unauthorized, redirecting to login...');
        // Token expirado o inválido
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (isDevelopment) {
        console.log('Development mode: Not redirecting on 401 error');
      }
    }
    return Promise.reject(error);
  }
);

// Verificar si la API está disponible
export const isApiAvailable = () => apiAvailable;

// Tipos de respuesta base
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Servicios de autenticación
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post<ApiResponse>('/auth/logout');
    return response.data;
  },

  me: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  verify: async () => {
    const response = await api.get<ApiResponse<{ valid: boolean; user: User; expires_at: string }>>('/auth/verify');
    return response.data;
  },

  createUser: async (data: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol?: string;
    empresa_id?: number | null;
  }) => {
    const response = await api.post<ApiResponse<User>>('/auth/users', data);
    return response.data;
  },
};

// Servicios de facturas
export const invoiceService = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<Invoice[]>>('/facturas', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Invoice>>(`/facturas/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string, comment?: string) => {
    const response = await api.put<ApiResponse<{ estadoAnterior: string; estadoNuevo: string; comentario: string; actualizado_en: string }>>(`/facturas/${id}/estado`, {
      estado: status,
      comentario: comment,
    });
    return response.data;
  },

  search: async (query: string, filters?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<Invoice[]>>('/facturas/search', {
      params: { search: query, ...filters },
    });
    return response.data;
  },

  getSuggestions: async (query: string, type?: string) => {
    const response = await api.get<ApiResponse<{ emisores: unknown[]; facturas: unknown[]; items: unknown[] }>>('/facturas/suggestions', {
      params: { search: query, tipo: type },
    });
    return response.data;
  },
};

// Servicios de emisores
export const emitterService = {
  getAll: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<Emitter[]>>('/emisores', { params });
    return response.data;
  },

  getTop: async (metric?: string, limit?: number, filters?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<Emitter[]>>('/emisores/top', {
      params: { metric, limit, ...filters },
    });
    return response.data;
  },

  getByRuc: async (ruc: string) => {
    const response = await api.get<ApiResponse<Emitter>>(`/emisores/${ruc}`);
    return response.data;
  },

  getEmitterDetail: async (ruc: string) => {
    const response = await api.get<ApiResponse<EmitterDetail>>(`/emisores/${ruc}`);
    return response.data;
  },

  getInvoices: async (ruc: string, params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<Invoice[]>>(`/emisores/${ruc}/facturas`, { params });
    return response.data;
  },
};

// Servicios de dashboard
export const dashboardService = {
  getOverview: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<DashboardOverview>>('/dashboard/overview', { params });
    return response.data;
  },

  getMetrics: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<DashboardMetrics>>('/dashboard/metrics', { params });
    return response.data;
  },

  getCharts: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<DashboardCharts>>('/dashboard/charts', { params });
    return response.data;
  },

  getAlerts: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<unknown>>('/dashboard/alertas', { params });
    return response.data;
  },

  getPerformance: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<unknown>>('/dashboard/performance', { params });
    return response.data;
  },

  getAllData: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<DashboardData>>('/dashboard/data', { params });
    return response.data;
  },
};

// Servicios de reportes
export const reportService = {
  getDashboard: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<DashboardReporte>>('/reportes/dashboard', { params });
    return response.data;
  },

  getVentas: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<ReporteVentas>>('/reportes/ventas', { params });
    return response.data;
  },

  getITBMS: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<unknown>>('/reportes/itbms', { params });
    return response.data;
  },

  getOCRPerformance: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<ReporteOCR>>('/reportes/ocr-performance', { params });
    return response.data;
  },

  getActividadEmisores: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<ReporteActividadEmisores>>('/reportes/actividad-emisores', { params });
    return response.data;
  },

  exportReport: async (data: ExportRequest) => {
    const response = await api.post<ApiResponse<{ download_url: string }>>('/reportes/export', data);
    return response.data;
  },
};

// Servicios de empresas
export const empresaService = {
  getAll: async (params?: {
    limit?: number;
    offset?: number;
    activo?: boolean;
    plan?: string;
    search?: string;
  }) => {
    const response = await api.get<ApiResponse<Empresa[]>>('/empresas', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Empresa>>(`/empresas/${id}`);
    return response.data;
  },

  getByRuc: async (ruc: string) => {
    const response = await api.get<ApiResponse<Empresa>>(`/empresas/ruc/${ruc}`);
    return response.data;
  },

  create: async (data: EmpresaCreateData) => {
    const response = await api.post<ApiResponse<Empresa>>('/empresas', data);
    return response.data;
  },

  update: async (id: number, data: EmpresaUpdateData) => {
    const response = await api.put<ApiResponse<Empresa>>(`/empresas/${id}`, data);
    return response.data;
  },

  getUsers: async (empresaId: number, params?: {
    limit?: number;
    offset?: number;
  }) => {
    const response = await api.get<ApiResponse<User[]>>(`/empresas/${empresaId}/usuarios`, { params });
    return response.data;
  },

  count: async (params?: { activo?: boolean }) => {
    const response = await api.get<ApiResponse<{ total: number }>>('/empresas/count', { params });
    return response.data;
  },
};

export default api; 