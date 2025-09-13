#!/bin/bash
set -e

FRONTEND_DIR="/home/ec2-user/yega-backup/frontend"
DEPLOY_FRONTEND_DIR="/var/www/yega/frontend"

echo "--- Rebuilding the frontend application ---"



echo "Installing dependencies..."
cd "$FRONTEND_DIR"
sudo npm install

echo "Building the frontend..."
sudo npm run build

echo "--- Frontend rebuild complete ---"

echo "Restarting the yega application..."
pm2 restart yega

echo "Done."