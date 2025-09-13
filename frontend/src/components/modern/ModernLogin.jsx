import React, { useState } from 'react'
import { Card, CardBody, Button, Input, Link, Divider } from "@heroui/react"
import { motion } from "framer-motion"
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

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
      toast.error('Por favor completa todos los campos')
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
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
          <Card className="yega-glass">
            <CardBody className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <Input
                  type="email"
                  label="Correo electrónico"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onValueChange={(value) => handleInputChange('email', value)}
                  startContent={<FaEnvelope className="text-gray-400 my-auto" />}
                  variant="bordered"
                  className="text-white"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "flex items-center border-gray-600 data-[hover=true]:border-gray-400 group-data-[focus=true]:border-white",
                    label: "text-gray-300"
                  }}
                />

                {/* Password Input */}
                <Input
                  type={isVisible ? "text" : "password"}
                  label="Contraseña"
                  placeholder="••••••••"
                  value={formData.password}
                  onValueChange={(value) => handleInputChange('password', value)}
                  startContent={<FaLock className="text-gray-400 my-auto" />}
                  endContent={
                    <button
                      className="focus:outline-none my-auto"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? (
                        <FaEyeSlash className="text-gray-400 hover:text-gray-200" />
                      ) : (
                        <FaEye className="text-gray-400 hover:text-gray-200" />
                      )}
                    </button>
                  }
                  variant="bordered"
                  className="text-white"
                  classNames={{
                    input: "text-white",
                    inputWrapper: "flex items-center border-gray-600 data-[hover=true]:border-gray-400 group-data-[focus=true]:border-white",
                    label: "text-gray-300"
                  }}
                />

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link 
                    href="/forgot-password" 
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gray-200 to-white text-black font-semibold py-3 text-lg"
                  size="lg"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <Divider className="bg-gray-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-gray-900 px-4 text-gray-400 text-sm">o continúa con</span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="bordered"
                    className="border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
                    startContent={<FaGoogle />}
                    disabled
                  >
                    Google
                  </Button>
                  <Button
                    variant="bordered"
                    className="border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
                    startContent={<FaFacebook />}
                    disabled
                  >
                    Facebook
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link 
                href="/register" 
                className="text-gray-300 hover:text-white font-semibold"
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