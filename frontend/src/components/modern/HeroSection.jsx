import React from 'react'
import { Button, Card } from 'react-bootstrap'
import { FaShoppingCart, FaTruck, FaStore } from 'react-icons/fa'

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
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(180deg, #2b2b2b 0%, #0f0f0f 45%, #0b0b0b 100%)' }}>
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-12">
            {/* Logo */}
            <div className="mb-4">
              <img 
                src="/assets/img/inicio.png" 
                alt="YEGA Logo"
                className="img-fluid mx-auto d-block"
                style={{ maxHeight: '120px' }}
              />
            </div>

            {/* Título */}
            <h1 className="display-4 text-white fw-bold mb-4">
              Delivery de comida y productos en minutos
            </h1>

            {/* Descripción */}
            <p className="lead mb-5" style={{ color: '#adb5bd' }}>
              YEGA conecta clientes, tiendas y repartidores para entregarte lo que necesites, directo a tu puerta, rápido y seguro.
            </p>

            {/* Botón */}
            <Button
              size="lg"
              className="btn-yega-primary mb-5"
              onClick={onGetStarted}
            >
              Comenzar Ahora
            </Button>

            {/* Features */}
            <div className="row g-4 mt-5">
              {features.map((feature, index) => (
                <div key={index} className="col-md-4">
                  <Card className="card-yega h-100">
                    <Card.Body className="text-center">
                      <div className="mb-3 text-yega-silver">
                        {feature.icon}
                      </div>
                      <h5 className="text-white mb-2">{feature.title}</h5>
                      <p style={{ color: '#6c757d' }}>{feature.description}</p>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection