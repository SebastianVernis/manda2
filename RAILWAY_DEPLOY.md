# 🚂 Despliegue en Railway - Guía Completa

## 📋 Pre-requisitos

- Cuenta en [Railway](https://railway.app)
- Repositorio Git (GitHub, GitLab, o Bitbucket)
- Código pusheado a tu repositorio

## 🚀 Paso a Paso

### 1️⃣ Crear Proyecto en Railway

1. Accede a [railway.app](https://railway.app) y haz login
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway a acceder a tu GitHub
5. Selecciona el repositorio `manda2`
6. Railway detectará automáticamente Node.js

### 2️⃣ Agregar Base de Datos MongoDB

1. En tu proyecto, click en **"New"** → **"Database"**
2. Selecciona **"MongoDB"**
3. Railway creará un servicio MongoDB con:
   - Variable `MONGO_URL` generada automáticamente
   - Almacenamiento persistente
   - Conexión privada entre servicios

### 3️⃣ Configurar Variables de Entorno

En el servicio de tu aplicación (no el de MongoDB), ve a **"Variables"** y agrega:

```bash
# Automático - Railway lo provee
PORT=<generado automáticamente>

# Ambiente
NODE_ENV=production

# Base de datos - Usar referencia al servicio MongoDB
MONGODB_URI=${{MongoDB.MONGO_URL}}/manda2

# JWT - Genera una clave segura
# Usa: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=tu-clave-secreta-muy-larga-generada-64-caracteres-minimo

# Frontend - Railway genera dominio público
FRONTEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# Email - Configura tu proveedor SMTP
EMAIL_USER=contacto@tudominio.com
EMAIL_PASS=tu-password-smtp
EMAIL_HOST=smtp.ionos.mx
EMAIL_PORT=465
```

#### 🔐 Generar JWT Secret seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4️⃣ Configurar Dominio Público

1. Ve a **"Settings"** de tu servicio
2. En **"Networking"** → **"Public Networking"**
3. Click **"Generate Domain"**
4. Railway generará algo como: `manda2-production.up.railway.app`
5. Copia el dominio y actualiza `FRONTEND_URL`:

```bash
FRONTEND_URL=https://manda2-production.up.railway.app
```

### 5️⃣ Deploy

Railway desplegará automáticamente. Puedes ver el progreso en tiempo real:

1. Click en **"Deployments"**
2. Observa los logs del build
3. Espera a que el status sea **"Active"**

## 📁 Estructura del Proyecto

```
manda2/
├── backend/              # API Express + Node.js
│   ├── server.js         # Entry point
│   ├── package.json
│   └── .env              # Local (no se sube)
├── frontend/             # React + Vite
│   ├── src/
│   ├── package.json
│   └── .env.production   # Configuración para build
├── railway.json          # Configuración Railway
├── nixpacks.toml         # Build instructions
├── Procfile              # Start command
├── .railwayignore        # Archivos a ignorar
└── README_RAILWAY.md     # Esta guía
```

## 🔄 Proceso de Build en Railway

Railway ejecuta automáticamente estos pasos:

### 1. Install Dependencies
```bash
cd backend && npm ci --only=production
cd frontend && npm ci
```

### 2. Build Frontend
```bash
cd frontend && NODE_ENV=production npm run build
# Genera: frontend/dist/
```

### 3. Start Backend
```bash
cd backend && NODE_ENV=production npm start
# Backend sirve:
# - API en /api/*
# - Frontend estático desde ../frontend/dist
```

## 🌐 Arquitectura en Railway

```
┌─────────────────────────────────────────┐
│   Railway Project: manda2               │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────┐  ┌──────────────┐ │
│  │  App Service    │  │   MongoDB    │ │
│  │  (Node.js)      │──│   Service    │ │
│  │                 │  │              │ │
│  │  Backend API    │  │  27017       │ │
│  │  /api/*         │  └──────────────┘ │
│  │                 │                   │
│  │  Static Files   │                   │
│  │  frontend/dist/ │                   │
│  └─────────────────┘                   │
│          │                              │
│     Public Domain                       │
│          ↓                              │
│  https://manda2.railway.app             │
└─────────────────────────────────────────┘
```

## ✅ Verificar Despliegue

### 1. Health Check
```bash
curl https://tu-app.railway.app/api/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "database": "connected",
  "version": "1.0.0",
  "uptime": 123.45
}
```

### 2. Frontend
Visita `https://tu-app.railway.app` en el navegador.

### 3. Logs en Railway
```bash
# En Railway Dashboard
Deployments → Ver logs en tiempo real
```

## 🔧 Troubleshooting

### ❌ Build falla

**Problema:** `npm ci failed`

**Solución:**
```bash
# Verifica package-lock.json existe
# Asegúrate que todas las dependencias estén en package.json
cd backend && npm install
cd frontend && npm install
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

### ❌ App no inicia

**Problema:** `Application failed to respond`

**Solución:**
1. Verifica `PORT` en server.js: `process.env.PORT || 5000`
2. Checa que MongoDB esté corriendo
3. Revisa variables de entorno en Railway
4. Mira logs: `Deployments → View Logs`

### ❌ CORS Errors

**Problema:** `CORS policy: No 'Access-Control-Allow-Origin'`

**Solución:**
```js
// En backend/server.js
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ 
  origin: frontendUrl, 
  credentials: true 
}));
```

Verifica `FRONTEND_URL` en Railway variables.

### ❌ MongoDB no conecta

**Problema:** `MongooseError: Failed to connect`

**Solución:**
1. Usa referencia Railway: `${{MongoDB.MONGO_URL}}/manda2`
2. Verifica servicio MongoDB está activo
3. Checa logs de MongoDB en Railway
4. Prueba conexión desde tu app:
```bash
# En Railway Shell
curl $MONGODB_URI
```

### ❌ Static files 404

**Problema:** Frontend no carga, 404 en archivos JS/CSS

**Solución:**
1. Verifica build de frontend:
```bash
cd frontend && npm run build
ls dist/  # Debe tener index.html y assets/
```

2. Checa que backend sirva estático:
```js
// backend/server.js
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}
```

## 📊 Monitoreo

### Ver Logs
```bash
# En Dashboard
Deployments → View Logs → Live Logs
```

### Métricas Automáticas
Railway muestra:
- ✅ CPU usage
- ✅ Memory usage
- ✅ Network traffic
- ✅ Request count
- ✅ Response times

### Alertas
Configura en **Settings → Notifications**:
- Build failures
- Deployment status
- Resource limits

## 💰 Costos

### Starter Plan
- **$5/mes** base
- **$5 de crédito incluido**
- Pago por uso:
  - CPU: ~$0.000463/minute
  - RAM: ~$0.000231/GB-minute
  - Network: $0.10/GB

### Developer Plan
- **$20/mes** 
- Mejor para producción
- Más recursos incluidos

### Estimación para manda2:
- App pequeña: **~$5-10/mes**
- Tráfico moderado: **~$10-20/mes**
- Alto tráfico: **~$20-50/mes**

## 🎯 Optimizaciones

### 1. Reducir Tamaño del Build
```bash
# .railwayignore
node_modules/
*.md
docs/
tests/
coverage/
```

### 2. Cache de Dependencies
Railway cachea automáticamente `node_modules/`

### 3. Minificar Frontend
```js
// vite.config.js ya tiene:
build: {
  minify: 'esbuild',
  sourcemap: false,
}
```

### 4. Gzip Compression
```js
// backend/server.js
const compression = require('compression');
app.use(compression());
```

## 🚀 CI/CD Automático

Railway despliega automáticamente cuando:
- ✅ Push a rama `main` o `master`
- ✅ Merge de Pull Request
- ✅ Cambio en variables de entorno

### Deshabilitar Auto-Deploy:
```bash
Settings → Builds → Auto Deploy: OFF
```

## 🔐 Seguridad

### Variables Sensibles
- ✅ Nunca commitear `.env` 
- ✅ Usar Railway Variables
- ✅ Generar JWT_SECRET seguro
- ✅ Rotar secrets periódicamente

### HTTPS
- ✅ Railway provee HTTPS automático
- ✅ Certificados SSL/TLS gestionados

### Rate Limiting
Ya implementado en `backend/middleware/securityMiddleware.js`

## 📚 Comandos Útiles

### Railway CLI (Opcional)

```bash
# Instalar
npm i -g @railway/cli

# Login
railway login

# Link proyecto
railway link

# Ver variables
railway variables

# Ver logs
railway logs

# Deploy manual
railway up

# Shell en container
railway shell

# Abrir en navegador
railway open
```

## 🆘 Soporte

- 📖 [Railway Docs](https://docs.railway.app)
- 💬 [Railway Discord](https://discord.gg/railway)
- 🐛 [GitHub Issues](https://github.com/tu-repo/manda2/issues)
- 📧 [Railway Support](https://railway.app/support)

## ✨ Ventajas de Railway

| Feature | Railway | Heroku | Vercel | AWS |
|---------|---------|--------|--------|-----|
| Setup | ⚡ 5 min | 🔸 15 min | ⚡ 5 min | 🔴 Horas |
| HTTPS | ✅ Auto | ✅ Auto | ✅ Auto | ❌ Manual |
| MongoDB | ✅ 1-click | 🔸 Add-on | ❌ No | 🔴 Complejo |
| Logs | ✅ Real-time | ✅ Sí | 🔸 Básico | 🔸 CloudWatch |
| Precio | 💰 $5+ | 💰💰 $7+ | 💰 $20+ | 💰💰💰 Variable |
| CI/CD | ✅ Automático | ✅ Sí | ✅ Sí | 🔸 Manual |

## 🎉 Próximos Pasos

Después del despliegue:

1. ✅ Configura dominio custom
2. ✅ Configura alerts de monitoring
3. ✅ Agrega staging environment
4. ✅ Configura backups de MongoDB
5. ✅ Implementa logging avanzado (Logtail, etc.)
6. ✅ Configura analytics (Google Analytics, Mixpanel)

---

**¿Listo para desplegar?** 🚀

```bash
git add .
git commit -m "feat: Railway deployment configuration"
git push origin main
# Ve a Railway Dashboard y observa el magic happen! ✨
```
