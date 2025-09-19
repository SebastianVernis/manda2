import React from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../../services/apiClient'
import { getEstadoTexto, getEstadoColor, getEstadoIcono } from '../../utils/orderStates'
import { Card, Button, Badge, Alert } from 'react-bootstrap'

const TiendaPedidos = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders-store'],
    queryFn: async () => {
      const res = await api.get('/orders', { params: { limit: 50 } })
      return res.data
    },
    refetchInterval: 5000,
  })

  const pedidos = data?.pedidos || []

  const updateMutation = useMutation({
    mutationFn: async ({ id, estado }) => {
      await api.put(`/orders/${id}/status`, { estado })
    },
    onSuccess: () => refetch(),
  })

  const nextEstado = (estado) => {
    switch (estado) {
      case 'pendiente': return 'confirmado'
      case 'confirmado': return 'preparando'
      case 'preparando': return 'listo'
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="p-4">
      <div className="text-center mb-3">
        <h2 className="text-warning mb-2">Pedidos</h2>
        <Button variant="primary" onClick={() => refetch()}>Refrescar</Button>
      </div>
      {isLoading && <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>}
      {isError && <Alert variant="danger">Error: No se pudieron cargar los pedidos.</Alert>}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar place-items-center">
          {pedidos.map(o => (
            <Card key={o._id} className="card-yega yega-glass shadow-lg">
              <Card.Body className="p-4">
                <div className="flex items-start justify-between">
                  <div className="fw-semibold text-white">{o.numero_pedido}</div>
                  <Badge bg={getEstadoColor(o.estado)}>
                    {getEstadoIcono(o.estado)} {getEstadoTexto(o.estado)}
                  </Badge>
                </div>
                <div className="text-sm text-white-50">{new Date(o.createdAt).toLocaleString()}</div>
                <div className="text-sm text-white">Cliente: {o.clienteId?.nombre ?? '—'}</div>
                <div className="fw-medium text-white">${o.total?.toFixed?.(2) ?? o.total}</div>
                <div className="pt-2 text-right">
                  {nextEstado(o.estado) && (
                    <Button size="sm" variant="primary" disabled={updateMutation.isPending} onClick={() => updateMutation.mutate({ id: o._id, estado: nextEstado(o.estado) })}>
                      Marcar {getEstadoTexto(nextEstado(o.estado))}
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
          {pedidos.length === 0 && (
            <div className="col-span-full text-center text-muted py-4">No hay pedidos</div>
          )}
        </div>
      )}
      </div>
    </div>
  )
}

export default TiendaPedidos
