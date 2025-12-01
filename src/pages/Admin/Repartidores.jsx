import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Container, Row, Col, Table, Spinner, Alert, Form, Badge, Button, Modal, Collapse } from 'react-bootstrap'
import api from '../../services/apiClient'

const AdminRepartidores = () => {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState('')
  const [expandedDelivery, setExpandedDelivery] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [notes, setNotes] = useState('')
  const [viewMode, setViewMode] = useState('documents') // 'documents' or 'orders'

  const repartidoresQ = useQuery({
    queryKey: ['admin-delivery'],
    queryFn: async () => {
      const res = await api.get('/admin/users', { params: { rol: 'repartidor', limit: 200 } })
      return res.data.usuarios || []
    }
  })

  const pedidosQ = useQuery({
    enabled: !!selected && viewMode === 'orders',
    queryKey: ['admin-orders-by-delivery', selected],
    queryFn: async () => {
      const res = await api.get('/orders', { params: { repartidorId: selected, limit: 50 } })
      return res.data
    },
    refetchInterval: 5000,
  })

  // Document approval/rejection mutations
  const approveMutation = useMutation({
    mutationFn: async ({ userId, docType, notes }) => {
      await api.post(`/admin/users/${userId}/documents/${docType}/approve`, { notes })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-delivery'])
      setShowModal(false)
      setNotes('')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: async ({ userId, docType, notes }) => {
      await api.post(`/admin/users/${userId}/documents/${docType}/reject`, { notes })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-delivery'])
      setShowModal(false)
      setNotes('')
    },
  })

  const handleApprove = (userId, docType) => {
    setSelectedDoc({ userId, docType, action: 'approve' })
    setShowModal(true)
  }

  const handleReject = (userId, docType) => {
    setSelectedDoc({ userId, docType, action: 'reject' })
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (selectedDoc?.action === 'approve') {
      approveMutation.mutate({ 
        userId: selectedDoc.userId, 
        docType: selectedDoc.docType, 
        notes 
      })
    } else {
      rejectMutation.mutate({ 
        userId: selectedDoc.userId, 
        docType: selectedDoc.docType, 
        notes 
      })
    }
  }

  const getDocTypeLabel = (tipo) => {
    const labels = {
      'id_doc': 'Identificación',
      'licencia': 'Licencia de Conducir',
      'tarjeta_circulacion': 'Tarjeta de Circulación',
      'poliza_seguro': 'Póliza de Seguro'
    }
    return labels[tipo] || tipo
  }

  const getDocumentStatus = (doc) => {
    if (!doc) return { badge: 'secondary', text: 'No subido' }
    if (doc.status === 'pendiente') return { badge: 'warning', text: 'Pendiente' }
    if (doc.status === 'aprobado') return { badge: 'success', text: 'Aprobado' }
    if (doc.status === 'rechazado') return { badge: 'danger', text: 'Rechazado' }
    return { badge: 'secondary', text: 'Desconocido' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-4">
      <Container className="py-4">
        <Row className="align-items-end g-2 mb-3">
          <Col>
            <h2 className="text-manda2-gold mb-0">Repartidores</h2>
          </Col>
          <Col md={3}>
            <Form.Label className="form-label-manda2">Vista</Form.Label>
            <Form.Select value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
              <option value="documents">Ver Documentos</option>
              <option value="orders">Ver Pedidos</option>
            </Form.Select>
          </Col>
          {viewMode === 'orders' && (
            <Col md={4}>
              <Form.Label className="form-label-manda2">Selecciona un repartidor</Form.Label>
              <Form.Select value={selected} onChange={(e) => setSelected(e.target.value)}>
                <option value="">—</option>
                {repartidoresQ.data?.map(r => (
                  <option key={r._id} value={r._id}>{r.nombre} ({r.email})</option>
                ))}
              </Form.Select>
            </Col>
          )}
        </Row>

      {repartidoresQ.isLoading && <div className="text-center py-5"><Spinner animation="border" /></div>}
      {repartidoresQ.isError && <Alert variant="danger">No se pudieron cargar los repartidores.</Alert>}

      {viewMode === 'documents' && !repartidoresQ.isLoading && !repartidoresQ.isError && (
        <Table className="table-dark table-striped" responsive>
          <thead>
            <tr>
              <th className="text-white">Nombre</th>
              <th className="text-white">Email</th>
              <th className="text-white">Estado</th>
              <th className="text-white">Documentos</th>
              <th className="text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {repartidoresQ.data?.map((r) => (
              <React.Fragment key={r._id}>
                <tr>
                  <td className="text-white">{r.nombre}</td>
                  <td className="text-white">{r.email}</td>
                  <td>
                    <Badge bg={r.estado_validacion === 'aprobado' ? 'success' : r.estado_validacion === 'pendiente' ? 'warning' : 'danger'}>
                      {r.estado_validacion}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      {['id_doc', 'licencia', 'tarjeta_circulacion', 'poliza_seguro'].map(docType => {
                        const doc = r.verificaciones?.[docType]
                        const status = getDocumentStatus(doc)
                        return (
                          <Badge 
                            key={docType} 
                            bg={status.badge}
                            className="small"
                          >
                            {getDocTypeLabel(docType)}: {status.text}
                          </Badge>
                        )
                      })}
                    </div>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-info"
                      onClick={() => setExpandedDelivery(expandedDelivery === r._id ? null : r._id)}
                    >
                      {expandedDelivery === r._id ? 'Ocultar' : 'Ver Detalles'}
                    </Button>
                  </td>
                </tr>
                
                <tr>
                  <td colSpan={5} className="p-0">
                    <Collapse in={expandedDelivery === r._id}>
                      <div className="card-manda2 manda2-glass p-3 border-start border-warning border-3">
                        <h6 className="text-warning mb-3">Documentos de Verificación</h6>
                        
                        {['id_doc', 'licencia', 'tarjeta_circulacion', 'poliza_seguro'].map(docType => {
                          const doc = r.verificaciones?.[docType]
                          const status = getDocumentStatus(doc)
                          
                          return (
                            <div key={docType} className="mb-3 p-2 bg-dark bg-opacity-50 rounded">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <strong className="text-white">{getDocTypeLabel(docType)}</strong>
                                  <br />
                                  <Badge bg={status.badge} className="me-2">{status.text}</Badge>
                                  {doc && (
                                    <>
                                      <small className="text-white-50">
                                        Subido: {new Date(doc.uploadedAt).toLocaleString()}
                                      </small>
                                      {doc.notes && (
                                        <div className="text-white-50 small mt-1">
                                          <strong>Notas:</strong> {doc.notes}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                                
                                <div className="d-flex gap-2">
                                  {doc && doc.file && (
                                    <Button
                                      size="sm"
                                      variant="outline-light"
                                      href={doc.file.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL.replace('/api', '')}${doc.file}` : doc.file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Ver Documento
                                    </Button>
                                  )}
                                  
                                  {doc && doc.status === 'pendiente' && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="success"
                                        onClick={() => handleApprove(r._id, docType)}
                                        disabled={approveMutation.isPending}
                                      >
                                        Aprobar
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleReject(r._id, docType)}
                                        disabled={rejectMutation.isPending}
                                      >
                                        Rechazar
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        
                        <div className="mt-3 pt-2 border-top border-gray-700">
                          <small className="text-muted">
                            <strong>Información adicional:</strong><br />
                            Teléfono: {r.telefono} | Estado: {r.estado_validacion}
                          </small>
                        </div>
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))}
            {(repartidoresQ.data?.length || 0) === 0 && (
              <tr><td colSpan={5} className="text-center text-muted py-4">Sin repartidores</td></tr>
            )}
          </tbody>
        </Table>
      )}

      {viewMode === 'orders' && selected && (
        <>
          <h5 className="text-manda2-silver">Pedidos del repartidor</h5>
          {pedidosQ.isLoading && <div className="text-center py-3"><Spinner animation="border" /></div>}
          {pedidosQ.isError && <Alert variant="danger">No se pudieron cargar los pedidos.</Alert>}
          {!pedidosQ.isLoading && !pedidosQ.isError && (
            <Table className="table-dark table-striped" responsive>
              <thead>
                <tr>
                  <th>Nº Pedido</th>
                  <th>Fecha</th>
                  <th>Tienda</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidosQ.data?.pedidos?.map(o => (
                  <tr key={o._id}>
                    <td>{o.numero_pedido}</td>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                    <td>{o.tiendaId?.nombre ?? '—'}</td>
                    <td>{o.clienteId?.nombre ?? '—'}</td>
                    <td><Badge bg="secondary">{o.estado}</Badge></td>
                    <td>${o.total?.toFixed?.(2) ?? o.total}</td>
                  </tr>
                ))}
                {(pedidosQ.data?.pedidos?.length || 0) === 0 && (
                  <tr><td colSpan={6} className="text-center text-muted py-4">Sin pedidos</td></tr>
                )}
              </tbody>
            </Table>
          )}
        </>
      )}

      {/* Modal for document approval/rejection */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDoc?.action === 'approve' ? 'Aprobar Documento' : 'Rechazar Documento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Notas (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agrega cualquier nota relevante..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant={selectedDoc?.action === 'approve' ? 'success' : 'danger'}
            onClick={handleSubmit}
            disabled={approveMutation.isPending || rejectMutation.isPending}
          >
            {approveMutation.isPending || rejectMutation.isPending ? 'Procesando...' : 
             selectedDoc?.action === 'approve' ? 'Aprobar' : 'Rechazar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  </div>
  )
}

export default AdminRepartidores
