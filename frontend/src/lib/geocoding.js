import { apiClient } from '../services/apiClient'

// Geocodificación inversa simplificada para zonas comunes de CDMX
function getAreaFromCoordinates(lat, lng) {
  // Coordenadas aproximadas de áreas conocidas de CDMX
  if (lat >= 19.39 && lat <= 19.45 && lng >= -99.18 && lng <= -99.10) {
    if (lat >= 19.40 && lng >= -99.16) return 'Roma Norte, Ciudad de México'
    if (lat >= 19.41 && lng <= -99.14) return 'Condesa, Ciudad de México'
    if (lat <= 19.42 && lng >= -99.15) return 'Centro Histórico, CDMX'
    return 'Ciudad de México, CDMX'
  }
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
}

export async function reverseGeocode(lat, lng) {
  try {
    const response = await apiClient.get(`/geocoding/reverse?lat=${lat}&lng=${lng}`)
    
    if (response.data?.success && response.data?.address) {
      return response.data.address
    }
    
    return getAreaFromCoordinates(lat, lng)
  } catch (error) {
    console.warn('API de geocoding no disponible, usando fallback:', error.message)
    return getAreaFromCoordinates(lat, lng)
  }
}

/**
 * Busca direcciones usando el servicio de geocodificación
 * @param {string} query - Texto de búsqueda
 * @returns {Promise<Array>} - Lista de sugerencias de direcciones
 */
export async function searchAddresses(query) {
  if (!query || query.length < 3) return []
  
  try {
    const response = await apiClient.get(`/geocoding/search?query=${encodeURIComponent(query)}`)
    
    if (response.data?.success && Array.isArray(response.data.results)) {
      return response.data.results.map(result => ({
        text: result.text,
        value: result.text,
        center: result.center, // [lng, lat]
        components: result.components || {}
      }))
    }
    
    return []
  } catch (error) {
    console.warn('API de búsqueda de direcciones no disponible:', error.message)
    // Resultados de respaldo básicos
    return [
      { 
        text: `${query}, Ciudad de México`, 
        value: `${query}, Ciudad de México`,
        center: [-99.1332, 19.4326], // Coordenadas de CDMX
        components: {
          street: query,
          place: 'Ciudad de México',
          region: 'CDMX',
          country: 'México'
        }
      }
    ]
  }
}

/**
 * Obtiene las coordenadas a partir de una dirección de texto
 * @param {string} address - Dirección en texto
 * @returns {Promise<{latitud: number, longitud: number} | null>} - Coordenadas o null si no se encuentra
 */
export async function geocodeAddress(address) {
  if (!address) return null
  
  try {
    const results = await searchAddresses(address)
    
    if (results && results.length > 0 && results[0].center) {
      const [lng, lat] = results[0].center
      return { latitud: lat, longitud: lng }
    }
    
    return null
  } catch (error) {
    console.warn('Error al geocodificar dirección:', error.message)
    return null
  }
}
