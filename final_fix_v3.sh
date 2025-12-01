#!/bin/bash
set -e

echo "--- Fixing server.js and its backup ---"
sudo cp "/home/ec2-user/server.js.correct" "/var/www/manda2/backend/server.js"
sudo cp "/home/ec2-user/server.js.correct" "/var/www/manda2/backend/server.js.bak"

echo "--- Restarting the application ---"
pm2 reload manda2

echo "Done."
