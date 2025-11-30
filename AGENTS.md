# AGENTS.md - Manda2/YEGA Platform

**Last Updated:** November 30, 2025  
**Project:** Manda2/YEGA - Multi-role delivery/e-commerce platform  
**Stack:** MERN (MongoDB, Express, React, Node.js) + Android app + PM2 + Caddy/Nginx

---

## Project Overview

Manda2 (also called YEGA) is a complete delivery and e-commerce platform with four user roles:
- **Cliente** (Customer) - Browse stores, place orders
- **Tienda** (Store) - Manage products, receive orders
- **Repartidor** (Delivery driver) - Accept and deliver orders
- **Administrador** (Admin) - Platform management

**Architecture:**
- **Backend:** Express.js REST API on port 5000
- **Frontend:** React 18 + Vite SPA
- **Database:** MongoDB (local or cloud)
- **Mobile:** Android app (Gradle-based)
- **Process Manager:** PM2 for backend
- **Web Server:** Caddy (primary) or Nginx for reverse proxy and static files
- **Authentication:** JWT tokens + OTP email verification

---

## Repository Structure

```
manda2/
├── backend/           # Node.js Express API
│   ├── controllers/   # Business logic (auth, orders, products, stores, etc.)
│   ├── middleware/    # Auth, security, upload middleware
│   ├── models/        # Mongoose schemas (Usuario, Pedido, Producto)
│   ├── routes/        # API route definitions
│   ├── services/      # OTP service
│   ├── utils/         # Email, SMS, OTP helpers
│   ├── uploads/       # User-uploaded files
│   ├── server.js      # Main server entry point
│   ├── package.json
│   └── .env
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── pages/     # Role-based pages (Admin/, Cliente/, Tienda/, Repartidor/)
│   │   ├── components/ # Reusable UI components
│   │   ├── services/  # API client (apiClient.js)
│   │   ├── context/   # AuthContext for global auth state
│   │   ├── styles/    # Global styles
│   │   ├── utils/     # Helper functions
│   │   └── hooks/     # Custom React hooks
│   ├── public/        # Static assets
│   ├── dist/          # Production build output
│   ├── vite.config.js
│   ├── package.json
│   └── .env
├── app/               # Android mobile app
│   ├── src/main/
│   └── build.gradle
├── docs/              # Documentation archive
├── scripts/           # Utility shell scripts
├── package.json       # Root package for npm scripts
├── ecosystem.config.js # PM2 process configuration
├── Caddyfile          # Caddy reverse proxy config
├── nginx.conf         # Alternative Nginx config
├── docker-compose.yml # Optional containerized setup
├── build.sh           # Build script
├── deploy.sh          # Deployment automation
└── *.md               # Documentation files
```

---

## Essential Commands

### Root-Level (from `/manda2`)

```bash
# Install all dependencies (backend + frontend)
npm run install-deps

# Build production frontend
npm run build:prod

# Development mode (both backend and frontend with hot reload)
npm run dev

# Deploy full stack
npm run deploy

# PM2 management
npm run logs      # View logs
npm run status    # Check process status
npm run restart   # Restart all services
npm run stop      # Stop all services
```

### Backend (`/manda2/backend`)

```bash
# Start production server
npm start         # node server.js on port 5000

# Development with auto-reload
npm run dev       # nodemon server.js

# Linting
npm run lint      # eslint controllers/ middleware/ models/ routes/ services/ utils/ server.js

# Testing
npm test          # Placeholder (not configured yet)
```

**Environment Variables (backend/.env):**
```bash
NODE_ENV=production
PORT=5000
JWT_SECRET=<your_secret>
MONGODB_URI=mongodb://localhost:27017/yega
FRONTEND_URL=https://manda2.3.85.74.100.nip.io  # CORS allowed origin
EMAIL_USER=<email>
EMAIL_PASS=<password>
EMAIL_HOST=smtp.ionos.mx
EMAIL_PORT=465
```

### Frontend (`/manda2/frontend`)

```bash
# Development server on port 3000
npm run dev       # vite (with proxy to backend)

# Production build
npm run build     # outputs to dist/

# Preview production build
npm run preview   # port 4173

# Linting
npm run lint      # eslint on .js/.jsx files, fail on warnings

# Testing
npm test          # vitest run
npm run test:watch       # vitest in watch mode
npm run test:coverage    # vitest with coverage
```

**Environment Variables (frontend/.env):**
```bash
VITE_API_URL=http://172.31.39.53:5000/api
VITE_APP_NAME=YEGA
VITE_APP_VERSION=1.0.0
VITE_MAPBOX_TOKEN=<your_mapbox_token>
VITE_ENVIRONMENT=development
```

### Deployment Scripts

```bash
# Build entire app (backend + frontend)
./build.sh [development|production]

# Deploy with Caddy (default)
./deploy.sh --caddy --domain=example.com --ssl

# Deploy with Nginx
./deploy.sh --nginx --domain=example.com

# MongoDB setup
sudo ./install-mongodb.sh
mongosh < setup-manda2-db.js

# Restart backend only
./restart-backend.sh

# Reload Caddy config
./reload-caddy.sh
```

### PM2 Process Management

```bash
# Start services
pm2 start ecosystem.config.js

# Restart services
pm2 restart ecosystem.config.js

# View logs
pm2 logs
pm2 logs manda2-backend
pm2 logs manda2-caddy

# Monitor
pm2 monit

# Status
pm2 status

# Stop all
pm2 stop all

# Save PM2 config to auto-start on reboot
pm2 save
pm2 startup
```

**PM2 Configuration (`ecosystem.config.js`):**
- **manda2-backend**: Runs `backend/server.js` on port 5000
- **manda2-caddy**: Runs Caddy web server (optional, can use systemd instead)

### Web Server Management

**Caddy (primary):**
```bash
# Validate config
caddy validate --config Caddyfile

# Start
sudo caddy run --config Caddyfile

# Reload config
sudo caddy reload --config Caddyfile

# Via systemd (if installed)
sudo systemctl start caddy
sudo systemctl restart caddy
sudo systemctl status caddy
```

**Nginx (alternative):**
```bash
# Test config
sudo nginx -t

# Reload
sudo nginx -s reload

# Via systemd
sudo systemctl restart nginx
sudo systemctl status nginx
```

### MongoDB Management

```bash
# Start MongoDB
sudo systemctl start mongod

# Status
sudo systemctl status mongod

# Connect to DB
mongosh yega

# Run initialization script
mongosh < setup-manda2-db.js

# Reset and inject test users
node backend/reset-and-inject-users.js

# Verify users
node backend/verify-users.js
```

### Health Checks

```bash
# Backend health
curl http://localhost:5000/api/health

# Frontend (via web server)
curl http://localhost:80/

# Check MongoDB connection
node backend/test-mongodb.js

# Full deployment status
node test-deployment-status.js
```

---

## Code Organization

### Backend Structure

**Models (`backend/models/`):**
- `Usuario.js` - User schema with roles: cliente, tienda, repartidor, administrador
- `Pedido.js` - Order schema with products, delivery info, status tracking
- `Producto.js` - Product schema with store relation
- `OTP.js` - OTP verification codes

**Controllers (`backend/controllers/`):**
- `authController.js` - Registration, login, JWT generation
- `otpController.js` - OTP generation, validation, resend
- `orderController.js` - Order creation, status updates
- `productController.js` - CRUD for products
- `storeController.js` - Store management
- `adminController.js` - Admin operations
- `geocodingController.js` - Location services
- `documentController.js` - Document uploads

**Middleware (`backend/middleware/`):**
- `authMiddleware.js` - JWT verification (`protect`) and role authorization (`authorize`)
- `securityMiddleware.js` - Helmet, rate limiting, input sanitization, JWT signing/verification
- `uploadMiddleware.js` - Multer file upload handling

**Routes (`backend/routes/`):**
- All routes follow pattern: `/api/<resource>`
- Public routes: `/api/auth`, `/api/otp`, `/api/stores`, `/api/geocoding`
- Protected routes: `/api/products`, `/api/orders`, `/api/location`, `/api/documents`, `/api/admin`

**Services (`backend/services/`):**
- `otpService.js` - OTP generation and email delivery

**Utils (`backend/utils/`):**
- `sendEmail.js` - Nodemailer email sending
- `generateOTP.js` - OTP code generation
- `otp-bypass.js` - Development OTP bypass (if enabled)

### Frontend Structure

**Pages (`frontend/src/pages/`):**
- **Public:** `Home.jsx`, `Login.jsx`, `Register.jsx`, `VerifyOTP.jsx`, `ForgotPassword.jsx`
- **Admin/**: Admin dashboard and management
- **Cliente/**: Store browsing, checkout, order tracking
- **Tienda/**: Store product and order management
- **Repartidor/**: Delivery driver dashboard, order acceptance

**Components (`frontend/src/components/`):**
- **ui/**: Reusable UI components (buttons, cards, modals, etc.)
- **modern/**: Modern styled components (HeroSection, ModernNavbar, ProductCard, etc.)
- Other: `LazyComponents.jsx`, `PWAUpdateNotification.jsx`

**Services (`frontend/src/services/`):**
- `apiClient.js` - Axios instance with interceptors
  - Auto-attaches JWT token from localStorage
  - Handles 401 errors (auto-logout)
  - Base URL from `VITE_API_URL` env var

**Context (`frontend/src/context/`):**
- `AuthContext.jsx` - Global auth state with `useAuth()` hook
  - Manages `user`, `token`, `loading`, `locationPermission`
  - Functions: `login()`, `logout()`, `loadUserProfile()`, `requestLocationPermission()`

**Config/Utils/Hooks:**
- `config/`: App configuration
- `utils/`: Helper functions
- `hooks/`: Custom React hooks

---

## Coding Conventions

### Backend (Node.js)

**Language & Style:**
- CommonJS modules (`require`/`module.exports`)
- ES2020+ features
- Console logging for debugging (use structured logs with emoji prefixes)
- Error handling: try/catch with descriptive messages

**File Naming:**
- Controllers: `<resource>Controller.js` (camelCase)
- Models: `<Model>.js` (PascalCase)
- Routes: `<resource>Routes.js` (camelCase)
- Middleware: `<name>Middleware.js` (camelCase)

**Database:**
- Mongoose for MongoDB ORM
- Schema validation with custom error messages
- Use indexes on frequently queried fields (`email`, `telefono`, `numero_pedido`)

**Authentication:**
- JWT tokens signed with `JWT_SECRET`
- Token passed in `Authorization: Bearer <token>` header
- `protect` middleware verifies token and attaches `req.user`
- `authorize([roles])` middleware checks user role

**Security:**
- Helmet for HTTP headers
- Rate limiting via `express-rate-limit`
- Input sanitization
- CORS configured via `FRONTEND_URL` env var
- Passwords hashed with bcryptjs (pre-save hook in Usuario model)

**API Response Format:**
```javascript
// Success
res.status(200).json({ success: true, data: { ... } })

// Error
res.status(400).json({ success: false, message: 'Error message' })
```

### Frontend (React)

**Language & Style:**
- ES Modules (`import`/`export`)
- React 18 with hooks
- JSX syntax
- Indentation: 2 spaces
- Single quotes, no semicolons (to match existing code)

**File Naming:**
- Components/Pages: `PascalCase.jsx`
- Hooks: `use<Name>.js` (e.g., `useAuth.js`)
- Utils: `camelCase.js`

**Component Patterns:**
- Functional components with hooks
- Use `useAuth()` hook for auth state
- Use `apiClient` from `services/apiClient.js` for API calls
- React Query (`@tanstack/react-query`) for data fetching
- React Router for navigation

**Styling:**
- Tailwind CSS (configured in `tailwind.config.js`)
- CSS modules or global styles in `src/styles/`
- Bootstrap components via `react-bootstrap`
- Radix UI primitives for advanced components
- Framer Motion for animations

**State Management:**
- Local state: `useState`, `useReducer`
- Global auth: `AuthContext`
- Server state: React Query

**Environment Variables:**
- Prefix with `VITE_` (e.g., `VITE_API_URL`)
- Access via `import.meta.env.VITE_*`
- Never commit secrets to `.env` files

### Shared Conventions

**Git Workflow:**
- Conventional Commits: `feat:`, `fix:`, `chore:`, etc.
- Branch naming: `feature/<name>`, `fix/<name>`

**Error Handling:**
- Backend: try/catch with detailed error logs
- Frontend: catch errors in API calls, display toast notifications

**Logging:**
- Backend: Console logs with emoji prefixes (e.g., `✅`, `❌`, `🔥`)
- Frontend: Console logs for debugging, use `VITE_DEBUG` flag if needed

---

## Testing

### Backend

**Status:** Test suite not configured yet  
**Command:** `npm test` (placeholder that exits 0)

**Recommendation:** Configure Jest or Mocha for production

**Manual Testing:**
- Health check: `curl http://localhost:5000/api/health`
- Test scripts available:
  - `test-backend.js` - Backend API tests
  - `test-mongodb.js` - MongoDB connection test
  - `test-email.js` - Email sending test
  - `test-otp-email.js` - OTP email test
  - `test-otp-verify.js` - OTP verification test

### Frontend

**Framework:** Vitest + React Testing Library  
**Commands:**
```bash
npm test               # Run tests once
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage report
```

**Configuration:**
- Setup file: `setupTests.js`
- Test environment: jsdom
- Globals: `vi`, `describe`, `it`, `expect`, `test`, `beforeEach`, `afterEach`

**Testing Conventions:**
- Place tests alongside files as `*.test.jsx` or under `src/__tests__/`
- Test components, hooks, and services
- Use meaningful test descriptions

### Linting

**Backend:**
```bash
npm run lint  # eslint with @eslint/js recommended config
```

**Frontend:**
```bash
npm run lint  # eslint with react, react-hooks, react-refresh plugins
              # Fails on warnings (--max-warnings 0)
```

**Common Lint Rules:**
- No unused vars (warn for args starting with `_`)
- React: no prop-types, no React import required (React 18)
- Hooks: rules of hooks enforced

---

## Important Gotchas

### Authentication Flow

1. User registers → OTP sent to email
2. User verifies OTP → `estado_validacion` changes to `aprobado`
3. User logs in → JWT token returned
4. Frontend stores token in localStorage
5. `apiClient` auto-attaches token to requests
6. Backend `protect` middleware verifies token on protected routes

**OTP Details:**
- Sent via email (Nodemailer)
- Valid for limited time (check `otp_expires` field)
- Can be resent via `/api/otp/resend`

### CORS Configuration

- Backend CORS origin controlled by `FRONTEND_URL` in `.env`
- Can be comma-separated list or `*` for development
- Caddy/Nginx also set CORS headers for static files

### File Uploads

- Multer middleware in `uploadMiddleware.js`
- Files stored in `backend/uploads/`
- Served via `/uploads/*` route (proxied by Caddy/Nginx)
- Max file size: Check Nginx `client_max_body_size` (default 50M)

### Database Connection

- MongoDB URI in backend `.env`
- Database name: `yega` (also referred to as `manda2` in some configs)
- Initial setup: Run `setup-manda2-db.js` to create collections/indexes

### Frontend API Client

- Base URL must match backend (check `VITE_API_URL`)
- Axios interceptors handle auth token and 401 errors
- On 401, redirects to `/login` (except for OTP flows)

### Production Build

- Frontend build outputs to `frontend/dist/`
- Caddy/Nginx serve static files from `dist/`
- SPA fallback: All non-API/non-asset routes serve `index.html` (for React Router)

### PM2 Notes

- Config in `ecosystem.config.js`
- Logs in `backend/logs/` and root `logs/`
- Auto-restart on crash (max 10 restarts)
- Save config with `pm2 save` to persist across reboots

### Port Conflicts

- Backend: 5000
- Frontend dev: 3000
- Web server: 80 (HTTP), 443 (HTTPS)
- MongoDB: 27017

**Troubleshooting:**
```bash
# Check what's using a port
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

### Environment-Specific Issues

**Development:**
- Use `npm run dev` for hot reload
- Vite proxy forwards `/api` to backend

**Production:**
- Must run `npm run build` before deploying
- Ensure `.env` files have correct production URLs
- HTTPS requires valid SSL cert (Let's Encrypt via Caddy or manual Nginx setup)

### Role-Based Access

- Admin routes: protected by `authorize(['administrador'])`
- Each role has specific dashboards/pages
- Check `req.user.rol` in backend controllers for custom logic

### Android App

- Located in `app/`
- Gradle-based build
- Compile SDK: 33, Min SDK: 21, Target SDK: 33
- Build with `./gradlew build` (from root, using Gradle wrapper)

---

## Deployment Workflow

**Quick Start (5 steps):**

1. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && cd ..
   ```

2. **Build frontend:**
   ```bash
   cd frontend && npm run build && cd ..
   ```

3. **Install MongoDB:**
   ```bash
   sudo ./install-mongodb.sh
   mongosh < setup-manda2-db.js
   ```

4. **Install tools:**
   ```bash
   npm install -g pm2
   # Install Caddy or Nginx
   ```

5. **Deploy:**
   ```bash
   ./deploy.sh --caddy
   # Or manual:
   pm2 start ecosystem.config.js
   sudo caddy run --config Caddyfile
   ```

**Automated Deployment:**
```bash
./deploy.sh --caddy --domain=manda2.com.mx --ssl
```

**Manual Deployment:**
```bash
# Build
./build.sh production

# Start backend
pm2 start ecosystem.config.js

# Start web server
sudo caddy run --config Caddyfile
# or
sudo systemctl start nginx
```

**Post-Deployment:**
- Check health: `curl http://localhost:5000/api/health`
- Check frontend: `curl http://localhost:80/`
- Monitor logs: `pm2 logs`
- Verify MongoDB: `sudo systemctl status mongod`

**See Also:**
- `QUICK_START.md` - 5-minute deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Comprehensive checklist
- `SERVER_SETUP.md` - Detailed server configuration
- `MONGODB_SETUP.md` - MongoDB setup guide

---

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| "UNMET DEPENDENCY" | `npm install` |
| "Cannot find module" | `npm install` in correct directory |
| "MongoDB connection failed" | `sudo systemctl start mongod` |
| "Port already in use" | `sudo lsof -i :<port>` and `kill -9 <PID>` |
| "Permission denied" | `chmod +x *.sh` |
| Blank page | `cd frontend && npm run build` |
| 401 on protected routes | Check JWT token in localStorage, verify `JWT_SECRET` |
| CORS errors | Check `FRONTEND_URL` in backend `.env` |
| OTP not received | Check email credentials in backend `.env`, run `test-email.js` |

### Logs

**Backend logs:**
```bash
pm2 logs manda2-backend
# or
tail -f backend/logs/combined.log
```

**Caddy logs:**
```bash
pm2 logs manda2-caddy
# or
sudo journalctl -u caddy -f
```

**MongoDB logs:**
```bash
sudo journalctl -u mongod -f
```

### Reset/Restart

**Full restart:**
```bash
pm2 restart all
sudo systemctl restart mongod
sudo systemctl restart caddy  # or nginx
```

**Reset database:**
```bash
mongosh yega --eval "db.dropDatabase()"
mongosh < setup-manda2-db.js
```

**Clear PM2:**
```bash
pm2 delete all
pm2 start ecosystem.config.js
```

---

## Quick Reference

### Key Files

- **Entry Points:** `backend/server.js`, `frontend/src/main.jsx`
- **Config:** `ecosystem.config.js`, `Caddyfile`, `nginx.conf`, `vite.config.js`
- **Auth:** `backend/controllers/authController.js`, `frontend/src/context/AuthContext.jsx`
- **API Client:** `frontend/src/services/apiClient.js`
- **Models:** `backend/models/Usuario.js`, `Pedido.js`, `Producto.js`

### Default Credentials

**Admin:**
- Email: `admin@manda2.com`
- Password: `admin123`

⚠️ **Change in production!**

### URLs

**Development:**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- API: `http://localhost:5000/api`

**Production (example):**
- Frontend: `https://manda2.3.85.74.100.nip.io` or `http://3.85.74.100`
- API: `https://manda2.3.85.74.100.nip.io/api`
- Health: `http://localhost:5000/api/health`

### Documentation

- `INDEX_DOCUMENTACION.md` - Full documentation index
- `QUICK_START.md` - Quick deployment guide
- `RESUMEN_EJECUTIVO.md` - Executive summary
- `backend/README.md` - Backend overview
- `frontend/AGENTS.md` - Frontend-specific guidelines

---

## Next Steps for Agents

When starting work on this codebase:

1. **Understand the role-based architecture** - 4 user roles with distinct flows
2. **Read existing env files** to understand deployment context
3. **Check MongoDB connection** before testing backend
4. **Run health checks** to verify services are running
5. **Review JWT/OTP flow** for authentication changes
6. **Use existing patterns** - check similar controllers/components before adding new ones
7. **Test locally first** - use `npm run dev` for both backend and frontend
8. **Follow linting rules** - run `npm run lint` before committing
9. **Update this file** when discovering new patterns or commands

**For new features:**
- Backend: Add controller → route → test endpoint with `curl`
- Frontend: Add page/component → connect to API via `apiClient` → test in dev mode
- Always protect routes with `protect` middleware if auth required
- Always check role with `authorize([...])` if role-specific

**For debugging:**
- Backend: Check PM2 logs, add console logs with emoji prefixes
- Frontend: Check browser console, React DevTools, Network tab
- Database: Connect with `mongosh yega` and query collections

---

**End of AGENTS.md**
