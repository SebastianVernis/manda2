import React, { useState } from 'react'
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

const RepartidorVehiculo = () => {
  const { user, updateProfile } = useAuth()
  const [vehiculo, setVehiculo] = useState(user?.vehiculo || { tipo: '', marca: '', modelo: '', placa: '', color: '', anio: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const onGuardar = async (e) => {
    e.preventDefault()
    setError('')
    if (!vehiculo.tipo) { setError('Selecciona un tipo de vehículo'); return }
    if (vehiculo.tipo !== 'bici' && !vehiculo.placa) { setError('Ingresa placa (no requerida para bici)'); return }
    setSaving(true)
    try {
      await updateProfile({ vehiculo })
      window.location.assign('/repartidor')
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container className="py-4">
      <h2 className="text-yega-gold">Datos del Vehículo</h2>
      <Card className="card-yega mt-3">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={onGuardar}>
            <Row className="g-3">
              <Col md={3}>
                <Form.Label className="form-label-yega">Tipo</Form.Label>
                <Form.Select value={vehiculo.tipo} onChange={(e)=> setVehiculo({...vehiculo, tipo: e.target.value})} className="form-control-yega">
                  <option value="">Seleccionar</option>
                  <option value="moto">Moto</option>
                  <option value="auto">Auto</option>
                  <option value="bici">Bici</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label className="form-label-yega">Marca</Form.Label>
                <Form.Control value={vehiculo.marca||''} onChange={(e)=> setVehiculo({...vehiculo, marca: e.target.value})} className="form-control-yega" />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label-yega">Modelo</Form.Label>
                <Form.Control value={vehiculo.modelo||''} onChange={(e)=> setVehiculo({...vehiculo, modelo: e.target.value})} className="form-control-yega" />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label-yega">Año</Form.Label>
                <Form.Control value={vehiculo.anio||''} onChange={(e)=> setVehiculo({...vehiculo, anio: e.target.value})} className="form-control-yega" />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label-yega">Placa</Form.Label>
                <Form.Control value={vehiculo.placa||''} onChange={(e)=> setVehiculo({...vehiculo, placa: e.target.value})} className="form-control-yega" />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label-yega">Color</Form.Label>
                <Form.Control value={vehiculo.color||''} onChange={(e)=> setVehiculo({...vehiculo, color: e.target.value})} className="form-control-yega" />
              </Col>
            </Row>
            <div className="mt-3">
              <Button type="submit" className="btn-yega-primary" disabled={saving}>{saving?'Guardando...':'Guardar y continuar'}</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default RepartidorVehiculo

