// Crea/actualiza el administrador inicial en la base de producción.
// Uso: docker exec -e ADMIN_EMAIL=... -e ADMIN_PASS=... yega-api node /app/seed_admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/Usuario');

(async () => {
  const email = (process.env.ADMIN_EMAIL || 'admin@sebastianvernis.space').toLowerCase();
  const pass = process.env.ADMIN_PASS;
  if (!pass) { console.error('Falta ADMIN_PASS'); process.exit(1); }
  await mongoose.connect(process.env.MONGODB_URI);
  const hash = await bcrypt.hash(pass, 10);
  const u = await Usuario.findOneAndUpdate(
    { email },
    { email, nombre: 'Administrador YEGA', telefono: '5500000000', password: hash,
      rol: 'administrador', activo: true, estado_validacion: 'aprobado' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log('admin listo:', u.email, '| rol:', u.rol, '| estado:', u.estado_validacion);
  await mongoose.disconnect();
})();
