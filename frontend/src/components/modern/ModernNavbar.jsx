import React from 'react'
import {
  Navbar,
  Container,
  Nav,
  Button,
  Image,
  Dropdown,
  Badge
} from 'react-bootstrap'
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
        expand="lg"
        className="bg-black/90 backdrop-blur-md border-b border-gray-800/50"
        style={{ height: '80px' }}
      >
        <Container fluid className="d-flex justify-content-between align-items-center">
          {/* Brand */}
          <Navbar.Brand>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <img 
                src="/images/yega-light.svg" 
                alt="YEGA" 
                className="h-10" 
                style={{ height: '40px' }}
              />
            </motion.div>
          </Navbar.Brand>

          {/* Right Content */}
          <Nav className="ms-auto d-flex align-items-center">
            {isAuthenticated && (
              <>
                {/* Cart Icon (only for clients) */}
                {user?.rol === 'cliente' && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="link"
                      className="text-gray-300 hover:text-white position-relative"
                      onClick={() => navigate('/cliente/payment-method')}
                    >
                      <FaShoppingCart className="text-xl" />
                      {totalItems > 0 && (
                        <Badge 
                          bg="light" 
                          text="dark"
                          className="position-absolute top-0 start-100 translate-middle rounded-pill"
                        >
                          {totalItems}
                        </Badge>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* User Menu */}
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    variant="link" 
                    id="user-dropdown"
                    className="text-decoration-none p-0 border-0"
                  >
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <div className="d-flex align-items-center gap-2">
                        <div 
                          className="rounded-circle bg-gray-600 d-flex align-items-center justify-content-center"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <FaUser className="text-gray-400" />
                        </div>
                      </div>
                    </motion.div>
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu 
                    className="bg-gray-900/95 backdrop-blur-md border-gray-700"
                    style={{ minWidth: '200px' }}
                  >
                    <Dropdown.ItemText>
                      <div className="flex flex-col">
                        <span className="text-white font-semibold">{user?.nombre}</span>
                        <span className={`text-sm ${getRoleColor(user?.rol)}`}>
                          {getRoleName(user?.rol)}
                        </span>
                      </div>
                    </Dropdown.ItemText>
                    
                    <Dropdown.Divider />
                    
                    <Dropdown.Item 
                      className="text-gray-300 hover:text-white"
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
                      <FaCog className="me-2" />
                      Dashboard
                    </Dropdown.Item>
                    
                    <Dropdown.Item 
                      className="text-red-400 hover:text-red-300"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="me-2" />
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}

            {/* Login/Register buttons for guests */}
            {!isAuthenticated && (
              <>
                <Button 
                  variant="link" 
                  className="text-gray-300 hover:text-white text-decoration-none"
                  onClick={() => navigate('/login')}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  className="bg-gradient-to-r from-gray-200 to-white text-black font-semibold ms-2"
                  onClick={() => navigate('/register')}
                >
                  Registrarse
                </Button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  )
}

export default ModernNavbar