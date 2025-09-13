#!/bin/bash
set -e

# Directorios y rutas
BACKEND_DIR="/var/www/yega/backend"
SERVER_PATH="$BACKEND_DIR/server.js"
SERVER_BAK_PATH="$SERVER_PATH.bak"

echo "--- Iniciando reparación de la aplicación YEGA ---"

# 1. Restaurar server.js desde la copia de seguridad
if [ -f "$SERVER_BAK_PATH" ]; then
    echo "Restaurando $SERVER_PATH desde la copia de seguridad..."
    sudo cp "$SERVER_BAK_PATH" "$SERVER_PATH"
    echo "Restauración completada."
else
    echo "ADVERTENCIA: No se encontró la copia de seguridad $SERVER_BAK_PATH."
fi

# 2. Corregir la configuración de CORS en server.js
# Asegurarse de que el `require` para cors existe
if ! grep -q "const cors = require('cors');" "$SERVER_PATH"; then
    echo "Agregando 'require(\"cors\")' a server.js..."
    sudo sed -i "/const express = require('express');/a const cors = require('cors');" "$SERVER_PATH"
fi

# Eliminar cualquier configuración de cors rota o duplicada
sudo sed -i "/app.use(cors/d" "$SERVER_PATH"

# Agregar la configuración de CORS correcta después de express.json()
echo "Agregando configuración de CORS correcta..."
sudo sed -i "/app.use(express.json());/a app.use(cors({ origin: '*', credentials: true }));" "$SERVER_PATH"

echo "Archivo server.js corregido."

# 3. Reiniciar la aplicación con pm2
echo "Reiniciando la aplicación 'yega' con pm2..."
pm2 restart yega

echo "Esperando 5 segundos para que la aplicación se estabilice..."
sleep 5

# 4. Mostrar el estado final de la aplicación
echo "Estado actual de la aplicación:"
pm2 list

# 5. Obtener y mostrar la IP pública para la whitelist de MongoDB
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "------------------------------------------------------------------"
echo "ACCIÓN REQUERIDA: El siguiente paso es la base de datos."
echo "Copia la siguiente dirección IP y agrégala a la lista blanca (IP Whitelist) de tu clúster de MongoDB Atlas:"
echo ""
echo "IP Pública del Servidor: $PUBLIC_IP"
echo ""
echo "Una vez agregada la IP, la aplicación debería poder conectarse."
echo "------------------------------------------------------------------"
