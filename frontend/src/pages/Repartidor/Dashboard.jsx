// frontend/src/pages/Repartidor/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, ProgressBar } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useBackgroundLocation } from '../../context/BackgroundLocation'
import { useLocationCheck } from '../../hooks/useLocationCheck'
import LocationAlert from '../../components/LocationAlert'
import DeliveryMap from '../../components/DeliveryMap'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../../services/apiClient'
import { getEstadoTexto, getEstadoColor, getEstadoIcono } from '../../utils/orderStates'

const RepartidorDashboard = () => {
  const { user: _user } = useAuth()
  const bg = useBackgroundLocation()
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const queryClient = useQueryClient()
  useLocationCheck() // Verificar ubicación al cargar la pantalla

  // Invalidar queries cuando la ubicación cambie
  useEffect(() => {
    if (bg?.currentPosition) {
      // Invalidar después de un pequeño delay para permitir que el backend procese la ubicación
      const timer = setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['orders-available-dashboard'] })
        queryClient.invalidateQueries({ queryKey: ['orders-assigned-dashboard'] })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [bg?.currentPosition, queryClient])

  const availableQ = useQuery({
    queryKey: ['orders-available-dashboard'],
    queryFn: async () => (await apiClient.orders.getAvailable({ limit: 50 })).data,
    refetchInterval: 5000,
  })
  const assignedQ = useQuery({
    queryKey: ['orders-assigned-dashboard'],
    queryFn: async () => (await apiClient.orders.getAll({ limit: 50 })).data,
    refetchInterval: 5000,
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, estado }) => apiClient.orders.updateStatus(id, estado),
    onSuccess: () => {
      assignedQ.refetch()
      // Forzar una verificación inmediata de pedidos activos cuando se cambia un estado
      // particularmente importante si el estado es "entregado" para detener la ubicación
      queryClient.invalidateQueries({ queryKey: ['orders-assigned-dashboard'] })
    },
  })
  const claimMutation = useMutation({
    mutationFn: async (id) => apiClient.orders.claim(id),
    onSuccess: () => { availableQ.refetch(); assignedQ.refetch() },
  })

  const getProgresoEstado = (estado) => {
    const orden = ['pendiente', 'confirmado', 'preparando', 'listo', 'camino_tienda', 'recolectado', 'en_camino', 'entregado'];
    const idx = orden.indexOf(estado);
    if (idx === -1) return 0;
    return Math.round((idx / (orden.length - 1)) * 100);
  }
  
  const nextEstado = (estado) => {
    switch (estado) {
      case 'listo': return 'camino_tienda'
      case 'camino_tienda': return 'recolectado'
      case 'recolectado': return 'en_camino'
      case 'en_camino': return 'entregado'
      default: return null
    }
  }

  const disponibles = availableQ.data?.pedidos || []
  const asignados = assignedQ.data?.pedidos || []

  return (
    <Container className="py-4 text-center">
      <h2 className="text-yega-gold mb-1">Pedidos</h2>
      <div className="small text-white-50 mb-3">
        {bg?.enabled ? 
          <Badge bg="success" className="me-2">Ubicación en segundo plano activa</Badge> : 
          <Badge bg="secondary" className="me-2">Ubicación en segundo plano inactiva</Badge>
        }
        {bg?.hasActiveDelivery ? 
          <Badge bg="info" className="me-2">Pedidos activos detectados</Badge> : 
          <Badge bg="warning" className="me-2">No hay pedidos activos</Badge>
        }
        {bg?.error ? <span className="text-danger ms-2">{bg.error}</span> : null}
      </div>

      <LocationAlert className="mb-3" />
      
      {!bg?.enabled && bg?.hasActiveDelivery && (
        <Alert variant="warning" className="mb-3">
          La ubicación automática no está funcionando a pesar de tener pedidos activos. <a href="/repartidor/ubicacion" className="alert-link">Ir a la pantalla de ubicación manual</a>
        </Alert>
      )}
      
      {bg?.enabled && !bg?.hasActiveDelivery && (
        <Alert variant="info" className="mb-3">
          Ubicación en pausa - se activará automáticamente cuando tomes un nuevo pedido.
        </Alert>
      )}

      {(availableQ.isError || assignedQ.isError) && (
        <Alert variant="danger" className="text-center">No se pudieron cargar los pedidos.</Alert>
      )}

      {/* Disponibles primero */}
      <div className="mb-2 text-white-50 text-start">
        <h4 className="text-yega-gold">Disponibles para tomar</h4>
      </div>
      {availableQ.isLoading ? (
        <div className="text-center py-3"><Spinner animation="border" /></div>
      ) : (
        <Row className="g-3 justify-content-center">
          {disponibles.map((o) => (
            <Col md={6} lg={4} key={o._id}>
              <Card className="card-yega h-100 text-start">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">{o.tiendaId?.nombre ?? '—'}</div>
                      <div className="text-muted small">Pedido {o.numero_pedido}</div>
                    </div>
                    <div className="text-end fw-bold">${o.total?.toFixed?.(2) ?? o.total}</div>
                  </div>
                  <div className="mt-3 d-flex gap-2 justify-content-end">
                    <Button size="sm" className="btn-yega-primary" disabled={claimMutation.isPending} onClick={() => claimMutation.mutate(o._id)}>Tomar pedido</Button>
                    {o.tiendaId?.ubicacion && o.estado !== 'entregado' && (
                      <Button as="a" target="_blank" rel="noopener" size="sm" className="btn-yega-outline" href={`https://www.google.com/maps/dir/?api=1&destination=${o.tiendaId.ubicacion.latitud},${o.tiendaId.ubicacion.longitud}`}>Ir a Tienda</Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
          {disponibles.length === 0 && (
            <Col xs={12}><div className="text-center text-muted py-3">No hay pedidos disponibles</div></Col>
          )}
        </Row>
      )}

      <div className="mt-4 mb-2 text-white-50 text-start">
        <h4 className="text-yega-gold">Mis pedidos asignados</h4>
      </div>
      {assignedQ.isLoading ? (
        <div className="text-center py-3"><Spinner animation="border" /></div>
      ) : (
        <Row className="g-3 justify-content-center">
          {asignados.map((o) => (
            <Col md={6} lg={4} key={o._id}>
              <Card className="card-yega h-100 text-start">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">{o.clienteId?.nombre ?? '—'}</div>
                      <div className="text-muted small">{o.tiendaId?.nombre ?? '—'} • Pedido {o.numero_pedido}</div>
                    </div>
                    <Badge bg={getEstadoColor(o.estado)} className="estado-badge">{getEstadoIcono(o.estado)} {getEstadoTexto(o.estado)}</Badge>
                  </div>
                  <div className="mt-2 fw-bold">${o.total?.toFixed?.(2) ?? o.total}</div>
                  <div className="mt-2">
                    <ProgressBar 
                      variant={getEstadoColor(o.estado)}
                      now={getProgresoEstado(o.estado)} 
                      className="progress-estado"
                      style={{ height: '8px' }}
                    />
                  </div>
                  <div className="mt-3 d-flex flex-wrap gap-2 justify-content-end">
                    {nextEstado(o.estado) && (
                      <Button 
                        size="sm" 
                        variant={getEstadoColor(nextEstado(o.estado))} 
                        className={`btn-estado-${nextEstado(o.estado)}`}
                        disabled={updateMutation.isPending} 
                        onClick={() => updateMutation.mutate({ id: o._id, estado: nextEstado(o.estado) })}
                      >
                        <span className={nextEstado(o.estado).includes('camino') ? 'icon-repartidor-movimiento' : ''}>
                          {getEstadoIcono(nextEstado(o.estado))}
                        </span> Marcar {getEstadoTexto(nextEstado(o.estado))}
                      </Button>
                    )}
                    {o.tiendaId?.ubicacion && o.estado !== 'entregado' && (
                      <Button as="a" target="_blank" rel="noopener" size="sm" className="btn-yega-outline" href={`https://www.google.com/maps/dir/?api=1&destination=${o.tiendaId.ubicacion.latitud},${o.tiendaId.ubicacion.longitud}`}>Ir a Tienda</Button>
                    )}
                    {o.direccion_envio?.latitud && o.direccion_envio?.longitud && o.estado !== 'entregado' && (
                      <Button as="a" target="_blank" rel="noopener" size="sm" className="btn-yega-outline" href={`https://www.google.com/maps/dir/?api=1&destination=${o.direccion_envio.latitud},${o.direccion_envio.longitud}`}>Ir a Cliente</Button>
                    )}
                    {(o.tiendaId?.ubicacion || (o.direccion_envio?.latitud && o.direccion_envio?.longitud)) && o.estado !== 'entregado' && (
                      <Button 
                        size="sm" 
                        variant="info" 
                        onClick={() => setSelectedOrderId(selectedOrderId === o._id ? null : o._id)}
                      >
                        {selectedOrderId === o._id ? 'Ocultar Mapa' : 'Ver Mapa'}
                      </Button>
                    )}
                  </div>
                </Card.Body>
                {selectedOrderId === o._id && (
                  <div className="p-3 border-top">
                    <DeliveryMap 
                      order={o} 
                      deliveryLocation={bg?.currentPosition}
                      height="300px"
                    />
                  </div>
                )}
              </Card>
            </Col>
          ))}
          {asignados.length === 0 && (
            <Col xs={12}><div className="text-center text-muted py-3">No tienes pedidos asignados</div></Col>
          )}
        </Row>
      )}
    </Container>
  )
}

export default RepartidorDashboard
