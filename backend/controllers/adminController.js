// backend/controllers/adminController.js
const Usuario = require('../models/Usuario');

console.log('Usuario model loaded:', !!Usuario);

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

// @desc    Obtener documentos pendientes (solo admin)
// @route   GET /api/admin/documents/pending
// @access  Private (admin)
exports.getPendingDocuments = async (req, res) => {
  try {
    console.log('Iniciando búsqueda de documentos pendientes...');
    console.log('Usuario autenticado:', req.user);
    
    // Verificar el modelo de Usuario
    console.log('Modelo Usuario:', Usuario);
    console.log('Nombre del modelo:', Usuario.modelName);
    
    const usuarios = await Usuario.aggregate([
      {
        $match: {
          verificaciones: { $exists: true, $ne: {} }
        }
      },
      {
        $addFields: {
          documentosPendientes: {
            $filter: {
              input: {
                $objectToArray: "$verificaciones"
              },
              as: "doc",
              cond: {
                $eq: ["$$doc.v.status", "pendiente"]
              }
            }
          }
        }
      },
      {
        $match: {
          "documentosPendientes.0": { $exists: true } // Solo usuarios con documentos pendientes
        }
      },
      {
        $project: {
          password: 0 // Excluir contraseña
        }
      }
    ]);

    console.log('Usuarios encontrados en la agregación:', usuarios.length);
    console.log('Usuarios completos:', JSON.stringify(usuarios, null, 2));
    
    if (usuarios.length > 0) {
      console.log('Primer usuario encontrado:', JSON.stringify(usuarios[0], null, 2));
    } else {
      // Verificar todos los usuarios para entender qué está pasando
      try {
        const allUsers = await Usuario.find({});
        console.log('Total de usuarios en la base de datos:', allUsers.length);
        allUsers.forEach(user => {
          console.log('Usuario:', user.email, 'Verificaciones:', JSON.stringify(user.verificaciones, null, 2));
        });
      } catch (err) {
        console.error('Error obteniendo todos los usuarios:', err);
      }
    }

    // Formatear los datos para el frontend
    const usuariosConDocumentosPendientes = usuarios.map(usuario => {
      const documentosPendientes = (usuario.documentosPendientes || []).map(doc => ({
        tipo: doc.k,
        ...doc.v
      }));

      return {
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
        createdAt: usuario.createdAt,
        documentosPendientes
      };
    });

    console.log('Usuarios formateados:', usuariosConDocumentosPendientes.length);
    if (usuariosConDocumentosPendientes.length > 0) {
      console.log('Primer usuario formateado:', JSON.stringify(usuariosConDocumentosPendientes[0], null, 2));
    }

    res.json({
      success: true,
      usuarios: usuariosConDocumentosPendientes,
      total: usuariosConDocumentosPendientes.length
    });
  } catch (error) {
    console.error('Error obteniendo documentos pendientes:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

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
