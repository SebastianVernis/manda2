#!/bin/bash

# Manda2 App Build Script
# Usage: ./build.sh [development|production]

set -e  # Exit on any error

# Configuration
NODE_ENV=${1:-production}
ROOT_DIR="/home/ec2-user/manda2-app"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
LOG_DIR="$ROOT_DIR/logs"

echo "🚀 Starting Manda2 App build process..."
echo "Environment: $NODE_ENV"
echo "Root directory: $ROOT_DIR"

# Create logs directory
mkdir -p "$LOG_DIR"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check dependencies
echo "📋 Checking dependencies..."
if ! command_exists node; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ Node.js $(node --version) and npm $(npm --version) found"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install --production=false

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install --production=false

# Build frontend
echo "🏗️  Building frontend..."
if [ "$NODE_ENV" = "production" ]; then
    NODE_ENV=production npm run build
else
    npm run build
fi

echo "✅ Frontend build completed"

# Create necessary directories for logs
mkdir -p "$BACKEND_DIR/logs"
mkdir -p "$FRONTEND_DIR/logs"

# Set permissions
echo "🔒 Setting permissions..."
chmod +x "$ROOT_DIR"/*.sh 2>/dev/null || true

echo "🎉 Build completed successfully!"
echo "📁 Frontend files: $FRONTEND_DIR/dist"
echo "🖥️  Backend files: $BACKEND_DIR"

# Display next steps
echo ""
echo "Next steps:"
echo "1. Configure your web server (Caddy or Nginx)"
echo "2. Start services with: pm2 start ecosystem.config.js"
echo "3. Check status with: pm2 status"
echo "4. View logs with: pm2 logs"