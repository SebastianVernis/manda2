# Despliegue en Railway

## Configuración Rápida

### 1. Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Click en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu repositorio

### 2. Agregar MongoDB

1. En tu proyecto, click en "New"
2. Selecciona "Database" → "Add MongoDB"
3. Railway generará automáticamente `MONGO_URL`

### 3. Configurar Variables de Entorno

En tu servicio de backend, agrega estas variables:

```bash
# Railway proporciona automáticamente PORT
NODE_ENV=production

# MongoDB - Copia el MONGO_URL del servicio MongoDB
MONGODB_URI=${{MongoDB.MONGO_URL}}/manda2

# JWT Secret - Genera uno seguro
JWT_SECRET=tu-clave-secreta-muy-larga-y-segura-123456789

# Frontend URL - Railway te dará el dominio
FRONTEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# Email (configuración IONOS o tu proveedor)
EMAIL_USER=contacto@tudominio.com
EMAIL_PASS=tu-password-de-email
EMAIL_HOST=smtp.ionos.mx
EMAIL_PORT=465
```

### 4. Configurar Dominio (Opcional)

1. Ve a "Settings" en tu servicio
2. En "Networking", click "Generate Domain"
3. Railway generará un dominio público tipo: `manda2-production.up.railway.app`
4. Actualiza `FRONTEND_URL` con tu nuevo dominio

### 5. Deploy

Railway desplegará automáticamente cuando:
- Hagas push a la rama principal
- Cambies variables de entorno
- Manualmente con "Deploy" button

## Estructura del Proyecto

```
manda2/
├── backend/          # API Node.js + Express
├── frontend/         # React + Vite
├── railway.json      # Configuración Railway
├── nixpacks.toml     # Build configuration
└── README_RAILWAY.md # Esta guía
```

## Comandos de Build

Railway ejecutará automáticamente:

1. **Install**: `npm ci` en backend y frontend
2. **Build**: `npm run build` en frontend (genera `/frontend/dist`)
3. **Start**: `npm start` en backend (sirve API + frontend estático)

## Variables de Entorno Importantes

### Generadas por Railway

- `PORT` - Puerto asignado automáticamente
- `RAILWAY_PUBLIC_DOMAIN` - Tu dominio público
- `MONGO_URL` - Connection string de MongoDB (desde el servicio)

### Debes Configurar

- `JWT_SECRET` - Clave para tokens JWT
- `FRONTEND_URL` - URL pública de tu app
- `EMAIL_*` - Configuración de correo

## Monitoreo

### Logs
```bash
railway logs
```

### Status
Railway dashboard muestra:
- CPU y memoria en tiempo real
- Logs de deploy
- Request metrics
- Database stats

## Solución de Problemas

### Build falla

1. Verifica que `package.json` tenga todas las dependencias
2. Revisa logs en Railway dashboard
3. Prueba build local: `cd frontend && npm run build`

### La app no inicia

1. Verifica que `PORT` esté configurado en `server.js`: `process.env.PORT || 5000`
2. Checa que MongoDB esté corriendo
3. Revisa variables de entorno

### CORS errors

1. Asegúrate que `FRONTEND_URL` coincida con tu dominio Railway
2. Verifica configuración de CORS en `backend/server.js`

### MongoDB no conecta

1. Usa la variable `${{MongoDB.MONGO_URL}}` en `MONGODB_URI`
2. Agrega el nombre de base de datos: `${{MongoDB.MONGO_URL}}/manda2`
3. Verifica que el servicio MongoDB esté activo

## Arquitectura en Railway

```
┌─────────────────────────────────────┐
│   Railway Project: manda2           │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────┐  ┌─────────────┐ │
│  │   Backend    │  │   MongoDB   │ │
│  │   Service    │──│   Service   │ │
│  │  (Node.js)   │  │             │ │
│  └──────────────┘  └─────────────┘ │
│         │                           │
│    Sirve Frontend                   │
│    (Static dist/)                   │
│         │                           │
│    Public Domain                    │
│    ↓                                │
│  https://manda2.railway.app         │
└─────────────────────────────────────┘
```

## Ventajas de Railway

✅ Auto-scaling  
✅ HTTPS automático  
✅ CI/CD integrado  
✅ MongoDB incluido  
✅ Logs en tiempo real  
✅ Zero-config deploys  
✅ Ambiente de staging  

## Costos

- **Starter Plan**: $5/mes con $5 de crédito incluido
- **Developer Plan**: Mejor para producción
- Cobro por uso (CPU, RAM, bandwidth)

## Comandos CLI (Opcional)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link proyecto
railway link

# Deploy manual
railway up

# Ver logs
railway logs

# Abrir app
railway open
```

## Siguientes Pasos

1. ✅ Crea proyecto en Railway
2. ✅ Agrega MongoDB
3. ✅ Configura variables de entorno
4. ✅ Deploy automático
5. ⏳ Configura dominio custom (opcional)
6. ⏳ Configura alertas y monitoring

## Soporte

- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Issues](tu-repo/issues)
