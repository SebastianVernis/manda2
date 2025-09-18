# YEGA - Architecture Documentation
**Version:** 1.0.0  
**Last Updated:** 2025-09-18  
**Status:** Production Ready

---

## 🏗️ System Architecture Overview

**YEGA** is a full-stack delivery platform built with a modern microservices-oriented architecture, featuring a React frontend, Node.js backend, and MongoDB database, designed to handle real-time operations for customers, stores, delivery drivers, and administrators.

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Frontend      │    │    Caddy     │    │    Backend      │
│   React + PWA   │◄──►│   Proxy      │◄──►│  Node.js + API  │
│   Port: 3000    │    │  Port: 9080  │    │   Port: 5000    │
└─────────────────┘    └──────────────┘    └─────────────────┘
                                                       │
                                                       ▼
                                            ┌─────────────────┐
                                            │    MongoDB      │
                                            │   Port: 27017   │
                                            └─────────────────┘
```

---

## 📋 Architecture Decision Records (ADRs)

### ADR-001: Frontend Framework Selection
**Decision:** React 18 with Vite build system  
**Rationale:** Modern development experience, excellent performance, extensive ecosystem  
**Alternatives Considered:** Next.js, Vue.js  
**Status:** ✅ Implemented

### ADR-002: UI Component Library
**Decision:** Bootstrap 5.3 (migrated from NextUI)  
**Rationale:** Better stability, extensive documentation, easier maintenance  
**Migration Impact:** All components successfully migrated in Session 1  
**Status:** ✅ Completed

### ADR-003: State Management
**Decision:** React Context + React Query  
**Rationale:** 
- React Context for global app state (auth, cart)
- React Query for server state management and caching
- Avoids Redux complexity for this project scale
**Status:** ✅ Implemented

### ADR-004: Database Selection
**Decision:** MongoDB with Mongoose ODM  
**Rationale:** 
- Flexible schema for user documents and verification files
- Excellent geospatial query support for delivery tracking
- Strong Node.js integration
**Status:** ✅ Implemented

### ADR-005: Authentication Strategy
**Decision:** JWT with role-based access control  
**Implementation:**
- HS256 algorithm (security hardened)
- 24-hour token expiration
- Role-based route protection (cliente, tienda, repartidor, admin)
**Security:** Enhanced in Session 7 with strong secrets and algorithm restrictions  
**Status:** ✅ Production Ready

### ADR-006: File Upload Strategy
**Decision:** Multer with local file system storage  
**Rationale:** 
- Simple implementation for document verification
- Direct file system access for admin review
- Future migration to cloud storage possible
**Status:** ✅ Implemented

### ADR-007: Real-time Communication
**Decision:** WebSocket for delivery tracking  
**Implementation:** 
- Real-time location updates for drivers
- Order status notifications
- Admin monitoring capabilities
**Status:** ✅ Implemented in Session 2

### ADR-008: PWA Implementation
**Decision:** Custom Service Worker + Web App Manifest  
**Features:** 
- Offline functionality with intelligent caching
- Push notifications for order updates
- "Add to Home Screen" capability
**Status:** ✅ Implemented in Session 7

---

## 🏛️ System Components

### Frontend Architecture

```
src/
├── components/          # Reusable UI components
│   ├── modern/         # Modern design components
│   ├── ui/            # Basic UI elements
│   └── __tests__/     # Component tests
├── pages/             # Route-based page components
│   ├── Cliente/       # Customer-specific pages
│   ├── Tienda/        # Store-specific pages
│   ├── Repartidor/    # Driver-specific pages
│   └── Admin/         # Administrator pages
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── services/          # API communication layer
├── utils/             # Utility functions
└── styles/            # Global styles and CSS
```

#### Key Frontend Components

1. **Authentication System**
   - `AuthContext.jsx`: Global authentication state
   - `authController.js`: Login/register logic
   - Role-based route protection

2. **Real-time Features**
   - WebSocket integration for live updates
   - Geolocation tracking for drivers
   - Order status synchronization

3. **PWA Features**
   - `useServiceWorker.js`: Service worker management
   - `PWAUpdateNotification.jsx`: Update prompts
   - Offline functionality with intelligent caching

### Backend Architecture

```
backend/
├── controllers/       # Request handlers
├── middleware/        # Custom middleware
│   ├── authMiddleware.js     # JWT authentication
│   └── securityMiddleware.js # Security enhancements
├── models/           # MongoDB schemas
├── routes/           # API route definitions
├── services/         # Business logic services
├── utils/            # Utility functions
└── uploads/          # File upload directory
```

#### Key Backend Components

1. **Security Layer (Enhanced in Session 7)**
   - JWT with HS256 algorithm enforcement
   - Input sanitization middleware
   - Rate limiting and CORS protection
   - Content Security Policy headers

2. **Data Models**
   - `Usuario.js`: User management with role support
   - `Producto.js`: Product catalog
   - `Pedido.js`: Order management
   - Document verification system

3. **API Endpoints**
   - `/api/auth/*`: Authentication
   - `/api/products/*`: Product management
   - `/api/orders/*`: Order processing
   - `/api/admin/*`: Administrative functions

---

## 🔄 Data Flow Architecture

### User Authentication Flow
```
Client Request → Auth Middleware → JWT Verification → Role Check → Route Handler
     ↓               ↓                    ↓              ↓           ↓
  Login/Register → Generate Token → Store in Context → Access Control → Response
```

### Order Processing Flow
```
Customer Places Order → Store Receives → Driver Accepts → Real-time Tracking → Completion
        ↓                     ↓              ↓               ↓                ↓
    API Call          WebSocket Update   Location Sync   Status Updates   Notifications
```

### Document Verification Flow
```
User Upload → File Storage → Admin Review → Approval/Rejection → User Notification
     ↓            ↓             ↓               ↓                    ↓
  Multer      File System   Admin Panel    Status Update      Email Service
```

---

## 🛡️ Security Architecture

### Authentication & Authorization
- **JWT Tokens**: HS256 algorithm with 64-character secret
- **Role-based Access**: cliente, tienda, repartidor, admin
- **Token Expiration**: 24 hours with automatic refresh
- **Route Protection**: Middleware-based access control

### Input Validation & Sanitization
- **XSS Protection**: HTML/script tag filtering
- **NoSQL Injection**: $ and . key filtering
- **Data Validation**: Mongoose schema validation
- **File Upload Security**: Type and size restrictions

### Network Security
- **HTTPS**: Caddy proxy with SSL termination
- **CORS**: Configured for production domains
- **Rate Limiting**: API endpoint protection
- **CSP Headers**: Content Security Policy implementation

---

## 📊 Performance Architecture

### Frontend Optimization
- **Bundle Splitting**: 8 optimized chunks
- **Lazy Loading**: Route-based code splitting
- **Caching**: Service Worker with intelligent strategies
- **Image Optimization**: WebP format support

### Backend Performance
- **Database Indexing**: Optimized queries
- **Middleware Optimization**: Minimal overhead
- **Error Handling**: Graceful degradation
- **Memory Management**: Efficient resource usage

### Deployment Architecture
```
Internet → Caddy (9080) → Frontend (Static Files)
                    ↓
               Backend API (5000) → MongoDB (27017)
                    ↓
               PM2 Process Manager
```

---

## 🔧 Technology Stack

### Frontend Stack
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.4.20
- **UI Library**: Bootstrap 5.3
- **State Management**: React Context + React Query 4.41.0
- **Routing**: React Router 6.x
- **Maps**: Leaflet + OpenStreetMap
- **Testing**: Vitest + React Testing Library
- **PWA**: Custom Service Worker

### Backend Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MongoDB with Mongoose 8.18.1
- **Authentication**: jsonwebtoken 9.0.2
- **File Upload**: Multer 2.0.2
- **Email**: Nodemailer 6.x
- **Security**: Helmet, CORS, express-rate-limit

### Infrastructure
- **Reverse Proxy**: Caddy 2.x
- **Process Manager**: PM2
- **Environment**: Production-ready configuration
- **Monitoring**: Built-in health checks

---

## 🚀 Deployment Architecture

### Production Environment
- **Server**: AWS EC2 (3-85-74-100.nip.io)
- **URL**: http://3-85-74-100.nip.io:9080
- **SSL**: Caddy automatic HTTPS (ready for production domain)
- **Process Management**: PM2 ecosystem

### Service Configuration
```yaml
Services:
  - caddy-yega: Reverse proxy (port 9080)
  - yega-backend: Node.js API (port 5000)
  - yega-frontend: Static files served by Caddy
  - mongodb: Database service (port 27017)
```

### Environment Variables
```bash
# Backend Environment
JWT_SECRET=<64-character-secure-key>
MONGODB_URI=mongodb://localhost:27017/yega
FRONTEND_URL=https://production-domain.com
```

---

## 📈 Scalability Considerations

### Horizontal Scaling
- **Load Balancer**: Caddy can distribute load across multiple backend instances
- **Database Clustering**: MongoDB replica sets for high availability
- **CDN Integration**: Static assets can be served via CDN

### Vertical Scaling
- **Resource Optimization**: PM2 cluster mode support
- **Database Indexing**: Optimized for query performance
- **Caching Strategy**: Service Worker + server-side caching

### Future Enhancements
- **Microservices**: Split into user, order, and notification services
- **Message Queue**: Redis for background job processing
- **API Gateway**: Centralized routing and rate limiting
- **Monitoring**: Application Performance Monitoring (APM)

---

**Architecture Status**: ✅ Production Ready  
**Last Review**: 2025-09-18 (Session 7)  
**Next Review**: After 6 months of production usage