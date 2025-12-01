#!/bin/bash
set -e

FRONTEND_DIR="/home/ec2-user/manda2-backup/frontend"
DEPLOY_FRONTEND_DIR="/var/www/manda2/frontend"

echo "--- Rebuilding the frontend application ---"



echo "Installing dependencies..."
cd "$FRONTEND_DIR"
sudo npm install

echo "Building the frontend..."
sudo npm run build

echo "--- Frontend rebuild complete ---"

echo "Restarting the manda2 application..."
pm2 restart manda2

echo "Done."