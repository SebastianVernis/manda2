import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
    <div className="min-h-screen bg-gradient-to-br from-yega-dark via-yega-dark to-black">
      <MobileHeader>
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" onClick={() => navigate('/login')} className="text-white/70">
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
            <div className="w-24 h-24 mx-auto mb-4 bg-yega-gold/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-yega-gold mb-2">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-white/70">
              No te preocupes, te enviaremos un enlace para restablecerla
            </p>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="form-label-yega">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="form-control-yega"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {message && (
                  <Alert className="border-green-500/50 bg-green-500/10">
                    <AlertDescription className="text-green-400">{message}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full btn-yega-primary"
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
              </form>

              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-white/70 text-sm">
                  ¿Recordaste tu contraseña?{' '}
                  <Button variant="link" className="text-yega-gold p-0" onClick={() => navigate('/login')}>
                    Iniciar sesión
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword