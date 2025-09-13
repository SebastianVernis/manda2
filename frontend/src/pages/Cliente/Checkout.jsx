import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import api from '../../services/apiClient'

const Checkout = () => {
  const { items, subtotal, clear, storeId: _storeId } = useCart()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [coords, setCoords] = useState({ latitud: undefined, longitud: undefined })
  const [form, setForm] = useState({
    calle: '', numero: '', ciudad: '', codigo_postal: '', referencias: '',
    metodo_pago: 'efectivo', notas: ''
  })

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ latitud: pos.coords.latitude, longitud: pos.coords.longitude }),
      () => {}
    )
  }, [])

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (items.length === 0) { setError('El carrito está vacío'); return }
    if (!form.calle || !form.numero || !form.ciudad) { setError('Completa dirección: calle, número y ciudad'); return }

    setIsSubmitting(true)
    try {
      const productos = items.map(it => ({ producto: it.product._id, cantidad: it.quantity }))
      const direccion_envio = { ...form, latitud: coords.latitud, longitud: coords.longitud }
      const metodo_pago = form.metodo_pago
      const notas = form.notas

      const res = await api.post('/orders', { productos, direccion_envio, metodo_pago, notas })
      const pedido = res.data?.pedido

      clear()
      if (pedido?._id) {
        navigate(`/cliente/seguimiento?id=${pedido._id}`, { replace: true })
      } else {
        navigate('/cliente/pedidos', { replace: true })
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'No se pudo completar el pedido'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Container className="py-4">
      <Row>
        <Col lg={7} className="mb-3">
          <Card className="card-yega">
            <Card.Header>
              <h4 className="mb-0">Dirección de envío</h4>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8} className="mb-3">
                    <Form.Label className="form-label-yega">Calle</Form.Label>
                    <Form.Control name="calle" value={form.calle} onChange={onChange} className="form-control-yega" />
                  </Col>
                  <Col md={4} className="mb-3">
                    <Form.Label className="form-label-yega">Número</Form.Label>
                    <Form.Control name="numero" value={form.numero} onChange={onChange} className="form-control-yega" />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="form-label-yega">Ciudad</Form.Label>
                    <Form.Control name="ciudad" value={form.ciudad} onChange={onChange} className="form-control-yega" />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="form-label-yega">Código Postal</Form.Label>
                    <Form.Control name="codigo_postal" value={form.codigo_postal} onChange={onChange} className="form-control-yega" />
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Label className="form-label-yega">Referencias</Form.Label>
                    <Form.Control as="textarea" rows={3} name="referencias" value={form.referencias} onChange={onChange} className="form-control-yega" />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="form-label-yega">Método de pago</Form.Label>
                    <Form.Select name="metodo_pago" value={form.metodo_pago} onChange={onChange} className="form-control-yega">
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="transferencia">Transferencia</option>
                    </Form.Select>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label className="form-label-yega">Notas</Form.Label>
                    <Form.Control name="notas" value={form.notas} onChange={onChange} className="form-control-yega" />
                  </Col>
                </Row>
                <div className="d-flex justify-content-end">
                  <Button type="submit" className="btn-yega-primary" disabled={isSubmitting || items.length === 0}>
                    {isSubmitting ? <Spinner size="sm" animation="border" className="me-2" /> : null}
                    Confirmar pedido
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={5}>
          <Card className="card-yega">
            <Card.Header>
              <h4 className="mb-0">Tu pedido</h4>
            </Card.Header>
            <Card.Body>
              {items.length === 0 ? (
                <div className="text-muted">El carrito está vacío</div>
              ) : (
                <>
                  {items.map((it) => (
                    <div key={it.product._id} className="d-flex justify-content-between mb-2">
                      <div>{it.product.nombre} x {it.quantity}</div>
                      <div>${(it.product.precio * it.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Subtotal</strong>
                    <strong>${subtotal.toFixed(2)}</strong>
                  </div>
                  <div className="text-muted small mt-1">Envío se calcula en el backend</div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Checkout
