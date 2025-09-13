import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useLocationCheck } from '../hooks/useLocationCheck'
import { useNavigate } from 'react-router-dom'
import HeroSection from '../components/modern/HeroSection'


const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  useLocationCheck() // Verificar ubicación al cargar la pantalla

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Redirigir al dashboard según el rol
      const dashboardRoutes = {
        cliente: '/cliente/dashboard',
        tienda: '/tienda/dashboard', 
        repartidor: '/repartidor/dashboard',
        administrador: '/admin/dashboard'
      }
      navigate(dashboardRoutes[user?.rol] || '/cliente/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <HeroSection onGetStarted={handleGetStarted} />
    </div>
  )
}

export default Home