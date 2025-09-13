import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Container, Table, Spinner, Alert, Badge } from 'react-bootstrap'
import api from '../../services/apiClient'

const AdminTiendas = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: async () => {
      const res = await api.get('/admin/users', { params: { rol: 'tienda', limit: 100 } })
      return res.data
    },
  })

  const tiendas = data?.usuarios || []

  return (
    <Container className="py-4">
      <h2 className="text-yega-gold mb-3">Tiendas</h2>

      {isLoading && (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      )}

      {isError && <Alert variant="danger">No se pudieron cargar las tiendas.</Alert>}

      {!isLoading && !isError && (
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {tiendas.map((t) => (
              <tr key={t._id}>
                <td>{t.nombre}</td>
                <td>{t.email}</td>
                <td>{t.telefono}</td>
                <td>
                  <Badge bg={t.estado_validacion === 'aprobado' ? 'success' : t.estado_validacion === 'pendiente' ? 'warning' : 'danger'}>
                    {t.estado_validacion}
                  </Badge>
                </td>
                <td>{t.ubicacion?.direccion || (t.ubicacion ? `${t.ubicacion.latitud}, ${t.ubicacion.longitud}` : '—')}</td>
              </tr>
            ))}
            {tiendas.length === 0 && (
              <tr><td colSpan={5} className="text-center text-muted py-4">Sin tiendas</td></tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  )
}

export default AdminTiendas
