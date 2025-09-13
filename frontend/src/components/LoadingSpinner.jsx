import React from 'react'
import { Spinner, Container, Row, Col } from 'react-bootstrap'

const LoadingSpinner = ({ 
  size = 'lg', 
  text = 'Cargando...', 
  fullScreen = false,
  variant = 'warning' 
}) => {
  const content = (
    <div className="text-center">
      <Spinner 
        animation="border" 
        variant={variant} 
        size={size}
        className="mb-3"
      />
      {text && (
        <div className="text-muted">
          {text}
        </div>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center min-vh-100">
        <Row>
          <Col>
            {content}
          </Col>
        </Row>
      </Container>
    )
  }

  return content
}

export default LoadingSpinner
