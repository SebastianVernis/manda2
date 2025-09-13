import React from 'react'
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useAuth } from '../context/AuthContext'
import { FaUser, FaShoppingCart, FaTruck, FaCog, FaSignOutAlt } from 'react-icons/fa'

const CustomNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const getRoleIcon = (rol) => {
    switch (rol) {
      case 'cliente':
        return <FaShoppingCart className="me-1" />
      case 'tienda':
        return <FaCog className="me-1" />
      case 'repartidor':
        return <FaTruck className="me-1" />
      case 'administrador':
        return <FaUser className="me-1" />
      default:
        return <FaUser className="me-1" />
    }
  }

  const getRoleName = (rol) => {
    const roles = {
      cliente: 'Cliente',
      tienda: 'Tienda',
      repartidor: 'Repartidor',
      administrador: 'Administrador'
    }
    return roles[rol] || rol
  }

  return (
    <Navbar expand="lg" className="navbar-yega" variant="dark">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img 
              src="/images/yega-light.svg" 
              alt="YEGA" 
              height="30" 
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!isAuthenticated && (
              <>
                <LinkContainer to="/">
                  <Nav.Link>Inicio</Nav.Link>
                </LinkContainer>
              </>
            )}
            
            {isAuthenticated && (
              <>
                <LinkContainer to="/dashboard">
                  <Nav.Link>Dashboard</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>

          <Nav>
            {!isAuthenticated ? (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Iniciar Sesión</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Registrarse</Nav.Link>
                </LinkContainer>
              </>
            ) : (
              <NavDropdown
                title={
                  <span>
                    {getRoleIcon(user.rol)}
                    {user.nombre}
                    <Badge bg="secondary" className="ms-2">
                      {getRoleName(user.rol)}
                    </Badge>
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item>
                  <FaUser className="me-2" />
                  {user.email}
                </NavDropdown.Item>
                
                <NavDropdown.Divider />
                
                <LinkContainer to="/profile">
                  <NavDropdown.Item>
                    <FaCog className="me-2" />
                    Mi Perfil
                  </NavDropdown.Item>
                </LinkContainer>
                
                <NavDropdown.Divider />
                
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default CustomNavbar
