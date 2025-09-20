#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yega';

// Import User model
const Usuario = require('./models/Usuario');

// Demo users to inject
const demoUsers = [
  {
    nombre: 'Administrador Principal',
    telefono: '+52-555-0001',
    email: 'admin@yega.com.mx',
    password: 'YegaAdmin2024!',
    rol: 'administrador',
    estado_validacion: 'aprobado',
    activo: true,
    fecha_registro: new Date()
  },
  {
    nombre: 'María García',
    telefono: '+52-555-1001',
    email: 'maria.garcia@cliente.com',
    password: 'Cliente123!',
    rol: 'cliente',
    estado_validacion: 'aprobado',
    activo: true,
    direccion: 'Av. Reforma 123, CDMX',
    fecha_registro: new Date()
  },
  {
    nombre: 'Carlos Rodríguez',
    telefono: '+52-555-1002',
    email: 'carlos.rodriguez@cliente.com',
    password: 'Cliente123!',
    rol: 'cliente',
    estado_validacion: 'aprobado',
    activo: true,
    direccion: 'Calle Juárez 456, Guadalajara',
    fecha_registro: new Date()
  },
  {
    nombre: 'Ana López',
    telefono: '+52-555-1003',
    email: 'ana.lopez@cliente.com',
    password: 'Cliente123!',
    rol: 'cliente',
    estado_validacion: 'aprobado',
    activo: true,
    direccion: 'Av. Universidad 789, Monterrey',
    fecha_registro: new Date()
  },
  {
    nombre: 'SuperMercado El Sol',
    telefono: '+52-555-2001',
    email: 'contacto@supermercadoelsol.com',
    password: 'Tienda123!',
    rol: 'tienda',
    estado_validacion: 'aprobado',
    activo: true,
    direccion: 'Av. Central 100, CDMX',
    ubicacion: {
      latitud: 19.4326,
      longitud: -99.1332,
      direccion: 'Av. Central 100, Col. Centro, CDMX',
      timestamp: new Date()
    },
    horario_apertura: '08:00',
    horario_cierre: '22:00',
    descripcion: 'Supermercado con productos frescos y de calidad',
    categoria_tienda: 'supermercado',
    fecha_registro: new Date()
  },
  {
    nombre: 'Farmacia San José',
    telefono: '+52-555-2002',
    email: 'info@farmaciasanjose.com',
    password: 'Tienda123!',
    rol: 'tienda',
    estado_validacion: 'aprobado',
    activo: true,
    direccion: 'Calle Morelos 250, Guadalajara',
    ubicacion: {
      latitud: 20.6597,
      longitud: -103.3496,
      direccion: 'Calle Morelos 250, Col. Centro, Guadalajara',
      timestamp: new Date()
    },
    horario_apertura: '07:00',
    horario_cierre: '23:00',
    descripcion: 'Farmacia con servicio 24/7 y medicamentos especializados',
    categoria_tienda: 'farmacia',
    fecha_registro: new Date()
  },
  {
    nombre: 'Restaurante La Cocina',
    telefono: '+52-555-2003',
    email: 'pedidos@restaurantelacocina.com',
    password: 'Tienda123!',
    rol: 'tienda',
    estado_validacion: 'aprobado',
    activo: true,
    direccion: 'Av. Constitución 75, Monterrey',
    ubicacion: {
      latitud: 25.6866,
      longitud: -100.3161,
      direccion: 'Av. Constitución 75, Col. Centro, Monterrey',
      timestamp: new Date()
    },
    horario_apertura: '11:00',
    horario_cierre: '23:00',
    descripcion: 'Comida mexicana tradicional con servicio a domicilio',
    categoria_tienda: 'restaurante',
    fecha_registro: new Date()
  },
  {
    nombre: 'Diego Martínez',
    telefono: '+52-555-3001',
    email: 'diego.martinez@repartidor.com',
    password: 'Repartidor123!',
    rol: 'repartidor',
    estado_validacion: 'aprobado',
    activo: true,
    direccion: 'Col. Roma Norte, CDMX',
    ubicacion: {
      latitud: 19.4146,
      longitud: -99.1623,
      direccion: 'Col. Roma Norte, CDMX',
      timestamp: new Date()
    },
    vehiculo: {
      tipo: 'moto',
      marca: 'Honda',
      modelo: 'Wave',
      placa: 'ABC-123',
      color: 'rojo'
    },
    documentos: {
      licencia_verificada: true,
      identificacion_verificada: true,
      antecedentes_verificados: true
    },
    disponible: true,
    calificacion_promedio: 4.8,
    entregas_completadas: 245,
    fecha_registro: new Date()
  },
  {
    nombre: 'Sofía Hernández',
    telefono: '+52-555-3002',
    email: 'sofia.hernandez@repartidor.com',
    password: 'Repartidor123!',
    rol: 'repartidor',
    estado_validacion: 'aprobado',
    activo: true,
    direccion: 'Col. Providencia, Guadalajara',
    ubicacion: {
      latitud: 20.6736,
      longitud: -103.3738,
      direccion: 'Col. Providencia, Guadalajara',
      timestamp: new Date()
    },
    vehiculo: {
      tipo: 'bicicleta',
      marca: 'Trek',
      modelo: 'FX 3',
      color: 'azul'
    },
    documentos: {
      licencia_verificada: true,
      identificacion_verificada: true,
      antecedentes_verificados: true
    },
    disponible: true,
    calificacion_promedio: 4.9,
    entregas_completadas: 189,
    fecha_registro: new Date()
  },
  {
    nombre: 'Roberto Silva',
    telefono: '+52-555-3003',
    email: 'roberto.silva@repartidor.com',
    password: 'Repartidor123!',
    rol: 'repartidor',
    estado_validacion: 'aprobado',
    activo: true,
    direccion: 'Col. San Pedro, Monterrey',
    ubicacion: {
      latitud: 25.6515,
      longitud: -100.2895,
      direccion: 'Col. San Pedro, Monterrey',
      timestamp: new Date()
    },
    vehiculo: {
      tipo: 'auto',
      marca: 'Nissan',
      modelo: 'Versa',
      placa: 'XYZ-789',
      color: 'blanco'
    },
    documentos: {
      licencia_verificada: true,
      identificacion_verificada: true,
      antecedentes_verificados: true
    },
    disponible: true,
    calificacion_promedio: 4.7,
    entregas_completadas: 312,
    fecha_registro: new Date()
  }
];

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Hash password function
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Main function to reset and inject users
async function resetAndInjectUsers() {
  try {
    console.log(`${colors.blue}🔄 Conectando a MongoDB...${colors.reset}`);
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log(`${colors.green}✅ Conectado a MongoDB${colors.reset}`);

    // Step 1: Remove all existing users
    console.log(`${colors.yellow}🗑️  Eliminando todos los usuarios existentes...${colors.reset}`);
    const deleteResult = await Usuario.deleteMany({});
    console.log(`${colors.green}✅ ${deleteResult.deletedCount} usuarios eliminados${colors.reset}`);

    // Step 2: Inject new demo users
    console.log(`${colors.blue}👥 Inyectando nuevos usuarios de demostración...${colors.reset}`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const userData of demoUsers) {
      try {
        // Hash the password
        userData.password = await hashPassword(userData.password);
        
        // Create user
        const newUser = new Usuario(userData);
        await newUser.save();
        
        console.log(`${colors.green}✅ Usuario creado: ${userData.nombre} (${userData.rol})${colors.reset}`);
        successCount++;
      } catch (error) {
        console.log(`${colors.red}❌ Error creando usuario ${userData.nombre}: ${error.message}${colors.reset}`);
        errorCount++;
      }
    }

    // Summary
    console.log(`\n${colors.blue}📊 RESUMEN:${colors.reset}`);
    console.log(`${colors.green}✅ Usuarios creados exitosamente: ${successCount}${colors.reset}`);
    console.log(`${colors.red}❌ Errores: ${errorCount}${colors.reset}`);

    // Display created users by role
    const usersByRole = await Usuario.aggregate([
      { $group: { _id: "$rol", count: { $sum: 1 }, usuarios: { $push: "$email" } } }
    ]);

    console.log(`\n${colors.blue}👥 USUARIOS POR ROL:${colors.reset}`);
    usersByRole.forEach(role => {
      console.log(`${colors.yellow}📋 ${role._id.toUpperCase()}: ${role.count} usuario(s)${colors.reset}`);
      role.usuarios.forEach(email => {
        console.log(`   📧 ${email}`);
      });
    });

    console.log(`\n${colors.green}🎉 Proceso completado exitosamente!${colors.reset}`);
    console.log(`\n${colors.blue}🔐 CREDENCIALES DE ACCESO:${colors.reset}`);
    console.log(`${colors.yellow}Administrador:${colors.reset} admin@yega.com.mx / YegaAdmin2024!`);
    console.log(`${colors.yellow}Clientes:${colors.reset} Cliente123! (para todos los clientes)`);
    console.log(`${colors.yellow}Tiendas:${colors.reset} Tienda123! (para todas las tiendas)`);
    console.log(`${colors.yellow}Repartidores:${colors.reset} Repartidor123! (para todos los repartidores)`);

  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log(`${colors.blue}🔌 Conexión cerrada${colors.reset}`);
  }
}

// Run the script
if (require.main === module) {
  resetAndInjectUsers()
    .then(() => {
      console.log(`${colors.green}✨ Script ejecutado correctamente${colors.reset}`);
      process.exit(0);
    })
    .catch((error) => {
      console.error(`${colors.red}💥 Error ejecutando script: ${error.message}${colors.reset}`);
      process.exit(1);
    });
}

module.exports = { resetAndInjectUsers, demoUsers };