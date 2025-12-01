// backend/routes/locationRoutes.js
const express = require('express');
const { 
  updateLocation, 
  getNearbyDelivery, 
  getNearbyStores 
} = require('../controllers/locationController');
const { authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Actualizar ubicación (solo repartidores y tiendas)
router.put('/update', authorize(['repartidor', 'tienda']), updateLocation);

// Obtener repartidores cercanos
router.get('/nearby-delivery', getNearbyDelivery);

// Obtener tiendas cercanas
router.get('/nearby-stores', getNearbyStores);

module.exports = router;
