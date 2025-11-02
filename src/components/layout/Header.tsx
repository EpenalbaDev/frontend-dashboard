'use client';

import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  ChevronDown,
  Settings,
  LogOut,
  Bug
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/utils';
import { Card, CardContent } from '@/components/ui/Card';

interface HeaderProps {
  onSidebarToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Verificar que el usuario existe antes de renderizar
  if (!user) {
    return (
      <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <button
              onClick={onSidebarToggle}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar facturas, emisores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">U</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6">
      <div className="flex items-center justify-between">
        {/* Lado izquierdo - Toggle sidebar y búsqueda */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Botón toggle sidebar */}
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Búsqueda */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar facturas, emisores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Lado derecho - Notificaciones y usuario */}
        <div className="flex items-center space-x-4">
          {/* Indicador de desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              <Bug className="w-3 h-3" />
              <span>DEV</span>
            </div>
          )}

          {/* Notificaciones */}
          <button className="relative p-2 rounded-md hover:bg-gray-100" aria-label="Notificaciones">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Menú de usuario */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {getInitials(user.name)}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown del menú de usuario */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <Card>
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      <button
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <User className="w-4 h-4" />
                        <span>Perfil</span>
                      </button>
                      <button
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Configuración</span>
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 