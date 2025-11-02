import React from 'react';
import { cn } from '@/utils';
import { InvoiceStatus } from '@/types';

interface StatusBadgeProps {
  status: InvoiceStatus | string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    // Spanish status values from backend
    pendiente: {
      label: 'Pendiente',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    procesado: {
      label: 'Procesado',
      className: 'bg-green-100 text-green-800 border-green-200',
    },
    error: {
      label: 'Error',
      className: 'bg-red-100 text-red-800 border-red-200',
    },
    revision: {
      label: 'En Revisión',
      className: 'bg-gray-100 text-gray-800 border-gray-200',
    },
    // Fallback for unknown status values
    default: {
      label: 'Desconocido',
      className: 'bg-gray-100 text-gray-800 border-gray-200',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge; 