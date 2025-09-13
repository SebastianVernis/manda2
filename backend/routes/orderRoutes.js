// backend/routes/orderRoutes.js
const express = require('express');
const { 
  createOrder, 
  getUserOrders, 
  getOrderById,
  updateOrderStatus, 
  assignDelivery,
  rateOrder,
  getAvailableOrders,
  claimOrder
} = require('../controllers/orderController');
const { authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas para pedidos
router.post('/', authorize(['cliente']), createOrder);
router.get('/available', authorize(['repartidor']), getAvailableOrders);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);

// Pedidos disponibles para repartidores y tomar pedido
router.put('/:id/claim', authorize(['repartidor']), claimOrder);

// Actualización de estado
router.put('/:id/status', authorize(['tienda', 'repartidor', 'administrador']), updateOrderStatus);

// Asignación de repartidor
router.put('/:id/assign-delivery', authorize(['tienda', 'administrador']), assignDelivery);

// Calificación
router.put('/:id/rate', authorize(['cliente']), rateOrder);

module.exports = router;
