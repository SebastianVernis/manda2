import React, { useEffect, useState } from 'react'
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { apiClient } from '../../services/apiClient'

const TiendaDireccion = () => {
  const { user } = useAuth()
  const [direccion, setDireccion] = useState(user?.ubicacion?.direccion || '')
  const [coords, setCoords] = useState({ latitud: user?.ubicacion?.latitud, longitud: user?.ubicacion?.longitud })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!coords?.latitud || !coords?.longitud) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setCoords({ latitud: pos.coords.latitude, longitud: pos.coords.longitude }),
          () => {}
        )
      }
    }
  }, [coords?.latitud, coords?.longitud])

  const usarUbicacion = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ latitud: pos.coords.latitude, longitud: pos.coords.longitude }),
      (err) => setError(err.message)
    )
  }

  const onGuardar = async () => {
    setError('')
    if (!coords.latitud || !coords.longitud) { setError('Selecciona o usa tu ubicación'); return }
    setSaving(true)
    try {
      await apiClient.location.update({ ...coords, direccion })
      window.location.assign('/tienda')
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Container className="py-4">
      <h2 className="text-manda2-gold">Configurar Dirección</h2>
      <Card className="card-manda2 mt-3">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row className="g-3">
            <Col md={8}>
              <Form.Label className="form-label-manda2">Dirección</Form.Label>
              <Form.Control value={direccion} onChange={(e)=> setDireccion(e.target.value)} placeholder="Calle y número, ciudad" className="form-control-manda2" />
            </Col>
            <Col md={2}>
              <Form.Label className="form-label-manda2">Latitud</Form.Label>
              <Form.Control value={coords.latitud || ''} onChange={(e)=> setCoords(prev=>({...prev, latitud: parseFloat(e.target.value)||''}))} className="form-control-manda2" />
            </Col>
            <Col md={2}>
              <Form.Label className="form-label-manda2">Longitud</Form.Label>
              <Form.Control value={coords.longitud || ''} onChange={(e)=> setCoords(prev=>({...prev, longitud: parseFloat(e.target.value)||''}))} className="form-control-manda2" />
            </Col>
          </Row>
          <div className="d-flex gap-2 mt-3">
            <Button className="btn-manda2-secondary" onClick={usarUbicacion}>Usar mi ubicación</Button>
            <Button className="btn-manda2-primary" onClick={onGuardar} disabled={saving}>{saving ? 'Guardando...' : 'Guardar y continuar'}</Button>
          </div>
        </Card.Body>
      </Card>
      </Container>
    </div>
  )
}

export default TiendaDireccion
