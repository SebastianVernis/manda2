const bcrypt = require('bcryptjs');

// Function to hash a password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Demo passwords
const demoPassword = 'Demo123!';

// Demo users data
const demoUsers = [
  {
    nombre: 'Admin Demo',
    telefono: '+1111111111',
    email: 'admin@yega.com',
    rol: 'administrador',
    estado_validacion: 'aprobado',
    activo: true
  },
  {
    nombre: 'Cliente Demo',
    telefono: '+2222222222',
    email: 'cliente@yega.com',
    rol: 'cliente',
    estado_validacion: 'aprobado',
    activo: true
  },
  {
    nombre: 'Tienda Demo',
    telefono: '+3333333333',
    email: 'tienda@yega.com',
    rol: 'tienda',
    estado_validacion: 'aprobado',
    activo: true
  },
  {
    nombre: 'Repartidor Demo',
    telefono: '+4444444444',
    email: 'repartidor@yega.com',
    rol: 'repartidor',
    estado_validacion: 'aprobado',
    activo: true
  }
];

// Hash passwords and create users
async function createDemoUsers() {
  for (const user of demoUsers) {
    const hashedPassword = await hashPassword(demoPassword);
    console.log(`db.usuarios.insertOne({`);
    console.log(`  "nombre": "${user.nombre}",`);
    console.log(`  "telefono": "${user.telefono}",`);
    console.log(`  "email": "${user.email}",`);
    console.log(`  "password": "${hashedPassword}",`);
    console.log(`  "rol": "${user.rol}",`);
    console.log(`  "estado_validacion": "${user.estado_validacion}",`);
    console.log(`  "activo": ${user.activo}`);
    console.log(`})`);
    console.log('');
  }
}

createDemoUsers();