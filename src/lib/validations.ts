import { z } from 'zod';

// Esquema de validación para login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

// Esquema de validación para filtros de facturas
export const invoiceFiltersSchema = z.object({
  status: z.enum(['pending', 'processed', 'error', 'revision']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  emitterRuc: z.string().optional(),
  amountFrom: z.number().min(0).optional(),
  amountTo: z.number().min(0).optional(),
  ocrConfidence: z.number().min(0).max(100).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Esquema de validación para cambio de estado
export const statusChangeSchema = z.object({
  status: z.enum(['pending', 'processed', 'error', 'revision']),
  comment: z.string().min(1, 'El comentario es requerido').max(500, 'El comentario no puede exceder 500 caracteres'),
});

// Esquema de validación para búsqueda
export const searchSchema = z.object({
  query: z.string().min(1, 'El término de búsqueda es requerido'),
  type: z.enum(['emitter', 'invoice', 'item']).optional(),
  filters: z.record(z.string(), z.unknown()).optional(),
});

// Esquema de validación para registro
export const registerSchema = z.object({
  nombre: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
  apellido: z.string().min(2, 'Apellido debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Password debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password debe contener mayúscula, minúscula y número'),
  empresa_nombre: z.string().min(2, 'Nombre de empresa requerido').max(255),
  empresa_ruc: z.string().min(8, 'RUC debe tener al menos 8 caracteres').max(50),
  empresa_direccion: z.string().max(500).optional().or(z.literal('')),
  empresa_telefono: z.string().max(50).optional().or(z.literal('')),
});

// Tipos inferidos de los esquemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type InvoiceFilters = z.infer<typeof invoiceFiltersSchema>;
export type StatusChangeData = z.infer<typeof statusChangeSchema>;
export type SearchData = z.infer<typeof searchSchema>; 