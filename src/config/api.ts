// Configuración de la API y mapeo de campos

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Mapeo de campos del frontend a campos del backend
export const FIELD_MAPPING = {
  // Campos de Invoice
  invoice: {
    'id': 'id',
    'date': 'fecha_factura',
    'invoiceNumber': 'numero_factura',
    'amount': 'monto_total',
    'emitter': 'emisor_nombre',
    'status': 'estado',
    'ocrConfidence': 'confianza_ocr',
    'createdAt': 'created_at',
    'updatedAt': 'updated_at'
  },
  
  // Campos de Emitter
  emitter: {
    'id': 'id',
    'ruc': 'ruc',
    'name': 'nombre',
    'address': 'direccion',
    'phone': 'telefono',
    'email': 'email',
    'isActive': 'activo',
    'totalInvoices': 'total_facturas',
    'totalAmount': 'monto_total',
    'averageAmount': 'monto_promedio',
    'lastInvoiceDate': 'ultima_factura',
    'createdAt': 'created_at',
    'updatedAt': 'updated_at'
  }
};

// Campos válidos para ordenamiento según el backend
export const VALID_SORT_FIELDS = {
  invoices: [
    'created_at',
    'fecha_factura',
    'monto_total',
    'numero_factura',
    'emisor_nombre',
    'confianza_ocr',
    'estado'
  ],
  emitters: [
    'created_at',
    'nombre',
    'ruc',
    'total_facturas',
    'monto_total',
    'ultima_factura'
  ]
};

// Configuración de paginación por defecto
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 25,
  SORT_BY: 'fecha_factura',
  SORT_ORDER: 'desc' as const,
  MAX_LIMIT: 100,
  VALID_LIMITS: [10, 25, 50, 100]
};

// Configuración de filtros
export const FILTER_CONFIG = {
  DATE_FORMAT: 'YYYY-MM-DD',
  SEARCH_MIN_LENGTH: 2,
  SEARCH_DEBOUNCE_MS: 300,
  OCR_CONFIDENCE_MIN: 0,
  OCR_CONFIDENCE_MAX: 100
};

// Estados válidos de facturas
export const INVOICE_STATUSES = [
  'pending',
  'processed',
  'error',
  'revision'
] as const;

// Configuración de color por estado
export const STATUS_COLORS = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200'
  },
  processed: {
    bg: 'bg-green-100', 
    text: 'text-green-800',
    border: 'border-green-200'
  },
  error: {
    bg: 'bg-red-100',
    text: 'text-red-800', 
    border: 'border-red-200'
  },
  revision: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200'
  }
} as const;

// Configuración de confianza OCR
export const OCR_CONFIDENCE_CONFIG = {
  HIGH_THRESHOLD: 90,
  MEDIUM_THRESHOLD: 70,
  COLORS: {
    HIGH: {
      bg: 'bg-green-50',
      text: 'text-green-600'
    },
    MEDIUM: {
      bg: 'bg-yellow-50', 
      text: 'text-yellow-600'
    },
    LOW: {
      bg: 'bg-red-50',
      text: 'text-red-600'
    }
  }
} as const;

// Utilidades para mapeo de campos
export function mapFrontendFieldToBackend(
  entityType: keyof typeof FIELD_MAPPING,
  frontendField: string
): string {
  const mapping = FIELD_MAPPING[entityType];
  return mapping[frontendField as keyof typeof mapping] || frontendField;
}

export function isValidSortField(
  entityType: keyof typeof VALID_SORT_FIELDS,
  field: string
): boolean {
  return VALID_SORT_FIELDS[entityType].includes(field);
}

export function getOcrConfidenceColor(confidence: number) {
  if (confidence >= OCR_CONFIDENCE_CONFIG.HIGH_THRESHOLD) {
    return OCR_CONFIDENCE_CONFIG.COLORS.HIGH;
  }
  if (confidence >= OCR_CONFIDENCE_CONFIG.MEDIUM_THRESHOLD) {
    return OCR_CONFIDENCE_CONFIG.COLORS.MEDIUM;
  }
  return OCR_CONFIDENCE_CONFIG.COLORS.LOW;
}

export function getStatusColor(status: keyof typeof STATUS_COLORS) {
  return STATUS_COLORS[status];
}