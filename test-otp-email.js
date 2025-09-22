const { sendOTPEmail } = require('./backend/utils/sendEmail');
require('dotenv').config({ path: './backend/.env' });

async function testOTP() {
  console.log('🔐 Enviando OTP de prueba a sebastianvernis@gmail.com...');
  
  try {
    const resultado = await sendOTPEmail('sebastianvernis@gmail.com', '123456', 'registro');
    console.log('✅ OTP enviado exitosamente:', resultado);
  } catch (error) {
    console.error('❌ Error enviando OTP:', error.message);
  }
}

testOTP();