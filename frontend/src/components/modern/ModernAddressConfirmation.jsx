import React, { useState, useEffect, useRef } from 'react'
import { Card, CardBody, Button, Input, Chip, Spinner } from "@heroui/react"
import { motion, AnimatePresence } from "framer-motion"
import { FaLocationArrow, FaMapMarkerAlt, FaCheck, FaSearch, FaTimes } from 'react-icons/fa'
import { reverseGeocode } from '../../lib/geocoding'

// Mapbox Geocoding API
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoieWVnYSIsImEiOiJjbTZnbXFkMzAwMDEyMmpzZDZ5YXM3Z2k1In0.example' // Reemplazar con token real

const searchAddresses = async (query) => {
  if (!query || query.length < 3) return []
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
      `access_token=${MAPBOX_ACCESS_TOKEN}&` +
      `country=mx&` +
      `types=address,poi&` +
      `limit=5&` +
      `language=es`
    )
    
    if (!response.ok) throw new Error('Error en la búsqueda')
    
    const data = await response.json()
    return data.features.map(feature => ({
      id: feature.id,
      text: feature.place_name,
      center: feature.center, // [lng, lat]
      address: feature.properties?.address || '',
      context: feature.context || []
    }))
  } catch (error) {
    console.error('Error searching addresses:', error)
    return []
  }
}

const ModernAddressConfirmation = ({ onConfirm, className = '' }) => {
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState(null)
  const [address, setAddress] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [useManual, setUseManual] = useState(false)
  const [error, setError] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const searchTimeoutRef = useRef(null)

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
      setError('No se pudo obtener tu ubicación. Por favor busca tu dirección manualmente.')
    } finally {
      setLoading(false)
    }
  }

  // Búsqueda de direcciones con debounce
  useEffect(() => {
    if (!useManual || !searchQuery || searchQuery.length < 3) {
      setSearchResults([])
      return
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const results = await searchAddresses(searchQuery)
        setSearchResults(results)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, useManual])

  // Seleccionar dirección de los resultados
  const selectAddress = (result) => {
    setSelectedAddress(result)
    setSearchQuery(result.text)
    setSearchResults([])
    
    // Extraer componentes de la dirección
    const location = {
      latitud: result.center[1],
      longitud: result.center[0]
    }
    setLocation(location)
    setAddress(result.text)
  }

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setSelectedAddress(null)
    setLocation(null)
    setAddress('')
  }

  // Confirmar dirección
  const confirmAddress = () => {
    if (useManual && !selectedAddress && !searchQuery.trim()) {
      setError('Por favor busca y selecciona tu dirección')
      return
    }

    if (!useManual && !location) {
      setError('Por favor obtén tu ubicación primero')
      return
    }

    const finalAddress = useManual ? (selectedAddress?.text || searchQuery.trim()) : address
    const finalLocation = location

    // Parsear dirección para obtener componentes
    const addressParts = finalAddress.split(',').map(part => part.trim())
    
    onConfirm({
      direccion_envio: {
        calle: addressParts[0] || finalAddress,
        numero: 'S/N',
        ciudad: addressParts.find(part => 
          part.toLowerCase().includes('ciudad') || 
          part.toLowerCase().includes('méxico') ||
          part.toLowerCase().includes('guadalajara') ||
          part.toLowerCase().includes('monterrey')
        ) || 'Ciudad de México',
        codigo_postal: selectedAddress?.context?.find(c => c.id.includes('postcode'))?.text || '00000',
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
      <Card className="yega-glass">
        <CardBody className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaMapMarkerAlt className="text-gray-400 text-xl" />
            <h3 className="text-xl font-semibold text-white">Confirma tu dirección de entrega</h3>
          </div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6"
            >
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}

          {/* Toggle buttons */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={!useManual ? "solid" : "bordered"}
              className={!useManual ? 'bg-white text-black' : 'border-gray-600 text-gray-300'}
              onClick={() => {
                setUseManual(false)
                clearSearch()
                setError(null)
              }}
              startContent={<FaLocationArrow />}
            >
              Usar mi ubicación
            </Button>
            <Button
              variant={useManual ? "solid" : "bordered"}
              className={useManual ? 'bg-white text-black' : 'border-gray-600 text-gray-300'}
              onClick={() => {
                setUseManual(true)
                setLocation(null)
                setAddress('')
                setError(null)
              }}
              startContent={<FaSearch />}
            >
              Buscar dirección
            </Button>
          </div>

          {!useManual ? (
            // Modo ubicación GPS
            <div className="space-y-4">
              {!location ? (
                <div className="text-center py-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={getCurrentLocation}
                      disabled={loading}
                      size="lg"
                      className="bg-gradient-to-r from-gray-200 to-white text-black font-semibold px-8"
                      startContent={loading ? <Spinner size="sm" /> : <FaLocationArrow />}
                    >
                      {loading ? 'Obteniendo ubicación...' : 'Obtener mi ubicación'}
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/20 border border-green-500/50 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <FaCheck className="text-green-400 mt-1" />
                    <div className="flex-1">
                      <div className="text-white font-semibold mb-2">Ubicación detectada:</div>
                      <div className="text-gray-300 mb-2">{address}</div>
                      <div className="text-gray-400 text-sm">
                        Coordenadas: {location.latitud.toFixed(6)}, {location.longitud.toFixed(6)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            // Modo búsqueda
            <div className="space-y-4">
              <div className="relative">
                <Input
                  placeholder="Busca tu dirección... (ej: Av. Insurgentes Sur 123)"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  classNames={{
                    input: "text-white",
                    inputWrapper: "border-gray-600 data-[hover=true]:border-gray-400 group-data-[focus=true]:border-white"
                  }}
                  startContent={<FaSearch className="text-gray-400" />}
                  endContent={
                    searchQuery && (
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onClick={clearSearch}
                        className="text-gray-400 hover:text-white"
                      >
                        <FaTimes />
                      </Button>
                    )
                  }
                />
                
                {/* Resultados de búsqueda */}
                <AnimatePresence>
                  {(searchResults.length > 0 || searchLoading) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
                    >
                      {searchLoading ? (
                        <div className="p-4 text-center">
                          <Spinner size="sm" />
                          <p className="text-gray-400 mt-2">Buscando direcciones...</p>
                        </div>
                      ) : (
                        searchResults.map((result, index) => (
                          <motion.button
                            key={result.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="w-full p-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                            onClick={() => selectAddress(result)}
                          >
                            <div className="text-white font-medium">{result.text}</div>
                            {result.address && (
                              <div className="text-gray-400 text-sm mt-1">{result.address}</div>
                            )}
                          </motion.button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dirección seleccionada */}
              {selectedAddress && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-blue-400 mt-1" />
                    <div className="flex-1">
                      <div className="text-white font-semibold mb-2">Dirección seleccionada:</div>
                      <div className="text-gray-300">{selectedAddress.text}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Botón de confirmación */}
          <div className="mt-6">
            <Button
              onClick={confirmAddress}
              disabled={
                (!useManual && !location) || 
                (useManual && !selectedAddress && !searchQuery.trim())
              }
              size="lg"
              className="w-full bg-gradient-to-r from-gray-200 to-white text-black font-semibold"
              startContent={<FaCheck />}
            >
              Confirmar dirección
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default ModernAddressConfirmation