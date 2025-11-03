// Tipos de usuario
export interface User {
  id: number;
  empresa_id: number | null;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'super_admin' | 'admin' | 'usuario' | 'auditor';
  activo?: boolean;
  ultimo_acceso?: string;
  created_at?: string;
  updated_at?: string;
}

// Tipos de autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Tipos de factura - Actualizados para coincidir con el backend
export interface Invoice {
  id: number;
  numero_factura: string;
  emisor_nombre: string;
  emisor_ruc: string;
  receptor_nombre?: string;
  fecha_factura: string;
  subtotal: number;
  descuento: number;
  itbms: number;
  total: number;
  estado: InvoiceStatus;
  confianza_ocr: number;
  procesado_por?: string;
  created_at: string;
  updated_at: string;
}

export type InvoiceStatus = 'pendiente' | 'procesado' | 'error' | 'revision';

// Tipos para items de factura
export interface InvoiceItem {
  id: number;
  factura_id: number;
  codigo: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  precio_unitario: number;
  descuento_item: number;
  impuesto_item: number;
  total_item: number;
  created_at: string;
}

// Tipos para archivos de factura
export interface InvoiceFile {
  id: number;
  factura_id: number;
  nombre_archivo: string;
  tipo_archivo: string;
  s3_url: string;
  tamaño_bytes: number;
  created_at: string;
}

// Tipos para factura detallada (con items y archivos)
export interface InvoiceDetail extends Invoice {
  email_from?: string;
  email_subject?: string;
  email_date?: string;
  s3_key?: string;
  emisor_direccion?: string;
  emisor_telefono?: string;
  receptor_ruc?: string;
  receptor_direccion?: string;
  items: InvoiceItem[];
  archivos: InvoiceFile[];
  raw_data?: {
    id: number;
    factura_id: number;
    raw_json: unknown;
    pdf_text: string | null;
    mistral_response: unknown;
    created_at: string;
  };
  logs?: Array<{
    id: number;
    factura_id: number;
    tipo_evento: string;
    mensaje: string;
    detalles: unknown;
    created_at: string;
  }>;
}

// Tipos de emisor
export interface Emitter {
  emisor_ruc: string;
  emisor_nombre: string;
  emisor_direccion: string;
  emisor_telefono: string;
  total_facturas: number;
  monto_total: number;
  promedio_factura: number;
  primera_factura: string;
  ultima_factura: string;
  ultimo_procesamiento: string;
  facturas_pendientes: number;
  facturas_error: number;
  confianza_promedio: number;
}

export interface EmitterDetail extends Emitter {
  facturas_procesadas: number;
  facturas_revisadas: number;
  confianza_minima: number;
  confianza_maxima: number;
  estadisticas_mensuales: MonthlyStats[];
  top_productos: TopProduct[];
}

export interface MonthlyStats {
  mes: string;
  cantidad_facturas: number;
  monto_total: number;
  promedio_factura: number;
}

export interface TopProduct {
  descripcion: string;
  frecuencia: number;
  cantidad_total: number;
  precio_promedio: number;
}

export interface EmitterInvoice {
  id: number;
  numero_factura: string;
  fecha_factura: string;
  receptor_nombre: string;
  subtotal: number;
  descuento: number;
  itbms: number;
  total: number;
  estado: string;
  confianza_ocr: number;
  created_at: string;
}

export interface EmitterTop {
  emisor_ruc: string;
  emisor_nombre: string;
  total_facturas: number;
  monto_total: number;
  promedio_factura: number;
  ultima_factura: string;
}

// Tipos de reportes
export interface SalesReport {
  period: string;
  totalInvoices: number;
  totalAmount: number;
  averageAmount: number;
  data: SalesData[];
}

export interface SalesData {
  date: string;
  invoices: number;
  amount: number;
}

export interface ITBMSReport {
  month: string;
  year: number;
  totalITBMS: number;
  breakdown: ITBMSBreakdown[];
}

export interface ITBMSBreakdown {
  emitter: Emitter;
  totalITBMS: number;
  invoices: number;
}

export interface ActivityReport {
  period: string;
  topEmitters: TopEmitter[];
  newEmitters: Emitter[];
  metrics: ActivityMetrics;
}

export interface TopEmitter {
  emitter: Emitter;
  invoices: number;
  amount: number;
}

export interface ActivityMetrics {
  totalEmitters: number;
  activeEmitters: number;
  newEmitters: number;
  averageInvoicesPerEmitter: number;
}

// Tipos de filtros - Actualizados para coincidir con el backend
export interface InvoiceFilters {
  estado?: InvoiceStatus;
  fechaInicio?: string;
  fechaFin?: string;
  emisor_ruc?: string;
  subtotal_min?: number;
  subtotal_max?: number;
  confianza_ocr?: number;
}

export interface EmitterFilters {
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
  minInvoices?: number;
  maxInvoices?: number;
}

// Tipos de paginación - Actualizados para coincidir con el backend
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Respuesta paginada del backend
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filtros?: {
    page: number;
    limit: number;
    estado?: string;
    fechaInicio?: string;
    fechaFin?: string;
    sortBy: string;
    sortOrder: string;
  };
  query?: string;
  resultados?: number;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface StatusChangeFormData {
  status: InvoiceStatus;
  comment: string;
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Tipos para Dashboard
export interface DashboardOverview {
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
}

export interface DashboardMetrics {
  total_facturas: number;
  monto_total: number;
  promedio_factura: number;
  monto_minimo: number;
  monto_maximo: number;
  total_itbms: number;
  confianza_promedio: number;
  emisores_unicos: number;
}

export interface FacturaPorMes {
  mes: string;
  cantidad: number;
  monto_total: number;
}

export interface TopEmisorChart {
  emisor: string;
  ruc: string;
  cantidad: number;
  monto: number;
}

export interface DistribucionEstado {
  estado: string;
  cantidad: number;
  porcentaje: number;
}

export interface ActividadSemanal {
  dia: string;
  cantidad: number;
}

export interface TendenciaOCR {
  fecha: string;
  confianza: number;
  total: number;
}

export interface DashboardCharts {
  facturas_por_mes: FacturaPorMes[];
  top_emisores: TopEmisorChart[];
  distribucion_estado: DistribucionEstado[];
  actividad_semanal: ActividadSemanal[];
  tendencia_ocr: TendenciaOCR[];
}

export interface DashboardData {
  overview: DashboardOverview;
  charts: DashboardCharts;
  alertas: unknown[];
  timestamp: string;
}

// Tipos para Reportes

export interface FacturaPorMes {
  mes: string;
  cantidad: number;
  monto_total: number;
}

export interface TopEmisorReporte {
  emisor_nombre: string;
  emisor_ruc: string;
  total_facturas: number;
  monto_total: number;
}

export interface DashboardReporte {
  metricas: DashboardMetrics;
  facturas_por_mes: FacturaPorMes[];
  top_emisores: TopEmisorReporte[];
}

export interface ResumenVentas {
  total_facturas: number;
  total_subtotal: number;
  total_descuento: number;
  total_itbms: number;
  total_ventas: number;
  promedio_factura: number;
}

export interface DetalleVentas {
  periodo: string;
  total_facturas: number;
  total_subtotal: number;
  total_descuento: number;
  total_itbms: number;
  total_ventas: number;
  promedio_factura: number;
  venta_minima: number;
  venta_maxima: number;
  emisores_activos: number;
}

export interface FiltrosReporte {
  fechaInicio: string;
  fechaFin: string;
  agruparPor?: string;
  mes?: number;
  año?: number;
  periodo?: number;
  limit?: number;
}

export interface ReporteVentas {
  resumen: ResumenVentas;
  detalle: DetalleVentas[];
  filtros: FiltrosReporte;
}

export interface EstadisticasOCR {
  total_procesadas: number;
  confianza_promedio: number;
  confianza_minima: number;
  confianza_maxima: number;
  alta_confianza: number;
  media_confianza: number;
  baja_confianza: number;
  errores_procesamiento: number;
  tasa_exito: number;
}

export interface TendenciaDiariaOCR {
  fecha: string;
  total_procesadas: number;
  confianza_promedio: number;
  alta_confianza: number;
  errores: number;
}

export interface ProcesadorOCR {
  procesado_por: string;
  total_procesadas: number;
  confianza_promedio: number;
  alta_confianza: number;
  errores: number;
  tasa_exito: number;
}

export interface ReporteOCR {
  estadisticas: EstadisticasOCR;
  tendencia_diaria: TendenciaDiariaOCR[];
  por_procesador: ProcesadorOCR[];
}

export interface ActividadEmisor {
  emisor_ruc: string;
  emisor_nombre: string;
  total_facturas: number;
  monto_total: number;
  promedio_factura: number;
  primera_factura: string;
  ultima_factura: string;
  dias_activo: number;
  dias_con_facturas: number;
  frecuencia_facturacion: number;
  confianza_promedio: number;
  facturas_error: number;
}

export interface EmisorNuevo {
  emisor_ruc: string;
  emisor_nombre: string;
  primera_factura: string;
  facturas_periodo: number;
}

export interface ReporteActividadEmisores {
  actividad_emisores: ActividadEmisor[];
  emisores_nuevos: EmisorNuevo[];
  filtros: FiltrosReporte;
}

export interface ExportRequest {
  tipo: string;
  formato: 'csv' | 'excel' | 'pdf';
  filtros: Record<string, unknown>;
}

// ==================== EMPRESAS ====================

export interface Empresa {
  id: number;
  nombre: string;
  ruc: string;
  email_procesamiento: string;
  direccion?: string | null;
  telefono?: string | null;
  activo: boolean;
  plan: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmpresaCreateData {
  nombre: string;
  ruc: string;
  email_procesamiento: string;
  direccion?: string;
  telefono?: string;
  plan?: string;
}

export interface EmpresaUpdateData {
  nombre?: string;
  ruc?: string;
  email_procesamiento?: string;
  direccion?: string | null;
  telefono?: string | null;
  activo?: boolean;
  plan?: string;
}

export interface CreateUserData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol?: 'admin' | 'usuario' | 'auditor';
  empresa_id?: number | null;
}

export interface EmpresaFilters {
  activo?: boolean;
  plan?: string;
  search?: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  empresa_nombre: string;
  empresa_ruc: string;
  empresa_direccion?: string;
  empresa_telefono?: string;
}

export interface RegisterFormData extends RegisterData {} 