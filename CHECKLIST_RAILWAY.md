# ✅ Checklist Pre-Despliegue Railway

## 📦 Archivos Necesarios (Ya Creados)

- [x] `railway.json` - Configuración del proyecto
- [x] `nixpacks.toml` - Instrucciones de build
- [x] `Procfile` - Comando de inicio
- [x] `.railwayignore` - Archivos a excluir
- [x] `.npmrc` - Configuración NPM
- [x] `frontend/.env.production` - Variables del frontend
- [x] `.env.example` - Template de variables
- [x] `RAILWAY_DEPLOY.md` - Guía completa de despliegue

## 🔍 Verificaciones Pre-Push

### 1. Estructura del Proyecto
```bash
# Verificar que existan estos archivos
✓ backend/package.json
✓ backend/server.js
✓ frontend/package.json
✓ frontend/vite.config.js
```

### 2. Git Repository
```bash
# Inicializar git si no existe
cd manda2
git init

# Agregar remote (reemplaza con tu repo)
git remote add origin https://github.com/tu-usuario/manda2.git

# Verificar
git remote -v
```

### 3. Commit de Archivos Railway
```bash
git add .
git status  # Revisar que estén los archivos Railway
git commit -m "feat: Railway deployment configuration"
git push -u origin main
```

## 🚀 Pasos en Railway Dashboard

### 1. Crear Proyecto
- [ ] Login en railway.app
- [ ] New Project → Deploy from GitHub
- [ ] Seleccionar repositorio `manda2`
- [ ] Esperar detección automática de Node.js

### 2. Agregar MongoDB
- [ ] Click "New" → Database → MongoDB
- [ ] Esperar a que esté "Active"
- [ ] Copiar variable `MONGO_URL`

### 3. Configurar Variables de Entorno

En tu servicio de aplicación (no MongoDB), agregar:

```bash
# Ambiente (Railway auto-provee PORT)
NODE_ENV=production

# Base de Datos
MONGODB_URI=${{MongoDB.MONGO_URL}}/manda2

# JWT Secret - Generar con:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=<tu-clave-secreta-64-caracteres>

# Frontend URL - Después de generar dominio
FRONTEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# Email (tu proveedor SMTP)
EMAIL_USER=contacto@tudominio.com
EMAIL_PASS=tu-password
EMAIL_HOST=smtp.ionos.mx
EMAIL_PORT=465
```

### 4. Generar Dominio Público
- [ ] Settings → Networking → Generate Domain
- [ ] Copiar dominio (ej: `manda2-production.up.railway.app`)
- [ ] Actualizar `FRONTEND_URL` con el dominio completo

### 5. Deploy Manual (Primera Vez)
- [ ] Click "Deploy" en el dashboard
- [ ] Observar logs del build
- [ ] Esperar status "Active" (verde)

## 🧪 Verificación Post-Despliegue

### 1. Health Check
```bash
curl https://tu-dominio.railway.app/api/health
```

Debe responder:
```json
{
  "status": "ok",
  "database": "connected",
  "version": "1.0.0"
}
```

### 2. Frontend
- [ ] Abrir `https://tu-dominio.railway.app` en navegador
- [ ] Verificar que carga la página de login/home
- [ ] Abrir DevTools → Network → Verificar que no hay errores

### 3. Base de Datos
- [ ] Verificar en logs que dice "MongoDB conectado exitosamente"
- [ ] En Railway: MongoDB service → Metrics → Ver conexiones activas

### 4. Variables de Entorno
- [ ] En Railway: Service → Variables → Verificar que todas estén presentes
- [ ] Verificar que no haya typos en nombres de variables

## 🐛 Troubleshooting Común

### Build Falla
```bash
# Si dice "npm ci failed"
# Localmente:
cd backend && npm install && npm ci
cd frontend && npm install && npm ci
git add package-lock.json
git commit -m "fix: update package-lock.json"
git push
```

### App No Inicia
1. Verificar logs en Railway: Deployments → View Logs
2. Buscar errores de conexión MongoDB
3. Verificar que `PORT` se use en `server.js`: `process.env.PORT || 5000`
4. Chequear que MongoDB service esté "Active"

### CORS Errors
1. Verificar `FRONTEND_URL` en variables Railway
2. Debe ser exactamente: `https://tu-dominio.railway.app` (sin / al final)
3. En `backend/server.js`: `cors({ origin: process.env.FRONTEND_URL })`

### Frontend 404
1. Verificar que `frontend/dist/` se generó en build
2. En logs buscar: "vite build" → debe completar sin errores
3. Verificar en `server.js`:
```js
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));
}
```

## 📝 Notas Importantes

### NO Subir a Git
```bash
# Ya están en .gitignore:
node_modules/
.env
dist/
build/
*.log
```

### Seguridad
- ✅ JWT_SECRET debe ser aleatorio y largo (64+ caracteres)
- ✅ EMAIL_PASS nunca en código, solo en Railway variables
- ✅ .env nunca se commitea
- ✅ Usar HTTPS (Railway lo provee automático)

### Recursos Railway
- Railway detectará y asignará automáticamente:
  - CPU según uso
  - RAM según necesidad
  - Storage para MongoDB
  - Networking (con HTTPS)

### Escalabilidad
Railway auto-escala (en plan Pro):
- CPU: hasta 8 vCPUs
- RAM: hasta 32GB
- MongoDB: hasta 100GB storage

## 🎯 Resultado Final

Después de completar este checklist:

✅ Código en GitHub  
✅ Railway proyecto creado  
✅ MongoDB servicio activo  
✅ Variables configuradas  
✅ Dominio público generado  
✅ Aplicación desplegada  
✅ Health check OK  
✅ Frontend carga correctamente  

## 🚀 Deploy Automático Futuro

Una vez configurado, cada `git push` a `main` desplegará automáticamente:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
# Railway despliega automáticamente en ~2-5 minutos
```

## 📊 Monitoreo Continuo

Railway Dashboard muestra:
- ✅ CPU/RAM usage en tiempo real
- ✅ Logs streaming
- ✅ Request count
- ✅ Error rate
- ✅ Database metrics

## 🎉 ¡Listo!

Tu app está ahora en producción con:
- 🌐 HTTPS automático
- 💾 MongoDB persistente
- 🔄 CI/CD automático
- 📈 Monitoring incluido
- 🚀 Auto-scaling

---

**Última actualización:** 30 Nov 2025  
**Versión:** 1.0.0
