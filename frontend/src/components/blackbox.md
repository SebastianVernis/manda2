# Análisis de Contexto: components

1. Resumen Funcional

    Componentes UI reutilizables
    Bloques de construcción para las páginas
    Aislados de lógica de negocio específica

2. Componentes Clave

| Componente | Tipo | Responsabilidad |
| --- | --- | --- |
| ProductCard.js | Presentación | Muestra tarjeta de producto |
| Navbar.js | Navegación | Barra de navegación global |
| FormInput.js | Formulario | Campo de formulario con validación |

3. Dependencias


    A[components] --> B[[react]]
    A --> C[[react-bootstrap]]
    A --> D[[styled-components]]

4. Convenciones y Patrones

    Composición: Componentes pequeños y enfocados
    Props: Typed con PropTypes
    Estilos: styled-components con temas
    Reutilización: Máxima independencia

5. Notas para Generación de Código

    Nombrar componentes en PascalCase
    Usar props para personalización
    Documentar con JSDoc
    Mantener sin estado cuando sea posible
    Probar con Storybook