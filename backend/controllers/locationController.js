// backend/controllers/locationController.js
const Usuario = require('../models/Usuario');

// @desc    Actualizar ubicación del usuario (repartidor/tienda)
// @route   PUT /api/location/update
// @access  Private
exports.updateLocation = async (req, res) => {
  try {
    const { latitud, longitud, direccion } = req.body;
    const userId = req.user.id;
    const userRol = req.user.rol;

    // Log para depuración
    console.log(`Actualización de ubicación para ${userRol} (${userId}): [${latitud}, ${longitud}]`);

    // Validar que solo repartidores y tiendas puedan actualizar ubicación
    if (userRol !== 'repartidor' && userRol !== 'tienda') {
      return res.status(403).json({ 
        message: 'Solo repartidores y tiendas pueden actualizar su ubicación' 
      });
    }

    // Validar coordenadas
    if (!latitud || !longitud) {
      return res.status(400).json({ 
        message: 'Latitud y longitud son requeridas' 
      });
    }

    if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
      return res.status(400).json({ 
        message: 'Coordenadas inválidas' 
      });
    }

    const usuario = await Usuario.findById(userId);
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Para repartidores, verificar si tiene pedidos activos antes de actualizar
    if (userRol === 'repartidor') {
      const Pedido = require('../models/Pedido');
      const pedidosActivos = await Pedido.find({
        repartidorId: userId,
        estado: { $nin: ['entregado', 'cancelado'] }
      }).count();

      console.log(`Repartidor ${userId} tiene ${pedidosActivos} pedidos activos`);
      
      // Si no tiene pedidos activos, no actualizar la ubicación
      if (pedidosActivos === 0) {
        return res.json({
          success: true,
          message: 'No se actualiza ubicación - sin pedidos activos',
          ubicacion: usuario.ubicacion
        });
      }
    }

    // Actualizar ubicación
    await usuario.actualizarUbicacion(latitud, longitud, direccion || '');

    console.log(`Ubicación actualizada exitosamente para ${userRol} (${userId})`);

    res.json({
      success: true,
      message: 'Ubicación actualizada exitosamente',
      ubicacion: usuario.ubicacion
    });

  } catch (error) {
    console.error('Error actualizando ubicación:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener repartidores cercanos
// @route   GET /api/location/nearby-delivery
// @access  Private
exports.getNearbyDelivery = async (req, res) => {
  try {
    const { latitud, longitud, radio = 5 } = req.query; // radio en km

    if (!latitud || !longitud) {
      return res.status(400).json({ 
        message: 'Latitud y longitud son requeridas' 
      });
    }

    // Convertir a números
    const lat = parseFloat(latitud);
    const lng = parseFloat(longitud);
    const radiusKm = parseFloat(radio);

    // Buscar repartidores activos con ubicación
    const repartidores = await Usuario.find({
      rol: 'repartidor',
      estado_validacion: 'aprobado',
      activo: true,
      'ubicacion.latitud': { $exists: true },
      'ubicacion.longitud': { $exists: true }
    }).select('nombre telefono ubicacion');

    // Filtrar por distancia (cálculo simple)
    const repartidoresCercanos = repartidores.filter(repartidor => {
      const distancia = calcularDistancia(
        lat, lng,
        repartidor.ubicacion.latitud,
        repartidor.ubicacion.longitud
      );
      return distancia <= radiusKm;
    }).map(repartidor => ({
      id: repartidor._id,
      nombre: repartidor.nombre,
      telefono: repartidor.telefono,
      ubicacion: repartidor.ubicacion,
      distancia: calcularDistancia(
        lat, lng,
        repartidor.ubicacion.latitud,
        repartidor.ubicacion.longitud
      )
    })).sort((a, b) => a.distancia - b.distancia);

    res.json({
      success: true,
      repartidores: repartidoresCercanos,
      total: repartidoresCercanos.length
    });

  } catch (error) {
    console.error('Error obteniendo repartidores cercanos:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener tiendas cercanas
// @route   GET /api/location/nearby-stores
// @access  Private
exports.getNearbyStores = async (req, res) => {
  try {
    const { latitud, longitud, radio = 10 } = req.query; // radio en km

    if (!latitud || !longitud) {
      return res.status(400).json({ 
        message: 'Latitud y longitud son requeridas' 
      });
    }

    const lat = parseFloat(latitud);
    const lng = parseFloat(longitud);
    const radiusKm = parseFloat(radio);

    // Buscar tiendas activas con ubicación
    const tiendas = await Usuario.find({
      rol: 'tienda',
      estado_validacion: 'aprobado',
      activo: true,
      'ubicacion.latitud': { $exists: true },
      'ubicacion.longitud': { $exists: true }
    }).select('nombre telefono email ubicacion');

    // Filtrar por distancia
    const tiendasCercanas = tiendas.filter(tienda => {
      const distancia = calcularDistancia(
        lat, lng,
        tienda.ubicacion.latitud,
        tienda.ubicacion.longitud
      );
      return distancia <= radiusKm;
    }).map(tienda => ({
      id: tienda._id,
      nombre: tienda.nombre,
      telefono: tienda.telefono,
      email: tienda.email,
      ubicacion: tienda.ubicacion,
      distancia: calcularDistancia(
        lat, lng,
        tienda.ubicacion.latitud,
        tienda.ubicacion.longitud
      )
    })).sort((a, b) => a.distancia - b.distancia);

    res.json({
      success: true,
      tiendas: tiendasCercanas,
      total: tiendasCercanas.length
    });

  } catch (error) {
    console.error('Error obteniendo tiendas cercanas:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Función auxiliar para calcular distancia entre dos puntos (fórmula de Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distancia = R * c;
  return distancia;
}
