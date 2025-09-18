# Tareas Pendientes - Panel de Administración

Este documento lista las tareas pendientes para la implementación del panel de administración y la lógica de validación de documentos.

## Backend

### Fase 2: API de Revisión de Documentos para el Administrador
- [ ] **Implementar `getPendingDocuments` en `controllers/adminController.js`:**
  - [ ] Consultar el modelo `Usuario` para encontrar usuarios con documentos en estado `pendiente`.
  - [ ] Devolver los datos relevantes del usuario y del documento.
  - [ ] **Nota:** La ruta ya está definida en `routes/adminRoutes.js` (`/api/admin/documents/pending`).

## Frontend

### Fase 5: UI del Panel de Administración
- [ ] **Crear componente de página `pages/Admin/DocumentReview.jsx`:**
  - [ ] Fetch data from `/api/admin/documents/pending`.
  - [ ] Display a list of users with their pending documents.
  - [ ] For each document, display its details (type, file link, status, notes).
  - [ ] Provide "Approve" and "Reject" buttons, and a text area for admin notes.
  - [ ] Call the `approveDocument` and `rejectDocument` API endpoints.
- [ ] **Añadir ruta para la nueva página en `App.jsx`:**
  - [ ] Ruta: `/admin/documents`
  - [ ] Componente: `DocumentReview.jsx`
- [ ] **Añadir enlace a la nueva página en `AdminDashboard.jsx`:**
  - [ ] Crear una nueva tarjeta que enlace a `/admin/documents`.

## Tareas Generales / Estilos

- [ ] **Asegurar la consistencia del fondo de gradiente en todas las pantallas:**
  - [ ] Verificar que el estilo `min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900` se aplique correctamente a todas las páginas.
  - [ ] **Nota:** Esto fue lo último que se estaba trabajando y el usuario indicó que aún no está en todas las pantallas.

---

**Consideraciones:**
- La lógica de subida de documentos en el backend (`documentController.js`) y el envío de correos de aprobación/rechazo (`adminController.js`) ya están implementados.
- El componente `DocumentUploader.jsx` en el frontend ya es funcional para la subida.
