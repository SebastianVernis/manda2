#!/bin/bash

# ============================================
# YEGA - Script de Setup Automatizado para EC2
# ============================================
# Este script configura automáticamente un servidor EC2
# con todo lo necesario para correr el backend de YEGA
# ============================================

set -e  # Exit on error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Banner
echo -e "${PURPLE}"
cat << "EOF"
╔═══════════════════════════════════════════╗
║                                           ║
║        YEGA EC2 Setup Script              ║
║        Automated Backend Deployment       ║
║                                           ║
╚═══════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Funciones de utilidad
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_step() {
    echo -e "\n${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}$1${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Verificar que se está ejecutando en Ubuntu/Debian
if [ ! -f /etc/debian_version ]; then
    print_error "Este script está diseñado para Ubuntu/Debian"
    exit 1
fi

# ============================================
# PASO 1: Actualizar Sistema
# ============================================
print_step "PASO 1: Actualizando sistema operativo"

print_info "Actualizando lista de paquetes..."
sudo apt update -qq

print_info "Actualizando paquetes instalados..."
sudo apt upgrade -y -qq

print_success "Sistema actualizado"

# ============================================
# PASO 2: Instalar Node.js
# ============================================
print_step "PASO 2: Instalando Node.js 18 LTS"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_warning "Node.js ya está instalado: $NODE_VERSION"
    read -p "¿Deseas reinstalar? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Saltando instalación de Node.js"
    else
        print_info "Instalando Node.js 18..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt install -y nodejs
        print_success "Node.js instalado: $(node --version)"
    fi
else
    print_info "Instalando Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    print_success "Node.js instalado: $(node --version)"
fi

print_success "npm versión: $(npm --version)"

# ============================================
# PASO 3: Instalar PM2
# ============================================
print_step "PASO 3: Instalando PM2 (Process Manager)"

if command -v pm2 &> /dev/null; then
    print_warning "PM2 ya está instalado: $(pm2 --version)"
else
    print_info "Instalando PM2 globalmente..."
    sudo npm install -g pm2
    print_success "PM2 instalado: $(pm2 --version)"
fi

# ============================================
# PASO 4: Instalar Git
# ============================================
print_step "PASO 4: Instalando Git"

if command -v git &> /dev/null; then
    print_warning "Git ya está instalado: $(git --version)"
else
    print_info "Instalando Git..."
    sudo apt install -y git
    print_success "Git instalado: $(git --version)"
fi

# ============================================
# PASO 5: Instalar Caddy
# ============================================
print_step "PASO 5: Instalando Caddy (Web Server)"

if command -v caddy &> /dev/null; then
    print_warning "Caddy ya está instalado: $(caddy version)"
else
    print_info "Instalando Caddy..."
    sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
    sudo apt update -qq
    sudo apt install -y caddy
    print_success "Caddy instalado: $(caddy version)"
fi

# ============================================
# PASO 6: Configurar Directorio de Aplicación
# ============================================
print_step "PASO 6: Configurando directorio de aplicación"

APP_DIR="$HOME/apps"
YEGA_DIR="$APP_DIR/yega"

if [ -d "$YEGA_DIR" ]; then
    print_warning "El directorio $YEGA_DIR ya existe"
    read -p "¿Deseas eliminarlo y clonar de nuevo? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Eliminando directorio existente..."
        rm -rf "$YEGA_DIR"
    else
        print_info "Usando directorio existente"
    fi
fi

if [ ! -d "$YEGA_DIR" ]; then
    print_info "Creando directorio de aplicaciones..."
    mkdir -p "$APP_DIR"
    
    print_info "Clonando repositorio YEGA..."
    echo -e "${YELLOW}"
    read -p "Ingresa la URL del repositorio (ej: https://github.com/usuario/yega.git): " REPO_URL
    echo -e "${NC}"
    
    if [ -z "$REPO_URL" ]; then
        print_error "URL del repositorio no puede estar vacía"
        exit 1
    fi
    
    cd "$APP_DIR"
    git clone "$REPO_URL" yega
    print_success "Repositorio clonado"
fi

# ============================================
# PASO 7: Instalar Dependencias
# ============================================
print_step "PASO 7: Instalando dependencias del backend"

cd "$YEGA_DIR/backend"
print_info "Instalando dependencias de producción..."
npm install --production --silent

print_success "Dependencias instaladas"

# ============================================
# PASO 8: Configurar Variables de Entorno
# ============================================
print_step "PASO 8: Configurando variables de entorno"

ENV_FILE="$YEGA_DIR/backend/.env"

if [ -f "$ENV_FILE" ]; then
    print_warning "El archivo .env ya existe"
    read -p "¿Deseas reconfigurarlo? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Usando .env existente"
    else
        rm "$ENV_FILE"
    fi
fi

if [ ! -f "$ENV_FILE" ]; then
    print_info "Configurando variables de entorno..."
    echo -e "${YELLOW}"
    
    read -p "MongoDB URI: " MONGODB_URI
    read -p "JWT Secret (mínimo 32 caracteres): " JWT_SECRET
    read -p "Frontend URL (ej: https://tu-app.vercel.app): " FRONTEND_URL
    
    echo -e "${NC}"
    
    cat > "$ENV_FILE" << EOF
# MongoDB
MONGODB_URI=$MONGODB_URI

# JWT
JWT_SECRET=$JWT_SECRET

# Frontend
FRONTEND_URL=$FRONTEND_URL

# Node
NODE_ENV=production

# Port
PORT=5000
EOF
    
    print_success "Variables de entorno configuradas"
fi

# ============================================
# PASO 9: Configurar PM2
# ============================================
print_step "PASO 9: Configurando PM2"

cd "$YEGA_DIR/backend"

# Detener proceso existente si existe
if pm2 list | grep -q "yega-backend"; then
    print_info "Deteniendo proceso existente..."
    pm2 delete yega-backend
fi

print_info "Iniciando aplicación con PM2..."
pm2 start server.js --name yega-backend

print_info "Configurando PM2 para iniciar al arrancar..."
pm2 startup | grep -o 'sudo.*' | bash

pm2 save

print_success "PM2 configurado"

# ============================================
# PASO 10: Configurar Caddy
# ============================================
print_step "PASO 10: Configurando Caddy"

CADDY_FILE="/etc/caddy/Caddyfile"

print_info "¿Tienes un dominio configurado?"
echo "1) No, usar IP pública"
echo "2) Sí, tengo un dominio"
read -p "Selecciona opción (1 o 2): " DOMAIN_OPTION

if [ "$DOMAIN_OPTION" = "2" ]; then
    read -p "Ingresa tu dominio (ej: api.tudominio.com): " DOMAIN
    read -p "Ingresa la URL de tu frontend (ej: https://www.tudominio.com): " FRONTEND_DOMAIN
    
    sudo tee "$CADDY_FILE" > /dev/null << EOF
$DOMAIN {
    reverse_proxy localhost:5000
    
    header {
        Access-Control-Allow-Origin $FRONTEND_DOMAIN
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Content-Type, Authorization"
    }
}
EOF
else
    sudo tee "$CADDY_FILE" > /dev/null << 'EOF'
:80 {
    reverse_proxy localhost:5000
    
    header {
        Access-Control-Allow-Origin *
        Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
        Access-Control-Allow-Headers "Content-Type, Authorization"
    }
}
EOF
fi

print_info "Reiniciando Caddy..."
sudo systemctl restart caddy
sudo systemctl enable caddy

print_success "Caddy configurado"

# ============================================
# PASO 11: Configurar Firewall (Opcional)
# ============================================
print_step "PASO 11: Configurar Firewall (UFW)"

read -p "¿Deseas configurar el firewall UFW? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Configurando UFW..."
    
    sudo ufw allow 22/tcp   # SSH
    sudo ufw allow 80/tcp   # HTTP
    sudo ufw allow 443/tcp  # HTTPS
    
    print_warning "Se habilitará el firewall. Asegúrate de que el puerto 22 (SSH) esté permitido."
    read -p "¿Continuar? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo ufw --force enable
        print_success "Firewall configurado"
    else
        print_info "Firewall no habilitado"
    fi
else
    print_info "Saltando configuración de firewall"
fi

# ============================================
# PASO 12: Verificación Final
# ============================================
print_step "PASO 12: Verificación final"

print_info "Verificando servicios..."

# Verificar PM2
if pm2 list | grep -q "yega-backend.*online"; then
    print_success "PM2: Backend corriendo"
else
    print_error "PM2: Backend no está corriendo"
fi

# Verificar Caddy
if sudo systemctl is-active --quiet caddy; then
    print_success "Caddy: Servicio activo"
else
    print_error "Caddy: Servicio no activo"
fi

# Verificar puerto 5000
if netstat -tuln | grep -q ":5000"; then
    print_success "Puerto 5000: Escuchando"
else
    print_error "Puerto 5000: No está escuchando"
fi

# Test de health check
print_info "Probando endpoint de salud..."
sleep 2
if curl -s http://localhost:5000/api/health > /dev/null; then
    print_success "Health check: OK"
else
    print_warning "Health check: No responde (puede ser normal si no existe el endpoint)"
fi

# ============================================
# RESUMEN FINAL
# ============================================
print_step "✅ INSTALACIÓN COMPLETADA"

echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════╗
║                                           ║
║     🎉 ¡Setup completado exitosamente!   ║
║                                           ║
╚═══════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Obtener IP pública
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 INFORMACIÓN DEL SERVIDOR${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}IP Pública:${NC} $PUBLIC_IP"
echo -e "  ${GREEN}Backend URL:${NC} http://$PUBLIC_IP"
echo -e "  ${GREEN}API Health:${NC} http://$PUBLIC_IP/api/health"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔧 COMANDOS ÚTILES${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${YELLOW}Ver logs:${NC}           pm2 logs yega-backend"
echo -e "  ${YELLOW}Reiniciar backend:${NC}  pm2 restart yega-backend"
echo -e "  ${YELLOW}Estado de PM2:${NC}      pm2 status"
echo -e "  ${YELLOW}Monitoreo:${NC}          pm2 monit"
echo -e "  ${YELLOW}Estado de Caddy:${NC}    sudo systemctl status caddy"
echo -e "  ${YELLOW}Logs de Caddy:${NC}      sudo journalctl -u caddy -f"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📝 PRÓXIMOS PASOS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  1. ${GREEN}Verifica${NC} que el backend responde:"
echo -e "     ${YELLOW}curl http://$PUBLIC_IP/api/health${NC}"
echo ""
echo -e "  2. ${GREEN}Configura${NC} tu frontend en Vercel:"
echo -e "     ${YELLOW}VITE_API_URL=http://$PUBLIC_IP${NC}"
echo ""
echo -e "  3. ${GREEN}Actualiza${NC} CORS en backend si es necesario:"
echo -e "     ${YELLOW}nano $YEGA_DIR/backend/.env${NC}"
echo -e "     ${YELLOW}pm2 restart yega-backend${NC}"
echo ""
echo -e "  4. ${GREEN}Configura${NC} dominio personalizado (opcional)"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
print_info "Para más información, consulta: EC2_DEPLOYMENT_GUIDE.md"
echo ""

# Guardar información en archivo
INFO_FILE="$HOME/yega-deployment-info.txt"
cat > "$INFO_FILE" << EOF
YEGA Deployment Information
===========================
Date: $(date)
Public IP: $PUBLIC_IP
Backend URL: http://$PUBLIC_IP
API Health: http://$PUBLIC_IP/api/health

Application Directory: $YEGA_DIR
Environment File: $ENV_FILE
Caddy Config: $CADDY_FILE

Useful Commands:
- View logs: pm2 logs yega-backend
- Restart: pm2 restart yega-backend
- Status: pm2 status
- Monitor: pm2 monit
EOF

print_success "Información guardada en: $INFO_FILE"

exit 0
