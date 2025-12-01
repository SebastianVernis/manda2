// backend/controllers/storeController.js - Simple version
const Usuario = require('../models/Usuario');

// Función para calcular distancia entre dos puntos
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distancia en km
};

// Obtener todas las tiendas (público)
const getStores = async (req, res) => {
  try {
    const { lat, lng, limit = 50 } = req.query;
    
    // Buscar todas las tiendas activas
    const tiendas = await Usuario.find({ 
      rol: 'tienda',
      estado_validacion: 'aprobado' // Solo tiendas aprobadas
    })
    .select('nombre email telefono ubicacion estado_validacion createdAt')
    .lean();

    // Si se proporcionan coordenadas, calcular distancias
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      
      tiendas.forEach(tienda => {
        if (tienda.ubicacion?.latitud && tienda.ubicacion?.longitud) {
          tienda.distancia = calculateDistance(
            userLat, 
            userLng, 
            tienda.ubicacion.latitud, 
            tienda.ubicacion.longitud
          );
        }
      });

      // Ordenar por distancia (más cercanas primero)
      tiendas.sort((a, b) => {
        if (!a.distancia && !b.distancia) return 0;
        if (!a.distancia) return 1;
        if (!b.distancia) return -1;
        return a.distancia - b.distancia;
      });
    }

    // Limitar resultados
    const limitedTiendas = tiendas.slice(0, parseInt(limit));

    // Formatear respuesta
    const formattedTiendas = limitedTiendas.map(tienda => ({
      id: tienda._id,
      nombre: tienda.nombre,
      email: tienda.email,
      telefono: tienda.telefono,
      ubicacion: tienda.ubicacion,
      estado: tienda.estado_validacion,
      distancia: tienda.distancia || null,
      createdAt: tienda.createdAt
    }));

    res.json({
      success: true,
      tiendas: formattedTiendas,
      total: formattedTiendas.length
    });

  } catch (error) {
    console.error('Error obteniendo tiendas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener tienda por ID (público)
const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const tienda = await Usuario.findOne({
      _id: id,
      rol: 'tienda',
      estado_validacion: 'aprobado'
    })
    .select('nombre email telefono ubicacion estado_validacion createdAt')
    .lean();

    if (!tienda) {
      return res.status(404).json({
        success: false,
        message: 'Tienda no encontrada'
      });
    }

    const formattedTienda = {
      id: tienda._id,
      nombre: tienda.nombre,
      email: tienda.email,
      telefono: tienda.telefono,
      ubicacion: tienda.ubicacion,
      estado: tienda.estado_validacion,
      createdAt: tienda.createdAt
    };

    res.json({
      success: true,
      tienda: formattedTienda
    });

  } catch (error) {
    console.error('Error obteniendo tienda:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getStores,
  getStoreById
};