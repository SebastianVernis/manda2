# 🚀 Desplegar Manda2 en Railway - INICIO RÁPIDO

## 📍 Estás Aquí

Tu proyecto **ya está configurado** para despliegue en Railway. Todos los archivos necesarios están listos.

## ⚡ 3 Pasos para Desplegar

### 1️⃣ Push a GitHub (2 minutos)

```bash
cd manda2

# Si no tienes git iniciado
git init
git add .
git commit -m "feat: Railway deployment ready"

# Agregar tu repositorio remoto
git remote add origin https://github.com/TU_USUARIO/manda2.git
git branch -M main
git push -u origin main
```

### 2️⃣ Crear Proyecto en Railway (3 minutos)

1. Ve a [railway.app](https://railway.app) y haz login con GitHub
2. Click **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Elige tu repositorio `manda2`
5. Railway detectará Node.js automáticamente

### 3️⃣ Configurar (5 minutos)

#### A. Agregar MongoDB
- En tu proyecto, click **"New"** → **"Database"** → **"MongoDB"**
- Espera a que esté "Active"

#### B. Variables de Entorno
En tu servicio de app, click **"Variables"** y agrega:

```bash
NODE_ENV=production
MONGODB_URI=${{MongoDB.MONGO_URL}}/manda2
JWT_SECRET=<genera-con-comando-abajo>
FRONTEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
EMAIL_USER=contacto@tudominio.com
EMAIL_PASS=tu-password
EMAIL_HOST=smtp.ionos.mx
EMAIL_PORT=465
```

**Generar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### C. Generar Dominio
- **Settings** → **Networking** → **"Generate Domain"**
- Copia el dominio y actualiza `FRONTEND_URL` con el valor completo

## ✅ Verificar

```bash
# Health check
curl https://tu-dominio.railway.app/api/health

# Abrir en navegador
open https://tu-dominio.railway.app
```

## 📚 Más Información

- **Guía Completa:** [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)
- **Checklist Detallado:** [CHECKLIST_RAILWAY.md](CHECKLIST_RAILWAY.md)
- **Resumen Rápido:** [README_RAILWAY.md](README_RAILWAY.md)

## 🆘 Problemas?

1. **Build falla**: Ver logs en Railway → Deployments → View Logs
2. **CORS error**: Verificar `FRONTEND_URL` coincide con tu dominio
3. **MongoDB error**: Usar `${{MongoDB.MONGO_URL}}/manda2` en `MONGODB_URI`

## 🎯 Archivos Configurados

✅ `railway.json` - Configuración principal  
✅ `nixpacks.toml` - Instrucciones de build  
✅ `Procfile` - Comando de inicio  
✅ `.railwayignore` - Archivos a excluir  
✅ `frontend/.env.production` - Variables frontend  

## 🚀 ¡Ya está todo listo!

Solo necesitas hacer el push y crear el proyecto en Railway. Todo lo demás está configurado.

---

**Tiempo estimado total: 10 minutos**
