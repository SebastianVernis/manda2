// backend/routes/productRoutes.js
const express = require('express');
const { 
  getProducts, 
  getProductById,
  createProduct, 
  updateProduct, 
  deleteProduct,
  getCategories,
  updateStock
} = require('../controllers/productController');
const { authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas públicas
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Rutas protegidas
router.post('/', authorize(['tienda', 'administrador']), createProduct);
router.put('/:id', authorize(['tienda', 'administrador']), updateProduct);
router.delete('/:id', authorize(['tienda', 'administrador']), deleteProduct);
router.patch('/:id/stock', authorize(['tienda', 'administrador']), updateStock);

module.exports = router;
