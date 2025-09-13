// backend/models/OTP.js
const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  telefono: {
    type: String,
    // No longer required as SMS is removed
    // match: [/^\+?[1-9]\d{1,14}$/, 'Formato de teléfono inválido']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido']
  },
  codigo: {
    type: String,
    required: [true, 'El código OTP es requerido'],
    match: [/^\d{6}$/, 'El código debe tener 6 dígitos']
  },
  tipo: {
    type: String,
    enum: ['registro', 'login', 'recuperacion', 'verificacion'],
    required: [true, 'El tipo de OTP es requerido']
  },
  intentos: {
    type: Number,
    default: 0,
    max: [5, 'Máximo 5 intentos permitidos']
  },
  verificado: {
    type: Boolean,
    default: false
  },
  expira_en: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutos
  },
  ip_origen: {
    type: String
  },
  user_agent: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimizar consultas
// OTPSchema.index({ telefono: 1, tipo: 1 }); // Removed as telefono is not primary for OTP
OTPSchema.index({ email: 1, tipo: 1 });
OTPSchema.index({ expira_en: 1 }, { expireAfterSeconds: 0 }); // Auto-eliminar documentos expirados
OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // Eliminar después de 1 hora

// Virtual para verificar si está expirado
OTPSchema.virtual('expirado').get(function() {
  return new Date() > this.expira_en;
});

// Virtual para tiempo restante en segundos
OTPSchema.virtual('tiempo_restante').get(function() {
  const ahora = new Date();
  const diferencia = this.expira_en - ahora;
  return Math.max(0, Math.floor(diferencia / 1000));
});

// Método para verificar código
OTPSchema.methods.verificarCodigo = function(codigoIngresado) {
  if (this.expirado) {
    throw new Error('El código OTP ha expirado');
  }
  
  if (this.verificado) {
    throw new Error('El código OTP ya ha sido utilizado');
  }
  
  if (this.intentos >= 5) {
    throw new Error('Máximo número de intentos alcanzado');
  }
  
  this.intentos += 1;
  
  if (this.codigo === codigoIngresado) {
    this.verificado = true;
    return true;
  }
  
  return false;
};

// Método estático para limpiar códigos expirados
OTPSchema.statics.limpiarExpirados = function() {
  return this.deleteMany({
    $or: [
      { expira_en: { $lt: new Date() } },
      { verificado: true },
      { intentos: { $gte: 5 } }
    ]
  });
};

// Método estático para verificar límite de envíos
OTPSchema.statics.verificarLimiteEnvios = async function(email, tipo, limitePorHora = 5) { // Cambiado a email
  const unaHoraAtras = new Date(Date.now() - 60 * 60 * 1000);
  const count = await this.countDocuments({
    email, // Cambiado a email
    tipo,
    createdAt: { $gte: unaHoraAtras }
  });
  
  return count < limitePorHora;
};

const OTP = mongoose.model('OTP', OTPSchema);
module.exports = OTP;
