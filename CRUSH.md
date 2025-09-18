# CRUSH.md - YEGA Project Development Guide

## 🚨 MANDATORY FIRST ACTION
**ATTENTION:** All agents must execute startup protocol from `docs/workflow/CRUSH_STARTUP.md` before any other action.

---

## 📊 Project Status & Workflow

### Current Status
- ✅ **Core System:** Backend APIs + Admin Panel functional
- ✅ **Infrastructure:** HTTP with Caddy (port 9080), Bootstrap migration completed
- ✅ **Sessions 1-4:** COMPLETADAS - Arquitectura, Repartidor/Pedidos, Cliente/Dashboard, Visual Cliente/Tienda 
- 🔄 **Current Session:** SESIÓN 5 - Visual Consistency Repartidor & Generales (EN PROGRESO)
- 📋 **Progress:** 4/8 sessions completed, ~$370-480 invested, 50% complete

### Port Configuration (Updated 2025-09-18)
- **Frontend Build:** Served by Caddy at port 9080
- **Backend API:** Port 5000 (proxied through Caddy /api/*)
- **Caddy Proxy:** Port 9080 (HTTP only, no conflicts)
- **MCP Server:** Port 8000 (Blackbox tools)
- **Inter-Agent MCP:** Port 8001 (Gemini ↔ Qwen ↔ Crush communication)
- **Other Projects:** Nginx (port 80) - NO CONFLICTS

### MCP Inter-Agent Communication (NEW)
- **Status:** ✅ AVAILABLE - Sistema de comunicación entre Gemini, Qwen y Crush
- **Tools:** 9 herramientas MCP para orquestación y análisis colaborativo  
- **Config:** `/home/ec2-user/mcp-server-production/crush-config.json`
- **Usage:** Análisis multi-perspectiva, tareas orquestadas, comunicación directa

### Next Actions
```yaml
Priority 1: Visual Consistency Repartidor & Generales ($40-65, Claude 3.5 Sonnet) - EN PROGRESO
Priority 2: Testing & Performance ($80-130, GPT-4 Turbo + Claude 3.5 Sonnet)  
Priority 3: Security & Production ($100-160, Claude 3.5 Sonnet)
Priority 4: Documentation & Handover ($70-125, Claude 3.5 Sonnet)
```

### Testing URLs (Updated 2025-09-16)
```yaml
Production URL: http://3-85-74-100.nip.io:9080
API Health: http://3-85-74-100.nip.io:9080/api/health
Backend Direct: http://localhost:5000/api/health
Dev Server: http://localhost:3000 (when PM2 frontend stopped)
```

### Port Configuration & Conflicts Resolution
```yaml
YEGA Project Ports:
  - Caddy HTTP Proxy: 9080 (serves frontend + API proxy)
  - Backend API: 5000 (Node.js/Express)
  - Frontend Dev: 3000 (Vite dev server when needed)
  - MongoDB: 27017 (database)

Other Projects (NO CONFLICTS):
  - Nginx: 80 (MCP project web server)
  - MCP Server: 8000 (Python/FastAPI)
  - MySQL: 3306 (system database)

Conflict Resolution History:
  - Originally: YEGA on port 80/443 (HTTPS)
  - Conflict: Other project took port 80
  - Solution: Moved YEGA to port 9080 (HTTP only)
  - Result: Both projects coexist without interference
```

### Performance & Bundle Analysis
```yaml
Current Bundle Sizes:
  - Main JS: 270KB (index-BNhOiaXh.js)
  - Main CSS: 274KB (index-DDcFsjFK.css) 
  - Bootstrap: 85KB (vendor-bootstrap-gr8dmDgt.js)
  - Framer Motion: 115KB (vendor-framer-DP9o3tgi.js)
  - React: 227KB (vendor-react-CK1uO70M.js)
  - Leaflet: 156KB (vendor-leaflet-sM1OYSUq.js)
  
Loading Issues:
  - Large initial bundle (1.3MB total)
  - No lazy loading implemented yet
  - Tailwind CSS not properly configured (warnings)
  
Optimization Planned:
  - Session 6: Bundle splitting & lazy loading
  - Session 6: Performance optimization
  - Session 7: PWA features for caching
```

### Essential Files
- **Navigation Guide:** `PROJECT_MAP.md`
- **Session Tracker:** `docs/workflow/SESSION_TRACKER.md`
- **Detailed Sessions:** `docs/workflow/WORKFLOW_SESSIONS.md`
- **Model Assignments:** `docs/workflow/MODEL_ASSIGNMENT_MATRIX.md`

---

## Build/Test/Lint Commands

### Frontend (React + Vite)
```bash
cd frontend
npm run dev                    # Start development server (localhost:5173)
npm run build                  # Production build
npm run lint                   # ESLint check
npm test                       # Run all tests with Vitest
npm run test:watch            # Run tests in watch mode
vitest src/components/__tests__/OTPInput.test.jsx  # Single test file
```

### Backend (Node.js + Express)
```bash
cd backend
npm start                      # Start production server
npm run lint                   # ESLint check  
npm test                       # Run backend tests
node server.js                 # Direct server start
```

### Full Stack Management
```bash
# Production Services
pm2 start ecosystem.config.js  # Start all services
pm2 restart yega-backend       # Restart backend only
pm2 restart yega-frontend      # Restart frontend only
pm2 logs                       # View all logs
pm2 status                     # Check service status

# System Health
curl -f http://3-85-74-100.nip.io:9080/api/health  # Backend API health via Caddy proxy
./docs/scripts/reload-caddy.sh                      # Reload HTTPS proxy
pm2 reload caddy-yega                               # Reload Caddy (PM2 managed)
```

### Workflow Commands
```bash
# Check current session status
cat docs/workflow/SESSION_TRACKER.md | head -10

# View session details
cat docs/workflow/WORKFLOW_SESSIONS.md | grep -A5 "SESIÓN 1"

# Check model assignments
cat docs/workflow/MODEL_ASSIGNMENT_MATRIX.md | head -20

# Execute startup protocol (MANDATORY for all agents)
cat docs/workflow/CRUSH_STARTUP.md
```

---

## Code Style Guidelines

### Visual Consistency Standard
```css
/* Apply to ALL screens for consistency */
.screen-container {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #111827, #000000, #111827);
  padding: 1rem;
}
```

### File Organization
- **Frontend**: Role-based directories (`pages/Cliente/`, `pages/Admin/`, `pages/Tienda/`, `pages/Repartidor/`)
- **Components**: PascalCase (`ModernNavbar.jsx`, `AuthContext.jsx`)
- **Utilities**: camelCase (`orderStates.js`, `apiClient.js`)
- **Tests**: Co-located in `__tests__/` folders
- **Workflow**: Organized in `docs/workflow/`

### Component Structure (Priority Implementation)
```yaml
HIGH PRIORITY - TO IMPLEMENT:
  - frontend/src/pages/Repartidor/Pedidos.jsx
  - frontend/src/pages/Cliente/Dashboard.jsx

MEDIUM PRIORITY - UPDATE VISUAL:
  - 26 screens need consistent gradient
  - Responsive design optimization
  - Accessibility improvements

LOW PRIORITY - ENHANCEMENTS:
  - PWA features
  - Performance optimization
  - Advanced testing
```

### Naming Conventions
- **Components**: PascalCase with role prefixes (`AdminDashboard`, `ClienteTiendas`)
- **Functions**: camelCase with descriptive prefixes (`handleSubmit`, `validateEmail`)
- **Variables**: camelCase (`currentUser`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE for config values

### Import Order
1. React imports first: `import React, { useState } from 'react'`
2. Third-party libraries: `import { Container } from 'react-bootstrap'`
3. Local imports: contexts, services, utilities
4. Relative imports: `import ModernNavbar from '../components/ModernNavbar'`

### Error Handling & Fallback
- **Critical Errors**: Auto-activate fallback system (`docs/workflow/FALLBACK_SYSTEM.md`)
- **Build Failures**: Escalate to higher-capacity models
- **Backend**: Always use try-catch with detailed error responses
- **Frontend**: Use React Query for API error handling
- **Logging**: Extensive console.log statements for debugging (keep in development)

### State Management
- **Global State**: React Context (`AuthContext`, `CartContext`)
- **Server State**: React Query (`@tanstack/react-query`)
- **Local State**: useState for component-specific state

### API Patterns
- **Routes**: RESTful endpoints (`/api/auth/login`, `/api/products`)
- **Responses**: Consistent JSON format with `{ message, success, data }`
- **Authentication**: JWT with role-based access control
- **Error Status**: 400 (validation), 401 (unauthorized), 500 (server error)

---

## 🎯 Success Criteria

### Session Completion
- [ ] All checklist items marked ✅
- [ ] Build successful (`npm run build`)
- [ ] Tests passing (`npm test`)
- [ ] No critical errors
- [ ] **AUTO-STOP** when criteria met

### Final Project Success
- [ ] All 26 screens with consistent design
- [ ] Repartidor/Pedidos.jsx fully functional
- [ ] Cliente/Dashboard.jsx with real-time data
- [ ] Test coverage >90%
- [ ] Performance score >95
- [ ] Zero critical bugs

---

## 🤖 For AI Agents

### Model Assignments (from modelos_list.csv)
- **Claude 3.5 Sonnet:** 94% of tasks ($520-805) - Architecture, UI, Security, Performance
- **GPT-4 Turbo:** 6% of tasks ($40-70) - Testing specialist
- **Fallback System:** Automatic escalation when needed

### Agent Protocol
1. **START:** Execute `docs/workflow/CRUSH_STARTUP.md` (MANDATORY)
2. **CHECK:** Current session in `docs/workflow/SESSION_TRACKER.md`
3. **FOLLOW:** Session checklist in `docs/workflow/WORKFLOW_SESSIONS.md`
4. **COMPLETE:** Mark tasks ✅ and run verification commands
5. **STOP:** Auto-stop when session completion criteria met

### Emergency Procedures
- **System Broken:** Follow `docs/workflow/FALLBACK_SYSTEM.md`
- **Model Fails:** Auto-escalation to higher-capacity model
- **Critical Error:** Fill `docs/workflow/FALLBACK_REPORT.md`

---

**Project Status:** ✅ Core functional, 🔄 Workflow ready  
**Next Action:** Execute `docs/workflow/CRUSH_STARTUP.md`  
**Total Investment:** $520-875, 10-12 days  
**Quality Target:** Enterprise production-ready