import React from 'react'
import { Alert, Button } from 'react-bootstrap'
import { FaLocationArrow, FaExclamationTriangle } from 'react-icons/fa'
import { useLocationCheck } from '../hooks/useLocationCheck'

const LocationAlert = ({ className = '' }) => {
  const { locationPermission, requestLocationPermission, isLocationDenied, isLocationSupported } = useLocationCheck()

  // No mostrar nada si la ubicación está permitida o no es compatible
  if (locationPermission === 'granted' || !isLocationSupported) {
    return null
  }

  if (isLocationDenied) {
    return (
      <Alert variant="danger" className={`d-flex align-items-center ${className}`}>
        <FaExclamationTriangle className="me-2" />
        <div className="flex-grow-1">
          <strong>Ubicación denegada</strong>
          <div className="small">
            Para trabajar como repartidor es necesario compartir tu ubicación.
            Por favor, habilita la ubicación en la configuración del navegador.
            {window.location.pathname !== '/repartidor/ubicacion' && (
              <div className="mt-1">
                <a href="/repartidor/ubicacion" className="alert-link">Mientras tanto, usa la actualización manual</a>
              </div>
            )}
          </div>
        </div>
      </Alert>
    )
  }

  if (locationPermission === null) {
    return (
      <Alert variant="info" className={`d-flex align-items-center ${className}`}>
        <FaLocationArrow className="me-2" />
        <div className="flex-grow-1">
          <strong>Mejora tu experiencia</strong>
          <div className="small">Permítenos acceder a tu ubicación para mostrarte las mejores opciones cercanas.</div>
        </div>
        <Button 
          size="sm" 
          variant="outline-primary" 
          onClick={requestLocationPermission}
          className="ms-2"
        >
          Permitir
        </Button>
      </Alert>
    )
  }

  return null
}

export default LocationAlert