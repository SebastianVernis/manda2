// frontend/src/pages/Tienda/Dashboard.jsx
import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { FaBox, FaList, FaShoppingCart, FaChartLine } from 'react-icons/fa'

const TiendaDashboard = () => {
  const { user } = useAuth()

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-yega-gold">¡Bienvenido, {user?.nombre}!</h2>
          <p className="text-muted">Tienda - Panel de Control</p>
        </Col>
      </Row>

      <Row>
        <Col md={6} lg={3} className="mb-4">
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
        </Col>

        <Col md={6} lg={3} className="mb-4">
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
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="card-yega h-100">
            <Card.Body className="text-center">
              <FaShoppingCart size={48} className="text-yega-gold mb-3" />
              <Card.Title>Inventario</Card.Title>
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
        </Col>

        <Col md={6} lg={3} className="mb-4">
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
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="card-yega">
            <Card.Header>
              <h5 className="mb-0">Información de la Tienda</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Nombre:</strong> {user?.nombre}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Teléfono:</strong> {user?.telefono}</p>
                  <p><strong>Rol:</strong> Tienda</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default TiendaDashboard
