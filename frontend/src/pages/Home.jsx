import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (isAuthenticated) {
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
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(180deg, #2b2b2b 0%, #0f0f0f 45%, #0b0b0b 100%)' }}>
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            {/* Logo */}
            <div className="mb-4">
              <img 
                src="/assets/img/inicio.png" 
                alt="Manda2 Logo"
                className="img-fluid"
                style={{ maxHeight: '250px' }}
              />
            </div>

            {/* Título */}
            <h1 className="display-4 text-white fw-bold mb-4">
              Delivery de comida y productos en minutos
            </h1>

            {/* Descripción */}
            <p className="lead mb-5" style={{ color: '#adb5bd' }}>
              Manda2 conecta clientes, tiendas y repartidores para entregarte lo que necesites, directo a tu puerta, rápido y seguro.
            </p>

            {/* Botón */}
            <Button 
              size="lg" 
              className="btn-manda2-primary px-5 py-3"
              onClick={handleGetStarted}
            >
              Comenzar Ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home