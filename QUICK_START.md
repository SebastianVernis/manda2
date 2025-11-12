# 🚀 Guía Rápida de Despliegue - YEGA/Manda2

**Score de Preparación:** 82% ✅  
**Tiempo Total:** ~1 hora  
**Estado:** LISTO para despliegue

---

## ⚡ Despliegue en 5 Pasos

### 1️⃣ Instalar Dependencias (15 min)

```bash
cd /vercel/sandbox

# Root
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 2️⃣ Compilar Frontend (2 min)

```bash
cd frontend
npm run build
cd ..
```

### 3️⃣ Instalar MongoDB (10 min)

```bash
sudo ./install-mongodb.sh
mongosh < setup-manda2-db.js
```

### 4️⃣ Instalar Herramientas (5 min)

```bash
# PM2
npm install -g pm2

# Caddy (recomendado)
# Ver: https://caddyserver.com/docs/install
# O Nginx:
sudo dnf install nginx -y
```

### 5️⃣ Desplegar (5 min)

```bash
# Automático
./deploy.sh --caddy

# O manual
pm2 start ecosystem.config.js
sudo caddy run --config Caddyfile
```

---

## ✅ Verificación Rápida

```bash
# Estado de servicios
pm2 status
sudo systemctl status mongod

# Health checks
curl http://localhost:5000/api/health
curl http://localhost:80/

# Ver logs
pm2 logs
```

---

## 🔧 Comandos Útiles

### Gestión de Servicios
```bash
pm2 restart all          # Reiniciar todo
pm2 stop all            # Detener todo
pm2 logs                # Ver logs
pm2 monit               # Monitor en tiempo real
```

### MongoDB
```bash
sudo systemctl start mongod
sudo systemctl status mongod
mongosh yega            # Conectar a DB
```

### Troubleshooting
```bash
# Puerto ocupado
sudo lsof -i :5000
sudo kill -9 <PID>

# Reiniciar todo
pm2 restart all
sudo systemctl restart mongod
sudo systemctl restart caddy
```

---

## 📊 URLs de Acceso

- **Frontend:** http://3.85.74.100 o https://manda2.3.85.74.100.nip.io
- **API:** http://3.85.74.100/api
- **Health:** http://localhost:5000/api/health

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| "UNMET DEPENDENCY" | `npm install` |
| "Cannot find module" | `npm install` |
| "MongoDB connection failed" | `sudo systemctl start mongod` |
| "Port already in use" | `sudo lsof -i :5000 && kill -9 <PID>` |
| "Permission denied" | `chmod +x *.sh` |
| Página en blanco | `cd frontend && npm run build` |

---

## 📚 Documentación Completa

- `DEPLOYMENT_TEST_RESULTS.md` - Resultados de pruebas
- `DEPLOYMENT_CHECKLIST.md` - Checklist completo
- `SERVER_SETUP.md` - Configuración del servidor
- `MONGODB_SETUP.md` - Configuración de MongoDB

---

## 🎯 Credenciales por Defecto

**Admin:**
- Email: admin@manda2.com
- Password: admin123

⚠️ **IMPORTANTE:** Cambiar en producción

---

## 📞 Testing Funcional

1. Abrir navegador en http://3.85.74.100
2. Registrar nuevo usuario
3. Verificar email con OTP
4. Login
5. Probar funcionalidades principales

---

**Última actualización:** 12 Nov 2025  
**Versión:** 1.0
