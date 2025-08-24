#!/bin/bash

# Strands Chat App Startup Script
echo "🚀 Starting Strands Chat App..."

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Setup signal handlers
trap cleanup SIGINT SIGTERM

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Start backend server
echo "🐍 Starting Python backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

# Start backend in background
python main.py &
BACKEND_PID=$!

echo "✅ Backend started (PID: $BACKEND_PID) - http://localhost:8000"

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "⚛️ Starting Next.js frontend..."
cd ../frontend

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install > /dev/null 2>&1

# Start frontend in background
npm run dev &
FRONTEND_PID=$!

echo "✅ Frontend started (PID: $FRONTEND_PID) - http://localhost:3000"

echo ""
echo "🎉 Strands Chat App is now running!"
echo "📱 Open http://localhost:3000 in your browser"
echo "🔧 API available at http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for processes to complete
wait