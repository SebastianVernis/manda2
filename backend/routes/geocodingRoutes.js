const express = require('express');
const { searchAddresses, reverseGeocode } = require('../controllers/geocodingController');

const router = express.Router();

// @route   GET /api/geocoding/search
// @desc    Buscar direcciones con autocompletado
// @access  Public
router.get('/search', searchAddresses);

// @route   GET /api/geocoding/reverse
// @desc    Geocodificación inversa (coordenadas a dirección)
// @access  Public
router.get('/reverse', reverseGeocode);

module.exports = router;