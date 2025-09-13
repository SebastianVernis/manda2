import React, { useRef, useState } from 'react'
import { Button, Badge } from 'react-bootstrap'
import { apiClient } from '../services/apiClient'

const statusBadge = (status) => {
  switch (status) {
    case 'aprobado': return <Badge bg="success">Aprobado</Badge>
    case 'rechazado': return <Badge bg="danger">Rechazado</Badge>
    case 'pendiente':
    default: return <Badge bg="warning" text="dark">Pendiente</Badge>
  }
}

const DocumentUploader = ({ tipo, label, current }) => {
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState(current || null)

  const onUpload = async () => {
    if (!file) return
    setLoading(true)
    try {
      const res = await apiClient.documents.upload(tipo, file)
      setInfo(res.data.verificaciones?.[tipo] || null)
    } catch (e) {
      alert(e.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-3 p-3 rounded border border-white/10 bg-white/5 text-center">
      <div className="d-flex justify-content-between align-items-center">
        <div className="text-start">
          <strong>{label}</strong>{' '}
          {info?.status && statusBadge(info.status)}
        </div>
        {info?.file && (
          <a href={info.file} target="_blank" rel="noopener noreferrer" className="small">Ver archivo</a>
        )}
      </div>
      {info?.notes && (
        <div className="text-danger small mt-1 text-start">Observaciones: {info.notes}</div>
      )}
      <div className="d-flex flex-column align-items-center gap-2 mt-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          style={{ display: 'none' }}
        />
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-light" className="btn-yega-secondary" onClick={() => fileInputRef.current?.click()}>
            Elegir archivo
          </Button>
          <Button size="sm" className="btn-yega-primary" disabled={!file || loading} onClick={onUpload}>
            {loading ? 'Subiendo...' : 'Subir'}
          </Button>
        </div>
        <div className="small text-white-50" style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {file ? file.name : ''}
        </div>
      </div>
    </div>
  )
}

export default DocumentUploader
