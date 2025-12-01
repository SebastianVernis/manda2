const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    const safe = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_')
    const name = `${Date.now()}_${Math.random().toString(36).slice(2,8)}_${safe}`
    cb(null, name)
  }
})

const fileFilter = (req, file, cb) => {
  // Aceptar imágenes y PDFs
  const allowed = ['image/jpeg','image/png','image/webp','application/pdf']
  if (allowed.includes(file.mimetype)) return cb(null, true)
  cb(new Error('Tipo de archivo no permitido'))
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
})

module.exports = { upload }

