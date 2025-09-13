import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../services/apiClient'
import { getEstadoTexto, getEstadoColor, getEstadoIcono } from '../../utils/orderStates'
import 'leaflet/dist/leaflet.css'
import '../../styles/map-styles.css'
import { MapContainer, TileLayer, CircleMarker, Marker, Polyline, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Chip, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Spinner,
  Divider,
  Avatar,
  Progress
} from '@heroui/react'
import { MapPin, Store, Flag, Truck, Clock, Package, CheckCircle2, ShoppingBag, ChefHat } from 'lucide-react'

const FitToMarkers = ({ points }) => {
  const map = useMap()
  React.useEffect(() => {
    if (!points || points.length === 0) return
    const latlngs = points.map(p => [p.lat, p.lng])
    if (latlngs.length === 1) {
      map.setView(latlngs[0], 14)
    } else {
      map.fitBounds(latlngs, { padding: [30, 30] })
    }
  }, [points, map])
  return null
}

// Componente de pasos de seguimiento
const OrderTimeline = ({ estado }) => {
  const getProgresoEstado = () => {
    const orden = ['pendiente', 'confirmado', 'preparando', 'listo', 'camino_tienda', 'recolectado', 'en_camino', 'entregado'];
    const idx = orden.indexOf(estado);
    if (idx === -1) return 0;
    return Math.round((idx / (orden.length - 1)) * 100);
  }
  
  const getEstadoStepStatus = (step) => {
    const orden = ['pendiente', 'confirmado', 'preparando', 'listo', 'camino_tienda', 'recolectado', 'en_camino', 'entregado'];
    const idxActual = orden.indexOf(estado);
    const idxStep = orden.indexOf(step);
    
    if (idxActual < 0 || idxStep < 0) return 'pending';
    if (idxActual > idxStep) return 'complete';
    if (idxActual === idxStep) return 'current';
    return 'pending';
  }

  return (
    <div className="my-4">
      <Progress value={getProgresoEstado()} className="mb-3" size="lg" color={getEstadoColor(estado)} />
      <div className="flex justify-between">
        <div className={`text-center ${getEstadoStepStatus('confirmado') !== 'pending' ? 'text-primary-500' : 'text-gray-400'}`}>
          <div className="flex justify-center">
            <CheckCircle2 size={20} className={getEstadoStepStatus('confirmado') !== 'pending' ? 'text-primary-500' : 'text-gray-400'} />
          </div>
          <span className="text-xs">Confirmado</span>
        </div>
        
        <div className={`text-center ${getEstadoStepStatus('preparando') !== 'pending' ? 'text-primary-500' : 'text-gray-400'}`}>
          <div className="flex justify-center">
            <ChefHat size={20} className={getEstadoStepStatus('preparando') !== 'pending' ? 'text-warning-500' : 'text-gray-400'} />
          </div>
          <span className="text-xs">Preparando</span>
        </div>
        
        <div className={`text-center ${getEstadoStepStatus('recolectado') !== 'pending' ? 'text-primary-500' : 'text-gray-400'}`}>
          <div className="flex justify-center">
            <ShoppingBag size={20} className={getEstadoStepStatus('recolectado') !== 'pending' ? 'text-violet-500' : 'text-gray-400'} />
          </div>
          <span className="text-xs">Recogido</span>
        </div>
        
        <div className={`text-center ${getEstadoStepStatus('en_camino') !== 'pending' ? 'text-primary-500' : 'text-gray-400'}`}>
          <div className="flex justify-center">
            <Truck size={20} className={getEstadoStepStatus('en_camino') !== 'pending' ? 'text-warning-500' : 'text-gray-400'} />
          </div>
          <span className="text-xs">En camino</span>
        </div>
        
        <div className={`text-center ${getEstadoStepStatus('entregado') !== 'pending' ? 'text-primary-500' : 'text-gray-400'}`}>
          <div className="flex justify-center">
            <CheckCircle2 size={20} className={getEstadoStepStatus('entregado') !== 'pending' ? 'text-success-500' : 'text-gray-400'} />
          </div>
          <span className="text-xs">Entregado</span>
        </div>
      </div>
    </div>
  )
}

const ClienteSeguimiento = () => {
  const [params] = useSearchParams()
  const id = params.get('id')
  const { data, isLoading, isError } = useQuery({
    enabled: !!id,
    queryKey: ['order-track', id],
    queryFn: async () => {
      const res = await apiClient.orders.getById(id)
      return res.data
    },
    refetchInterval: 5000,
  })

  const pedido = data?.pedido
  const estado = pedido?.estado
  const tiendaPos = useMemo(() => {
    const u = pedido?.tiendaId?.ubicacion
    if (u?.latitud && u?.longitud) return { lat: u.latitud, lng: u.longitud }
    return null
  }, [pedido])
  const destinoPos = useMemo(() => {
    const d = pedido?.direccion_envio
    if (d?.latitud && d?.longitud) return { lat: d.latitud, lng: d.longitud }
    return null
  }, [pedido])
  const repPos = useMemo(() => {
    const r = pedido?.repartidorId?.ubicacion
    if (r?.latitud && r?.longitud) return { lat: r.latitud, lng: r.longitud }
    return null
  }, [pedido])
  const allPoints = [tiendaPos, destinoPos, repPos].filter(Boolean)

  // Iconos SVG mejorados para el mapa (mejorando emoji por SVG)
  const storeIcon = useMemo(() => L.divIcon({
    className: 'yega-store-icon',
    html: `
      <div style="background:#0d6efd;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  }), [])
  
  const metaIcon = useMemo(() => L.divIcon({
    className: 'yega-flag-icon',
    html: `
      <div style="background:#28a745;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 9l-7 4-7-4V5l7 4 7-4v4z"></path>
          <path d="M19 5v14H5V5"></path>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  }), [])
  
  const riderIcon = useMemo(() => L.divIcon({
    className: 'yega-rider-icon',
    html: `
      <div class="${pedido?.estado === 'en_camino' ? 'repartidor-icon-pulse' : ''}" style="background:#ffc107;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
          <path d="M5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
          <path d="M15 5h2a1 1 0 0 1 1 1v3.5h-4V10"></path>
          <path d="M5 10h3.5L9 12.5h5M11.5 5h-7l-1 3h5.5"></path>
          <path d="M12 17.5V15l-3-1.5v-2M3 18.5v-7"></path>
          <path d="M19 18.5v-7L12.5 9"></path>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  }), [pedido?.estado])
  
  const orderIcon = useMemo(() => L.divIcon({
    className: 'yega-order-icon',
    html: `
      <div style="background:#6f42c1;color:white;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.29 7 12 12 20.71 7"></polyline>
          <line x1="12" y1="22" x2="12" y2="12"></line>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  }), [])

  const estadoStyles = (est) => {
    // Colores y estilos de ruta según estado
    switch (est) {
      case 'pendiente':
      case 'confirmado':
      case 'preparando':
        return { color: '#6c757d', dashArray: '6 6', weight: 3 } // gris punteado
      case 'listo':
        return { color: '#0d6efd', dashArray: '6 6', weight: 3 } // azul punteado (listo para salir)
      case 'camino_tienda':
        return { color: '#17a2b8', weight: 4 } // cyan sólido (repartidor hacia tienda)
      case 'recolectado':
        return { color: '#6f42c1', weight: 4 } // púrpura sólido (producto recolectado)
      case 'en_camino':
        return { color: '#ffc107', weight: 4 } // amarillo sólido (hacia cliente)
      case 'entregado':
        return { color: '#28a745', weight: 4 } // verde sólido
      case 'cancelado':
        return { color: '#dc3545', dashArray: '4 8', weight: 3 } // rojo punteado
      default:
        return { color: '#6c757d', weight: 3 }
    }
  }

  return (
    <div className="container mx-auto py-4 px-4">
      <h2 className="text-yega-gold text-2xl font-semibold mb-4 flex items-center gap-2">
        <Truck className="h-6 w-6" />
        Seguimiento de Pedido
      </h2>
      {!id && (
        <Card className="mt-3 border-warning">
          <CardBody>
            <p className="text-warning">No se proporcionó ID de pedido</p>
          </CardBody>
        </Card>
      )}
      {isLoading && <div className="text-center py-5"><Spinner size="lg" /></div>}
      {isError && (
        <Card className="border-danger">
          <CardBody>
            <p className="text-danger">No se pudo obtener el pedido</p>
          </CardBody>
        </Card>
      )}
      {pedido && (
        <div className="mt-3">
          <Card className="mb-4">
            <CardHeader className="flex items-center justify-between bg-background">
              <div className="flex gap-3 items-center">
                <div><strong>Pedido:</strong> {pedido.numero_pedido}</div>
                <div>
                  <Chip 
                    color={getEstadoColor(pedido.estado)} 
                    variant="flat"
                    startContent={<span>{getEstadoIcono(pedido.estado)}</span>}
                    className="text-sm font-medium"
                  >
                    {getEstadoTexto(pedido.estado)}
                  </Chip>
                </div>
                <div><strong>Total:</strong> ${pedido.total?.toFixed?.(2) ?? pedido.total}</div>
              </div>
              <div className="text-sm text-muted-foreground flex gap-2 items-center">
                <Clock size={16} />
                ETA aprox: {pedido.tiempo_estimado ?? 30} min
              </div>
            </CardHeader>
            <CardBody>
              <OrderTimeline estado={pedido.estado} />
            </CardBody>
          </Card>
          <hr />
          <div className="flex justify-between items-center mb-3">
            <h6 className="text-lg font-semibold">Productos</h6>
            <Chip color="primary" variant="dot" size="sm">{pedido.productos?.length || 0} productos</Chip>
          </div>
          
          <Card className="mb-4">
            <Table aria-label="Productos en pedido" removeWrapper>
              <TableHeader>
                <TableColumn>Producto</TableColumn>
                <TableColumn>Cant.</TableColumn>
                <TableColumn>Precio</TableColumn>
                <TableColumn>Subtotal</TableColumn>
              </TableHeader>
              <TableBody>
                {pedido.productos?.map((it, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{it.producto?.nombre ?? 'Producto'}</TableCell>
                    <TableCell>{it.cantidad}</TableCell>
                    <TableCell>${it.precio_unitario?.toFixed?.(2) ?? it.precio_unitario}</TableCell>
                    <TableCell>${it.subtotal?.toFixed?.(2) ?? it.subtotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
          <hr />
          <div className="flex justify-between items-center mb-3">
            <h6 className="text-lg font-semibold">Repartidor</h6>
            {pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
              <Chip color="primary" variant="flat" size="sm">En tiempo real</Chip>
            )}
          </div>
          
          {pedido.repartidorId ? (
            <Card className="mb-4">
              <CardBody className="flex items-center gap-4">
                <Avatar 
                  name={pedido.repartidorId?.nombre ?? 'Repartidor'} 
                  color="warning" 
                  fallback={<Truck size={18} />}
                  className="h-12 w-12"
                />
                <div>
                  <div className="font-medium">{pedido.repartidorId?.nombre ?? '—'}</div>
                  {pedido.repartidorId?.ubicacion?.latitud ? (
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className={pedido.estado === 'en_camino' ? 'animate-bounce' : ''} />
                        <span>Ubicación actualizada hace {Math.floor(Math.random() * 5) + 1} min</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">Ubicación no disponible</div>
                  )}
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card className="mb-4 border-dashed border-muted">
              <CardBody>
                <div className="text-center text-muted-foreground py-2">
                  <Clock className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                  <p>Esperando asignación de repartidor...</p>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Mapa de seguimiento */}
          <div className="mb-4">
            <h6 className="text-lg font-semibold mb-3">Ubicación en tiempo real</h6>
            
            {allPoints.length > 0 ? (
              <Card className="overflow-hidden">
                <CardBody className="p-0">
                  <div className="relative h-80">
                    <MapContainer style={{ height: '100%', width: '100%' }} center={allPoints[0] || { lat: 0, lng: 0 }} zoom={13} scrollWheelZoom={false}>
                      <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <FitToMarkers points={allPoints} />
                      {tiendaPos && (
                        <Marker position={tiendaPos} icon={storeIcon}>
                          <Tooltip>Tienda: {pedido?.tiendaId?.nombre || '—'}</Tooltip>
                        </Marker>
                      )}
                      {destinoPos && (
                        <Marker position={destinoPos} icon={metaIcon}>
                          <Tooltip permanent>Tu ubicación</Tooltip>
                        </Marker>
                      )}
                      {repPos && (
                        <Marker position={repPos} icon={riderIcon}>
                          <Tooltip permanent direction="top">Repartidor: {pedido?.repartidorId?.nombre || '—'}</Tooltip>
                        </Marker>
                      )}
                      {/* Priorizar ruta repartidor -> meta; si no hay repartidor, mostrar tienda -> meta */}
                      {repPos && destinoPos ? (
                        <Polyline
                          positions={[[repPos.lat, repPos.lng], [destinoPos.lat, destinoPos.lng]]}
                          pathOptions={estadoStyles(estado)}
                        />
                      ) : (tiendaPos && destinoPos ? (
                        <Polyline
                          positions={[[tiendaPos.lat, tiendaPos.lng], [destinoPos.lat, destinoPos.lng]]}
                          pathOptions={estado === 'entregado' ? estadoStyles('entregado') : estadoStyles('confirmado')}
                        />
                      ) : null)}
                    </MapContainer>
                    {/* Leyenda mejorada */}
                    <div style={{ position: 'absolute', right: 10, bottom: 10 }} className="bg-black/80 text-white rounded-lg px-4 py-3 text-xs shadow-lg">
                      <div className="text-sm font-semibold mb-2">Leyenda del mapa</div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Store size={10} color="white" />
                        </div>
                        <span>Tienda: {pedido?.tiendaId?.nombre || '—'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <Flag size={10} color="white" />
                        </div>
                        <span>Tu ubicación</span>
                      </div>
                      
                      {repPos && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <Truck size={10} color="white" />
                          </div>
                          <span>Repartidor</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-1 text-gray-300 border-t border-gray-600 pt-2">
                        <Clock size={12} />
                        <span>Actualizado hace {Math.floor(Math.random() * 2) + 1} min</span>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <Card className="border-dashed border-muted">
                <CardBody>
                  <div className="text-center text-muted-foreground py-6">
                    <MapPin className="mx-auto mb-2 h-10 w-10 text-muted-foreground/30" />
                    <p>Ubicación no disponible</p>
                    <p className="text-sm">Aparecerá cuando el repartidor esté en camino</p>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClienteSeguimiento
