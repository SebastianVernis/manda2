const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    error: 'Demasiadas solicitudes desde esta IP',
    success: false
  },
  standardHeaders: true,
  legacyHeaders: false
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    error: 'Demasiados intentos de autenticación',
    success: false
  }
});

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.mapbox.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
});

const inputSanitizer = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '');
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized = {};
      for (const key in value) {
        if (key.startsWith('$') || key.includes('.')) {
          continue;
        }
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
};

const secureJwtVerify = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'],
    maxAge: '24h'
  });
};

const secureJwtSign = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '24h',
    issuer: 'yega-app',
    audience: 'yega-users'
  });
};

module.exports = {
  generalLimiter,
  strictLimiter,
  helmetConfig,
  inputSanitizer,
  secureJwtVerify,
  secureJwtSign
};