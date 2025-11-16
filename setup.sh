#!/bin/bash

echo "🚀 Supreme Tuning - Quick Setup Script"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create backups directory
echo "📁 Creating backups directory..."
mkdir -p backend/backups

# Copy .env if not exists
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env file..."
    cp .env.example backend/.env
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Review backend/.env and update credentials if needed"
echo "2. Run 'npm run dev' to start both servers"
echo "3. Visit http://localhost:5173 for the calculator"
echo "4. Visit http://localhost:5173/admin/login for admin panel"
echo ""
echo "📚 Admin credentials:"
echo "   Email: admin@supa.com"
echo "   Password: password123"
echo ""
echo "Happy coding! 🚀"
