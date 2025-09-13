// backend/controllers/adminController.js
const Usuario = require('../models/Usuario');

// @desc    Listar usuarios con filtros y paginación (solo admin)
// @route   GET /api/admin/users
// @access  Private (admin)
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      rol,
      estado,
      buscar,
      activo,
      sort = '-createdAt',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filtro = {};
    if (rol) filtro.rol = rol;
    if (estado) filtro.estado_validacion = estado;
    if (activo !== undefined) filtro.activo = activo === 'true';
    if (buscar) {
      const regex = new RegExp(buscar, 'i');
      filtro.$or = [
        { nombre: regex },
        { email: regex },
        { telefono: regex },
      ];
    }

    const query = Usuario.find(filtro).select('-password');
    const total = await Usuario.countDocuments(filtro);
    const usuarios = await query
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sort);

    res.json({
      success: true,
      usuarios,
      paginacion: {
        pagina_actual: parseInt(page),
        total_paginas: Math.ceil(total / parseInt(limit)),
        total_usuarios: total,
        usuarios_por_pagina: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Error listando usuarios:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Aprobar usuario (solo admin)
// @route   POST /api/admin/users/:id/approve
// @access  Private (admin)
exports.approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    usuario.estado_validacion = 'aprobado';
    usuario.activo = true;
    await usuario.save();

    res.json({ success: true, message: 'Usuario aprobado', usuario: usuario.toObject({ getters: true }) });
  } catch (error) {
    console.error('Error aprobando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// @desc    Rechazar usuario (solo admin)
// @route   POST /api/admin/users/:id/reject
// @access  Private (admin)
exports.rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body || {};
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    usuario.estado_validacion = 'rechazado';
    if (typeof req.body?.desactivar !== 'undefined') {
      usuario.activo = !req.body.desactivar ? usuario.activo : false;
    }
    await usuario.save();

    res.json({ success: true, message: 'Usuario rechazado', motivo: motivo || null, usuario: usuario.toObject({ getters: true }) });
  } catch (error) {
    console.error('Error rechazando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// --- Documentos: aprobar/rechazar por admin ---
const VALID_DOC_TYPES = ['id_doc','comprobante_domicilio','licencia','tarjeta_circulacion','poliza_seguro']

exports.approveDocument = async (req, res) => {
  try {
    const { id, tipo } = req.params
    if (!VALID_DOC_TYPES.includes(tipo)) return res.status(400).json({ message: 'Tipo de documento inválido' })
    const usuario = await Usuario.findById(id)
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' })
    if (!usuario.verificaciones || !usuario.verificaciones[tipo]) return res.status(400).json({ message: 'Documento no cargado' })
    usuario.verificaciones[tipo].status = 'aprobado'
    usuario.verificaciones[tipo].notes = req.body?.notes || ''
    await usuario.save()
    res.json({ success: true, message: 'Documento aprobado', verificaciones: usuario.verificaciones })
  } catch (error) {
    console.error('Error aprobando documento:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}

exports.rejectDocument = async (req, res) => {
  try {
    const { id, tipo } = req.params
    const { notes } = req.body || {}
    if (!VALID_DOC_TYPES.includes(tipo)) return res.status(400).json({ message: 'Tipo de documento inválido' })
    const usuario = await Usuario.findById(id)
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' })
    if (!usuario.verificaciones || !usuario.verificaciones[tipo]) return res.status(400).json({ message: 'Documento no cargado' })
    usuario.verificaciones[tipo].status = 'rechazado'
    usuario.verificaciones[tipo].notes = notes || ''
    await usuario.save()
    res.json({ success: true, message: 'Documento rechazado', verificaciones: usuario.verificaciones })
  } catch (error) {
    console.error('Error rechazando documento:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
}
