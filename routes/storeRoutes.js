// backend/routes/storeRoutes.js
const express = require('express');
const { getStores, getStoreById } = require('../controllers/storeController');

const router = express.Router();

// Rutas públicas para tiendas
router.get('/', getStores);
router.get('/:id', getStoreById);

module.exports = router;