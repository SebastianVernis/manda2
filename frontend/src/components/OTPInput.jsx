// frontend/src/components/OTPInput.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import { useOTP } from '../hooks/useOTP';
import styled from 'styled-components';

const OTPContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const OTPInputsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;

const OTPInputField = styled.input`
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  border: 2px solid var(--color-gray-600);
  border-radius: 8px;
  background-color: var(--color-gray-800);
  color: var(--color-secondary);
  
  &:focus {
    outline: none;
    border-color: var(--color-accent-gold);
    box-shadow: 0 0 0 0.2rem rgba(212, 175, 55, 0.25);
  }
  
  &.error {
    border-color: var(--color-danger);
  }
  
  &.success {
    border-color: var(--color-success);
  }
`;

const CountdownText = styled.div`
  color: var(--color-accent-silver);
  font-size: 0.9rem;
`;

const ResendButton = styled(Button)`
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const OTPInput = ({
  telefono,
  email,
  tipo = 'verificacion',
  metodo = 'sms',
  onSuccess,
  onError,
  autoSend = false,
  length = 6,
  manualVerify = false
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);
  
  const {
    loading,
    timeLeft,
    canResend,
    sendOTP,
    verifyOTP,
    resendOTP,
    formatTimeLeft
  } = useOTP();

  // Handlers memorizados para cumplir reglas de hooks
  const handleSendOTP = useCallback(async () => {
    setError('');
    const result = await sendOTP(telefono, email, tipo, metodo);
    if (!result.success) {
      setError(result.error);
      if (onError) onError(result.error);
    }
  }, [email, metodo, onError, sendOTP, telefono, tipo])

  // Enfocar primer input al montar
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleVerifyOTP = useCallback(async (otpValue) => {
    setError('');
    const result = await verifyOTP(telefono, otpValue, tipo);
    if (result.success) {
      setSuccess(true);
      if (onSuccess) onSuccess(result.data);
    } else {
      setError(result.error);
      setOtp(new Array(length).fill(''));
      if (inputRefs.current[0]) inputRefs.current[0].focus();
      if (onError) onError(result.error);
    }
  }, [length, onError, onSuccess, telefono, tipo, verifyOTP])

  // Auto-enviar OTP una sola vez por combinación telefono+email+tipo+metodo
  const lastAutoKeyRef = useRef(null)
  useEffect(() => {
    if (!autoSend || !telefono || !email) return
    const key = `${telefono}|${email}|${tipo}|${metodo}`
    if (lastAutoKeyRef.current === key) return
    lastAutoKeyRef.current = key
    handleSendOTP()
    // Nota: intencionalmente no listamos handleSendOTP en deps para evitar bucles cuando cambian callbacks del padre
  }, [autoSend, telefono, email, tipo, metodo, handleSendOTP])

  // Verificar/entregar código cuando se complete
  useEffect(() => {
    const otpValue = otp.join('');
    if (otpValue.length === length && !loading) {
      if (manualVerify) {
        if (onSuccess) onSuccess({ codigo: otpValue });
      } else {
        handleVerifyOTP(otpValue);
      }
    }
  }, [otp, length, loading, manualVerify, onSuccess, handleVerifyOTP]);

  // Nota: handlers definidos arriba con useCallback

  const handleResendOTP = async () => {
    setError('');
    setOtp(new Array(length).fill(''));
    const result = await resendOTP(telefono, email, tipo, metodo);
    
    if (!result.success) {
      setError(result.error);
      if (onError) onError(result.error);
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Enfocar siguiente input
    if (element.value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace: ir al input anterior
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    
    // Enter: verificar código
    if (e.key === 'Enter') {
      handleVerifyOTP();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, length);
    
    if (pastedNumbers.length === length) {
      const newOtp = pastedNumbers.split('');
      setOtp(newOtp);
      inputRefs.current[length - 1].focus();
    }
  };

  const getInputClassName = () => {
    if (success) return 'success';
    if (error) return 'error';
    return '';
  };

  return (
    <OTPContainer>
      <div className="text-center mb-3">
        <h5 className="text-yega-gold">Verificación de Código</h5>
        <p className="text-muted">
          Ingresa el código de {length} dígitos enviado a tu {metodo === 'email' ? 'email' : 'teléfono'}
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="w-100 text-center">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="w-100 text-center">
          ✅ Código verificado exitosamente
        </Alert>
      )}

      <OTPInputsContainer>
        {otp.map((digit, index) => (
          <OTPInputField
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className={getInputClassName()}
            disabled={loading || success}
          />
        ))}
      </OTPInputsContainer>

      {timeLeft > 0 && (
        <CountdownText>
          Código expira en: <strong>{formatTimeLeft()}</strong>
        </CountdownText>
      )}

      <div className="d-flex gap-2 align-items-center">
        <ResendButton
          variant="outline-secondary"
          size="sm"
          onClick={handleResendOTP}
          disabled={!canResend || loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="me-1" />
              Enviando...
            </>
          ) : (
            'Reenviar Código'
          )}
        </ResendButton>

        {!autoSend && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleSendOTP}
            disabled={loading}
          >
            Enviar Código
          </Button>
        )}
      </div>

      <div className="text-center">
        <small className="text-muted">
          ¿No recibiste el código? Verifica tu {metodo === 'email' ? 'bandeja de entrada y spam' : 'mensajes de texto'}
        </small>
      </div>
    </OTPContainer>
  );
};

export default OTPInput;
