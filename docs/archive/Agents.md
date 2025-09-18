# Agentes Involucrados en el Proyecto

Este documento describe los roles y responsabilidades de los agentes (humanos o automatizados) que interactúan con el proyecto.

## Agente de Desarrollo (Gemini)

**Rol:** Asistente de desarrollo de software.

**Responsabilidades:**
- Implementación de nuevas funcionalidades.
- Depuración y corrección de errores (bugs).
- Refactorización de código.
- Análisis y comprensión de la base de código existente.
- Interacción con el sistema de archivos y la línea de comandos.
- Gestión de dependencias y compilación de proyectos.
- Comunicación con el usuario para clarificar requisitos y reportar progreso.

**Herramientas Utilizadas:**
- `read_file`: Para leer el contenido de archivos.
- `write_file`: Para crear o sobrescribir archivos.
- `replace`: Para modificar contenido específico dentro de archivos.
- `run_shell_command`: Para ejecutar comandos de terminal (ej. `npm install`, `npm run build`, `pm2 restart`, `mongosh`, `rm`).
- `search_file_content`: Para buscar patrones dentro de archivos.
- `glob`: Para encontrar archivos que coincidan con patrones.
- `google_web_search`: Para buscar información en internet (documentación, soluciones a errores).

## Usuario / Cliente

**Rol:** Propietario del proyecto, define requisitos y valida funcionalidades.

**Responsabilidades:**
- Proporcionar requisitos claros para nuevas funcionalidades.
- Reportar errores y problemas.
- Proporcionar feedback y validación sobre las implementaciones.
- Proporcionar información adicional cuando sea solicitada (ej. logs, detalles de errores en el navegador).
- Tomar decisiones sobre la dirección del proyecto.

## Roles de Usuario en la Aplicación (YEGA)

### Cliente
- **Descripción:** Usuario final que realiza pedidos.
- **Funcionalidades:** Navegar tiendas, ver productos, añadir al carrito, realizar pedidos, seguimiento de pedidos, gestionar perfil.

### Tienda
- **Descripción:** Propietario de un negocio que ofrece productos.
- **Funcionalidades:** Gestionar productos, ver pedidos, gestionar inventario, ver estadísticas, configurar horario y ubicación, **subir documentos de verificación**.

### Repartidor
- **Descripción:** Persona encargada de entregar pedidos.
- **Funcionalidades:** Ver pedidos disponibles, aceptar/rechazar pedidos, actualizar estado de entrega, ver historial, **subir documentos de verificación**.

### Administrador
- **Descripción:** Gestiona la plataforma YEGA.
- **Funcionalidades:** Gestionar usuarios (clientes, tiendas, repartidores), aprobar/rechazar tiendas y repartidores, **revisar y aprobar/rechazar documentos de verificación**, ver reportes y estadísticas generales.
