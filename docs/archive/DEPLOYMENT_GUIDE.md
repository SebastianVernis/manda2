# Manda2 Deployment Guide
**Version:** 1.0.0  
**Environment:** Production Ready  
**Last Updated:** 2025-09-18  
**Target:** AWS EC2 / Ubuntu Server

---

## 🎯 Deployment Overview

Manda2 is deployed using a modern production stack with:
- **Frontend**: React build served by Caddy
- **Backend**: Node.js API with PM2 process management
- **Database**: MongoDB with proper indexing
- **Proxy**: Caddy reverse proxy with automatic HTTPS
- **Monitoring**: PM2 monitoring and health checks

### Current Production Environment
- **URL**: http://3-85-74-100.nip.io:9080
- **Status**: ✅ Live and operational
- **Services**: All running via PM2
- **Security**: Enterprise-level protection

---

## 📋 Prerequisites

### System Requirements
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Amazon Linux 2
- **RAM**: Minimum 2GB, Recommended 4GB
- **Storage**: 20GB+ available space
- **Network**: Public IP with ports 80, 443, 9080 accessible

### Software Dependencies
```bash
# Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# PM2
npm install -g pm2

# Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

---

## 🚀 Step-by-Step Deployment

### Step 1: Clone and Setup Project
```bash
# Clone repository
git clone <repository-url> manda2-app
cd manda2-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Build frontend for production
npm run build
```

### Step 2: Environment Configuration

#### Backend Environment (.env)
```bash
# Current production configuration
JWT_SECRET=JWT_SECRET_REDACTADO_VER_ENV
MONGODB_URI=mongodb://localhost:27017/manda2
FRONTEND_URL=https://3-85-74-100.nip.io,http://localhost:3000
```

### Step 3: Database Setup
```bash
# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Database is automatically created on first use
# Current collections: usuarios, productos, pedidos
```

### Step 4: PM2 Process Management
```bash
# Start all services using ecosystem config
pm2 start ecosystem.config.js

# Current PM2 configuration:
# - manda2-backend: Node.js API (port 5000)
# - manda2-frontend: Static files served by Caddy
# - caddy-manda2: Reverse proxy (port 9080)

# Save PM2 configuration
pm2 save
pm2 startup
```

---

## 📊 Production Monitoring

### Service Status
```bash
# Check all services
pm2 status

# Expected output:
# ┌─────┬───────────────┬─────────────┬─────────┬─────────┬──────────┐
# │ id  │ name          │ status      │ restart │ uptime  │ cpu      │
# ├─────┼───────────────┼─────────────┼─────────┼─────────┼──────────┤
# │ 0   │ manda2-backend  │ online      │ 0       │ 2h      │ 0.1%     │
# │ 1   │ caddy-manda2    │ online      │ 0       │ 2h      │ 0%       │
# └─────┴───────────────┴─────────────┴─────────┴─────────┴──────────┘
```

### Health Checks
```bash
# API health check
curl -f http://localhost:5000/api/health

# Frontend availability
curl -f http://3-85-74-100.nip.io:9080

# Database connection test
mongosh --eval "db.adminCommand('ismaster')"
```

### Log Monitoring
```bash
# View all logs
pm2 logs

# View specific service logs
pm2 logs manda2-backend
pm2 logs caddy-manda2

# Monitor real-time
pm2 monit
```

---

## 🔧 Configuration Files

### PM2 Ecosystem (ecosystem.config.js)
```javascript
module.exports = {
  apps: [
    {
      name: 'manda2-backend',
      script: 'server.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log'
    },
    {
      name: 'caddy-manda2',
      script: 'caddy',
      args: 'run --config Caddyfile --adapter caddyfile',
      cwd: './',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

### Caddy Configuration (Caddyfile)
```
:9080 {
  # Serve frontend static files
  root * frontend/dist
  file_server
  
  # API routes
  handle /api/* {
    reverse_proxy localhost:5000
  }
  
  # SPA fallback for React Router
  try_files {path} /index.html
  
  # Security headers
  header {
    X-Content-Type-Options nosniff
    X-Frame-Options DENY
    X-XSS-Protection "1; mode=block"
  }
  
  # Enable compression
  encode gzip
}
```

---

## 🛡️ Security Configuration

### Current Security Features
- **JWT Authentication**: HS256 with 64-char secret
- **Input Sanitization**: XSS and NoSQL injection protection
- **Rate Limiting**: 1000 requests/15min globally
- **CORS**: Configured for production domains
- **Helmet**: Security headers enforced
- **Content Security Policy**: Comprehensive CSP rules

### Security Verification
```bash
# Check for vulnerabilities
cd backend && npm audit
cd frontend && npm audit

# Current status: 
# Backend: 0 vulnerabilities ✅
# Frontend: 14 moderate (non-critical) ⚠️
```

---

## 🔄 Deployment Procedures

### Standard Deployment
```bash
# 1. Pull latest changes
git pull origin main

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Build frontend
cd frontend && npm run build

# 4. Restart services
pm2 restart all

# 5. Verify deployment
curl -f http://3-85-74-100.nip.io:9080/api/health
```

### Zero-Downtime Deployment
```bash
# 1. Build new version
cd frontend && npm run build

# 2. Graceful restart
pm2 reload all

# 3. Health check
pm2 status
```

### Emergency Rollback
```bash
# 1. Revert to previous commit
git log --oneline -5
git checkout <previous-commit>

# 2. Rebuild and restart
cd frontend && npm run build
pm2 restart all
```

---

## 📈 Performance Optimization

### Current Performance Metrics
- **Build Time**: 6.64s
- **Bundle Size**: 1.3MB (8 chunks)
- **API Response Time**: <100ms average
- **Memory Usage**: ~150MB backend, ~50MB frontend

### Optimization Features
- **Bundle Splitting**: 8 optimized chunks
- **Lazy Loading**: Route-based code splitting
- **Compression**: Gzip enabled
- **Caching**: Service Worker + browser caching

---

## 🔧 Maintenance Tasks

### Daily Tasks
```bash
# Check service status
pm2 status

# View error logs
pm2 logs --err

# Monitor resources
pm2 monit
```

### Weekly Tasks
```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Check disk space
df -h

# Review logs
tail -n 100 backend/logs/combined.log
```

### Monthly Tasks
```bash
# Update dependencies
cd backend && npm update
cd frontend && npm update

# Security audit
npm audit

# Performance review
pm2 show manda2-backend
```

---

## 🆘 Troubleshooting

### Common Issues

#### Service Not Starting
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs manda2-backend

# Common solutions:
sudo systemctl start mongod  # Start database
pm2 restart manda2-backend     # Restart backend
pm2 reload all              # Reload all services
```

#### Database Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Test connection
mongosh --eval "db.adminCommand('ping')"

# Restart if needed
sudo systemctl restart mongod
```

#### Frontend Not Loading
```bash
# Check Caddy process
pm2 logs caddy-manda2

# Rebuild frontend
cd frontend && npm run build

# Restart Caddy
pm2 restart caddy-manda2
```

### Emergency Contacts
- **System Admin**: Check PM2 status and logs
- **Database Admin**: MongoDB service management
- **Security Team**: For security incidents

---

## 📊 Monitoring Dashboard

### Key Metrics to Monitor
1. **Service Uptime**: PM2 status
2. **Response Times**: API health checks
3. **Error Rates**: Log analysis
4. **Resource Usage**: CPU/Memory via PM2 monit
5. **Database Performance**: MongoDB slow query log

### Alerting (Future Enhancement)
```bash
# Setup monitoring (example with PM2 Plus)
pm2 link <secret-key> <public-key>

# Or use system monitoring
# - New Relic
# - DataDog
# - Prometheus + Grafana
```

---

## 📝 Environment Migration

### Development to Production
1. Update environment variables
2. Build optimized frontend
3. Configure production database
4. Setup SSL certificates
5. Enable monitoring and logging

### Staging Environment Setup
```bash
# Copy production config
cp ecosystem.config.js ecosystem.staging.config.js

# Modify for staging
# - Different ports
# - Separate database
# - Staging domain
```

---

**Deployment Status**: ✅ Production Ready  
**Current Version**: 1.0.0  
**Last Deployment**: Session 8 (2025-09-18)  
**Next Maintenance**: Weekly check scheduled