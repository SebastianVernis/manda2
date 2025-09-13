import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '../../services/apiClient'
import { Container, Alert, Button, Spinner, Row, Col, Form, InputGroup, Card, Badge, Modal } from 'react-bootstrap'
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

const TiendaProductos = () => {
  const [showCreate, setShowCreate] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', categoria: 'comida', disponible: true })

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      try {
        const res = await apiClient.products.getAll({ limit: 50 })
        return res.data
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
  })

  const productos = data?.productos || []

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock || '0', 10),
      }
      await apiClient.products.create(payload)
    },
    onSuccess: async () => {
      setShowCreate(false)
      resetForm()
      await refetch()
    },
    onError: async (error) => {
      console.error('Error al crear producto:', error);
      alert('Error al crear el producto, intenta de nuevo');
    }
  })

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock || '0', 10),
      }
      await apiClient.products.update(editingProduct._id, payload)
    },
    onSuccess: async () => {
      setEditingProduct(null)
      resetForm()
      await refetch()
    },
    onError: async (error) => {
      console.error('Error al actualizar producto:', error);
      alert('Error al actualizar el producto, intenta de nuevo');
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.products.delete(deletingProduct._id)
    },
    onSuccess: async () => {
      setDeletingProduct(null)
      await refetch()
    },
    onError: async (error) => {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto, intenta de nuevo');
      setDeletingProduct(null);
    }
  })

  const resetForm = () => {
    setForm({ nombre: '', descripcion: '', precio: '', stock: '', categoria: 'comida', disponible: true })
  }

  const handleEdit = (product) => {
    setForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio.toString(),
      stock: product.stock.toString(),
      categoria: product.categoria,
      disponible: product.disponible
    })
    setEditingProduct(product)
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    resetForm()
  }

  return (
    <Container className="py-4">
      <div className="text-center mb-3">
        <h2 className="text-yega-gold mb-2">Productos</h2>
        <div className="d-flex justify-content-center gap-2">
          <Button variant="outline-light" className="glass-btn" onClick={() => setShowCreate((s) => !s)}>
            {showCreate ? 'Cancelar' : 'Nuevo Producto'}
          </Button>
          <Button variant="outline-light" className="btn-yega-primary" onClick={() => refetch()}>
            Refrescar
          </Button>
        </div>
      </div>

      {(showCreate || editingProduct) && (
        <div className="glass-card mb-4 p-3">
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              if (editingProduct) {
                updateMutation.mutate()
              } else {
                createMutation.mutate()
              }
            }}
          >
            <h4 className="text-center mb-3 text-white">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h4>
            <Row className="g-2 align-items-end justify-content-center text-center">
              <Col md={3}>
                <Form.Label className="form-label-yega">Nombre</Form.Label>
                <Form.Control required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="glass-input" />
              </Col>
              <Col md={3}>
                <Form.Label className="form-label-yega">Descripción</Form.Label>
                <Form.Control required value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="glass-input" />
              </Col>
              <Col md={2}>
                <Form.Label className="form-label-yega">Precio</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="glass-input">$</InputGroup.Text>
                  <Form.Control required type="number" step="0.01" min="0" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} className="glass-input" />
                </InputGroup>
              </Col>
              <Col md={1}>
                <Form.Label className="form-label-yega">Stock</Form.Label>
                <Form.Control required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="glass-input" />
              </Col>
              <Col md={1}>
                <Form.Label className="form-label-yega">Cat.</Form.Label>
                <Form.Select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} className="glass-input">
                  <option value="comida">comida</option>
                  <option value="bebida">bebida</option>
                  <option value="postre">postre</option>
                  <option value="snack">snack</option>
                  <option value="otro">otro</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Label className="form-label-yega">Disponible</Form.Label>
                <div className="d-flex gap-2 justify-content-center">
                  <Form.Check
                    type="radio"
                    id="disponible-si"
                    label="Sí"
                    name="disponible"
                    checked={form.disponible === true}
                    onChange={() => setForm({ ...form, disponible: true })}
                    className="text-white"
                  />
                  <Form.Check
                    type="radio"
                    id="disponible-no"
                    label="No"
                    name="disponible"
                    checked={form.disponible === false}
                    onChange={() => setForm({ ...form, disponible: false })}
                    className="text-white"
                  />
                </div>
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2 justify-content-center">
              {editingProduct ? (
                <>
                  <Button type="submit" className="btn-yega-primary" disabled={updateMutation.isPending} style={{borderRadius: '12px'}}>
                    {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button variant="outline-light" className="glass-btn" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <>
                  <Button type="submit" className="btn-yega-primary" disabled={createMutation.isPending} style={{borderRadius: '12px'}}>
                    {createMutation.isPending ? 'Creando...' : 'Crear'}
                  </Button>
                  <Button variant="outline-light" className="glass-btn" onClick={() => setShowCreate(false)}>
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </Form>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}

      {isError && (
        <Alert variant="danger" className="glass-card" style={{background: "rgba(220,53,69,0.15)"}}>
          No se pudieron cargar los productos. Verifica tu conexión y sesión.
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          {productos.length === 0 ? (
            <Alert variant="warning" className="glass-card" style={{background: "rgba(255,193,7,0.15)"}}>
              No hay productos aún. Si estás en desarrollo, puedes crear el producto demo ejecutando
              <code className="ms-1">cd backend && npm run seed</code>.
            </Alert>
          ) : (
            <Row className="g-3">
              {productos.map((p) => (
                <Col md={6} lg={4} key={p._id}>
                  <Card className="glass-card h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="fw-bold">{p.nombre}</div>
                        <Badge bg={p.disponible ? 'success' : 'secondary'} className="glass-badge">{p.disponible ? 'Disponible' : 'No disponible'}</Badge>
                      </div>
                      <div className="text-white-50 small mt-1">{p.categoria}</div>
                      <div className="mt-2 text-white-70" style={{ minHeight: 40 }}>{p.descripcion}</div>
                      <div className="mt-3 d-flex justify-content-between align-items-center">
                        <div className="fw-bold">${p.precio?.toFixed?.(2) ?? p.precio}</div>
                        <div className="small">Stock: {p.stock}</div>
                      </div>
                      <div className="mt-2 d-flex justify-content-end gap-2">
                        <Button
                          size="sm"
                          className="glass-btn"
                          onClick={() => handleEdit(p)}
                          disabled={!!editingProduct}
                        >
                          <FaEdit /> Editar
                        </Button>
                        <Button
                          size="sm"
                          className="glass-btn"
                          style={{background: "rgba(220,53,69,0.15)"}}
                          onClick={() => setDeletingProduct(p)}
                          disabled={!!editingProduct}
                        >
                          <FaTrash /> Eliminar
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
      
      {/* Modal de confirmación para eliminar */}
      <Modal show={!!deletingProduct} onHide={() => setDeletingProduct(null)} centered dialogClassName="modal-dialog-custom" contentClassName="glass-modal-content" backdropClassName="modal-backdrop-custom" className="glass-modal">
        <Modal.Header closeButton style={{borderRadius: '20px 20px 0 0'}}>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deletingProduct && (
            <div>
              <p>¿Estás seguro que deseas eliminar el siguiente producto?</p>
              <div className="glass-card p-3 mb-3">
                <div className="fw-bold">{deletingProduct.nombre}</div>
                <div className="text-white-50 small">{deletingProduct.descripcion}</div>
                <div className="mt-1">Precio: ${deletingProduct.precio?.toFixed(2)}</div>
              </div>
              <p className="text-danger">Esta acción no se puede deshacer.</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{borderRadius: '0 0 20px 20px'}}>
          <Button className="glass-btn" onClick={() => setDeletingProduct(null)}>
            Cancelar
          </Button>
          <Button
            className="glass-btn"
            style={{background: "rgba(220,53,69,0.4)"}}
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Eliminando...' : 'Confirmar eliminación'}
          </Button>
        </Modal.Footer>
      </Modal>
      
    </Container>
  )
}

export default TiendaProductos