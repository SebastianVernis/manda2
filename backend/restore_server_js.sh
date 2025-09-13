#!/bin/bash
set -e

echo "--- Restoring the correct server.js file ---"
sudo cp "/home/ec2-user/server.js.correct" "/var/www/yega/backend/server.js"

echo "--- Restarting the application ---"
pm2 reload yega

echo "Done."
