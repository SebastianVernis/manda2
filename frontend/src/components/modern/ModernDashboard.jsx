import React from 'react'
import { Card, CardBody, Button, Chip } from "@heroui/react"
import { motion } from "framer-motion"
import { FaShoppingCart, FaList, FaMapMarkerAlt, FaHistory, FaClock, FaStar } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useLocationCheck } from '../../hooks/useLocationCheck'
import LocationAlert from '../LocationAlert'
const ModernDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  useLocationCheck()

  const dashboardCards = [
    {
      title: "Explorar Tiendas",
      description: "Descubre tiendas cercanas y sus productos",
      icon: <FaShoppingCart className="text-3xl" />,
      color: "from-blue-500 to-blue-600",
      route: "/cliente/tiendas",
      comingSoon: false
    },
    {
      title: "Mi Carrito", 
      description: "Revisa y modifica tu carrito actual",
      icon: <FaList className="text-3xl" />,
      color: "from-green-500 to-green-600",
      route: "/cliente/checkout",
      comingSoon: false
    },
    {
      title: "Mis Pedidos",
      description: "Historial y seguimiento de pedidos",
      icon: <FaHistory className="text-3xl" />,
      color: "from-purple-500 to-purple-600",
      route: "/cliente/pedidos",
      comingSoon: false
    },
    {
      title: "Mi Perfil",
      description: "Configuración y datos personales",
      icon: <FaMapMarkerAlt className="text-3xl" />,
      color: "from-orange-500 to-orange-600",
      route: "/cliente/perfil",
      comingSoon: false
    }
  ]

  const recentActivity = [
    {
      title: "Pedido #YEGA-000123",
      description: "Pizza Italiana - $285.00",
      time: "Hace 2 horas",
      status: "entregado",
      icon: <FaShoppingCart />
    },
    {
      title: "Pedido #YEGA-000122", 
      description: "Hamburguesa Clásica - $150.00",
      time: "Ayer",
      status: "entregado",
      icon: <FaShoppingCart />
    },
    {
      title: "Perfil actualizado",
      description: "Dirección de entrega modificada",
      time: "Hace 3 días",
      status: "completed",
      icon: <FaMapMarkerAlt />
    }
  ]

  const getStatusChip = (status) => {
    switch (status) {
      case 'entregado':
        return <Chip color="success" variant="flat" size="sm">Entregado</Chip>
      case 'en_camino':
        return <Chip color="warning" variant="flat" size="sm">En camino</Chip>
      case 'completed':
        return <Chip color="primary" variant="flat" size="sm">Completado</Chip>
      default:
        return <Chip variant="flat" size="sm">{status}</Chip>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <ModernNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            ¡Hola, <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{user?.nombre}!</span>
          </h1>
          <p className="text-gray-400 text-lg">¿Qué te gustaría pedir hoy?</p>
        </motion.div>

        {/* Location Alert */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <LocationAlert />
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {dashboardCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card 
                className="h-full yega-glass hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                onClick={() => !card.comingSoon && navigate(card.route)}
              >
                <CardBody className="p-6 text-center relative">
                  {card.comingSoon && (
                    <Chip 
                      color="warning" 
                      variant="flat" 
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      Próximamente
                    </Chip>
                  )}
                  
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${card.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {card.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm">
                    {card.description}
                  </p>
                  
                  {!card.comingSoon && (
                    <Button
                      className="mt-4 bg-gradient-to-r from-gray-200 to-white text-black font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      size="sm"
                    >
                      Ir ahora
                    </Button>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaClock className="text-gray-400" />
            Actividad Reciente
          </h2>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className="yega-glass hover:bg-white/5 transition-all duration-300">
                  <CardBody className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white">
                          {activity.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{activity.title}</h4>
                          <p className="text-gray-400 text-sm">{activity.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusChip(activity.status)}
                        <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
        >
          <Card className="yega-glass">
            <CardBody className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">12</div>
              <div className="text-gray-300">Pedidos Totales</div>
            </CardBody>
          </Card>
          
          <Card className="yega-glass">
            <CardBody className="p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">$2,450</div>
              <div className="text-gray-300">Total Gastado</div>
            </CardBody>
          </Card>
          
          <Card className="yega-glass">
            <CardBody className="p-6 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <FaStar className="text-white" />
                <span className="text-3xl font-bold text-white">4.8</span>
              </div>
              <div className="text-gray-300">Calificación Promedio</div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ModernDashboard