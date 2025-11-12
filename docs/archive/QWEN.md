# Órdenes para Qwen - Manda2 Platform Management

## 🎯 Objetivo Principal

Implementar funcionalidad completa de administración de documentos y mantener la plataforma Manda2 en estado production-ready.

## 📋 Comandos de Desarrollo

```bash
# Iniciar servicios de desarrollo
cd backend && npm run dev     # Backend en puerto 5000
cd frontend && npm run dev    # Frontend en puerto 3000

# Testing y calidad
npm run lint                  # ESLint check
npm test                      # Run tests
npm run build                 # Build producción

# Deployment
pm2 start ecosystem.config.js
pm2 status
pm2 logs
```

## 🔧 Tareas Delegadas

### 1. 🔐 Backend: API de Revisión de Documentos

**Archivo:** `backend/controllers/adminController.js`  
**Comando:** Implementar función `getPendingDocuments`

**Especificaciones:**
- **Query MongoDB:** `Usuario.find({ 'documentos.estado': 'pendiente' })`
- **Proyección:** Incluir campos: `nombre`, `email`, `rol`, `documentos`, `fechaRegistro`
- **Response Format:** `{ success: true, data: [...usuarios], count: N }`
- **Error Handling:** Try-catch con response `{ success: false, error: message }`
- **Ruta:** `/api/admin/documents/pending` (ya existe)

**Validaciones:**
- Verificar que el usuario sea admin (`req.user.rol === 'administrador'`)
- Sanitizar datos de salida
- Agregar paginación si >50 resultados

### 2. 🎨 Frontend: UI Panel Administración

**2.1. Componente Principal**

**Archivo:** `frontend/src/pages/Admin/DocumentReview.jsx`

**Estructura React:**
```jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import apiClient from '../../services/apiClient';

const DocumentReview = () => {
  // Estados: documents, loading, error
  // useEffect para fetch inicial
  // Funciones: handleApprove, handleReject
  // UI: Cards con documentos + acciones
};
```

**Especificaciones UI:**
- **Layout:** `min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900`
- **Cards:** Bootstrap cards para cada usuario con documentos
- **Buttons:** `btn-success` (Aprobar) / `btn-danger` (Rechazar)
- **Modal:** Para confirmación de acciones con textarea para notas
- **Estados:** Loading spinner, empty state, error handling
- **Toast:** Notifications para success/error

**API Integration:**
- GET `/api/admin/documents/pending`
- PUT `/api/admin/documents/approve/:userId/:docId`
- PUT `/api/admin/documents/reject/:userId/:docId`

**2.2. Configuración de Rutas**

**Archivo:** `frontend/src/App.jsx`
```jsx
// Agregar import
import DocumentReview from './pages/Admin/DocumentReview';

// Agregar ruta protegida
<Route path="/admin/documents" element={
  <ProtectedRoute requiredRole="administrador">
    <DocumentReview />
  </ProtectedRoute>
} />
```

**2.3. Dashboard Integration**

**Archivo:** `frontend/src/pages/Admin/Dashboard.jsx`
```jsx
// Agregar card en dashboard
<div className="card text-white bg-primary">
  <div className="card-body">
    <h5>📋 Documentos Pendientes</h5>
    <p>Revisar y aprobar documentos</p>
    <Link to="/admin/documents" className="btn btn-light">
      Gestionar Documentos
    </Link>
  </div>
</div>
```

### 3. 🎨 Consistencia Visual

**Comando:** Aplicar gradiente uniforme en todas las páginas

**CSS Classes a usar:**
```css
.manda2-gradient {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgb(17, 24, 39) 0%, 
    rgb(0, 0, 0) 50%, 
    rgb(17, 24, 39) 100%);
}
```

**Páginas a actualizar:**
- `/pages/Admin/*.jsx` - Todas las páginas de admin
- `/pages/Cliente/*.jsx` - Dashboard y componentes principales  
- `/pages/Tienda/*.jsx` - Dashboard y componentes principales
- `/pages/Repartidor/*.jsx` - Dashboard y componentes principales

**Pattern a seguir:**
```jsx
<div className="manda2-gradient">
  <div className="container py-4">
    {/* Contenido */}
  </div>
</div>
```

## 🔍 Context & Standards

### ✅ Already Implemented:
- Document upload logic (`documentController.js`)
- Email notifications (`adminController.js`) 
- DocumentUploader component (functional)
- User authentication & role-based access
- MongoDB models and schemas

### 📐 Code Standards:
```javascript
// Error Response Format
{ success: false, error: "Detailed message", code: "ERROR_CODE" }

// Success Response Format  
{ success: true, data: {...}, message: "Action completed" }

// Component Structure
const Component = () => {
  // Estados
  // useEffect
  // Handlers
  // Render
};
```

### 🧪 Testing Requirements:
```bash
# Backend testing
npm test                    # Run all tests
npm run test:coverage      # Coverage report

# Frontend testing
npx vitest run             # Unit tests
npm run test:e2e          # End-to-end tests
```

## 📝 Implementation Details

### Backend Implementation
- **File:** `backend/controllers/adminController.js`
- **Function:** `getPendingDocuments`
- **Description:** Implemented function to fetch users with pending documents
- **Validation:** Added admin role verification (`req.user.rol === 'administrador'`)
- **Query:** Used MongoDB query with `$or` operator to find users with any pending documents
- **Response Format:** `{ success: true, data: [...usuarios], count: N }`
- **Error Handling:** Added try-catch with consistent error responses

### Route Implementation
- **File:** `backend/routes/adminRoutes.js`
- **Endpoint:** GET `/api/admin/documents/pending`
- **Description:** Added route for fetching pending documents

### Frontend Implementation
- **File:** `frontend/src/pages/Admin/DocumentReview.jsx`
- **Description:** Created component for document review with approve/reject functionality
- **Features:** 
  - Document fetching from API
  - Bootstrap cards for user documents
  - Modal confirmation for actions
  - Notes field for admin comments
  - Loading states and error handling
  - Consistent gradient styling

### Routing Implementation
- **File:** `frontend/src/App.jsx`
- **Route:** `/admin/documents`
- **Description:** Added protected route for document review panel

### Dashboard Integration
- **File:** `frontend/src/pages/Admin/Dashboard.jsx`
- **Description:** Added card with link to document review panel

## 📈 Results
- Successfully implemented document review functionality for administrators
- Created intuitive UI for managing user documents
- Maintained consistent styling across all admin pages
- Verified gradient styling is already applied consistently across all pages

**Priority:** HIGH - Production deployment ready
**Timeline:** Complete within current session
**Quality:** Enterprise-level implementation required
