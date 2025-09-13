// backend/utils/otp-bypass.js
/**
 * Script para verificar automáticamente un usuario cuando hay problemas con OTP
 * Uso: node utils/otp-bypass.js email@ejemplo.com
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Usuario = require('../models/Usuario');
const OTP = require('../models/OTP');

async function main() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('❌ Error: Debes proporcionar un email como argumento');
    console.log('Uso: node utils/otp-bypass.js email@ejemplo.com');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      console.error(`❌ Usuario con email ${email} no encontrado`);
      process.exit(1);
    }

    console.log('Información del usuario:');
    console.log(`- Nombre: ${usuario.nombre}`);
    console.log(`- Email: ${usuario.email}`);
    console.log(`- Teléfono: ${usuario.telefono}`);
    console.log(`- Rol: ${usuario.rol}`);
    console.log(`- Estado actual: ${usuario.estado_validacion}`);

    // Verificar si ya está aprobado
    if (usuario.estado_validacion === 'aprobado') {
      console.log('✅ Usuario ya está verificado. No se requieren cambios.');
    } else {
      // Actualizar estado de validación
      usuario.estado_validacion = 'aprobado';
      usuario.otp = undefined;
      usuario.otp_expires = undefined;
      await usuario.save();
      
      // Marcar cualquier OTP pendiente como verificado
      await OTP.updateMany(
        { 
          $or: [{ email: usuario.email }, { telefono: usuario.telefono }],
          verificado: false 
        },
        { verificado: true }
      );

      console.log('✅ ¡Usuario verificado exitosamente!');
      console.log(`El usuario ${usuario.nombre} ahora puede iniciar sesión normalmente.`);
    }

    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();