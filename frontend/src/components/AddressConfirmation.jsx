import React, { useState, useEffect, useRef } from 'react'
import { Button, Alert, Form, Spinner, ListGroup } from 'react-bootstrap'
import { FaLocationArrow, FaMapMarkerAlt, FaCheck, FaSearch, FaTimesCircle } from 'react-icons/fa'
import { reverseGeocode, searchAddresses, geocodeAddress } from '../lib/geocoding'
import '../styles/map-styles.css'

const AddressConfirmation = ({ onConfirm, className = '' }) => {
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [location, setLocation] = useState(null)
  const [address, setAddress] = useState('')
  const [manualAddress, setManualAddress] = useState('')
  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)
  const [useManual, setUseManual] = useState(false)
  const [error, setError] = useState(null)
  
  const searchTimeoutRef = useRef(null)
  const suggestionListRef = useRef(null)

  // Obtener ubicación actual
  const getCurrentLocation = async () => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización')
      setLoading(false)
      return
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        })
      })

      const coords = {
        latitud: position.coords.latitude,
        longitud: position.coords.longitude
      }

      setLocation(coords)

      // Obtener dirección usando geocodificación inversa
      try {
        const addressText = await reverseGeocode(coords.latitud, coords.longitud)
        setAddress(addressText)
      } catch (geocodeError) {
        console.error('Error geocoding:', geocodeError)
        setAddress(`${coords.latitud.toFixed(6)}, ${coords.longitud.toFixed(6)}`)
      }

    } catch (error) {
      console.error('Error getting location:', error)
      setError('No se pudo obtener tu ubicación. Por favor ingresa tu dirección manualmente.')
    } finally {
      setLoading(false)
    }
  }

  // Buscar direcciones con autocompletado
  const handleAddressSearch = async (query) => {
    setManualAddress(query)
    
    // Limpiar el timeout anterior si existe
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    if (!query || query.length < 3) {
      setAddressSuggestions([])
      setShowSuggestions(false)
      return
    }
    
    // Crear un nuevo timeout para evitar muchas búsquedas mientras se escribe
    searchTimeoutRef.current = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const suggestions = await searchAddresses(query)
        setAddressSuggestions(suggestions)
        setShowSuggestions(suggestions.length > 0)
      } catch (error) {
        console.error('Error buscando direcciones:', error)
      } finally {
        setSearchLoading(false)
      }
    }, 300)
  }
  
  // Seleccionar una sugerencia de dirección
  const selectSuggestion = async (suggestion) => {
    setSelectedSuggestion(suggestion)
    setManualAddress(suggestion.text)
    setShowSuggestions(false)
    
    // Si la sugerencia tiene coordenadas, guardarlas
    if (suggestion.center && suggestion.center.length === 2) {
      const [lng, lat] = suggestion.center
      setLocation({
        latitud: lat,
        longitud: lng
      })
    }
  }
  
  // Confirmar dirección
  const confirmAddress = async () => {
    if (useManual && !manualAddress.trim()) {
      setError('Por favor ingresa tu dirección')
      return
    }

    if (!useManual && !location) {
      setError('Por favor obtén tu ubicación primero')
      return
    }

    let finalAddress = useManual ? manualAddress.trim() : address
    let finalLocation = useManual ? null : location
    
    // Si se está usando dirección manual y no hay ubicación pero sí hay texto
    if (useManual && !finalLocation && manualAddress.trim()) {
      setLoading(true)
      try {
        // Intentar geocodificar la dirección manual para obtener coordenadas
        const coords = await geocodeAddress(manualAddress.trim())
        if (coords) {
          finalLocation = coords
        }
      } catch (error) {
        console.error('Error geocodificando dirección manual:', error)
      } finally {
        setLoading(false)
      }
    }
    
    // Extraer componentes de dirección si se seleccionó una sugerencia
    let calleValue = finalAddress
    let ciudadValue = 'Ciudad de México'
    let cpValue = '00000'
    
    if (selectedSuggestion?.components) {
      const comp = selectedSuggestion.components
      calleValue = comp.street || finalAddress
      ciudadValue = comp.place || comp.locality || 'Ciudad de México'
      cpValue = comp.postcode || '00000'
    }

    onConfirm({
      direccion_envio: {
        calle: calleValue,
        numero: 'S/N',
        ciudad: ciudadValue,
        codigo_postal: cpValue,
        referencias: '',
        ...(finalLocation && {
          latitud: finalLocation.latitud,
          longitud: finalLocation.longitud
        })
      }
    })
  }

  return (
    <div className={className}>
      <div className="mb-3">
        <h5 className="mb-3">📍 Confirma tu dirección de entrega</h5>
        
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <div className="d-flex gap-2 mb-3">
          <Button 
            variant={!useManual ? "primary" : "outline-primary"}
            onClick={() => setUseManual(false)}
            size="sm"
          >
            <FaLocationArrow className="me-1" />
            Usar mi ubicación
          </Button>
          <Button 
            variant={useManual ? "primary" : "outline-primary"}
            onClick={() => setUseManual(true)}
            size="sm"
          >
            <FaMapMarkerAlt className="me-1" />
            Escribir dirección
          </Button>
        </div>

        {!useManual ? (
          <div>
            {!location ? (
              <div className="text-center py-3">
                <Button 
                  onClick={getCurrentLocation} 
                  disabled={loading}
                  variant="success"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Obteniendo ubicación...
                    </>
                  ) : (
                    <>
                      <FaLocationArrow className="me-2" />
                      Obtener mi ubicación
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Alert variant="success" className="d-flex align-items-center">
                <FaCheck className="me-2 text-success" />
                <div>
                  <div className="fw-bold">Ubicación detectada:</div>
                  <div className="small">{address}</div>
                  <div className="small text-muted">
                    Coordenadas: {location.latitud.toFixed(6)}, {location.longitud.toFixed(6)}
                  </div>
                </div>
              </Alert>
            )}
          </div>
        ) : (
          <div className="position-relative">
            <Form.Group>
              <Form.Label>Ingresa tu dirección completa:</Form.Label>
              <div className="input-group">
                <Form.Control
                  type="text"
                  value={manualAddress}
                  onChange={(e) => handleAddressSearch(e.target.value)}
                  onFocus={() => {
                    if (addressSuggestions.length > 0) {
                      setShowSuggestions(true)
                    }
                  }}
                  onBlur={() => {
                    // Delay para permitir que se detecte el clic en una sugerencia
                    setTimeout(() => setShowSuggestions(false), 200)
                  }}
                  placeholder="Ej: Av. Insurgentes Sur 123, Col. Roma"
                  className="form-control-yega"
                />
                {searchLoading ? (
                  <span className="input-group-text">
                    <Spinner animation="border" size="sm" />
                  </span>
                ) : manualAddress ? (
                  <Button 
                    variant="outline-secondary"
                    onClick={() => {
                      setManualAddress('')
                      setAddressSuggestions([])
                      setSelectedSuggestion(null)
                    }}
                  >
                    <FaTimesCircle />
                  </Button>
                ) : (
                  <span className="input-group-text">
                    <FaSearch />
                  </span>
                )}
              </div>
            </Form.Group>
            
            {/* Sugerencias de dirección */}
            {showSuggestions && (
              <ListGroup 
                className="position-absolute w-100 shadow-sm z-10"
                style={{ maxHeight: '200px', overflowY: 'auto' }}
                ref={suggestionListRef}
              >
                {addressSuggestions.map((suggestion, index) => (
                  <ListGroup.Item 
                    key={index} 
                    action 
                    onClick={() => selectSuggestion(suggestion)}
                    className="py-2"
                  >
                    <div className="d-flex align-items-start">
                      <FaMapMarkerAlt className="me-2 mt-1 text-primary" />
                      <div>
                        <div className="fw-medium">{suggestion.text}</div>
                        {suggestion.components?.place && (
                          <small className="text-muted">
                            {suggestion.components.place}
                            {suggestion.components.region ? `, ${suggestion.components.region}` : ''}
                          </small>
                        )}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
            
            {/* Mostrar ubicación seleccionada si hay una */}
            {selectedSuggestion && !showSuggestions && (
              <div className="mt-2 p-2 border border-success rounded">
                <div className="d-flex">
                  <FaMapMarkerAlt className="text-success me-2 mt-1" />
                  <div>
                    <div className="fw-medium">{selectedSuggestion.text}</div>
                    {selectedSuggestion.center && (
                      <div className="small text-muted">
                        Coordenadas: {selectedSuggestion.center[1].toFixed(6)}, {selectedSuggestion.center[0].toFixed(6)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-3 d-grid">
          <Button
            onClick={confirmAddress}
            disabled={(!useManual && !location) || (useManual && !manualAddress.trim())}
            size="lg"
          >
            <FaCheck className="me-2" />
            Confirmar dirección
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddressConfirmation