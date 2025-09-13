import React from 'react'
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Button, 
  Avatar, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Badge
} from "@heroui/react"
import { motion } from "framer-motion"
import { FaShoppingCart, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'

const ModernNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()

  const totalItems = items?.reduce((total, item) => total + item.quantity, 0) || 0

  const handleLogout = () => {
    logout()
    navigate('/')
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

  return (
    <div className="hidden md:block">
      <Navbar 
        className="bg-black/90 backdrop-blur-md border-b border-gray-800/50"
        height="80px"
        maxWidth="full"
      >
      {/* Brand */}
      <NavbarBrand>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img 
            src="/images/yega-light.svg" 
            alt="YEGA" 
            className="h-10" 
          />
        </motion.div>
      </NavbarBrand>

      {/* Right Content */}
      <NavbarContent justify="end">
        {isAuthenticated && (
          <>
            {/* Cart Icon (only for clients) */}
            {user?.rol === 'cliente' && (
              <NavbarItem>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Badge 
                    content={totalItems} 
                    color="default" 
                    isInvisible={totalItems === 0}
                    className="text-black font-bold bg-white"
                  >
                    <Button
                      isIconOnly
                      variant="light"
                      className="text-gray-300 hover:text-white"
                      onClick={() => navigate('/cliente/payment-method')}
                    >
                      <FaShoppingCart className="text-xl" />
                    </Button>
                  </Badge>
                </motion.div>
              </NavbarItem>
            )}

            {/* User Menu */}
            <NavbarItem>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Avatar
                      isBordered
                      color="default"
                      size="sm"
                      src={user?.avatar}
                      fallback={
                        <FaUser className="text-gray-400" />
                      }
                      className="cursor-pointer border-gray-600"
                    />
                  </motion.div>
                </DropdownTrigger>
                
                <DropdownMenu 
                  aria-label="Profile Actions" 
                  variant="flat"
                  className="bg-gray-900/95 backdrop-blur-md border border-gray-700"
                >
                  <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile">
                    <div className="flex flex-col">
                      <span className="text-white font-semibold">{user?.nombre}</span>
                      <span className={`text-sm ${getRoleColor(user?.rol)}`}>
                        {getRoleName(user?.rol)}
                      </span>
                    </div>
                  </DropdownItem>
                  
                  <DropdownItem 
                    key="dashboard" 
                    className="text-gray-300 hover:text-white"
                    startContent={<FaCog className="text-lg" />}
                    onClick={() => {
                      const dashboardRoutes = {
                        cliente: '/cliente/dashboard',
                        tienda: '/tienda/dashboard',
                        repartidor: '/repartidor/dashboard',
                        administrador: '/admin/dashboard'
                      }
                      navigate(dashboardRoutes[user?.rol] || '/dashboard')
                    }}
                  >
                    Dashboard
                  </DropdownItem>
                  
                  <DropdownItem 
                    key="logout" 
                    className="text-red-400 hover:text-red-300"
                    color="danger"
                    startContent={<FaSignOutAlt className="text-lg" />}
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </>
        )}

        {/* Login/Register buttons for guests */}
        {!isAuthenticated && (
          <>
            <NavbarItem>
              <Button 
                variant="light" 
                className="text-gray-300 hover:text-white"
                onClick={() => navigate('/login')}
              >
                Iniciar Sesión
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button 
                className="bg-gradient-to-r from-gray-200 to-white text-black font-semibold"
                onClick={() => navigate('/register')}
              >
                Registrarse
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  )
}

export default ModernNavbar