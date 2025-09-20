const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { helmetConfig, generalLimiter, inputSanitizer } = require('./middleware/securityMiddleware');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Confiar en el primer proxy
app.set('trust proxy', 1);

// Enhanced Security middleware
app.use(helmetConfig);
app.use(inputSanitizer);

// CORS
const frontendUrl = process.env.FRONTEND_URL || 'https://yega.com.mx';
const allowedOrigins = frontendUrl === '*' ? '*' : frontendUrl.split(',').map(origin => origin.trim());

// Enhanced Rate limiting
app.use('/api', generalLimiter);

// Body parser
app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado exitosamente'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const otpRoutes = require('./routes/otpRoutes');
const locationRoutes = require('./routes/locationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const documentRoutes = require('./routes/documentRoutes');
const storeRoutes = require('./routes/storeRoutes');
const geocodingRoutes = require('./routes/geocodingRoutes');

// Middleware de autenticación
const { protect, authorize } = require('./middleware/authMiddleware');

// Rutas públicas
console.log('Montando rutas de autenticación en /api/auth');
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);

// Uncomment the real stores route when ready
app.use('/api/stores', storeRoutes);

// Geocoding routes
app.use('/api/geocoding', geocodingRoutes);

// No hay productos en caché - se obtienen directamente de la base de datos

// Uncomment the real product routes when ready
app.use('/api/products', protect, productRoutes);

// Rutas protegidas para la API real (solo usar cuando la BD esté disponible)
// Descomentar las siguientes líneas cuando quieras usar la API real

// app.use('/api/products', protect, productRoutes);
app.use('/api/orders', protect, orderRoutes);
app.use('/api/location', protect, locationRoutes);
app.use('/api/documents', protect, documentRoutes);
app.use('/api/admin', protect, authorize(['administrador']), adminRoutes);

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint para placeholder de imágenes
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  const color = req.query.bg || 'cccccc';
  const textColor = req.query.color || '666666';
  
  // SVG simple como placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="#${color}"/>
    <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#${textColor}" font-family="Arial, sans-serif" font-size="14">${width}x${height}</text>
  </svg>`;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(svg);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: dbStatus,
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API de YEGA funcionando!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// En producción, servir el frontend
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Ruta no encontrada para API
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
}

module.exports = app;
