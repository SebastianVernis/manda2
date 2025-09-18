# YEGA API Documentation
**Version:** 1.0.0  
**Base URL:** `http://3-85-74-100.nip.io:9080/api`  
**Last Updated:** 2025-09-18  
**Status:** Production Ready

---

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Authentication Flow
1. **Register/Login** → Receive JWT token
2. **Include token** in all subsequent requests
3. **Token expires** after 24 hours
4. **Role-based access** (cliente, tienda, repartidor, admin)

---

## 📋 API Endpoints Overview

### Public Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/health` - Health check

### Protected Endpoints (Role-based)
- **Cliente**: Customer-specific operations
- **Tienda**: Store management
- **Repartidor**: Delivery driver operations
- **Admin**: Administrative functions

---

## 🔑 Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "string",
  "email": "string",
  "telefono": "string",
  "password": "string",
  "rol": "cliente|tienda|repartidor",
  "ubicacion": {
    "direccion": "string",
    "coordenadas": {
      "lat": "number",
      "lng": "number"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "token": "jwt_token_here",
  "usuario": {
    "id": "user_id",
    "nombre": "string",
    "email": "string",
    "rol": "string",
    "estado_validacion": "pendiente"
  }
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "token": "jwt_token_here",
  "usuario": {
    "id": "user_id",
    "nombre": "string",
    "email": "string",
    "rol": "string"
  }
}
```

### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "telefono": "string",
  "codigo": "string"
}
```

---

## 🛍️ Product Endpoints

### Get All Products (Public)
```http
GET /api/products
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `categoria` (optional): Filter by category
- `tienda` (optional): Filter by store ID

**Response:**
```json
{
  "success": true,
  "productos": [
    {
      "id": "product_id",
      "nombre": "string",
      "descripcion": "string",
      "precio": "number",
      "categoria": "string",
      "imagen": "string",
      "tienda": {
        "id": "store_id",
        "nombre": "string"
      },
      "disponible": "boolean"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_products": 48
  }
}
```

### Create Product (Tienda only)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "string",
  "descripcion": "string",
  "precio": "number",
  "categoria": "string",
  "imagen": "string"
}
```

### Update Product (Tienda only)
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "string",
  "descripcion": "string",
  "precio": "number",
  "disponible": "boolean"
}
```

### Delete Product (Tienda only)
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

---

## 📦 Order Endpoints

### Create Order (Cliente only)
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "productos": [
    {
      "producto": "product_id",
      "cantidad": "number",
      "precio_unitario": "number"
    }
  ],
  "direccion_entrega": {
    "direccion": "string",
    "coordenadas": {
      "lat": "number",
      "lng": "number"
    }
  },
  "metodo_pago": "efectivo|tarjeta",
  "notas": "string"
}
```

### Get User Orders
```http
GET /api/orders
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by order status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**
```json
{
  "success": true,
  "pedidos": [
    {
      "id": "order_id",
      "numero_pedido": "string",
      "estado": "pendiente|confirmado|en_camino|entregado|cancelado",
      "productos": [...],
      "total": "number",
      "fecha_creacion": "date",
      "repartidor": {
        "nombre": "string",
        "telefono": "string"
      },
      "tracking": {
        "ubicacion_actual": {...},
        "tiempo_estimado": "string"
      }
    }
  ]
}
```

### Update Order Status (Tienda/Repartidor)
```http
PATCH /api/orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "estado": "confirmado|preparando|listo|en_camino|entregado",
  "notas": "string"
}
```

### Assign Driver to Order (Admin/Sistema)
```http
PATCH /api/orders/:id/assign-driver
Authorization: Bearer <token>
Content-Type: application/json

{
  "repartidor_id": "driver_id"
}
```

---

## 🚚 Delivery Driver Endpoints

### Get Available Orders (Repartidor only)
```http
GET /api/drivers/available-orders
Authorization: Bearer <token>
```

### Accept Order (Repartidor only)
```http
POST /api/drivers/accept-order/:order_id
Authorization: Bearer <token>
```

### Update Location (Repartidor only)
```http
POST /api/drivers/update-location
Authorization: Bearer <token>
Content-Type: application/json

{
  "ubicacion": {
    "lat": "number",
    "lng": "number"
  },
  "timestamp": "date"
}
```

### Complete Delivery (Repartidor only)
```http
POST /api/drivers/complete-delivery/:order_id
Authorization: Bearer <token>
Content-Type: application/json

{
  "codigo_confirmacion": "string",
  "notas": "string",
  "ubicacion_entrega": {
    "lat": "number",
    "lng": "number"
  }
}
```

---

## 🏪 Store Management Endpoints

### Get Store Dashboard (Tienda only)
```http
GET /api/stores/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "estadisticas": {
    "pedidos_hoy": "number",
    "ventas_mes": "number",
    "productos_activos": "number",
    "calificacion_promedio": "number"
  },
  "pedidos_recientes": [...],
  "productos_populares": [...]
}
```

### Update Store Profile (Tienda only)
```http
PUT /api/stores/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "string",
  "descripcion": "string",
  "telefono": "string",
  "horario": {
    "apertura": "string",
    "cierre": "string",
    "dias_activo": ["array"]
  },
  "ubicacion": {
    "direccion": "string",
    "coordenadas": {...}
  }
}
```

---

## 👨‍💼 Admin Endpoints

### Get All Users (Admin only)
```http
GET /api/admin/users
Authorization: Bearer <token>
```

**Query Parameters:**
- `rol` (optional): Filter by role
- `estado` (optional): Filter by validation status
- `page`, `limit`: Pagination
- `buscar` (optional): Search term

### Get Pending Documents (Admin only)
```http
GET /api/admin/documents/pending
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "documentos": [
    {
      "usuario": {
        "id": "user_id",
        "nombre": "string",
        "email": "string",
        "rol": "string"
      },
      "documentos": [
        {
          "tipo": "cedula|licencia|ruc",
          "archivo": "filename.pdf",
          "estado": "pendiente",
          "fecha_subida": "date"
        }
      ]
    }
  ]
}
```

### Approve Document (Admin only)
```http
POST /api/admin/documents/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "usuario_id": "string",
  "tipo_documento": "string",
  "notas": "string"
}
```

### Reject Document (Admin only)
```http
POST /api/admin/documents/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "usuario_id": "string",
  "tipo_documento": "string",
  "motivo": "string"
}
```

### Get System Statistics (Admin only)
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

---

## 📁 File Upload Endpoints

### Upload Document (Authenticated users)
```http
POST /api/documents/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "document": "File",
  "type": "cedula|licencia|ruc"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Documento subido exitosamente",
  "archivo": "filename.pdf",
  "tipo": "cedula"
}
```

---

## 🗺️ Location & Geocoding

### Geocode Address
```http
GET /api/geocoding/search
```

**Query Parameters:**
- `q`: Search query/address

**Response:**
```json
{
  "success": true,
  "resultados": [
    {
      "direccion": "string",
      "coordenadas": {
        "lat": "number",
        "lng": "number"
      },
      "relevancia": "number"
    }
  ]
}
```

### Reverse Geocoding
```http
GET /api/geocoding/reverse
```

**Query Parameters:**
- `lat`: Latitude
- `lng`: Longitude

---

## 🔔 OTP & Verification

### Send OTP
```http
POST /api/otp/send
Content-Type: application/json

{
  "telefono": "string",
  "tipo": "registro|recuperacion"
}
```

### Verify OTP
```http
POST /api/otp/verify
Content-Type: application/json

{
  "telefono": "string",
  "codigo": "string"
}
```

---

## ❌ Error Responses

### Standard Error Format
```json
{
  "success": false,
  "message": "Error description",
  "error_code": "ERROR_CODE",
  "details": {
    "field": "validation error details"
  }
}
```

### Common HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate data)
- **500**: Internal Server Error

### Error Codes
- `INVALID_CREDENTIALS`: Login failed
- `USER_NOT_FOUND`: User doesn't exist
- `VALIDATION_ERROR`: Input validation failed
- `UNAUTHORIZED_ACCESS`: Insufficient permissions
- `TOKEN_EXPIRED`: JWT token expired
- `DUPLICATE_EMAIL`: Email already registered

---

## 🚀 Rate Limiting

### General Limits
- **Global**: 1000 requests per 15 minutes per IP
- **Auth endpoints**: 50 requests per 15 minutes per IP
- **File uploads**: 10 uploads per minute per user

### Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## 🔧 Health Check

### System Health
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-18T14:30:00.000Z",
  "services": {
    "database": "connected",
    "api": "operational",
    "version": "1.0.0"
  }
}
```

---

## 🧪 Testing

### Test Environment
- **Base URL**: `http://localhost:5000/api`
- **Test Database**: Separate MongoDB instance
- **Sample Data**: Available via `/api/test/seed`

### Postman Collection
Import the YEGA API collection for testing:
```bash
# Collection available at:
/docs/postman/YEGA_API_Collection.json
```

---

**API Status**: ✅ Production Ready  
**Documentation Version**: 1.0.0  
**Last Updated**: Session 8 (2025-09-18)  
**Next Review**: After production deployment