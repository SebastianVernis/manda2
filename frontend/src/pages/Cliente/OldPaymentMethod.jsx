import React, { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import MobileHeader from '../../components/ui/MobileHeader'
import AddressConfirmation from '../../components/AddressConfirmation'
import { useCart } from '../../context/CartContext'
import api from '../../services/apiClient'

const PaymentMethod = () => {
  const navigate = useNavigate()
  const { items, clearCart } = useCart()
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [isLoading, setIsLoading] = useState(false)
  const [addressConfirmed, setAddressConfirmed] = useState(false)
  const [confirmedAddress, setConfirmedAddress] = useState(null)
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })

  const paymentMethods = [
    {
      id: 'card',
      name: 'Tarjeta de crédito/débito',
      icon: '💳',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'cash',
      name: 'Efectivo',
      icon: '💵',
      description: 'Pago contra entrega'
    },
    {
      id: 'transfer',
      name: 'Transferencia bancaria',
      icon: '🏦',
      description: 'SPEI, Oxxo, Mercado Pago'
    }
  ]

  const handleCardFormChange = (field, value) => {
    if (field === 'number') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
      if (value.length > 19) return
    }
    if (field === 'expiry') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2')
      if (value.length > 5) return
    }
    if (field === 'cvv') {
      value = value.replace(/\D/g, '')
      if (value.length > 4) return
    }
    
    setCardData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddressConfirm = (addressData) => {
    setConfirmedAddress(addressData.direccion_envio)
    setAddressConfirmed(true)
  }

  const handleContinue = async () => {
    if (!addressConfirmed || !confirmedAddress) {
      alert('Por favor confirma tu dirección de entrega')
      return
    }

    if (selectedMethod === 'card' && (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name)) {
      alert('Por favor completa todos los campos de la tarjeta')
      return
    }

    if (!items || items.length === 0) {
      alert('No tienes productos en el carrito')
      return
    }

    setIsLoading(true)
    
    try {
      // Preparar datos del pedido
      const productos = items.map(item => {
        // Log para diagnóstico
        console.log("Preparing product for order:", item.product);
        
        return {
          producto: item.product._id,
          cantidad: item.quantity,
          precio_unitario: item.product.precio
        };
      })
      
      // Mapear método de pago al valor del enum del backend
      const metodoPagoMap = {
        'card': 'tarjeta',
        'cash': 'efectivo', 
        'transfer': 'transferencia'
      }
      
      const metodoPagoMapeado = metodoPagoMap[selectedMethod] || 'efectivo'
      console.log('selectedMethod:', selectedMethod, '→ mapeado a:', metodoPagoMapeado)
      console.log('direccion_envio con coordenadas:', confirmedAddress)
      
      const orderData = {
        productos,
        direccion_envio: confirmedAddress,
        metodo_pago: metodoPagoMapeado,
        notas: selectedMethod === 'card' ? `Tarjeta terminada en ${cardData.number.replace(/\s/g, '').slice(-4)}` : ''
      }

      // Debug: mostrar datos que se envían
      console.log('Datos del pedido a enviar:', orderData)
      
      // Debug
      console.log('API URL configured as:', api.defaults.baseURL);
      
      // Crear el pedido
      const response = await api.post('/orders', orderData);
      
      if (response.data) {
        // Limpiar carrito después de crear el pedido exitosamente
        clearCart()
        
        navigate('/cliente/payment-success', { 
          state: { 
            paymentMethod: selectedMethod,
            cardLast4: selectedMethod === 'card' ? cardData.number.replace(/\s/g, '').slice(-4) : null,
            orderId: response.data.pedido?._id || response.data._id,
            orderNumber: response.data.pedido?.numero_pedido || response.data.numero_pedido
          }
        })
      }
    } catch (error) {
      console.error('Error creating order:', error)
      console.error('Error response data:', error.response?.data)
      console.error('Error response status:', error.response?.status)
      alert(error.response?.data?.message || 'Error al procesar el pedido. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yega-dark via-yega-dark to-black">
      <MobileHeader>
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-white/70">
            ← Volver
          </Button>
          <h1 className="text-lg font-semibold text-white">Método de Pago</h1>
          <div className="w-16"></div>
        </div>
      </MobileHeader>

      <div className="px-4 py-4 space-y-6" style={{ margin: '0 1rem' }}>
        {/* Address Confirmation */}
        {!addressConfirmed && (
          <Card className="card-yega yega-glass">
            <Card.Body className="p-6">
              <AddressConfirmation onConfirm={handleAddressConfirm} />
            </Card.Body>
          </Card>
        )}

        {addressConfirmed && (
          <Card className="card-yega yega-glass border-success">
            <Card.Body className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400">✓</span>
                <span className="font-medium text-green-300">Dirección confirmada</span>
              </div>
              <div className="text-sm text-white-50">{confirmedAddress?.calle}</div>
              {confirmedAddress?.latitud && (
                <div className="text-xs text-white-50 mt-1">
                  📍 Ubicación GPS disponible
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setAddressConfirmed(false)}
                className="text-white/70 mt-2 p-0"
              >
                Cambiar dirección
              </Button>
            </Card.Body>
          </Card>
        )}

        {/* Payment Methods */}
        {addressConfirmed && (
          <div>
            <h2 className="text-lg font-semibold text-yega-gold mb-4">
              Selecciona tu método de pago
            </h2>
          <Form.Group onChange={(e) => setSelectedMethod(e.target.value)} className="space-y-3">
            {paymentMethods.map((method) => (
              <Card key={method.id} className={`cursor-pointer transition-colors card-yega yega-glass mb-3 ${
                selectedMethod === method.id 
                  ? 'border-warning' 
                  : ''
              }`}>
                <Card.Body className="p-4">
                  <div className="flex items-center space-x-3">
                    <Form.Check type="radio" id={method.id} value={method.id} checked={selectedMethod === method.id} />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <Form.Label htmlFor={method.id} className="font-medium text-white cursor-pointer">
                          {method.name}
                        </Form.Label>
                        <p className="text-sm text-white-50">{method.description}</p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Form.Group>

          {/* Card Details */}
          {selectedMethod === 'card' && (
          <Card className="card-yega yega-glass">
            <Card.Body className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-yega-silver mb-4">
                Detalles de la tarjeta
              </h3>
              
              <div>
                <Form.Label htmlFor="cardNumber" className="form-label-yega">
                  Número de tarjeta
                </Form.Label>
                <Form.Control
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.number}
                  onChange={(e) => handleCardFormChange('number', e.target.value)}
                  className="form-control-yega"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Form.Label htmlFor="expiry" className="form-label-yega">
                    Vencimiento
                  </Form.Label>
                  <Form.Control
                    id="expiry"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={(e) => handleCardFormChange('expiry', e.target.value)}
                    className="form-control-yega"
                  />
                </div>
                <div>
                  <Form.Label htmlFor="cvv" className="form-label-yega">
                    CVV
                  </Form.Label>
                  <Form.Control
                    id="cvv"
                    placeholder="123"
                    value={cardData.cvv}
                    onChange={(e) => handleCardFormChange('cvv', e.target.value)}
                    className="form-control-yega"
                  />
                </div>
              </div>

              <div>
                <Form.Label htmlFor="cardName" className="form-label-yega">
                  Nombre del titular
                </Form.Label>
                <Form.Control
                  id="cardName"
                  placeholder="Juan Pérez López"
                  value={cardData.name}
                  onChange={(e) => handleCardFormChange('name', e.target.value)}
                  className="form-control-yega"
                />
              </div>
            </Card.Body>
          </Card>
          )}

          {/* Cash Payment Info */}
          {selectedMethod === 'cash' && (
          <Card className="card-yega yega-glass">
            <Card.Body className="p-6">
              <div className="text-center">
                <span className="text-4xl mb-4 block">💵</span>
                <h3 className="text-lg font-semibold text-yega-silver mb-2">
                  Pago en efectivo
                </h3>
                <p className="text-white-50">
                  Prepara el dinero exacto. El repartidor podría no tener cambio disponible.
                </p>
              </div>
            </Card.Body>
          </Card>
          )}

          {/* Transfer Payment Info */}
          {selectedMethod === 'transfer' && (
          <Card className="card-yega yega-glass">
            <Card.Body className="p-6">
              <div className="text-center">
                <span className="text-4xl mb-4 block">🏦</span>
                <h3 className="text-lg font-semibold text-yega-silver mb-2">
                  Transferencia bancaria
                </h3>
                <p className="text-white-50 mb-4">
                  Podrás pagar por SPEI, Oxxo, o transferencia desde tu banco.
                </p>
                <div className="bg-white/5 rounded-lg p-3 text-left text-sm">
                  <p className="text-white">CLABE: 646180157000000004</p>
                  <p className="text-white">Beneficiario: YEGA DELIVERY S.A. DE C.V.</p>
                  <p className="text-white">RFC: YEG240101ABC</p>
                </div>
              </div>
            </Card.Body>
            </Card>
          )}

          </div>
        )}

        {/* Continue Button */}
        <Button 
          className="w-full btn-yega-primary py-3"
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Procesando pedido...
            </div>
          ) : (
            'Continuar con el pago'
          )}
        </Button>
      </div>
    </div>
  )
}

export default PaymentMethod