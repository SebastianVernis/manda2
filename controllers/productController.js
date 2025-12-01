// backend/controllers/productController.js
const Producto = require('../models/Producto');

const mongoose = require('mongoose');

// @desc    Obtener todos los productos con filtros y paginación
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      tiendaId, 
      categoria, 
      buscar,
      disponible = true,
      precio_min,
      precio_max
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir query de filtros
    let query = {};
    
    if (tiendaId) {
      query.tiendaId = tiendaId;
    }
    
    if (categoria && categoria !== 'todos') {
      query.categoria = categoria;
    }
    
    if (disponible !== 'false') {
      query.disponible = true;
      query.stock = { $gt: 0 };
    }
    
    if (precio_min || precio_max) {
      query.precio = {};
      if (precio_min) query.precio.$gte = parseFloat(precio_min);
      if (precio_max) query.precio.$lte = parseFloat(precio_max);
    }
    
    // Búsqueda por texto
    if (buscar) {
      query.$text = { $search: buscar };
    }

    const productos = await Producto.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('tiendaId', 'nombre email telefono ubicacion')
      .sort(buscar ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

    const totalProductos = await Producto.countDocuments(query);

    res.json({
      success: true,
      productos,
      paginacion: {
        pagina_actual: parseInt(page),
        total_paginas: Math.ceil(totalProductos / parseInt(limit)),
        total_productos: totalProductos,
        productos_por_pagina: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    // Validar formato de ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: 'ID de producto inválido',
        debug: `ID ${id} no es un ObjectId válido de MongoDB`
      });
    }

    const producto = await Producto.findById(id)
      .populate('tiendaId', 'nombre email telefono ubicacion');

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({
      success: true,
      producto
    });

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Crear un nuevo producto
// @route   POST /api/products
// @access  Private (solo tiendas)
exports.createProduct = async (req, res) => {
  try {
    const { 
      nombre, 
      descripcion, 
      precio, 
      stock, 
      categoria,
      imagen, 
      peso,
      tiempo_preparacion,
      tags
    } = req.body;
    
    const tiendaId = req.user.id;

    // Validar que el usuario es una tienda
    if (req.user.rol !== 'tienda' && req.user.rol !== 'administrador') {
      return res.status(403).json({ 
        message: 'Solo las tiendas pueden crear productos' 
      });
    }

    // Validaciones básicas
    if (!nombre || !descripcion || precio === undefined || stock === undefined) {
      return res.status(400).json({ 
        message: 'Nombre, descripción, precio y stock son requeridos' 
      });
    }

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      stock,
      categoria: categoria || 'otro',
      tiendaId,
      imagen,
      peso,
      tiempo_preparacion: tiempo_preparacion || 15,
      tags: tags || []
    });

    const productoCreado = await nuevoProducto.save();
    await productoCreado.populate('tiendaId', 'nombre email telefono');

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      producto: productoCreado
    });

  } catch (error) {
    console.error('Error creando producto:', error);
    
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

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Private (solo tiendas propietarias)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      descripcion, 
      precio, 
      stock, 
      categoria,
      imagen, 
      disponible,
      peso,
      tiempo_preparacion,
      tags
    } = req.body;

    // Validar formato de ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: 'ID de producto inválido',
        debug: `ID ${id} no es un ObjectId válido de MongoDB`
      });
    }

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar autorización
    if (req.user.rol !== 'administrador' && 
        producto.tiendaId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ 
        message: 'No autorizado para actualizar este producto' 
      });
    }

    // Actualizar campos
    if (nombre !== undefined) producto.nombre = nombre;
    if (descripcion !== undefined) producto.descripcion = descripcion;
    if (precio !== undefined) producto.precio = precio;
    if (stock !== undefined) producto.stock = stock;
    if (categoria !== undefined) producto.categoria = categoria;
    if (imagen !== undefined) producto.imagen = imagen;
    if (disponible !== undefined) producto.disponible = disponible;
    if (peso !== undefined) producto.peso = peso;
    if (tiempo_preparacion !== undefined) producto.tiempo_preparacion = tiempo_preparacion;
    if (tags !== undefined) producto.tags = tags;

    const productoActualizado = await producto.save();
    await productoActualizado.populate('tiendaId', 'nombre email telefono');

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      producto: productoActualizado
    });

  } catch (error) {
    console.error('Error actualizando producto:', error);
    
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

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Private (solo tiendas propietarias)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar formato de ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: 'ID de producto inválido',
        debug: `ID ${id} no es un ObjectId válido de MongoDB`
      });
    }

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar autorización
    if (req.user.rol !== 'administrador' && 
        producto.tiendaId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ 
        message: 'No autorizado para eliminar este producto' 
      });
    }

    await producto.deleteOne();

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener categorías disponibles
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categorias = await Producto.distinct('categoria');
    
    res.json({
      success: true,
      categorias: categorias.filter(cat => cat) // Filtrar valores null/undefined
    });

  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Actualizar stock de un producto
// @route   PATCH /api/products/:id/stock
// @access  Private (solo tiendas propietarias)
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock, operacion = 'set' } = req.body; // operacion: 'set', 'add', 'subtract'

    if (stock === undefined) {
      return res.status(400).json({ message: 'Stock es requerido' });
    }

    // Validar formato de ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: 'ID de producto inválido',
        debug: `ID ${id} no es un ObjectId válido de MongoDB`
      });
    }

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Verificar autorización
    if (req.user.rol !== 'administrador' && 
        producto.tiendaId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ 
        message: 'No autorizado para actualizar este producto' 
      });
    }

    // Actualizar stock según operación
    switch (operacion) {
      case 'add':
        producto.stock += parseInt(stock);
        break;
      case 'subtract':
        producto.stock = Math.max(0, producto.stock - parseInt(stock));
        break;
      default:
        producto.stock = parseInt(stock);
    }

    await producto.save();

    res.json({
      success: true,
      message: 'Stock actualizado exitosamente',
      stock_actual: producto.stock
    });

  } catch (error) {
    console.error('Error actualizando stock:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
