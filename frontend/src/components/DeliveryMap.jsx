import React, { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../styles/map-styles.css'

// Arreglar iconos por defecto de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Crear iconos personalizados con SVG
const createCustomIcon = (color, svgPath) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${svgPath}
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  })
}

const homeSvg = `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>`
const storeSvg = `<path d="M3 9l2-4h14l2 4"></path><path d="M3 9v12h18V9"></path><path d="M3 13h18"></path><path d="M8 21V13"></path><path d="M16 21V13"></path>`
const deliverySvg = `<path d="M17 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path><path d="M5 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path><path d="M15 5h2a1 1 0 0 1 1 1v3.5h-4V10"></path><path d="M5 10h3.5L9 12.5h5M11.5 5h-7l-1 3h5.5"></path><path d="M12 17.5V15l-3-1.5v-2M3 18.5v-7"></path><path d="M19 18.5v-7L12.5 9"></path>`

const homeIcon = createCustomIcon('#28a745', homeSvg)
const storeIcon = createCustomIcon('#ffc107', storeSvg)
const deliveryIcon = createCustomIcon('#007bff', deliverySvg)

const DeliveryMap = ({ 
  order, 
  deliveryLocation = null, 
  height = '400px',
  className = '' 
}) => {
  if (!order) return null

  const storeLocation = order.tiendaId?.ubicacion
  const customerLocation = order.direccion_envio

  // Determinar centro del mapa
  const getMapCenter = () => {
    if (deliveryLocation) {
      return [deliveryLocation.latitud, deliveryLocation.longitud]
    }
    if (storeLocation) {
      return [storeLocation.latitud, storeLocation.longitud]
    }
    if (customerLocation?.latitud) {
      return [customerLocation.latitud, customerLocation.longitud]
    }
    // Ciudad de México por defecto
    return [19.4326, -99.1332]
  }

  const center = getMapCenter()
  
  // Definir los estilos de ruta según el estado del pedido
  const routeStyle = useMemo(() => {
    // Obtener estilo de ruta según estado del pedido
    const getEstiloRuta = () => {
      const estado = order.estado;
      switch (estado) {
        case 'pendiente':
        case 'confirmado':
        case 'preparando':
          return { color: '#6c757d', dashArray: '6 6', weight: 3 }; // gris punteado
        case 'listo':
          return { color: '#0d6efd', dashArray: '6 6', weight: 3 }; // azul punteado
        case 'camino_tienda':
          return { color: '#17a2b8', weight: 4 }; // cyan sólido
        case 'recolectado':
          return { color: '#6f42c1', weight: 4 }; // púrpura sólido
        case 'en_camino':
          return { color: '#ffc107', weight: 4 }; // amarillo sólido
        case 'entregado':
          return { color: '#28a745', weight: 4 }; // verde sólido
        case 'cancelado':
          return { color: '#dc3545', dashArray: '4 8', weight: 3 }; // rojo punteado
        default:
          return { color: '#6c757d', weight: 3 };
      }
    };
    return getEstiloRuta();
  }, [order.estado]);

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={14}
        style={{ height, width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marcador de la tienda */}
        {storeLocation && (
          <Marker 
            position={[storeLocation.latitud, storeLocation.longitud]}
            icon={storeIcon}
          >
            <Popup className="map-tooltip">
              <div>
                <strong>{order.tiendaId?.nombre || 'Tienda'}</strong>
                <br />
                <small>Origen del pedido</small>
                <br />
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${storeLocation.latitud},${storeLocation.longitud}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary mt-1"
                >
                  Ir con Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcador del cliente */}
        {customerLocation?.latitud && customerLocation?.longitud && (
          <Marker 
            position={[customerLocation.latitud, customerLocation.longitud]}
            icon={homeIcon}
          >
            <Popup className="map-tooltip">
              <div>
                <strong>{order.clienteId?.nombre || 'Cliente'}</strong>
                <br />
                <small>Dirección de entrega</small>
                <br />
                <div className="small">{customerLocation.calle} {customerLocation.numero}</div>
                <div className="small">{customerLocation.ciudad}</div>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${customerLocation.latitud},${customerLocation.longitud}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-success mt-1"
                >
                  Ir con Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcador del repartidor (si está disponible) */}
        {deliveryLocation && (
          <Marker 
            position={[deliveryLocation.latitud, deliveryLocation.longitud]}
            icon={deliveryIcon}
          >
            <Popup className="map-tooltip">
              <div>
                <strong>{order.repartidorId?.nombre || 'Repartidor'}</strong>
                <br />
                <small>Ubicación actual</small>
                <br />
                <small>Actualizado hace unos momentos</small>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Líneas de ruta */}
        {storeLocation && customerLocation?.latitud && customerLocation?.longitud && (
          <Polyline 
            positions={[
              [storeLocation.latitud, storeLocation.longitud], 
              [customerLocation.latitud, customerLocation.longitud]
            ]} 
            pathOptions={routeStyle}
          />
        )}
        
        {/* Ruta del repartidor al cliente (si ambos están disponibles) */}
        {deliveryLocation && customerLocation?.latitud && customerLocation?.longitud && 
          ['recolectado', 'en_camino'].includes(order.estado) && (
          <Polyline 
            positions={[
              [deliveryLocation.latitud, deliveryLocation.longitud], 
              [customerLocation.latitud, customerLocation.longitud]
            ]} 
            pathOptions={{ ...routeStyle, dashArray: order.estado === 'recolectado' ? '5 5' : null }}
          />
        )}
        
        {/* Ruta del repartidor a la tienda (si ambos están disponibles) */}
        {deliveryLocation && storeLocation && order.estado === 'camino_tienda' && (
          <Polyline 
            positions={[
              [deliveryLocation.latitud, deliveryLocation.longitud], 
              [storeLocation.latitud, storeLocation.longitud]
            ]} 
            pathOptions={routeStyle}
          />
        )}
      </MapContainer>
    </div>
  )
}

export default DeliveryMap