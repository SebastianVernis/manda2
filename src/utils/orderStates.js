// Utilidades para manejo de estados de pedidos

export const getEstadoTexto = (estado) => {
  const estados = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    preparando: 'Preparando',
    listo: 'Listo para envío',
    camino_tienda: 'En camino a la tienda',
    recolectado: 'Recolectado',
    en_camino: 'En camino al cliente',
    entregado: 'Entregado',
    cancelado: 'Cancelado'
  }
  return estados[estado] || estado
}

export const getEstadoColor = (estado) => {
  const colores = {
    pendiente: 'secondary',
    confirmado: 'info',
    preparando: 'warning',
    listo: 'primary',
    camino_tienda: 'info',
    recolectado: 'dark',
    en_camino: 'warning',
    entregado: 'success',
    cancelado: 'danger'
  }
  return colores[estado] || 'secondary'
}

export const getEstadoIcono = (estado) => {
  const iconos = {
    pendiente: '⏱️',
    confirmado: '✅',
    preparando: '👨‍🍳',
    listo: '📦',
    camino_tienda: '🛵➡️🏪',
    recolectado: '📋',
    en_camino: '🛵➡️🏠',
    entregado: '🎉',
    cancelado: '❌'
  }
  return iconos[estado] || '📋'
}

export const getProximoEstado = (estadoActual, rol) => {
  const transiciones = {
    tienda: {
      pendiente: 'confirmado',
      confirmado: 'preparando',
      preparando: 'listo'
    },
    repartidor: {
      listo: 'camino_tienda',
      camino_tienda: 'recolectado',
      recolectado: 'en_camino',
      en_camino: 'entregado'
    }
  }
  
  return transiciones[rol]?.[estadoActual] || null
}