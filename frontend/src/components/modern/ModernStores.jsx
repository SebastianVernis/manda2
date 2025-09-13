import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, Button, Chip, Input, Modal, ModalContent, ModalHeader, ModalBody, Spinner } from "@heroui/react"
import { motion, AnimatePresence } from "framer-motion"
import { FaSearch, FaMapMarkerAlt, FaClock, FaStar, FaFilter, FaShoppingCart } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import { useCart } from '../../context/CartContext'
import { useLocationCheck } from '../../hooks/useLocationCheck'
import ProductCard from './ProductCard'
import api from '../../services/apiClient'
import { reverseGeocode } from '../../lib/geocoding'

const ModernStores = () => {
  const [coords, setCoords] = useState(null)
  const [addressText, setAddressText] = useState('')
  const [selectedStore, setSelectedStore] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false)
  
  const { addItem, refreshCart, items } = useCart()
  useLocationCheck()

  // Obtener ubicación
  useEffect(() => {
    if (!navigator.geolocation) return
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCoords(newCoords)
        
        try {
          const addr = await reverseGeocode(newCoords.lat, newCoords.lng)
          setAddressText(addr)
          localStorage.setItem('yega_addr', addr)
        } catch (error) {
          console.error('Error getting address:', error)
          setAddressText(`${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)}`)
        }
      },
      (error) => {
        console.error('Error getting location:', error)
        // Usar ubicación predeterminada (Ciudad de México)
        setCoords({ lat: 19.4326, lng: -99.1332 })
        setAddressText('Ciudad de México')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }, [])

  // No fallback stores - we rely on actual API data

  // Query para tiendas
  const storesQuery = useQuery({
    queryKey: ['stores', coords],
    queryFn: async () => {
      if (!coords) return []
      try {
        const response = await api.get(`/stores?lat=${coords.lat}&lng=${coords.lng}&limit=50`)
        return response.data?.tiendas || []
      } catch (error) {
        console.warn('Error al cargar tiendas:', error.message)
        return []
      }
    },
    enabled: !!coords
  })

  // No fallback products - we rely on actual API data

  // Query para productos de tienda seleccionada
  const productsQuery = useQuery({
    queryKey: ['store-products', selectedStore],
    queryFn: async () => {
      if (!selectedStore) return []
      try {
        const response = await api.get(`/products?tiendaId=${selectedStore}`)
        return response.data?.productos || [];
      } catch (error) {
        console.warn('Error al cargar productos:', error.message)
        return []
      }
    },
    enabled: !!selectedStore
  })

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    if (!productsQuery.data || !Array.isArray(productsQuery.data)) return []
    
    let filtered = productsQuery.data
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.descripcion?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => product.categoria === filterCategory)
    }
    
    return filtered
  }, [productsQuery.data, searchQuery, filterCategory])

  // Obtener categorías únicas
  const categories = useMemo(() => {
    if (!productsQuery.data || !Array.isArray(productsQuery.data)) return []
    const cats = [...new Set(productsQuery.data.map(p => p.categoria).filter(Boolean))]
    return cats
  }, [productsQuery.data])

  const handleAddToCart = ({ product, quantity }) => {
    addItem(product, quantity)
  }

  const openStoreModal = (store) => {
    setSelectedStore(store._id || store.id)
    setIsStoreModalOpen(true)
    setSearchQuery('')
    setFilterCategory('all')
    refreshCart() // Refresh cart when opening store
  }

  const closeStoreModal = () => {
    setIsStoreModalOpen(false)
    setSelectedStore(null)
  }

  const shortAddress = useMemo(() => {
    if (!addressText) return ''
    const first = addressText.split(',')[0]?.trim()
    return first || addressText
  }, [addressText])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10"></div> {/* Spacer for balance */}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Tiendas Cercanas
            </h1>
            <Link to="/cliente/mycart" className="relative text-white bg-yellow-600 hover:bg-yellow-700 p-2 rounded-full">
              <FaShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Link>
          </div>
          {addressText && (
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <FaMapMarkerAlt className="text-gray-400" />
              <span>{shortAddress}</span>
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {storesQuery.isLoading && (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" color="warning" />
          </div>
        )}

        {/* Stores Grid */}
        {storesQuery.data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {storesQuery.data.map((store, index) => (
              <motion.div
                key={store._id || store.id || `store-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="h-full yega-glass hover:bg-white/10 transition-all duration-300 group"
                >
                  <CardBody className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white group-hover:text-gray-300 transition-colors">
                          {store.nombre}
                        </h3>
                        <p className="text-gray-400 text-sm">{store.telefono || 'Sin teléfono'}</p>
                      </div>
                      {typeof store.distancia === 'number' && (
                        <Chip variant="flat" size="sm" className="bg-white/20 text-white">
                          {store.distancia.toFixed(1)} km
                        </Chip>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span className="truncate">
                          {store.ubicacion?.direccion || 
                           (store.ubicacion ? `${store.ubicacion.latitud.toFixed(3)}, ${store.ubicacion.longitud.toFixed(3)}` : 'Sin ubicación')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <FaClock className="text-green-400" />
                        <span>Abierto</span>
                      </div>
                      
                      {store.rating && (
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <FaStar className="text-white" />
                          <span>{store.rating}/5</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-gray-200 to-white text-black font-semibold hover:from-white hover:to-gray-100 transition-all duration-200"
                      size="lg"
                      onClick={() => openStoreModal(store)}
                    >
                      Ver Productos
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Stores Message */}
        {storesQuery.data && storesQuery.data.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <FaMapMarkerAlt className="text-6xl mx-auto mb-4 opacity-50" />
              <h3 className="text-xl mb-2">No hay tiendas cercanas</h3>
              <p>Intenta cambiar tu ubicación o revisa más tarde</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Store Products Modal */}
      <Modal 
        isOpen={isStoreModalOpen} 
        onClose={closeStoreModal}
        size="3xl"
        backdrop="blur"
        placement="center"
        className="bg-black/95 hero-modal"
        classNames={{
          backdrop: "bg-black/80 backdrop-blur-md",
          base: "bg-gray-900/95 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl max-w-4xl mx-auto",
          body: "p-6 max-h-[80vh] overflow-y-auto",
          closeButton: "text-white hover:bg-white/20",
        }}
      >
        <ModalContent>
          <ModalHeader className="border-b border-gray-700 rounded-t-2xl">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-2xl font-bold text-white">Productos</h2>
              <Button 
                variant="light" 
                onClick={closeStoreModal}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
          </ModalHeader>
          
          <ModalBody className="p-6 rounded-b-2xl">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                startContent={<FaSearch className="text-gray-400" />}
                className="flex-1"
                classNames={{
                  input: "text-white",
                  inputWrapper: "border-gray-600 data-[hover=true]:border-gray-400 group-data-[focus=true]:border-white",
                }}
              />
              
              <div className="flex gap-2">
                <Button
                  variant={filterCategory === 'all' ? 'solid' : 'bordered'}
                  className={filterCategory === 'all' ? 'bg-white text-black' : 'border-gray-600 text-gray-300'}
                  onClick={() => setFilterCategory('all')}
                >
                  Todos
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={filterCategory === category ? 'solid' : 'bordered'}
                    className={filterCategory === category ? 'bg-white text-black' : 'border-gray-600 text-gray-300'}
                    onClick={() => setFilterCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Loading */}
            {productsQuery.isLoading && (
              <div className="flex justify-center py-12">
                <Spinner size="lg" color="warning" />
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product._id || `product-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* No Products Message */}
            {productsQuery.data && Array.isArray(productsQuery.data) && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400">
                  <h3 className="text-xl mb-2">No se encontraron productos</h3>
                  <p>Intenta cambiar los filtros o buscar algo diferente</p>
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ModernStores