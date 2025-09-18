// frontend/src/pages/Tienda/Dashboard.jsx
import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { LinkContainer } from 'react-router-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { FaBox, FaList, FaShoppingCart, FaChartLine, FaStore } from 'react-icons/fa'
import ModernNavbar from '../../components/modern/ModernNavbar'

const TiendaDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <ModernNavbar />
      
      <Container className="py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <FaStore className="text-orange-400" />
            ¡Bienvenido, {user?.nombre}!
          </h1>
          <p className="text-gray-400 text-lg">Panel de Control de tu Tienda</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Row>
            <Col md={6} lg={3} className="mb-4">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="yega-glass h-100 hover-card-effect">
                  <Card.Body className="text-center p-4">
                    <div className="bg-orange-500 bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                      <FaBox size={32} className="text-orange-400" />
                    </div>
                    <Card.Title className="text-white mb-3">Gestionar Productos</Card.Title>
                    <Card.Text className="text-white-50 mb-4">
                      Agrega, edita o elimina productos de tu catálogo.
                    </Card.Text>
                    <LinkContainer to="/tienda/productos">
                      <Button variant="outline-primary" className="w-100">
                        Ver Productos
                      </Button>
                    </LinkContainer>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            <Col md={6} lg={3} className="mb-4">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Card className="yega-glass h-100 hover-card-effect">
                  <Card.Body className="text-center p-4">
                    <div className="bg-blue-500 bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                      <FaList size={32} className="text-blue-400" />
                    </div>
                    <Card.Title className="text-white mb-3">Pedidos Recibidos</Card.Title>
                    <Card.Text className="text-white-50 mb-4">
                      Revisa y gestiona los pedidos de tus clientes.
                    </Card.Text>
                    <LinkContainer to="/tienda/pedidos">
                      <Button variant="outline-primary" className="w-100">
                        Ver Pedidos
                      </Button>
                    </LinkContainer>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            <Col md={6} lg={3} className="mb-4">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <Card className="yega-glass h-100 hover-card-effect">
                  <Card.Body className="text-center p-4">
                    <div className="bg-green-500 bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                      <FaShoppingCart size={32} className="text-green-400" />
                    </div>
                    <Card.Title className="text-white mb-3">Control de Inventario</Card.Title>
                    <Card.Text className="text-white-50 mb-4">
                      Controla el stock de tus productos disponibles.
                    </Card.Text>
                    <LinkContainer to="/tienda/inventario">
                      <Button variant="outline-primary" className="w-100">
                        Ver Inventario
                      </Button>
                    </LinkContainer>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            <Col md={6} lg={3} className="mb-4">
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <Card className="yega-glass h-100 hover-card-effect">
                  <Card.Body className="text-center p-4">
                    <div className="bg-purple-500 bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                      <FaChartLine size={32} className="text-purple-400" />
                    </div>
                    <Card.Title className="text-white mb-3">Estadísticas</Card.Title>
                    <Card.Text className="text-white-50 mb-4">
                      Analiza tus ventas y rendimiento.
                    </Card.Text>
                    <LinkContainer to="/tienda/estadisticas">
                      <Button variant="outline-primary" className="w-100">
                        Ver Reportes
                      </Button>
                    </LinkContainer>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
      </Row>

          <Row className="mt-4">
            <Col>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="yega-glass">
                  <Card.Header className="border-0 bg-transparent">
                    <h5 className="mb-0 text-white">Información de la Tienda</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <p className="text-white-50"><strong className="text-white">Nombre:</strong> {user?.nombre}</p>
                        <p className="text-white-50"><strong className="text-white">Email:</strong> {user?.email}</p>
                      </Col>
                      <Col md={6}>
                        <p className="text-white-50"><strong className="text-white">Teléfono:</strong> {user?.telefono}</p>
                        <p className="text-white-50"><strong className="text-white">Rol:</strong> Tienda</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </motion.div>
      </Container>
    </div>
  )
}

export default TiendaDashboard
