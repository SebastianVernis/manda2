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
                <Card className="card-yega h-100">
                  <Card.Body className="text-center">
                    <FaBox size={48} className="text-yega-gold mb-3" />
                    <Card.Title>Gestionar Productos</Card.Title>
                    <Card.Text>
                      Agrega, edita o elimina productos de tu catálogo.
                    </Card.Text>
                    <LinkContainer to="/tienda/productos">
                      <Button variant="outline-light" className="btn-yega-primary">
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
                <Card className="card-yega h-100">
                  <Card.Body className="text-center">
                    <FaList size={48} className="text-yega-gold mb-3" />
                    <Card.Title>Pedidos Recibidos</Card.Title>
                    <Card.Text>
                      Revisa y gestiona los pedidos de tus clientes.
                    </Card.Text>
                    <LinkContainer to="/tienda/pedidos">
                      <Button variant="outline-light" className="btn-yega-primary">
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
                <Card className="card-yega h-100">
                  <Card.Body className="text-center">
                    <FaShoppingCart size={48} className="text-yega-gold mb-3" />
                    <Card.Title>Control de Inventario</Card.Title>
                    <Card.Text>
                      Controla el stock de tus productos disponibles.
                    </Card.Text>
                    <LinkContainer to="/tienda/inventario">
                      <Button variant="outline-light" className="btn-yega-primary">
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
                <Card className="card-yega h-100">
                  <Card.Body className="text-center">
                    <FaChartLine size={48} className="text-yega-gold mb-3" />
                    <Card.Title>Estadísticas</Card.Title>
                    <Card.Text>
                      Analiza tus ventas y rendimiento.
                    </Card.Text>
                    <LinkContainer to="/tienda/estadisticas">
                      <Button variant="outline-light" className="btn-yega-primary">
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
