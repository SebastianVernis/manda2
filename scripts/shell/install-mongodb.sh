#!/bin/bash

# MongoDB Installation Script for Amazon Linux 2023
# Run this script with: chmod +x install-mongodb.sh && ./install-mongodb.sh

set -e

echo "🚀 Installing MongoDB on Amazon Linux 2023..."

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "❌ This script must be run as root (use sudo)"
   exit 1
fi

# Update system
echo "📦 Updating system packages..."
dnf update -y

# Create MongoDB repository file
echo "📝 Creating MongoDB repository..."
cat > /etc/yum.repos.d/mongodb-org-7.0.repo << 'EOF'
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2023/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://pgp.mongodb.com/server-7.0.asc
EOF

# Install MongoDB
echo "📦 Installing MongoDB..."
dnf install -y mongodb-org

# Create MongoDB directories
echo "📁 Creating MongoDB directories..."
mkdir -p /var/lib/mongo
mkdir -p /var/log/mongodb
chown -R mongod:mongod /var/lib/mongo
chown -R mongod:mongod /var/log/mongodb

# Create MongoDB configuration
echo "⚙️ Creating MongoDB configuration..."
cat > /etc/mongod.conf << 'EOF'
# mongod.conf

# for documentation of all options, see:
#   http://docs.mongodb.org/manual/reference/configuration-options/

# Where to store data.
storage:
  dbPath: /var/lib/mongo
  journal:
    enabled: true

# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

# network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1

# Process management
processManagement:
  fork: true
  pidFilePath: /var/run/mongodb/mongod.pid

# Security
security:
  authorization: disabled

# Operation profiling
operationProfiling:
  slowOpThresholdMs: 100

# Replication
# replSetName: rs0

# Sharding
# sharding:
#   clusterRole: configsvr
EOF

# Enable and start MongoDB
echo "🔄 Enabling and starting MongoDB service..."
systemctl enable mongod
systemctl start mongod

# Wait for MongoDB to start
echo "⏳ Waiting for MongoDB to start..."
sleep 5

# Check MongoDB status
if systemctl is-active --quiet mongod; then
    echo "✅ MongoDB installed and started successfully!"
    echo "📊 MongoDB status:"
    systemctl status mongod --no-pager -l
else
    echo "❌ MongoDB failed to start. Checking logs..."
    journalctl -u mongod --no-pager -l
    exit 1
fi

# Create YEGA database and user
echo "🔧 Setting up YEGA database..."
mongosh --eval '
use yega;
db.createCollection("usuarios");
db.createCollection("productos");
db.createCollection("pedidos");
db.createCollection("tiendas");

// Create indexes for better performance
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.usuarios.createIndex({ telefono: 1 });
db.usuarios.createIndex({ rol: 1 });

db.productos.createIndex({ tienda: 1 });
db.productos.createIndex({ categoria: 1 });
db.productos.createIndex({ activo: 1 });

db.pedidos.createIndex({ cliente: 1 });
db.pedidos.createIndex({ tienda: 1 });
db.pedidos.createIndex({ repartidor: 1 });
db.pedidos.createIndex({ estado: 1 });
db.pedidos.createIndex({ fecha: -1 });

print("✅ YEGA database and collections created successfully!");
'

echo ""
echo "🎉 MongoDB installation completed!"
echo ""
echo "📋 MongoDB Information:"
echo "   Port: 27017"
echo "   Data directory: /var/lib/mongo"
echo "   Log file: /var/log/mongodb/mongod.log"
echo "   Configuration: /etc/mongod.conf"
echo ""
echo "📊 Useful commands:"
echo "   Check status: sudo systemctl status mongod"
echo "   Start: sudo systemctl start mongod"
echo "   Stop: sudo systemctl stop mongod"
echo "   Restart: sudo systemctl restart mongod"
echo "   Connect: mongosh"
echo ""
echo "🔗 Connection URI for YEGA app:"
echo "   MONGODB_URI=mongodb://localhost:27017/yega"