# Análisis de Contexto: models

1. Resumen Funcional

    Define esquemas Mongoose para entidades de negocio
    Gestiona estructura de datos y validaciones
    Proporciona interfaz para operaciones CRUD con MongoDB

2. Componentes Clave

| Componente | Tipo | Responsabilidad |
| --- | --- | --- |
| Producto.js | Modelo | Define estructura de productos |
| Usuario.js | Modelo | Gestiona datos de usuarios y autenticación |
| Pedido.js | Modelo | Controla información de pedidos |

3. Dependencias


    A[models] --> B[[mongoose]]
    A --> C[[backend/routes]]

4. Convenciones y Patrones

    Esquemas: Definir tipos, requeridos y valores por defecto
    Validaciones: Usar validadores incorporados de Mongoose
    Métodos: Añadir métodos personalizados para operaciones complejas
    Virtuals: Usar propiedades virtuales para campos calculados

5. Notas para Generación de Código

    Mantener nombres de modelos en PascalCase
    Definir relaciones entre modelos con refs
    Usar timestamps para createdAt/updatedAt
    Añadir índices para consultas frecuentes