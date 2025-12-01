import React, { useState } from 'react'
import { Button } from "react-bootstrap"
import { Card, Form, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import MobileHeader from '../components/ui/MobileHeader'
import api from '../services/apiClient'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Por favor ingresa tu email')
      return
    }

    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      await api.post('/auth/forgot-password', { email })
      setMessage('Se ha enviado un enlace de recuperación a tu email')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el email de recuperación')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-manda2-dark via-manda2-dark to-black">
      <MobileHeader>
        <div className="flex items-center justify-between w-full">
          <Button variant="outline-light" onClick={() => navigate('/login')} className="text-white/70">
            ← Volver
          </Button>
          <h1 className="text-lg font-semibold text-white">Recuperar Contraseña</h1>
          <div className="w-16"></div>
        </div>
      </MobileHeader>

      <div className="px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-manda2-gold/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-manda2-gold mb-2">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-white/70">
              No te preocupes, te enviaremos un enlace para restablecerla
            </p>
          </div>

          <Card bg="dark" border="secondary" className="shadow-lg">
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="bg-dark text-light border-secondary" 
                    disabled={isLoading}
                  />
                </Form.Group>

                {error && (
                  <Alert variant="danger" className="my-3">
                    {error}
                  </Alert>
                )}

                {message && (
                  <Alert variant="success" className="my-3">
                    {message}
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-100 bg-primary text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </div>
                  ) : (
                    'Enviar enlace de recuperación'
                  )}
                </Button>
              </Form>

              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-white/70 text-sm">
                  ¿Recordaste tu contraseña?{' '}
                  <Button variant="link" className="text-warning p-0" onClick={() => navigate('/login')}>
                    Iniciar sesión
                  </Button>
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword