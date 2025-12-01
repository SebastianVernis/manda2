// frontend/src/hooks/useOTP.js
import { useState } from 'react';
import { apiClient } from '../services/apiClient';
import { toast } from 'react-toastify';

export const useOTP = () => {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Enviar código OTP
  const sendOTP = async (telefono, email, tipo = 'verificacion', metodo = 'sms') => {
    try {
      setLoading(true);
      const response = await apiClient.post('/otp/send', {
        telefono,
        email,
        tipo,
        metodo
      });

      if (response.data.success) {
        toast.success('Código enviado exitosamente');
        startCountdown(response.data.tiempo_restante || 600); // 10 minutos por defecto
        return { success: true, data: response.data };
      }

      return { success: false, error: 'Error enviando código' };

    } catch (error) {
      // Manejo especial de rate limit 429
      if (error.response?.status === 429) {
        const ra = parseInt(error.response.headers?.['retry-after'] || '0', 10);
        const wait = Number.isFinite(ra) && ra > 0 ? ra : 120;
        startCountdown(wait);
        toast.warn(`Demasiados intentos. Intenta de nuevo en ~${Math.ceil(wait/60)} min`);
        return { success: false, error: 'Demasiados intentos. Intenta más tarde.' };
      }
      const message = error.response?.data?.message || 'Error enviando código OTP';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Verificar código OTP
  const verifyOTP = async (telefono, codigo, tipo = 'verificacion') => {
    try {
      setLoading(true);
      const response = await apiClient.post('/otp/verify', {
        telefono,
        codigo,
        tipo
      });

      if (response.data.success) {
        toast.success('Código verificado exitosamente');
        setTimeLeft(0);
        return { success: true, data: response.data };
      }

      return { success: false, error: 'Código inválido' };

    } catch (error) {
      const message = error.response?.data?.message || 'Error verificando código';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Reenviar código OTP
  const resendOTP = async (telefono, email, tipo = 'verificacion', metodo = 'sms') => {
    try {
      setLoading(true);
      const response = await apiClient.post('/otp/resend', {
        telefono,
        email,
        tipo,
        metodo
      });

      if (response.data.success) {
        toast.success('Código reenviado exitosamente');
        startCountdown(response.data.tiempo_restante || 600);
        return { success: true, data: response.data };
      }

      return { success: false, error: 'Error reenviando código' };

    } catch (error) {
      if (error.response?.status === 429) {
        const ra = parseInt(error.response.headers?.['retry-after'] || '0', 10);
        const wait = Number.isFinite(ra) && ra > 0 ? ra : 120;
        startCountdown(wait);
        toast.warn(`Demasiados intentos. Intenta de nuevo en ~${Math.ceil(wait/60)} min`);
        return { success: false, error: 'Demasiados intentos. Intenta más tarde.' };
      }
      const message = error.response?.data?.message || 'Error reenviando código';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Iniciar cuenta regresiva
  const startCountdown = (seconds) => {
    setTimeLeft(seconds);
    setCanResend(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Formatear tiempo restante
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    loading,
    timeLeft,
    canResend,
    sendOTP,
    verifyOTP,
    resendOTP,
    formatTimeLeft
  };
};
