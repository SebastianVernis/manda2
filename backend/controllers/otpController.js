// backend/controllers/otpController.js
const OTPService = require('../services/otpService');
const Usuario = require('../models/Usuario');

// @desc    Enviar código OTP
// @route   POST /api/otp/send
// @access  Public
exports.enviarOTP = async (req, res) => {
  try {
    const { 
      telefono, 
      email, 
      tipo = 'verificacion', 
      metodo = 'sms' 
    } = req.body;

    // Validaciones básicas
    if (!telefono || !email) {
      return res.status(400).json({
        message: 'Teléfono y email son requeridos'
      });
    }

    // Obtener IP y User Agent
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Generar y enviar OTP
    const resultado = await OTPService.generarYEnviar({
      telefono,
      email,
      tipo,
      metodo,
      ip,
      userAgent
    });

    res.json({
      success: true,
      ...resultado
    });

  } catch (error) {
    console.error('Error enviando OTP:', error);
    res.status(400).json({
      message: error.message || 'Error enviando código OTP'
    });
  }
};

// @desc    Verificar código OTP
// @route   POST /api/otp/verify
// @access  Public
exports.verificarOTP = async (req, res) => {
  try {
    const { telefono, codigo, tipo = 'verificacion' } = req.body;

    // Validaciones básicas
    if (!telefono || !codigo) {
      return res.status(400).json({
        message: 'Teléfono y código son requeridos'
      });
    }

    // Verificar código
    const resultado = await OTPService.verificar({
      telefono,
      codigo,
      tipo
    });

    // Si es verificación de registro, actualizar usuario
    if (tipo === 'registro' && resultado.success) {
      await Usuario.updateOne(
        { telefono },
        { 
          estado_validacion: 'aprobado',
          $unset: { otp: 1, otp_expires: 1 }
        }
      );
    }

    res.json({
      success: true,
      ...resultado
    });

  } catch (error) {
    console.error('Error verificando OTP:', error);
    res.status(400).json({
      message: error.message || 'Error verificando código OTP'
    });
  }
};

// @desc    Reenviar código OTP
// @route   POST /api/otp/resend
// @access  Public
exports.reenviarOTP = async (req, res) => {
  try {
    const { 
      telefono, 
      email, 
      tipo = 'verificacion', 
      metodo = 'sms' 
    } = req.body;

    // Validaciones básicas
    if (!telefono || !email) {
      return res.status(400).json({
        message: 'Teléfono y email son requeridos'
      });
    }

    // Obtener IP y User Agent
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Reenviar OTP
    const resultado = await OTPService.reenviar({
      telefono,
      email,
      tipo,
      metodo,
      ip,
      userAgent
    });

    res.json({
      success: true,
      ...resultado
    });

  } catch (error) {
    console.error('Error reenviando OTP:', error);
    res.status(400).json({
      message: error.message || 'Error reenviando código OTP'
    });
  }
};

// @desc    Obtener estadísticas de OTP (solo admin)
// @route   GET /api/otp/stats
// @access  Private (admin)
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const { desde, hasta, tipo } = req.query;
    
    // Construir filtros
    const filtros = {};
    
    if (desde || hasta) {
      filtros.createdAt = {};
      if (desde) filtros.createdAt.$gte = new Date(desde);
      if (hasta) filtros.createdAt.$lte = new Date(hasta);
    }
    
    if (tipo) {
      filtros.tipo = tipo;
    }

    const estadisticas = await OTPService.obtenerEstadisticas(filtros);

    res.json({
      success: true,
      estadisticas
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Limpiar códigos expirados (solo admin)
// @route   DELETE /api/otp/cleanup
// @access  Private (admin)
exports.limpiarCodigos = async (req, res) => {
  try {
    const resultado = await OTPService.limpiarCodigos();

    res.json({
      success: true,
      ...resultado
    });

  } catch (error) {
    console.error('Error limpiando códigos:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};
