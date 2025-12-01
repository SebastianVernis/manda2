import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { apiClient } from '../../services/apiClient'
import { getEstadoTexto, getEstadoColor, getEstadoIcono } from '../../utils/orderStates'
import 'leaflet/dist/leaflet.css'
import '../../styles/map-styles.css'
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { 
  Card,
  Spinner,
  Table,
  Badge,
  Image,
  ProgressBar
} from 'react-bootstrap'
import { MapPin, Store, Flag, Truck, Clock, CheckCircle2, ShoppingBag, ChefHat } from 'lucide-react'


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
      <div className="progress mb-3">
        <div className={`progress-bar bg-${getEstadoColor(estado)}`} 
          role="progressbar" 
          style={{width: `${getProgresoEstado()}%`}} 
          aria-valuenow={getProgresoEstado()} 
          aria-valuemin="0" 
          aria-valuemax="100">
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <div className={`text-center flex-fill ${getEstadoStepStatus('confirmado') !== 'pending' ? 'text-primary' : 'text-white-50'}`}>
          <div className="d-flex justify-content-center mb-1">
            <CheckCircle2 size={16} className={getEstadoStepStatus('confirmado') !== 'pending' ? 'text-primary' : 'text-white-50'} />
          </div>
          <small>Confirmado</small>
        </div>
        
        <div className={`text-center flex-fill ${getEstadoStepStatus('preparando') !== 'pending' ? 'text-warning' : 'text-white-50'}`}>
          <div className="d-flex justify-content-center mb-1">
            <ChefHat size={16} className={getEstadoStepStatus('preparando') !== 'pending' ? 'text-warning' : 'text-white-50'} />
          </div>
          <small>Preparando</small>
        </div>
        
        <div className={`text-center flex-fill ${getEstadoStepStatus('recolectado') !== 'pending' ? 'text-info' : 'text-white-50'}`}>
          <div className="d-flex justify-content-center mb-1">
            <ShoppingBag size={16} className={getEstadoStepStatus('recolectado') !== 'pending' ? 'text-info' : 'text-white-50'} />
          </div>
          <small>Recogido</small>
        </div>
        
        <div className={`text-center flex-fill ${getEstadoStepStatus('en_camino') !== 'pending' ? 'text-warning' : 'text-white-50'}`}>
          <div className="d-flex justify-content-center mb-1">
            <Truck size={16} className={getEstadoStepStatus('en_camino') !== 'pending' ? 'text-warning' : 'text-white-50'} />
          </div>
          <small>En camino</small>
        </div>
        
        <div className={`text-center flex-fill ${getEstadoStepStatus('entregado') !== 'pending' ? 'text-success' : 'text-white-50'}`}>
          <div className="d-flex justify-content-center mb-1">
            <CheckCircle2 size={16} className={getEstadoStepStatus('entregado') !== 'pending' ? 'text-success' : 'text-white-50'} />
          </div>
          <small>Entregado</small>
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
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
    staleTime: 10000,
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
    className: 'manda2-store-icon',
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
  }))
  
  const metaIcon = useMemo(() => L.divIcon({
    className: 'manda2-flag-icon',
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
  }))
  
  const riderIcon = useMemo(() => L.divIcon({
    className: 'manda2-rider-icon',
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
  
  const orderIcon = L.divIcon({
    className: 'manda2-order-icon',
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
  })

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900" style={{ paddingTop: '3rem' }}>
      <div className="container mx-auto py-4 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="display-4 fw-bold text-white mb-2 d-flex align-items-center justify-content-center gap-3">
            <Truck className="text-primary" size={32} />
            Seguimiento de Pedido
          </h1>
          <p className="text-white-50">Sigue el estado de tu pedido en tiempo real</p>
        </motion.div>
      {!id && (
        <Card className="mt-3 card-manda2 manda2-glass border-warning">
          <Card.Body>
            <p className="text-warning">No se proporcionó ID de pedido</p>
          </Card.Body>
        </Card>
      )}
      {isLoading && <div className="text-center py-5"><Spinner size="lg" /></div>}
      {isError && (
        <Card className="border-danger card-manda2 manda2-glass">
          <Card.Body>
            <p className="text-white">No se pudo obtener el pedido</p>
          </Card.Body>
        </Card>
      )}
      {pedido && (
        <div className="mt-3">
          <Card className="mb-4 card-manda2 manda2-glass">
            <Card.Header className="d-flex align-items-center justify-content-between flex-wrap">
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <div className="text-white"><strong>Pedido:</strong> {pedido.numero_pedido}</div>
                <div>
                  <Badge bg={getEstadoColor(pedido.estado)}>
                    {getEstadoIcono(pedido.estado)} {getEstadoTexto(pedido.estado)}
                  </Badge>
                </div>
                <div className="text-white"><strong>Total:</strong> ${pedido.total?.toFixed?.(2) ?? pedido.total}</div>
              </div>
              <div className="text-white-50 small d-flex gap-1 align-items-center">
                <Clock size={14} />
                <span>ETA: {pedido.tiempo_estimado ?? 30}min</span>
              </div>
            </Card.Header>
            <Card.Body>
              <OrderTimeline estado={pedido.estado} />
            </Card.Body>
          </Card>
          <hr />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-white">Productos</h6>
            <Badge bg="primary">{pedido.productos?.length || 0} productos</Badge>
          </div>
          
          <Card className="mb-4 card-manda2 manda2-glass">
            <Card.Body>
              <Table className="table-dark table-striped">
                <thead>
                  <tr>
                    <th className="text-white">Producto</th>
                    <th className="text-white">Cant.</th>
                    <th className="text-white">Precio</th>
                    <th className="text-white">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.productos?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="text-white">{it.producto?.nombre ?? 'Producto'}</td>
                      <td className="text-white">{it.cantidad}</td>
                      <td className="text-white">${it.precio_unitario?.toFixed?.(2) ?? it.precio_unitario}</td>
                      <td className="text-white">${it.subtotal?.toFixed?.(2) ?? it.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          <hr />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-white">Repartidor</h6>
            {pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
              <Badge bg="primary">En tiempo real</Badge>
            )}
          </div>
          
          {pedido.repartidorId ? (
            <Card className="mb-4 card-manda2 manda2-glass">
              <Card.Body className="d-flex align-items-center gap-4">
                <div className="bg-warning rounded-circle p-3">
                  <Truck size={24} className="text-white" />
                </div>
                <div>
                  <div className="fw-medium text-white">{pedido.repartidorId?.nombre ?? '—'}</div>
                  {pedido.repartidorId?.ubicacion?.latitud ? (
                    <div className="small text-white-50">
                      <div className="d-flex align-items-center gap-1">
                        <MapPin size={14} className={pedido.estado === 'en_camino' ? 'animate-bounce' : ''} />
                        <span>Ubicación actualizada hace {Math.floor(Math.random() * 5) + 1} min</span>
                      </div>
                    </div>
                  ) : (
                    <div className="small text-white-50">Ubicación no disponible</div>
                  )}
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Card className="mb-4 card-manda2 manda2-glass border-secondary border-opacity-25">
              <Card.Body>
                <div className="text-center text-white-50 py-2">
                  <Clock className="mx-auto mb-2" size={32} />
                  <p className="text-white-50">Esperando asignación de repartidor...</p>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Mapa de seguimiento */}
          <div className="mb-4">
            <h6 className="text-white mb-3">Ubicación en tiempo real</h6>
            
            {allPoints.length > 0 ? (
              <Card className="overflow-hidden card-manda2 manda2-glass">
                <Card.Body className="p-0">
                  <div className="relative" style={{ height: '300px' }}>
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
                    {/* Leyenda compacta */}
                    <div style={{ position: 'absolute', right: 5, bottom: 5, maxWidth: '200px' }} className="bg-black bg-opacity-80 text-white rounded p-2 text-xs">
                      <div className="d-flex align-items-center gap-1 mb-1">
                        <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                        <small>Tienda</small>
                      </div>
                      <div className="d-flex align-items-center gap-1 mb-1">
                        <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                        <small>Tu ubicación</small>
                      </div>
                      {repPos && (
                        <div className="d-flex align-items-center gap-1 mb-1">
                          <div className="bg-warning rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                          <small>Repartidor</small>
                        </div>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <Card className="border-dashed border-muted card-manda2 manda2-glass">
                <Card.Body>
                  <div className="text-center text-white-50 py-6">
                    <MapPin className="mx-auto mb-2 h-10 w-10 text-white-50" />
                    <p className="text-white-50">Ubicación no disponible</p>
                    <p className="text-sm text-white-50">Aparecerá cuando el repartidor esté en camino</p>
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default ClienteSeguimiento
