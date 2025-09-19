import React, { useState } from 'react'
import { Button, Card, Badge, Form } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'


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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container py-4" style={{paddingTop: '3rem'}}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <FaShoppingCart className="text-green-400" />
              Mi Carrito
            </h1>
            <p className="text-gray-400 text-lg">Revisa tus productos antes de continuar</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <Card className="yega-glass">
              <Card.Body className="py-5">
                <FaShoppingCart size={80} className="text-white-50 mb-4" />
                <h2 className="text-white mb-3">Tu carrito está vacío</h2>
                <p className="text-white-50 mb-4">
                  Agrega algunos productos deliciosos para empezar
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="btn btn-primary px-4 py-2"
                  onClick={() => navigate('/cliente/tiendas')}
                >
                  Explorar Tiendas
                </motion.button>
              </Card.Body>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container py-4" style={{paddingTop: '3rem'}}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="d-flex align-items-center justify-content-between mb-6"
        >
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <FaShoppingCart className="text-green-400" />
            Mi Carrito ({items.length})
          </h1>
          <Button 
            variant="outline-danger" 
            onClick={clearCart} 
            size="sm" 
            className="hover:bg-red-600"
          >
            <FaTrash className="me-2" />
            Limpiar
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          {/* Items */}
          <div className="mb-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.product._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="yega-glass mb-3 hover-card-effect">
                    <Card.Body className="p-4">
                      <div className="d-flex gap-3">
                        <div className="bg-primary bg-opacity-20 rounded-3 d-flex align-items-center justify-content-center text-primary" style={{ width: '70px', height: '70px' }}>
                          <span className="fs-2">🍽️</span>
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="text-white mb-2">{item.product.nombre}</h5>
                          <p className="small text-white-50 mb-3">{item.product.descripcion}</p>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="text-white-50 small">Precio unitario: ${item.product.precio}</div>
                              <div className="text-success fw-bold fs-5">
                                ${(item.product.precio * item.quantity).toFixed(2)}
                              </div>
                            </div>
                            
                            <div className="d-flex align-items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline-light"
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{width: '32px', height: '32px'}}
                                onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                              >
                                <FaMinus size={10} />
                              </Button>
                              <span className="mx-3 text-white fw-bold fs-5">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline-light"
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{width: '32px', height: '32px'}}
                                onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                              >
                                <FaPlus size={10} />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                className="ms-2"
                                onClick={() => removeItem(item.product._id)}
                              >
                                <FaTrash size={12} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
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
        </motion.div>
      </div>
    </div>
  )
}

export default MyCart