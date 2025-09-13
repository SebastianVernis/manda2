#!/bin/bash
set -e

FRONTEND_DIST_DIR="/var/www/yega/frontend/dist"
PUBLIC_IP="18.223.113.254"
OLD_URL="http://localhost:5000"
NEW_URL="http://${PUBLIC_IP}:5000"

echo "--- Corrigiendo la URL del API en los archivos del frontend ---"

if [ -d "$FRONTEND_DIST_DIR" ]; then
    echo "Buscando archivos JavaScript en $FRONTEND_DIST_DIR..."
    find "$FRONTEND_DIST_DIR" -type f -name "*.js" | while read -r file; do
        echo "Procesando archivo: $file"
        if grep -q "$OLD_URL" "$file"; then
            echo "URL antigua encontrada. Reemplazando $OLD_URL con $NEW_URL..."
            sudo sed -i "s|$OLD_URL|$NEW_URL|g" "$file"
            echo "Reemplazo completado."
        else
            echo "URL antigua no encontrada. Omitiendo."
        fi
    done
    echo "--- Corrección del frontend completada ---"
    echo "Por favor, limpia la caché de tu navegador (Ctrl+F5 o Cmd+Shift+R) y prueba la aplicación de nuevo."
else
    echo "Error: El directorio de distribución del frontend $FRONTEND_DIST_DIR no fue encontrado."
fi
