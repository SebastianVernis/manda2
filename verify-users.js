#!/usr/bin/env node

const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/manda2';

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

async function verifyUsers() {
  try {
    console.log(`${colors.blue}🔍 Verificando usuarios en la base de datos...${colors.reset}`);
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log(`${colors.green}✅ Conectado a MongoDB${colors.reset}\n`);

    // Get all users
    const users = await Usuario.find({}).sort({ rol: 1, nombre: 1 });
    
    console.log(`${colors.cyan}📊 TOTAL DE USUARIOS: ${users.length}${colors.reset}\n`);
    
    // Group by role
    const roleColors = {
      'administrador': colors.red,
      'cliente': colors.blue,
      'tienda': colors.yellow,
      'repartidor': colors.green
    };
    
    const usersByRole = {};
    users.forEach(user => {
      if (!usersByRole[user.rol]) {
        usersByRole[user.rol] = [];
      }
      usersByRole[user.rol].push(user);
    });
    
    // Display users by role
    Object.keys(usersByRole).forEach(rol => {
      const roleUsers = usersByRole[rol];
      const color = roleColors[rol] || colors.cyan;
      
      console.log(`${color}👥 ${rol.toUpperCase()} (${roleUsers.length} usuario${roleUsers.length !== 1 ? 's' : ''})${colors.reset}`);
      console.log('─'.repeat(50));
      
      roleUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${color}${user.nombre}${colors.reset}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   📱 Teléfono: ${user.telefono}`);
        console.log(`   ✅ Estado: ${user.estado_validacion}`);
        console.log(`   🟢 Activo: ${user.activo ? 'Sí' : 'No'}`);
        
        if (user.direccion) {
          console.log(`   📍 Dirección: ${user.direccion}`);
        }
        
        if (user.ubicacion) {
          console.log(`   🌍 Ubicación: ${user.ubicacion.latitud}, ${user.ubicacion.longitud}`);
        }
        
        if (user.vehiculo && user.rol === 'repartidor') {
          console.log(`   🚗 Vehículo: ${user.vehiculo.tipo} ${user.vehiculo.marca} ${user.vehiculo.modelo}`);
          if (user.vehiculo.placa) console.log(`   🏷️  Placa: ${user.vehiculo.placa}`);
        }
        
        if (user.horario_apertura && user.rol === 'tienda') {
          console.log(`   🕒 Horario: ${user.horario_apertura} - ${user.horario_cierre}`);
        }
        
        console.log(`   📅 Registrado: ${user.createdAt ? user.createdAt.toLocaleDateString('es-MX') : 'N/A'}`);
        console.log('');
      });
    });
    
    // Summary statistics
    console.log(`${colors.cyan}📈 ESTADÍSTICAS GENERALES:${colors.reset}`);
    console.log(`├── Usuarios activos: ${users.filter(u => u.activo).length}`);
    console.log(`├── Usuarios inactivos: ${users.filter(u => !u.activo).length}`);
    console.log(`├── Usuarios aprobados: ${users.filter(u => u.estado_validacion === 'aprobado').length}`);
    console.log(`├── Usuarios pendientes: ${users.filter(u => u.estado_validacion === 'pendiente').length}`);
    console.log(`└── Usuarios rechazados: ${users.filter(u => u.estado_validacion === 'rechazado').length}`);
    
    console.log(`\n${colors.green}✨ Verificación completada exitosamente!${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log(`${colors.blue}🔌 Conexión cerrada${colors.reset}`);
  }
}

// Run verification
if (require.main === module) {
  verifyUsers()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(`${colors.red}💥 Error ejecutando verificación: ${error.message}${colors.reset}`);
      process.exit(1);
    });
}

module.exports = { verifyUsers };