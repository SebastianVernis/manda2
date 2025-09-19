import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Container, Spinner, Alert, Badge, Row, Col, Card } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { FaHistory, FaShoppingCart } from 'react-icons/fa'
import api from '../../services/apiClient'
import { useNavigate } from 'react-router-dom'
import { getEstadoTexto, getEstadoColor, getEstadoIcono } from '../../utils/orderStates'


const ClientePedidos = () => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders-client'],
    queryFn: async () => {
      const res = await api.get('/orders', { params: { limit: 50 } })
      return res.data
    },
  })

  const pedidos = data?.pedidos || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Container className="py-4" style={{paddingTop: '3rem'}}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <FaHistory className="text-blue-400" />
            Mis Pedidos
          </h1>
          <p className="text-gray-400 text-lg">Revisa el estado de todos tus pedidos</p>
        </motion.div>

        {isLoading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="light" />
            <p className="text-white-50 mt-2">Cargando pedidos...</p>
          </div>
        )}
        
        {isError && (
          <Alert variant="danger" className="yega-glass border-0 text-white">
            No se pudieron cargar tus pedidos.
          </Alert>
        )}
        
        {!isLoading && !isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Row className="g-4 justify-content-center">
              {pedidos.map((o, index) => (
                <Col md={6} lg={4} key={o._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card 
                      className="yega-glass h-100 hover-card-effect cursor-pointer" 
                      onClick={() => navigate(`/cliente/seguimiento?id=${o._id}`)}
                    >
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <div className="fw-bold text-white fs-5">{o.tiendaId?.nombre ?? '—'}</div>
                            <div className="text-white-50 small">Pedido #{o.numero_pedido}</div>
                          </div>
                          <Badge bg={getEstadoColor(o.estado)} className="estado-badge">
                            <span className={o.estado.includes('camino') ? 'icon-repartidor-movimiento' : ''}>
                              {getEstadoIcono(o.estado)}
                            </span> 
                            {getEstadoTexto(o.estado)}
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-white-50 small mb-1">{new Date(o.createdAt).toLocaleString()}</div>
                          <div className="text-success fw-bold fs-4">${o.total?.toFixed?.(2) ?? o.total}</div>
                        </div>

                        <div>
                          <div className="progress progress-estado mb-3" style={{ height: '8px' }}>
                            <div 
                              className={`progress-bar bg-${getEstadoColor(o.estado)}`} 
                              role="progressbar"
                              style={{ 
                                width: `${(() => {
                                  const orden = ['pendiente', 'confirmado', 'preparando', 'listo', 'camino_tienda', 'recolectado', 'en_camino', 'entregado'];
                                  const idx = orden.indexOf(o.estado);
                                  if (idx === -1) return 0;
                                  return Math.round((idx / (orden.length - 1)) * 100);
                                })()}%` 
                              }}
                              aria-valuenow={(() => {
                                const orden = ['pendiente', 'confirmado', 'preparando', 'listo', 'camino_tienda', 'recolectado', 'en_camino', 'entregado'];
                                const idx = orden.indexOf(o.estado);
                                if (idx === -1) return 0;
                                return Math.round((idx / (orden.length - 1)) * 100);
                              })()}
                              aria-valuemin="0" 
                              aria-valuemax="100">
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <small className="text-white-50">
                              {(() => {
                                const orden = ['pendiente', 'confirmado', 'preparando', 'listo', 'camino_tienda', 'recolectado', 'en_camino', 'entregado'];
                                const idx = orden.indexOf(o.estado);
                                return `${Math.round((idx / (orden.length - 1)) * 100)}% completado`;
                              })()}
                            </small>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
              
              {pedidos.length === 0 && (
                <Col xs={12}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <Card className="yega-glass">
                      <Card.Body className="py-5">
                        <FaShoppingCart size={64} className="text-white-50 mb-4" />
                        <h4 className="text-white mb-3">No tienes pedidos aún</h4>
                        <p className="text-white-50 mb-4">Explora las tiendas y haz tu primer pedido</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="btn btn-primary"
                          onClick={() => navigate('/cliente/tiendas')}
                        >
                          Explorar Tiendas
                        </motion.button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              )}
            </Row>
          </motion.div>
        )}
      </Container>
    </div>
  )
}

export default ClientePedidos