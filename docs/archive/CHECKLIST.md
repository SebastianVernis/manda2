# Checklist de Pendientes y Recomendaciones

Este documento resume las tareas pendientes, las funcionalidades incompletas y las recomendaciones generales para mejorar el proyecto YEGA.

##  Funciones Pendientes

### Backend
-   **Notificaciones Push**: Implementar un sistema de notificaciones push (e.g., usando Firebase Cloud Messaging) para alertar a los usuarios en tiempo real, en lugar de depender de notificaciones por email/SMS que pueden ser lentas o costosas.
-   **Pasarela de Pagos**: Integrar una pasarela de pagos (e.g., Stripe, MercadoPago) para procesar las transacciones de los pedidos de forma segura.
-   **Sistema de Calificaciones y Reseñas**: Desarrollar la funcionalidad para que los clientes puedan calificar y dejar reseñas de las tiendas y los productos.
-   **Panel de Analíticas para Administradores**: Crear un dashboard para que los administradores puedan ver estadísticas clave del negocio (e.g., número de pedidos, ingresos, usuarios activos).

### Frontend
-   **Gestión de Perfil de Usuario**: Implementar la funcionalidad completa para que los usuarios (clientes, repartidores, etc.) puedan editar su información de perfil.
-   **Historial de Pedidos del Cliente**: Desarrollar la vista donde los clientes puedan ver su historial de pedidos con todos sus detalles.
-   **Seguimiento en Tiempo Real del Repartidor**: Mejorar el mapa de seguimiento para que muestre la ubicación del repartidor en tiempo real, utilizando WebSockets para la comunicación.
-   **Chat entre Cliente y Repartidor**: Implementar una funcionalidad de chat en tiempo real para facilitar la comunicación durante la entrega del pedido.

##  Rutas Incompletas

### Backend
-   **`adminRoutes.js`**: Las rutas de administración parecen estar incompletas. Faltan endpoints para gestionar usuarios, tiendas y ver analíticas.
-   **`documentRoutes.js`**: No está claro si la funcionalidad de carga de documentos para repartidores (e.g., licencia de conducir) está completamente implementada y validada.
-   **`storeController.simple.js`**: La existencia de este archivo sugiere que el `storeController.js` principal puede tener una lógica compleja que se intentó simplificar, o que hay una versión incompleta. Sería bueno unificar y completar la lógica.

##  ✅ Tareas Completadas

### Backend
-   **API de Revisión de Documentos**: Implementada la funcionalidad completa para que los administradores puedan revisar documentos pendientes de usuarios (tiendas y repartidores). Se creó el endpoint GET `/api/admin/documents/pending` en `adminController.js` y se registró en `adminRoutes.js`.

### Frontend
-   **Panel de Administración para Revisión de Documentos**: Desarrollado el componente `DocumentReview.jsx` que permite a los administradores ver, aprobar y rechazar documentos pendientes. Se añadieron las rutas necesarias en `App.jsx` y se integró un enlace en el dashboard de administradores.

##  Recomendaciones Generales

-   **Pruebas Unitarias y de Integración**: El proyecto carece de un framework de pruebas tanto en el frontend como en el backend. Se recomienda encarecidamente implementar pruebas (e.g., con Vitest/React Testing Library en el frontend y Jest/Mocha en el backend) para garantizar la calidad y estabilidad del código.
-   **Gestión de Secretos**: Mejorar la gestión de secretos y claves de API. En lugar de depender únicamente de archivos `.env`, considerar el uso de un servicio de gestión de secretos como AWS Secrets Manager o HashiCorp Vault.
-   **CI/CD (Integración y Despliegue Continuo)**: Configurar un pipeline de CI/CD (e.g., con GitHub Actions) para automatizar las pruebas, la construcción y el despliegue de las aplicaciones de frontend y backend.
-   **Documentación de la API**: Generar documentación interactiva de la API utilizando herramientas como Swagger o OpenAPI para facilitar el desarrollo y las pruebas del frontend.
-   **Optimización de Consultas a la Base de Datos**: Revisar las consultas a MongoDB y asegurarse de que se estén utilizando índices adecuados para mejorar el rendimiento, especialmente en las colecciones de pedidos y productos.
-   **Manejo de Errores**: Estandarizar el manejo de errores en todo el backend para proporcionar respuestas de error consistentes y claras al frontend.
