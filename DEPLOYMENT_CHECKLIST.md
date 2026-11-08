# 📋 Checklist de Despliegue Completo - Manda2/YEGA

**Fecha de Evaluación:** 12 de Noviembre, 2025  
**Estado del Proyecto:** Pre-Despliegue con Conflictos de Merge

---

## 🚨 PROBLEMAS CRÍTICOS DETECTADOS

### 1. ⚠️ Conflictos de Merge Git (PRIORIDAD ALTA)
**Estado:** ❌ BLOQUEANTE

Los siguientes archivos tienen conflictos de merge sin resolver:

- [ ] `/package.json` - Línea 21
- [ ] `/Caddyfile` - Líneas 32, 48, 98, 114
- [ ] `/backend/.env` - Línea 5

**Acción Requerida:**
```bash
# Resolver conflictos manualmente
git status
# Editar archivos y elegir la versión correcta
# Eliminar marcadores: <<<<<<< HEAD, =======, >>>>>>> branch
git add <archivos-resueltos>
git commit -m "Resolve merge conflicts"
```

### 2. 📦 Dependencias No Instaladas (PRIORIDAD ALTA)
**Estado:** ❌ BLOQUEANTE

**Backend:** Todas las dependencias muestran "UNMET DEPENDENCY"
**Frontend:** Todas las dependencias muestran "UNMET DEPENDENCY"

**Acción Requerida:**
```bash
# Backend
cd /vercel/sandbox/backend
npm install

# Frontend
cd /vercel/sandbox/frontend
npm install
```

### 3. 🏗️ Frontend No Compilado (PRIORIDAD ALTA)
**Estado:** ❌ BLOQUEANTE

El directorio `/frontend/dist` no existe.

**Acción Requerida:**
```bash
cd /vercel/sandbox/frontend
npm run build
```

### 4. 🗄️ MongoDB No Instalado (PRIORIDAD ALTA)
**Estado:** ❌ BLOQUEANTE

MongoDB no está instalado en el sistema.

**Acción Requerida:**
```bash
chmod +x install-mongodb.sh
sudo ./install-mongodb.sh
mongosh < setup-manda2-db.js
```

### 5. 🔧 Herramientas de Despliegue Faltantes (PRIORIDAD MEDIA)
**Estado:** ⚠️ REQUERIDO

- [ ] PM2 - No instalado
- [ ] Caddy - No instalado
- [ ] Nginx - No instalado (alternativa)

**Acción Requerida:**
```bash
# Instalar PM2
npm install -g pm2

# Instalar Caddy (recomendado)
# Ver: https://caddyserver.com/docs/install

# O instalar Nginx (alternativa)
sudo dnf install nginx -y
```

---

## 📝 CHECKLIST DE CONFIGURACIÓN

### A. Configuración de Entorno

#### Backend (.env)
- [ ] Resolver conflicto de merge en `FRONTEND_URL`
- [ ] Verificar `MONGODB_URI` (actualmente: `mongodb://localhost:27017/yega`)
- [ ] Verificar `JWT_SECRET` está configurado
- [ ] Configurar credenciales de email:
  - [ ] `EMAIL_USER=correo@redactado.local`
  - [ ] `EMAIL_PASS=EMAIL_PASS_REDACTADO_VER_ENV`
  - [ ] `EMAIL_HOST=smtp.ionos.mx`
  - [ ] `EMAIL_PORT=465`
- [ ] Verificar `PORT=5000`

**Decisión Requerida:** ¿Usar HTTP o HTTPS?
- Opción A: `FRONTEND_URL=https://yega.3.85.74.100.nip.io` (HTTPS con nip.io)
- Opción B: `FRONTEND_URL=http://172.31.39.53,http://localhost:3000` (HTTP múltiples orígenes)

#### Frontend (.env.production)
- [ ] Actualizar `VITE_API_URL` según decisión de dominio
  - Actual: `http://3.85.74.100/api`
  - ¿Cambiar a HTTPS?: `https://yega.3.85.74.100.nip.io/api`
- [ ] Verificar `VITE_APP_NAME=YEGA`
- [ ] Verificar `VITE_ENVIRONMENT=production`

#### Caddyfile
- [ ] Resolver conflictos de merge (líneas 32, 48, 98, 114)
- [ ] Decidir puerto del backend: ¿5000 o 5001?
- [ ] Configurar dominio correcto
- [ ] Verificar rutas de archivos estáticos

---

## 🔨 CHECKLIST DE CONSTRUCCIÓN

### 1. Preparación del Entorno
- [ ] Node.js v22.14.0 instalado ✅
- [ ] npm 10.9.2 instalado ✅
- [ ] Git configurado ✅
- [ ] Permisos de ejecución en scripts:
  ```bash
  chmod +x build.sh deploy.sh install-mongodb.sh
  ```

### 2. Instalación de Dependencias
- [ ] Backend: `cd backend && npm install`
- [ ] Frontend: `cd frontend && npm install`
- [ ] Root: `npm install` (para concurrently)

### 3. Compilación
- [ ] Frontend build: `cd frontend && npm run build`
- [ ] Verificar `frontend/dist` existe
- [ ] Verificar tamaño del bundle es razonable

### 4. Linting y Validación
- [ ] Backend lint: `cd backend && npm run lint`
- [ ] Frontend lint: `cd frontend && npm run lint`
- [ ] Resolver warnings críticos

---

## 🗄️ CHECKLIST DE BASE DE DATOS

### MongoDB Setup
- [ ] Instalar MongoDB: `sudo ./install-mongodb.sh`
- [ ] Iniciar servicio: `sudo systemctl start mongod`
- [ ] Habilitar auto-inicio: `sudo systemctl enable mongod`
- [ ] Verificar conexión: `mongosh`
- [ ] Crear base de datos: `mongosh < setup-manda2-db.js`
- [ ] Verificar colecciones creadas:
  ```bash
  mongosh yega --eval "show collections"
  ```
- [ ] Verificar usuario admin existe:
  ```bash
  mongosh yega --eval "db.usuarios.findOne({rol: 'administrador'})"
  ```
- [ ] Probar conexión desde app: `node test-mongodb.js`

### Índices y Optimización
- [ ] Verificar índices creados
- [ ] Configurar TTL para OTPs
- [ ] Índices geoespaciales para ubicaciones

---

## 🌐 CHECKLIST DE SERVIDOR WEB

### Opción A: Caddy (Recomendado)
- [ ] Instalar Caddy
- [ ] Resolver conflictos en Caddyfile
- [ ] Validar configuración: `caddy validate --config Caddyfile`
- [ ] Configurar dominio (nip.io o dominio real)
- [ ] Configurar SSL automático (Let's Encrypt)
- [ ] Iniciar Caddy: `sudo caddy run --config Caddyfile`
- [ ] Verificar puerto 80 y 443 abiertos

### Opción B: Nginx (Alternativa)
- [ ] Instalar Nginx: `sudo dnf install nginx -y`
- [ ] Copiar configuración: `sudo cp nginx.conf /etc/nginx/sites-available/manda2`
- [ ] Crear symlink: `sudo ln -s /etc/nginx/sites-available/manda2 /etc/nginx/sites-enabled/`
- [ ] Validar configuración: `sudo nginx -t`
- [ ] Iniciar Nginx: `sudo systemctl start nginx`
- [ ] Habilitar auto-inicio: `sudo systemctl enable nginx`

---

## 🚀 CHECKLIST DE DESPLIEGUE

### 1. Pre-Despliegue
- [ ] Todos los conflictos de merge resueltos
- [ ] Todas las dependencias instaladas
- [ ] Frontend compilado exitosamente
- [ ] MongoDB corriendo y configurado
- [ ] Variables de entorno configuradas
- [ ] Servidor web instalado y configurado

### 2. Despliegue con PM2
- [ ] Instalar PM2: `npm install -g pm2`
- [ ] Actualizar rutas en `ecosystem.config.js` si es necesario
- [ ] Iniciar servicios: `pm2 start ecosystem.config.js`
- [ ] Verificar estado: `pm2 status`
- [ ] Configurar auto-inicio: `pm2 startup && pm2 save`
- [ ] Verificar logs: `pm2 logs`

### 3. Verificación de Servicios
- [ ] Backend corriendo en puerto 5000
  ```bash
  curl http://localhost:5000/api/health
  ```
- [ ] Frontend accesible en puerto 80
  ```bash
  curl http://localhost:80/
  ```
- [ ] API endpoints funcionando
  ```bash
  node test-backend.js
  ```
- [ ] MongoDB conectado
  ```bash
  node test-mongodb.js
  ```

### 4. Pruebas de Integración
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] OTP por email funciona: `node test-otp-email.js`
- [ ] Verificación OTP funciona: `node test-otp-verify.js`
- [ ] CORS configurado correctamente
- [ ] Uploads de archivos funcionan
- [ ] Rutas protegidas requieren autenticación

---

## 🔒 CHECKLIST DE SEGURIDAD

### Configuración Básica
- [ ] JWT_SECRET es fuerte y único (64+ caracteres) ✅
- [ ] Variables de entorno no están en git
- [ ] CORS configurado correctamente (no usar '*' en producción)
- [ ] Helmet configurado para headers de seguridad
- [ ] Rate limiting activado
- [ ] Input sanitization activado

### Firewall y Red
- [ ] Configurar firewall (ufw/iptables):
  ```bash
  sudo ufw allow 22/tcp    # SSH
  sudo ufw allow 80/tcp    # HTTP
  sudo ufw allow 443/tcp   # HTTPS
  sudo ufw enable
  ```
- [ ] MongoDB solo accesible localmente (puerto 27017 no expuesto)
- [ ] Backend solo accesible via proxy reverso

### SSL/TLS (Producción)
- [ ] Certificado SSL instalado
- [ ] HTTPS forzado (redirect HTTP → HTTPS)
- [ ] HSTS header configurado
- [ ] Certificado auto-renovable (Let's Encrypt)

### Credenciales
- [ ] Cambiar contraseña admin por defecto
- [ ] Rotar JWT_SECRET si fue expuesto
- [ ] Credenciales de email seguras
- [ ] MongoDB authentication habilitada (opcional para producción)

---

## 📱 CHECKLIST DE APLICACIÓN MÓVIL (Android)

### Estructura Detectada
- [ ] Proyecto Gradle configurado ✅
- [ ] AndroidManifest.xml existe ✅
- [ ] Estructura de carpetas correcta

### Configuración
- [ ] Actualizar API URL en configuración Android
- [ ] Configurar permisos en AndroidManifest.xml
- [ ] Configurar signing keys para release
- [ ] Actualizar versionCode y versionName

### Build
- [ ] Instalar Android SDK
- [ ] Instalar Gradle
- [ ] Build debug: `./gradlew assembleDebug`
- [ ] Build release: `./gradlew assembleRelease`
- [ ] Probar APK en dispositivo

---

## 🧪 CHECKLIST DE TESTING

### Tests Unitarios
- [ ] Backend tests: `cd backend && npm test`
- [ ] Frontend tests: `cd frontend && npm test`
- [ ] Configurar Jest/Vitest si no está configurado

### Tests de Integración
- [ ] Test de autenticación completo
- [ ] Test de flujo de pedidos
- [ ] Test de roles y permisos
- [ ] Test de uploads
- [ ] Test de emails

### Tests Manuales
- [ ] Registro de cliente
- [ ] Registro de tienda
- [ ] Registro de repartidor
- [ ] Login con diferentes roles
- [ ] Crear producto (tienda)
- [ ] Crear pedido (cliente)
- [ ] Aceptar pedido (tienda)
- [ ] Asignar repartidor
- [ ] Completar entrega
- [ ] Panel de administrador

### Performance
- [ ] Tiempo de carga < 3 segundos
- [ ] API response time < 500ms
- [ ] Bundle size optimizado
- [ ] Imágenes optimizadas
- [ ] Lazy loading implementado

---

## 📊 CHECKLIST DE MONITOREO

### Logs
- [ ] PM2 logs configurados
- [ ] Backend logs en `backend/logs/`
- [ ] Caddy/Nginx logs accesibles
- [ ] MongoDB logs monitoreados
- [ ] Rotación de logs configurada

### Métricas
- [ ] CPU usage monitoreado
- [ ] Memory usage monitoreado
- [ ] Disk space monitoreado
- [ ] Network traffic monitoreado
- [ ] Database performance monitoreado

### Alertas
- [ ] Alertas de servicio caído
- [ ] Alertas de disco lleno
- [ ] Alertas de errores críticos
- [ ] Alertas de performance degradado

---

## 🔄 CHECKLIST DE BACKUP

### Base de Datos
- [ ] Script de backup automático:
  ```bash
  mongodump --db yega --out /backup/mongodb/$(date +%Y%m%d)
  ```
- [ ] Backup diario configurado (cron)
- [ ] Backup semanal configurado
- [ ] Backup mensual configurado
- [ ] Procedimiento de restore documentado
- [ ] Backups probados (restore test)

### Código y Configuración
- [ ] Repositorio git actualizado
- [ ] Tags de versión creados
- [ ] Configuraciones respaldadas
- [ ] Documentación actualizada

### Archivos de Usuario
- [ ] Uploads respaldados
- [ ] Logs importantes archivados
- [ ] Certificados SSL respaldados

---

## 📚 CHECKLIST DE DOCUMENTACIÓN

### Técnica
- [ ] README.md actualizado
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Diagramas de arquitectura
- [ ] Diagramas de base de datos
- [ ] Guías de deployment actualizadas

### Usuario
- [ ] Manual de usuario (cliente)
- [ ] Manual de usuario (tienda)
- [ ] Manual de usuario (repartidor)
- [ ] Manual de administrador
- [ ] FAQs

### Operacional
- [ ] Runbook de operaciones
- [ ] Procedimientos de emergencia
- [ ] Contactos de soporte
- [ ] SLAs definidos

---

## 🎯 CHECKLIST DE GO-LIVE

### Pre-Lanzamiento (T-7 días)
- [ ] Todos los tests pasando
- [ ] Performance aceptable
- [ ] Seguridad auditada
- [ ] Backups configurados
- [ ] Monitoreo activo
- [ ] Documentación completa

### Pre-Lanzamiento (T-1 día)
- [ ] Backup completo realizado
- [ ] DNS configurado (si aplica)
- [ ] SSL certificado válido
- [ ] Equipo de soporte alertado
- [ ] Plan de rollback preparado
- [ ] Comunicación a usuarios preparada

### Día del Lanzamiento
- [ ] Verificar todos los servicios corriendo
- [ ] Smoke tests ejecutados
- [ ] Monitoreo activo
- [ ] Equipo disponible para soporte
- [ ] Comunicación enviada a usuarios

### Post-Lanzamiento (T+1 día)
- [ ] Revisar logs de errores
- [ ] Revisar métricas de performance
- [ ] Revisar feedback de usuarios
- [ ] Documentar issues encontrados
- [ ] Planear hotfixes si es necesario

---

## 🛠️ COMANDOS RÁPIDOS DE REFERENCIA

### Instalación Completa
```bash
# 1. Resolver conflictos de merge
git status
# Editar archivos manualmente
git add .
git commit -m "Resolve merge conflicts"

# 2. Instalar dependencias
cd /vercel/sandbox
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 3. Instalar MongoDB
chmod +x install-mongodb.sh
sudo ./install-mongodb.sh
sudo systemctl start mongod
mongosh < setup-manda2-db.js

# 4. Instalar PM2
npm install -g pm2

# 5. Compilar frontend
cd frontend
npm run build
cd ..

# 6. Instalar Caddy (ver documentación oficial)
# O instalar Nginx
sudo dnf install nginx -y

# 7. Desplegar
./deploy.sh --caddy
```

### Verificación Rápida
```bash
# Estado de servicios
pm2 status
sudo systemctl status mongod
sudo systemctl status caddy  # o nginx

# Health checks
curl http://localhost:5000/api/health
curl http://localhost:80/

# Logs
pm2 logs
sudo journalctl -u mongod -f
sudo journalctl -u caddy -f
```

### Troubleshooting
```bash
# Reiniciar servicios
pm2 restart all
sudo systemctl restart mongod
sudo systemctl restart caddy

# Ver logs de errores
pm2 logs --err
tail -f backend/logs/err.log

# Verificar puertos
sudo netstat -tlnp | grep -E ':(80|443|5000|27017)'

# Verificar procesos
ps aux | grep -E '(node|mongod|caddy)'
```

---

## 📈 MÉTRICAS DE ÉXITO

### Técnicas
- [ ] Uptime > 99.9%
- [ ] Response time < 500ms (p95)
- [ ] Error rate < 0.1%
- [ ] Build time < 5 minutos
- [ ] Deploy time < 10 minutos

### Negocio
- [ ] Usuarios pueden registrarse
- [ ] Tiendas pueden listar productos
- [ ] Clientes pueden hacer pedidos
- [ ] Repartidores pueden entregar
- [ ] Administradores pueden gestionar

---

## 🎓 PRÓXIMOS PASOS RECOMENDADOS

### Corto Plazo (1-2 semanas)
1. Resolver conflictos de merge
2. Instalar todas las dependencias
3. Configurar MongoDB
4. Compilar y desplegar
5. Realizar testing básico
6. Configurar SSL/HTTPS

### Medio Plazo (1 mes)
1. Implementar CI/CD pipeline
2. Configurar monitoreo avanzado
3. Optimizar performance
4. Implementar tests automatizados
5. Documentar APIs
6. Configurar staging environment

### Largo Plazo (3 meses)
1. Implementar analytics
2. Configurar CDN
3. Implementar caching (Redis)
4. Escalar horizontalmente
5. Implementar microservicios (si es necesario)
6. Auditoría de seguridad profesional

---

## ✅ RESUMEN EJECUTIVO

### Estado Actual
- **Código:** ⚠️ Conflictos de merge presentes
- **Dependencias:** ❌ No instaladas
- **Build:** ❌ Frontend no compilado
- **Base de Datos:** ❌ MongoDB no instalado
- **Servidor Web:** ❌ No configurado
- **Despliegue:** ❌ No realizado

### Tiempo Estimado para Despliegue Completo
- **Resolución de conflictos:** 30 minutos
- **Instalación de dependencias:** 15 minutos
- **Configuración de MongoDB:** 20 minutos
- **Compilación y build:** 10 minutos
- **Configuración de servidor web:** 30 minutos
- **Despliegue y testing:** 30 minutos
- **Total:** ~2.5 horas

### Prioridades
1. 🔴 **CRÍTICO:** Resolver conflictos de merge
2. 🔴 **CRÍTICO:** Instalar dependencias
3. 🔴 **CRÍTICO:** Configurar MongoDB
4. 🟡 **ALTO:** Compilar frontend
5. 🟡 **ALTO:** Configurar servidor web
6. 🟢 **MEDIO:** Testing completo
7. 🟢 **MEDIO:** Documentación
8. 🔵 **BAJO:** Optimizaciones

---

**Generado:** 12 de Noviembre, 2025  
**Versión:** 1.0  
**Proyecto:** Manda2/YEGA Delivery Platform
