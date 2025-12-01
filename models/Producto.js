// backend/models/Producto.js
const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  descripcion: { 
    type: String, 
    required: [true, 'La descripción es requerida'],
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  precio: { 
    type: Number, 
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  stock: { 
    type: Number, 
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  tiendaId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: [true, 'La tienda es requerida']
  },
  categoria: {
    type: String,
    enum: ['comida', 'bebida', 'postre', 'snack', 'otro'],
    default: 'otro'
  },
  imagen: { 
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Producto'
  },
  disponible: { 
    type: Boolean, 
    default: true 
  },
  peso: { 
    type: Number, 
    min: [0, 'El peso no puede ser negativo']
  }, // en gramos
  tiempo_preparacion: { 
    type: Number, 
    min: [0, 'El tiempo de preparación no puede ser negativo'],
    default: 15
  }, // en minutos
  tags: [{ 
    type: String, 
    trim: true 
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimizar consultas
ProductoSchema.index({ tiendaId: 1, disponible: 1 });
ProductoSchema.index({ categoria: 1 });
ProductoSchema.index({ nombre: 'text', descripcion: 'text' });

// Virtual para verificar si está en stock
ProductoSchema.virtual('enStock').get(function() {
  return this.stock > 0 && this.disponible;
});

// Método para reducir stock
ProductoSchema.methods.reducirStock = function(cantidad) {
  if (this.stock >= cantidad) {
    this.stock -= cantidad;
    return this.save();
  } else {
    throw new Error('Stock insuficiente');
  }
};

// Método para aumentar stock
ProductoSchema.methods.aumentarStock = function(cantidad) {
  this.stock += cantidad;
  return this.save();
};

// Middleware para validar que la tienda existe
ProductoSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('tiendaId')) {
    const Usuario = mongoose.model('Usuario');
    const tienda = await Usuario.findById(this.tiendaId);
    if (!tienda || tienda.rol !== 'tienda') {
      next(new Error('ID de tienda inválido'));
    }
  }
  next();
});

const Producto = mongoose.model('Producto', ProductoSchema);
module.exports = Producto;
