import React, { useState } from 'react'
import { Card, Button, Form, Alert } from 'react-bootstrap'
import { motion } from "framer-motion"
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const ModernLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const toggleVisibility = () => setIsVisible(!isVisible)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      return
    }

    setIsLoading(true)
    
    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        // Redirigir según el rol del usuario
        const dashboardRoutes = {
          cliente: '/cliente/dashboard',
          tienda: '/tienda/dashboard',
          repartidor: '/repartidor/dashboard',
          administrador: '/admin/dashboard'
        }
        navigate(dashboardRoutes[result.user?.rol] || '/cliente/dashboard')
      } else if (result.requiresOTP) {
        // Redirigir a verificación OTP
        navigate('/verify-otp', { 
          state: { 
            email: result.email, 
            telefono: result.telefono 
          } 
        })
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-vh-100 bg-gradient-to-br from-gray-900 via-black to-gray-900 d-flex align-items-center justify-content-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(192,192,192,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.05),transparent_50%)]" />
      
      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center justify-center mb-4"
            >
              <img 
                src="/images/yega-light.svg" 
                alt="YEGA" 
                height="80" 
                width="auto"
              />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-gray-400">Inicia sesión en tu cuenta YEGA</p>
          </div>

          {/* Login Form */}
          <Card className="glass-card">
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                {/* Email Input */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-gray-300">
                    <FaEnvelope className="me-2" />Correo electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="form-control-yega"
                    required
                  />
                </Form.Group>

                {/* Password Input */}
                <Form.Group className="mb-3">
                  <Form.Label className="text-gray-300">
                    <FaLock className="me-2" />Contraseña
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={isVisible ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="form-control-yega"
                      required
                    />
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y text-gray-400"
                      style={{ border: 'none', background: 'none', zIndex: 5 }}
                      onClick={toggleVisibility}
                    >
                      {isVisible ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>

                {/* Forgot Password */}
                <div className="d-flex justify-content-end mb-3">
                  <Link 
                    to="/forgot-password" 
                    className="text-gray-300 text-decoration-none small"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-100 btn-yega-primary mb-3"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Register Link */}
          <div className="text-center mt-4">
            <p className="text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link 
                to="/register" 
                className="text-gray-300 text-decoration-none fw-bold"
              >
                Regístrate gratis
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ModernLogin