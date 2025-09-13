// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Configurar transporter de nodemailer
let transporter = null;

const initializeTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true para 465, false para otros puertos
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Usar contraseña de aplicación para Gmail
      },
    });
  }
  return transporter;
};

/**
 * Envía un email usando nodemailer
 * @param {string} to - Email destino
 * @param {string} subject - Asunto del email
 * @param {string} text - Contenido en texto plano
 * @param {string} html - Contenido en HTML
 * @returns {Promise<Object>} Resultado del envío
 */
const sendEmail = async (to, subject, text, html = null) => {
  try {
    // Verificar configuración
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Configuración de email no encontrada');
    }

    const transporter = initializeTransporter();

    // Verificar conexión
    await transporter.verify();

    // Configurar email
    const mailOptions = {
      from: `"YEGA" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email enviado exitosamente a ${to}. ID: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
      to
    };

  } catch (error) {
    console.error(`❌ Error enviando email a ${to}:`, error.message);

    // En desarrollo, simular envío exitoso
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔧 Modo desarrollo: Simulando envío de email a ${to}`);
      console.log(`📧 Asunto: ${subject}`);
      console.log(`📝 Contenido: ${text}`);

      return {
        success: true,
        messageId: 'dev_' + Date.now(),
        to,
        simulated: true
      };
    }

    throw error;
  }
};

/**
 * Envía email de verificación OTP
 * @param {string} to - Email destino
 * @param {string} otp - Código OTP
 * @param {string} tipo - Tipo de verificación
 * @returns {Promise<Object>} Resultado del envío
 */
const sendOTPEmail = async (to, otp, tipo = 'verificacion') => {
  const tipoTextos = {
    registro: 'registro de cuenta',
    login: 'inicio de sesión',
    recuperacion: 'recuperación de contraseña',
    verificacion: 'verificación de cuenta'
  };

  const tipoTexto = tipoTextos[tipo] || 'verificación';

  const subject = `YEGA - Código de ${tipoTexto}`;
  
  const text = `
Tu código de ${tipoTexto} de YEGA es: ${otp}

Este código expira en 10 minutos.

Si no solicitaste este código, puedes ignorar este mensaje.

Equipo YEGA
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de Verificación YEGA</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #000;
      color: #D4AF37;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background-color: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      border: 1px solid #ddd;
    }
    .otp-code {
      background-color: #D4AF37;
      color: #000;
      font-size: 32px;
      font-weight: bold;
      text-align: center;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      letter-spacing: 8px;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 14px;
    }
    .warning {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      color: #856404;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>YEGA</h1>
    <p>Tu plataforma de delivery</p>
  </div>
  
  <div class="content">
    <h2>Código de ${tipoTexto}</h2>
    
    <p>Hola,</p>
    
    <p>Has solicitado un código de ${tipoTexto} para tu cuenta de YEGA. Usa el siguiente código:</p>
    
    <div class="otp-code">${otp}</div>
    
    <div class="warning">
      <strong>⚠️ Importante:</strong>
      <ul>
        <li>Este código expira en <strong>10 minutos</strong></li>
        <li>No compartas este código con nadie</li>
        <li>Si no solicitaste este código, ignora este mensaje</li>
      </ul>
    </div>
    
    <p>Si tienes problemas, contacta nuestro soporte.</p>
    
    <p>Saludos,<br>Equipo YEGA</p>
  </div>
  
  <div class="footer">
    <p>Este es un mensaje automático, por favor no respondas a este email.</p>
    <p>&copy; 2024 YEGA. Todos los derechos reservados.</p>
  </div>
</body>
</html>
`;

  return await sendEmail(to, subject, text, html);
};

/**
 * Envía email de bienvenida
 * @param {string} to - Email destino
 * @param {string} nombre - Nombre del usuario
 * @param {string} rol - Rol del usuario
 * @returns {Promise<Object>} Resultado del envío
 */
const sendWelcomeEmail = async (to, nombre, rol) => {
  const subject = 'Bienvenido a YEGA';
  
  const text = `
Hola ${nombre},

¡Bienvenido a YEGA!

Tu cuenta como ${rol} ha sido creada exitosamente. Ya puedes comenzar a usar nuestra plataforma.

Si tienes alguna pregunta, no dudes en contactarnos.

Saludos,
Equipo YEGA
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bienvenido a YEGA</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #000; color: #D4AF37; padding: 20px; text-align: center; }
    .content { padding: 30px; background-color: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>¡Bienvenido a YEGA!</h1>
    </div>
    <div class="content">
      <h2>Hola ${nombre},</h2>
      <p>Tu cuenta como <strong>${rol}</strong> ha sido creada exitosamente.</p>
      <p>Ya puedes comenzar a usar nuestra plataforma de delivery.</p>
      <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
      <p>Saludos,<br>Equipo YEGA</p>
    </div>
  </div>
</body>
</html>
`;

  return await sendEmail(to, subject, text, html);
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendWelcomeEmail
};
