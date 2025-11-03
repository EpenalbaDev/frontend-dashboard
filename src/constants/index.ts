// Configuración de la aplicación
export const APP_CONFIG = {
  name: 'Dashboard de Facturas',
  version: '1.0.0',
  description: 'Sistema de gestión de facturas con OCR',
} as const;

// Estados de factura
export const INVOICE_STATUS = {
  PENDING: 'pending',
  PROCESSED: 'processed',
  ERROR: 'error',
  REVISION: 'revision',
} as const;

// Etiquetas de estados
export const INVOICE_STATUS_LABELS = {
  [INVOICE_STATUS.PENDING]: 'Pendiente',
  [INVOICE_STATUS.PROCESSED]: 'Procesado',
  [INVOICE_STATUS.ERROR]: 'Error',
  [INVOICE_STATUS.REVISION]: 'En Revisión',
} as const;

// Colores de estados
export const INVOICE_STATUS_COLORS = {
  [INVOICE_STATUS.PENDING]: 'yellow',
  [INVOICE_STATUS.PROCESSED]: 'green',
  [INVOICE_STATUS.ERROR]: 'red',
  [INVOICE_STATUS.REVISION]: 'gray',
} as const;

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Configuración de filtros
export const FILTERS = {
  DATE_FORMAT: 'YYYY-MM-DD',
  AMOUNT_PRECISION: 2,
} as const;

// Rutas de navegación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  INVOICES: '/invoices',
  INVOICE_DETAIL: '/invoices/[id]',
  EMITTERS: '/emitters',
  EMITTER_DETAIL: '/emitters/[id]',
  EMPRESAS: '/empresas',
  EMPRESA_DETAIL: '/empresas/[id]',
  REPORTS: '/reports',
  SALES_REPORT: '/reports/sales',
  ITBMS_REPORT: '/reports/itbms',
  ACTIVITY_REPORT: '/reports/activity',
  SETTINGS: '/settings',
} as const;

// Configuración de gráficos
export const CHART_CONFIG = {
  COLORS: [
    '#3b82f6', // primary-500
    '#10b981', // success-500
    '#f59e0b', // warning-500
    '#ef4444', // danger-500
    '#8b5cf6', // purple-500
    '#06b6d4', // cyan-500
    '#84cc16', // lime-500
    '#f97316', // orange-500
  ],
  ANIMATION_DURATION: 1000,
} as const;

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000,
  POSITION: 'top-right',
} as const;

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png'],
} as const;

// Configuración de validación
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  RUC_REGEX: /^\d{11}$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
} as const;

// Mensajes de error
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es requerido',
  INVALID_EMAIL: 'Email inválido',
  INVALID_RUC: 'RUC inválido (debe tener 11 dígitos)',
  INVALID_PHONE: 'Teléfono inválido',
  INVALID_AMOUNT: 'Monto inválido',
  FILE_TOO_LARGE: 'El archivo es demasiado grande',
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido',
  NETWORK_ERROR: 'Error de conexión',
  UNAUTHORIZED: 'No autorizado',
  NOT_FOUND: 'Recurso no encontrado',
  SERVER_ERROR: 'Error del servidor',
} as const;

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGOUT_SUCCESS: 'Sesión cerrada exitosamente',
  INVOICE_UPDATED: 'Factura actualizada exitosamente',
  INVOICE_CREATED: 'Factura creada exitosamente',
  FILE_UPLOADED: 'Archivo subido exitosamente',
  SETTINGS_SAVED: 'Configuración guardada exitosamente',
} as const; 