// frontend/src/pages/VerifyOTP.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OTPInput from '../components/OTPInput';

const VerifyOTP = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP } = useAuth();

  // Obtener datos del estado de navegación
  const { email, telefono, tipo = 'registro' } = location.state || {};

  useEffect(() => {
    // Redireccionar si no hay datos necesarios
    if (!email || !telefono) {
      // Si falta teléfono pero hay email (redirigido desde login), reenvía OTP por email
      if (email && !telefono) {
        resendOTP(email).catch(() => {});
      } else {
        navigate('/register', { replace: true });
      }
    }
  }, [email, telefono, navigate, resendOTP]);

  const handleSuccess = async (data) => {
    try {
      const result = await verifyOTP(email, data.codigo, telefono);
      if (result.success) {
        const rol = result.user?.rol || result.user?.usuario?.rol || result?.rol
        if (rol === 'tienda') {
          navigate('/tienda/direccion', { replace: true })
        } else if (rol === 'repartidor') {
          navigate('/repartidor/vehiculo', { replace: true })
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setError(result.error || 'Error verificando cuenta');
      }
    } catch (err) {
      setError('Error inesperado verificando cuenta');
    }
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
  };

  if (!email) {
    return null; // El useEffect redirige a registro si no hay email
  }

  return (
    <div className="min-vh-100 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Container className="py-5">
        <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="card-yega">
            <Card.Header className="text-center">
              <h3 className="mb-0">Verificar Cuenta</h3>
            </Card.Header>
            
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="alert-yega-danger">
                  {error}
                </Alert>
              )}

              <div className="text-center mb-4">
                <p className="text-muted">
                  Hemos enviado un código de verificación a:
                </p>
                {telefono && (
                  <div className="mb-2">
                    <strong className="text-yega-gold">📱 {telefono}</strong>
                  </div>
                )}
                <div>
                  <strong className="text-yega-silver">📧 {email}</strong>
                </div>
              </div>

              <OTPInput
                telefono={telefono}
                email={email}
                tipo={tipo}
                metodo="sms" // Cambiar según preferencia
                onSuccess={handleSuccess}
                onError={handleError}
                autoSend={true}
                length={6}
                manualVerify={true}
              />

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0 text-muted">
                  ¿Problemas con la verificación?{' '}
                  <a href="/contact" className="text-decoration-none">
                    Contacta soporte
                  </a>
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Información adicional */}
          <Card className="card-yega mt-4">
            <Card.Body className="text-center">
              <h6 className="text-yega-gold mb-3">Consejos de Verificación</h6>
              <div className="text-sm text-muted">
                <div className="mb-2">
                  ✓ El código expira en 10 minutos
                </div>
                <div className="mb-2">
                  ✓ Verifica tu bandeja de spam si elegiste email
                </div>
                <div className="mb-2">
                  ✓ Asegúrate de tener señal si elegiste SMS
                </div>
                <div>
                  ✓ Puedes reenviar el código si no lo recibes
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Container>
    </div>
  );
};

export default VerifyOTP;
