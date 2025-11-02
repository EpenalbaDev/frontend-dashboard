'use client';

import React from 'react';
import Link from 'next/link';
import { Empresa } from '@/types';
import Badge from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin,
  Edit,
  Eye,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatDate } from '@/utils';

interface EmpresasTableProps {
  empresas: Empresa[];
  loading?: boolean;
  onView?: (empresa: Empresa) => void;
  onEdit?: (empresa: Empresa) => void;
}

const EmpresasTable: React.FC<EmpresasTableProps> = ({
  empresas,
  loading = false,
  onView,
  onEdit,
}) => {
  if (loading) {
    return (
      <Card>
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando empresas...</p>
        </div>
      </Card>
    );
  }

  if (empresas.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No se encontraron empresas</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Empresa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              RUC
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Creado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {empresas.map((empresa) => (
            <tr key={empresa.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {empresa.nombre}
                    </div>
                    {empresa.direccion && (
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {empresa.direccion}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{empresa.ruc}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {empresa.email_procesamiento}
                </div>
                {empresa.telefono && (
                  <div className="text-sm text-gray-500 flex items-center mt-1">
                    <Phone className="w-3 h-3 mr-1" />
                    {empresa.telefono}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant="secondary">
                  {empresa.plan || 'basico'}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {empresa.activo ? (
                  <Badge variant="success" className="flex items-center w-fit">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Activa
                  </Badge>
                ) : (
                  <Badge variant="danger" className="flex items-center w-fit">
                    <XCircle className="w-3 h-3 mr-1" />
                    Inactiva
                  </Badge>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {empresa.created_at ? formatDate(empresa.created_at) : '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <Link href={`/empresas/${empresa.id}`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onView?.(empresa)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit?.(empresa)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpresasTable;

