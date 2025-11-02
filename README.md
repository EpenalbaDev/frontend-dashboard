# Dashboard de Facturación - Frontend

Este es un proyecto de [Next.js](https://nextjs.org) para el dashboard de facturación, construido con TypeScript, Tailwind CSS v4, y componentes modernos.

## 🚀 Características Implementadas

### ✅ Completadas

- **✅ Lista de facturas** - Vista completa de facturas con paginación, filtros y ordenamiento
- **✅ Detalle de factura** - Página detallada con información completa, items, archivos y logs
- **✅ Búsqueda básica** - Búsqueda avanzada con filtros rápidos, sugerencias y resultados destacados
- **✅ Lista de emisores** - Gestión y visualización de emisores de facturas con estadísticas
- **✅ Detalle de emisor** - Página detallada con información completa del emisor, estadísticas mensuales y productos más frecuentes

### 🔄 En Progreso

- **⏳ Reporte de ventas** - Análisis y reportes de ventas
- **⏳ Optimizaciones básicas** - Mejoras de rendimiento y UX

## 🛠️ Tecnologías

- **Next.js 15.4.3** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Framework de CSS
- **Lucide React** - Iconos
- **Axios** - Cliente HTTP
- **Zod** - Validación de esquemas

## 🚀 Inicio Rápido

1. **Instalar dependencias:**
```bash
npm install
```

2. **Ejecutar servidor de desarrollo:**
```bash
npm run dev
```

3. **Abrir en el navegador:**
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas de la aplicación
│   ├── dashboard/         # Dashboard principal
│   ├── invoices/          # Gestión de facturas
│   └── auth/              # Autenticación
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI base
│   ├── layout/           # Componentes de layout
│   ├── auth/             # Componentes de autenticación
│   └── invoices/         # Componentes específicos de facturas
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuración
├── types/                # Definiciones de TypeScript
└── utils/                # Funciones utilitarias
```

## 🔧 Funcionalidades Principales

### Lista de Facturas
- ✅ Vista tabular con paginación
- ✅ Filtros por estado, fecha, emisor
- ✅ Ordenamiento por columnas
- ✅ Búsqueda global avanzada
- ✅ Acciones rápidas (ver, editar, descargar)

### Detalle de Factura
- ✅ Información completa de la factura
- ✅ Datos del emisor y receptor
- ✅ Lista de items con detalles
- ✅ Archivos adjuntos
- ✅ Historial de actividad
- ✅ Resumen financiero

### Búsqueda Avanzada
- ✅ Búsqueda por número: `numero:123`
- ✅ Búsqueda por emisor: `emisor:Cable`
- ✅ Búsqueda por fecha: `fecha:2024-01`
- ✅ Búsqueda por monto: `monto:>1000`
- ✅ Filtros rápidos por estado
- ✅ Sugerencias de búsqueda
- ✅ Resultados con estadísticas

### Lista de Emisores
- ✅ Vista de emisores con estadísticas
- ✅ Filtros y búsqueda por nombre/RUC
- ✅ Ordenamiento por total facturas, monto, fecha
- ✅ Tarjetas con información resumida
- ✅ Paginación del servidor

### Detalle de Emisor
- ✅ Información completa del emisor
- ✅ Estadísticas de facturas (total, procesadas, pendientes, errores)
- ✅ Actividad reciente y última factura
- ✅ Estadísticas mensuales
- ✅ Productos más frecuentes
- ✅ Navegación entre emisores

## 🔐 Autenticación

El sistema incluye:
- ✅ Token encriptado en localStorage
- ✅ Interceptores de Axios para autenticación
- ✅ Protección de rutas
- ✅ Manejo de errores de autenticación

## 🎨 UI/UX

- ✅ Diseño responsive
- ✅ Componentes accesibles
- ✅ Iconografía consistente
- ✅ Estados de carga y error
- ✅ Navegación intuitiva

## 📊 API Integration

- ✅ Integración con backend REST
- ✅ Manejo de errores HTTP
- ✅ Paginación del servidor
- ✅ Filtros y ordenamiento
- ✅ Búsqueda avanzada

## 🚧 Próximas Funcionalidades

### Reporte de Ventas
- [ ] Dashboard de métricas
- [ ] Gráficos y visualizaciones
- [ ] Filtros por período
- [ ] Exportación de reportes

### Optimizaciones
- [ ] Lazy loading de componentes
- [ ] Optimización de imágenes
- [ ] Caching de datos
- [ ] Mejoras de rendimiento

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
