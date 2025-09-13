import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaHome } from 'react-icons/fa'
import { motion } from 'framer-motion'

const getDashboardPath = (rol) => {
  switch (rol) {
    case 'cliente':
      return '/cliente/tiendas'
    case 'tienda':
      return '/tienda'
    case 'repartidor':
      return '/repartidor'
    case 'administrador':
      return '/admin'
    default:
      return '/dashboard'
  }
}

const ReturnHomeButton = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  if (!user) return null

  const target = getDashboardPath(user.rol)
  const isOnTarget = location.pathname === target

  const handleClick = () => {
    navigate(target)
  }

  return (
    <motion.div 
      className="fixed top-4 left-4 z-40"
      whileHover={!isOnTarget ? { scale: 1.1 } : {}}
      whileTap={!isOnTarget ? { scale: 0.9 } : {}}
    >
      <button
        type="button"
        aria-label="Ir al dashboard"
        title="Ir al dashboard"
        onClick={handleClick}
        disabled={isOnTarget}
        className={`w-14 h-14 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl transition-all duration-200 ${
          isOnTarget 
            ? 'bg-white/10 text-gray-500 cursor-default' 
            : 'bg-gradient-to-br from-gray-800 to-black text-white hover:from-gray-700 hover:to-gray-900 cursor-pointer'
        }`}
      >
        <FaHome className="text-xl" />
      </button>
    </motion.div>
  )
}

export default ReturnHomeButton
