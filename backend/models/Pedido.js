// backend/models/Pedido.js
const mongoose = require('mongoose');

const DireccionSchema = new mongoose.Schema({
  calle: { type: String, required: true },
  numero: { type: String, required: true },
  ciudad: { type: String, required: true },
  codigo_postal: { type: String },
  referencias: { type: String },
  latitud: { type: Number },
  longitud: { type: Number }
}, { _id: false });

const ProductoPedidoSchema = new mongoose.Schema({
  producto: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Producto', 
    required: true 
  },
  cantidad: { 
    type: Number, 
    required: true, 
    min: [1, 'La cantidad debe ser al menos 1']
  },
  precio_unitario: { 
    type: Number, 
    required: true,
    min: [0, 'El precio unitario no puede ser negativo']
  },
  subtotal: { 
    type: Number, 
    required: true,
    min: [0, 'El subtotal no puede ser negativo']
  }
}, { _id: false });

const PedidoSchema = new mongoose.Schema({
  numero_pedido: {
    type: String,
    unique: true,
    required: true
  },
  clienteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: [true, 'El cliente es requerido']
  },
  tiendaId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: [true, 'La tienda es requerida']
  },
  repartidorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario' 
  },
  productos: [ProductoPedidoSchema],
  subtotal: { 
    type: Number, 
    required: true, 
    min: [0, 'El subtotal no puede ser negativo']
  },
  costo_envio: { 
    type: Number, 
    default: 0,
    min: [0, 'El costo de envío no puede ser negativo']
  },
  total: { 
    type: Number, 
    required: true, 
    min: [0, 'El total no puede ser negativo']
  },
  estado: { 
    type: String, 
    enum: ['pendiente', 'confirmado', 'preparando', 'listo', 'camino_tienda', 'recolectado', 'en_camino', 'entregado', 'cancelado'], 
    default: 'pendiente' 
  },
  direccion_envio: DireccionSchema,
  metodo_pago: { 
    type: String, 
    enum: ['efectivo', 'tarjeta', 'transferencia'],
    required: [true, 'El método de pago es requerido']
  },
  notas: { type: String, maxlength: [500, 'Las notas no pueden exceder 500 caracteres'] },
  tiempo_estimado: { type: Number }, // en minutos
  fecha_entrega_estimada: { type: Date },
  fecha_entrega_real: { type: Date },
  calificacion: {
    puntuacion: { type: Number, min: 1, max: 5 },
    comentario: { type: String, maxlength: [500, 'El comentario no puede exceder 500 caracteres'] }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimizar consultas
PedidoSchema.index({ clienteId: 1, createdAt: -1 });
PedidoSchema.index({ tiendaId: 1, estado: 1 });
PedidoSchema.index({ repartidorId: 1, estado: 1 });
PedidoSchema.index({ numero_pedido: 1 });

// Generar número de pedido antes de validar (para cumplir 'required')
PedidoSchema.pre('validate', async function(next) {
  if (this.isNew && !this.numero_pedido) {
    try {
      const count = await mongoose.model('Pedido').countDocuments();
      this.numero_pedido = `YEGA-${String(count + 1).padStart(6, '0')}`;
    } catch (e) {
      return next(e);
    }
  }
  next();
});

// Virtual para obtener el estado en español
PedidoSchema.virtual('estadoTexto').get(function() {
  const estados = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    preparando: 'Preparando',
    listo: 'Listo para envío',
    camino_tienda: 'En camino a la tienda',
    recolectado: 'Recolectado',
    en_camino: 'En camino al cliente',
    entregado: 'Entregado',
    cancelado: 'Cancelado'
  };
  return estados[this.estado] || this.estado;
});

// Método para calcular totales
PedidoSchema.methods.calcularTotales = function() {
  this.subtotal = this.productos.reduce((sum, item) => sum + item.subtotal, 0);
  this.total = this.subtotal + this.costo_envio;
  return this;
};

// Método para cambiar estado con validaciones
PedidoSchema.methods.cambiarEstado = function(nuevoEstado) {
  const transicionesValidas = {
    pendiente: ['confirmado', 'cancelado'],
    confirmado: ['preparando', 'cancelado'],
    preparando: ['listo', 'cancelado'],
    listo: ['camino_tienda', 'en_camino', 'cancelado'], // Permitir ambas transiciones: la directa o la que pasa por la tienda
    camino_tienda: ['recolectado', 'cancelado'],
    recolectado: ['en_camino', 'cancelado'],
    en_camino: ['entregado', 'cancelado'],
    entregado: [],
    cancelado: []
  };

  if (transicionesValidas[this.estado].includes(nuevoEstado)) {
    this.estado = nuevoEstado;
    if (nuevoEstado === 'entregado') {
      this.fecha_entrega_real = new Date();
    }
    return this.save();
  } else {
    throw new Error(`Transición de estado inválida: ${this.estado} -> ${nuevoEstado}`);
  }
};

const Pedido = mongoose.model('Pedido', PedidoSchema);
module.exports = Pedido;
