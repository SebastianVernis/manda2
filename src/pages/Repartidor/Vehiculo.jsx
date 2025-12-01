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
    <div className="min-vh-100 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Container className="py-4">
        <h2 className="text-manda2-gold">Datos del Vehículo</h2>
      <Card className="card-manda2 mt-3">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={onGuardar}>
            <Row className="g-3">
              <Col md={3}>
                <Form.Label className="form-label-manda2">Tipo</Form.Label>
                <Form.Select value={vehiculo.tipo} onChange={(e)=> setVehiculo({...vehiculo, tipo: e.target.value})} className="form-control-manda2">
                  <option value="">Seleccionar</option>
                  <option value="moto">Moto</option>
                  <option value="auto">Auto</option>
                  <option value="bici">Bici</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label className="form-label-manda2">Marca</Form.Label>
                <Form.Control value={vehiculo.marca||''} onChange={(e)=> setVehiculo({...vehiculo, marca: e.target.value})} className="form-control-manda2" />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label-manda2">Modelo</Form.Label>
                <Form.Control value={vehiculo.modelo||''} onChange={(e)=> setVehiculo({...vehiculo, modelo: e.target.value})} className="form-control-manda2" />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label-manda2">Año</Form.Label>
                <Form.Control value={vehiculo.anio||''} onChange={(e)=> setVehiculo({...vehiculo, anio: e.target.value})} className="form-control-manda2" />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label-manda2">Placa</Form.Label>
                <Form.Control value={vehiculo.placa||''} onChange={(e)=> setVehiculo({...vehiculo, placa: e.target.value})} className="form-control-manda2" />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label-manda2">Color</Form.Label>
                <Form.Control value={vehiculo.color||''} onChange={(e)=> setVehiculo({...vehiculo, color: e.target.value})} className="form-control-manda2" />
              </Col>
            </Row>
            <div className="mt-3">
              <Button type="submit" className="btn-manda2-primary" disabled={saving}>{saving?'Guardando...':'Guardar y continuar'}</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      </Container>
    </div>
  )
}

export default RepartidorVehiculo

