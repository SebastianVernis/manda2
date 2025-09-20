#!/bin/bash

# Simple backend restart script for situations where PM2 is running under root
echo "🔄 Restarting YEGA backend..."

# Kill existing node process
pkill -f "node /home/ec2-user/yega-app/backend/server.js" 2>/dev/null || echo "No existing backend process found"

# Wait a moment
sleep 2

# Start backend in background
cd /home/ec2-user/yega-app/backend
nohup node server.js > logs/manual-out.log 2> logs/manual-err.log &

echo "✅ Backend restarted manually"
echo "📊 Check logs with: tail -f backend/logs/manual-*.log"
echo "🔍 Check if running: ps aux | grep 'server.js'"