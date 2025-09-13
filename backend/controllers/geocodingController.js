const axios = require('axios');

// @desc    Buscar direcciones con autocompletado usando Mapbox
// @route   GET /api/geocoding/search?query=direccion
// @access  Public
exports.searchAddresses = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 3) {
      return res.json({
        success: true,
        results: []
      });
    }

    const mapboxToken = process.env.MAPBOX_TOKEN;
    if (!mapboxToken) {
      console.warn('MAPBOX_TOKEN no configurado, usando implementación de respaldo para búsqueda');
      
      // Create some mock results based on the search query
      const mockResults = [
        {
          id: 'mock-1',
          text: `${query} #123, Colonia Centro`,
          center: [-99.1332, 19.4326],
          address: query,
          context: [],
          components: {
            street: query,
            neighborhood: 'Centro',
            locality: 'Ciudad de México',
            place: 'Ciudad de México',
            region: 'CDMX',
            postcode: '06000',
            country: 'México'
          }
        },
        {
          id: 'mock-2',
          text: `${query} #456, Colonia Roma`,
          center: [-99.1632, 19.4126],
          address: query,
          context: [],
          components: {
            street: query,
            neighborhood: 'Roma',
            locality: 'Ciudad de México',
            place: 'Ciudad de México',
            region: 'CDMX',
            postcode: '06700',
            country: 'México'
          }
        }
      ];
      
      return res.json({
        success: true,
        results: mockResults,
        query: query,
        fallback: true
      });
    }

    // Hacer petición a la API de Mapbox
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
      {
        params: {
          access_token: mapboxToken,
          country: 'mx',
          types: 'address,poi',
          limit: 5,
          language: 'es'
        },
        timeout: 5000
      }
    );

    // Procesar resultados
    const results = response.data.features.map(feature => ({
      id: feature.id,
      text: feature.place_name,
      center: feature.center, // [lng, lat]
      address: feature.properties?.address || '',
      context: feature.context || [],
      // Extraer componentes útiles
      components: {
        street: feature.text || '',
        neighborhood: feature.context?.find(c => c.id.includes('neighborhood'))?.text || '',
        locality: feature.context?.find(c => c.id.includes('locality'))?.text || '',
        place: feature.context?.find(c => c.id.includes('place'))?.text || '',
        region: feature.context?.find(c => c.id.includes('region'))?.text || '',
        postcode: feature.context?.find(c => c.id.includes('postcode'))?.text || '',
        country: feature.context?.find(c => c.id.includes('country'))?.text || 'México'
      }
    }));

    res.json({
      success: true,
      results,
      query: query
    });

  } catch (error) {
    console.error('Error in geocoding search:', error);
    
    // Return a fallback response with mock results for error resilience
    const query = req.query.query;
    
    if (query && query.length >= 3) {
      // Create some mock results based on the search query
      const mockResults = [
        {
          id: 'mock-error-1',
          text: `${query} #123, Colonia Centro`,
          center: [-99.1332, 19.4326],
          address: query,
          context: [],
          components: {
            street: query,
            neighborhood: 'Centro',
            locality: 'Ciudad de México',
            place: 'Ciudad de México',
            region: 'CDMX',
            postcode: '06000',
            country: 'México'
          }
        }
      ];
      
      return res.json({
        success: true,
        results: mockResults,
        query: query,
        fallback: true,
        error_handled: true,
        error_message: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // If we can't create mock results, return a more generic error
    res.status(500).json({
      success: false,
      message: 'Error en búsqueda de direcciones',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Geocodificación inversa - obtener dirección desde coordenadas
// @route   GET /api/geocoding/reverse?lat=19.4326&lng=-99.1332
// @access  Public
exports.reverseGeocode = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitud y longitud son requeridas'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Coordenadas inválidas'
      });
    }

    // Check if Mapbox token is available
    const mapboxToken = process.env.MAPBOX_TOKEN;
    
    // If no mapbox token is available, use a fallback implementation
    if (!mapboxToken) {
      console.warn('MAPBOX_TOKEN no configurado, usando implementación de respaldo');
      
      // Return a simple response with coordinates and a generic address
      return res.json({
        success: true,
        address: `Ubicación (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,
        coordinates: { latitude, longitude },
        components: {
          street: 'Calle',
          neighborhood: 'Colonia',
          locality: 'Localidad',
          place: 'Ciudad de México',
          region: 'CDMX',
          postcode: '00000',
          country: 'México'
        },
        fallback: true // Indicate this is a fallback response
      });
    }

    // If we have a Mapbox token, use the Mapbox API
    // Hacer petición a la API de Mapbox para geocodificación inversa
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
      {
        params: {
          access_token: mapboxToken,
          types: 'address',
          limit: 1,
          language: 'es'
        },
        timeout: 5000
      }
    );

    if (!response.data.features || response.data.features.length === 0) {
      return res.json({
        success: true,
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        coordinates: { latitude, longitude }
      });
    }

    const feature = response.data.features[0];
    
    res.json({
      success: true,
      address: feature.place_name,
      coordinates: { latitude, longitude },
      components: {
        street: feature.text || '',
        neighborhood: feature.context?.find(c => c.id.includes('neighborhood'))?.text || '',
        locality: feature.context?.find(c => c.id.includes('locality'))?.text || '',
        place: feature.context?.find(c => c.id.includes('place'))?.text || '',
        region: feature.context?.find(c => c.id.includes('region'))?.text || '',
        postcode: feature.context?.find(c => c.id.includes('postcode'))?.text || '',
        country: feature.context?.find(c => c.id.includes('country'))?.text || 'México'
      }
    });

  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    
    // Return a fallback response with the coordinates for error resilience
    const latitude = parseFloat(req.query.lat);
    const longitude = parseFloat(req.query.lng);
    
    if (!isNaN(latitude) && !isNaN(longitude)) {
      return res.json({
        success: true,
        address: `Ubicación (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,
        coordinates: { latitude, longitude },
        components: {
          street: 'Calle',
          neighborhood: 'Colonia',
          locality: 'Localidad',
          place: 'Ciudad de México',
          region: 'CDMX',
          postcode: '00000',
          country: 'México'
        },
        fallback: true,
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    // If we can't even get the coordinates, then return an error
    res.status(500).json({
      success: false,
      message: 'Error en geocodificación inversa',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};