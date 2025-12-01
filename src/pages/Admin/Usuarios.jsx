import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Container, Table, Row, Col, Form, Button, Badge, Spinner, Alert } from 'react-bootstrap'
import api from '../../services/apiClient'

const AdminUsuarios = () => {
  const [buscar, setBuscar] = useState('')
  const [rol, setRol] = useState('')
  const [estado, setEstado] = useState('')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-users', { buscar, rol, estado }],
    queryFn: async () => {
      const res = await api.get('/admin/users', {
        params: {
          buscar: buscar || undefined,
          rol: rol || undefined,
          estado: estado || undefined,
          limit: 50,
        },
      })
      return res.data
    },
  })

  const usuarios = data?.usuarios || []

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      await api.post(`/admin/users/${id}/approve`)
    },
    onSuccess: () => refetch(),
  })

  const rejectMutation = useMutation({
    mutationFn: async ({ id, motivo }) => {
      await api.post(`/admin/users/${id}/reject`, { motivo, desactivar: false })
    },
    onSuccess: () => refetch(),
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-4">
      <Container className="py-4">
      <Row className="align-items-end g-2 mb-3">
        <Col md={4}>
          <Form.Label className="form-label-manda2">Buscar</Form.Label>
          <Form.Control
            placeholder="Nombre, email o teléfono"
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Label className="form-label-manda2">Rol</Form.Label>
          <Form.Select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="">Todos</option>
            <option value="cliente">Cliente</option>
            <option value="tienda">Tienda</option>
            <option value="repartidor">Repartidor</option>
            <option value="administrador">Administrador</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Label className="form-label-manda2">Estado</Form.Label>
          <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </Form.Select>
        </Col>
        <Col md={2} className="d-grid">
          <Button className="btn-manda2-primary" onClick={() => refetch()}>Filtrar</Button>
        </Col>
      </Row>

      {isLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}

      {isError && (
        <Alert variant="danger">No se pudieron cargar los usuarios.</Alert>
      )}

      {!isLoading && !isError && (
        <Table className="table-dark table-striped align-middle" responsive>
          <thead>
            <tr>
              <th className="text-white">Nombre</th>
              <th className="text-white">Email</th>
              <th className="text-white">Teléfono</th>
              <th className="text-white">Rol</th>
              <th className="text-white">Estado</th>
              <th className="text-white">Activo</th>
              <th className="text-white">Alta</th>
              <th className="text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id}>
                <td className="text-white">{u.nombre}</td>
                <td className="text-white">{u.email}</td>
                <td className="text-white">{u.telefono}</td>
                <td><Badge bg="secondary">{u.rol}</Badge></td>
                <td>
                  <Badge bg={u.estado_validacion === 'aprobado' ? 'success' : u.estado_validacion === 'rechazado' ? 'danger' : 'warning'}>
                    {u.estado_validacion}
                  </Badge>
                </td>
                <td className="text-white">{u.activo ? 'Sí' : 'No'}</td>
                <td className="text-white">{new Date(u.createdAt).toLocaleString()}</td>
                <td className="text-nowrap">
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      className="btn-manda2-primary"
                      disabled={u.estado_validacion === 'aprobado' || approveMutation.isPending}
                      onClick={() => approveMutation.mutate(u._id)}
                    >
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-light"
                      className="btn-manda2-secondary"
                      disabled={u.estado_validacion === 'rechazado' || rejectMutation.isPending}
                      onClick={() => {
                        const motivo = prompt('Motivo de rechazo (opcional):') || undefined
                        rejectMutation.mutate({ id: u._id, motivo })
                      }}
                    >
                      Rechazar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-white-50 py-4">Sin resultados</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  </div>
  )
}

export default AdminUsuarios
