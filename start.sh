#!/bin/bash

# Mission Control Dashboard Startup Script
# Starts the REST API and WebSocket server

echo "🚀 Starting Mission Control Dashboard..."

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if database exists
if [ ! -f "mission_control.db" ]; then
    echo "📊 Database not found. Initializing database..."
    if [ -f "initDatabase.js" ]; then
        node initDatabase.js
        if [ $? -ne 0 ]; then
            echo "❌ Failed to initialize database"
            exit 1
        fi
    else
        echo "❌ initDatabase.js not found"
        exit 1
    fi
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Start the server
echo "🌐 Starting server on port 3000..."
echo "   REST API: http://localhost:3000/api"
echo "   WebSocket: ws://localhost:3000"
echo "   Press Ctrl+C to stop"

node server.js