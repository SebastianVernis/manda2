// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware para proteger rutas (verifica JWT)
exports.protect = async (req, res, next) => {
  console.log('\n[AUTH.PROTECT] Iniciando verificación de token...');
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('[AUTH.PROTECT] Token extraído:', token);

      console.log('[AUTH.PROTECT] Decodificando token con JWT_SECRET...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[AUTH.PROTECT] Token decodificado exitosamente:', decoded);

      console.log(`[AUTH.PROTECT] Buscando usuario en BD con ID: ${decoded.id}`);
      req.user = await Usuario.findById(decoded.id).select('-password');
      
      if (!req.user) {
        console.error('[AUTH.PROTECT] Error: Usuario no encontrado en la BD para el ID del token.');
        return res.status(401).json({ message: 'No autorizado, usuario del token no encontrado' });
      }
      console.log('[AUTH.PROTECT] Usuario encontrado:', { id: req.user._id, email: req.user.email, rol: req.user.rol });

      if (!req.user.activo) {
        console.error('[AUTH.PROTECT] Error: La cuenta del usuario no está activa.');
        return res.status(401).json({ message: 'Cuenta desactivada' });
      }
      console.log('[AUTH.PROTECT] Verificación completada. Pasando al siguiente middleware.');
      next();
    } catch (error) {
      console.error('[AUTH.PROTECT] ¡Error durante la verificación del token!:', error.name, error.message);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Token inválido o malformado' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token ha expirado' });
      }
      return res.status(401).json({ message: 'No autorizado, fallo en la verificación' });
    }
  } else {
      console.error("[AUTH.PROTECT] Error: No se encontró el header 'Authorization' o no empieza con 'Bearer'.");
      return res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

// Middleware para autorizar roles específicos
exports.authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado, usuario no autenticado' });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        message: `Acceso denegado. Rol requerido: ${roles.join(' o ')}`,
        rol_actual: req.user.rol
      });
    }

    next();
  };
};

// Middleware para verificar estado de validación
exports.requireValidation = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  if (req.user.rol !== 'cliente' && req.user.estado_validacion !== 'aprobado') {
    return res.status(403).json({ 
      message: 'Cuenta pendiente de validación',
      estado: req.user.estado_validacion
    });
  }

  next();
};
