#!/bin/bash
set -e

SERVER_FILE="/var/www/manda2/backend/server.js"

echo "--- Commenting out the test route in server.js ---"
sudo sed -i "/,/ s/^/\/\/\//g" "$SERVER_FILE"

echo "--- Restarting the application ---"
pm2 reload manda2

echo "Done."

