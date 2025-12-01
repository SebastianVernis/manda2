# Análisis de Contexto: services

1. Resumen Funcional

    Gestiona comunicación con backend
    Encapsula lógica de llamadas API
    Centraliza manejo de errores

2. Componentes Clave

| Componente | Tipo | Responsabilidad |
| --- | --- | --- |
| apiClient.js | Servicio | Cliente HTTP con axios y manejo de tokens |
| authService.js | Servicio | Gestiona autenticación y sesiones |
| productService.js | Servicio | Operaciones CRUD para productos |

3. Dependencias


    A[services] --> B[[axios]]
    A --> C[[frontend/src/pages]]

4. Convenciones y Patrones

    Interfaces: Funciones claras con parámetros definidos
    Tokens: Manejar automáticamente en interceptor
    Errores: Normalizar respuestas de error
    Env: Usar variables de entorno