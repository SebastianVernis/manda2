const express = require('express')
const { upload } = require('../middleware/uploadMiddleware')
const { uploadDocument } = require('../controllers/documentController')
const router = express.Router()

// POST /api/documents/:tipo
router.post('/:tipo', upload.single('file'), uploadDocument)

module.exports = router

