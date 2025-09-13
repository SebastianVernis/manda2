import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate, useLocation } from 'react-router-dom'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [countdown, setCountdown] = useState(3)
  
  const paymentMethod = location.state?.paymentMethod || 'card'
  const cardLast4 = location.state?.cardLast4
  const orderId = location.state?.orderId
  const orderNumber = location.state?.orderNumber

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case 'card':
        return cardLast4 ? `Tarjeta terminada en ${cardLast4}` : 'Tarjeta de crédito/débito'
      case 'cash':
        return 'Efectivo'
      case 'transfer':
        return 'Transferencia bancaria'
      default:
        return 'Método de pago'
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/cliente/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-yega-dark via-yega-dark to-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">✓</span>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-yega-gold mb-2">
              ¡Pago exitoso!
            </h1>
            <p className="text-white/70 mb-6">
              Tu pedido ha sido confirmado y está siendo preparado
            </p>

            {/* Payment Details */}
            <div className="bg-white/5 rounded-lg p-4 mb-6 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Método de pago:</span>
                <span className="text-white">{getPaymentMethodDisplay()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Estado:</span>
                <span className="text-green-400">Confirmado</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Número de pedido:</span>
                <span className="text-white font-mono">
                  {orderNumber || `#YG${Date.now().toString().slice(-6)}`}
                </span>
              </div>
            </div>

            {/* Order Status */}
            <div className="bg-yega-gold/10 border border-yega-gold/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-yega-gold rounded-full animate-pulse"></div>
                <span className="text-yega-gold font-semibold">En preparación</span>
              </div>
              <p className="text-white/70 text-sm">
                Tiempo estimado de entrega: 25-30 minutos
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full btn-yega-primary"
                onClick={() => navigate(orderId ? `/cliente/seguimiento?id=${orderId}` : '/cliente/seguimiento')}
              >
                Seguir mi pedido
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full btn-yega-secondary"
                onClick={() => navigate('/cliente/dashboard')}
              >
                Ir al inicio
              </Button>
            </div>

            {/* Auto redirect countdown */}
            <p className="text-white/50 text-sm mt-4">
              Redirigiendo automáticamente en {countdown} segundos...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PaymentSuccess