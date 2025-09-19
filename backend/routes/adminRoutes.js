// backend/routes/adminRoutes.js
const express = require('express');
const { getUsers, approveUser, rejectUser, getPendingDocuments, approveDocument, rejectDocument } = require('../controllers/adminController');
const router = express.Router();

// GET /api/admin/users -> lista usuarios con filtros
router.get('/users', getUsers);

// GET /api/admin/documents/pending -> obtener documentos pendientes
router.get('/documents/pending', getPendingDocuments);

module.exports = router;

// Mutaciones
router.post('/users/:id/approve', approveUser);
router.post('/users/:id/reject', rejectUser);
// Documentos
router.post('/users/:id/documents/:tipo/approve', approveDocument);
router.post('/users/:id/documents/:tipo/reject', rejectDocument);
