#!/usr/bin/env bash
# Render build script for fullstack deployment
set -e

# Build frontend
cd ../front_end
npm install
npm run build:prod

# Move build to backend (if not already served from correct path)
# Uncomment if needed:
# cp -r dist ../back_end/

# Go back to backend and install dependencies
cd ../back_end
npm install --production

echo "Build complete. Ready for Render deployment." 