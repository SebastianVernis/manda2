import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer-yega mt-auto">
      <Container>
        <Row>
          <Col md={4} className="mb-4">
            <img 
              src="/images/yega-light.svg" 
              alt="YEGA" 
              height="40" 
              className="mb-3" 
            />
            <p className="mb-3">
              Tu plataforma de delivery que conecta clientes, tiendas y repartidores 
              de manera eficiente y segura.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-decoration-none">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-decoration-none">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-decoration-none">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-decoration-none">
                <FaLinkedin size={20} />
              </a>
            </div>
          </Col>

          <Col md={2} className="mb-4">
            <h6 className="text-yega-silver mb-3">Enlaces</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/" className="text-decoration-none">Inicio</a>
              </li>
              <li className="mb-2">
                <a href="/about" className="text-decoration-none">Acerca de</a>
              </li>
              <li className="mb-2">
                <a href="/services" className="text-decoration-none">Servicios</a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="text-decoration-none">Contacto</a>
              </li>
            </ul>
          </Col>

          <Col md={3} className="mb-4">
            <h6 className="text-yega-silver mb-3">Para Negocios</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/register?rol=tienda" className="text-decoration-none">
                  Registra tu Tienda
                </a>
              </li>
              <li className="mb-2">
                <a href="/register?rol=repartidor" className="text-decoration-none">
                  Únete como Repartidor
                </a>
              </li>
              <li className="mb-2">
                <a href="/business-support" className="text-decoration-none">
                  Soporte Empresarial
                </a>
              </li>
              <li className="mb-2">
                <a href="/api-docs" className="text-decoration-none">
                  API para Desarrolladores
                </a>
              </li>
            </ul>
          </Col>

          <Col md={3} className="mb-4">
            <h6 className="text-yega-silver mb-3">Contacto</h6>
            <div className="mb-2">
              <FaPhone className="me-2" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="mb-2">
              <FaEnvelope className="me-2" />
              <span>contacto@yega.com</span>
            </div>
            <div className="mb-2">
              <FaMapMarkerAlt className="me-2" />
              <span>123 Calle Principal, Ciudad</span>
            </div>
          </Col>
        </Row>

        <hr className="my-4" style={{ borderColor: 'var(--color-gray-700)' }} />

        <Row>
          <Col md={6}>
            <p className="mb-0">
              &copy; {currentYear} YEGA. Todos los derechos reservados.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <a href="/privacy" className="text-decoration-none me-3">
              Política de Privacidad
            </a>
            <a href="/terms" className="text-decoration-none">
              Términos de Servicio
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
