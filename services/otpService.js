// backend/services/otpService.js
const OTP = require('../models/OTP');
const { generateOTP } = require('../utils/generateOTP');
const { sendOTPEmail } = require('../utils/sendEmail');
const devNotification = require('../utils/devNotification');

class OTPService {
  /**
   * Genera y envía un código OTP
   * @param {Object} options - Opciones para generar OTP
   * @param {string} options.telefono - Número de teléfono (ya no se usa para SMS)
   * @param {string} options.email - Email del usuario
   * @param {string} options.tipo - Tipo de OTP (registro, login, etc.)
   * @param {string} options.metodo - Método de envío (solo 'email' ahora)
   * @param {Object} options.metadata - Metadata adicional
   * @param {string} options.ip - IP del cliente
   * @param {string} options.userAgent - User agent del cliente
   * @returns {Promise<Object>} Resultado del envío
   */
  static async generarYEnviar({
    telefono, // Mantener para compatibilidad, pero no se usará para SMS
    email,
    tipo = 'verificacion',
    metodo = 'email', // Forzar a 'email'
    metadata = {},
    ip = null,
    userAgent = null
  }) {
    try {
      // Verificar límite de envíos (usando email en lugar de telefono para el límite)
      const puedeEnviar = await OTP.verificarLimiteEnvios(email, tipo); // Cambiado a email
      if (!puedeEnviar) {
        throw new Error('Límite de envíos por hora alcanzado. Intenta más tarde.');
      }

      // Verificar si hay un OTP reciente (menos de 1 minuto) para evitar duplicados
      const unMinutoAtras = new Date(Date.now() - 60 * 1000);
      const otpReciente = await OTP.findOne({
        email,
        tipo,
        verificado: false,
        createdAt: { $gte: unMinutoAtras }
      });

      if (otpReciente) {
        console.log(`⚠️  OTP reciente encontrado para ${email}, reutilizando código existente`);
        // Reenviar el código existente en lugar de generar uno nuevo
        try {
          const resultadoEmail = await sendOTPEmail(email, otpReciente.codigo, tipo);
          return {
            success: true,
            mensaje: 'Código OTP reenviado exitosamente',
            id: otpReciente._id,
            expira_en: otpReciente.expira_en,
            tiempo_restante: otpReciente.tiempo_restante,
            metodos_enviados: resultadoEmail.success ? ['email'] : [],
            resultados: { email: resultadoEmail },
            ...(process.env.NODE_ENV !== 'production' && { dev_code: otpReciente.codigo })
          };
        } catch (error) {
          console.error('Error reenviando email:', error);
          // Si falla el reenvío, continuar con generar nuevo código
        }
      }

      // Invalidar códigos anteriores del mismo tipo
      await OTP.updateMany(
        { email, tipo, verificado: false }, // Cambiado a email
        { verificado: true }
      );

      // Generar nuevo código
      const codigo = generateOTP();
      
      // Crear registro en base de datos
      const otpRecord = new OTP({
        telefono, // Mantener para el registro, pero no para el envío
        email,
        codigo,
        tipo,
        ip_origen: ip,
        user_agent: userAgent,
        metadata
      });

      await otpRecord.save();

      // Enviar según el método especificado
      const resultados = {};
      let algunMetodoExitoso = false;

      // Intentar Email (siempre, ya que es el único método)
      if (metodo === 'email') {
        try {
          const resultadoEmail = await sendOTPEmail(email, codigo, tipo);
          resultados.email = resultadoEmail;
          if (resultadoEmail.success) algunMetodoExitoso = true;
        } catch (error) {
          console.error('Error enviando email:', error);
          resultados.email = { success: false, error: error.message };
        }
      }

      // Fallback para desarrollo y testing (solo si no se envió por email)
      if (!algunMetodoExitoso) {
        // En desarrollo, mostrar el código en los logs y como notificación
        devNotification.show(`[DEV MODE] Código OTP para ${email}: ${codigo}`, 'info'); // Cambiado a email
        console.log('\n==================================');
        console.log(`🔐 Código OTP: ${codigo}`);
        console.log(`📧 Email: ${email}`);
        console.log('==================================\n');
        
        // Marcar como exitoso para desarrollo
        algunMetodoExitoso = true;
        resultados.dev = { 
          success: true, 
          message: 'Código mostrado en logs (modo desarrollo)' 
        };
      }

      return {
        success: true,
        mensaje: 'Código OTP enviado exitosamente',
        id: otpRecord._id,
        expira_en: otpRecord.expira_en,
        tiempo_restante: otpRecord.tiempo_restante,
        metodos_enviados: Object.keys(resultados).filter(k => resultados[k].success),
        resultados,
        // En desarrollo, incluir el código en la respuesta
        ...(process.env.NODE_ENV !== 'production' && { dev_code: codigo })
      };

    } catch (error) {
      console.error('Error en generarYEnviar:', error);
      throw error;
    }
  }

  /**
   * Verifica un código OTP.
   * @param {Object} options - Opciones para verificar OTP
   * @param {string} options.email - Email del usuario
   * @param {string} options.otp - Código OTP a verificar
   * @param {string} options.tipo - Tipo de OTP (registro, login, etc.)
   * @returns {Promise<Object>} Resultado de la verificación
   */
  static async verificarOTP({ email, otp, tipo = 'verificacion' }) {
    try {
      const otpRecord = await OTP.findOne({
        email,
        codigo: otp,
        tipo,
        verificado: false,
        expira_en: { $gt: new Date() } // Que no haya expirado
      });

      if (!otpRecord) {
        return { success: false, message: 'Código OTP inválido o expirado.' };
      }

      // Marcar OTP como verificado
      otpRecord.verificado = true;
      await otpRecord.save();

      return { success: true, message: 'OTP verificado exitosamente.' };

    } catch (error) {
      console.error('Error en verificarOTP:', error);
      throw error;
    }
  }
}

module.exports = OTPService;