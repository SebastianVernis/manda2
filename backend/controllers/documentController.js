
const Usuario = require('../models/Usuario')

const ALLOWED_BY_ROLE = {
  cliente: [],
  tienda: ['id_doc', 'comprobante_domicilio'],
  repartidor: ['id_doc', 'licencia', 'tarjeta_circulacion', 'poliza_seguro'],
  administrador: [],
}

exports.uploadDocument = async (req, res) => {
  try {
    const userId = req.user.id
    const userRol = req.user.rol
    const tipo = req.params.tipo

    const allowed = ALLOWED_BY_ROLE[userRol] || []
    if (!allowed.includes(tipo)) {
      return res.status(400).json({ message: 'Tipo de documento no permitido para tu rol' })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Archivo requerido' })
    }

    const usuario = await Usuario.findById(userId)
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' })

    // Guardar ruta relativa para servir vía /uploads
    const relative = `/uploads/${req.file.filename}`

    if (!usuario.verificaciones) usuario.verificaciones = {}
    usuario.verificaciones[tipo] = {
      file: relative,
      status: 'pendiente',
      uploadedAt: new Date(),
      notes: ''
    }

    await usuario.save()

    res.json({ success: true, message: 'Documento subido', verificaciones: usuario.verificaciones })
  } catch (error) {
    console.error('Error subiendo documento:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

