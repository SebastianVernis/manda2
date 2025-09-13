import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Container, Spinner, Alert, Button, Badge, Nav, Row, Col, Card } from 'react-bootstrap'
import { apiClient } from '../../services/apiClient'
import { getEstadoTexto, getEstadoColor, getEstadoIcono, getProximoEstado } from '../../utils/orderStates'
import { useBackgroundLocation } from '../../context/BackgroundLocation'

const RepartidorPedidos = () => {
  const [tab, setTab] = useState('asignados')
  const { enabled: locationEnabled, hasActiveDelivery } = useBackgroundLocation()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders-delivery'],
    queryFn: async () => {
      const res = await apiClient.orders.getAll({ limit: 50 })
      return res.data
    },
  })

  // Filtrar pedidos activos (no completados)
  const pedidos = data?.pedidos?.filter(p => 
    p.estado !== 'entregado' && p.estado !== 'cancelado'
  ) || []

  const availableQ = useQuery({
    queryKey: ['orders-available'],
    queryFn: async () => {
      const res = await apiClient.orders.getAvailable({ limit: 50 })
      return res.data
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, estado }) => {
      await apiClient.orders.updateStatus(id, estado)
    },
    onSuccess: () => refetch(),
  })

  const claimMutation = useMutation({
    mutationFn: async (id) => apiClient.orders.claim(id),
    onSuccess: () => {
      availableQ.refetch();
      refetch();
    },
  })

  return (
    <Container className="py-4 text-center">
      <h2 className="text-yega-gold mb-2">Pedidos</h2>
      
      {pedidos.length > 0 ? (
        <Alert variant={locationEnabled ? "success" : "warning"} className="mb-2 glass-card" style={{background: "rgba(40,167,69,0.15)"}}>
          {locationEnabled 
            ? "✅ Ubicación automática activa - Los clientes pueden ver tu ubicación en tiempo real" 
            : "⚠️ Ubicación automática no disponible. Los clientes NO pueden ver tu ubicación. Activa los permisos de ubicación en tu navegador."}
        </Alert>
      ) : (
        <Alert variant="info" className="mb-2 glass-card" style={{background: "rgba(23,162,184,0.15)"}}>
          ℹ️ No tienes pedidos activos. La ubicación automática se activará cuando tomes un pedido.
        </Alert>
      )}
      
      <div className="d-flex justify-content-center gap-2 mb-2">
        <Button className="glass-btn" onClick={() => availableQ.refetch()}>Refrescar disponibles</Button>
        <Button className="btn-yega-primary" onClick={() => refetch()}>Refrescar asignados</Button>
      </div>

      <Nav variant="tabs" activeKey={tab} onSelect={k => setTab(k || 'asignados')} className="mb-3 justify-content-center">
        <Nav.Item>
          <Nav.Link eventKey="disponibles">Disponibles</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="asignados">Asignados</Nav.Link>
        </Nav.Item>
      </Nav>

      {tab === 'disponibles' ? (
        availableQ.isLoading ? (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        ) : availableQ.isError ? (
          <Alert variant="danger" className="glass-card" style={{background: "rgba(220,53,69,0.15)"}}>No se pudieron cargar los pedidos disponibles.</Alert>
        ) : (
          <Row className="g-3">
            {(availableQ.data?.pedidos || []).map(o => (
              <Col md={6} lg={4} key={o._id}>
                <Card className="glass-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold">{o.tiendaId?.nombre ?? '—'}</div>
                        <div className="text-muted small">Pedido {o.numero_pedido}</div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold">${o.total?.toFixed?.(2) ?? o.total}</div>
                      </div>
                    </div>
                    <div className="mt-3 d-flex gap-2">
                      <Button size="sm" className="btn-yega-primary" style={{borderRadius: '12px'}} disabled={claimMutation.isPending} onClick={() => claimMutation.mutate(o._id)}>Tomar pedido</Button>
                      {o.tiendaId?.ubicacion && (
                        <Button as="a" target="_blank" rel="noopener" size="sm" className="glass-btn" href={`https://www.google.com/maps/dir/?api=1&destination=${o.tiendaId.ubicacion.latitud},${o.tiendaId.ubicacion.longitud}`}>Ir a Tienda</Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            {((availableQ.data?.pedidos || []).length === 0) && (
              <Col xs={12}><div className="text-center text-muted py-4">No hay pedidos disponibles</div></Col>
            )}
          </Row>
        )
      ) : (
        <>
          {isLoading && <div className="text-center py-5"><Spinner animation="border" /></div>}
          {isError && <Alert variant="danger" className="glass-card" style={{background: "rgba(220,53,69,0.15)"}}>No se pudieron cargar los pedidos.</Alert>}
          {!isLoading && !isError && (
            <Row className="g-3">
              {pedidos.map((o) => (
                <Col md={6} lg={4} key={o._id}>
                  <Card className="glass-card h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <div className="fw-bold">{o.clienteId?.nombre ?? '—'}</div>
                          <div className="text-muted small">{o.tiendaId?.nombre ?? '—'} • Pedido {o.numero_pedido}</div>
                        </div>
                        <Badge className="glass-badge" bg={getEstadoColor(o.estado)}>
                          {getEstadoIcono(o.estado)} {getEstadoTexto(o.estado)}
                        </Badge>
                      </div>
                      <div className="mt-2 fw-bold">${o.total?.toFixed?.(2) ?? o.total}</div>
                      <div className="mt-3 d-flex flex-wrap gap-2">
                        {o.estado === 'listo' && (
                          <Button 
                            size="sm" 
                            className="glass-btn" 
                            disabled={updateMutation.isPending} 
                            onClick={() => updateMutation.mutate({ id: o._id, estado: 'camino_tienda' })}
                          >
                            🛵➡️🏪 Ir a tienda
                          </Button>
                        )}
                        {o.estado === 'camino_tienda' && (
                          <Button 
                            size="sm" 
                            className="glass-btn" 
                            disabled={updateMutation.isPending} 
                            onClick={() => updateMutation.mutate({ id: o._id, estado: 'recolectado' })}
                          >
                            📋 Recolectado
                          </Button>
                        )}
                        {o.estado === 'recolectado' && (
                          <Button 
                            size="sm" 
                            className="glass-btn" 
                            disabled={updateMutation.isPending} 
                            onClick={() => updateMutation.mutate({ id: o._id, estado: 'en_camino' })}
                          >
                            🛵➡️🏠 En camino al cliente
                          </Button>
                        )}
                        {o.estado === 'en_camino' && (
                          <Button 
                            size="sm" 
                            className="btn-yega-primary" 
                            style={{borderRadius: '12px'}}
                            disabled={updateMutation.isPending} 
                            onClick={() => updateMutation.mutate({ id: o._id, estado: 'entregado' })}
                          >
                            🎉 Entregado
                          </Button>
                        )}
                        {o.tiendaId?.ubicacion && (
                          <Button as="a" target="_blank" rel="noopener" size="sm" className="glass-btn" href={`https://www.google.com/maps/dir/?api=1&destination=${o.tiendaId.ubicacion.latitud},${o.tiendaId.ubicacion.longitud}`}>Ir a Tienda</Button>
                        )}
                        {o.direccion_envio?.latitud && o.direccion_envio?.longitud && (
                          <Button as="a" target="_blank" rel="noopener" size="sm" className="glass-btn" href={`https://www.google.com/maps/dir/?api=1&destination=${o.direccion_envio.latitud},${o.direccion_envio.longitud}`}>Ir a Cliente</Button>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              {pedidos.length === 0 && (
                <Col xs={12}><div className="text-center text-muted py-4">No tienes pedidos asignados</div></Col>
              )}
            </Row>
          )}
        </>
      )}
    </Container>
  )
}

export default RepartidorPedidos