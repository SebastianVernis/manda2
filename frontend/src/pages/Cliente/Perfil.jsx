import React, { useState } from 'react'
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { FaUser, FaPhone, FaEnvelope } from 'react-icons/fa'

const ClientePerfil = () => {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({ 
    nombre: user?.nombre || '', 
    telefono: user?.telefono || '',
    preferencias: user?.preferencias || {
      notificaciones_email: true,
      notificaciones_sms: true,
      guardado_info_pago: false
    }
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handlePreferenciaChange = (e) => {
    setForm({
      ...form,
      preferencias: {
        ...form.preferencias,
        [e.target.name]: e.target.checked
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
      <h2 className="text-yega-gold text-center mb-4">Mi Perfil</h2>
      <Row className="justify-content-center">
        <Col md={8} lg={7}>
          <Card className="card-yega">
            <Card.Body>
              <div className="text-center mb-4">
                <div className="user-avatar-container mb-2">
                  <div className="user-avatar">
                    <FaUser size={48} />
                  </div>
                </div>
                <h5 className="text-yega-gold">{user?.email}</h5>
                <div className="text-muted small">Cliente desde {new Date(user?.createdAt).toLocaleDateString()}</div>
              </div>
              
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">Nombre completo</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-dark text-white">
                      <FaUser />
                    </span>
                    <Form.Control 
                      name="nombre"
                      value={form.nombre} 
                      onChange={handleChange}
                      placeholder="Tu nombre completo" 
                      className="form-control-yega" 
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">Teléfono</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-dark text-white">
                      <FaPhone />
                    </span>
                    <Form.Control 
                      name="telefono"
                      value={form.telefono} 
                      onChange={handleChange}
                      placeholder="Tu número de teléfono" 
                      className="form-control-yega" 
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label className="form-label-yega">Correo electrónico</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark border-dark text-white">
                      <FaEnvelope />
                    </span>
                    <Form.Control 
                      value={user?.email} 
                      disabled
                      className="form-control-yega" 
                    />
                  </div>
                  <Form.Text className="text-muted">
                    El correo electrónico no se puede modificar
                  </Form.Text>
                </Form.Group>
                
                <h5 className="text-yega-gold mt-4 mb-3">Preferencias</h5>
                
                <Form.Group className="mb-2">
                  <Form.Check 
                    type="switch"
                    id="notificaciones_email"
                    name="notificaciones_email"
                    label="Recibir notificaciones por email"
                    checked={form.preferencias.notificaciones_email}
                    onChange={handlePreferenciaChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Check 
                    type="switch"
                    id="notificaciones_sms"
                    name="notificaciones_sms"
                    label="Recibir notificaciones por SMS"
                    checked={form.preferencias.notificaciones_sms}
                    onChange={handlePreferenciaChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check 
                    type="switch"
                    id="guardado_info_pago"
                    name="guardado_info_pago"
                    label="Guardar información de pago para futuros pedidos"
                    checked={form.preferencias.guardado_info_pago}
                    onChange={handlePreferenciaChange}
                  />
                </Form.Group>
                
                <div className="d-grid mt-4">
                  <Button 
                    type="submit" 
                    className="btn-yega-primary" 
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ClientePerfil

