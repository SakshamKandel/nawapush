#!/usr/bin/env bash
# Render build script for fullstack deployment
set -e

echo "Starting build process..."

# Function to handle errors
handle_error() {
    echo "Error occurred in build process at line $1"
    exit 1
}

# Set error handler
trap 'handle_error $LINENO' ERR

# Create necessary directories
mkdir -p public/notice_files
chmod 755 public/notice_files

# Install production dependencies
echo "Installing production dependencies..."
npm install --production

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "NODE_ENV=production" > .env
    echo "PORT=10000" >> .env
    echo "MONGODB_URI=${MONGODB_URI}" >> .env
    echo "FRONTEND_URL=${FRONTEND_URL}" >> .env
    echo "JWT_SECRET=${JWT_SECRET}" >> .env
    echo "COOKIE_SECRET=${COOKIE_SECRET}" >> .env
fi

echo "Build complete. Ready for Render deployment." 