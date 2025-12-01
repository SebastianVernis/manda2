# Análisis de Contexto: frontend

1. Resumen Funcional

    Contiene la aplicación de cara al cliente (UI)
    Construido con React y un conjunto de librerías modernas
    Se comunica con el backend a través de una API RESTful

2. Componentes Clave

| Componente | Tipo | Responsabilidad |
| --- | --- | --- |
| src/pages/ | Páginas | Vistas principales de la aplicación por rol |
| src/components/ | Componentes | Componentes de UI reutilizables |
| src/services/ | Servicios | Lógica de comunicación con la API |

3. Dependencias


    A[frontend] --> B[[react]]
    A --> C[[react-bootstrap]]
    A --> D[[styled-components]]
    A --> E[[axios]]

4. Convenciones y Patrones

    Estilo de código: React con Hooks, componentes funcionales
    Diseño: Responsive, mobile-first
    Styling: CSS-in-JS con styled-components
    Gestión de estado: Hooks de React (useState, useEffect, useContext)

5. Notas para Generación de Código

    Mantener la paleta de colores corporativa
    Componentes deben ser pequeños y reutilizables
    Usar 
react-bootstrap
 para la estructura y componentes base
    Las llamadas a la API deben estar en el directorio 
services
  