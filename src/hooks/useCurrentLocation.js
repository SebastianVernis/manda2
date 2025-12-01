import { useState, useEffect, useCallback } from 'react'

export const useCurrentLocation = (enableTracking = false) => {
  const [currentPosition, setCurrentPosition] = useState(null)
  const [positionError, setPositionError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [watchId, setWatchId] = useState(null)

  const handleSuccess = useCallback((position) => {
    setCurrentPosition({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    })
    setPositionError(null)
    setLoading(false)
  }, [])

  const handleError = useCallback((error) => {
    let errorMessage;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Usuario denegó la solicitud de geolocalización";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Información de ubicación no disponible";
        break;
      case error.TIMEOUT:
        errorMessage = "La solicitud de ubicación expiró";
        break;
      default:
        errorMessage = "Error desconocido al obtener la ubicación";
    }
    setPositionError(errorMessage)
    setLoading(false)
  }, [])

  // Obtener ubicación una sola vez
  const getPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        const error = 'Geolocalización no soportada en este navegador';
        setPositionError(error);
        reject(new Error(error));
        return;
      }

      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          setCurrentPosition(locationData);
          setPositionError(null);
          setLoading(false);
          resolve(locationData);
        },
        (error) => {
          handleError(error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }, [handleError]);

  // Iniciar/detener el tracking de ubicación basado en enableTracking
  useEffect(() => {
    if (!enableTracking) {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      return;
    }

    if (!('geolocation' in navigator)) {
      setPositionError('Geolocalización no soportada en este navegador');
      return;
    }

    // Obtener ubicación inicial
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );

    // Iniciar seguimiento continuo
    const id = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
    setWatchId(id);

    // Limpiar al desmontar
    return () => {
      if (id !== null) {
        navigator.geolocation.clearWatch(id);
      }
    };
  }, [enableTracking, handleSuccess, handleError]);

  return { 
    currentPosition, 
    positionError, 
    loading, 
    getPosition,
    isTracking: watchId !== null
  };
}