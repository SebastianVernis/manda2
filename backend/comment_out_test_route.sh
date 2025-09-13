#!/bin/bash
set -e

SERVER_FILE="/var/www/yega/backend/server.js"

echo "--- Commenting out the test route in server.js ---"
sudo sed -i "/,/ s/^/\/\/\//g" "$SERVER_FILE"

echo "--- Restarting the application ---"
pm2 reload yega

echo "Done."

