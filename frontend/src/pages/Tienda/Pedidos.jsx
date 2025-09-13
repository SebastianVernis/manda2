import React from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../../services/apiClient'
import { getEstadoTexto, getEstadoColor, getEstadoIcono } from '../../utils/orderStates'
import { Card, CardContent } from '@/components/ui/card'
import { Button as FButton } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert as FAlert, AlertTitle, AlertDescription } from '@/components/ui/alert'

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
    <div className="p-4">
      <div className="text-center mb-3">
        <h2 className="text-yega-gold m-0 mb-2">Pedidos</h2>
        <FButton className="btn-yega-primary" onClick={() => refetch()}>Refrescar</FButton>
      </div>
      {isLoading && <div className="text-center py-5"><div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" /></div>}
      {isError && <FAlert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>No se pudieron cargar los pedidos.</AlertDescription></FAlert>}
      {!isLoading && !isError && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 no-scrollbar place-items-center">
          {pedidos.map(o => (
            <Card key={o._id}>
              <CardContent className="p-4 space-y-1">
                <div className="flex items-start justify-between">
                  <div className="font-semibold">{o.numero_pedido}</div>
                  <Badge className={`bg-${getEstadoColor(o.estado)}`}>
                    {getEstadoIcono(o.estado)} {getEstadoTexto(o.estado)}
                  </Badge>
                </div>
                <div className="text-sm text-white/70">{new Date(o.createdAt).toLocaleString()}</div>
                <div className="text-sm">Cliente: {o.clienteId?.nombre ?? '—'}</div>
                <div className="font-medium">${o.total?.toFixed?.(2) ?? o.total}</div>
                <div className="pt-2 text-right">
                  {nextEstado(o.estado) && (
                    <FButton size="sm" className="btn-yega-primary" disabled={updateMutation.isPending} onClick={() => updateMutation.mutate({ id: o._id, estado: nextEstado(o.estado) })}>
                      Marcar {getEstadoTexto(nextEstado(o.estado))}
                    </FButton>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {pedidos.length === 0 && (
            <div className="col-span-full text-center text-muted py-4">No hay pedidos</div>
          )}
        </div>
      )}
    </div>
  )
}

export default TiendaPedidos
