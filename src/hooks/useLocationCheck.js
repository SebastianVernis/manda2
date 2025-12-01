import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export const useLocationCheck = () => {
  const { locationPermission, requestLocationPermission, isAuthenticated } = useAuth()

  useEffect(() => {
    // Solo verificar si el usuario está autenticado
    if (!isAuthenticated) return

    // Si no tenemos información de permisos o fueron denegados, intentar solicitar nuevamente
    if (locationPermission === null || locationPermission === 'denied') {
      const timer = setTimeout(() => {
        requestLocationPermission()
      }, 1000) // Esperar 1 segundo antes de solicitar

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, locationPermission, requestLocationPermission])

  return {
    locationPermission,
    requestLocationPermission,
    hasLocationAccess: locationPermission === 'granted',
    isLocationDenied: locationPermission === 'denied',
    isLocationSupported: locationPermission !== 'not_supported'
  }
}