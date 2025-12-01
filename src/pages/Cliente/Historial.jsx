import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Container, Spinner, Row, Col, Card, Badge } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { FaHistory, FaCalendarAlt } from 'react-icons/fa'
import api from '../../services/apiClient'
import { useNavigate } from 'react-router-dom'
import ModernNavbar from '../../components/modern/ModernNavbar'

const ClienteHistorial = () => {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders-client-history'],
    queryFn: async () => {
      const res = await api.get('/orders', { params: { limit: 100 } })
      return res.data
    },
  })

  const pedidos = (data?.pedidos || []).filter(o => ['entregado','cancelado'].includes(o.estado))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <ModernNavbar />
      
      <Container className="py-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <FaHistory className="text-purple-400" />
            Historial Completo
          </h1>
          <p className="text-gray-400 text-lg">Revisa todos tus pedidos anteriores</p>
        </motion.div>

        {isLoading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="light" />
            <p className="text-white-50 mt-2">Cargando historial...</p>
          </div>
        )}
        
        {isError && (
          <Alert variant="danger" className="manda2-glass border-0 text-white">
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
                      className="manda2-glass h-100 hover-card-effect cursor-pointer" 
                      onClick={() => navigate(`/cliente/seguimiento?id=${o._id}`)}
                    >
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <div className="fw-bold text-white fs-5">{o.tiendaId?.nombre ?? '—'}</div>
                            <div className="text-white-50 small">Pedido #{o.numero_pedido}</div>
                          </div>
                          <Badge bg={o.estado === 'entregado' ? 'success' : 'secondary'}>
                            {o.estado}
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-white-50 small mb-1">{new Date(o.createdAt).toLocaleString()}</div>
                          <div className="text-success fw-bold fs-4">${o.total?.toFixed?.(2) ?? o.total}</div>
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
                    <Card className="manda2-glass">
                      <Card.Body className="py-5">
                        <FaCalendarAlt size={64} className="text-white-50 mb-4" />
                        <h4 className="text-white mb-3">Tu historial está vacío</h4>
                        <p className="text-white-50 mb-4">Aquí aparecerán tus pedidos completados</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="btn btn-primary"
                          onClick={() => navigate('/cliente/tiendas')}
                        >
                          Hacer mi Primer Pedido
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

export default ClienteHistorial