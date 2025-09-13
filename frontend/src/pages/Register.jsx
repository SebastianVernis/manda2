// frontend/src/pages/Register.jsx
import React, { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    password: '',
    rol: 'cliente'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error al escribir
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validaciones básicas
    if (!formData.nombre || !formData.telefono || !formData.email || !formData.password) {
      setError('Todos los campos son requeridos')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const result = await register(formData)
      
      if (result.success) {
        // Si requiere OTP, redirigir a verificación
        if (result.requiresOTP) {
          navigate('/verify-otp', { 
            state: { 
              email: formData.email,
              telefono: formData.telefono,
              tipo: 'registro'
            } 
          })
        } else {
          // Para clientes, redirigir al dashboard
          navigate('/dashboard')
        }
      } else {
        setError(result.error || 'Error al registrarse')
      }
    } catch (err) {
      setError('Error inesperado. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="card-yega">
            <Card.Header className="text-center">
              <h3 className="mb-0">Registrarse</h3>
            </Card.Header>
            
            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="alert-yega-danger">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">
                    <FaUser className="me-2" />
                    Nombre Completo
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="form-control-yega"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">
                    <FaPhone className="me-2" />
                    Teléfono
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+541112345678"
                    className="form-control-yega"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">
                    <FaEnvelope className="me-2" />
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="form-control-yega"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">
                    <FaLock className="me-2" />
                    Contraseña
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      className="form-control-yega pe-5"
                      disabled={loading}
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                      style={{ zIndex: 10 }}
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="form-label-yega">Rol</Form.Label>
                  <Form.Select
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    className="form-control-yega"
                    disabled={loading}
                  >
                    <option value="cliente">Cliente</option>
                    <option value="tienda">Tienda</option>
                    <option value="repartidor">Repartidor</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 btn-yega-primary"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </Button>
              </Form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="mb-0">
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login" className="text-decoration-none">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Información adicional removida: tarjeta de tipos de cuenta */}
        </Col>
      </Row>
    </Container>
  )
}

export default Register
