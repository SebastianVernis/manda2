#!/bin/bash

# Manda2 App Deployment Script
# Usage: ./deploy.sh [--nginx|--caddy] [--domain=example.com] [--ssl]

set -e  # Exit on any error

# Default configuration
WEBSERVER=""
DOMAIN="localhost"
SSL=false
ROOT_DIR="/home/ec2-user/manda2-app"

# Parse arguments
for arg in "$@"; do
    case $arg in
        --nginx)
            WEBSERVER="nginx"
            shift
            ;;
        --caddy)
            WEBSERVER="caddy"
            shift
            ;;
        --domain=*)
            DOMAIN="${arg#*=}"
            shift
            ;;
        --ssl)
            SSL=true
            shift
            ;;
        *)
            echo "Unknown option: $arg"
            echo "Usage: ./deploy.sh [--nginx|--caddy] [--domain=example.com] [--ssl]"
            exit 1
            ;;
    esac
done

echo "🚀 Starting Manda2 App deployment..."
echo "Web server: ${WEBSERVER:-auto-detect}"
echo "Domain: $DOMAIN"
echo "SSL: $SSL"

# Build the application
echo "🏗️  Building application..."
chmod +x build.sh
./build.sh production

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Auto-detect web server if not specified
if [ -z "$WEBSERVER" ]; then
    if command_exists caddy; then
        WEBSERVER="caddy"
        echo "🔍 Auto-detected: Caddy"
    elif command_exists nginx; then
        WEBSERVER="nginx"
        echo "🔍 Auto-detected: Nginx"
    else
        echo "❌ Neither Caddy nor Nginx found. Please install one of them."
        exit 1
    fi
fi

# Configure web server
case $WEBSERVER in
    caddy)
        echo "⚙️  Configuring Caddy..."
        if [ "$DOMAIN" != "localhost" ]; then
            # Update Caddyfile for custom domain
            sed -i "s/:80, localhost:80, 172.31.39.53:80/$DOMAIN/" Caddyfile
            if [ "$SSL" = true ]; then
                sed -i 's/auto_https off/# auto_https off/' Caddyfile
            fi
        fi
        
        # Validate Caddyfile
        if command_exists caddy; then
            echo "🔍 Validating Caddyfile..."
            caddy validate --config Caddyfile
            echo "✅ Caddyfile is valid"
        fi
        ;;
        
    nginx)
        echo "⚙️  Configuring Nginx..."
        NGINX_SITE="/etc/nginx/sites-available/manda2"
        
        # Copy configuration
        if [ -w "/etc/nginx/sites-available" ] 2>/dev/null; then
            sudo cp nginx.conf "$NGINX_SITE"
            
            # Update domain in nginx config
            if [ "$DOMAIN" != "localhost" ]; then
                sudo sed -i "s/server_name localhost 172.31.39.53 _;/server_name $DOMAIN;/" "$NGINX_SITE"
            fi
            
            # Enable site
            sudo ln -sf "$NGINX_SITE" /etc/nginx/sites-enabled/manda2
            
            # Test configuration
            echo "🔍 Testing Nginx configuration..."
            sudo nginx -t
            echo "✅ Nginx configuration is valid"
        else
            echo "⚠️  Cannot write to /etc/nginx/sites-available"
            echo "📋 Please manually copy nginx.conf to /etc/nginx/sites-available/manda2"
            echo "📋 Then run: sudo ln -s /etc/nginx/sites-available/manda2 /etc/nginx/sites-enabled/"
        fi
        ;;
esac

# Check if PM2 is installed
if ! command_exists pm2; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Start/restart services with PM2
echo "🔄 Starting services with PM2..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

# Wait for services to start
sleep 5

# Check service status
echo "📊 Service status:"
pm2 status

# Start web server
case $WEBSERVER in
    caddy)
        echo "🌐 Starting Caddy..."
        if command_exists systemctl; then
            sudo systemctl restart caddy || sudo caddy run --config Caddyfile &
        else
            sudo caddy run --config Caddyfile &
        fi
        ;;
        
    nginx)
        echo "🌐 Starting Nginx..."
        if command_exists systemctl; then
            sudo systemctl restart nginx
        else
            sudo nginx -s reload 2>/dev/null || sudo nginx
        fi
        ;;
esac

# Health check
echo "🏥 Performing health check..."
sleep 3

# Check backend
if curl -f -s http://localhost:5000/api/health >/dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend health check failed"
fi

# Check frontend
if curl -f -s http://localhost:80/ >/dev/null 2>&1; then
    echo "✅ Frontend is accessible"
else
    echo "⚠️  Frontend health check failed"
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📋 Access URLs:"
echo "   Frontend: http://$DOMAIN"
echo "   Backend API: http://$DOMAIN/api"
echo ""
echo "📊 Management commands:"
echo "   Check status: pm2 status"
echo "   View logs: pm2 logs"
echo "   Restart: pm2 restart all"
echo "   Stop: pm2 stop all"
echo ""
if [ "$WEBSERVER" = "caddy" ]; then
    echo "🌐 Caddy commands:"
    echo "   Reload config: sudo caddy reload --config Caddyfile"
    echo "   Check status: sudo systemctl status caddy"
else
    echo "🌐 Nginx commands:"
    echo "   Reload config: sudo nginx -s reload"
    echo "   Check status: sudo systemctl status nginx"
fi