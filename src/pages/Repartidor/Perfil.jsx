import React, { useState } from 'react'
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import DocumentUploader from '../../components/DocumentUploader'

const RepartidorPerfil = () => {
  const { user, updateProfile } = useAuth()
  const v = user?.verificaciones || {}
  const [form, setForm] = useState({ 
    nombre: user?.nombre || '', 
    telefono: user?.telefono || '',
    vehiculo: {
      tipo: user?.vehiculo?.tipo || 'moto',
      marca: user?.vehiculo?.marca || '',
      modelo: user?.vehiculo?.modelo || '',
      color: user?.vehiculo?.color || '',
      placa: user?.vehiculo?.placa || ''
    }
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleVehiculoChange = (e) => {
    setForm({
      ...form, 
      vehiculo: {
        ...form.vehiculo,
        [e.target.name]: e.target.value
      }
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-vh-100 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Container className="py-4">
        <h2 className="text-manda2-gold text-center mb-4">Perfil de Repartidor</h2>
      <Row>
        <Col lg={6}>
          <Card className="card-manda2 mb-4">
            <Card.Body>
              <div className="text-center mb-4">
                <div className="bg-primary bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 overflow-hidden" style={{width: '100px', height: '100px'}}>
                  <img 
                    src="/images/profile-repartidor.png" 
                    alt="Perfil Repartidor"
                    style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%'}}
                  />
                </div>
                <h5 className="text-white mb-1">{user?.nombre}</h5>
                <small className="text-white-50">{user?.email}</small>
              </div>
              <h4 className="text-manda2-gold mb-3">Información personal</h4>
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-manda2">Nombre completo</Form.Label>
                  <Form.Control 
                    name="nombre"
                    value={form.nombre} 
                    onChange={handleChange} 
                    className="form-control-manda2" 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-manda2">Teléfono</Form.Label>
                  <Form.Control 
                    name="telefono"
                    value={form.telefono} 
                    onChange={handleChange} 
                    className="form-control-manda2" 
                  />
                </Form.Group>
                
                <h5 className="text-manda2-gold mt-4 mb-3">Información del vehículo</h5>
                
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-manda2">Tipo de vehículo</Form.Label>
                  <Form.Select
                    name="tipo"
                    value={form.vehiculo.tipo}
                    onChange={handleVehiculoChange}
                    className="form-control-manda2"
                  >
                    <option value="moto">Motocicleta</option>
                    <option value="bicicleta">Bicicleta</option>
                    <option value="auto">Automóvil</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-manda2">Marca</Form.Label>
                  <Form.Control 
                    name="marca"
                    value={form.vehiculo.marca} 
                    onChange={handleVehiculoChange} 
                    className="form-control-manda2" 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-manda2">Modelo</Form.Label>
                  <Form.Control 
                    name="modelo"
                    value={form.vehiculo.modelo} 
                    onChange={handleVehiculoChange} 
                    className="form-control-manda2" 
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-manda2">Color</Form.Label>
                      <Form.Control 
                        name="color"
                        value={form.vehiculo.color} 
                        onChange={handleVehiculoChange} 
                        className="form-control-manda2" 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-manda2">Placa</Form.Label>
                      <Form.Control 
                        name="placa"
                        value={form.vehiculo.placa} 
                        onChange={handleVehiculoChange} 
                        className="form-control-manda2"
                        placeholder="XXX-000" 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Button 
                  type="submit" 
                  className="btn-manda2-primary mt-2" 
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          <Card className="card-manda2">
            <Card.Body className="text-center">
              <h4 className="text-manda2-gold mb-3">Documentos de verificación</h4>
              <div className="mb-3">Sube la documentación requerida para validar tu cuenta.</div>
              <DocumentUploader tipo="id_doc" label="Identificación oficial" current={v.id_doc} />
              <DocumentUploader tipo="licencia" label="Licencia de conducir" current={v.licencia} />
              <DocumentUploader tipo="tarjeta_circulacion" label="Tarjeta de circulación" current={v.tarjeta_circulacion} />
              <DocumentUploader tipo="poliza_seguro" label="Póliza de seguro" current={v.poliza_seguro} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Container>
    </div>
  )
}

export default RepartidorPerfil
