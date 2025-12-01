import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Container, Table, Spinner, Alert, Badge, Button, Modal, Form, Collapse } from 'react-bootstrap'
import api from '../../services/apiClient'

const AdminTiendas = () => {
  const queryClient = useQueryClient()
  const [expandedStore, setExpandedStore] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [notes, setNotes] = useState('')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: async () => {
      const res = await api.get('/admin/users', { params: { rol: 'tienda', limit: 100 } })
      return res.data
    },
  })

  // Approve document mutation
  const approveMutation = useMutation({
    mutationFn: async ({ userId, docType, notes }) => {
      await api.post(`/admin/users/${userId}/documents/${docType}/approve`, { notes })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-stores'])
      setShowModal(false)
      setNotes('')
    },
  })

  // Reject document mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ userId, docType, notes }) => {
      await api.post(`/admin/users/${userId}/documents/${docType}/reject`, { notes })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-stores'])
      setShowModal(false)
      setNotes('')
    },
  })

  const tiendas = data?.usuarios || []

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
      'comprobante_domicilio': 'Comprobante de Domicilio'
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
        <h2 className="text-manda2-gold mb-3">Tiendas</h2>

        {isLoading && (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        )}

        {isError && <Alert variant="danger">No se pudieron cargar las tiendas.</Alert>}

        {!isLoading && !isError && (
          <>
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
                {tiendas.map((t) => (
                  <React.Fragment key={t._id}>
                    <tr>
                      <td className="text-white">{t.nombre}</td>
                      <td className="text-white">{t.email}</td>
                      <td>
                        <Badge bg={t.estado_validacion === 'aprobado' ? 'success' : t.estado_validacion === 'pendiente' ? 'warning' : 'danger'}>
                          {t.estado_validacion}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {['id_doc', 'comprobante_domicilio'].map(docType => {
                            const doc = t.verificaciones?.[docType]
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
                          onClick={() => setExpandedStore(expandedStore === t._id ? null : t._id)}
                        >
                          {expandedStore === t._id ? 'Ocultar' : 'Ver Detalles'}
                        </Button>
                      </td>
                    </tr>
                    
                    <tr>
                      <td colSpan={5} className="p-0">
                        <Collapse in={expandedStore === t._id}>
                          <div className="card-manda2 manda2-glass p-3 border-start border-warning border-3">
                            <h6 className="text-warning mb-3">Documentos de Verificación</h6>
                            
                            {['id_doc', 'comprobante_domicilio'].map(docType => {
                              const doc = t.verificaciones?.[docType]
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
                                            onClick={() => handleApprove(t._id, docType)}
                                            disabled={approveMutation.isPending}
                                          >
                                            Aprobar
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleReject(t._id, docType)}
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
                                Teléfono: {t.telefono} | 
                                Ubicación: {t.ubicacion?.direccion || (t.ubicacion ? `${t.ubicacion.latitud}, ${t.ubicacion.longitud}` : 'No especificada')}
                              </small>
                            </div>
                          </div>
                        </Collapse>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                {tiendas.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-muted py-4">Sin tiendas</td></tr>
                )}
              </tbody>
            </Table>

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
          </>
        )}
      </Container>
    </div>
  )
}

export default AdminTiendas
