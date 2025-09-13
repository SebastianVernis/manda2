import React from 'react'
import { Button, Card, CardBody } from "@heroui/react"
import { motion } from "framer-motion"
import { FaShoppingCart, FaTruck, FaStore } from 'react-icons/fa'
import { Link } from 'react-router-dom' // Importar Link

const HeroSection = ({ onGetStarted }) => {
  const features = [
    {
      icon: <FaShoppingCart className="text-2xl" />,
      title: "Compra Fácil",
      description: "Miles de productos a tu alcance"
    },
    {
      icon: <FaTruck className="text-2xl" />,
      title: "Entrega Rápida",
      description: "Delivery en menos de 30 minutos"
    },
    {
      icon: <FaStore className="text-2xl" />,
      title: "Tiendas Locales",
      description: "Apoya a comercios de tu zona"
    }
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(192,192,192,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.05),transparent_50%)]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-gray-400/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-white/8 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="flex flex-col items-center text-center">
          {/* Logo and H1 Section */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center mb-6">
              <img 
                src="/images/yega-light.svg" 
                alt="YEGA Logo"
                height="120" 
                width="auto"
                className="drop-shadow-2xl"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Delivery de comida y productos en minutos
            </h1>
            <h2 className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
              YEGA conecta clientes, tiendas y repartidores para entregarte lo que necesites, directo a tu puerta, rápido y seguro.
            </h2>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-gray-200 to-white text-black font-semibold px-12 py-6 text-lg rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-white/25"
              onPress={onGetStarted}
              as={Link} // Usar el componente Link
              to="/login" // Enlace para SEO
            >
              Comenzar Ahora
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <Card className="yega-glass hover:bg-white/10 transition-all duration-300 group h-full">
                  <CardBody className="text-center p-8">
                    <div className="flex justify-center mb-4 text-gray-300 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Internal Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center"
          >
            <p className="text-gray-400 mb-4">O explora nuestras secciones:</p>
            <div className="flex justify-center gap-4 md:gap-8">
              <Link to="/cliente/tiendas" className="text-gray-300 hover:text-white transition-colors">Explorar Tiendas</Link>
              <Link to="/register" className="text-gray-300 hover:text-white transition-colors">Únete como Tienda</Link>
              <Link to="/register" className="text-gray-300 hover:text-white transition-colors">Únete como Repartidor</Link>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

export default HeroSection