'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatusBadge from '@/components/ui/StatusBadge';
import { ArrowRight, FileText } from 'lucide-react';
import { ROUTES } from '@/constants';
import { InvoiceStatus } from '@/types';

interface RecentInvoice {
  id: string;
  numero: string;
  emisor: string;
  monto: number;
  estado: string;
  fecha: string;
}

interface RecentInvoicesProps {
  invoices: RecentInvoice[];
  isLoading?: boolean;
}

const RecentInvoices: React.FC<RecentInvoicesProps> = ({ invoices, isLoading = false }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PA', {
      style: 'currency',
      currency: 'PAB',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Facturas Recientes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Facturas Recientes</span>
        </CardTitle>
        <Link
          href={ROUTES.INVOICES}
          className="text-sm text-blue-600 hover:text-blue-500 flex items-center space-x-1"
        >
          <span>Ver todas</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay facturas recientes</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.slice(0, 5).map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-900">
                    {invoice.numero}
                  </div>
                  <div className="text-sm text-gray-600">
                    {invoice.emisor}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.monto)}
                  </div>
                  <StatusBadge status={invoice.estado as InvoiceStatus} />
                  <div className="text-xs text-gray-500">
                    {formatDate(invoice.fecha)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentInvoices; 