'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import { 
  ArrowLeft, 
  Download, 
  Edit, 
  FileText, 
  Calendar, 
  User, 
  DollarSign, 
  Package, 
  File, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils';
import { InvoiceDetail } from '@/types';
import { invoiceService } from '@/lib/api';

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const invoiceId = params.id as string;

  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await invoiceService.getById(invoiceId);
        setInvoice(response.data);
      } catch (err) {
        console.error('Error fetching invoice detail:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar el detalle de la factura';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoiceDetail();
    }
  }, [invoiceId]);

  const handleBack = () => {
    router.push('/invoices');
  };

  const handleEdit = () => {
    // TODO: Implementar edición de estado
    alert('Funcionalidad de edición en desarrollo');
  };

  const handleDownload = () => {
    // TODO: Implementar descarga
    alert('Funcionalidad de descarga en desarrollo');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'procesado':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'revision':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getLogIcon = (tipo: string) => {
    switch (tipo) {
      case 'completado':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cambio_estado':
        return <Edit className="h-4 w-4 text-blue-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando detalle de factura...</span>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="max-w-7xl mx-auto p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Error al cargar factura</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <div className="mt-6">
                <Button onClick={handleBack} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a la lista
                </Button>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!invoice) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="max-w-7xl mx-auto p-6">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Factura no encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                La factura que buscas no existe o ha sido eliminada.
              </p>
              <div className="mt-6">
                <Button onClick={handleBack} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a la lista
                </Button>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  Factura #{invoice.numero_factura}
                </h1>
                <p className="text-gray-600 mt-1">
                  Detalle completo de la factura
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar Estado
              </Button>
              <Button
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Descargar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Información de la Factura
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Número de Factura</label>
                      <p className="text-lg font-semibold text-gray-900">{invoice.numero_factura}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Fecha de Factura</label>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(invoice.fecha_factura)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Estado</label>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(invoice.estado)}
                        <StatusBadge status={invoice.estado} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Confianza OCR</label>
                      <p className="text-lg font-semibold text-gray-900">{invoice.confianza_ocr}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información del emisor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información del Emisor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nombre</label>
                      <p className="text-lg font-semibold text-gray-900">{invoice.emisor_nombre}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">RUC</label>
                      <p className="text-lg font-semibold text-gray-900">{invoice.emisor_ruc}</p>
                    </div>
                    {invoice.emisor_direccion && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-500">Dirección</label>
                        <p className="text-lg font-semibold text-gray-900">{invoice.emisor_direccion}</p>
                      </div>
                    )}
                    {invoice.emisor_telefono && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Teléfono</label>
                        <p className="text-lg font-semibold text-gray-900">{invoice.emisor_telefono}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Información del receptor */}
              {invoice.receptor_nombre && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Información del Receptor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nombre</label>
                        <p className="text-lg font-semibold text-gray-900">{invoice.receptor_nombre}</p>
                      </div>
                      {invoice.receptor_ruc && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">RUC</label>
                          <p className="text-lg font-semibold text-gray-900">{invoice.receptor_ruc}</p>
                        </div>
                      )}
                      {invoice.receptor_direccion && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-500">Dirección</label>
                          <p className="text-lg font-semibold text-gray-900">{invoice.receptor_direccion}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Items de la factura */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Items de la Factura ({invoice.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {invoice.items.map((item, index) => (
                      <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Descripción</label>
                            <p className="font-semibold text-gray-900">{item.descripcion}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Cantidad</label>
                            <p className="font-semibold text-gray-900">{item.cantidad}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Precio Unitario</label>
                            <p className="font-semibold text-gray-900">{formatCurrency(item.precio_unitario)}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Total</label>
                            <p className="font-semibold text-gray-900">{formatCurrency(item.total_item)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Archivos */}
              {invoice.archivos && invoice.archivos.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <File className="h-5 w-5" />
                      Archivos ({invoice.archivos.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {invoice.archivos.map((archivo) => (
                        <div key={archivo.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{archivo.nombre_archivo}</p>
                              <p className="text-sm text-gray-500">
                                {archivo.tipo_archivo} • {(archivo.tamaño_bytes / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Resumen financiero */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Resumen Financiero
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Descuento:</span>
                    <span className="font-semibold">{formatCurrency(invoice.descuento)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ITBMS:</span>
                    <span className="font-semibold">{formatCurrency(invoice.itbms)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium">Total:</span>
                      <span className="text-lg font-bold text-blue-600">{formatCurrency(invoice.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información del procesamiento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Información del Procesamiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Procesado por</label>
                    <p className="font-semibold text-gray-900">{invoice.procesado_por || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fecha de creación</label>
                    <p className="font-semibold text-gray-900">{formatDate(invoice.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Última actualización</label>
                    <p className="font-semibold text-gray-900">{formatDate(invoice.updated_at)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Logs de actividad */}
              {invoice.logs && invoice.logs.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Historial de Actividad
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {invoice.logs.map((log) => (
                        <div key={log.id} className="border-l-4 border-blue-200 pl-4">
                          <div className="flex items-start gap-2">
                            {getLogIcon(log.tipo_evento)}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{log.mensaje}</p>
                              <p className="text-xs text-gray-500">{formatDate(log.created_at)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 