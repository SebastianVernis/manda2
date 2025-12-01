import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import { apiClient } from '../services/apiClient'

const BackgroundLocationContext = createContext(null)

export const useBackgroundLocation = () => useContext(BackgroundLocationContext)

export const BackgroundLocationProvider = ({ children, minIntervalMs = 3000, minDeltaMeters = 3 }) => {
  const { user } = useAuth()
  const [enabled, setEnabled] = useState(false)
  const [error, setError] = useState(null)
  const [currentPosition, setCurrentPosition] = useState(null)
  const [hasActiveDelivery, setHasActiveDelivery] = useState(false)
  const lastSentRef = useRef(0)
  const lastPosRef = useRef(null)
  const watchIdRef = useRef(null)

  // Verificar si el repartidor tiene pedidos activos
  useEffect(() => {
    if (!user || user.rol !== 'repartidor') {
      console.log('BackgroundLocation: No es repartidor o no hay usuario autenticado')
      setHasActiveDelivery(false)
      return
    }

    // Consultar los pedidos del repartidor
    const checkActiveOrders = async () => {
      try {
        console.log('BackgroundLocation: Verificando pedidos activos...')
        const response = await apiClient.orders.getAll({ limit: 10 })
        const pedidos = response?.data?.pedidos || []
        // Verificar si hay algún pedido en proceso (no entregado ni cancelado)
        // Y además asignado a este repartidor (repartidorId es el del usuario)
        const estados = pedidos.map(p => p.estado);
        console.log(`BackgroundLocation: Estados de pedidos: ${JSON.stringify(estados)}`);
        
        // Filtramos solo los pedidos asignados a este repartidor (tiene su ID)
        const pedidosAsignados = pedidos.filter(p => p.repartidorId?._id === user.id || p.repartidorId === user.id);
        console.log(`BackgroundLocation: Pedidos asignados: ${pedidosAsignados.length} de ${pedidos.length}`);
        
        const active = pedidosAsignados.some(p => {
          const activo = p.estado !== 'entregado' && p.estado !== 'cancelado';
          console.log(`Pedido ${p.numero_pedido || p._id}: estado=${p.estado}, activo=${activo}`);
          return activo;
        });
        
        console.log(`BackgroundLocation: Tiene pedidos activos: ${active}, pedidos asignados: ${pedidosAsignados.length}`);
        setHasActiveDelivery(active)
      } catch (error) {
        console.error('BackgroundLocation: Error checking active orders:', error)
      }
    }
    
    // Verificar al inicio y cada 30 segundos
    checkActiveOrders()
    const interval = setInterval(checkActiveOrders, 30000)
    
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    // Solo activar para repartidores autenticados con pedidos activos
    if (!user || user.rol !== 'repartidor' || !hasActiveDelivery) {
      console.log(`BackgroundLocation: No se activa tracking. Usuario: ${!!user}, Rol: ${user?.rol}, Pedidos activos: ${hasActiveDelivery}`)
      cleanup()
      setEnabled(false)
      return
    }
    
    console.log('BackgroundLocation: Iniciando rastreo de ubicación')

    if (!('geolocation' in navigator)) {
      setError('Geolocation no soportada')
      setEnabled(false)
      return
    }

    let cancelled = false
    setError(null)

    // Intentar solicitar permiso proactivamente
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((perm) => {
        if (perm.state === 'denied') setError('Permiso de ubicación denegado')
      }).catch(() => {})
    }

    const maybeSend = async (coords) => {
      const now = Date.now()
      const elapsed = now - lastSentRef.current
      const lat = coords.latitude
      const lng = coords.longitude

      // Filtrar por distancia mínima
      const prev = lastPosRef.current
      const movedEnough = !prev || distanceMeters(prev.lat, prev.lng, lat, lng) >= minDeltaMeters
      
      // Si ha pasado mucho tiempo desde la última actualización, enviar de todos modos
      const forceUpdate = elapsed > (minIntervalMs * 5) // 15 segundos si minInterval es 3s
      
      if ((elapsed < minIntervalMs || !movedEnough) && !forceUpdate) return

      try {
        console.log(`BackgroundLocation: Enviando ubicación: [${lat.toFixed(6)}, ${lng.toFixed(6)}]`)
        await apiClient.location.update({ latitud: lat, longitud: lng })
        console.log('BackgroundLocation: Ubicación enviada correctamente')
        lastSentRef.current = now
        lastPosRef.current = { lat, lng }
      } catch (e) {
        // Mantener en silencio para no molestar al usuario; exponer en estado
        console.error('BackgroundLocation: Error al enviar ubicación:', e.message)
        setError(e.response?.data?.message || e.message)
      }
    }

    // Arrancar watchPosition para updates continuos
    try {
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          setEnabled(true)
          setCurrentPosition({
            latitud: pos.coords.latitude,
            longitud: pos.coords.longitude,
            timestamp: Date.now()
          })
          maybeSend(pos.coords)
        },
        (err) => {
          if (!cancelled) {
            setError(err.message)
            setEnabled(false)
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 2000,
          timeout: 10000,
        }
      )
      watchIdRef.current = id
    } catch (e) {
      setError(e.message)
      setEnabled(false)
    }

    return () => {
      cancelled = true
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.rol, hasActiveDelivery])

  const cleanup = () => {
    if (watchIdRef.current !== null && navigator.geolocation && navigator.geolocation.clearWatch) {
      try { navigator.geolocation.clearWatch(watchIdRef.current) } catch {}
    }
    watchIdRef.current = null
  }

  const value = { 
    enabled, 
    error, 
    currentPosition,
    hasActiveDelivery
  }
  return (
    <BackgroundLocationContext.Provider value={value}>
      {children}
    </BackgroundLocationContext.Provider>
  )
}

// Distancia aproximada en metros (Haversine)
function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000
  const toRad = (d) => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default BackgroundLocationProvider

