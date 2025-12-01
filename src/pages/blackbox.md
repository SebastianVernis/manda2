# Análisis de Contexto: pages

1. Resumen Funcional

    Contiene componentes de página principales
    Organizado por roles de usuario
    Cada página gestiona una vista completa

2. Componentes Clave

| Componente | Tipo | Responsabilidad |
| --- | --- | --- |
| Cliente.js | Página | Vista principal para clientes |
| Tienda.js | Página | Panel de control para tiendas |
| Repartidor.js | Página | Interfaz de seguimiento para repartidores |
| Administrador.js | Página | Dashboard de administración |

3. Dependencias


    A[pages] --> B[[react]]
    A --> C[[react-bootstrap]]
    A --> D[[styled-components]]
    A --> E[[src/services]]

4. Convenciones y Patrones

    Diseño: Responsive con react-bootstrap
    Estilos: styled-components con paleta definida
    Estado: Usar hooks (useState, useEffect)
    Datos: Conectar con servicios API

5. Notas para Generación de Código

    Mantener paleta: #000 fondo, #FFF texto, #C0C0C0 acentos, #D4AF37 destacados
    Usar Container, Row, Col de react-bootstrap para layout
    Componentes funcionales con hooks
    Separar lógica de presentación