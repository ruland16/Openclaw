#!/bin/bash
# Mission Control Dashboard Startup Script

echo "🚀 Starting Mission Control Dashboard..."
echo "========================================"

# Navigate to dashboard directory
cd /home/user/.openclaw/workspace/dashboard-app

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the dashboard
echo "🖥️  Starting dashboard server..."
echo ""
echo "📊 Dashboard will be available at: http://localhost:3000"
echo "🔌 WebSocket: ws://localhost:3000"
echo "📚 API: http://localhost:3000/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"

# Start the server
node app.js