import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { FaEllipsisV, FaShoppingCart, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const getRoute = (rol, kind) => {
  if (kind === 'perfil') {
    if (rol === 'cliente') return '/cliente/perfil'
    if (rol === 'tienda') return '/tienda/perfil'
    if (rol === 'repartidor') return '/repartidor/perfil'
    return '/admin'
  }
  if (kind === 'stats') {
    if (rol === 'cliente') return '/cliente/historial'
    if (rol === 'tienda') return '/tienda/estadisticas'
    if (rol === 'repartidor') return '/repartidor/estadisticas'
    return '/admin/reportes'
  }
  if (kind === 'pagos') {
    if (rol === 'tienda') return '/tienda/perfil'
    if (rol === 'repartidor') return '/repartidor/perfil'
    if (rol === 'cliente') return '/cliente/perfil'
    return '/admin'
  }
  return '/'
}

const FloatingMenuButton = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  if (!isAuthenticated) return null

  const totalItems = items?.reduce((total, item) => total + item.quantity, 0) || 0

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'cliente': return 'text-blue-400'
      case 'tienda': return 'text-green-400'
      case 'repartidor': return 'text-purple-400'
      case 'administrador': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRoleName = (role) => {
    switch (role) {
      case 'cliente': return 'Cliente'
      case 'tienda': return 'Tienda'
      case 'repartidor': return 'Repartidor'
      case 'administrador': return 'Admin'
      default: return 'Usuario'
    }
  }

  const getDashboardRoute = () => {
    const dashboardRoutes = {
      cliente: '/cliente/dashboard',
      tienda: '/tienda/dashboard',
      repartidor: '/repartidor/dashboard',
      administrador: '/admin/dashboard'
    }
    return dashboardRoutes[user?.rol] || '/dashboard'
  }

  const isAdmin = user.rol === 'administrador'
  const hidden = location.pathname.startsWith('/admin') && isAdmin

  if (hidden) return null

  return (
    <>
      {/* Floating Cart Button (only for clients) */}
      {user?.rol === 'cliente' && (
        <motion.div 
          className="fixed bottom-6 left-6 z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div 
            className="relative cursor-pointer"
            onClick={() => navigate('/cliente/payment-method')}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl">
              <FaShoppingCart className="text-white text-xl" />
            </div>
            {totalItems > 0 && (
              <div className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Floating Menu Button */}
      <div className="fixed top-4 right-4 z-50">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl">
            <FaEllipsisV className="text-white text-xl" />
          </div>
        </motion.div>

        {/* Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 right-0 min-w-[240px] bg-gray-900/95 backdrop-blur-md rounded-lg border border-white/20 shadow-2xl overflow-hidden"
            >
              {/* User Info Header */}
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{user?.nombre}</div>
                    <div className={`text-sm ${getRoleColor(user?.rol)}`}>
                      {getRoleName(user?.rol)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button
                  className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => {
                    navigate(getDashboardRoute())
                    setIsMenuOpen(false)
                  }}
                >
                  <FaCog className="text-lg" />
                  Dashboard
                </button>

                <button
                  className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="text-lg" />
                  Cerrar Sesión
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay to close menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}

export default FloatingMenuButton
