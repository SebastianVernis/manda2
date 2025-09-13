// backend/controllers/orderController.js
const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');

// @desc    Crear un nuevo pedido
// @route   POST /api/orders
// @access  Private (solo clientes)
exports.createOrder = async (req, res) => {
  try {
    const { productos, direccion_envio, metodo_pago, notas } = req.body;
    const clienteId = req.user.id;

    // Validar que es un cliente
    if (req.user.rol !== 'cliente') {
      return res.status(403).json({ 
        message: 'Solo los clientes pueden crear pedidos' 
      });
    }

    // Validaciones básicas
    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ 
        message: 'Debe incluir al menos un producto' 
      });
    }

    if (!direccion_envio || !metodo_pago) {
      return res.status(400).json({ 
        message: 'Dirección de envío y método de pago son requeridos' 
      });
    }

    // Importar mongoose para validación de ObjectId
    const mongoose = require('mongoose');

    // Verificar que todos los productos tienen IDs válidos
    for (const item of productos) {
      if (!mongoose.Types.ObjectId.isValid(item.producto)) {
        return res.status(400).json({
          success: false,
          message: `ID de producto inválido: ${item.producto}`
        });
      }
    }

    // Verificar que todos los productos pertenecen a la misma tienda
    const primerProducto = await Producto.findById(productos[0].producto);
    if (!primerProducto) {
      return res.status(404).json({ 
        message: `Producto ${productos[0].producto} no encontrado` 
      });
    }

    const tiendaId = primerProducto.tiendaId;
    let subtotal = 0;
    const productosPedido = [];

    // Procesar cada producto
    for (const item of productos) {
      // Ya validamos que es un ObjectId válido arriba
      const productoDB = await Producto.findById(item.producto);
      
      if (!productoDB) {
        return res.status(404).json({ 
          message: `Producto ${item.producto} no encontrado` 
        });
      }

      // Verificar que todos los productos son de la misma tienda
      if (productoDB.tiendaId.toString() !== tiendaId.toString()) {
        return res.status(400).json({ 
          message: 'Todos los productos deben ser de la misma tienda' 
        });
      }

      // Verificar disponibilidad y stock
      if (!productoDB.disponible) {
        return res.status(400).json({ 
          message: `El producto ${productoDB.nombre} no está disponible` 
        });
      }

      if (productoDB.stock < item.cantidad) {
        return res.status(400).json({ 
          message: `Stock insuficiente para ${productoDB.nombre}. Stock disponible: ${productoDB.stock}` 
        });
      }

      const precio_unitario = productoDB.precio;
      const subtotal_item = precio_unitario * item.cantidad;
      subtotal += subtotal_item;

      productosPedido.push({
        producto: productoDB._id,
        cantidad: item.cantidad,
        precio_unitario,
        subtotal: subtotal_item
      });

      // Reducir stock
      await productoDB.reducirStock(item.cantidad);
    }

    // Calcular costo de envío (lógica simple)
    const costo_envio = calcularCostoEnvio(subtotal, direccion_envio);
    const total = subtotal + costo_envio;

    // Crear pedido
    const nuevoPedido = new Pedido({
      clienteId,
      tiendaId,
      productos: productosPedido,
      subtotal,
      costo_envio,
      total,
      direccion_envio,
      metodo_pago,
      notas: notas || '',
      tiempo_estimado: calcularTiempoEstimado(productosPedido),
      fecha_entrega_estimada: new Date(Date.now() + calcularTiempoEstimado(productosPedido) * 60000)
    });

    const pedidoCreado = await nuevoPedido.save();
    await pedidoCreado.populate([
      { path: 'clienteId', select: 'nombre telefono email' },
      { path: 'tiendaId', select: 'nombre telefono email ubicacion' },
      { path: 'productos.producto', select: 'nombre precio imagen' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      pedido: pedidoCreado
    });

  } catch (error) {
    console.error('Error creando pedido:', error);
    
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Errores de validación',
        errores 
      });
    }

    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener pedidos del usuario
// @route   GET /api/orders
// @access  Private
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRol = req.user.rol;
    const { 
      page = 1, 
      limit = 10, 
      estado, 
      fecha_inicio, 
      fecha_fin,
      tiendaId,
      clienteId,
      repartidorId,
      numero
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construir query según el rol
    let query = {};
    
    switch (userRol) {
      case 'cliente':
        query.clienteId = userId;
        break;
      case 'tienda':
        query.tiendaId = userId;
        break;
      case 'repartidor':
        query.repartidorId = userId;
        break;
      case 'administrador':
        // Administrador puede ver todos los pedidos y aplicar filtros
        if (tiendaId) query.tiendaId = tiendaId;
        if (clienteId) query.clienteId = clienteId;
        if (repartidorId) query.repartidorId = repartidorId;
        if (numero) query.numero_pedido = numero;
        break;
      default:
        return res.status(403).json({ message: 'Rol no autorizado' });
    }

    // Filtros adicionales
    if (estado) {
      query.estado = estado;
    }

    if (fecha_inicio || fecha_fin) {
      query.createdAt = {};
      if (fecha_inicio) query.createdAt.$gte = new Date(fecha_inicio);
      if (fecha_fin) query.createdAt.$lte = new Date(fecha_fin);
    }

    const pedidos = await Pedido.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('clienteId', 'nombre telefono email')
      .populate('tiendaId', 'nombre telefono email ubicacion')
      .populate('repartidorId', 'nombre telefono email')
      .populate('productos.producto', 'nombre precio imagen')
      .sort({ createdAt: -1 });

    const totalPedidos = await Pedido.countDocuments(query);

    res.json({
      success: true,
      pedidos,
      paginacion: {
        pagina_actual: parseInt(page),
        total_paginas: Math.ceil(totalPedidos / parseInt(limit)),
        total_pedidos: totalPedidos,
        pedidos_por_pagina: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Listar pedidos disponibles para repartidores (no asignados y listos)
// @route   GET /api/orders/available
// @access  Private (repartidor)
exports.getAvailableOrders = async (req, res) => {
  try {
    const userRol = req.user.rol;
    if (userRol !== 'repartidor') {
      return res.status(403).json({ message: 'Solo repartidores pueden ver pedidos disponibles' });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { estado: 'listo', repartidorId: { $exists: false } };

    const pedidos = await Pedido.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('clienteId', 'nombre telefono email')
      .populate('tiendaId', 'nombre telefono email ubicacion')
      .populate('productos.producto', 'nombre precio imagen')
      .sort({ createdAt: -1 });

    const totalPedidos = await Pedido.countDocuments(query);

    res.json({
      success: true,
      pedidos,
      paginacion: {
        pagina_actual: parseInt(page),
        total_paginas: Math.ceil(totalPedidos / parseInt(limit)),
        total_pedidos: totalPedidos,
        pedidos_por_pagina: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo pedidos disponibles:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Repartidor toma un pedido disponible (claim)
// @route   PUT /api/orders/:id/claim
// @access  Private (repartidor)
exports.claimOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRol = req.user.rol;

    if (userRol !== 'repartidor') {
      return res.status(403).json({ message: 'Solo repartidores pueden tomar pedidos' });
    }

    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (pedido.repartidorId) {
      return res.status(400).json({ message: 'El pedido ya tiene repartidor asignado' });
    }

    if (pedido.estado !== 'listo') {
      return res.status(400).json({ message: 'Solo se pueden tomar pedidos en estado "listo"' });
    }

    pedido.repartidorId = userId;
    await pedido.save();
    await pedido.populate([
      { path: 'clienteId', select: 'nombre telefono email' },
      { path: 'tiendaId', select: 'nombre telefono email ubicacion' },
      { path: 'repartidorId', select: 'nombre telefono email ubicacion' }
    ]);

    res.json({
      success: true,
      message: 'Pedido tomado exitosamente',
      pedido
    });

  } catch (error) {
    console.error('Error tomando pedido:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener un pedido por ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRol = req.user.rol;

    const pedido = await Pedido.findById(id)
      .populate('clienteId', 'nombre telefono email')
      .populate('tiendaId', 'nombre telefono email ubicacion')
      .populate('repartidorId', 'nombre telefono email ubicacion')
      .populate('productos.producto', 'nombre precio imagen descripcion');

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Verificar autorización
    const autorizado = userRol === 'administrador' ||
                      (userRol === 'cliente' && pedido.clienteId._id.toString() === userId) ||
                      (userRol === 'tienda' && pedido.tiendaId._id.toString() === userId) ||
                      (userRol === 'repartidor' && pedido.repartidorId && pedido.repartidorId._id.toString() === userId);

    if (!autorizado) {
      return res.status(403).json({ 
        message: 'No autorizado para ver este pedido' 
      });
    }

    res.json({
      success: true,
      pedido
    });

  } catch (error) {
    console.error('Error obteniendo pedido:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Actualizar estado de un pedido
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const userId = req.user.id;
    const userRol = req.user.rol;

    if (!estado) {
      return res.status(400).json({ message: 'Estado es requerido' });
    }

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Verificar autorización según el rol y estado
    let autorizado = false;
    
    if (userRol === 'administrador') {
      autorizado = true;
    } else if (userRol === 'tienda' && pedido.tiendaId.toString() === userId) {
      // Tiendas pueden cambiar: pendiente -> confirmado/cancelado, confirmado -> preparando, preparando -> listo
      autorizado = ['confirmado', 'preparando', 'listo', 'cancelado'].includes(estado);
    } else if (userRol === 'repartidor' && pedido.repartidorId && pedido.repartidorId.toString() === userId) {
      // Repartidores pueden cambiar: listo -> camino_tienda, camino_tienda -> recolectado, recolectado -> en_camino, en_camino -> entregado
      autorizado = ['camino_tienda', 'recolectado', 'en_camino', 'entregado'].includes(estado);
    }

    if (!autorizado) {
      return res.status(403).json({ 
        message: 'No autorizado para cambiar el estado de este pedido' 
      });
    }

    // Cambiar estado usando el método del modelo
    await pedido.cambiarEstado(estado);

    await pedido.populate([
      { path: 'clienteId', select: 'nombre telefono email' },
      { path: 'tiendaId', select: 'nombre telefono email' },
      { path: 'repartidorId', select: 'nombre telefono email' }
    ]);

    res.json({
      success: true,
      message: 'Estado del pedido actualizado exitosamente',
      pedido
    });

  } catch (error) {
    console.error('Error actualizando estado del pedido:', error);
    
    if (error.message.includes('Transición de estado inválida')) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Asignar repartidor a un pedido
// @route   PUT /api/orders/:id/assign-delivery
// @access  Private (tienda, admin)
exports.assignDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { repartidorId } = req.body;
    const userRol = req.user.rol;
    const userId = req.user.id;

    if (!repartidorId) {
      return res.status(400).json({ message: 'ID del repartidor es requerido' });
    }

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Verificar autorización
    if (userRol !== 'administrador' && 
        (userRol !== 'tienda' || pedido.tiendaId.toString() !== userId)) {
      return res.status(403).json({ 
        message: 'No autorizado para asignar repartidor' 
      });
    }

    // Verificar que el repartidor existe y está activo
    const repartidor = await Usuario.findById(repartidorId);
    if (!repartidor || repartidor.rol !== 'repartidor' || 
        repartidor.estado_validacion !== 'aprobado' || !repartidor.activo) {
      return res.status(400).json({ 
        message: 'Repartidor inválido o no disponible' 
      });
    }

    // Asignar repartidor y cambiar estado
    pedido.repartidorId = repartidorId;
    if (pedido.estado === 'listo') {
      pedido.estado = 'en_camino';
    }

    await pedido.save();
    await pedido.populate([
      { path: 'clienteId', select: 'nombre telefono email' },
      { path: 'tiendaId', select: 'nombre telefono email' },
      { path: 'repartidorId', select: 'nombre telefono email ubicacion' }
    ]);

    res.json({
      success: true,
      message: 'Repartidor asignado exitosamente',
      pedido
    });

  } catch (error) {
    console.error('Error asignando repartidor:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Calificar un pedido
// @route   PUT /api/orders/:id/rate
// @access  Private (solo cliente del pedido)
exports.rateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { puntuacion, comentario } = req.body;
    const userId = req.user.id;

    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({ 
        message: 'La puntuación debe ser entre 1 y 5' 
      });
    }

    const pedido = await Pedido.findById(id);

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Verificar que es el cliente del pedido
    if (pedido.clienteId.toString() !== userId) {
      return res.status(403).json({ 
        message: 'Solo el cliente puede calificar el pedido' 
      });
    }

    // Verificar que el pedido está entregado
    if (pedido.estado !== 'entregado') {
      return res.status(400).json({ 
        message: 'Solo se pueden calificar pedidos entregados' 
      });
    }

    // Agregar calificación
    pedido.calificacion = {
      puntuacion,
      comentario: comentario || ''
    };

    await pedido.save();

    res.json({
      success: true,
      message: 'Pedido calificado exitosamente',
      calificacion: pedido.calificacion
    });

  } catch (error) {
    console.error('Error calificando pedido:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Funciones auxiliares
function calcularCostoEnvio(subtotal) {
  // Lógica simple de costo de envío
  if (subtotal >= 50) return 0; // Envío gratis por compras mayores a $50
  return 5; // Costo fijo de envío
}

function calcularTiempoEstimado(productos) {
  // Calcular tiempo basado en tiempo de preparación de productos
  const tiempoTotal = productos.reduce((total, item) => {
    return total + (item.tiempo_preparacion || 15);
  }, 0);
  
  return Math.max(30, tiempoTotal + 15); // Mínimo 30 minutos, más 15 min de envío
}
