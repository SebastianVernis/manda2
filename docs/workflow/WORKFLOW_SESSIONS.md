# Workflow Premium por Sesiones - YEGA

## Instrucciones para Agentes

**IMPORTANTE:** Al completar una sesión, el agente debe:
1. ✅ Marcar todas las tareas como completadas
2. 🔄 Ejecutar comandos de verificación
3. 📝 Reportar estado final
4. 🛑 **DETENERSE** automáticamente

---

## SESIÓN 1: Arquitectura & Setup Base
**Modelo:** Claude 3.5 Sonnet  
**Costo:** $20-30  
**Duración:** 0.5 días (1 sesión completa)  
**Objetivo:** Preparar base arquitectural

### Checklist de Tareas
- [x] **1.1** Analizar arquitectura actual del proyecto
- [x] **1.2** Documentar patrones de componentes existentes
- [x] **1.3** Definir interfaces para nuevos componentes
- [x] **1.4** Crear estructura base para Repartidor/Pedidos.jsx
- [x] **1.5** Crear estructura base para Cliente/Dashboard.jsx
- [x] **1.6** Configurar imports y dependencias necesarias

### Comandos de Verificación
```bash
# Verificar estructura
ls -la frontend/src/pages/Repartidor/
ls -la frontend/src/pages/Cliente/
# Verificar build
cd frontend && npm run build
```

### Criterios de Finalización
- [x] Archivos base creados sin errores
- [x] Build exitoso
- [x] Estructura documentada
- [x] **🛑 SESIÓN COMPLETADA - DETENER AQUÍ**

---

## SESIÓN 2: Repartidor/Pedidos.jsx - Core Development
**Modelo:** Claude 3.5 Sonnet  
**Costo:** $150-250  
**Duración:** 2-3 días (1 sesión completa)  
**Objetivo:** Implementar sistema completo de pedidos para repartidores

### Checklist de Tareas
- [ ] **2.1** Implementar estado global para gestión de pedidos
- [ ] **2.2** Crear componentes de lista de pedidos disponibles
- [ ] **2.3** Implementar interfaz de aceptar/rechazar pedidos
- [ ] **2.4** Agregar sistema de seguimiento de entregas
- [ ] **2.5** Integrar geolocalización y mapas
- [ ] **2.6** Implementar estados de entrega (recogido, en_camino, entregado)
- [ ] **2.7** Conectar con APIs backend (/api/orders/)
- [ ] **2.8** Implementar WebSocket para actualizaciones en tiempo real

### Comandos de Verificación
```bash
# Verificar componente
cd frontend && npm run dev
# Abrir http://localhost:5173/repartidor/pedidos
# Verificar console sin errores
cd frontend && npm run build
```

### Criterios de Finalización
- [ ] Componente renderiza sin errores
- [ ] APIs conectadas correctamente
- [ ] Estados de pedidos funcionales
- [ ] Geolocalización operativa
- [ ] WebSocket conectado
- [ ] **🛑 SESIÓN COMPLETADA - DETENER AQUÍ**

---

## SESIÓN 3: Cliente/Dashboard.jsx - Core Development
**Modelo:** Claude 3.5 Sonnet  
**Costo:** $100-150  
**Duración:** 1-2 días (1 sesión completa)  
**Objetivo:** Implementar dashboard completo para clientes

### Checklist de Tareas
- [ ] **3.1** Crear componente dashboard responsivo
- [ ] **3.2** Implementar sección de pedidos activos
- [ ] **3.3** Agregar resumen de historial de pedidos
- [ ] **3.4** Implementar métricas de usuario (gastos, frecuencia)
- [ ] **3.5** Crear accesos rápidos a funciones principales
- [ ] **3.6** Integrar sistema de notificaciones
- [ ] **3.7** Conectar con APIs backend (/api/users/, /api/orders/)
- [ ] **3.8** Implementar gráficos y visualizaciones de datos

### Comandos de Verificación
```bash
# Verificar componente
cd frontend && npm run dev
# Abrir http://localhost:5173/cliente/dashboard
# Verificar responsive design
cd frontend && npm run build
```

### Criterios de Finalización
- [ ] Dashboard renderiza correctamente
- [ ] Datos se cargan desde APIs
- [ ] Responsive design funcional
- [ ] Métricas calculadas correctamente
- [ ] Navegación fluida
- [ ] **🛑 SESIÓN COMPLETADA - DETENER AQUÍ**

---

## SESIÓN 4: Consistencia Visual - Cliente & Tienda
**Modelo:** Claude 3.5 Sonnet  
**Costo:** $55-90 ($30-50 Cliente + $25-40 Tienda)  
**Duración:** 1 día (1 sesión completa)  
**Objetivo:** Aplicar gradiente consistente + optimizaciones UX

### Checklist de Tareas
- [x] **4.1** Cliente/Tiendas.jsx - aplicar gradiente + responsive
- [x] **4.2** Cliente/Pedidos.jsx - aplicar gradiente + UX improvements
- [x] **4.3** Cliente/Seguimiento.jsx - aplicar gradiente + tracking UX
- [x] **4.4** Cliente/Historial.jsx - aplicar gradiente + data visualization
- [x] **4.5** Cliente/MyCart.jsx - aplicar gradiente + checkout flow
- [x] **4.6** Cliente/Perfil.jsx - aplicar gradiente + form validation
- [x] **4.7** Tienda/Dashboard.jsx - aplicar gradiente + metrics
- [x] **4.8** Tienda/Productos.jsx - aplicar gradiente + inventory UX
- [x] **4.9** Tienda/Pedidos.jsx - aplicar gradiente + order management
- [x] **4.10** Tienda/Inventario.jsx - aplicar gradiente + stock control
- [x] **4.11** Tienda/Estadisticas.jsx - aplicar gradiente + analytics
- [x] **4.12** Tienda/Direccion.jsx - aplicar gradiente + location UX
- [x] **4.13** Tienda/Perfil.jsx - aplicar gradiente + business settings

### Comandos de Verificación
```bash
# Verificar gradientes aplicados
grep -r "from-gray-900 via-black to-gray-900" frontend/src/pages/Cliente/
grep -r "from-gray-900 via-black to-gray-900" frontend/src/pages/Tienda/
# Build test
cd frontend && npm run build
```

### Criterios de Finalización
- [ ] 13 archivos actualizados con gradiente consistente
- [ ] Responsive design optimizado en todos
- [ ] UX improvements implementadas
- [ ] Build exitoso sin warnings
- [ ] **🛑 SESIÓN COMPLETADA - DETENER AQUÍ**

---

## SESIÓN 5: Consistencia Visual - Repartidor & Generales
**Modelo:** Claude 3.5 Sonnet  
**Costo:** $40-65 ($25-40 Repartidor + $15-25 Generales)  
**Duración:** 0.75 días (1 sesión completa)  
**Objetivo:** Completar consistencia visual + optimizaciones finales

### Checklist de Tareas
- [ ] **5.1** Repartidor/Dashboard.jsx - aplicar gradiente + delivery metrics
- [ ] **5.2** Repartidor/Historial.jsx - aplicar gradiente + delivery history
- [ ] **5.3** Repartidor/Estadisticas.jsx - aplicar gradiente + performance analytics
- [ ] **5.4** Repartidor/Ubicacion.jsx - aplicar gradiente + location tracking
- [ ] **5.5** Repartidor/Vehiculo.jsx - aplicar gradiente + vehicle management
- [ ] **5.6** Repartidor/Perfil.jsx - aplicar gradiente + driver profile
- [ ] **5.7** Home.jsx - aplicar gradiente + landing page optimization
- [ ] **5.8** Login.jsx - aplicar gradiente + auth UX
- [ ] **5.9** Register.jsx - aplicar gradiente + registration flow
- [ ] **5.10** VerifyOTP.jsx - aplicar gradiente + verification UX

### Comandos de Verificación
```bash
# Verificar gradientes aplicados
grep -r "from-gray-900 via-black to-gray-900" frontend/src/pages/Repartidor/
grep -r "from-gray-900 via-black to-gray-900" frontend/src/pages/ --include="*.jsx" | grep -E "(Home|Login|Register|VerifyOTP)"
# Build test
cd frontend && npm run build
```

### Criterios de Finalización
- [ ] 10 archivos actualizados con gradiente consistente  
- [ ] Todas las pantallas con visual consistency
- [ ] UX optimizations implementadas
- [ ] Build exitoso sin warnings
- [ ] **🛑 SESIÓN COMPLETADA - DETENER AQUÍ**

---

## SESIÓN 6: Testing & Performance
**Modelo:** GPT-4 Turbo (Testing) + Claude 3.5 Sonnet (Performance)  
**Costo:** $80-130 ($40-70 Testing + $40-60 Performance)  
**Duración:** 2 días (1 sesión completa)  
**Objetivo:** Testing comprehensivo + optimización de performance

### Checklist de Tareas

#### GPT-4 Turbo - Testing Funcional ($40-70)
- [ ] **6.1** Crear test suite para Repartidor/Pedidos.jsx
- [ ] **6.2** Crear test suite para Cliente/Dashboard.jsx
- [ ] **6.3** Implementar integration tests para flujos principales
- [ ] **6.4** Configurar E2E testing con Playwright
- [ ] **6.5** Performance testing automatizado

#### Claude 3.5 Sonnet - Performance Optimization ($40-60)
- [ ] **6.6** Bundle size optimization
- [ ] **6.7** Lazy loading implementation
- [ ] **6.8** Memoization optimization
- [ ] **6.9** Code splitting estratégico
- [ ] **6.10** Render optimization

### Comandos de Verificación
```bash
# Run tests
cd frontend && npm test
# Performance audit
cd frontend && npm run build && npm run preview
# Check bundle size
cd frontend && npx vite-bundle-analyzer
```

### Criterios de Finalización
- [ ] Test coverage >90%
- [ ] Performance score >95
- [ ] Bundle size optimizado
- [ ] Accessibility score >95
- [ ] All tests passing
- [ ] **🛑 SESIÓN COMPLETADA - DETENER AQUÍ**

---

## SESIÓN 7: Security & Production Readiness
**Modelo:** Claude 3.5 Sonnet  
**Costo:** $100-160 ($30-50 Security + $50-80 PWA + $20-30 CI/CD)  
**Duración:** 2 días (1 sesión completa)  
**Objetivo:** Security audit + PWA features + CI/CD pipeline

### Checklist de Tareas

#### Claude 3.5 Sonnet - Security Audit ($30-50)
- [ ] **7.1** Security audit completo (OWASP)
- [ ] **7.2** Authentication flow validation
- [ ] **7.3** Data validation & sanitization
- [ ] **7.4** HTTPS enforcement verification
- [ ] **7.5** Environment variables security

#### Claude 3.5 Sonnet - PWA Features ($50-80)
- [ ] **7.6** Service worker optimization
- [ ] **7.7** Offline functionality
- [ ] **7.8** Push notifications setup
- [ ] **7.9** App manifest configuration
- [ ] **7.10** Performance monitoring

#### Claude 3.5 Sonnet - CI/CD Setup ($20-30)
- [ ] **7.11** GitHub Actions pipeline configuration
- [ ] **7.12** Deployment automation
- [ ] **7.13** Error tracking setup

### Comandos de Verificación
```bash
# Security check
cd frontend && npm audit
cd backend && npm audit
# PWA verification
cd frontend && npm run build && npx lighthouse https://3-85-74-100.nip.io --view
# Production build
cd frontend && npm run build
cd backend && npm start
```

### Criterios de Finalización
- [ ] Security audit passed
- [ ] PWA features functional
- [ ] CI/CD pipeline operational
- [ ] Production deployment successful
- [ ] Monitoring active
- [ ] **🛑 SESIÓN COMPLETADA - DETENER AQUÍ**

---

## SESIÓN 8: Documentation & Final Review
**Modelo:** Claude 3.5 Sonnet  
**Costo:** $75-125 ($30-50 Docs + $25-40 A11y + $20-35 Mobile Review)  
**Duración:** 1.5 días (1 sesión completa)  
**Objetivo:** Documentación completa + accessibility audit + mobile review final

### Checklist de Tareas

#### Claude 3.5 Sonnet - Documentación ($30-50)
- [ ] **8.1** Architecture Decision Records (ADRs)
- [ ] **8.2** Component library documentation
- [ ] **8.3** API documentation update
- [ ] **8.4** Testing strategy guide
- [ ] **8.5** Deployment guide
- [ ] **8.6** Update CRUSH.md with new commands

#### Claude 3.5 Sonnet - Accessibility Audit ($25-40)
- [ ] **8.7** WCAG 2.1 compliance audit
- [ ] **8.8** Screen reader optimization
- [ ] **8.9** Keyboard navigation testing
- [ ] **8.10** High contrast mode validation

#### Claude 3.5 Sonnet - Mobile Responsive Review ($20-35)
- [ ] **8.11** Cross-device testing completo
- [ ] **8.12** Touch optimization validation
- [ ] **8.13** Performance en dispositivos móviles
- [ ] **8.14** Final responsive design audit

### Comandos de Verificación
```bash
# Verify documentation
ls -la docs/
# Generate final build
cd frontend && npm run build
cd backend && npm test
# Final system check
pm2 status
```

### Criterios de Finalización
- [ ] Documentation completa y actualizada
- [ ] Knowledge transfer materials ready
- [ ] Final build successful
- [ ] System fully operational
- [ ] Handover completed
- [ ] **🛑 PROYECTO COMPLETADO - WORKFLOW FINALIZADO**

---

## Resumen del Workflow

**Total Sessions:** 8  
**Timeline:** 10-12 días  
**Investment:** $520-875 (según modelos_list.csv)  
**Quality:** Enterprise production-ready

### Breakdown de Costos:
- Sesión 1: $20-30 (Setup)
- Sesión 2: $150-250 (Repartidor/Pedidos)
- Sesión 3: $100-150 (Cliente/Dashboard)  
- Sesión 4: $55-90 (Visual Cliente+Tienda)
- Sesión 5: $40-65 (Visual Repartidor+General)
- Sesión 6: $80-130 (Testing+Performance)
- Sesión 7: $100-160 (Security+PWA+CI/CD)
- Sesión 8: $75-125 (Docs+A11y+Mobile)  

**Automatic Stop Points:** Cada sesión tiene criterios claros de finalización para detención automática del agente.

**Next Session Command:** Para continuar al siguiente sesión, usar:
```bash
# Verificar sesión actual completada
grep -c "🛑 SESIÓN COMPLETADA" WORKFLOW_SESSIONS.md
```