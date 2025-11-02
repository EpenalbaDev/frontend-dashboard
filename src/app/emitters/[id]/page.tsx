'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ApiErrorDisplay from '@/components/ui/ApiErrorDisplay';
import { 
  ArrowLeft, 
  Building2, 
  FileText, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Phone,
  MapPin,
  Mail,
  Activity,
  BarChart3,
  Package
} from 'lucide-react';
import { emitterService } from '@/lib/api';
import { EmitterDetail } from '@/types';
import { formatCurrency, formatDate } from '@/utils';

export default function EmitterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const emisorRuc = params.id as string;

  const [emitter, setEmitter] = useState<EmitterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmitterDetail = async () => {
      if (!emisorRuc) return;

      setLoading(true);
      setError(null);

      try {
        const response = await emitterService.getEmitterDetail(emisorRuc);
        
        if (response.success && response.data) {
          setEmitter(response.data);
        } else {
          setError('Error al cargar los datos del emisor');
        }
      } catch (apiError: unknown) {
        console.error('Error fetching emitter detail:', apiError);
        setError('Error al cargar los datos del emisor');
      } finally {
        setLoading(false);
      }
    };

    fetchEmitterDetail();
  }, [emisorRuc]);

  const handleBack = () => {
    router.push('/emitters');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
            <ApiErrorDisplay error={new Error(error)} />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!emitter) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Emisor no encontrado</h3>
              <p className="text-gray-600">No se pudo encontrar el emisor solicitado.</p>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{emitter.emisor_nombre}</h1>
            <p className="text-gray-600">Detalles del emisor</p>
          </div>
        </div>
        <Button>
          <Activity className="h-4 w-4 mr-2" />
          Editar Emisor
        </Button>
      </div>

      {/* Emitter Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Información del Emisor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">RUC</label>
                <p className="text-lg">{emitter.emisor_ruc}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre</label>
                <p className="text-lg">{emitter.emisor_nombre}</p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Dirección</label>
                  <p className="text-sm">{emitter.emisor_direccion}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Teléfono</label>
                  <p className="text-sm">{emitter.emisor_telefono}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Último Procesamiento</label>
                <p className="text-sm">{formatDate(emitter.ultimo_procesamiento)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Confianza Promedio</label>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${emitter.confianza_promedio}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{emitter.confianza_promedio}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emitter.total_facturas}</div>
            <p className="text-xs text-gray-600">Facturas procesadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(emitter.monto_total)}</div>
            <p className="text-xs text-gray-600">Valor total facturado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Factura</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(emitter.promedio_factura)}</div>
            <p className="text-xs text-gray-600">Por factura</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Procesadas</span>
                <Badge variant="success">{emitter.facturas_procesadas}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pendientes</span>
                <Badge variant="secondary">{emitter.facturas_pendientes}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Errores</span>
                <Badge variant="danger">{emitter.facturas_error}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Primera Factura</p>
                <p className="text-sm text-gray-600">{formatDate(emitter.primera_factura)}</p>
              </div>
              <Badge variant="default">Inicio</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Última Factura</p>
                <p className="text-sm text-gray-600">{formatDate(emitter.ultima_factura)}</p>
              </div>
              <Badge variant="default">Reciente</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Último Procesamiento</p>
                <p className="text-sm text-gray-600">{formatDate(emitter.ultimo_procesamiento)}</p>
              </div>
              <Badge variant="default">Actualizado</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Statistics */}
      {emitter.estadisticas_mensuales && emitter.estadisticas_mensuales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Estadísticas Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emitter.estadisticas_mensuales.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{stat.mes}</p>
                    <p className="text-sm text-gray-600">{stat.cantidad_facturas} facturas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(stat.monto_total)}</p>
                    <p className="text-sm text-gray-600">Promedio: {formatCurrency(stat.promedio_factura)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Products */}
      {emitter.top_productos && emitter.top_productos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos Más Frecuentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emitter.top_productos.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{product.descripcion}</p>
                    <p className="text-sm text-gray-600">Frecuencia: {product.frecuencia} veces</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(product.precio_promedio)}</p>
                    <p className="text-sm text-gray-600">Total: {product.cantidad_total} unidades</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 