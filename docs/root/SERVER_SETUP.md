# YEGA Server Setup Guide

## Quick Start

### 1. Build and Deploy (Automated)
```bash
# Build application
./scripts/shell/build.sh production

# Deploy with Caddy (recommended)
./scripts/shell/deploy.sh --caddy

# Or deploy with Nginx
./scripts/shell/deploy.sh --nginx

# Or deploy with custom domain and SSL
./scripts/shell/deploy.sh --caddy --domain=yourdomain.com --ssl
```

### 2. Manual Setup

#### Install Dependencies
```bash
# Root level
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Services
```bash
# With PM2 (recommended)
pm2 start ecosystem.config.js

# Or manually
cd backend && npm start &
```

## Web Server Configuration

### Caddy (Recommended)
```bash
# Start Caddy
sudo caddy run --config Caddyfile

# Or as service
sudo systemctl start caddy
```

### Nginx
```bash
# Copy configuration
sudo cp nginx.conf /etc/nginx/sites-available/yega
sudo ln -s /etc/nginx/sites-available/yega /etc/nginx/sites-enabled/

# Start Nginx
sudo systemctl start nginx
```

## Environment Configuration

### Backend Environment (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/yega
JWT_SECRET=your-super-secret-jwt-key-minimum-64-characters-long-string
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

### Frontend Environment (.env.production)
```env
VITE_API_URL=http://172.31.39.53:5000/api
VITE_APP_NAME=YEGA
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

## Service Management

### PM2 Commands
```bash
pm2 status           # Check status
pm2 logs             # View logs
pm2 restart all      # Restart all services
pm2 stop all         # Stop all services
pm2 delete all       # Remove all services
```

### System Service (Optional)
```bash
# Install as system service
sudo cp yega.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable yega
sudo systemctl start yega
```

## Health Checks

### Backend API
```bash
curl http://localhost:5000/api/health
```

### Frontend
```bash
curl http://localhost:80/
```

### Full System Check
```bash
# Check processes
pm2 status

# Check ports
sudo netstat -tlnp | grep -E ':(3000|5000|80) '

# Check logs
pm2 logs --lines 50
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :5000
   sudo kill -9 <PID>
   ```

2. **Permission denied**
   ```bash
   sudo chown -R ec2-user:ec2-user /home/ec2-user/yega-app
   chmod +x scripts/shell/*.sh
   ```

3. **MongoDB connection error**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

4. **Build failures**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

### Log Locations
- PM2 logs: `~/.pm2/logs/`
- Application logs: `./logs/`
- Caddy logs: `sudo journalctl -u caddy`
- Nginx logs: `/var/log/nginx/`

## Performance Optimization

### Enable Gzip (Nginx)
Already configured in nginx.conf

### Enable HTTP/2 (Caddy)
Automatically enabled with HTTPS

### Database Indexing
```javascript
// Connect to MongoDB and create indexes
db.usuarios.createIndex({ email: 1 })
db.pedidos.createIndex({ cliente: 1, fecha: -1 })
db.productos.createIndex({ tienda: 1, activo: 1 })
```

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Configure firewall (ufw/iptables)
- [ ] Set up SSL certificates
- [ ] Update system packages
- [ ] Configure MongoDB authentication
- [ ] Set proper file permissions
- [ ] Enable fail2ban (optional)

## Production Deployment

### With SSL Certificate
```bash
# Let's Encrypt with Caddy (automatic)
./deploy.sh --caddy --domain=yourdomain.com --ssl

# Manual SSL with Nginx
# 1. Obtain SSL certificate
# 2. Update nginx.conf with SSL configuration
# 3. Restart nginx
```

### With Load Balancer
Update ecosystem.config.js to run multiple instances:
```javascript
instances: 'max' // Use all CPU cores
```

## Monitoring

### Basic Monitoring
```bash
# CPU and memory usage
htop

# Disk usage
df -h

# Service status
pm2 monit
```

### Advanced Monitoring (Optional)
- Prometheus + Grafana
- New Relic
- DataDog
- CloudWatch (AWS)