#!/bin/bash

# Script to automatically resolve merge conflicts
# This script makes intelligent decisions based on the context

echo "🔧 Fixing merge conflicts in critical files..."

# Fix package.json - keep HEAD version with dependencies
cat > /vercel/sandbox/package.json << 'EOF'
{
  "name": "manda2-app",
  "version": "1.0.0",
  "description": "Manda2 - Complete delivery platform",
  "private": true,
  "scripts": {
    "install-deps": "cd backend && npm install && cd ../frontend && npm install",
    "build": "cd frontend && npm run build",
    "build:prod": "cd frontend && NODE_ENV=production npm run build",
    "start:backend": "cd backend && npm start",
    "start:frontend": "cd frontend && npm start",
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "deploy": "npm run install-deps && npm run build:prod && pm2 restart ecosystem.config.js",
    "logs": "pm2 logs",
    "status": "pm2 status",
    "stop": "pm2 stop ecosystem.config.js",
    "restart": "pm2 restart ecosystem.config.js"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  },
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "mongodb": "^6.20.0"
  }
}
EOF

echo "✅ Fixed package.json"

# Fix backend/.env - use HTTPS version for production
cat > /vercel/sandbox/backend/.env << 'EOF'
NODE_ENV=production
PORT=5000
JWT_SECRET=REDACTADO_VER_ENV
MONGODB_URI=mongodb://localhost:27017/yega
FRONTEND_URL=https://yega.3.85.74.100.nip.io
EMAIL_USER=REDACTADO_VER_ENV
EMAIL_PASS=REDACTADO_VER_ENV
EMAIL_HOST=smtp.ionos.mx
EMAIL_PORT=465
EOF

echo "✅ Fixed backend/.env"

# Fix Caddyfile - use port 5000 consistently
cat > /vercel/sandbox/Caddyfile << 'EOF'
{
    email admin@manda2.com.mx
}

# HTTPS configuration with nip.io and Let's Encrypt
manda2.3.85.74.100.nip.io {
    encode zstd gzip
    root * /home/ec2-user/manda2-app/frontend/dist
    file_server
    
    # Security headers
    header {
        # CORS headers
        Access-Control-Allow-Origin "https://manda2.3.85.74.100.nip.io"
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
        Access-Control-Allow-Credentials true
        
        # Security headers
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        X-XSS-Protection "1; mode=block"
        Referrer-Policy strict-origin-when-cross-origin
        
        # CORP headers for static assets
        Cross-Origin-Resource-Policy cross-origin
    }
    
    # Handle API requests
    handle /api/* {
        reverse_proxy localhost:5000 {
            header_up Host {upstream_hostport}
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }
    
    # Handle uploads
    handle /uploads/* {
        reverse_proxy localhost:5000 {
            header_up Host {upstream_hostport}
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }

    # SPA fallback for React Router
    handle {
        try_files {path} /index.html
    }
}

# HTTP to HTTPS redirect
http://manda2.3.85.74.100.nip.io {
    redir https://manda2.3.85.74.100.nip.io{uri} permanent
}

# Development fallback (keep for local testing)
:80 {
    encode zstd gzip
    root * /home/ec2-user/manda2-app/frontend/dist
    file_server
    
    # Security headers
    header {
        # CORS headers
        Access-Control-Allow-Origin "http://3.85.74.100"
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With"
        
        # Security headers
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        X-XSS-Protection "1; mode=block"
        Referrer-Policy strict-origin-when-cross-origin
        
        # CORP headers for static assets
        Cross-Origin-Resource-Policy cross-origin
    }
    
    # Handle API requests
    handle /api/* {
        reverse_proxy localhost:5000 {
            header_up Host {upstream_hostport}
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }
    
    # Handle uploads
    handle /uploads/* {
        reverse_proxy localhost:5000 {
            header_up Host {upstream_hostport}
            header_up X-Real-IP {remote_host}
        }
    }

    # SPA fallback for React Router
    handle {
        try_files {path} /index.html
    }
}
EOF

echo "✅ Fixed Caddyfile"

echo ""
echo "🎉 All merge conflicts resolved!"
echo ""
echo "Next steps:"
echo "  1. Run: npm install"
echo "  2. Run: cd backend && npm install"
echo "  3. Run: cd frontend && npm install"
echo "  4. Run: cd frontend && npm run build"
echo "  5. Run: node test-deployment-status.js"
