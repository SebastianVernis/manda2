import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Container, Row, Col, Table, Spinner, Alert, Form, Badge } from 'react-bootstrap'
import api from '../../services/apiClient'

const AdminRepartidores = () => {
  const [selected, setSelected] = useState('')

  const repartidoresQ = useQuery({
    queryKey: ['admin-delivery'],
    queryFn: async () => {
      const res = await api.get('/admin/users', { params: { rol: 'repartidor', limit: 200 } })
      return res.data.usuarios || []
    }
  })

  const pedidosQ = useQuery({
    enabled: !!selected,
    queryKey: ['admin-orders-by-delivery', selected],
    queryFn: async () => {
      const res = await api.get('/orders', { params: { repartidorId: selected, limit: 50 } })
      return res.data
    },
    refetchInterval: 5000,
  })

  return (
    <Container className="py-4">
      <Row className="align-items-end g-2 mb-3">
        <Col>
          <h2 className="text-yega-gold mb-0">Repartidores</h2>
        </Col>
        <Col md={4}>
          <Form.Label className="form-label-yega">Selecciona un repartidor</Form.Label>
          <Form.Select value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">—</option>
            {repartidoresQ.data?.map(r => (
              <option key={r._id} value={r._id}>{r.nombre} ({r.email})</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {repartidoresQ.isLoading && <div className="text-center py-5"><Spinner animation="border" /></div>}
      {repartidoresQ.isError && <Alert variant="danger">No se pudieron cargar los repartidores.</Alert>}

      {selected && (
        <>
          <h5 className="text-yega-silver">Pedidos del repartidor</h5>
          {pedidosQ.isLoading && <div className="text-center py-3"><Spinner animation="border" /></div>}
          {pedidosQ.isError && <Alert variant="danger">No se pudieron cargar los pedidos.</Alert>}
          {!pedidosQ.isLoading && !pedidosQ.isError && (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Nº Pedido</th>
                  <th>Fecha</th>
                  <th>Tienda</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidosQ.data?.pedidos?.map(o => (
                  <tr key={o._id}>
                    <td>{o.numero_pedido}</td>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                    <td>{o.tiendaId?.nombre ?? '—'}</td>
                    <td>{o.clienteId?.nombre ?? '—'}</td>
                    <td><Badge bg="secondary">{o.estado}</Badge></td>
                    <td>${o.total?.toFixed?.(2) ?? o.total}</td>
                  </tr>
                ))}
                {(pedidosQ.data?.pedidos?.length || 0) === 0 && (
                  <tr><td colSpan={6} className="text-center text-muted py-4">Sin pedidos</td></tr>
                )}
              </tbody>
            </Table>
          )}
        </>
      )}
    </Container>
  )
}

export default AdminRepartidores
