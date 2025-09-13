// backend/utils/generateOTP.js

/**
 * Genera un código OTP de 6 dígitos
 * @returns {string} Código OTP de 6 dígitos
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Genera un código OTP personalizable
 * @param {number} length - Longitud del código (por defecto 6)
 * @param {boolean} alphanumeric - Si incluir letras (por defecto false)
 * @returns {string} Código OTP generado
 */
const generateCustomOTP = (length = 6, alphanumeric = false) => {
  const numbers = '0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const chars = alphanumeric ? numbers + letters : numbers;
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Valida formato de OTP
 * @param {string} otp - Código OTP a validar
 * @param {number} expectedLength - Longitud esperada
 * @returns {boolean} True si es válido
 */
const validateOTPFormat = (otp, expectedLength = 6) => {
  if (!otp || typeof otp !== 'string') return false;
  if (otp.length !== expectedLength) return false;
  return /^\d+$/.test(otp); // Solo números
};

module.exports = {
  generateOTP,
  generateCustomOTP,
  validateOTPFormat
};
