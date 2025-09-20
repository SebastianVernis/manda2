#!/bin/bash

# Find Caddy process PID and send reload signal
CADDY_PID=$(ps aux | grep -E "caddy run --config" | grep -v grep | awk '{print $2}' | head -1)

if [ -n "$CADDY_PID" ]; then
    echo "Found Caddy process: $CADDY_PID"
    echo "Sending USR1 signal to reload configuration..."
    kill -USR1 $CADDY_PID 2>/dev/null && echo "✅ Caddy reload signal sent" || echo "❌ Failed to send reload signal"
else
    echo "❌ Caddy process not found"
    echo "Current Caddy processes:"
    ps aux | grep caddy
fi