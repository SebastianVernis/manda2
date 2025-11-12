const nodemailer = require('./backend/node_modules/nodemailer');
require('dotenv').config({ path: './backend/.env' });

async function testEmail() {
  console.log('Configuración de email:');
  console.log('HOST:', process.env.EMAIL_HOST);
  console.log('PORT:', process.env.EMAIL_PORT);
  console.log('USER:', process.env.EMAIL_USER);
  console.log('PASS:', process.env.EMAIL_PASS ? '***configurada***' : 'NO CONFIGURADA');
  
  const port = parseInt(process.env.EMAIL_PORT) || 587;
  const isSecure = port === 465;
  
  console.log('Puerto parseado:', port);
  console.log('SSL habilitado:', isSecure);
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: port,
    secure: isSecure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    debug: true, // Activar logs detallados
    logger: true
  });

  try {
    console.log('\n🔍 Verificando conexión...');
    await transporter.verify();
    console.log('✅ Conexión SMTP exitosa');
    
    console.log('\n📧 Enviando email de prueba a sebastianvernis@gmail.com...');
    const info = await transporter.sendMail({
      from: `"Manda2 Test" <${process.env.EMAIL_USER}>`,
      to: 'sebastianvernis@gmail.com',
      subject: 'Prueba Manda2 - ' + new Date().toISOString(),
      text: 'Este es un email de prueba del sistema Manda2 enviado desde el servidor.',
      html: '<p>Este es un email de prueba del sistema <strong>Manda2</strong> enviado desde el servidor.</p><p>Si recibes este mensaje, la configuración de email funciona correctamente.</p>'
    });
    
    console.log('✅ Email enviado exitosamente!');
    console.log('Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Code:', error.code);
    console.error('Command:', error.command);
    console.error('Response:', error.response);
  }
}

testEmail();