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
    <Container className="py-4">
      <h2 className="text-yega-gold text-center mb-4">Perfil de Repartidor</h2>
      <Row>
        <Col lg={6}>
          <Card className="card-yega mb-4">
            <Card.Body>
              <h4 className="text-yega-gold mb-3">Información personal</h4>
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">Nombre completo</Form.Label>
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
                
                <h5 className="text-yega-gold mt-4 mb-3">Información del vehículo</h5>
                
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">Tipo de vehículo</Form.Label>
                  <Form.Select
                    name="tipo"
                    value={form.vehiculo.tipo}
                    onChange={handleVehiculoChange}
                    className="form-control-yega"
                  >
                    <option value="moto">Motocicleta</option>
                    <option value="bicicleta">Bicicleta</option>
                    <option value="auto">Automóvil</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">Marca</Form.Label>
                  <Form.Control 
                    name="marca"
                    value={form.vehiculo.marca} 
                    onChange={handleVehiculoChange} 
                    className="form-control-yega" 
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">Modelo</Form.Label>
                  <Form.Control 
                    name="modelo"
                    value={form.vehiculo.modelo} 
                    onChange={handleVehiculoChange} 
                    className="form-control-yega" 
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-yega">Color</Form.Label>
                      <Form.Control 
                        name="color"
                        value={form.vehiculo.color} 
                        onChange={handleVehiculoChange} 
                        className="form-control-yega" 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-yega">Placa</Form.Label>
                      <Form.Control 
                        name="placa"
                        value={form.vehiculo.placa} 
                        onChange={handleVehiculoChange} 
                        className="form-control-yega"
                        placeholder="XXX-000" 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Button 
                  type="submit" 
                  className="btn-yega-primary mt-2" 
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
  )
}

export default RepartidorPerfil
