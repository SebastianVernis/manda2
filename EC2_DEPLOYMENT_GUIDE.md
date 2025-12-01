# 🚀 Guía de Despliegue: Backend en EC2 + Frontend en Vercel

## 📋 Resumen

Esta guía te llevará paso a paso para desplegar YEGA en una arquitectura híbrida:
- **Frontend:** Vercel (React + Vite) - GRATIS
- **Backend:** AWS EC2 (Node.js + Express) - $5-10/mes
- **Base de Datos:** MongoDB Atlas - GRATIS

**Tiempo estimado:** 3-4 horas  
**Nivel de dificultad:** Medio  
**Costo mensual:** $5-10 USD

---

## 🎯 Parte 1: Configurar AWS EC2 (1.5 horas)

### 1.1 Crear Instancia EC2

1. **Accede a AWS Console**
   - Ve a https://console.aws.amazon.com
   - Navega a EC2 → Instances → Launch Instance

2. **Configuración de la Instancia**
   ```
   Nombre: yega-backend
   AMI: Ubuntu Server 22.04 LTS (Free tier eligible)
   Tipo: t2.micro (1 vCPU, 1 GB RAM) - Free tier
   Key pair: Crea nuevo par de llaves "yega-key.pem"
   ```

3. **Configurar Security Group**
   
   Crea reglas de entrada:
   ```
   SSH     | TCP | 22   | Tu IP        | Acceso SSH
   HTTP    | TCP | 80   | 0.0.0.0/0    | Caddy redirect
   HTTPS   | TCP | 443  | 0.0.0.0/0    | API HTTPS
   Custom  | TCP | 5000 | 0.0.0.0/0    | API directa (temporal)
   ```

4. **Configurar Storage**
   ```
   Tamaño: 20 GB (suficiente para logs y uploads)
   Tipo: gp3 (más rápido que gp2)
   ```

5. **Launch Instance**
   - Descarga `yega-key.pem`
   - Guárdalo en lugar seguro (lo necesitarás siempre)

### 1.2 Conectar a EC2

```bash
# En tu máquina local
chmod 400 yega-key.pem
ssh -i yega-key.pem ubuntu@<TU-IP-PUBLICA-EC2>

# Ejemplo:
# ssh -i yega-key.pem ubuntu@54.123.45.67
```

### 1.3 Configurar Servidor (Ejecutar en EC2)

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version  # Debe mostrar v18.x.x
npm --version   # Debe mostrar v9.x.x

# Instalar PM2 (gestor de procesos)
sudo npm install -g pm2

# Instalar Git
sudo apt install -y git

# Instalar Caddy (servidor web/proxy)
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
```

### 1.4 Clonar Repositorio

```bash
# Crear directorio para aplicaciones
mkdir -p ~/apps
cd ~/apps

# Clonar tu repositorio
git clone https://github.com/TU-USUARIO/yega.git
cd yega

# Instalar dependencias del backend
cd backend
npm install --production
```

### 1.5 Configurar Variables de Entorno

```bash
# Crear archivo .env en backend
cd ~/apps/yega/backend
nano .env
```

Pega este contenido (ajusta los valores):

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/yega?retryWrites=true&w=majority

# JWT Secret (genera uno seguro)
JWT_SECRET=tu_secreto_super_seguro_de_64_caracteres_minimo_aqui_12345

# Frontend URL (lo configuraremos después)
FRONTEND_URL=https://tu-app.vercel.app

# Node Environment
NODE_ENV=production

# Puerto
PORT=5000
```

**Guardar:** `Ctrl + O`, `Enter`, `Ctrl + X`

### 1.6 Configurar PM2

```bash
# Iniciar aplicación con PM2
cd ~/apps/yega/backend
pm2 start server.js --name yega-backend

# Configurar PM2 para iniciar al arrancar
pm2 startup
# Copia y ejecuta el comando que te muestra

pm2 save

# Verificar que está corriendo
pm2 status
pm2 logs yega-backend
```

### 1.7 Configurar Caddy (Proxy Reverso)

```bash
# Editar configuración de Caddy
sudo nano /etc/caddy/Caddyfile
```

Reemplaza todo el contenido con:

```caddyfile
# Configuración para IP pública (temporal)
:80 {
    reverse_proxy localhost:5000
    
    # CORS headers
    header {
        Access-Control-Allow-Origin *
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Content-Type, Authorization"
    }
}

# Cuando tengas dominio, usa esto:
# api.tudominio.com {
#     reverse_proxy localhost:5000
#     
#     header {
#         Access-Control-Allow-Origin https://tu-app.vercel.app
#         Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
#         Access-Control-Allow-Headers "Content-Type, Authorization"
#     }
# }
```

**Guardar:** `Ctrl + O`, `Enter`, `Ctrl + X`

```bash
# Reiniciar Caddy
sudo systemctl restart caddy
sudo systemctl enable caddy

# Verificar estado
sudo systemctl status caddy
```

### 1.8 Verificar Backend

```bash
# Desde EC2
curl http://localhost:5000/api/health

# Desde tu máquina local
curl http://<TU-IP-EC2>/api/health

# Debe responder algo como:
# {"status":"ok","timestamp":"2024-12-01T..."}
```

---

## 🎯 Parte 2: Configurar MongoDB Atlas (30 min)

### 2.1 Crear Cluster

1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea cuenta gratuita
3. Create New Cluster → FREE (M0)
4. Región: Elige la más cercana a tu EC2
5. Cluster Name: `yega-production`

### 2.2 Configurar Acceso

1. **Database Access**
   - Add New Database User
   - Username: `yega_admin`
   - Password: Genera una segura (guárdala)
   - Database User Privileges: `Read and write to any database`

2. **Network Access**
   - Add IP Address
   - Opción 1: IP de tu EC2 (más seguro)
   - Opción 2: `0.0.0.0/0` (permite desde cualquier IP)

### 2.3 Obtener Connection String

1. Clusters → Connect → Connect your application
2. Driver: Node.js, Version: 4.1 or later
3. Copia el connection string:
   ```
   mongodb+srv://yega_admin:<password>@yega-production.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

4. Actualiza `.env` en EC2:
   ```bash
   cd ~/apps/yega/backend
   nano .env
   # Actualiza MONGODB_URI con tu connection string
   # Reemplaza <password> con tu contraseña real
   ```

5. Reinicia backend:
   ```bash
   pm2 restart yega-backend
   pm2 logs yega-backend
   # Debe mostrar: "✅ MongoDB conectado exitosamente"
   ```

---

## 🎯 Parte 3: Desplegar Frontend en Vercel (30 min)

### 3.1 Preparar Repositorio

```bash
# En tu máquina local
cd /ruta/a/tu/repo/yega

# Asegúrate de tener vercel.json en la raíz
# (ya lo creé en el análisis anterior)

# Commit y push
git add vercel.json
git commit -m "Add Vercel configuration"
git push origin main
```

### 3.2 Crear Proyecto en Vercel

1. Ve a https://vercel.com
2. Sign up con GitHub
3. Import Project → Import Git Repository
4. Selecciona tu repositorio `yega`

### 3.3 Configurar Build Settings

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.4 Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL = http://<TU-IP-EC2>
```

**Ejemplo:**
```
VITE_API_URL = http://54.123.45.67
```

### 3.5 Deploy

1. Click "Deploy"
2. Espera 2-3 minutos
3. Vercel te dará una URL: `https://yega-xxxxx.vercel.app`

### 3.6 Actualizar CORS en Backend

```bash
# Conecta a EC2
ssh -i yega-key.pem ubuntu@<TU-IP-EC2>

# Edita .env
cd ~/apps/yega/backend
nano .env

# Actualiza FRONTEND_URL con tu URL de Vercel
FRONTEND_URL=https://yega-xxxxx.vercel.app

# Guarda y reinicia
pm2 restart yega-backend
```

### 3.7 Actualizar Caddyfile

```bash
sudo nano /etc/caddy/Caddyfile
```

Cambia el header CORS:

```caddyfile
:80 {
    reverse_proxy localhost:5000
    
    header {
        Access-Control-Allow-Origin https://yega-xxxxx.vercel.app
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Content-Type, Authorization"
    }
}
```

```bash
sudo systemctl restart caddy
```

---

## 🎯 Parte 4: Verificación y Testing (30 min)

### 4.1 Verificar Backend

```bash
# Health check
curl http://<TU-IP-EC2>/api/health

# Test de registro
curl -X POST http://<TU-IP-EC2>/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "telefono": "1234567890",
    "rol": "cliente"
  }'
```

### 4.2 Verificar Frontend

1. Abre tu URL de Vercel: `https://yega-xxxxx.vercel.app`
2. Verifica que carga correctamente
3. Abre DevTools → Console (no debe haber errores CORS)
4. Prueba registro/login

### 4.3 Verificar Integración

1. **Registro de usuario**
   - Crea cuenta desde el frontend
   - Verifica en MongoDB Atlas que se creó el usuario

2. **Login**
   - Inicia sesión
   - Verifica que recibes token JWT

3. **Operaciones CRUD**
   - Crea un pedido
   - Lista pedidos
   - Actualiza estado

### 4.4 Verificar Logs

```bash
# En EC2
pm2 logs yega-backend --lines 100

# Ver errores
pm2 logs yega-backend --err

# Monitoreo en tiempo real
pm2 monit
```

---

## 🎯 Parte 5: Configuración Avanzada (Opcional)

### 5.1 Configurar Dominio Personalizado

#### En Vercel (Frontend)

1. Vercel Dashboard → Settings → Domains
2. Add Domain: `www.tudominio.com`
3. Sigue instrucciones para configurar DNS

#### En EC2 (Backend)

1. **Compra dominio** (ej: Namecheap, GoDaddy)

2. **Configura DNS:**
   ```
   Tipo: A
   Host: api
   Value: <TU-IP-EC2>
   TTL: 300
   ```

3. **Actualiza Caddyfile:**
   ```bash
   sudo nano /etc/caddy/Caddyfile
   ```
   
   ```caddyfile
   api.tudominio.com {
       reverse_proxy localhost:5000
       
       header {
           Access-Control-Allow-Origin https://www.tudominio.com
           Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
           Access-Control-Allow-Headers "Content-Type, Authorization"
       }
   }
   ```

4. **Reinicia Caddy:**
   ```bash
   sudo systemctl restart caddy
   ```
   
   Caddy automáticamente obtendrá certificado SSL de Let's Encrypt.

5. **Actualiza variables de entorno:**
   
   En Vercel:
   ```
   VITE_API_URL = https://api.tudominio.com
   ```
   
   En EC2:
   ```bash
   nano ~/apps/yega/backend/.env
   # FRONTEND_URL=https://www.tudominio.com
   pm2 restart yega-backend
   ```

### 5.2 Configurar Backups Automáticos

```bash
# Crear script de backup
nano ~/backup-mongodb.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=~/backups
mkdir -p $BACKUP_DIR

# Backup de MongoDB (si usas local)
# mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/mongo_$DATE"

# Backup de uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz ~/apps/yega/backend/uploads

# Eliminar backups antiguos (más de 7 días)
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completado: $DATE"
```

```bash
chmod +x ~/backup-mongodb.sh

# Configurar cron para backup diario a las 2 AM
crontab -e
# Agrega esta línea:
0 2 * * * /home/ubuntu/backup-mongodb.sh >> /home/ubuntu/backup.log 2>&1
```

### 5.3 Configurar Monitoreo

```bash
# Instalar PM2 monitoring
pm2 install pm2-logrotate

# Configurar rotación de logs
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### 5.4 Configurar Firewall (UFW)

```bash
# Habilitar firewall
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Verificar estado
sudo ufw status
```

---

## 🔧 Mantenimiento y Operaciones

### Actualizar Código

```bash
# Conecta a EC2
ssh -i yega-key.pem ubuntu@<TU-IP-EC2>

# Navega al proyecto
cd ~/apps/yega

# Pull últimos cambios
git pull origin main

# Instala nuevas dependencias (si hay)
cd backend
npm install --production

# Reinicia aplicación
pm2 restart yega-backend

# Verifica logs
pm2 logs yega-backend --lines 50
```

### Ver Logs

```bash
# Logs en tiempo real
pm2 logs yega-backend

# Últimas 100 líneas
pm2 logs yega-backend --lines 100

# Solo errores
pm2 logs yega-backend --err

# Logs de Caddy
sudo journalctl -u caddy -f
```

### Reiniciar Servicios

```bash
# Reiniciar backend
pm2 restart yega-backend

# Reiniciar Caddy
sudo systemctl restart caddy

# Reiniciar todo el servidor (último recurso)
sudo reboot
```

### Monitoreo de Recursos

```bash
# Ver uso de CPU/RAM
pm2 monit

# Ver procesos
htop  # (instalar con: sudo apt install htop)

# Ver espacio en disco
df -h

# Ver uso de memoria
free -h
```

---

## 🐛 Troubleshooting

### Problema: Backend no responde

```bash
# Verificar que PM2 está corriendo
pm2 status

# Si está stopped, iniciar
pm2 start yega-backend

# Ver logs de error
pm2 logs yega-backend --err --lines 50

# Verificar puerto 5000
sudo netstat -tulpn | grep 5000
```

### Problema: Error de conexión a MongoDB

```bash
# Verificar variables de entorno
cd ~/apps/yega/backend
cat .env | grep MONGODB_URI

# Probar conexión manualmente
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI || 'tu-uri-aqui').then(() => console.log('OK')).catch(e => console.error(e))"

# Verificar IP en MongoDB Atlas Network Access
# Debe incluir la IP de tu EC2
```

### Problema: CORS errors en frontend

```bash
# Verificar FRONTEND_URL en backend
cat ~/apps/yega/backend/.env | grep FRONTEND_URL

# Verificar Caddyfile
sudo cat /etc/caddy/Caddyfile

# Reiniciar ambos
pm2 restart yega-backend
sudo systemctl restart caddy
```

### Problema: Certificado SSL no funciona

```bash
# Ver logs de Caddy
sudo journalctl -u caddy -n 100

# Verificar que el dominio apunta a la IP correcta
nslookup api.tudominio.com

# Forzar renovación de certificado
sudo caddy reload --config /etc/caddy/Caddyfile
```

### Problema: Servidor lento

```bash
# Ver uso de recursos
pm2 monit

# Ver procesos que consumen más
top

# Limpiar logs antiguos
pm2 flush

# Reiniciar PM2
pm2 restart all
```

---

## 💰 Costos Estimados

| Servicio | Plan | Costo Mensual |
|----------|------|---------------|
| **AWS EC2** | t2.micro | $8-10 USD |
| **MongoDB Atlas** | M0 (Free) | $0 |
| **Vercel** | Hobby | $0 |
| **Dominio** | .com (opcional) | $12/año (~$1/mes) |
| **Total** | | **$8-11 USD/mes** |

### Optimización de Costos

- **EC2 Reserved Instance:** Ahorra 30-40% si pagas por 1 año
- **EC2 Spot Instance:** Ahorra hasta 70% (pero puede interrumpirse)
- **Usar Lightsail:** $5/mes fijo (más simple que EC2)

---

## 📊 Comparación con Otras Opciones

| Característica | EC2 + Vercel | Railway + Vercel | Full VPS |
|----------------|--------------|------------------|----------|
| **Costo** | $8-10/mes | $5/mes | $5-20/mes |
| **Setup** | 3-4 horas | 2 horas | 5-6 horas |
| **Control** | ✅ Total | ⚠️ Limitado | ✅ Total |
| **Escalabilidad** | ✅ Fácil | ⚠️ Limitada | ⚠️ Manual |
| **SSL automático** | ✅ Sí (Caddy) | ✅ Sí | ⚠️ Manual |
| **Deploy automático** | ⚠️ Manual | ✅ Automático | ⚠️ Manual |
| **Monitoreo** | ⚠️ Manual | ✅ Incluido | ⚠️ Manual |

---

## ✅ Checklist Final

### Pre-Deploy
- [ ] Cuenta AWS creada
- [ ] Cuenta MongoDB Atlas creada
- [ ] Cuenta Vercel creada
- [ ] Repositorio en GitHub actualizado

### EC2 Setup
- [ ] Instancia EC2 creada y corriendo
- [ ] Security Group configurado
- [ ] SSH funcionando
- [ ] Node.js instalado
- [ ] PM2 instalado
- [ ] Caddy instalado
- [ ] Repositorio clonado
- [ ] Variables de entorno configuradas
- [ ] Backend corriendo con PM2
- [ ] Caddy configurado y corriendo

### MongoDB
- [ ] Cluster creado
- [ ] Usuario de base de datos creado
- [ ] IP de EC2 en whitelist
- [ ] Connection string probado

### Vercel
- [ ] Proyecto importado
- [ ] Build settings configurados
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] URL funcionando

### Integración
- [ ] CORS configurado correctamente
- [ ] Frontend se conecta al backend
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Operaciones CRUD funcionan

### Opcional
- [ ] Dominio personalizado configurado
- [ ] SSL funcionando
- [ ] Backups configurados
- [ ] Monitoreo configurado

---

## 📚 Recursos Adicionales

### Documentación Oficial
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Caddy Documentation](https://caddyserver.com/docs/)

### Tutoriales Útiles
- [How to Deploy Node.js on AWS EC2](https://www.youtube.com/results?search_query=deploy+nodejs+aws+ec2)
- [PM2 Production Best Practices](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)
- [Caddy Reverse Proxy Setup](https://caddyserver.com/docs/quick-starts/reverse-proxy)

---

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa logs:**
   ```bash
   pm2 logs yega-backend --lines 100
   sudo journalctl -u caddy -n 100
   ```

2. **Verifica configuración:**
   ```bash
   pm2 status
   sudo systemctl status caddy
   curl http://localhost:5000/api/health
   ```

3. **Consulta documentación:**
   - Revisa `TROUBLESHOOTING.md` en el repo
   - Busca el error específico en Google
   - Revisa issues en GitHub del proyecto

---

## 🎉 ¡Felicidades!

Si llegaste hasta aquí y todo funciona, ¡tu aplicación YEGA está en producción!

**Próximos pasos recomendados:**
1. Configura dominio personalizado
2. Implementa backups automáticos
3. Configura monitoreo con UptimeRobot
4. Implementa CI/CD con GitHub Actions
5. Optimiza rendimiento con caching

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0  
**Autor:** Blackbox AI
