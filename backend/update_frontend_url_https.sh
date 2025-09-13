#!/bin/bash
set -e

FRONTEND_DIST_DIR="/var/www/yega/frontend/dist"
OLD_URL_1="http://localhost:5000"
OLD_URL_2="http://18.223.113.254:5000"
NEW_URL="https://yega.18.223.113.254.nip.io"

echo "--- Updating API URL in frontend files to HTTPS ---"

if [ -d "$FRONTEND_DIST_DIR" ]; then
    echo "Searching for JavaScript files in $FRONTEND_DIST_DIR..."
    find "$FRONTEND_DIST_DIR" -type f -name "*.js" | while read -r file; do
        echo "Procesando archivo: $file"
        if grep -q -e "$OLD_URL_1" -e "$OLD_URL_2" "$file"; then
            echo "Old URL found. Replacing with $NEW_URL..."
            sudo sed -i "s|$OLD_URL_1|$NEW_URL|g" "$file"
            sudo sed -i "s|$OLD_URL_2|$NEW_URL|g" "$file"
            echo "Replacement complete."
        else
            echo "Old URL not found. Skipping."
        fi
    done
    echo "--- Frontend URL update complete ---"
    echo "Please clear your browser cache (Ctrl+F5 or Cmd+Shift+R) and try the application again."
else
    echo "Error: Frontend distribution directory $FRONTEND_DIST_DIR not found."
fi
