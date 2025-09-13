import React, { useState } from 'react'
import { Card, CardBody, Button, Image, Chip, Badge } from "@heroui/react"
import { motion } from "framer-motion"
import { FaPlus, FaMinus, FaShoppingCart, FaStar } from 'react-icons/fa'

const ProductCard = ({ product, onAddToCart, className = '' }) => {
  const [quantity, setQuantity] = useState(1)
  const [isHovered, setIsHovered] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    onAddToCart({ product, quantity })
    setQuantity(1)
    
    // Show temporary visual feedback
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 1500)
    
    // Log cart update for debugging
    console.log('Product added to cart:', product._id, product.nombre);
    
    // Save directly to localStorage for debugging
    try {
      const currentCart = JSON.parse(localStorage.getItem('yega_cart') || '[]');
      console.log('Current cart:', currentCart);
    } catch (err) {
      console.error('Error reading cart from localStorage:', err);
    }
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price)
  }

  return (
    <motion.div
      className={className}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm border border-gray-700/50 hover:border-yellow-400/50 transition-all duration-300 group rounded-xl overflow-hidden">
        <CardBody className="p-0">
          {/* Image Section */}
          <div className="relative overflow-hidden rounded-t-lg">
            <Image
              src={product.imagen || '/api/placeholder/300/200'}
              alt={product.nombre}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              fallbackSrc="/api/placeholder/300/200"
            />
            
            {/* Overlay on hover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <Button
                isIconOnly
                className="bg-white text-black"
                size="lg"
                onClick={handleAddToCart}
              >
                <FaShoppingCart />
              </Button>
            </motion.div>

            {/* Stock Badge */}
            {product.stock <= 5 && product.stock > 0 && (
              <Chip
                color="warning"
                variant="flat"
                size="sm"
                className="absolute top-2 left-2"
              >
                ¡Últimos {product.stock}!
              </Chip>
            )}

            {product.stock === 0 && (
              <Chip
                color="danger"
                variant="flat"
                size="sm"
                className="absolute top-2 left-2"
              >
                Agotado
              </Chip>
            )}

            {/* Rating Badge */}
            {product.rating && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                <FaStar className="text-white text-xs" />
                <span className="text-white text-xs font-medium">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-4 flex flex-col flex-1">
            {/* Product Name */}
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-gray-300 transition-colors">
              {product.nombre}
            </h3>

            {/* Description */}
            {product.descripcion && (
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {product.descripcion}
              </p>
            )}

            {/* Price Section */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-2xl font-bold text-white">
                  {formatPrice(product.precio)}
                </span>
                {product.precioOriginal && product.precioOriginal > product.precio && (
                  <span className="text-gray-500 text-sm line-through ml-2">
                    {formatPrice(product.precioOriginal)}
                  </span>
                )}
              </div>
              
              {product.categoria && (
                <Chip variant="flat" size="sm" className="bg-gray-700/50 text-gray-300">
                  {product.categoria}
                </Chip>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-3 mt-auto">
              {/* Quantity Selector */}
              <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-gray-400 hover:text-white"
                  onClick={decrementQuantity}
                  isDisabled={quantity <= 1}
                >
                  <FaMinus className="text-xs" />
                </Button>
                <span className="text-white font-medium px-2 min-w-[2rem] text-center">
                  {quantity}
                </span>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  className="text-gray-400 hover:text-white"
                  onClick={incrementQuantity}
                  isDisabled={product.stock === 0}
                >
                  <FaPlus className="text-xs" />
                </Button>
              </div>

              {/* Add to Cart Button */}
              <Button
                className={`flex-1 ${
                  addedToCart
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                    : "bg-gradient-to-r from-gray-200 to-white text-black"
                } font-semibold transition-all duration-300`}
                size="sm"
                onClick={handleAddToCart}
                isDisabled={product.stock === 0}
              >
                {addedToCart ? "¡Agregado!" : "Agregar"}
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  )
}

export default ProductCard