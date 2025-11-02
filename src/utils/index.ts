import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Función para combinar clases de Tailwind
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

// Formateo de fechas
export const formatDate = (date: string | Date, formatStr: string = 'dd/MM/yyyy') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: es });
  } catch (error) {
    return 'Fecha inválida';
  }
};

export const formatDateTime = (date: string | Date) => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

export const formatDateShort = (date: string | Date) => {
  return formatDate(date, 'dd/MM/yy');
};

// Formateo de moneda
export const formatCurrency = (amount: number, currency: string = 'PAB') => {
  return new Intl.NumberFormat('es-PA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Formateo de números
export const formatNumber = (number: number, decimals: number = 2) => {
  return new Intl.NumberFormat('es-PA', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

// Formateo de porcentaje
export const formatPercentage = (value: number, decimals: number = 1) => {
  return `${formatNumber(value, decimals)}%`;
};

// Formateo de tamaño de archivo
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Validación de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validación de RUC
export const isValidRUC = (ruc: string): boolean => {
  const rucRegex = /^\d{11}$/;
  return rucRegex.test(ruc);
};

// Validación de teléfono
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

// Generar ID único
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Debounce function
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Capitalizar primera letra
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncar texto
export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

// Obtener iniciales
export const getInitials = (name: string | null | undefined): string => {
  if (!name || typeof name !== 'string') {
    return 'U';
  }
  
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Clonar objeto
export const clone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

// Verificar si es objeto vacío
export const isEmpty = (obj: unknown): boolean => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
  if (typeof obj === 'object') return Object.keys(obj as Record<string, unknown>).length === 0;
  return false;
};

// Obtener diferencia en días
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Obtener mes y año actual
export const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
};

// Obtener rango de fechas del mes
export const getMonthDateRange = (month: number, year: number) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  return {
    start: startDate.toISOString().split('T')[0],
    end: endDate.toISOString().split('T')[0],
  };
};

// Verificar si es fecha válida
export const isValidDate = (date: unknown): boolean => {
  const d = new Date(date as string | number | Date);
  return d instanceof Date && !isNaN(d.getTime());
};

// Obtener color basado en valor
export const getColorByValue = (value: number, min: number, max: number): string => {
  const percentage = (value - min) / (max - min);
  
  if (percentage < 0.3) return 'text-green-600';
  if (percentage < 0.7) return 'text-yellow-600';
  return 'text-red-600';
};

// Obtener color de estado
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-50',
    processed: 'text-green-600 bg-green-50',
    error: 'text-red-600 bg-red-50',
    revision: 'text-gray-600 bg-gray-50',
  };
  
  return colors[status] || 'text-gray-600 bg-gray-50';
}; 