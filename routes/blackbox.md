# Análisis de Contexto: routes

1. Resumen Funcional

    Contiene endpoints API para la aplicación
    Gestiona peticiones HTTP y respuestas
    Coordina interacción entre frontend y modelos

2. Componentes Clave

| Componente | Tipo | Responsabilidad |
| --- | --- | --- |
| productosList.js | Endpoint | GET /productos con paginación y filtros |
| usuariosLogin.js | Endpoint | POST /login para autenticación |
| usuariosRegister.js | Endpoint | POST /register para nuevos usuarios |

3. Dependencias


    A[routes] --> B[[express]]
    A --> C[[backend/models]]
    A --> D[[jsonwebtoken]]

4. Convenciones y Patrones

    Estructura: Separar en controladores si la lógica crece
    Autenticación: Proteger rutas con middleware JWT
    Validación: Usar express-validator para datos de entrada
    Respuestas: Formato JSON consistente: { success, data, message }

5. Notas para Generación de Código

    Seguir convención RESTful para nombres de rutas
    Usar try/catch para manejo de errores
    Documentar endpoints con Swagger en el futuro
    Mantener lógica de negocio en controladores, no en rutas