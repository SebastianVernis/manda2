import { lazy } from 'react'
import LoadingSpinner from './LoadingSpinner'

// Lazy loading for heavy components
export const LazyClienteDashboard = lazy(() => 
  import('../pages/Cliente/Dashboard').then(module => ({
    default: module.default
  }))
)

export const LazyRepartidorDashboard = lazy(() => 
  import('../pages/Repartidor/Dashboard').then(module => ({
    default: module.default  
  }))
)

export const LazyRepartidorPedidos = lazy(() =>
  import('../pages/Repartidor/Pedidos').then(module => ({
    default: module.default
  }))
)

export const LazyAdminDashboard = lazy(() =>
  import('../pages/Admin/Dashboard').then(module => ({
    default: module.default
  }))
)

export const LazyTiendaDashboard = lazy(() =>
  import('../pages/Tienda/Dashboard').then(module => ({
    default: module.default
  }))
)

// Charts (heavy dependencies)
export const LazyClienteHistorial = lazy(() =>
  import('../pages/Cliente/Historial').then(module => ({
    default: module.default
  }))
)

export const LazyTiendaEstadisticas = lazy(() =>
  import('../pages/Tienda/Estadisticas').then(module => ({
    default: module.default
  }))
)

export const LazyRepartidorEstadisticas = lazy(() =>
  import('../pages/Repartidor/Estadisticas').then(module => ({
    default: module.default
  }))
)

// Maps (heavy Leaflet dependencies)
export const LazyRepartidorUbicacion = lazy(() =>
  import('../pages/Repartidor/Ubicacion').then(module => ({
    default: module.default
  }))
)

export const LazyClienteSeguimiento = lazy(() =>
  import('../pages/Cliente/Seguimiento').then(module => ({
    default: module.default
  }))
)

// Loading wrapper component
export const LazyWrapper = ({ children, fallback = <LoadingSpinner /> }) => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      {fallback}
    </div>
  )
}