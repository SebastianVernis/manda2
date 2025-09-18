# Tareas Delegadas a Qwen - Implementación del Panel de Administración y Revisión de Documentos

## Objetivo Principal

Implementar la funcionalidad completa para que el Administrador pueda revisar y gestionar los documentos pendientes de aprobación de usuarios (Tiendas y Repartidores), así como asegurar la consistencia visual del gradiente de fondo en el frontend.

## Tareas Delegadas

### 1. Backend: Implementación de la API de Revisión de Documentos

**Archivo:** `backend/controllers/adminController.js`

**Tarea:** Implementar la función `getPendingDocuments`.

**Detalles:**
-   **Consulta:** Acceder al modelo `Usuario` para buscar usuarios que tengan documentos en estado `pendiente`.
-   **Retorno:** La función debe devolver los datos relevantes del usuario y de sus documentos pendientes.
-   **Ruta Existente:** La ruta para esta funcionalidad ya está definida en `backend/routes/adminRoutes.js` como `/api/admin/documents/pending`.

### 2. Frontend: Desarrollo de la UI del Panel de Administración para Revisión de Documentos

**2.1. Creación del Componente `DocumentReview.jsx`**

**Archivo:** `frontend/src/pages/Admin/DocumentReview.jsx`

**Tarea:** Crear un nuevo componente de página para la revisión de documentos.

**Detalles:**
-   **Fetch de Datos:** Realizar una llamada a la API `/api/admin/documents/pending` para obtener la lista de usuarios con documentos pendientes.
-   **Visualización:**
    -   Mostrar una lista clara de usuarios con sus documentos pendientes.
    -   Para cada documento, mostrar sus detalles: tipo de documento, un enlace para ver el archivo, estado actual y cualquier nota asociada.
-   **Acciones del Administrador:**
    -   Incluir botones "Approve" y "Reject" para cada documento.
    -   Añadir un área de texto (`textarea`) para que el administrador pueda añadir notas al aprobar o rechazar un documento.
-   **Interacción con la API:** Al hacer clic en "Approve" o "Reject", llamar a los endpoints de la API correspondientes (`approveDocument` y `rejectDocument`) en el backend.

**2.2. Añadir Ruta en `App.jsx`**

**Archivo:** `frontend/src/App.jsx`

**Tarea:** Configurar la ruta para el nuevo componente.

**Detalles:**
-   **Ruta:** `/admin/documents`
-   **Componente:** `DocumentReview.jsx`

**2.3. Añadir Enlace en `AdminDashboard.jsx`**

**Archivo:** `frontend/src/pages/Admin/AdminDashboard.jsx` (asumiendo que existe un dashboard principal para el admin)

**Tarea:** Crear una nueva tarjeta o enlace en el dashboard principal del administrador que dirija a la ruta `/admin/documents`.

### 3. Tareas Generales / Estilos: Consistencia del Fondo de Gradiente

**Tarea:** Asegurar que el estilo de fondo de gradiente `min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900` se aplique correctamente a *todas* las páginas del frontend, incluyendo las nuevas y las existentes.

**Detalles:**
-   Revisar los componentes de página existentes y el nuevo `DocumentReview.jsx`.
-   Asegurar que el gradiente se aplique de manera uniforme para mantener la consistencia visual.

## Contexto y Consideraciones Adicionales

### Contexto Existente:
-   La lógica de subida de documentos en el backend (`backend/controllers/documentController.js`) ya está implementada.
-   El envío de correos de aprobación/rechazo (`backend/controllers/adminController.js`) ya está implementado.
-   El componente `DocumentUploader.jsx` en el frontend ya es funcional para la subida de documentos.

### Recomendaciones Importantes (de `CHECKLIST.md`):
-   **Pruebas Unitarias y de Integración:** Aunque no es una tarea directa en esta delegación, se recomienda encarecidamente considerar la implementación de pruebas para las nuevas funcionalidades, tanto en el backend (Jest/Mocha) como en el frontend (Vitest/React Testing Library), para garantizar la calidad y estabilidad.
-   **Manejo de Errores:** Estandarizar el manejo de errores en el backend para proporcionar respuestas consistentes y claras al frontend. Asegurarse de que la UI maneje adecuadamente los estados de carga, éxito y error de las llamadas a la API.
-   **Documentación de la API:** Considerar la generación de documentación interactiva para los nuevos endpoints de la API.
