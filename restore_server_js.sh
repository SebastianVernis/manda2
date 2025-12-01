#!/bin/bash
set -e

echo "--- Restoring the correct server.js file ---"
sudo cp "/home/ec2-user/server.js.correct" "/var/www/manda2/backend/server.js"

echo "--- Restarting the application ---"
pm2 reload manda2

echo "Done."
