// backend/routes/otpRoutes.js
const express = require('express');
const {
  enviarOTP,
  verificarOTP,
  reenviarOTP,
  obtenerEstadisticas,
  limpiarCodigos
} = require('../controllers/otpController');
const { protect, authorize } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting para OTP
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos por IP
  message: {
    message: 'Demasiados intentos de OTP. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 verificaciones por IP
  message: {
    message: 'Demasiados intentos de verificación. Intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rutas públicas con rate limiting
router.post('/send', otpLimiter, enviarOTP);
router.post('/verify', verifyLimiter, verificarOTP);
router.post('/resend', otpLimiter, reenviarOTP);

// Rutas protegidas (solo admin)
router.get('/stats', protect, authorize(['administrador']), obtenerEstadisticas);
router.delete('/cleanup', protect, authorize(['administrador']), limpiarCodigos);

module.exports = router;
