# Documentación del Proyecto Manda2

Este documento proporciona una descripción detallada de la arquitectura, funcionalidades y componentes del proyecto Manda2.

## 1. Visión General

Manda2 es una plataforma de delivery diseñada para conectar clientes, tiendas y repartidores de manera eficiente. La solución se compone de un backend robusto que gestiona la lógica de negocio y una aplicación frontend moderna y reactiva para la interacción del usuario.

## 2. Arquitectura del Backend

El backend está construido con Node.js y Express, y utiliza MongoDB como base de datos. A continuación se detalla su arquitectura.

### Diagrama de Arquitectura

```mermaid
graph TD
    subgraph "Cliente (Navegador/Móvil)"
        A[Usuario]
    end

    subgraph "Servidor Manda2"
        B{API Gateway}
        C[Servicio de Autenticación]
        D[Servicio de Pedidos]
        E[Servicio de Tiendas]
        F[Servicio de Productos]
        G[Servicio de Geolocalización]
    end

    subgraph "Base de Datos"
        H((MongoDB))
    end

    A --> B;
    B --> C;
    B --> D;
    B --> E;
    B --> F;
    B --> G;
    C --> H;
    D --> H;
    E --> H;
    F --> H;
```

### Modelos de la Base de Datos

-   **Usuario**: Almacena información sobre los usuarios (clientes, dueños de tiendas, repartidores), incluyendo datos de autenticación y roles.
-   **Tienda**: Contiene detalles sobre los comercios registrados, como nombre, ubicación y productos.
-   **Producto**: Describe los artículos que una tienda ofrece.
-   **Pedido**: Gestiona el ciclo de vida de un pedido, desde su creación hasta la entrega.
-   **OTP**: Maneja los códigos de verificación para la autenticación de dos factores.

## 3. Arquitectura del Frontend

El frontend es una Single Page Application (SPA) desarrollada con React y Vite.

### Diagrama de Componentes

```mermaid
graph TD
    subgraph "Páginas Principales"
        A[HomePage]
        B[LoginPage]
        C[RegisterPage]
    end

    subgraph "Dashboards por Rol"
        D[AdminDashboard]
        E[ClientDashboard]
        F[StoreDashboard]
        G[DriverDashboard]
    end

    subgraph "Componentes Compartidos"
        H[Navbar]
        I[Footer]
        J[MapView]
        K[OrderCard]
    end

    A & B & C --> H & I;
    D & E & F & G --> H & I;
    E & G --> J;
    D & E & F & G --> K;
```

## 4. Flujo de un Pedido

```mermaid
sequenceDiagram
    participant Cliente
    participant Frontend
    participant Backend
    participant Repartidor

    Cliente->>Frontend: Selecciona productos y crea un pedido
    Frontend->>Backend: POST /api/orders (nuevo pedido)
    Backend-->>Frontend: Pedido creado (estado: "pendiente")
    Backend->>Repartidor: Notificación de nuevo pedido
    Repartidor->>Backend: Acepta el pedido
    Backend-->>Cliente: Notificación (estado: "en preparación")
    Repartidor->>Backend: Recoge el pedido
    Backend-->>Cliente: Notificación (estado: "en camino")
    Repartidor->>Backend: Entrega el pedido
    Backend-->>Cliente: Notificación (estado: "entregado")
```

---
Sebastian Vernis | Soluciones Digitales
