// frontend/src/pages/Admin/Dashboard.jsx
import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { FaUsers, FaStore, FaMotorcycle, FaChartLine } from 'react-icons/fa'

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-yega-gold">¡Bienvenido, {user?.nombre}!</h2>
          <p className="text-muted">Administrador - Panel de Control</p>
        </Col>
      </Row>

      <Row>
        <Col md={6} lg={3} className="mb-4">
          <Card className="card-yega h-100">
            <Card.Body className="text-center">
              <FaUsers size={48} className="text-yega-gold mb-3" />
              <Card.Title>Gestionar Usuarios</Card.Title>
              <Card.Text>
                Administra clientes, tiendas y repartidores registrados.
              </Card.Text>
              <LinkContainer to="/admin/usuarios">
                <Button variant="outline-light" className="btn-yega-primary">
                  Ver Usuarios
                </Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="card-yega h-100">
            <Card.Body className="text-center">
              <FaStore size={48} className="text-yega-gold mb-3" />
              <Card.Title>Gestionar Tiendas</Card.Title>
              <Card.Text>
                Aprueba o rechaza solicitudes de nuevas tiendas.
              </Card.Text>
              <LinkContainer to="/admin/tiendas">
                <Button variant="outline-light" className="btn-yega-primary">
                  Ver Tiendas
                </Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="card-yega h-100">
            <Card.Body className="text-center">
              <FaMotorcycle size={48} className="text-yega-gold mb-3" />
              <Card.Title>Gestionar Repartidores</Card.Title>
              <Card.Text>
                Gestiona el registro y estatus de los repartidores.
              </Card.Text>
              <LinkContainer to="/admin/repartidores">
                <Button variant="outline-light" className="btn-yega-primary">
                  Ver Repartidores
                </Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="card-yega h-100">
            <Card.Body className="text-center">
              <FaChartLine size={48} className="text-yega-gold mb-3" />
              <Card.Title>Estadísticas Generales</Card.Title>
              <Card.Text>
                Monitorea el rendimiento general de la plataforma.
              </Card.Text>
              <LinkContainer to="/admin/reportes">
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
              <h5 className="mb-0">Información del Administrador</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Nombre:</strong> {user?.nombre}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Teléfono:</strong> {user?.telefono}</p>
                  <p><strong>Rol:</strong> Administrador</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AdminDashboard
