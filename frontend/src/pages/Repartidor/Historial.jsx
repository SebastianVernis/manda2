import React from 'react'
import { Container, Spinner, Alert, Badge, Row, Col, Card } from 'react-bootstrap'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../services/apiClient'
import { getEstadoTexto, getEstadoColor, getEstadoIcono } from '../../utils/orderStates'

const RepartidorHistorial = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders-delivery-history'],
    queryFn: async () => {
      const res = await apiClient.orders.getAll({ limit: 50 })
      return res.data
    },
  })

  // Filtrar solo pedidos completados (entregados o cancelados)
  const pedidosCompletados = data?.pedidos?.filter(p => 
    p.estado === 'entregado' || p.estado === 'cancelado'
  ) || []

  return (
    <Container className="py-4">
      <h2 className="text-yega-gold text-center mb-4">Historial de Entregas</h2>
      
      {isLoading && <div className="text-center py-5"><Spinner animation="border" /></div>}
      
      {isError && <Alert variant="danger">No se pudieron cargar el historial de pedidos.</Alert>}
      
      {!isLoading && !isError && (
        <>
          {pedidosCompletados.length === 0 ? (
            <div className="text-center py-5">
              <div className="glass-card mx-auto d-flex align-items-center justify-content-center mb-3" style={{width: '120px', height: '120px', borderRadius: '20px'}}>
                <span className="fs-1">📋</span>
              </div>
              <h4 className="text-white mb-2">No hay entregas completadas</h4>
              <p className="text-muted">Tu historial de entregas aparecerá aquí</p>
            </div>
          ) : (
            <Row className="g-3">
              {pedidosCompletados.map((o) => (
                <Col md={6} lg={4} key={o._id}>
                  <Card className="glass-card h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold">{o.clienteId?.nombre ?? '—'}</div>
                          <div className="text-muted small">{o.tiendaId?.nombre ?? '—'} • Pedido {o.numero_pedido}</div>
                          <div className="small text-white-50 mt-1">
                            {new Date(o.updatedAt).toLocaleDateString()} • {new Date(o.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                        <Badge bg={getEstadoColor(o.estado)} className="glass-badge">
                          {getEstadoIcono(o.estado)} {getEstadoTexto(o.estado)}
                        </Badge>
                      </div>
                      <div className="mt-3 d-flex justify-content-between align-items-center">
                        <div className="fw-bold">${o.total?.toFixed?.(2) ?? o.total}</div>
                        <div className="text-end small text-white-50">
                          {o.direccion_envio?.direccion && (
                            <div>{o.direccion_envio.direccion}</div>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  )
}

export default RepartidorHistorial