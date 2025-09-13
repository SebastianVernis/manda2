#!/bin/bash
set -e

echo "--- Applying the final fix to server.js ---"
sudo cp "/home/ec2-user/server.js.final" "/var/www/yega/backend/server.js"

echo "--- Restarting the application ---"
pm2 reload yega

echo "Done."
