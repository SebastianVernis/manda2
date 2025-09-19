import React, { useState } from 'react'
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { FaUser, FaPhone, FaEnvelope } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'


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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Container className="py-4" style={{paddingTop: '3rem'}}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <FaUser className="text-blue-400" />
            Mi Perfil
          </h1>
          <p className="text-gray-400 text-lg">Gestiona tu información personal</p>
        </motion.div>
        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="yega-glass">
                <Card.Body className="p-4">
                  <div className="text-center mb-5">
                    <div className="bg-primary bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 overflow-hidden" style={{width: '100px', height: '100px'}}>
                      <img 
                        src="/images/profile-cliente.png" 
                        alt="Perfil Cliente"
                        style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%'}}
                      />
                    </div>
                    <h4 className="text-white mb-2">{user?.email}</h4>
                    <div className="text-white-50 small">
                      Cliente desde {new Date(user?.createdAt).toLocaleDateString()}
                    </div>
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
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ClientePerfil

