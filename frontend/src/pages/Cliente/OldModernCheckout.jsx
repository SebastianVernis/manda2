import React, { useEffect, useState, useRef } from 'react'
import { Card, CardHeader, CardBody, Input, Button, Select, SelectItem, Textarea, Spinner } from "@heroui/react"
import { motion, AnimatePresence } from "framer-motion"
import { FaShoppingCart, FaMapMarkerAlt, FaCreditCard, FaCheck, FaSearch, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import api from '../../services/apiClient'

// Mapbox Geocoding API para autocompletado
const searchAddresses = async (query) => {
  if (!query || query.length < 3) return []
  
  try {
    const response = await api.get(`/geocoding/search?query=${encodeURIComponent(query)}`)
    
    if (response.data?.success && response.data?.results) {
      return response.data.results.map(result => ({
        id: result.id,
        text: result.text,
        address: result.components?.street || result.text.split(',')[0],
        components: result.components
      }))
    }
    
    return []
  } catch (error) {
    console.error('Error searching addresses:', error)
    return []
  }
}

const ModernCheckout = () => {
  const { items, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [coords, setCoords] = useState({ latitud: undefined, longitud: undefined })
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [form, setForm] = useState({
    numero_interior: '',
    referencias: '',
    notas: ''
  })
  
  // Estados para autocompletado
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchTimeoutRef = useRef(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ latitud: pos.coords.latitude, longitud: pos.coords.longitude }),
      () => {}
    )
  }, [])

  // Búsqueda de direcciones con debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const results = await searchAddresses(searchQuery)
        setSearchResults(results)
        setShowDropdown(results.length > 0)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
        setShowDropdown(false)
      } finally {
        setSearchLoading(false)
      }
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.address-search-container')) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const onChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  // Seleccionar dirección del autocompletado
  const selectAddress = (result) => {
    setSelectedAddress(result)
    setSearchQuery(result.text)
    setShowDropdown(false)
  }

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowDropdown(false)
    setSelectedAddress(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (items.length === 0) { 
      setError('El carrito está vacío'); 
      return 
    }
    
    if (!selectedAddress) { 
      setError('Por favor selecciona una dirección válida'); 
      return 
    }

    // Ir a la página de método de pago con los datos
    const orderData = {
      productos: items.map(it => ({ producto: it.product._id, cantidad: it.quantity })),
      direccion_envio: {
        calle: selectedAddress.components?.street || selectedAddress.text.split(',')[0],
        numero: 'S/N',
        numero_interior: form.numero_interior || '',
        ciudad: selectedAddress.components?.place || selectedAddress.components?.locality || 'Ciudad de México',
        codigo_postal: selectedAddress.components?.postcode || '00000',
        referencias: form.referencias,
        latitud: coords.latitud,
        longitud: coords.longitud
      },
      notas: form.notas
    }

    // Guardar datos en sessionStorage y navegar a método de pago
    sessionStorage.setItem('checkout_data', JSON.stringify(orderData))
    navigate('/cliente/payment-method')
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Finalizar Pedido
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <FaShoppingCart className="text-gray-400" />
            <span>{items.length} productos en tu carrito</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de envío */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="yega-glass">
              <CardHeader className="border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <h2 className="text-2xl font-semibold text-white">Dirección de Envío</h2>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                    <p className="text-red-300">{error}</p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3 relative address-search-container">
                      <Input
                        label="Buscar dirección"
                        placeholder="Ej: Av. Insurgentes Sur 123, Roma Norte"
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                        classNames={{
                          input: "text-white",
                          label: "text-gray-300",
                          inputWrapper: "border-gray-600 data-[hover=true]:border-gray-400 group-data-[focus=true]:border-white"
                        }}
                        startContent={<FaSearch className="text-gray-400" />}
                        endContent={
                          searchQuery && (
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              onClick={clearSearch}
                              className="text-gray-400 hover:text-white"
                            >
                              <FaTimes />
                            </Button>
                          )
                        }
                        required
                      />
                      
                      {/* Dropdown de resultados */}
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
                          >
                            {searchLoading ? (
                              <div className="p-4 text-center">
                                <Spinner size="sm" />
                                <p className="text-gray-400 mt-2 text-sm">Buscando direcciones...</p>
                              </div>
                            ) : (
                              searchResults.map((result, index) => (
                                <motion.button
                                  key={result.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  type="button"
                                  className="w-full p-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                                  onClick={() => selectAddress(result)}
                                >
                                  <div className="text-white font-medium">{result.text}</div>
                                  {result.address && (
                                    <div className="text-gray-400 text-sm mt-1">{result.address}</div>
                                  )}
                                </motion.button>
                              ))
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Dirección seleccionada */}
                  {selectedAddress && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-500/20 border border-green-500/50 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <FaCheck className="text-green-400 mt-1" />
                        <div className="flex-1">
                          <div className="text-white font-semibold mb-2">Dirección seleccionada:</div>
                          <div className="text-gray-300">{selectedAddress.text}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Campos adicionales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Número interior / Depto"
                      placeholder="Ej: Depto 4B, Piso 3"
                      value={form.numero_interior}
                      onValueChange={(value) => onChange('numero_interior', value)}
                      classNames={{
                        input: "text-white",
                        label: "text-gray-300",
                        inputWrapper: "border-gray-600 data-[hover=true]:border-gray-400 group-data-[focus=true]:border-white"
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Textarea
                      label="Referencias"
                      placeholder="Ej: Casa azul, entre tienda y farmacia, portón negro"
                      value={form.referencias}
                      onValueChange={(value) => onChange('referencias', value)}
                      classNames={{
                        input: "text-white",
                        label: "text-gray-300",
                        inputWrapper: "border-gray-600 data-[hover=true]:border-gray-400 group-data-[focus=true]:border-white"
                      }}
                      minRows={2}
                    />
                    
                    <Input
                      label="Notas para el pedido"
                      placeholder="Instrucciones especiales para la preparación"
                      value={form.notas}
                      onValueChange={(value) => onChange('notas', value)}
                      classNames={{
                        input: "text-white",
                        label: "text-gray-300",
                        inputWrapper: "border-gray-600 data-[hover=true]:border-gray-400 group-data-[focus=true]:border-white"
                      }}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-gradient-to-r from-gray-200 to-white text-black font-semibold px-8"
                      disabled={!selectedAddress || items.length === 0}
                      startContent={<FaCheck />}
                    >
                      Continuar a Método de Pago
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </motion.div>

          {/* Resumen del pedido */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="yega-glass sticky top-8">
              <CardHeader className="border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">Resumen del Pedido</h3>
              </CardHeader>
              <CardBody className="p-6">
                {items.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <FaShoppingCart className="text-4xl mx-auto mb-4 opacity-50" />
                    <p>El carrito está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.product.nombre}</h4>
                          <p className="text-gray-400 text-sm">Cantidad: {item.quantity}</p>
                        </div>
                        <div className="text-white font-semibold">
                          ${(item.product.precio * item.quantity).toFixed(2)}
                        </div>
                      </motion.div>
                    ))}
                    
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between items-center text-lg">
                        <span className="text-gray-300">Subtotal</span>
                        <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-2">
                        <span className="text-gray-400">Envío</span>
                        <span className="text-gray-400">Se calcula al confirmar</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ModernCheckout