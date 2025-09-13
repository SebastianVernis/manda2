import React, { useState } from 'react'
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import DocumentUploader from '../../components/DocumentUploader'
import { useCurrentLocation } from '../../hooks/useCurrentLocation'
import { FaMapMarkerAlt } from 'react-icons/fa'

const TiendaPerfil = () => {
  const { user, updateProfile } = useAuth()
  const v = user?.verificaciones || {}
  const [form, setForm] = useState({ 
    nombre: user?.nombre || '', 
    telefono: user?.telefono || '',
    descripcion: user?.descripcion || '',
    horario: user?.horario || ''
  })
  const [saving, setSaving] = useState(false)
  const { currentPosition, getPosition, positionError } = useCurrentLocation()
  const [locationUpdated, setLocationUpdated] = useState(false)

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const updateLocation = async () => {
    await getPosition()
    setLocationUpdated(true)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const profileData = { ...form }
      
      if (locationUpdated && currentPosition) {
        profileData.ubicacion = {
          latitud: currentPosition.latitude,
          longitud: currentPosition.longitude
        }
      }
      
      await updateProfile(profileData)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="py-4">
      <h2 className="text-yega-gold text-center mb-4">Perfil de Tienda</h2>
      <Row>
        <Col lg={6}>
          <Card className="card-yega mb-4">
            <Card.Body>
              <h4 className="text-yega-gold mb-3">Información de la tienda</h4>
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">Nombre de la tienda</Form.Label>
                  <Form.Control 
                    name="nombre"
                    value={form.nombre} 
                    onChange={handleChange} 
                    className="form-control-yega" 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">Teléfono</Form.Label>
                  <Form.Control 
                    name="telefono"
                    value={form.telefono} 
                    onChange={handleChange} 
                    className="form-control-yega" 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">Descripción</Form.Label>
                  <Form.Control 
                    as="textarea"
                    name="descripcion"
                    value={form.descripcion} 
                    onChange={handleChange} 
                    className="form-control-yega"
                    placeholder="Describe tu negocio en pocas palabras" 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">Horario</Form.Label>
                  <Form.Control 
                    name="horario"
                    value={form.horario} 
                    onChange={handleChange} 
                    className="form-control-yega"
                    placeholder="Ej: Lun-Vie 9:00-18:00, Sáb 10:00-14:00" 
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="form-label-yega">Ubicación</Form.Label>
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      {user?.ubicacion ? (
                        <div className="text-success small mb-2">
                          Ubicación actual: {user.ubicacion.latitud.toFixed(6)}, {user.ubicacion.longitud.toFixed(6)}
                        </div>
                      ) : (
                        <div className="text-warning small mb-2">No has configurado tu ubicación</div>
                      )}
                      
                      {locationUpdated && currentPosition && (
                        <div className="text-info small mb-2">
                          Nueva ubicación: {currentPosition.latitude.toFixed(6)}, {currentPosition.longitude.toFixed(6)}
                        </div>
                      )}
                      
                      {positionError && (
                        <div className="text-danger small mb-2">{positionError}</div>
                      )}
                    </div>
                    <Button 
                      type="button" 
                      variant="outline-success"
                      onClick={updateLocation}
                      className="d-flex align-items-center"
                    >
                      <FaMapMarkerAlt className="me-1" /> Actualizar
                    </Button>
                  </div>
                </Form.Group>
                
                <Button 
                  type="submit" 
                  className="btn-yega-primary" 
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card className="card-yega">
            <Card.Body className="text-center">
              <h4 className="text-yega-gold mb-3">Documentos de verificación</h4>
              <div className="mb-3">Sube la documentación para validar tu cuenta.</div>
              <DocumentUploader tipo="id_doc" label="Identificación oficial" current={v.id_doc} />
              <DocumentUploader tipo="comprobante_domicilio" label="Comprobante de domicilio" current={v.comprobante_domicilio} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default TiendaPerfil
