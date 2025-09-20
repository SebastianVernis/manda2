import React from 'react'
import { Button } from 'react-bootstrap'

const HomeTest = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(180deg, #2b2b2b 0%, #0f0f0f 45%, #0b0b0b 100%)' }}>
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8">
            {/* Logo */}
            <div className="mb-4">
              <img 
                src="/assets/img/inicio.png" 
                alt="YEGA Logo"
                className="img-fluid"
                style={{ maxHeight: '120px' }}
              />
            </div>

            {/* Título */}
            <h1 className="display-4 text-white fw-bold mb-4">
              Delivery de comida y productos en minutos
            </h1>

            {/* Descripción */}
            <p className="lead mb-5" style={{ color: '#adb5bd' }}>
              YEGA conecta clientes, tiendas y repartidores para entregarte lo que necesites.
            </p>

            {/* Botón */}
            <Button size="lg" className="btn-primary">
              Comenzar Ahora
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeTest