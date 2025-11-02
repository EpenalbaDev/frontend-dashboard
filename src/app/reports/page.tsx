'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Activity, 
  Download,
  Calendar,
  Users,
  Eye,
  PieChart,
  LineChart,
  Building2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
  const router = useRouter();

  const reportTypes = [
    {
      id: 'dashboard',
      title: 'Dashboard General',
      description: 'Métricas generales y resumen ejecutivo',
      icon: BarChart3,
      color: 'bg-blue-500',
      href: '/reports/dashboard',
      features: ['Métricas clave', 'Top emisores', 'Tendencias mensuales']
    },
    {
      id: 'ventas',
      title: 'Reporte de Ventas',
      description: 'Análisis detallado de ventas y facturación',
      icon: DollarSign,
      color: 'bg-green-500',
      href: '/reports/ventas',
      features: ['Resumen financiero', 'Detalle por período', 'Exportación']
    },
    {
      id: 'itbms',
      title: 'Reporte ITBMS',
      description: 'Análisis de impuestos y retenciones',
      icon: PieChart,
      color: 'bg-purple-500',
      href: '/reports/itbms',
      features: ['Base gravable', 'Total ITBMS', 'Por emisor']
    },
    {
      id: 'ocr',
      title: 'Performance OCR',
      description: 'Estadísticas de procesamiento y confianza',
      icon: Eye,
      color: 'bg-orange-500',
      href: '/reports/ocr',
      features: ['Tasa de éxito', 'Confianza promedio', 'Por procesador']
    },
    {
      id: 'actividad',
      title: 'Actividad Emisores',
      description: 'Análisis de actividad y nuevos emisores',
      icon: Activity,
      color: 'bg-indigo-500',
      href: '/reports/actividad',
      features: ['Emisores activos', 'Nuevos emisores', 'Frecuencia']
    }
  ];

  const handleReportClick = (href: string) => {
    router.push(href);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                Reportes
              </h1>
              <p className="text-gray-600 mt-1">
                Análisis detallado y reportes de facturación
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar Todo
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reportes Disponibles</CardTitle>
                <FileText className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-gray-600">Tipos de reportes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Última Actualización</CardTitle>
                <Calendar className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Hoy</div>
                <p className="text-xs text-gray-600">Datos en tiempo real</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Formatos</CardTitle>
                <Download className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-gray-600">CSV, Excel, PDF</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Filtros Avanzados</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Sí</div>
                <p className="text-xs text-gray-600">Por fecha, emisor, estado</p>
              </CardContent>
            </Card>
          </div>

          {/* Report Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((report) => (
              <Card 
                key={report.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleReportClick(report.href)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${report.color} text-white`}>
                      <report.icon className="h-6 w-6" />
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {report.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleReportClick(report.href)}
                    >
                      Ver Reporte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Reporte de Ventas generado</p>
                      <p className="text-sm text-gray-600">Hace 2 horas</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Dashboard actualizado</p>
                      <p className="text-sm text-gray-600">Hace 4 horas</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
} 