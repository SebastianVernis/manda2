import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { Card } from 'react-bootstrap'
import { Badge } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import MobileHeader from '../../components/ui/MobileHeader'

const MyCart = () => {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, subtotal, clearCart, refreshCart } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  
  // Refresh cart data when component mounts
  React.useEffect(() => {
    refreshCart();
  }, [refreshCart])

  const deliveryFee = 150
  const serviceFee = subtotal * 0.05
  const total = subtotal + deliveryFee + serviceFee - discount

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const applyPromoCode = () => {
    const validCodes = {
      'DESCUENTO10': subtotal * 0.1,
      'NUEVO20': subtotal * 0.2,
      'ENVIO50': 50
    }
    
    if (validCodes[promoCode]) {
      setDiscount(validCodes[promoCode])
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-vh-100 bg-dark">
        <div className="container py-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <Button variant="outline-secondary" onClick={() => navigate(-1)} className="glass-btn">
              ← Volver
            </Button>
            <h1 className="fs-4 text-white m-0">Mi Carrito</h1>
            <div style={{ width: '80px' }}></div>
          </div>

          <div className="text-center py-5">
            <div className="mx-auto mb-4 rounded-circle glass-card d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
              <span className="fs-1">🛒</span>
            </div>
            <h2 className="fs-3 text-white mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-white-50 mb-4">
              Agrega algunos productos deliciosos para empezar
            </p>
            <Button 
              className="glass-btn px-4 py-2"
              onClick={() => navigate('/cliente/tiendas')}
            >
              Explorar tiendas
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 bg-dark">
      <div className="container py-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <Button variant="outline-secondary" onClick={() => navigate(-1)} className="glass-btn">
            ← Volver
          </Button>
          <h1 className="fs-4 text-white m-0">Mi Carrito</h1>
          <Button variant="outline-danger" onClick={clearCart} size="sm" className="glass-btn">
            Limpiar
          </Button>
        </div>

        <div className="mb-4">
          {/* Items */}
          <div className="mb-4">
            {items.map((item) => (
              <Card key={item.product._id} className="glass-card mb-3">
                <Card.Body className="p-3">
                  <div className="d-flex gap-3">
                    <div className="glass-card d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', borderRadius: '14px' }}>
                      <span className="fs-3">🍽️</span>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="mb-1">{item.product.nombre}</h5>
                      <p className="small text-white-50 mb-2">{item.product.descripcion}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-warning fw-bold">
                          ${(item.product.precio * item.quantity).toFixed(2)}
                        </span>
                        <div className="d-flex align-items-center gap-2">
                          <Button
                            size="sm"
                            className="glass-btn"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            size="sm"
                            className="glass-btn"
                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Promo Code */}
          <Card className="glass-card mb-3">
            <Card.Body className="p-3">
              <div className="d-flex gap-2">
                <input
                  type="text"
                  placeholder="Código promocional"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="form-control glass-input flex-grow-1"
                />
                <Button className="glass-btn" onClick={applyPromoCode}>
                  Aplicar
                </Button>
              </div>
              {discount > 0 && (
                <div className="mt-2">
                  <Badge className="glass-badge bg-success">
                    Descuento aplicado: -${discount.toFixed(2)}
                  </Badge>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Summary */}
          <Card className="glass-card mb-4">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between mb-2 text-white-50">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-white-50">
                <span>Envío</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 text-white-50">
                <span>Servicio (5%)</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Descuento</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <hr className="border-secondary" />
              <div className="d-flex justify-content-between fw-bold">
                <span className="text-white">Total</span>
                <span className="text-warning">${total.toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>

          {/* Checkout Button */}
          <Button 
            variant="warning"
            className="btn-yega-primary w-100 py-2"
            style={{borderRadius: '12px'}}
            onClick={() => navigate('/cliente/payment-method')}
          >
            Proceder al pago
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MyCart